// src/middleware/role.middleware.js
// RBAC guard — must be used AFTER authenticate middleware.
// Usage: router.post('/apartments', authenticate, authorize('admin'), controller)
import { createError } from './errorHandler.middleware.js';

/**
 * @param {...string} roles - allowed roles, e.g. authorize('admin')
 */
const authorize = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(createError(401, 'Authentication required', 'UNAUTHORIZED'));
  }
  if (!roles.includes(req.user.role)) {
    return next(createError(403, 'You do not have permission to perform this action', 'FORBIDDEN'));
  }
  next();
};

export default authorize;
