import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create connection pool to Neon Postgres
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20, // Increased from 5 to handle 20+ concurrent users
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Database connected');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

/**
 * Check if error is a connection/timeout error that should be retried
 */
function isRetryableError(error) {
  if (!error) return false;
  
  const errorCode = error.code;
  const errorMessage = error.message?.toLowerCase() || '';
  
  // Connection timeout errors
  if (errorCode === 'ETIMEDOUT' || errorCode === 'ECONNREFUSED') {
    return true;
  }
  
  // Pool exhaustion errors
  if (errorMessage.includes('timeout') && errorMessage.includes('connection')) {
    return true;
  }
  
  // Connection lost errors
  if (errorCode === '57P01' || errorCode === '57P02' || errorCode === '57P03') {
    return true;
  }
  
  return false;
}

/**
 * Check if error indicates database pool exhaustion
 * @param {Error} error - Error object
 * @returns {boolean}
 */
export function isPoolExhaustionError(error) {
  if (!error) return false;
  
  const errorCode = error.code;
  const errorMessage = error.message?.toLowerCase() || '';
  
  // Connection timeout after retries likely means pool exhaustion
  if (errorCode === 'ETIMEDOUT' && errorMessage.includes('timeout')) {
    return true;
  }
  
  // Specific pool exhaustion messages
  if (errorMessage.includes('timeout') && 
      (errorMessage.includes('connection') || errorMessage.includes('pool'))) {
    return true;
  }
  
  return false;
}

/**
 * Get pool statistics for monitoring
 */
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
    utilization: pool.totalCount > 0 ? ((pool.totalCount - pool.idleCount) / pool.totalCount * 100).toFixed(1) : 0
  };
}

/**
 * Log pool statistics if utilization is high (>80%)
 */
function logPoolStatsIfNeeded() {
  const stats = getPoolStats();
  if (parseFloat(stats.utilization) > 80) {
    console.warn('⚠️ High database pool utilization:', stats);
  }
}

/**
 * Execute a query with retry logic for transient errors
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @param {number} maxRetries - Maximum number of retries (default: 2)
 */
export const query = async (text, params, maxRetries = 2) => {
  const start = Date.now();
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      
      // Log pool stats if utilization is high
      if (attempt === 0) {
        logPoolStatsIfNeeded();
      }
      
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable and we have retries left
      if (attempt < maxRetries && isRetryableError(error)) {
        const delay = Math.min(100 * Math.pow(2, attempt), 1000); // Exponential backoff, max 1s
        console.warn(`Database query error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Not retryable or out of retries
      console.error('Database query error:', error);
      throw error;
    }
  }
  
  // Should never reach here, but just in case
  throw lastError;
};

/**
 * Execute a transaction with automatic rollback on error and retry logic
 * @param {Function} callback - Async function that receives a client and executes queries
 * @param {number} maxRetries - Maximum number of retries for connection errors (default: 2)
 * @returns {Promise<any>} - Result from the callback function
 */
export const transaction = async (callback, maxRetries = 2) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let client;
    
    try {
      // Try to get a connection from the pool
      client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
      } catch (error) {
        // Rollback transaction on error
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          console.error('Error during rollback:', rollbackError);
        }
        
        // Transaction errors are not retryable (data issues, not connection issues)
        console.error('Transaction error:', error);
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable (connection/timeout) and we have retries left
      if (attempt < maxRetries && isRetryableError(error)) {
        const delay = Math.min(100 * Math.pow(2, attempt), 1000); // Exponential backoff, max 1s
        console.warn(`Database connection error (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, error.message);
        
        // Log pool stats to help diagnose pool exhaustion
        const stats = getPoolStats();
        console.warn('Pool stats:', stats);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Not retryable or out of retries
      console.error('Transaction connection error:', error);
      throw error;
    }
  }
  
  // Should never reach here, but just in case
  throw lastError || new Error('Transaction failed after retries');
};

export default pool;

