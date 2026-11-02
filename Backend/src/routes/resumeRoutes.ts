import { Router } from 'express';
import * as resumeController from '../controllers/resumeController';
import { resumeUpload } from '../middleware/uploadMiddleware';
import { validate } from '../middleware/validateRequest';
import { uploadAndAnalysisLimiter, generalApiLimiter } from '../middleware/rateLimit';
import { analyzeResumeBodySchema } from '../utils/validationSchemas';

const router = Router();

// GET /api/analyze-resume/history
router.get('/history', generalApiLimiter, resumeController.getResumeHistoryHandler);

// DELETE /api/analyze-resume/history/:id
router.delete('/history/:id', generalApiLimiter, resumeController.deleteResumeHistoryHandler);

// DELETE /api/analyze-resume/history
router.delete('/history', generalApiLimiter, resumeController.clearResumeHistoryHandler);

// POST /api/analyze-resume (or /api/resumes/analyze)
router.post(
  '/',
  uploadAndAnalysisLimiter,
  resumeUpload.single('resume'),
  validate(analyzeResumeBodySchema, 'body'),
  resumeController.analyzeResumeHandler
);

// POST /api/resumes/analyze alias
router.post(
  '/analyze',
  uploadAndAnalysisLimiter,
  resumeUpload.single('resume'),
  validate(analyzeResumeBodySchema, 'body'),
  resumeController.analyzeResumeHandler
);

export default router;
