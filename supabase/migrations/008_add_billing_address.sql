-- Add billing address columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS billing_address_line1 VARCHAR(255),
ADD COLUMN IF NOT EXISTS billing_address_line2 VARCHAR(255),
ADD COLUMN IF NOT EXISTS billing_address_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS billing_address_postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS billing_address_state VARCHAR(100),
ADD COLUMN IF NOT EXISTS billing_address_country VARCHAR(2); -- ISO country code (e.g., 'DE', 'US')

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_billing_country ON orders(billing_address_country);


