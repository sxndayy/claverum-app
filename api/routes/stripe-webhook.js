import express from 'express';
import Stripe from 'stripe';
import { query } from '../db.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * POST /api/stripe/webhook
 * Stripe webhook endpoint for payment events
 * Must use raw body (express.raw()) to verify signature
 * 
 * Note: CORS is handled by server.js, but webhooks come from Stripe servers
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig || !webhookSecret) {
    console.error('Missing stripe-signature header or webhook secret');
    return res.status(400).json({ error: 'Missing signature' });
  }

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Log all events for debugging
  console.log(`Received Stripe webhook event: ${event.type} (id: ${event.id})`);

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const paymentIntentId = session.payment_intent;

    if (!orderId) {
      console.error('Missing orderId in checkout session metadata');
      return res.status(400).json({ error: 'Missing orderId' });
    }

    try {
      // Verify order exists
      const orderResult = await query('SELECT id FROM orders WHERE id = $1', [orderId]);
      
      if (orderResult.rows.length === 0) {
        console.error(`Order not found: ${orderId}`);
        return res.status(404).json({ error: 'Order not found' });
      }

      // Update order with payment status
      await query(
        `UPDATE orders 
         SET paid = true, 
             paid_at = NOW(), 
             payment_status = $1,
             stripe_payment_intent_id = $2,
             payment_amount = $3,
             email = COALESCE($4, email)
         WHERE id = $5`,
        [
          session.payment_status || 'paid',
          paymentIntentId,
          session.amount_total, // Amount in cents
          session.customer_details?.email,
          orderId
        ]
      );

      console.log(`✅ Order ${orderId} marked as paid (Payment Intent: ${paymentIntentId})`);
    } catch (error) {
      console.error('Error updating order payment status:', error);
      return res.status(500).json({ error: 'Failed to update order' });
    }
  }

  // Handle other events (optional)
  if (event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    
    if (orderId) {
      try {
        await query(
          `UPDATE orders 
           SET paid = true, 
               paid_at = NOW(), 
               payment_status = 'paid'
           WHERE id = $1`,
          [orderId]
        );
        console.log(`✅ Order ${orderId} marked as paid (async payment succeeded)`);
      } catch (error) {
        console.error('Error updating order payment status:', error);
      }
    }
  }

  // Acknowledge receipt of event
  res.json({ received: true });
});

export default router;