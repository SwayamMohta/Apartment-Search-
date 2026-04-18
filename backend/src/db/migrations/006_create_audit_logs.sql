-- 006_create_audit_logs.sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id         TEXT        PRIMARY KEY,
  admin_id   TEXT        REFERENCES users(id) ON DELETE SET NULL,
  action     VARCHAR(50) NOT NULL,
  entity     VARCHAR(50) NOT NULL,
  entity_id  TEXT,
  payload    TEXT, -- SQLite stores JSON as text
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);
