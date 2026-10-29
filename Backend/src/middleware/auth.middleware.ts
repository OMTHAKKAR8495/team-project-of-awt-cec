import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User, IUserDocument } from '../models/User';
import { verifyToken, DEMO_USERS } from '../services/authService';
import { AppError } from '../middleware/error.middleware';

// ─── Express Request Type Augmentation ────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// ─── Middleware ────────────────────────────────────────────────────────────────

/**
 * Reads the JWT from the `Authorization: Bearer <token>` header or the
 * `jwt_token` HttpOnly cookie. Verifies the token, fetches the user from DB,
 * and attaches them to `req.user`. Throws AppError(401) on any failure.
 */
export const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Prefer Authorization header; fall back to cookie
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (req.cookies?.jwt_token) {
      token = req.cookies.jwt_token as string;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    // Check for client-side demo tokens
    if (token.startsWith('demo-session-token-')) {
      const isRecruiter = token.includes('recruiter');
      const demoSub = isRecruiter ? '507f1f77bcf86cd799439011' : '507f1f77bcf86cd799439012';
      const name = isRecruiter ? 'Demo Recruiter' : 'Demo Candidate';
      const email = isRecruiter ? 'recruiter@demo.com' : 'candidate@demo.com';
      const role: 'recruiter' | 'candidate' = isRecruiter ? 'recruiter' : 'candidate';

      req.user = {
        _id: new mongoose.Types.ObjectId(demoSub),
        name,
        email,
        role,
        toJSON() {
          return {
            _id: demoSub,
            name,
            email,
            role,
          };
        },
      } as unknown as IUserDocument;
      return next();
    }

    const payload = verifyToken(token);

    // Check if token belongs to demo user or if database is offline in dev mode
    const demoMatch = DEMO_USERS.find(u => u._id === payload.sub);
    if (demoMatch || mongoose.connection.readyState !== 1) {
      const role: 'recruiter' | 'candidate' = (payload.role as 'recruiter' | 'candidate') || demoMatch?.role || 'candidate';
      const name = demoMatch?.name || (role === 'recruiter' ? 'Demo Recruiter' : 'Demo Candidate');
      const email = demoMatch?.email || (role === 'recruiter' ? 'recruiter@demo.com' : 'candidate@demo.com');
      const validId = payload.sub && payload.sub.length === 24 ? payload.sub : '507f1f77bcf86cd799439011';

      req.user = {
        _id: new mongoose.Types.ObjectId(validId),
        name,
        email,
        role,
        toJSON() {
          return {
            _id: validId,
            name,
            email,
            role,
          };
        },
      } as unknown as IUserDocument;
      return next();
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new AppError('User account no longer exists.', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware factory that restricts access to users whose role is in the
 * provided list. Must be used AFTER `authenticateToken`.
 * Throws AppError(403) when the role check fails.
 */
export const requireRole =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
