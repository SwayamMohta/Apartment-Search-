-- postgres_schema.sql
-- Combined schema for Apartment Search Platform (PostgreSQL/Supabase)

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS saved_homes;
DROP TABLE IF EXISTS apartment_images;
DROP TABLE IF EXISTS apartment_amenities;
DROP TABLE IF EXISTS amenities;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pois;

-- Users Table
CREATE TABLE users (
    id            TEXT PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255),
    role          VARCHAR(50)  NOT NULL DEFAULT 'user',
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Apartments Table
CREATE TABLE apartments (
    id            TEXT PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   TEXT,
    location      VARCHAR(255) NOT NULL,
    price         DECIMAL(12,2) NOT NULL,
    beds          INTEGER NOT NULL,
    baths         INTEGER NOT NULL,
    area          INTEGER,
    rating        DECIMAL(3,1),
    lat           DOUBLE PRECISION NOT NULL,
    lng           DOUBLE PRECISION NOT NULL,
    created_by    TEXT REFERENCES users(id) ON DELETE SET NULL,
    is_active     SMALLINT NOT NULL DEFAULT 1,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_apartments_lat_lng ON apartments(lat, lng);
CREATE INDEX idx_apartments_price ON apartments(price);
CREATE INDEX idx_apartments_active ON apartments(is_active);

-- Amenities Table
CREATE TABLE amenities (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Junction Table for Apartments and Amenities
CREATE TABLE apartment_amenities (
    apartment_id TEXT REFERENCES apartments(id) ON DELETE CASCADE,
    amenity_id   INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
    PRIMARY KEY (apartment_id, amenity_id)
);

-- Apartment Images Table
CREATE TABLE apartment_images (
    id           TEXT PRIMARY KEY,
    apartment_id TEXT REFERENCES apartments(id) ON DELETE CASCADE,
    url          TEXT NOT NULL,
    sort_order   INTEGER DEFAULT 0,
    is_cover     SMALLINT DEFAULT 0,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Saved Homes Table
CREATE TABLE saved_homes (
    user_id      TEXT REFERENCES users(id) ON DELETE CASCADE,
    apartment_id TEXT REFERENCES apartments(id) ON DELETE CASCADE,
    saved_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, apartment_id)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id           SERIAL PRIMARY KEY,
    action       VARCHAR(100) NOT NULL,
    user_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
    entity       VARCHAR(100),
    entity_id    TEXT,
    details      TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- POIs Table (Points of Interest)
CREATE TABLE pois (
    id         SERIAL PRIMARY KEY,
    type       VARCHAR(100) NOT NULL,
    name       VARCHAR(255) NOT NULL,
    lat        DOUBLE PRECISION NOT NULL,
    lng        DOUBLE PRECISION NOT NULL,
    data       JSONB
);

CREATE INDEX idx_pois_lat_lng ON pois(lat, lng);
CREATE INDEX idx_pois_type ON pois(type);
