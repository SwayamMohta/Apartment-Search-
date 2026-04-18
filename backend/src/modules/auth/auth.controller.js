// src/modules/auth/auth.controller.js
// HTTP layer — parses req, calls service, sends response.
// No business logic. No SQL.
import * as authService from './auth.service.js';

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);
    res.status(201).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);
    res.status(200).json({ accessToken, user });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const tokenFromCookie  = req.cookies?.refreshToken;
    const tokenFromBody    = req.body?.refreshToken;
    const refreshToken     = tokenFromCookie || tokenFromBody;

    if (!refreshToken) {
      return res.status(401).json({
        error: { code: 'MISSING_REFRESH_TOKEN', message: 'Refresh token required' },
      });
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = (_req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
