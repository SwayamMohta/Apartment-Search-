// src/modules/apartments/apartment.routes.js
import { Router } from 'express';
import * as ctrl  from './apartment.controller.js';
import validate       from '../../middleware/validate.middleware.js';
import authenticate   from '../../middleware/auth.middleware.js';
import authorize      from '../../middleware/role.middleware.js';
import upload         from '../../config/multer.js';
import { createApartmentSchema, updateApartmentSchema } from './apartment.validator.js';

const router = Router();

// ── Public routes (token optional — enhances isSaved flag if present) ─────────
router.get('/',            ctrl.listApartments);
router.get('/map/bounds',  ctrl.getApartmentsInBounds);
router.get('/map/radius',  ctrl.getApartmentsInRadius);
router.get('/:id',         ctrl.getApartmentById);
router.get('/:id/nearby-pois', ctrl.getNearbyPois);

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.post('/',
  authenticate, authorize('admin'),
  validate(createApartmentSchema),
  ctrl.createApartment
);

router.put('/:id',
  authenticate, authorize('admin'),
  validate(updateApartmentSchema),
  ctrl.updateApartment
);

router.delete('/:id',
  authenticate, authorize('admin'),
  ctrl.deleteApartment
);

router.delete('/:id/images/:imageId',
  authenticate, authorize('admin'),
  ctrl.deleteImage
);

export default router;
