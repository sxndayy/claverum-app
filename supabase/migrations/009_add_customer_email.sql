-- Add customer_email column to orders table if it doesn't exist
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
