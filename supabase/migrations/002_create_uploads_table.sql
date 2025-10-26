-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_uploads_order_id ON uploads(order_id);
CREATE INDEX idx_uploads_area ON uploads(area);
CREATE INDEX idx_uploads_created_at ON uploads(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_uploads_order_area ON uploads(order_id, area);

