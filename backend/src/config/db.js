// src/config/db.js
// PostgreSQL database connection setup using pg.
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', { error: err.message });
});

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL database');
});

/**
 * Promise-based query helper.
 * Returns { rows } to match previous SQLite helper.
 */
export const query = async (sql, params = []) => {
  try {
    const res = await pool.query(sql, params);
    return { rows: res.rows, rowCount: res.rowCount };
  } catch (err) {
    logger.error('Database query error', { sql, params, error: err.message });
    throw err;
  }
};

/**
 * Promise-based single row helper.
 */
export const get = async (sql, params = []) => {
  try {
    const res = await pool.query(sql, params);
    return res.rows[0];
  } catch (err) {
    logger.error('Database get error', { sql, params, error: err.message });
    throw err;
  }
};

/**
 * Promise-based run helper (for INSERT/UPDATE/DELETE).
 * PostgreSQL returns metadata in the result.
 */
export const run = async (sql, params = []) => {
  try {
    const res = await pool.query(sql, params);
    // Normalize to match SQLite's 'lastID' and 'changes' if possible.
    // We expect repos to use RETURNING for lastID.
    return { 
      lastID: res.rows[0]?.id || null, 
      changes: res.rowCount 
    };
  } catch (err) {
    logger.error('Database run error', { sql, params, error: err.message });
    throw err;
  }
};

/**
 * Transaction helper.
 */
export const transaction = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client); // Notice: we pass client if needed, but the wrappers use the pool
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export default { query, get, run, transaction, pool };
