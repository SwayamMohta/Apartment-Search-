-- 004_create_images.sql
CREATE TABLE IF NOT EXISTS apartment_images (
  id            TEXT        PRIMARY KEY,
  apartment_id  TEXT        NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  url           TEXT        NOT NULL,
  sort_order    INTEGER     NOT NULL DEFAULT 0,
  is_cover      INTEGER     NOT NULL DEFAULT 0, -- 1/0
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_apt_images_apt_id ON apartment_images(apartment_id);
