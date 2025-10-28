import crypto from 'crypto';
import { query } from '../db.js';

/**
 * Database-backed order ownership validation
 * Each order gets a unique session token that persists across deployments
 */

/**
 * Generate a secure session token for an order
 */
export async function generateOrderSessionToken(orderId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
  
  try {
    // Insert session token into database
    await query(
      'INSERT INTO order_sessions (session_token, order_id, expires_at) VALUES ($1, $2, $3)',
      [token, orderId, expiresAt]
    );
    
    // Clean up expired sessions periodically
    await cleanupExpiredSessions();
    
    return token;
  } catch (error) {
    console.error('Error creating order session token:', error);
    throw new Error('Failed to create session token');
  }
}

/**
 * Validate order session token and return order ID
 */
export async function validateOrderSessionToken(token) {
  if (!token) return null;
  
  try {
    const result = await query(
      'SELECT order_id, expires_at FROM order_sessions WHERE session_token = $1',
      [token]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const session = result.rows[0];
    
    // Check if expired
    if (new Date() > new Date(session.expires_at)) {
      // Clean up expired token
      await query(
        'DELETE FROM order_sessions WHERE session_token = $1',
        [token]
      );
      return null;
    }
    
    // Update last_used_at
    await query(
      'UPDATE order_sessions SET last_used_at = NOW() WHERE session_token = $1',
      [token]
    );
    
    return session.order_id;
  } catch (error) {
    console.error('Error validating order session token:', error);
    return null;
  }
}

/**
 * Clean up expired tokens
 */
async function cleanupExpiredSessions() {
  try {
    const result = await query(
      'DELETE FROM order_sessions WHERE expires_at < NOW()'
    );
    console.log(`Cleaned up ${result.rowCount} expired session tokens`);
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

/**
 * Middleware to validate order ownership
 */
export function requireOrderOwnership(req, res, next) {
  // Allow CORS preflight to pass through
  if (req.method === 'OPTIONS') {
    return next();
  }

  // Accept orderId from params, query or body
  const rawOrderId = (req.params && req.params.orderId)
    || (req.query && req.query.orderId)
    || (req.body && req.body.orderId);

  if (!rawOrderId) {
    return res.status(400).json({
      success: false,
      error: 'orderId required'
    });
  }

  const orderId = String(rawOrderId);

  // Read header robustly
  const sessionToken = req.get('X-Order-Session') || req.headers['x-order-session'] || req.body.sessionToken;
  
  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      error: 'Order session token required'
    });
  }
  
  // Use async validation
  validateOrderSessionToken(sessionToken)
    .then(validOrderId => {
      if (!validOrderId || String(validOrderId) !== orderId) {
        return res.status(403).json({
          success: false,
          error: 'Invalid or expired order session'
        });
      }
      
      req.orderId = orderId;
      next();
    })
    .catch(error => {
      console.error('Error in order ownership validation:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    });
}

/**
 * Get order session token for an order (for testing/admin purposes)
 */
export async function getOrderSessionToken(orderId) {
  try {
    const result = await query(
      'SELECT session_token FROM order_sessions WHERE order_id = $1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );
    
    return result.rows.length > 0 ? result.rows[0].session_token : null;
  } catch (error) {
    console.error('Error getting order session token:', error);
    return null;
  }
}
