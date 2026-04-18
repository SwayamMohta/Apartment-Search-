// src/modules/apartments/apartment.service.js
import db from '../../config/db.js';
import * as repo from './apartment.repository.js';
import { createError } from '../../middleware/errorHandler.middleware.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';

export const listApartments = async (query, userId) => {
  const { page, limit, offset } = parsePagination(query);
  const amenities = query.amenities ? query.amenities.split(',').map(s => s.trim()) : [];

  const limitNumber = parseInt(limit, 10);
  const offsetNumber = parseInt(offset, 10);

  const { rows, total } = await repo.findAll({
    limit: limitNumber, 
    offset: offsetNumber,
    minPrice:  query.minPrice  || null,
    maxPrice:  query.maxPrice  || null,
    beds:      query.beds      || null,
    location:  query.location  || null,
    sortBy:    query.sortBy    || 'newest',
    amenities: amenities.length > 0 ? amenities : null,
    userId,
  });

  // Attach Top 3 POIs to each listing
  const enrichedRows = await Promise.all(rows.map(async (row) => {
    const topPois = await repo.findNearbyPois({
      lat: row.coords.lat,
      lng: row.coords.lng,
      radiusKm: 2,
      limit: 3
    });
    return { ...row, topPois };
  }));

  return {
    data: enrichedRows,
    pagination: buildPaginationMeta(total, page, limit),
  };
};

export const getApartmentById = async (id, userId) => {
  const apartment = await repo.findById(id, userId);
  if (!apartment) throw createError(404, 'Apartment not found', 'NOT_FOUND');
  return apartment;
};

export const getApartmentsInBounds = async (query) => {
  const { swLat, swLng, neLat, neLng } = query;
  if (!swLat || !swLng || !neLat || !neLng) {
    throw createError(400, 'Query params swLat, swLng, neLat, neLng are required', 'VALIDATION_ERROR');
  }
  const boundsApts = await repo.findInBounds({
    swLat: parseFloat(swLat), swLng: parseFloat(swLng),
    neLat: parseFloat(neLat), neLng: parseFloat(neLng),
  });

  const enrichedBounds = await Promise.all(boundsApts.map(async (row) => {
    const topPois = await repo.findNearbyPois({
      lat: row.coords.lat,
      lng: row.coords.lng,
      radiusKm: 2,
      limit: 3
    });
    return { ...row, topPois };
  }));

  return enrichedBounds;
};

export const getApartmentsInRadius = async (query) => {
  const { lat, lng, radiusKm } = query;
  if (!lat || !lng || !radiusKm) {
    throw createError(400, 'Query params lat, lng, radiusKm are required', 'VALIDATION_ERROR');
  }
  return repo.findInRadius({
    lat: parseFloat(lat), lng: parseFloat(lng),
    radiusKm: Math.min(parseFloat(radiusKm), 50), // cap at 50km
  });
};

export const getNearbyPois = async (aptId, query) => {
  const apartment = await repo.findById(aptId);
  if (!apartment) throw createError(404, 'Apartment not found', 'NOT_FOUND');

  return repo.findNearbyPois({
    lat: apartment.coords.lat,
    lng: apartment.coords.lng,
    radiusKm: parseFloat(query.radiusKm) || 2,
    limit: parseInt(query.limit) || 20
  });
};

export const createApartment = async (data, adminId) => {
  return db.transaction(async () => {
    const apt = await repo.create({ ...data, created_by: adminId });
    if (data.amenities?.length > 0) {
      await repo.setAmenities(apt.id, data.amenities);
    }
    if (data.images?.length > 0) {
      await repo.addImages(apt.id, data.images);
    }
    return repo.findById(apt.id);
  });
};

export const updateApartment = async (id, data, adminId) => {
  const existing = await repo.findById(id);
  if (!existing) throw createError(404, 'Apartment not found', 'NOT_FOUND');

  return db.transaction(async () => {
    await repo.update(id, data);
    if (data.amenities !== undefined) {
      await repo.setAmenities(id, data.amenities);
    }
    if (data.images !== undefined && data.images.length > 0) {
      await repo.addImages(id, data.images);
    }
    return repo.findById(id);
  });
};

export const deleteApartment = async (id) => {
  const deleted = await repo.softDelete(id);
  if (!deleted) throw createError(404, 'Apartment not found', 'NOT_FOUND');
};

export const deleteApartmentImage = async (aptId, imageId) => {
  const deleted = await repo.deleteImage(imageId, aptId);
  if (!deleted) throw createError(404, 'Image not found', 'NOT_FOUND');
};
