import { z } from 'zod';
import mongoose from 'mongoose';

export const objectIdSchema = z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid MongoDB ObjectId format.',
});

export const employmentTypeEnum = z.enum([
  'full-time',
  'part-time',
  'contract',
  'internship',
  'remote',
]);

export const jobStatusEnum = z.enum(['open', 'closed']);

export const applicationStatusEnum = z.enum(['pending', 'shortlisted', 'rejected', 'hired']);

export const salaryRangeSchema = z
  .object({
    min: z.number().min(0, 'Minimum salary must be non-negative.').optional(),
    max: z.number().min(0, 'Maximum salary must be non-negative.').optional(),
    currency: z.string().trim().min(1).default('USD'),
  })
  .refine(
    data => {
      if (data.min !== undefined && data.max !== undefined) {
        return data.min <= data.max;
      }
      return true;
    },
    { message: 'Minimum salary cannot exceed maximum salary.' }
  );

export const createJobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Job title must be at least 2 characters long.')
    .max(150, 'Job title cannot exceed 150 characters.'),
  company: z
    .string()
    .trim()
    .min(2, 'Company name must be at least 2 characters long.')
    .max(100, 'Company name cannot exceed 100 characters.'),
  description: z.string().trim().min(10, 'Job description must be at least 10 characters long.'),
  location: z.string().trim().min(2, 'Location must be at least 2 characters long.'),
  employmentType: employmentTypeEnum.default('full-time'),
  requiredSkills: z
    .array(z.string().trim().min(1, 'Skill cannot be empty.'))
    .min(1, 'At least one required skill is required.'),
  preferredSkills: z.array(z.string().trim()).optional().default([]),
  requirements: z.array(z.string().trim()).optional().default([]),
  responsibilities: z.array(z.string().trim()).optional().default([]),
  salaryRange: salaryRangeSchema.optional(),
  status: jobStatusEnum.default('open'),
});

export const updateJobSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Job title must be at least 2 characters long.')
      .max(150, 'Job title cannot exceed 150 characters.')
      .optional(),
    company: z
      .string()
      .trim()
      .min(2, 'Company name must be at least 2 characters long.')
      .max(100, 'Company name cannot exceed 100 characters.')
      .optional(),
    description: z
      .string()
      .trim()
      .min(10, 'Job description must be at least 10 characters long.')
      .optional(),
    location: z.string().trim().min(2, 'Location must be at least 2 characters long.').optional(),
    employmentType: employmentTypeEnum.optional(),
    requiredSkills: z
      .array(z.string().trim().min(1, 'Skill cannot be empty.'))
      .min(1, 'At least one required skill is required.')
      .optional(),
    preferredSkills: z.array(z.string().trim()).optional(),
    requirements: z.array(z.string().trim()).optional(),
    responsibilities: z.array(z.string().trim()).optional(),
    salaryRange: salaryRangeSchema.optional(),
    status: jobStatusEnum.optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update the job.',
  });

export const jobQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(100, 'Search query cannot exceed 100 characters.').optional(),
  status: jobStatusEnum.optional(),
  employmentType: employmentTypeEnum.optional(),
});

export const applyCandidateBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Candidate name must be at least 2 characters long.')
    .max(100, 'Name cannot exceed 100 characters.'),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.'),
  phone: z.string().trim().max(25, 'Phone number is too long.').optional(),
  jobId: objectIdSchema,
  notes: z.string().trim().max(2000, 'Notes cannot exceed 2000 characters.').optional(),
});

export const candidateQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  jobId: objectIdSchema.optional(),
  status: applicationStatusEnum.optional(),
});

export const updateCandidateStatusSchema = z.object({
  status: applicationStatusEnum,
});

export const updateCandidateNotesSchema = z.object({
  notes: z.string().trim().max(2000, 'Notes cannot exceed 2000 characters.'),
});

export const updateCandidateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Candidate name must be at least 2 characters long.')
      .max(100, 'Name cannot exceed 100 characters.')
      .optional(),
    email: z.string().trim().toLowerCase().email('Please enter a valid email address.').optional(),
    phone: z.string().trim().max(25, 'Phone number is too long.').optional(),
    notes: z.string().trim().max(2000, 'Notes cannot exceed 2000 characters.').optional(),
    status: applicationStatusEnum.optional(),
    applicationStatus: applicationStatusEnum.optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update candidate profile.',
  });

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
  role: z.enum(['recruiter', 'candidate']).default('candidate'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, 'Password is required'),
});

// ─── Resume Analysis Schema ───────────────────────────────────────────────────

export const analyzeResumeBodySchema = z.object({
  jobId: objectIdSchema.optional(),
  jobTitle: z.string().trim().optional(),
  requiredSkills: z
    .union([z.array(z.string().trim()), z.string()])
    .transform(val => {
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed.map(s => String(s).trim());
        } catch {
          return val
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        }
      }
      return val;
    })
    .refine(arr => Array.isArray(arr) && arr.length > 0, {
      message: 'At least one required skill must be provided for ATS analysis.',
    })
    .optional(),
  preferredSkills: z
    .union([z.array(z.string().trim()), z.string()])
    .transform(val => {
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed.map(s => String(s).trim());
        } catch {
          return val
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        }
      }
      return val;
    })
    .optional(),
  requirements: z
    .union([z.array(z.string().trim()), z.string()])
    .transform(val => {
      if (typeof val === 'string') {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return parsed.map(s => String(s).trim());
        } catch {
          return val
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        }
      }
      return val;
    })
    .optional(),
});
