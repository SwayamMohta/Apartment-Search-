-- 007_create_pois.sql
CREATE TABLE IF NOT EXISTS pois (
  id            INTEGER        PRIMARY KEY, -- Use the same id as in pois.db
  type          VARCHAR(50)    NOT NULL,
  name          VARCHAR(255)   NOT NULL,
  source        VARCHAR(50),
  lat           REAL           NOT NULL,
  lng           REAL           NOT NULL,
  created_at    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pois_lat_lng ON pois(lat, lng);
CREATE INDEX IF NOT EXISTS idx_pois_type    ON pois(type);
