// src/middleware/validate.middleware.js
// Accepts a Zod schema and validates req.body against it.
// Throws ZodError on failure, caught by the central errorHandler.

/**
 * @param {import('zod').ZodSchema} schema
 */
const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return next(result.error); // ZodError → errorHandler
  }
  req.body = result.data; // replace with parsed + coerced data
  next();
};

export default validate;
