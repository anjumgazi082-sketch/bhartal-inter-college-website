import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Get downloads
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM downloads WHERE is_published = 1';
    const params: (string | number)[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(String(category));
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY date DESC, id DESC';

    const downloads = db.prepare(query).all(...params);

    const categoriesRows = db.prepare('SELECT DISTINCT category FROM downloads WHERE category IS NOT NULL').all() as Array<{ category: string }>;
    const categories = categoriesRows.map(c => c.category);

    res.json({ downloads, categories });
  } catch (err: unknown) {
    console.error('Downloads fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

// Admin: All downloads
router.get('/all', requireAdmin, (req: Request, res: Response) => {
  try {
    const downloads = db.prepare('SELECT * FROM downloads ORDER BY date DESC, id DESC').all();
    res.json({ downloads });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to retrieve downloads list' });
  }
});

// Admin: Add download
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, category, description, file_url, date, is_published } = req.body;
    if (!title || !file_url) {
      res.status(400).json({ error: 'Title and document/file are required' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO downloads (title, category, description, file_url, date, is_published)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      category || 'General',
      description || '',
      file_url,
      date || new Date().toISOString().split('T')[0],
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Document added to downloads',
    });
  } catch (err: unknown) {
    console.error('Download add error:', err);
    res.status(500).json({ error: 'Failed to add download' });
  }
});

// Admin: Update download
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, description, file_url, date, is_published } = req.body;

    if (!title || !file_url) {
      res.status(400).json({ error: 'Title and file are required' });
      return;
    }

    const update = db.prepare(`
      UPDATE downloads
      SET title = ?, category = ?, description = ?, file_url = ?, date = ?, is_published = ?
      WHERE id = ?
    `);

    const result = update.run(
      title,
      category || 'General',
      description || '',
      file_url,
      date || new Date().toISOString().split('T')[0],
      is_published ? 1 : 0,
      id
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Download item not found' });
      return;
    }

    res.json({ success: true, message: 'Document updated successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update download' });
  }
});

// Admin: Delete download
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM downloads WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
