import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Get gallery images & albums
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, album_id } = req.query;
    let query = 'SELECT g.*, a.title as album_title FROM gallery_images g LEFT JOIN gallery_albums a ON g.album_id = a.id WHERE 1=1';
    const params: (string | number)[] = [];

    if (category && category !== 'All') {
      query += ' AND g.category = ?';
      params.push(String(category));
    }

    if (album_id) {
      query += ' AND g.album_id = ?';
      params.push(Number(album_id));
    }

    query += ' ORDER BY g.display_order ASC, g.id DESC';

    const images = db.prepare(query).all(...params);
    const albums = db.prepare('SELECT * FROM gallery_albums ORDER BY display_order ASC, id ASC').all();

    const categories = [
      'School Events',
      'Annual Function',
      'Sports',
      'Cultural Activities',
      'Independence Day',
      'Republic Day',
      'Classroom',
      'Infrastructure',
      'Other'
    ];

    res.json({ images, albums, categories });
  } catch (err: unknown) {
    console.error('Gallery fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve gallery items' });
  }
});

// Public: Get albums
router.get('/albums', (req: Request, res: Response) => {
  try {
    const albums = db.prepare('SELECT * FROM gallery_albums ORDER BY display_order ASC, id ASC').all();
    res.json({ albums });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to retrieve albums' });
  }
});

// Admin: Add image
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { album_id, category, image_url, caption, display_order } = req.body;
    if (!image_url) {
      res.status(400).json({ error: 'Image URL or upload is required' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO gallery_images (album_id, category, image_url, caption, display_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      album_id ? Number(album_id) : null,
      category || 'Campus',
      image_url,
      caption || '',
      display_order !== undefined ? Number(display_order) : 0
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Image added to gallery',
    });
  } catch (err: unknown) {
    console.error('Gallery image add error:', err);
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

// Admin: Create album
router.post('/albums', requireAdmin, (req: Request, res: Response) => {
  try {
    const { title, category, cover_image, description, display_order } = req.body;
    if (!title) {
      res.status(400).json({ error: 'Album title is required' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO gallery_albums (title, category, cover_image, description, display_order)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      category || 'General',
      cover_image || '',
      description || '',
      display_order !== undefined ? Number(display_order) : 0
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Album created successfully',
    });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to create album' });
  }
});

// Admin: Delete image
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM gallery_images WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Admin: Delete album
router.delete('/albums/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM gallery_albums WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Album not found' });
      return;
    }
    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete album' });
  }
});

export default router;
