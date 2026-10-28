import { Router } from 'express';
import { validate } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  getMeHandler,
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// POST /api/auth/register — create new account
router.post('/register', validate(registerSchema, 'body'), registerHandler);

// POST /api/auth/login — authenticate and receive JWT
router.post('/login', validate(loginSchema, 'body'), loginHandler);

// POST /api/auth/logout — clear session cookie (requires valid JWT)
router.post('/logout', authenticateToken, logoutHandler);

// GET /api/auth/me — return current authenticated user profile
router.get('/me', authenticateToken, getMeHandler);

export default router;
