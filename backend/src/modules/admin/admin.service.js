// src/modules/admin/admin.service.js
import * as repo from './admin.repository.js';
import { createError } from '../../middleware/errorHandler.middleware.js';
import { parsePagination, buildPaginationMeta } from '../../utils/pagination.js';

export const listUsers = async (query) => {
  const { page, limit, offset } = parsePagination(query);
  const { rows, total } = await repo.getAllUsers({ limit, offset });
  return { data: rows, pagination: buildPaginationMeta(total, page, limit) };
};

export const removeUser = async (targetId, adminId) => {
  if (targetId === adminId) {
    throw createError(400, 'You cannot delete your own admin account', 'SELF_DELETE');
  }
  const deleted = await repo.deleteUser(targetId);
  if (!deleted) throw createError(404, 'User not found', 'NOT_FOUND');
  await repo.insertAuditLog({ adminId, action: 'DELETE', entity: 'user', entityId: targetId, payload: {} });
};

export const listAuditLogs = async (query) => {
  const { page, limit, offset } = parsePagination(query);
  const { rows, total } = await repo.getAuditLogs({ limit, offset });
  return { data: rows, pagination: buildPaginationMeta(total, page, limit) };
};

export const getAnalytics = () => repo.getAnalyticsOverview();

// Called from apartment service after CRUD to log admin actions
export const logAudit = (adminId, action, entity, entityId, payload = {}) =>
  repo.insertAuditLog({ adminId, action, entity, entityId, payload });
