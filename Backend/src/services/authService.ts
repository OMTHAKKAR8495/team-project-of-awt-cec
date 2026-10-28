import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';
import { AppError } from '../middleware/error.middleware';

const BCRYPT_ROUNDS = 10;

/**
 * Returns the JWT secret. Falls back to a dev-only default when not in production.
 * Throws if secret is missing in production to prevent insecure deployments.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new AppError('JWT_SECRET environment variable is not set.', 500);
    }
    // Non-production fallback — safe for local dev only
    return 'dev-only-jwt-secret-do-not-use-in-production';
  }
  return secret;
}

/**
 * Registers a new user: hashes password with bcrypt, persists User document.
 * Returns the saved user document (passwordHash excluded via schema transform).
 */
export async function register(
  name: string,
  email: string,
  password: string,
  role: 'recruiter' | 'candidate' = 'candidate'
): Promise<IUserDocument> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await User.create({ name, email, passwordHash, role });
  return user;
}

/**
 * Validates credentials and returns the user document on success.
 * Throws AppError(401) on invalid email or password.
 */
export async function login(email: string, password: string): Promise<IUserDocument> {
  // Explicitly select passwordHash since it is not returned by default
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  return user;
}

/**
 * Signs a JWT for the given user. Token expires in 7 days.
 */
export function generateToken(userId: string, role: string): string {
  const secret = getJwtSecret();
  return jwt.sign({ sub: userId, role }, secret, { expiresIn: '7d' });
}

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws AppError(401) if the token is missing, expired, or tampered.
 */
export function verifyToken(token: string): jwt.JwtPayload & { sub: string; role: string } {
  const secret = getJwtSecret();
  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload & { sub: string; role: string };
    return payload;
  } catch {
    throw new AppError('Invalid or expired token.', 401);
  }
}
