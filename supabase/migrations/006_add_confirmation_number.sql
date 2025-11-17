-- Add confirmation_number column to orders table
-- Format: GUT-YYYY-MM-DD-XXXXX (e.g., GUT-2025-01-17-A1B2C)

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS confirmation_number VARCHAR(50) UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_confirmation_number ON orders(confirmation_number);

