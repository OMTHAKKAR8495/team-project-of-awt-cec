import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

const getDatabaseStatus = (): string => {
  switch (mongoose.connection.readyState) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

/**
 * Health check endpoint for system monitoring, Render health checks, and frontend verification.
 * GET /api/health
 */
router.get('/', (_req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'college-group-project-api',
    database: {
      status: dbStatus,
      ready: dbStatus === 'connected',
    },
  });
});

export default router;
