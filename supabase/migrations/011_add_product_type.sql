-- Add product_type column to orders table
-- Valid values: 'analyse' or 'intensiv'
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS product_type VARCHAR(20) DEFAULT NULL;
