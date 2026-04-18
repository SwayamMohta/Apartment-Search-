// src/db/migrate_pg.js
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, 'postgres_schema.sql');

async function migrate() {
  console.log('🚀 Starting PostgreSQL migration (Supabase)...');

  try {
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    
    // Execute the schema SQL
    // pg-pool doesn't support executing multiple statements in one query call if they contain non-parameterized parts easily,
    // but the 'pg' library actually handles a string of SQL fine if it's just one query call.
    await db.query(schemaSql);
    
    console.log('✅ Schema applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
