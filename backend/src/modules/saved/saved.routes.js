// src/modules/saved/saved.routes.js
// Mounted at /api/v1/users
import { Router } from 'express';
import * as ctrl    from './saved.controller.js';
import authenticate from '../../middleware/auth.middleware.js';

const router = Router();

// All saved routes require a logged-in user
router.use(authenticate);

router.get('/me/saved',             ctrl.getSaved);
router.post('/me/saved/:aptId',     ctrl.save);
router.delete('/me/saved/:aptId',   ctrl.unsave);

export default router;
