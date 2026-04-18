// src/db/seed.js
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load real scraped apartment data
const realDataPath = path.join(__dirname, 'real_apartments.json');
const APARTMENTS = JSON.parse(fs.readFileSync(realDataPath, 'utf8'));

async function seed() {
  console.log('🌱 Starting database seed (PostgreSQL)...\n');

  const adminEmail = 'admin@aura.com';
  const adminPass  = await bcrypt.hash('admin123', 12);
  const adminId    = 'admin_001';

  try {
    // 1. Setup Admin
    await db.run(`
      INSERT INTO users (id, email, password_hash, role, full_name)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
    `, [adminId, adminEmail, adminPass, 'admin', 'System Admin']);

    console.log(`✅ Admin user: ${adminEmail} (password: admin123)\n`);

    // 2. Clear Mock Data
    await db.run('DELETE FROM saved_homes');
    await db.run('DELETE FROM apartment_images');
    await db.run('DELETE FROM apartment_amenities');
    await db.run('DELETE FROM apartments');
    console.log(`✅ Cleared old mock data\n`);

    let seeded = 0;
    for (const apt of APARTMENTS) {
      const [lat, lng] = apt.coords;

      // Check if exists
      const existing = await db.get('SELECT id FROM apartments WHERE title = $1 AND location = $2', [apt.title, apt.locality]);
      if (existing) {
        console.log(`  ⏭️  Skipping (exists): ${apt.title}`);
        continue;
      }

      const aptId = `apt_${seeded}_${Date.now()}`;
      await db.run(
        `INSERT INTO apartments (id, title, description, location, price, beds, baths, area, rating, lat, lng, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [aptId, apt.title, apt.description, apt.locality, apt.price, apt.beds, apt.baths,
         apt.area, apt.rating, lat, lng, adminId]
      );

      // Amenities
      if (apt.amenities && Array.isArray(apt.amenities)) {
        for (const name of apt.amenities) {
          await db.run('INSERT INTO amenities (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name]);
          const am = await db.get('SELECT id FROM amenities WHERE name = $1', [name]);
          await db.run('INSERT INTO apartment_amenities (apartment_id, amenity_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [aptId, am.id]);
        }
      }

      // Images
      if (apt.images && Array.isArray(apt.images)) {
        for (let i = 0; i < apt.images.length; i++) {
          const imgId = `img_${aptId}_${i}`;
          await db.run('INSERT INTO apartment_images (id, apartment_id, url, sort_order, is_cover) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [imgId, aptId, apt.images[i], i, i === 0 ? 1 : 0]);
        }
      }

      console.log(`  ✅ Seeded: ${apt.title}`);
      seeded++;
    }

    console.log(`\n✅ Seed complete — ${seeded} apartments inserted.\n`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    throw err;
  }
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Final seed error:', err);
    process.exit(1);
  });
