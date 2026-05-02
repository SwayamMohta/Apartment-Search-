// src/app.js
// Express app factory — registers all middleware and routes.
// Exported for testing. Server binding is in server.js.
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import env from './config/env.js';
import logger from './utils/logger.js';
import { globalLimiter } from './middleware/rateLimit.middleware.js';
import errorHandler from './middleware/errorHandler.middleware.js';

// Route modules
import authRoutes       from './modules/auth/auth.routes.js';
import apartmentRoutes  from './modules/apartments/apartment.routes.js';
import savedRoutes      from './modules/saved/saved.routes.js';
import adminRoutes      from './modules/admin/admin.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const createApp = () => {
  const app = express();

  // ── Security headers ─────────────────────────────────────────────
  app.use(helmet());

  // ── CORS ─────────────────────────────────────────────────────────
  app.use(cors({
    origin: env.FRONTEND_URL.replace(/\/$/, ''), // Strip trailing slash if present
    credentials: true,                      // allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ── Body parsing ─────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ── HTTP request logging ─────────────────────────────────────────
  app.use(morgan('dev', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));

  // ── Global rate limit ────────────────────────────────────────────
  app.use(globalLimiter);

  // ── Static uploads (dev only) ────────────────────────────────────
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // ── Health check ─────────────────────────────────────────────────
  app.get('/health', (_req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  );

  // ── API Routes ───────────────────────────────────────────────────
  app.use('/api/v1/auth',       authRoutes);
  app.use('/api/v1/apartments', apartmentRoutes);
  app.use('/api/v1/users',      savedRoutes);
  app.use('/api/v1/admin',      adminRoutes);

  // ── 404 handler ──────────────────────────────────────────────────
  app.use((req, res) => {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
    });
  });

  // ── Central error handler (must be last) ─────────────────────────
  app.use(errorHandler);

  return app;
};

export default createApp;
