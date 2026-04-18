-- 005_create_saved_homes.sql
CREATE TABLE IF NOT EXISTS saved_homes (
  user_id       TEXT        NOT NULL REFERENCES users(id)      ON DELETE CASCADE,
  apartment_id  TEXT        NOT NULL REFERENCES apartments(id) ON DELETE CASCADE,
  saved_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, apartment_id)
);
