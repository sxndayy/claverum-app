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
 * Execute a query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 */
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Execute a transaction with automatic rollback on error
 * @param {Function} callback - Async function that receives a client and executes queries
 * @returns {Promise<any>} - Result from the callback function
 */
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;

