// src/utils/jwt.js
// Helpers for signing and verifying JWTs.
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Sign a new access token (short-lived — 15m).
 * @param {object} payload - { id, email, role }
 */
export const signAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES });

/**
 * Sign a new refresh token (long-lived — 7d).
 * @param {object} payload - { id }
 */
export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES });

/**
 * Verify an access token. Throws if invalid/expired.
 * @returns {object} decoded payload
 */
export const verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET);

/**
 * Verify a refresh token. Throws if invalid/expired.
 * @returns {object} decoded payload
 */
export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET);
