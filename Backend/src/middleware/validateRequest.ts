import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './error.middleware';
import { cleanupFile } from './uploadMiddleware';

type RequestPart = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, part: RequestPart = 'body') => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync(req[part]);
      req[part] = parsed;
      next();
    } catch (error) {
      if (req.file?.path) {
        await cleanupFile(req.file.path);
      }
      if (Array.isArray(req.files)) {
        await Promise.all(req.files.map(f => cleanupFile(f.path)));
      } else if (req.files && typeof req.files === 'object') {
        const fileList = Object.values(req.files).flat();
        await Promise.all(fileList.map(f => cleanupFile(f.path)));
      }

      if (error instanceof ZodError) {
        const errors = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        const err = new AppError('Validation failed on request data.', 400);
        (err as unknown as { errors: Record<string, unknown>[] }).errors = errors;
        return next(err);
      }
      return next(error);
    }
  };
};

export default validate;
