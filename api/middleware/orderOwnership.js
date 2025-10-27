import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * JWT-based order ownership validation
 * Each order gets a JWT token that contains the order ID and expiry
 */

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

/**
 * Generate a JWT session token for an order
 */
export function generateOrderSessionToken(orderId) {
  const payload = {
    orderId,
    type: 'order_session',
    iat: Math.floor(Date.now() / 1000)
  };
  
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '24h' 
  });
}

/**
 * Validate JWT session token and return order ID
 */
export function validateOrderSessionToken(token) {
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.orderId;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Middleware to validate order ownership
 */
export function requireOrderOwnership(req, res, next) {
  const sessionToken = req.headers['x-order-session'];
  
  if (!sessionToken) {
    return res.status(401).json({
      success: false,
      error: 'Order session token required'
    });
  }
  
  // Extract orderId from multiple possible sources
  const orderId = req.params.orderId || req.query.orderId || req.body.orderId;
  
  if (!orderId) {
    return res.status(400).json({
      success: false,
      error: 'Order ID missing in request'
    });
  }
  
  const validOrderId = validateOrderSessionToken(sessionToken);
  
  if (!validOrderId) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired order session'
    });
  }
  
  if (validOrderId !== orderId) {
    return res.status(403).json({
      success: false,
      error: 'Order session mismatch'
    });
  }
  
  req.orderId = orderId;
  next();
}
