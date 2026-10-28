import { Router } from 'express';
import healthRoutes from './health.routes';
import jobRoutes from './jobRoutes';
import candidateRoutes from './candidateRoutes';
import resumeRoutes from './resumeRoutes';
import authRoutes from './authRoutes';

const router = Router();

// Authentication endpoints (/api/auth)
router.use('/auth', authRoutes);

// System health check endpoint (/api/health)
router.use('/health', healthRoutes);

// Job recruitment management endpoints (/api/jobs)
router.use('/jobs', jobRoutes);

// Candidate application endpoints (/api/candidates)
router.use('/candidates', candidateRoutes);

// Standalone resume parsing and ATS analysis endpoint (/api/analyze-resume)
router.use('/analyze-resume', resumeRoutes);

// Alias route for resume operations (/api/resumes)
router.use('/resumes', resumeRoutes);

export default router;
