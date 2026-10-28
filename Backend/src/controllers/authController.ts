import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { AppError } from '../middleware/error.middleware';

const COOKIE_NAME = 'jwt_token';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Shared helper that sets the HttpOnly JWT cookie on the response. */
function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

/**
 * POST /api/auth/register
 * Creates a new user account and returns a signed JWT.
 */
export const registerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: 'recruiter' | 'candidate';
    };

    const user = await authService.register(name, email, password, role ?? 'candidate');
    const token = authService.generateToken(String(user._id), user.role);

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Validates credentials and returns a signed JWT.
 */
export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const user = await authService.login(email, password);
    const token = authService.generateToken(String(user._id), user.role);

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 * Clears the JWT cookie and invalidates the session client-side.
 */
export const logoutHandler = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (populated by authenticateToken middleware).
 */
export const getMeHandler = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    res.status(200).json({
      success: true,
      data: { user: req.user.toJSON() },
    });
  } catch (err) {
    next(err);
  }
};
