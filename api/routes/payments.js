import express from 'express';
import Stripe from 'stripe';
import { query } from '../db.js';
import { requireOrderOwnership } from '../middleware/orderOwnership.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';
import { isValidUUID } from '../utils/validation.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/create-checkout-session
 * Create Stripe Checkout Session for order payment
 */
router.post('/create-checkout-session', paymentLimiter, requireOrderOwnership, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Validate orderId
    if (!orderId || !isValidUUID(orderId)) {
      return res.status(400).json({
        success: false,
        error: 'Valid orderId required'
      });
    }

    // Check if order exists
    const orderResult = await query(
      'SELECT id, stripe_checkout_session_id, paid FROM orders WHERE id = $1',
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

    // Get frontend URL from environment
    const frontendUrl = process.env.FRONTEND_URL || 'https://test-johannes.netlify.app';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }],
      // Collect customer information (email and name)
      // billing_address_collection: 'required' forces Stripe to collect billing address (including name)
      // This should always show the name field, not just when coupon is entered
      billing_address_collection: 'required', // Require billing address (includes name field)
      // Don't set customer_email - let Stripe collect it (this ensures name field is shown)
      metadata: {
        orderId: orderId
      },
      allow_promotion_codes: true, // Aktiviert Coupon-Feld im Checkout
      success_url: `${frontendUrl}/evaluation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/evaluation`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
    });

    // Save checkout session ID to database
    await query(
      'UPDATE orders SET stripe_checkout_session_id = $1 WHERE id = $2',
      [session.id, orderId]
    );

    console.log(`Created checkout session ${session.id} for order ${orderId}`);

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
 * Retrieve Stripe Checkout Session details
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
      orderId: session.metadata?.orderId,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email
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
