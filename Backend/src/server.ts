import './config/env';
import http from 'http';
import app from './app';
import { connectDatabase, disconnectDatabase } from './config/database';

interface ServerConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  frontendUrl: string;
}

/**
 * Validates required environment variables and returns sanitized configuration.
 */
const validateConfig = (): ServerConfig => {
  const port = parseInt(process.env.PORT || '5000', 10);
  const nodeEnv = process.env.NODE_ENV || 'development';
  const mongoUri = process.env.MONGODB_URI || '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  const missingVariables: string[] = [];
  if (!mongoUri) {
    missingVariables.push('MONGODB_URI');
  }

  if (missingVariables.length > 0) {
    console.error(
      `[Startup Error] Missing required environment variable(s): ${missingVariables.join(', ')}`
    );
    console.error(
      '[Startup Error] Please copy Backend/.env.example to Backend/.env and configure valid connection details.'
    );
    throw new Error(`Missing environment variables: ${missingVariables.join(', ')}`);
  }

  return { port, nodeEnv, mongoUri, frontendUrl };
};

let serverInstance: http.Server | null = null;

/**
 * Gracefully shuts down HTTP server and database connections.
 */
const handleGracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n[Shutdown] Received ${signal}. Initiating graceful shutdown...`);

  if (serverInstance) {
    serverInstance.close(async () => {
      console.log('[Shutdown] HTTP server closed.');
      await disconnectDatabase();
      console.log('[Shutdown] All connections terminated cleanly. Exiting.');
      process.exit(0);
    });

    // Force exit if shutdown hangs after 10 seconds
    setTimeout(() => {
      console.error('[Shutdown] Forced termination due to timeout.');
      process.exit(1);
    }, 10000);
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
};

/**
 * Initializes database connection and starts HTTP listener.
 */
export const startServer = async (): Promise<http.Server> => {
  try {
    const config = validateConfig();

    console.log(`[Startup] Environment: ${config.nodeEnv}`);
    console.log(`[Startup] Connecting to database...`);

    // Attempt database connection
    try {
      await connectDatabase(config.mongoUri);
    } catch (dbError) {
      if (config.nodeEnv === 'production') {
        throw dbError;
      }
      const msg = dbError instanceof Error ? dbError.message : 'Unknown database error';
      console.warn(`[Startup Warning] Database offline in development (${msg}).`);
      console.warn(
        '[Startup Warning] Server starting in development mode for endpoint & UI testing.'
      );
    }

    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`🚀 Backend Server listening on port ${config.port}`);
      console.log(`📡 Health Check URL: http://localhost:${config.port}/api/health`);
      console.log(`🔗 Allowed Frontend: ${config.frontendUrl}`);
      console.log(`====================================================`);
    });

    serverInstance = server;

    process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

    return server;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown startup error';
    console.error(`[Startup Fatal Error] Server failed to start: ${message}`);
    process.exit(1);
  }
};

// Start server if executed directly
if (require.main === module) {
  startServer();
}

export default startServer;
