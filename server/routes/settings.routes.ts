import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Get all school settings
router.get('/', (req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT key, value FROM school_settings').all() as Array<{ key: string; value: string }>;
    const settings: Record<string, unknown> = {};

    for (const row of rows) {
      try {
        // Parse JSON fields if applicable
        if (row.value.startsWith('{') || row.value.startsWith('[')) {
          settings[row.key] = JSON.parse(row.value);
        } else {
          settings[row.key] = row.value;
        }
      } catch {
        settings[row.key] = row.value;
      }
    }

    res.json({ settings });
  } catch (err: unknown) {
    console.error('Settings fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve school settings' });
  }
});

// Admin: Update school settings
router.put('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const newSettings = req.body;
    if (!newSettings || typeof newSettings !== 'object') {
      res.status(400).json({ error: 'Invalid settings payload' });
      return;
    }

    const upsertStmt = db.prepare(`
      INSERT INTO school_settings (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
    `);

    for (const [key, val] of Object.entries(newSettings)) {
      const stringValue = typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '');
      upsertStmt.run(key, stringValue);
    }

    res.json({ success: true, message: 'School settings updated successfully' });
  } catch (err: unknown) {
    console.error('Settings update error:', err);
    res.status(500).json({ error: 'Failed to update school settings' });
  }
});

export default router;
