-- Create area_texts table
CREATE TABLE IF NOT EXISTS area_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_area_texts_order_id ON area_texts(order_id);
CREATE INDEX idx_area_texts_area ON area_texts(area);

-- Composite index for common queries
CREATE INDEX idx_area_texts_order_area ON area_texts(order_id, area);

-- Unique constraint to prevent duplicate area texts per order
CREATE UNIQUE INDEX idx_area_texts_order_area_unique ON area_texts(order_id, area);

-- Add updated_at trigger
CREATE TRIGGER update_area_texts_updated_at
    BEFORE UPDATE ON area_texts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

