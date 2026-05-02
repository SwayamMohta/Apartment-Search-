import 'dotenv/config';
import Database from 'better-sqlite3';
import db from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DB_PATH = path.join(__dirname, '..', '..', '..', 'pois.db');

async function importPoisPg() {
  console.log('🚀 Starting POI import (SQLite to PostgreSQL)...');
  
  let sqliteDb;
  try {
    sqliteDb = new Database(SOURCE_DB_PATH, { fileMustExist: true });
    console.log('🔗 Connected to source SQLite database.');
  } catch (err) {
    console.error('❌ Failed to open source database:', err.message);
    process.exit(1);
  }

  try {
    // Read all POIs from SQLite
    const pois = sqliteDb.prepare('SELECT id, type, name, lat, lon as lng FROM pois').all();
    console.log(`📦 Found ${pois.length} POIs in source database.`);

    // Clear existing POIs in Postgres to avoid duplicates or use ON CONFLICT
    await db.run('DELETE FROM pois');
    console.log('🧹 Cleared existing POIs in PostgreSQL.');

    // Insert POIs in batches
    let imported = 0;
    const batchSize = 500;
    
    for (let i = 0; i < pois.length; i += batchSize) {
      const batch = pois.slice(i, i + batchSize);
      
      const values = [];
      const params = [];
      let paramIndex = 1;
      
      for (const poi of batch) {
        values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
        params.push(poi.id, poi.type, poi.name, poi.lat, poi.lng);
      }
      
      const query = `
        INSERT INTO pois (id, type, name, lat, lng)
        VALUES ${values.join(', ')}
        ON CONFLICT (id) DO NOTHING
      `;
      
      await db.run(query, params);
      imported += batch.length;
      console.log(`⏳ Imported ${imported}/${pois.length} POIs...`);
    }

    console.log(`✅ Successfully imported ${imported} POIs to PostgreSQL!`);
  } catch (err) {
    console.error('❌ Import failed:', err);
  } finally {
    sqliteDb.close();
    process.exit(0);
  }
}

importPoisPg();
