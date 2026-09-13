import crypto from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { db } from './db.js';

const SECRET_KEY = process.env.SESSION_SECRET || 'bhartal-inter-college-secret-key-2026';

export interface AuthPayload {
  userId: number;
  username: string;
  role: string;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthPayload;
}

export function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
}

export function createToken(payload: { userId: number; username: string; role: string }): string {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days expiration
  const data: AuthPayload = { ...payload, exp };
  const encodedData = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(encodedData).digest('base64url');
  return `${encodedData}.${signature}`;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const [encodedData, signature] = token.split('.');
    if (!encodedData || !signature) return null;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(encodedData).digest('base64url');
    if (expectedSignature !== signature) return null;

    const payload: AuthPayload = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf-8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (payload) {
    req.user = payload;
  }
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please log in as administrator.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload || payload.role !== 'admin') {
    res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    return;
  }

  // Ensure user still exists in database
  const user = db.prepare('SELECT id, username, name, role FROM users WHERE id = ?').get(payload.userId);
  if (!user) {
    res.status(401).json({ error: 'User account not found.' });
    return;
  }

  req.user = payload;
  next();
}
