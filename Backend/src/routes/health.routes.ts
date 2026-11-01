import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { isSupabaseReady } from '../config/supabase';

const router = Router();

const getDatabaseInfo = () => {
  if (isSupabaseReady()) {
    return {
      status: 'connected',
      provider: 'supabase',
      ready: true,
    };
  }

  const isMongoConnected = mongoose.connection.readyState === 1;
  const status = isMongoConnected
    ? 'connected'
    : mongoose.connection.readyState === 2
    ? 'connecting'
    : 'disconnected';

  return {
    status,
    provider: 'mongodb',
    ready: isMongoConnected,
  };
};

/**
 * Health check endpoint for system monitoring, Render health checks, and frontend verification.
 * GET /api/health
 */
router.get('/', (_req: Request, res: Response) => {
  const dbInfo = getDatabaseInfo();

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'college-group-project-api',
    database: dbInfo,
  });
});

export default router;
