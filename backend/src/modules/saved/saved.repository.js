// src/modules/saved/saved.repository.js
import db from '../../config/db.js';

export const getSavedByUser = async (userId) => {
  const { rows } = await db.query(
    `SELECT
       a.id, a.title, a.location, a.price, a.beds, a.baths, a.area, a.rating,
       a.lat, a.lng, sh.saved_at,
       (SELECT COALESCE(json_group_array(am.name), '[]')
        FROM apartment_amenities aa JOIN amenities am ON aa.amenity_id = am.id
        WHERE aa.apartment_id = a.id) AS amenities,
       (SELECT COALESCE(json_group_array(json_object('id', ai.id, 'url', ai.url, 'is_cover', ai.is_cover)), '[]')
        FROM apartment_images ai WHERE ai.apartment_id = a.id) AS images
     FROM saved_homes sh
     JOIN apartments a ON sh.apartment_id = a.id
     WHERE sh.user_id = $1 AND a.is_active = 1
     ORDER BY sh.saved_at DESC`,
    [userId]
  );
  return rows.map(r => ({
    ...r,
    coords: { lat: r.lat, lng: r.lng },
    amenities: Array.isArray(r.amenities) ? r.amenities : (typeof r.amenities === 'string' ? JSON.parse(r.amenities) : (r.amenities || [])),
    images:    Array.isArray(r.images)    ? r.images    : (typeof r.images === 'string'    ? JSON.parse(r.images)    : (r.images || [])),
    isSaved: true
  }));
};

export const saveApartment = async (userId, apartmentId) => {
  await db.run('INSERT INTO saved_homes (user_id, apartment_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, apartmentId]);
};

export const unsaveApartment = async (userId, apartmentId) => {
  const { changes } = await db.run('DELETE FROM saved_homes WHERE user_id = $1 AND apartment_id = $2', [userId, apartmentId]);
  return changes > 0;
};
