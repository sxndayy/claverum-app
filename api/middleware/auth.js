import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { users } from '../config/users.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Validate JWT secret strength
if (JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters for security');
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.username, 
      role: user.role,
      iat: Math.floor(Date.now() / 1000)
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verify JWT token and return user data
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Authenticate user with username and password
 * Fixed timing attack by always performing bcrypt comparison
 */
export async function authenticateUser(username, password) {
  // Always perform bcrypt comparison to prevent timing attacks
  const dummyHash = '$2b$12$dummy.hash.for.timing.attack.prevention';
  
  const user = users.find(u => u.username === username);
  const hashToCompare = user ? user.passwordHash : dummyHash;
  
  const isValidPassword = await bcrypt.compare(password, hashToCompare);
  
  // Only return user if both user exists AND password is valid
  if (!user || !isValidPassword) {
    return null;
  }
  
  return {
    username: user.username,
    role: user.role
  };
}

/**
 * Middleware to protect admin routes
 * Reads JWT from HttpOnly cookie first, then falls back to Authorization header
 */
export function requireAuth(req, res, next) {
  // Try HttpOnly cookie first, then Authorization header
  let token = req.cookies?.admin_token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  // Check if user is admin
  if (decoded.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }

  req.user = decoded;
  next();
}

/**
 * Middleware for optional authentication (for public endpoints)
 * Reads JWT from HttpOnly cookie first, then falls back to Authorization header
 */
export function optionalAuth(req, res, next) {
  let token = req.cookies?.admin_token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}

/**
 * Generate bcrypt hash for password
 */
export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}
