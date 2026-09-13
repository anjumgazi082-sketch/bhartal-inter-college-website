import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Get teachers (active only, or all for admin)
router.get('/', (req: Request, res: Response) => {
  try {
    const { all, search } = req.query;
    let query = 'SELECT * FROM teachers WHERE 1=1';
    const params: (string | number)[] = [];

    if (all !== 'true') {
      query += ' AND is_active = 1';
    }

    if (search) {
      query += ' AND (name LIKE ? OR subject LIKE ? OR designation LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY display_order ASC, id ASC';

    const teachers = db.prepare(query).all(...params);
    res.json({ teachers });
  } catch (err: unknown) {
    console.error('Teachers fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve faculty members' });
  }
});

// Admin: Add teacher
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { name, subject, qualification, designation, bio, photo_url, display_order, is_active } = req.body;
    if (!name || !subject) {
      res.status(400).json({ error: 'Teacher name and subject are required' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO teachers (name, subject, qualification, designation, bio, photo_url, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      name,
      subject,
      qualification || '',
      designation || 'Faculty Member',
      bio || '',
      photo_url || '',
      display_order !== undefined ? Number(display_order) : 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Faculty member added successfully',
    });
  } catch (err: unknown) {
    console.error('Teacher add error:', err);
    res.status(500).json({ error: 'Failed to add faculty member' });
  }
});

// Admin: Update teacher
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, subject, qualification, designation, bio, photo_url, display_order, is_active } = req.body;

    if (!name || !subject) {
      res.status(400).json({ error: 'Teacher name and subject are required' });
      return;
    }

    const update = db.prepare(`
      UPDATE teachers
      SET name = ?, subject = ?, qualification = ?, designation = ?, bio = ?, photo_url = ?, display_order = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = update.run(
      name,
      subject,
      qualification || '',
      designation || 'Faculty Member',
      bio || '',
      photo_url || '',
      Number(display_order || 0),
      is_active ? 1 : 0,
      id
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Teacher not found' });
      return;
    }

    res.json({ success: true, message: 'Faculty member updated successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update faculty member' });
  }
});

// Admin: Delete teacher
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM teachers WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Teacher not found' });
      return;
    }
    res.json({ success: true, message: 'Faculty member deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete faculty member' });
  }
});

export default router;
