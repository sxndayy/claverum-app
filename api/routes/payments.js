import express from 'express';
import Stripe from 'stripe';
import { query } from '../db.js';
import { requireOrderOwnership } from '../middleware/orderOwnership.js';
import { isValidUUID } from '../utils/validation.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Per-order rate limiting: 3 requests per minute per order ID
const orderCheckoutAttempts = new Map();
const ORDER_RATE_LIMIT = 3;
const ORDER_RATE_WINDOW = 60 * 1000; // 1 minute

function checkOrderRateLimit(orderId) {
  const now = Date.now();
  const attempts = orderCheckoutAttempts.get(orderId) || [];

  // Remove expired entries
  const valid = attempts.filter(ts => now - ts < ORDER_RATE_WINDOW);
  orderCheckoutAttempts.set(orderId, valid);

  if (valid.length >= ORDER_RATE_LIMIT) {
    return false;
  }

  valid.push(now);
  orderCheckoutAttempts.set(orderId, valid);
  return true;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [orderId, attempts] of orderCheckoutAttempts.entries()) {
    const valid = attempts.filter(ts => now - ts < ORDER_RATE_WINDOW);
    if (valid.length === 0) {
      orderCheckoutAttempts.delete(orderId);
    } else {
      orderCheckoutAttempts.set(orderId, valid);
    }
  }
}, 5 * 60 * 1000);

// Price ID mapping from environment variables
const PRICE_MAP = {
  analyse: process.env.STRIPE_PRICE_ANALYSE,
  intensiv: process.env.STRIPE_PRICE_INTENSIV
};

/**
 * POST /api/payments/create-checkout-session
 * Create Stripe Checkout Session for order payment
 * Headers: X-Order-Session: <sessionToken>
 * Body: { orderId, productType: 'analyse' | 'intensiv' }
 */
router.post('/create-checkout-session', requireOrderOwnership, async (req, res) => {
  try {
    const { orderId, productType = 'analyse' } = req.body;

    // Validate orderId
    if (!orderId || !isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Valid orderId required'
      });
    }

    // Validate productType
    if (!['analyse', 'intensiv'].includes(productType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid productType. Must be "analyse" or "intensiv".'
      });
    }

    // Per-order rate limiting
    if (!checkOrderRateLimit(orderId)) {
      res.set('Retry-After', '60');
      return res.status(429).json({
        success: false,
        error: 'rate_limit'
      });
    }

    // Get price ID for product type
    const priceId = PRICE_MAP[productType];
    if (!priceId) {
      console.error(`Missing Stripe price ID for product type: ${productType}`);
      return res.status(500).json({
        success: false,
        error: 'Payment configuration error'
      });
    }

    // Load order data
    const orderResult = await query(
      'SELECT id, customer_email, email, stripe_checkout_session_id, paid FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Check if already paid
    if (order.paid) {
      return res.status(400).json({
        success: false,
        error: 'Order already paid'
      });
    }

    // Check if checkout session already exists and is still valid
    if (order.stripe_checkout_session_id) {
      try {
        const existingSession = await stripe.checkout.sessions.retrieve(order.stripe_checkout_session_id);
        if (existingSession.status === 'open') {
          return res.json({
            success: true,
            url: existingSession.url
          });
        }
      } catch (err) {
        // Session expired or invalid, create new one
        console.log('Previous session expired, creating new one');
      }
    }

    // Get session token from header (used in metadata for webhook)
    const sessionToken = req.headers['x-order-session'] || '';

    // Load upload token for cancel_url
    let uploadToken = '';
    try {
      const tokenResult = await query(
        'SELECT token FROM upload_tokens WHERE order_id = $1 AND expires_at > NOW() AND used_at IS NULL ORDER BY created_at DESC LIMIT 1',
        [orderId]
      );
      if (tokenResult.rows.length > 0) {
        uploadToken = tokenResult.rows[0].token;
      }
    } catch (err) {
      console.warn('Could not load upload token for cancel URL:', err.message);
    }

    // Determine customer email
    const customerEmail = order.customer_email || order.email || undefined;

    // Build cancel URL
    const cancelUrl = uploadToken
      ? `https://bauklar.org/upload/?token=${uploadToken}&cancelled=true`
      : 'https://bauklar.org/upload/?cancelled=true';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: 'https://bauklar.org/success/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        order_id: orderId,
        product_type: productType,
        session_token: sessionToken
      },
      payment_intent_data: {
        metadata: {
          order_id: orderId,
          product_type: productType
        }
      }
    });

    // Save product_type and stripe_checkout_session_id to order
    await query(
      'UPDATE orders SET product_type = $1, stripe_checkout_session_id = $2 WHERE id = $3',
      [productType, session.id, orderId]
    );

    console.log(`Created checkout session ${session.id} for order ${orderId} (product: ${productType})`);

    res.json({
      success: true,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
});

/**
 * GET /api/payments/session
 * Retrieve Stripe Checkout Session details (for success page)
 * Query: ?session_id=cs_xxx
 */
router.get('/session', async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id || !session_id.startsWith('cs_')) {
      return res.status(400).json({
        success: false,
        error: 'Valid session_id required'
      });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.json({
      success: true,
      session: {
        amount_total: session.amount_total,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email || session.customer_email,
        metadata: {
          order_id: session.metadata?.order_id || session.metadata?.orderId,
          product_type: session.metadata?.product_type
        }
      }
    });

  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session'
    });
  }
});

export default router;
