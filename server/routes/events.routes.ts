import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Get events
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, all, search, limit } = req.query;
    let query = 'SELECT * FROM events WHERE 1=1';
    const params: (string | number)[] = [];

    if (all !== 'true') {
      query += ' AND is_published = 1';
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(String(category));
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY date DESC, id DESC';

    if (limit) {
      query += ' LIMIT ?';
      params.push(Number(limit));
    }

    const events = db.prepare(query).all(...params);

    const categoriesRows = db.prepare('SELECT DISTINCT category FROM events WHERE category IS NOT NULL').all() as Array<{ category: string }>;
    const categories = categoriesRows.map(c => c.category);

    res.json({ events, categories });
  } catch (err: unknown) {
    console.error('Events fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

// Single event
router.get('/:id', (req: Request, res: Response) => {
  try {
    const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!event) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ event });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to retrieve event' });
  }
});

// Admin: Add event
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, category, date, time, location, description, image_url, is_published } = req.body;
    if (!title || !date) {
      res.status(400).json({ error: 'Event title and date are required' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO events (title, category, date, time, location, description, image_url, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      category || 'Academic',
      date,
      time || '',
      location || 'College Campus',
      description || '',
      image_url || '',
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Event created successfully',
    });
  } catch (err: unknown) {
    console.error('Event create error:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Admin: Update event
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, date, time, location, description, image_url, is_published } = req.body;

    if (!title || !date) {
      res.status(400).json({ error: 'Event title and date are required' });
      return;
    }

    const update = db.prepare(`
      UPDATE events
      SET title = ?, category = ?, date = ?, time = ?, location = ?, description = ?, image_url = ?, is_published = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = update.run(
      title,
      category || 'Academic',
      date,
      time || '',
      location || 'College Campus',
      description || '',
      image_url || '',
      is_published ? 1 : 0,
      id
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ success: true, message: 'Event updated successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Admin: Delete event
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
