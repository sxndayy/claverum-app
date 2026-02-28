import express from 'express';
import crypto from 'crypto';
import { query, transaction } from '../db.js';
import { validateOrderSessionToken, generateOrderSessionToken } from '../middleware/orderOwnership.js';
import { requireCSRF, generateCSRFToken } from '../middleware/csrf.js';
import { sanitizeString, isValidUUID, isValidPropertyType, isValidBuildYear, isValidPostalCode, isValidEmail } from '../utils/validation.js';
import { sendUploadLinkEmail } from '../utils/uploadEmail.js';

const router = express.Router();

/**
 * POST /api/auftrag/submit
 * 
 * Validates session, updates order with contact/property data,
 * generates a secure upload token, sends email with upload link.
 * 
 * Header: X-Order-Session: <sessionToken>
 * Body: { orderId, propertyType, buildYear?, customerName, customerEmail, street, postalCode, city }
 * Response: { success: true, uploadToken } or { success: false, error }
 */
router.post('/submit', requireCSRF, async (req, res) => {
  try {
    const {
      orderId,
      propertyType,
      buildYear,
      customerName,
      customerEmail,
      street,
      postalCode,
      city
    } = req.body;

    // --- Validate required fields ---
    if (!orderId || !propertyType || !customerName || !customerEmail || !street || !postalCode || !city) {
      return res.status(400).json({
        success: false,
        error: 'Pflichtfelder fehlen: orderId, propertyType, customerName, customerEmail, street, postalCode, city'
      });
    }

    if (!isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Ungültiges orderId-Format'
      });
    }

    if (!isValidPropertyType(propertyType)) {
      return res.status(400).json({
        success: false,
        error: 'Ungültiger Objekttyp'
      });
    }

    if (buildYear && !isValidBuildYear(Number(buildYear))) {
      return res.status(400).json({
        success: false,
        error: 'Ungültiges Baujahr'
      });
    }

    if (!isValidEmail(customerEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Ungültige E-Mail-Adresse'
      });
    }

    if (!isValidPostalCode(postalCode)) {
      return res.status(400).json({
        success: false,
        error: 'Ungültige Postleitzahl (5 Ziffern erwartet)'
      });
    }

    // --- Validate session token ---
    const rawToken = req.get('X-Order-Session') || req.headers['x-order-session'];
    const sessionToken = typeof rawToken === 'string' ? rawToken.trim() : '';

    if (!sessionToken || sessionToken === 'undefined' || sessionToken === 'null') {
      return res.status(401).json({
        success: false,
        error: 'Order session token required'
      });
    }

    const validOrderId = await validateOrderSessionToken(sessionToken);

    if (!validOrderId || String(validOrderId) !== String(orderId)) {
      return res.status(403).json({
        success: false,
        error: 'Ungültiger oder abgelaufener Session-Token'
      });
    }

    // --- Sanitize inputs ---
    const sanitizedName = sanitizeString(customerName, 255);
    const sanitizedEmail = sanitizeString(customerEmail, 255);
    const sanitizedStreet = sanitizeString(street, 255);
    const sanitizedCity = sanitizeString(city, 100);
    const sanitizedBuildYear = buildYear ? sanitizeString(String(buildYear), 4) : null;

    // --- Generate upload token ---
    const uploadToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // --- Update order + insert upload token in one transaction ---
    await transaction(async (client) => {
      // Update order with contact data + status
      await client.query(
        `UPDATE orders 
         SET customer_name = $1,
             customer_email = $2,
             street = $3,
             postal_code = $4,
             city = $5,
             property_type = $6,
             build_year = $7,
             status = 'submitted'
         WHERE id = $8`,
        [
          sanitizedName,
          sanitizedEmail,
          sanitizedStreet,
          postalCode,
          sanitizedCity,
          propertyType,
          sanitizedBuildYear,
          orderId
        ]
      );

      // Insert upload token
      await client.query(
        `INSERT INTO upload_tokens (order_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [orderId, uploadToken, expiresAt]
      );
    });

    // --- Send email (outside transaction — DB is already committed) ---
    const resendClient = req.app.get('resend');
    if (resendClient) {
      try {
        await sendUploadLinkEmail({
          resendClient,
          customerEmail: sanitizedEmail,
          customerName: sanitizedName,
          propertyType,
          buildYear: sanitizedBuildYear,
          street: sanitizedStreet,
          postalCode,
          city: sanitizedCity,
          uploadToken
        });
      } catch (emailError) {
        // Log but don't fail the request — order is already saved
        console.error('Failed to send upload link email:', emailError);
      }
    } else {
      console.warn('⚠️ Resend not configured — upload link email NOT sent');
    }

    res.json({
      success: true,
      uploadToken
    });

  } catch (error) {
    console.error('Error in /api/auftrag/submit:', error);
    res.status(500).json({
      success: false,
      error: 'Auftrag konnte nicht gespeichert werden'
    });
  }
});

/**
 * POST /api/auftrag/upload-session
 * 
 * Exchanges a one-time upload token (from email link) for a session token
 * that is compatible with the existing X-Order-Session auth system.
 * 
 * Body: { token: "<uploadToken>" }
 * Response: { success: true, orderId, sessionToken } or { success: false, error }
 */
router.post('/upload-session', requireCSRF, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Token ist erforderlich'
      });
    }

    // --- Look up token ---
    const result = await query(
      `SELECT id, order_id, expires_at, used_at
       FROM upload_tokens
       WHERE token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Token ungültig oder abgelaufen'
      });
    }

    const uploadTokenRow = result.rows[0];

    // Check if already used
    if (uploadTokenRow.used_at) {
      // Token was already used — but we still allow re-use within validity period
      // to support page reloads. We'll just generate a new session token.
      if (new Date() > new Date(uploadTokenRow.expires_at)) {
        return res.status(410).json({
          success: false,
          error: 'Token ungültig oder abgelaufen'
        });
      }
    }

    // Check expiry
    if (new Date() > new Date(uploadTokenRow.expires_at)) {
      return res.status(410).json({
        success: false,
        error: 'Token ungültig oder abgelaufen'
      });
    }

    const orderId = uploadTokenRow.order_id;

    // --- Mark token as used (first use) ---
    if (!uploadTokenRow.used_at) {
      await query(
        'UPDATE upload_tokens SET used_at = NOW() WHERE id = $1',
        [uploadTokenRow.id]
      );
    }

    // --- Generate a new session token compatible with order_sessions system ---
    const sessionToken = await generateOrderSessionToken(orderId);

    // Generate CSRF token tied to the new session token
    const csrfToken = generateCSRFToken(sessionToken);
    res.setHeader('X-CSRF-Token', csrfToken);

    res.json({
      success: true,
      orderId,
      sessionToken
    });

  } catch (error) {
    console.error('Error in /api/auftrag/upload-session:', error);
    res.status(500).json({
      success: false,
      error: 'Session konnte nicht erstellt werden'
    });
  }
});

export default router;
