import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import * as jobController from '../controllers/jobController';
import { validate } from '../middleware/validateRequest';
import {
  createJobSchema,
  updateJobSchema,
  jobQuerySchema,
  objectIdSchema,
} from '../utils/validationSchemas';

const router = Router();

// Middleware ensuring MongoDB connection is active for database-backed operations
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

router.use(requireDb);

// GET /api/jobs - List jobs with search, filtering, and pagination
router.get('/', validate(jobQuerySchema, 'query'), jobController.getJobsHandler);

// GET /api/jobs/:id - Retrieve single job
router.get('/:id', validate(idParamSchema, 'params'), jobController.getJobByIdHandler);

// POST /api/jobs - Create new job posting
router.post('/', validate(createJobSchema, 'body'), jobController.createJobHandler);

// PUT /api/jobs/:id - Update existing job
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateJobSchema, 'body'),
  jobController.updateJobHandler
);

// DELETE /api/jobs/:id - Delete job
router.delete('/:id', validate(idParamSchema, 'params'), jobController.deleteJobHandler);

export default router;
