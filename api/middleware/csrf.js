import crypto from 'crypto';

/**
 * CSRF Protection Middleware
 *
 * Two-tier protection:
 * 1. Full token validation — for authenticated requests (admin JWT or order session)
 *    Token is generated server-side, stored in memory, and validated on each request.
 * 2. Custom header check — for unauthenticated/bootstrap requests (create-order, contact, etc.)
 *    Browsers cannot set custom headers on cross-origin requests without CORS preflight,
 *    so requiring the X-CSRF-Token header (any non-empty value) is effective CSRF protection.
 */

// In-memory store for CSRF tokens (in production, use Redis)
const csrfTokens = new Map();

/**
 * Generate a CSRF token for a given identity (admin userId or session token)
 */
export function generateCSRFToken(identity) {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(token, {
    identity,
    createdAt: Date.now(),
    expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
  });

  // Clean up expired tokens periodically
  cleanupExpiredTokens();

  return token;
}

/**
 * Validate CSRF token against an identity
 */
export function validateCSRFToken(token, identity) {
  if (!token || !identity) return false;

  const tokenData = csrfTokens.get(token);
  if (!tokenData) return false;

  // Check if expired
  if (Date.now() > tokenData.expiresAt) {
    csrfTokens.delete(token);
    return false;
  }

  // Check if token belongs to the identity
  if (tokenData.identity !== identity) return false;

  return true;
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    }
  }
}

/**
 * Middleware to require CSRF protection on state-changing operations.
 *
 * - For authenticated requests (req.user or req.csrfIdentity): full token validation
 * - For unauthenticated requests: custom header presence check
 */
export function requireCSRF(req, res, next) {
  // Only apply to state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for login (bootstrap — no prior token exists)
  if (req.path === '/api/auth/login' || req.path === '/login') {
    return next();
  }

  const token = req.headers['x-csrf-token'];

  // Determine identity: admin userId or order session token
  const identity = req.user?.userId || req.user?.id || req.csrfIdentity;

  if (identity) {
    // Full token validation for authenticated requests
    if (!validateCSRFToken(token, identity)) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or missing CSRF token'
      });
    }
  } else {
    // Custom header presence check for unauthenticated/bootstrap requests
    // Browsers cannot set custom headers cross-origin without CORS preflight
    if (!token || !token.trim()) {
      return res.status(403).json({
        success: false,
        error: 'CSRF token header required'
      });
    }
  }

  next();
}

/**
 * Middleware to generate CSRF token for authenticated users and order sessions.
 * Sets X-CSRF-Token response header.
 */
export function generateCSRFForUser(req, res, next) {
  const identity = req.user?.userId || req.user?.id || req.csrfIdentity;
  if (identity) {
    const token = generateCSRFToken(identity);
    res.setHeader('X-CSRF-Token', token);
  }
  next();
}
