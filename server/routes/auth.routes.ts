import { Router, type Response } from 'express';
import crypto from 'node:crypto';
import { db } from '../db.js';
import { verifyPassword, hashPassword, createToken, requireAdmin, type AuthenticatedRequest } from '../auth.js';

const router = Router();

// Login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as {
      id: number;
      username: string;
      password_hash: string;
      salt: string;
      name: string;
      role: string;
    } | undefined;

    if (!user) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const token = createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

// Current user profile
router.get('/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT id, username, name, role, created_at FROM users WHERE id = ?').get(req.user!.userId) as {
      id: number;
      username: string;
      name: string;
      role: string;
      created_at: string;
    } | undefined;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Change Password
router.post('/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long' });
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.userId) as {
      id: number;
      password_hash: string;
      salt: string;
    } | undefined;

    if (!user || !verifyPassword(currentPassword, user.password_hash, user.salt)) {
      res.status(400).json({ error: 'Incorrect current password' });
      return;
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPassword, newSalt);

    db.prepare(`
      UPDATE users SET password_hash = ?, salt = ?, updated_at = datetime('now') WHERE id = ?
    `).run(newHash, newSalt, user.id);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

export default router;
