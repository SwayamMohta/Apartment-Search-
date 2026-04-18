// src/modules/apartments/apartment.validator.js
import { z } from 'zod';

const coordsSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const createApartmentSchema = z.object({
  title:       z.string().min(3).max(255),
  description: z.string().max(5000).optional(),
  location:    z.string().min(3).max(255),
  price:       z.number().positive('Price must be a positive number'),
  beds:        z.number().int().min(0).max(20),
  baths:       z.number().int().min(0).max(20),
  area:        z.number().int().positive().optional(),
  rating:      z.number().min(0).max(5).optional(),
  coords:      coordsSchema,
  amenities:   z.array(z.string()).optional().default([]),
  images:      z.array(z.string().url()).optional().default([]),
});

export const updateApartmentSchema = createApartmentSchema.partial();
