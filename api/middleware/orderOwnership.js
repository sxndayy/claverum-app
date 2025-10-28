import crypto from 'crypto';

/**
 * Session-based order ownership validation
 * Each order gets a unique session token that must be provided for modifications
 */

// In-memory store for order sessions (in production, use Redis)
const orderSessions = new Map();

/**
 * Generate a secure session token for an order
 */
export function generateOrderSessionToken(orderId) {
  const token = crypto.randomBytes(32).toString('hex');
  orderSessions.set(token, {
    orderId,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  });
  
  // Clean up expired tokens
  cleanupExpiredTokens();
  
  return token;
}

/**
 * Validate order session token and return order ID
 */
export function validateOrderSessionToken(token) {
  if (!token) return null;
  
  const session = orderSessions.get(token);
  if (!session) return null;
  
  // Check if expired
  if (Date.now() > session.expiresAt) {
    orderSessions.delete(token);
    return null;
  }
  
  return session.orderId;
}

/**
 * Clean up expired tokens
 */
function cleanupExpiredTokens() {
  const now = Date.now();
  for (const [token, session] of orderSessions.entries()) {
    if (now > session.expiresAt) {
      orderSessions.delete(token);
    }
  }
}

/**
 * Middleware to validate order ownership
 */
export function requireOrderOwnership(req, res, next) {
  const { orderId } = req.params;
  const sessionToken = req.headers['x-order-session'] || req.body.sessionToken;
  
  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      error: 'Order session token required'
    });
  }
  
  const validOrderId = validateOrderSessionToken(sessionToken);
  
  if (!validOrderId || validOrderId !== orderId) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired order session'
    });
  }
  
  req.orderId = orderId;
  next();
}

/**
 * Get order session token for an order (for testing/admin purposes)
 */
export function getOrderSessionToken(orderId) {
  for (const [token, session] of orderSessions.entries()) {
    if (session.orderId === orderId && Date.now() <= session.expiresAt) {
      return token;
    }
  }
  return null;
}
