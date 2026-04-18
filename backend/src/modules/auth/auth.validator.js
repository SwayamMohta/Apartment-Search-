// src/modules/auth/auth.validator.js
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
    .regex(/[0-9]/, 'Password must contain at least one number (0-9)'),
  full_name: z.string().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email:    z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
