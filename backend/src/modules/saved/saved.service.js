// src/modules/saved/saved.service.js
import * as repo from './saved.repository.js';
import pool from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.middleware.js';

export const getSavedApartments = (userId) => repo.getSavedByUser(userId);

export const saveApartment = async (userId, apartmentId) => {
  // Verify apartment exists
  const { rows } = await pool.query(
    'SELECT id FROM apartments WHERE id = $1 AND is_active = 1', [apartmentId]
  );
  if (rows.length === 0) throw createError(404, 'Apartment not found', 'NOT_FOUND');
  await repo.saveApartment(userId, apartmentId);
};

export const unsaveApartment = async (userId, apartmentId) => {
  const removed = await repo.unsaveApartment(userId, apartmentId);
  if (!removed) throw createError(404, 'Saved apartment not found', 'NOT_FOUND');
};
