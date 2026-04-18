// src/utils/pagination.js
// Standard pagination utility for all listing endpoints.

/**
 * Parse and validate pagination params from query string.
 * @param {object} query - Express req.query
 * @returns {{ page, limit, offset }}
 */
export const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 12));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Build the standardized pagination response object.
 * @param {number} total - total row count from DB
 * @param {number} page
 * @param {number} limit
 */
export const buildPaginationMeta = (total, page, limit) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page < Math.ceil(total / limit),
  hasPrevPage: page > 1,
});
