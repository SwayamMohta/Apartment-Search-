// src/modules/admin/admin.controller.js
import * as service from './admin.service.js';

export const listUsers = async (req, res, next) => {
  try {
    const result = await service.listUsers(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const deleteUser = async (req, res, next) => {
  try {
    await service.removeUser(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

export const getAuditLogs = async (req, res, next) => {
  try {
    const result = await service.listAuditLogs(req.query);
    res.status(200).json(result);
  } catch (err) { next(err); }
};

export const getAnalytics = async (_req, res, next) => {
  try {
    const stats = await service.getAnalytics();
    res.status(200).json({ data: stats });
  } catch (err) { next(err); }
};
