// src/modules/auth/auth.routes.js
import { Router } from 'express';
import * as authController from './auth.controller.js';
import validate       from '../../middleware/validate.middleware.js';
import authenticate   from '../../middleware/auth.middleware.js';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';
import { registerSchema, loginSchema } from './auth.validator.js';

const router = Router();

// Apply stricter rate limit to all auth routes
router.use(authLimiter);

router.post('/register', validate(registerSchema), authController.register);
router.post('/login',    validate(loginSchema),    authController.login);
router.post('/refresh',                            authController.refresh);
router.post('/logout',                             authController.logout);
router.get('/me',        authenticate,             authController.getMe);

export default router;
