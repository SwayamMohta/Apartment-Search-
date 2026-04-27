// src/config/db.js
// SQLite database connection using better-sqlite3 (local, zero-config).
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../app.sqlite');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

logger.info('Connected to SQLite database at ' + DB_PATH);

// Convert PostgreSQL $1, $2 params to SQLite ?
const toSQLite = (sql) => sql.replace(/\$\d+/g, '?');
// Strip RETURNING clause (handled separately by caller using findById)
const stripReturning = (sql) => sql.replace(/\s+RETURNING\s+\S+/gi, '');

/**
 * Run a SELECT that returns multiple rows.
 */
export const query = async (sql, params = []) => {
  try {
    const rows = db.prepare(toSQLite(sql)).all(params);
    return { rows, rowCount: rows.length };
  } catch (err) {
    logger.error('Database query error', { error: err.message });
    throw err;
  }
};

/**
 * Run a SELECT that returns a single row.
 */
export const get = async (sql, params = []) => {
  try {
    return db.prepare(toSQLite(sql)).get(params);
  } catch (err) {
    logger.error('Database get error', { error: err.message });
    throw err;
  }
};

/**
 * Run an INSERT / UPDATE / DELETE.
 */
export const run = async (sql, params = []) => {
  try {
    const result = db.prepare(toSQLite(stripReturning(sql))).run(params);
    return { lastID: result.lastInsertRowid, changes: result.changes };
  } catch (err) {
    logger.error('Database run error', { error: err.message });
    throw err;
  }
};

/**
 * Transaction helper.
 */
export const transaction = async (fn) => db.transaction(fn)();

export default { query, get, run, transaction };
