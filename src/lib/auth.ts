import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const TOKEN_EXPIRY = '24h';
const COOKIE_NAME = 'admin_session';

export interface AdminTokenPayload {
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Generates a signed JWT for admin sessions.
 */
export function generateAdminToken(email: string): string {
  return jwt.sign(
    { email, role: 'admin' } as AdminTokenPayload,
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

/**
 * Verifies the admin_session cookie JWT from the request.
 * Returns the payload if valid, null otherwise.
 */
export function verifyAdminToken(request: NextRequest): AdminTokenPayload | null {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;

    if (payload.role !== 'admin') return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Returns cookie options for admin_session.
 */
export function getAdminCookieOptions(maxAge?: number) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAge ?? 60 * 60 * 24, // 24 hours
  };
}

export { COOKIE_NAME };
