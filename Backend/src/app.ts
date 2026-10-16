import express, { Application } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { generalApiLimiter } from './middleware/rateLimit';

/**
 * Creates and configures the Express application.
 */
export const createApp = (): Application => {
  const app = express();

  // Environment-based CORS configuration
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const allowedOrigins = [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman, or server-to-server)
        if (!origin) {
          return callback(null, true);
        }
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
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
