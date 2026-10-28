import { Request, Response, NextFunction } from 'express';
import { User, IUserDocument } from '../models/User';
import { verifyToken } from '../services/authService';
import { AppError } from '../middleware/error.middleware';

// ─── Express Request Type Augmentation ────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

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

    const payload = verifyToken(token);

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
