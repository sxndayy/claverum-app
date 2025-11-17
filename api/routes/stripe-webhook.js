import express from 'express';
import Stripe from 'stripe';
import { query } from '../db.js';
import { Resend } from 'resend';
import { generateConfirmationNumber } from '../utils/confirmationNumber.js';
import { sendPaymentConfirmationEmail } from '../utils/paymentConfirmationEmail.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Resend for payment confirmation emails
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
      const orderResult = await query('SELECT id, confirmation_number FROM orders WHERE id = $1', [orderId]);
      
      if (orderResult.rows.length === 0) {
        console.error(`Order not found: ${orderId}`);
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = orderResult.rows[0];
      const customerEmail = session.customer_details?.email;
      const paymentDate = new Date();
      const amountInCents = session.amount_total || 0;

      // Generate confirmation number if not already exists
      let confirmationNumber = order.confirmation_number;
      if (!confirmationNumber) {
        confirmationNumber = generateConfirmationNumber(paymentDate);
        
        // Ensure uniqueness (retry if collision)
        let attempts = 0;
        while (attempts < 5) {
          const existing = await query(
            'SELECT id FROM orders WHERE confirmation_number = $1',
            [confirmationNumber]
          );
          if (existing.rows.length === 0) {
            break; // Unique, we can use it
          }
          confirmationNumber = generateConfirmationNumber(paymentDate);
          attempts++;
        }
      }

      // Update order with payment status and confirmation number
      await query(
        `UPDATE orders 
         SET paid = true, 
             paid_at = NOW(), 
             payment_status = $1,
             stripe_payment_intent_id = $2,
             payment_amount = $3,
             email = COALESCE($4, email),
             confirmation_number = COALESCE(confirmation_number, $5)
         WHERE id = $6`,
        [
          session.payment_status || 'paid',
          paymentIntentId,
          amountInCents,
          customerEmail,
          confirmationNumber,
          orderId
        ]
      );

      console.log(`✅ Order ${orderId} marked as paid (Payment Intent: ${paymentIntentId}, Confirmation: ${confirmationNumber})`);

      // Send payment confirmation email to customer
      if (customerEmail && resend) {
        try {
          await sendPaymentConfirmationEmail({
            resendClient: resend,
            customerEmail: customerEmail,
            confirmationNumber: confirmationNumber,
            paymentDate: paymentDate,
            amountInCents: amountInCents,
            orderId: orderId
          });
          console.log(`📧 Payment confirmation email sent to ${customerEmail}`);
        } catch (emailError) {
          // Log error but don't fail the webhook (payment is already processed)
          console.error('⚠️ Failed to send payment confirmation email:', emailError);
          // Continue - payment is still marked as successful
        }
      } else {
        if (!customerEmail) {
          console.warn(`⚠️ No customer email found in session, skipping confirmation email for order ${orderId}`);
        }
        if (!resend) {
          console.warn(`⚠️ Resend not configured, skipping confirmation email for order ${orderId}`);
        }
      }
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

  // Handle payment_intent.payment_failed event
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    
    try {
      // Find order by payment_intent_id (set when checkout.session.completed)
      const orderResult = await query(
        'SELECT id FROM orders WHERE stripe_payment_intent_id = $1',
        [paymentIntent.id]
      );

      if (orderResult.rows.length > 0) {
        const orderId = orderResult.rows[0].id;
        await query(
          `UPDATE orders 
           SET payment_status = 'failed'
           WHERE id = $1`,
          [orderId]
        );
        console.log(`❌ Order ${orderId} marked as payment failed (Payment Intent: ${paymentIntent.id})`);
      } else {
        console.log(`⚠️ Payment Intent ${paymentIntent.id} failed, but no matching order found`);
      }
    } catch (error) {
      console.error('Error updating order payment failure status:', error);
    }
  }

  // Handle payment_intent.succeeded event (backup, if checkout.session.completed doesn't fire)
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // Find order by payment_intent_id
      const orderResult = await query(
        'SELECT id, paid FROM orders WHERE stripe_payment_intent_id = $1',
        [paymentIntent.id]
      );

      if (orderResult.rows.length > 0) {
        const order = orderResult.rows[0];
        // Only update if not already marked as paid
        if (!order.paid) {
          await query(
            `UPDATE orders 
             SET paid = true, 
                 paid_at = NOW(), 
                 payment_status = 'paid'
             WHERE id = $1`,
            [order.id]
          );
          console.log(`✅ Order ${order.id} marked as paid (Payment Intent succeeded)`);
        }
      } else {
        console.log(`⚠️ Payment Intent ${paymentIntent.id} succeeded, but no matching order found`);
      }
    } catch (error) {
      console.error('Error updating order payment status:', error);
    }
  }

  // Acknowledge receipt of event
  res.json({ received: true });
});

export default router;