// src/db/import_pois.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DB_PATH = path.join(__dirname, '..', '..', '..', 'pois.db');
const DEST_DB_PATH = path.join(__dirname, '..', '..', 'app.sqlite');

const srcDb = new sqlite3.Database(SOURCE_DB_PATH);
const destDb = new sqlite3.Database(DEST_DB_PATH);

async function importPois() {
  console.log('🚀 Starting POI import (SQLite to SQLite)...');
  
  // Attach source database to destination
  // This allows copying between databases in a single SQL statement
  destDb.serialize(() => {
    destDb.run(`ATTACH DATABASE '${SOURCE_DB_PATH.replace(/'/g, "''")}' AS source_db`, (err) => {
      if (err) {
        console.error('❌ Failed to attach source database:', err.message);
        process.exit(1);
      }

      console.log('🔗 Source database attached.');

      // Copy rows
      destDb.run(`
        INSERT OR IGNORE INTO main.pois (id, type, name, source, lat, lng)
        SELECT id, type, name, source, lat, lon FROM source_db.pois
      `, function(err) {
        if (err) {
          console.error('❌ Error copying POIs:', err.message);
        } else {
          console.log(`✅ Imported ${this.changes} new POIs.`);
        }
        
        destDb.run('DETACH DATABASE source_db', () => {
          destDb.close();
          srcDb.close();
          console.log('🏁 Import complete.');
        });
      });
    });
  });
}

importPois().catch(err => {
  console.error('Import error:', err);
  process.exit(1);
});
