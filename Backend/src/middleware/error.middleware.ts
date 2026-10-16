import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface CustomError extends Partial<Error> {
  statusCode?: number;
  code?: number | string;
  errors?: Record<string, unknown>[];
  keyPattern?: Record<string, unknown>;
  keyValue?: Record<string, unknown>;
}

/**
 * Centralized error-handling middleware.
 * Ensures consistent JSON error formatting and hides internal details in production.
 */
export const errorMiddleware = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: Record<string, unknown>[] | undefined = err.errors;

  // Handle Mongoose Invalid ObjectId CastError
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ID format for path '${err.path}'`;
  }

  // Handle Mongoose Validation Errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Database validation failed';
    errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedFields = Object.keys(err.keyPattern || err.keyValue || {}).join(', ');
    message = `Conflict: Duplicate value for field(s) [${duplicatedFields}]. Record already exists.`;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  const responsePayload: Record<string, unknown> = {
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(isProduction ? {} : { stack: err.stack }),
  };

  if (statusCode >= 500) {
    console.error(`[Server Error] ${statusCode} - ${err.message}`, err.stack);
  }

  res.status(statusCode).json(responsePayload);
};

export const errorHandler = errorMiddleware;
export default errorMiddleware;
