-- 002_create_apartments.sql
CREATE TABLE IF NOT EXISTS apartments (
  id            TEXT           PRIMARY KEY,
  title         VARCHAR(255)   NOT NULL,
  description   TEXT,
  location      VARCHAR(255)   NOT NULL,
  price         DECIMAL(10,2)  NOT NULL,
  beds          INTEGER        NOT NULL,
  baths         INTEGER        NOT NULL,
  area          INTEGER,
  rating        DECIMAL(3,1),
  lat           REAL           NOT NULL,
  lng           REAL           NOT NULL,
  created_by    TEXT           REFERENCES users(id) ON DELETE SET NULL,
  is_active     INTEGER        NOT NULL DEFAULT 1, -- SQLite uses 1/0 for boolean
  created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_apartments_lat_lng ON apartments(lat, lng);
CREATE INDEX IF NOT EXISTS idx_apartments_price   ON apartments(price);
CREATE INDEX IF NOT EXISTS idx_apartments_active  ON apartments(is_active);
