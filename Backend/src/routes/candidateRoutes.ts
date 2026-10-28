import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import * as candidateController from '../controllers/candidateController';
import { resumeUpload } from '../middleware/uploadMiddleware';
import { validate } from '../middleware/validateRequest';
import { uploadAndAnalysisLimiter } from '../middleware/rateLimit';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import {
  applyCandidateBodySchema,
  candidateQuerySchema,
  updateCandidateStatusSchema,
  updateCandidateNotesSchema,
  updateCandidateSchema,
  objectIdSchema,
} from '../utils/validationSchemas';

const router = Router();

// Middleware ensuring MongoDB connection is active
const requireDb = (_req: Request, res: Response, next: NextFunction): void => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: 'Database service is unavailable. Please ensure MongoDB is running and connected.',
    });
    return;
  }
  next();
};

const idParamSchema = z.object({
  id: objectIdSchema,
});

const jobIdParamSchema = z.object({
  jobId: objectIdSchema,
});

router.use(requireDb);

// POST /api/candidates/apply - Submit application with resume upload
router.post(
  '/apply',
  uploadAndAnalysisLimiter,
  resumeUpload.single('resume'),
  validate(applyCandidateBodySchema, 'body'),
  candidateController.applyCandidateHandler
);

// POST /api/candidates/upload - Alias for apply endpoint for reference compatibility
router.post(
  '/upload',
  uploadAndAnalysisLimiter,
  resumeUpload.single('resume'),
  validate(applyCandidateBodySchema, 'body'),
  candidateController.applyCandidateHandler
);

/**
 * SECURITY NOTICE:
 * Recruiter candidate review, modification, and status management endpoints below
 * (GET /, GET /:id, GET /job/:jobId, PATCH /:id, PATCH /:id/status, PATCH /:id/notes, DELETE /:id)
 * are unauthenticated for local development and academic demonstration. They are strictly
 * UNSUITABLE for public production deployment without implementing authentication and role-based access control.
 */

// GET /api/candidates - List all candidates with pagination and filters (Recruiter only)
router.get(
  '/',
  authenticateToken,
  requireRole('recruiter'),
  validate(candidateQuerySchema, 'query'),
  candidateController.getCandidatesHandler
);

// GET /api/candidates/:id - Get single candidate details (Recruiter only)
router.get(
  '/:id',
  authenticateToken,
  requireRole('recruiter'),
  validate(idParamSchema, 'params'),
  candidateController.getCandidateByIdHandler
);

// GET /api/candidates/job/:jobId - Get candidates for a specific job ranked by ATS score (Recruiter only)
router.get(
  '/job/:jobId',
  authenticateToken,
  requireRole('recruiter'),
  validate(jobIdParamSchema, 'params'),
  candidateController.getCandidatesByJobHandler
);

// PATCH /api/candidates/:id - Update candidate profile/application details (Recruiter only)
router.patch(
  '/:id',
  authenticateToken,
  requireRole('recruiter'),
  validate(idParamSchema, 'params'),
  validate(updateCandidateSchema, 'body'),
  candidateController.updateCandidateHandler
);

// PATCH /api/candidates/:id/status - Update application status (shortlisted, rejected, hired) (Recruiter only)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole('recruiter'),
  validate(idParamSchema, 'params'),
  validate(updateCandidateStatusSchema, 'body'),
  candidateController.updateCandidateStatusHandler
);

// PATCH /api/candidates/:id/notes - Update recruiter notes (Recruiter only)
router.patch(
  '/:id/notes',
  authenticateToken,
  requireRole('recruiter'),
  validate(idParamSchema, 'params'),
  validate(updateCandidateNotesSchema, 'body'),
  candidateController.updateCandidateNotesHandler
);

// DELETE /api/candidates/:id - Delete candidate application (Recruiter only)
router.delete(
  '/:id',
  authenticateToken,
  requireRole('recruiter'),
  validate(idParamSchema, 'params'),
  candidateController.deleteCandidateHandler
);

export default router;
