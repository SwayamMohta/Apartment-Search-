// src/config/db.js
import 'dotenv/config';
// PostgreSQL database connection using pg (Supabase).
import pg from 'pg';
import logger from '../utils/logger.js';

const { Pool } = pg;

// Use DATABASE_URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  logger.info('Connected to PostgreSQL (Supabase) database');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export const query = async (text, params = []) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    logger.error('Database query error', { message: err.message, code: err.code, text });
    throw err;
  }
};

export const get = async (text, params = []) => {
  const res = await query(text, params);
  return res.rows[0];
};

export const run = async (text, params = []) => {
  return query(text, params);
};

export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default { query, get, run, transaction };
