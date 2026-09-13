import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Get results
router.get('/', (req: Request, res: Response) => {
  try {
    const { year, class_name, examination, all } = req.query;
    let query = 'SELECT * FROM results WHERE 1=1';
    const params: (string | number)[] = [];

    if (all !== 'true') {
      query += ' AND is_published = 1';
    }

    if (year && year !== 'All') {
      query += ' AND academic_year = ?';
      params.push(String(year));
    }

    if (class_name && class_name !== 'All') {
      query += ' AND class_name = ?';
      params.push(String(class_name));
    }

    if (examination && examination !== 'All') {
      query += ' AND examination = ?';
      params.push(String(examination));
    }

    query += ' ORDER BY academic_year DESC, id DESC';

    const results = db.prepare(query).all(...params);

    // Filters lists
    const yearsRows = db.prepare('SELECT DISTINCT academic_year FROM results').all() as Array<{ academic_year: string }>;
    const classesRows = db.prepare('SELECT DISTINCT class_name FROM results').all() as Array<{ class_name: string }>;
    const examsRows = db.prepare('SELECT DISTINCT examination FROM results').all() as Array<{ examination: string }>;

    res.json({
      results,
      years: yearsRows.map(y => y.academic_year),
      classes: classesRows.map(c => c.class_name),
      examinations: examsRows.map(e => e.examination),
    });
  } catch (err: unknown) {
    console.error('Results fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
});

// Admin: Add result
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { academic_year, examination, class_name, title, description, pdf_url, external_url, is_published } = req.body;
    if (!academic_year || !examination || !class_name || !title) {
      res.status(400).json({ error: 'Academic year, examination, class, and title are required' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO results (academic_year, examination, class_name, title, description, pdf_url, external_url, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      academic_year,
      examination,
      class_name,
      title,
      description || '',
      pdf_url || null,
      external_url || null,
      is_published !== undefined ? (is_published ? 1 : 0) : 1
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Result notice published successfully',
    });
  } catch (err: unknown) {
    console.error('Result add error:', err);
    res.status(500).json({ error: 'Failed to publish result' });
  }
});

// Admin: Update result
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { academic_year, examination, class_name, title, description, pdf_url, external_url, is_published } = req.body;

    if (!academic_year || !examination || !class_name || !title) {
      res.status(400).json({ error: 'Academic year, examination, class, and title are required' });
      return;
    }

    const update = db.prepare(`
      UPDATE results
      SET academic_year = ?, examination = ?, class_name = ?, title = ?, description = ?, pdf_url = ?, external_url = ?, is_published = ?
      WHERE id = ?
    `);

    const result = update.run(
      academic_year,
      examination,
      class_name,
      title,
      description || '',
      pdf_url || null,
      external_url || null,
      is_published ? 1 : 0,
      id
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Result entry not found' });
      return;
    }

    res.json({ success: true, message: 'Result entry updated successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update result entry' });
  }
});

// Admin: Delete result
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM results WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Result entry not found' });
      return;
    }
    res.json({ success: true, message: 'Result entry deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete result' });
  }
});

export default router;
