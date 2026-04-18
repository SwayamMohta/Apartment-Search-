// src/middleware/auth.middleware.js
// Verifies the JWT access token from the Authorization header.
// Attaches req.user = { id, email, role } on success.
import { verifyAccessToken } from '../utils/jwt.js';
import { createError } from './errorHandler.middleware.js';

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Authorization token required', 'UNAUTHORIZED'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    next(err); // JsonWebTokenError or TokenExpiredError → errorHandler
  }
};

export default authenticate;
