/**
 * Candidate Registration Validation & Sanitization Layer
 * Strict schema enforcement for phone numbers, email format, and age limits.
 */
/**
 * Validation Schemas using Zod
 * Provides type-safe form validation for all user inputs
 */

import { z } from 'zod';
import { EXAM_CENTERS } from './types';

/**
 * Student Registration Form Validation Schema
 * Validates all fields required for exam registration including center selection
 */
export const registrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),

  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),

  dob: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 10 && age <= 100;
    }, 'Age must be between 10 and 100 years'),

  selectedCenter: z
    .string()
    .refine((center) => EXAM_CENTERS.includes(center as any), 'Please select a valid exam center'),
});

/**
 * Admit Card Verification Schema
 * Validates roll number and DOB for admit card access
 */
export const admitCardSchema = z.object({
  rollNumber: z
    .string()
    .regex(/^EXAM2026\d{4}$/, 'Invalid roll number format. Expected: EXAM2026XXXX'),

  dob: z
    .string()
    .min(1, 'Date of birth is required'),
});

/**
 * Admin Login Schema
 * Validates admin credentials
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

// Type exports for use with forms
export type RegistrationFormValues = z.infer<typeof registrationSchema>;
export type AdmitCardFormValues = z.infer<typeof admitCardSchema>;
export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

/**
 * Validates form data against a schema
 * Returns errors object if validation fails
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Convert Zod errors to simple key-value pairs
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    if (path && !errors[path]) {
      errors[path] = error.message;
    }
  });

  return { success: false, errors };
}
