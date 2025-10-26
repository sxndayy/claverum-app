import crypto from 'crypto';

/**
 * CSRF Protection Middleware
 * Generates and validates CSRF tokens for state-changing operations
 */

// In-memory store for CSRF tokens (in production, use Redis)
const csrfTokens = new Map();

/**
 * Generate a CSRF token for a user session
 */
export function generateCSRFToken(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(token, {
    userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
  });
  
  // Clean up expired tokens
  cleanupExpiredTokens();
  
  return token;
}

/**
 * Validate CSRF token
 */
export function validateCSRFToken(token, userId) {
  if (!token || !userId) return false;
  
  const tokenData = csrfTokens.get(token);
  if (!tokenData) return false;
  
  // Check if expired
  if (Date.now() > tokenData.expiresAt) {
    csrfTokens.delete(token);
    return false;
  }
  
  // Check if token belongs to user
  if (tokenData.userId !== userId) return false;
  
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
 * Middleware to require CSRF token for state-changing operations
 */
export function requireCSRF(req, res, next) {
  // Only apply to state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next();
  }
  
  // Skip CSRF for login (circular dependency)
  if (req.path === '/api/auth/login') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body.csrfToken;
  const userId = req.user?.userId || req.user?.id; // Support both formats
  
  if (!validateCSRFToken(token, userId)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or missing CSRF token'
    });
  }
  
  next();
}

/**
 * Middleware to generate CSRF token for authenticated users
 */
export function generateCSRFForUser(req, res, next) {
  if (req.user?.userId || req.user?.id) {
    const userId = req.user.userId || req.user.id;
    const token = generateCSRFToken(userId);
    res.setHeader('X-CSRF-Token', token);
  }
  next();
}
