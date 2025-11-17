-- Add customer_name column to orders table if it doesn't exist
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_name ON orders(customer_name);

