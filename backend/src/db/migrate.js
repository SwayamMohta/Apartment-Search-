// src/db/migrate.js
// Runs all SQL migration files in order using SQLite.
import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const DB_PATH = path.join(__dirname, '..', '..', 'app.sqlite');

const db = new sqlite3.Database(DB_PATH);

const run = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, (err) => err ? reject(err) : resolve());
});

const get = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

async function migrate() {
  console.log(`🗄️  Connecting to SQLite: ${DB_PATH}`);

  // Create migrations tracking table
  await run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename   VARCHAR(255) PRIMARY KEY,
      applied_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const row = await get('SELECT filename FROM _migrations WHERE filename = ?', [file]);

    if (row) {
      console.log(`  ⏭️  Skipping (already applied): ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log(`  🔄 Applying: ${file}`);

    // Split SQL by semicolon then filter out empty lines to avoid SQLite errors with multiple statements
    // Simplified: SQLite's db.exec manages multiple statements
    try {
      await new Promise((resolve, reject) => {
        db.exec(sql, (err) => err ? reject(err) : resolve());
      });
      await run('INSERT INTO _migrations (filename) VALUES (?)', [file]);
      console.log(`  ✅ Applied: ${file}`);
    } catch (err) {
      console.error(`  ❌ FAILED: ${file}\n${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n✅ All migrations applied successfully.\n');
  db.close();
}

migrate().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
