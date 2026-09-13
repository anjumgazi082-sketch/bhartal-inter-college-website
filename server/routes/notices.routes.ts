import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Get published notices (admin can get all with ?all=true)
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, search, limit, offset, all } = req.query;

    let query = 'SELECT * FROM notices WHERE 1=1';
    const params: (string | number)[] = [];

    if (all !== 'true') {
      query += ' AND is_published = 1';
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(String(category));
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY date DESC, id DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(Number(limit));
      if (offset) {
        query += ' OFFSET ?';
        params.push(Number(offset));
      }
    }

    const notices = db.prepare(query).all(...params);

    // Get categories
    const categoriesRows = db.prepare('SELECT DISTINCT category FROM notices WHERE category IS NOT NULL').all() as Array<{ category: string }>;
    const categories = categoriesRows.map(c => c.category);

    res.json({ notices, categories });
  } catch (err: unknown) {
    console.error('Notices fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve notices' });
  }
});

// Public: Single notice
router.get('/:id', (req: Request, res: Response) => {
  try {
    const notice = db.prepare('SELECT * FROM notices WHERE id = ?').get(req.params.id);
    if (!notice) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }
    res.json({ notice });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to retrieve notice' });
  }
});

// Admin: Create notice
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, category, description, date, pdf_url, is_published } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Notice title is required' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO notices (title, category, description, date, pdf_url, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      category || 'General',
      description || '',
      date || new Date().toISOString().split('T')[0],
      pdf_url || null,
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Notice created successfully',
    });
  } catch (err: unknown) {
    console.error('Notice create error:', err);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Admin: Update notice
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, description, date, pdf_url, is_published } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Notice title is required' });
      return;
    }

    const update = db.prepare(`
      UPDATE notices
      SET title = ?, category = ?, description = ?, date = ?, pdf_url = ?, is_published = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = update.run(
      title,
      category || 'General',
      description || '',
      date || new Date().toISOString().split('T')[0],
      pdf_url || null,
      is_published ? 1 : 0,
      id
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }

    res.json({ success: true, message: 'Notice updated successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update notice' });
  }
});

// Admin: Delete notice
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM notices WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Notice not found' });
      return;
    }
    res.json({ success: true, message: 'Notice deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

export default router;
