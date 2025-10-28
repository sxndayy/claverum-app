-- Create order_sessions table to persist session tokens across deployments
CREATE TABLE IF NOT EXISTS order_sessions (
  id SERIAL PRIMARY KEY,
  session_token VARCHAR(64) UNIQUE NOT NULL,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_sessions_token ON order_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_order_sessions_order_id ON order_sessions(order_id);
CREATE INDEX IF NOT EXISTS idx_order_sessions_expires_at ON order_sessions(expires_at);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM order_sessions WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean up expired sessions
-- This would need to be set up in your database management system
-- For now, we'll clean up manually in the application
