-- Add payment fields to orders table
ALTER TABLE orders ADD COLUMN email VARCHAR(255);
ALTER TABLE orders ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN payment_amount INTEGER;
ALTER TABLE orders ADD COLUMN stripe_checkout_session_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN stripe_payment_intent_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for payment fields
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_stripe_session ON orders(stripe_checkout_session_id);
CREATE INDEX idx_orders_email ON orders(email);

-- Add constraints
ALTER TABLE orders ADD CONSTRAINT chk_payment_status 
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled'));

-- Add comment for documentation
COMMENT ON COLUMN orders.email IS 'Customer email address';
COMMENT ON COLUMN orders.payment_status IS 'Payment status: pending, paid, failed, cancelled';
COMMENT ON COLUMN orders.payment_amount IS 'Payment amount in cents (e.g., 29900 for 299.00 EUR)';
COMMENT ON COLUMN orders.stripe_checkout_session_id IS 'Stripe Checkout Session ID';
COMMENT ON COLUMN orders.stripe_payment_intent_id IS 'Stripe Payment Intent ID';
COMMENT ON COLUMN orders.paid_at IS 'Timestamp when payment was completed';
