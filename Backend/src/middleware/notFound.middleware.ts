import { Request, Response, NextFunction } from 'express';

/**
 * Catches unhandled routes and returns a standardized 404 JSON response.
 */
export const notFoundMiddleware = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Resource not found: Cannot ${req.method} ${req.originalUrl}`,
  });
};

export const notFound = notFoundMiddleware;
export default notFoundMiddleware;
