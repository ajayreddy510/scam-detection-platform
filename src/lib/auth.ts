import jwt, { Secret } from 'jsonwebtoken';
import { UserPayload } from '@/types';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production_12345';
const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY } as any);
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
