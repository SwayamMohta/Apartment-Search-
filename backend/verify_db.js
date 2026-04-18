import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'app.sqlite');
const db = new sqlite3.Database(dbPath);

db.all('SELECT count(*) as c FROM apartments', [], (err, rows) => {
  console.log('Apartments count:', rows[0].c);
  db.all('SELECT title, location, lat, lng FROM apartments LIMIT 3', [], (err, locRows) => {
    console.log('Sample Listings:', locRows);
  });
  db.all('SELECT count(*) as c FROM apartment_images', [], (err, imgRows) => {
    console.log('Images count:', imgRows[0].c);
  });
  db.all('SELECT count(*) as c FROM apartment_amenities', [], (err, amRows) => {
    console.log('Amenities relationships count:', amRows[0].c);
  });
  setTimeout(() => db.close(), 1000);
});
