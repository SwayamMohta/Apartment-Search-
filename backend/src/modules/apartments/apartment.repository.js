// src/modules/apartments/apartment.repository.js
import db from '../../config/db.js';

const formatApartment = (row) => {
  if (!row) return null;
  const { lat, lng, amenities, images, ...rest } = row;
  return {
    ...rest,
    coords:    { lat: parseFloat(lat), lng: parseFloat(lng) },
    amenities: Array.isArray(amenities) ? amenities : (typeof amenities === 'string' ? JSON.parse(amenities) : (amenities || [])),
    images:    Array.isArray(images)    ? images    : (typeof images === 'string'    ? JSON.parse(images)    : (images || [])),
  };
};

export const findAll = async ({ limit, offset, minPrice, maxPrice, beds, location, amenities, sortBy, userId }) => {
  const params  = [];
  const where   = ['a.is_active = 1'];
  let pIdx      = 1;

  if (minPrice) { params.push(minPrice); where.push(`a.price >= $${pIdx++}`); }
  if (maxPrice) { params.push(maxPrice); where.push(`a.price <= $${pIdx++}`); }
  if (beds)     { params.push(parseInt(beds)); where.push(`a.beds = $${pIdx++}`); }
  if (location) { params.push(`%${location}%`); where.push(`a.location LIKE $${pIdx++}`); }

  const sortMap = {
    price_asc:   'a.price ASC',
    price_desc:  'a.price DESC',
    rating_desc: 'a.rating DESC',
    newest:      'a.created_at DESC',
  };
  const orderBy = sortMap[sortBy] || 'a.created_at DESC';
  const whereClause = where.join(' AND ');

  const countRow = await db.get(`SELECT COUNT(*) as count FROM apartments a WHERE ${whereClause}`, params);
  const total = parseInt(countRow.count);

  const savedSubquery = userId
    ? `(SELECT 1 FROM saved_homes sh WHERE sh.apartment_id = a.id AND sh.user_id = $${pIdx++})`
    : 'NULL';
  if (userId) params.push(userId);

  const limitIdx = pIdx++;
  const offsetIdx = pIdx++;
  params.push(limit, offset);
  
  const { rows } = await db.query(
    `SELECT
       a.id, a.title, a.location, a.price, a.beds, a.baths, a.area, a.rating,
       a.lat, a.lng, a.created_at,
       CASE WHEN ${savedSubquery} IS NOT NULL THEN 1 ELSE 0 END AS isSaved,
       (SELECT COALESCE(json_agg(am.name), '[]'::json)
        FROM apartment_amenities aa JOIN amenities am ON aa.amenity_id = am.id
        WHERE aa.apartment_id = a.id) AS amenities,
       (SELECT COALESCE(json_agg(json_build_object('id', ai.id, 'url', ai.url, 'is_cover', ai.is_cover)), '[]'::json)
        FROM apartment_images ai WHERE ai.apartment_id = a.id) AS images
     FROM apartments a
     WHERE ${whereClause}
     ORDER BY ${orderBy}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params
  );

  return { rows: rows.map(formatApartment), total };
};

export const findById = async (id, userId) => {
  const params = [id];
  let pIdx = 2;
  const savedSubquery = userId
    ? `(SELECT 1 FROM saved_homes sh WHERE sh.apartment_id = a.id AND sh.user_id = $${pIdx++})`
    : '0';
  if (userId) params.push(userId);

  const row = await db.get(
    `SELECT
       a.id, a.title, a.description, a.location, a.price, a.beds, a.baths,
       a.area, a.rating, a.created_at, a.updated_at, a.lat, a.lng,
       CASE WHEN ${savedSubquery} IS NOT NULL THEN 1 ELSE 0 END AS isSaved,
       (SELECT COALESCE(json_agg(am.name), '[]'::json)
        FROM apartment_amenities aa JOIN amenities am ON aa.amenity_id = am.id
        WHERE aa.apartment_id = a.id) AS amenities,
       (SELECT COALESCE(json_agg(json_build_object('id', ai.id, 'url', ai.url, 'is_cover', ai.is_cover, 'sort_order', ai.sort_order)), '[]'::json)
        FROM apartment_images ai WHERE ai.apartment_id = a.id) AS images
     FROM apartments a
     WHERE a.id = $1 AND a.is_active = 1`,
    params
  );
  return formatApartment(row);
};

export const findInBounds = async ({ swLat, swLng, neLat, neLng }) => {
  const { rows } = await db.query(
    `SELECT
       a.id, a.title, a.price, a.beds, a.rating, a.lat, a.lng,
       (SELECT ai.url FROM apartment_images ai
        WHERE ai.apartment_id = a.id AND ai.is_cover = 1 LIMIT 1) AS "coverImage"
     FROM apartments a
     WHERE a.is_active = 1
       AND a.lat BETWEEN $1 AND $2
       AND a.lng BETWEEN $3 AND $4
     LIMIT 200`,
    [swLat, neLat, swLng, neLng]
  );
  return rows.map(r => ({ ...r, coords: { lat: parseFloat(r.lat), lng: parseFloat(r.lng) } }));
};

export const findInRadius = async ({ lat, lng, radiusKm }) => {
  // SQLite doesn't have ST_Distance natively without extension.
  // We'll use a bounding box first then filter in JS with Pythagoras for simplicity
  // since exact Haversine is overkill for small lists.
  const degPerKm = 1 / 111.32;
  const latDelta = radiusKm * degPerKm;
  const lngDelta = radiusKm * degPerKm / Math.cos(lat * Math.PI / 180);

  const { rows } = await db.query(
    `SELECT
       a.id, a.title, a.price, a.beds, a.rating, a.lat, a.lng
     FROM apartments a
     WHERE a.is_active = 1
       AND a.lat BETWEEN $1 AND $2
       AND a.lng BETWEEN $3 AND $4
     LIMIT 100`,
    [lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta]
  );

  // Simple Euclidean distance in JS for sorting (good enough for small r)
  return rows.map(r => {
    const rLat = parseFloat(r.lat);
    const rLng = parseFloat(r.lng);
    const dLat = (rLat - lat) * 111.32;
    const dLng = (rLng - lng) * 111.32 * Math.cos(lat * Math.PI / 180);
    const distanceKm = Math.sqrt(dLat * dLat + dLng * dLng);
    return { ...r, coords: { lat: rLat, lng: rLng }, distanceKm: distanceKm.toFixed(2) };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
};

/**
 * Find nearby points of interest for an apartment.
 */
export const findNearbyPois = async ({ lat, lng, radiusKm = 2, limit = 20 }) => {
  const degPerKm = 1 / 111.32;
  const latDelta = radiusKm * degPerKm;
  const lngDelta = radiusKm * degPerKm / Math.cos(lat * Math.PI / 180);

  const { rows } = await db.query(
    `SELECT id, type, name, lat, lng
     FROM pois
     WHERE lat BETWEEN $1 AND $2
       AND lng BETWEEN $3 AND $4
     LIMIT $5`,
    [lat - latDelta, lat + latDelta, lng - lngDelta, lng + lngDelta, limit * 2] // fetch more for accurate filtering
  );

  return rows.map(r => {
    const dLat = (r.lat - lat) * 111.32;
    const dLng = (r.lng - lng) * 111.32 * Math.cos(lat * Math.PI / 180);
    const distanceKm = Math.sqrt(dLat * dLat + dLng * dLng);
    return { ...r, coords: { lat: r.lat, lng: r.lng }, distanceKm: parseFloat(distanceKm.toFixed(3)) };
  })
  .filter(r => r.distanceKm <= radiusKm)
  .sort((a, b) => a.distanceKm - b.distanceKm)
  .slice(0, limit);
};

export const create = async ({ id, title, description, location, price, beds, baths, area, rating, coords, created_by }) => {
  const apartmentId = id || `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  await db.run(
    `INSERT INTO apartments (id, title, description, location, price, beds, baths, area, rating, lat, lng, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
    [apartmentId, title, description || null, location, price, beds, baths, area || null, rating || null,
     coords.lat, coords.lng, created_by || null]
  );
  return findById(apartmentId);
};

export const update = async (id, fields) => {
  const setClauses = [];
  const params     = [];

  const fieldMap = { title: 'title', description: 'description', location: 'location',
                     price: 'price', beds: 'beds', baths: 'baths', area: 'area', rating: 'rating',
                     lat: 'lat', lng: 'lng' };

  if (fields.coords) {
    fields.lat = fields.coords.lat;
    fields.lng = fields.coords.lng;
  }

  for (const [key, col] of Object.entries(fieldMap)) {
    if (fields[key] !== undefined) {
      params.push(fields[key]);
      setClauses.push(`${col} = $${params.length}`);
    }
  }

  if (setClauses.length > 0) {
    params.push(id);
    await db.run(`UPDATE apartments SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length} RETURNING id`, params);
  }
  return findById(id);
};

export const softDelete = async (id) => {
  const { changes } = await db.run(`UPDATE apartments SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
  return changes > 0;
};

export const setAmenities = async (apartmentId, amenityNames) => {
  await db.run('DELETE FROM apartment_amenities WHERE apartment_id = $1', [apartmentId]);
  for (const name of amenityNames) {
    await db.run('INSERT INTO amenities (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name]);
    const am = await db.get('SELECT id FROM amenities WHERE name = $1', [name]);
    await db.run('INSERT INTO apartment_amenities (apartment_id, amenity_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [apartmentId, am.id]);
  }
};

export const addImages = async (apartmentId, imageUrls) => {
  for (let i = 0; i < imageUrls.length; i++) {
    const id = `img_${Date.now()}_${i}`;
    await db.run(
      `INSERT INTO apartment_images (id, apartment_id, url, sort_order, is_cover) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [id, apartmentId, imageUrls[i], i, i === 0 ? 1 : 0]
    );
  }
};

export const deleteImage = async (imageId, apartmentId) => {
  const { changes } = await db.run('DELETE FROM apartment_images WHERE id = $1 AND apartment_id = $2', [imageId, apartmentId]);
  return changes > 0;
};
