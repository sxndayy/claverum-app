import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for public endpoints
 * 100 requests per 15 minutes per IP
 */
export const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for login endpoint
 * 5 attempts per 15 minutes per IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for admin endpoints
 * 500 requests per 15 minutes per user
 */
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window
  message: {
    success: false,
    error: 'Rate limit exceeded for admin operations.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for upload endpoints
 * 50 requests per 15 minutes per IP
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 upload requests per window
  message: {
    success: false,
    error: 'Too many upload requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for order creation
 * 10 orders per hour per IP
 */
export const orderCreationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 orders per hour
  message: {
    success: false,
    error: 'Too many orders created, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for payment endpoints
 * 10 payment requests per hour per IP
 */
export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    success: false,
    error: 'Too many payment requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for contact form
 * 5 messages per hour per IP to prevent spam
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 messages per hour
  message: {
    success: false,
    error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
