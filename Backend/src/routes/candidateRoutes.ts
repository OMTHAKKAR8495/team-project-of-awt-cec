import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import * as candidateController from '../controllers/candidateController';
import { resumeUpload } from '../middleware/uploadMiddleware';
import { validate } from '../middleware/validateRequest';
import { uploadAndAnalysisLimiter } from '../middleware/rateLimit';
import {
  applyCandidateBodySchema,
  candidateQuerySchema,
  updateCandidateStatusSchema,
  updateCandidateNotesSchema,
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

// GET /api/candidates - List all candidates with pagination and filters
router.get('/', validate(candidateQuerySchema, 'query'), candidateController.getCandidatesHandler);

// GET /api/candidates/:id - Get single candidate details
router.get('/:id', validate(idParamSchema, 'params'), candidateController.getCandidateByIdHandler);

// GET /api/candidates/job/:jobId - Get candidates for a specific job ranked by ATS score
router.get(
  '/job/:jobId',
  validate(jobIdParamSchema, 'params'),
  candidateController.getCandidatesByJobHandler
);

// PATCH /api/candidates/:id/status - Update application status (shortlisted, rejected, hired)
router.patch(
  '/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateCandidateStatusSchema, 'body'),
  candidateController.updateCandidateStatusHandler
);

// PATCH /api/candidates/:id/notes - Update recruiter notes
router.patch(
  '/:id/notes',
  validate(idParamSchema, 'params'),
  validate(updateCandidateNotesSchema, 'body'),
  candidateController.updateCandidateNotesHandler
);

export default router;
