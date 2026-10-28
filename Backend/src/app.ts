import './config/env';
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRouter from './routes';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { generalApiLimiter } from './middleware/rateLimit';

/**
 * Creates and configures the Express application.
 */
export const createApp = (): Application => {
  const app = express();

  // Dynamic Environment-based CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman, or server-to-server)
        if (!origin) {
          return callback(null, true);
        }

        const isProduction = process.env.NODE_ENV === 'production';
        if (!isProduction) {
          // Preserve development behavior: allow local origins and active dev testing
          return callback(null, true);
        }

        // In production, strictly restrict origins to configured FRONTEND_URL
        const configuredFrontend = process.env.FRONTEND_URL || '';
        const allowedOrigins = configuredFrontend
          .split(',')
          .map(url => url.trim())
          .filter(Boolean);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Body parsing middleware with size limits to prevent payload exhaustion
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(cookieParser());

  // Root welcome endpoint
  app.get('/', (_req, res) => {
    res.status(200).json({
      message: 'College Group Project Backend API is running.',
      healthCheck: '/api/health',
    });
  });

  // Apply general API rate limiting
  app.use('/api', generalApiLimiter);

  // Mount API router (includes /api/health)
  app.use('/api', apiRouter);

  // Catch-all 404 handler for undefined routes
  app.use(notFoundMiddleware);

  // Centralized error handling
  app.use(errorMiddleware);

  return app;
};

export const app = createApp();
export default app;
