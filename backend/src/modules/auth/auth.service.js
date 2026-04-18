// src/modules/auth/auth.service.js
// Business logic for authentication.
// Orchestrates repository, hashing, and JWT utilities.
import * as authRepo from './auth.repository.js';
import { hashPassword, comparePassword } from '../../utils/hash.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { createError } from '../../middleware/errorHandler.middleware.js';

/**
 * Register a new user account.
 * @returns {{ user, accessToken, refreshToken }}
 */
export const register = async ({ email, password, full_name }) => {
  // Prevent duplicate emails
  const existing = await authRepo.findUserByEmail(email);
  if (existing) {
    throw createError(409, 'An account with this email already exists', 'EMAIL_TAKEN');
  }

  const password_hash = await hashPassword(password);
  const user = await authRepo.createUser({ email, password_hash, full_name });

  const accessToken  = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
};

/**
 * Login with email + password.
 * @returns {{ user, accessToken, refreshToken }}
 */
export const login = async ({ email, password }) => {
  const user = await authRepo.findUserByEmail(email);

  // Use the same error for "not found" and "wrong password" — prevents email enumeration
  if (!user) {
    throw createError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw createError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const accessToken  = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  // Strip password_hash before returning
  const { password_hash: _, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

/**
 * Issue a new access token from a valid refresh token.
 * @returns {{ accessToken }}
 */
export const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw createError(401, 'Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
  }

  const user = await authRepo.findUserById(decoded.id);
  if (!user) {
    throw createError(401, 'User no longer exists', 'USER_NOT_FOUND');
  }

  const accessToken = signAccessToken({ id: user.id, email: user.email, role: user.role });
  return { accessToken };
};

/**
 * Get the authenticated user's profile.
 */
export const getMe = async (userId) => {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw createError(404, 'User not found', 'NOT_FOUND');
  }
  return user;
};
