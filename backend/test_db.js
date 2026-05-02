import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

console.log('Testing connection to:', process.env.DATABASE_URL.replace(/:[^@]+@/, ':****@'));

try {
  const res = await pool.query('SELECT NOW()');
  console.log('✅ Connection successful! Server time:', res.rows[0].now);
  process.exit(0);
} catch (err) {
  console.error('❌ Connection failed!');
  console.error('Error Code:', err.code);
  console.error('Error Message:', err.message);
  process.exit(1);
}
