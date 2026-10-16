import { Router } from 'express';
import * as resumeController from '../controllers/resumeController';
import { resumeUpload } from '../middleware/uploadMiddleware';
import { validate } from '../middleware/validateRequest';
import { uploadAndAnalysisLimiter } from '../middleware/rateLimit';
import { analyzeResumeBodySchema } from '../utils/validationSchemas';

const router = Router();

// POST /api/analyze-resume (or /api/resumes/analyze)
router.post(
  '/',
  uploadAndAnalysisLimiter,
  resumeUpload.single('resume'),
  validate(analyzeResumeBodySchema, 'body'),
  resumeController.analyzeResumeHandler
);

export default router;
