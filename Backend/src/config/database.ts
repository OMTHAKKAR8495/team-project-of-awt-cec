import mongoose from 'mongoose';

/**
 * Strips password credentials from a MongoDB connection URI for safe logging.
 */
const sanitizeMongoUri = (uri: string): string => {
  try {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  } catch {
    return '[Protected Mongo URI]';
  }
};

/**
 * Connects to MongoDB with error handling and secure logging.
 */
export const connectDatabase = async (uri: string): Promise<typeof mongoose> => {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment configuration.');
  }

  const sanitizedUri = sanitizeMongoUri(uri);

  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: process.env.NODE_ENV !== 'production',
    });

    console.log(`[Database] MongoDB connected successfully to ${sanitizedUri}`);

    mongoose.connection.on('error', err => {
      console.error('[Database] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB disconnected.');
    });

    return connection;
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown database error';
    console.error(`[Database] Failed to connect to MongoDB at ${sanitizedUri}: ${errMessage}`);
    throw error;
  }
};

/**
 * Closes the MongoDB connection gracefully.
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('[Database] MongoDB connection closed gracefully.');
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Database] Error while closing MongoDB connection: ${errMessage}`);
  }
};
