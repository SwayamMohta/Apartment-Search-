// src/middleware/errorHandler.middleware.js
// Central error handler — MUST be the last middleware registered in app.js.
// All thrown errors bubble here. Never sends raw error messages in production.
import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  // Multer file errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      error: { code: 'FILE_TOO_LARGE', message: 'File size must not exceed 5MB' },
    });
  }

  // Zod validation errors (re-thrown by validate middleware)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Invalid or malformed token' },
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' },
    });
  }

  // Application-level errors thrown with a statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: { code: err.code || 'APP_ERROR', message: err.message },
    });
  }

  // Unhandled errors — log full stack, return generic message
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An internal server error occurred'
        : err.message,
    },
  });
};

/**
 * Factory to create application-level errors with a status code.
 * Usage: throw createError(404, 'Apartment not found', 'NOT_FOUND')
 */
export const createError = (statusCode, message, code = 'ERROR') => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
};

export default errorHandler;
