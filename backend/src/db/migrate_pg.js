// src/db/migrate_pg.js
import 'dotenv/config';
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
    
    // Split SQL by semicolons to execute statements individually
    // This is more reliable for large schema files
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📦 Found ${statements.length} SQL statements to execute.`);

    for (let i = 0; i < statements.length; i++) {
      try {
        await db.query(statements[i]);
      } catch (err) {
        console.error(`❌ Error in statement #${i + 1}:`);
        console.error(`SQL: ${statements[i]}`);
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
    }
    
    console.log('✅ Schema applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
