import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// Public: Submit admission enquiry
router.post('/', (req: Request, res: Response) => {
  try {
    const { student_name, dob, class_applying, parent_name, phone, email, address, message } = req.body;

    // Validation
    if (!student_name || typeof student_name !== 'string' || student_name.trim().length === 0) {
      res.status(400).json({ error: 'Student name is required' });
      return;
    }

    if (!class_applying || typeof class_applying !== 'string' || class_applying.trim().length === 0) {
      res.status(400).json({ error: 'Class applying for is required' });
      return;
    }

    if (!parent_name || typeof parent_name !== 'string' || parent_name.trim().length === 0) {
      res.status(400).json({ error: 'Parent / Guardian name is required' });
      return;
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      res.status(400).json({ error: 'A valid contact phone number is required' });
      return;
    }

    if (email && typeof email === 'string' && !email.includes('@')) {
      res.status(400).json({ error: 'Please provide a valid email address or leave blank' });
      return;
    }

    const insert = db.prepare(`
      INSERT INTO admission_enquiries (student_name, dob, class_applying, parent_name, phone, email, address, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `);

    const result = insert.run(
      student_name.trim(),
      dob || null,
      class_applying.trim(),
      parent_name.trim(),
      phone.trim(),
      email ? email.trim() : null,
      address ? address.trim() : null,
      message ? message.trim() : null
    );

    res.status(201).json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: 'Admission enquiry submitted successfully. The college admission desk will contact you soon.',
    });
  } catch (err: unknown) {
    console.error('Admission submit error:', err);
    res.status(500).json({ error: 'Failed to submit admission enquiry. Please try again or call the college office.' });
  }
});

// Admin: Get all admission enquiries
router.get('/all', requireAdmin, (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM admission_enquiries WHERE 1=1';
    const params: (string | number)[] = [];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(String(status));
    }

    if (search) {
      query += ' AND (student_name LIKE ? OR parent_name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC, id DESC';

    const enquiries = db.prepare(query).all(...params);

    // Summary counts
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM admission_enquiries').get() as { count: number };
    const newCount = db.prepare("SELECT COUNT(*) as count FROM admission_enquiries WHERE status = 'New'").get() as { count: number };
    const contactedCount = db.prepare("SELECT COUNT(*) as count FROM admission_enquiries WHERE status = 'Contacted'").get() as { count: number };
    const closedCount = db.prepare("SELECT COUNT(*) as count FROM admission_enquiries WHERE status = 'Closed'").get() as { count: number };

    res.json({
      enquiries,
      counts: {
        total: totalCount.count,
        new: newCount.count,
        contacted: contactedCount.count,
        closed: closedCount.count,
      },
    });
  } catch (err: unknown) {
    console.error('Admin admissions fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve admission enquiries' });
  }
});

// Admin: Update enquiry status & notes
router.put('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['New', 'Contacted', 'Closed'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status. Allowed values: New, Contacted, Closed' });
      return;
    }

    const update = db.prepare(`
      UPDATE admission_enquiries
      SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = datetime('now')
      WHERE id = ?
    `);

    const result = update.run(status || null, notes !== undefined ? notes : null, id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }

    res.json({ success: true, message: 'Admission enquiry updated successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

// Admin: Delete enquiry
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const result = db.prepare('DELETE FROM admission_enquiries WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err: unknown) {
    res.status(500).json({ error: 'Failed to delete enquiry' });
  }
});

export default router;
