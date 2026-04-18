// src/modules/admin/admin.routes.js
// Mounted at /api/v1/admin
// ALL routes here require authentication + admin role
import { Router } from 'express';
import * as ctrl    from './admin.controller.js';
import authenticate from '../../middleware/auth.middleware.js';
import authorize    from '../../middleware/role.middleware.js';

const router = Router();

// Apply auth + admin guard to all admin routes at once
router.use(authenticate, authorize('admin'));

router.get('/users',              ctrl.listUsers);
router.delete('/users/:id',       ctrl.deleteUser);
router.get('/audit-logs',         ctrl.getAuditLogs);
router.get('/analytics/overview', ctrl.getAnalytics);

export default router;
