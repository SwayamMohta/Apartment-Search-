-- 003_create_amenities.sql
CREATE TABLE IF NOT EXISTS amenities (
  id    INTEGER       PRIMARY KEY AUTOINCREMENT,
  name  VARCHAR(100)  UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS apartment_amenities (
  apartment_id  TEXT    NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  amenity_id    INTEGER NOT NULL REFERENCES amenities(id)  ON DELETE CASCADE,
  PRIMARY KEY (apartment_id, amenity_id)
);
