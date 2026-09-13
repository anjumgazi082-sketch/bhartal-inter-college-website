import { Router, type Request, type Response } from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';

const router = Router();

// GET /api/admin/stats
router.get('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const noticesCount = db.prepare('SELECT COUNT(*) as c FROM notices').get() as { c: number };
    const teachersCount = db.prepare('SELECT COUNT(*) as c FROM teachers').get() as { c: number };
    const eventsCount = db.prepare('SELECT COUNT(*) as c FROM events').get() as { c: number };
    const galleryCount = db.prepare('SELECT COUNT(*) as c FROM gallery_images').get() as { c: number };
    const downloadsCount = db.prepare('SELECT COUNT(*) as c FROM downloads').get() as { c: number };
    const resultsCount = db.prepare('SELECT COUNT(*) as c FROM results').get() as { c: number };
    const admissionsCount = db.prepare('SELECT COUNT(*) as c FROM admission_enquiries').get() as { c: number };
    const newAdmissionsCount = db.prepare("SELECT COUNT(*) as c FROM admission_enquiries WHERE status = 'New'").get() as { c: number };

    // Recent activity items
    const recentNotices = db.prepare('SELECT id, title, date, category FROM notices ORDER BY id DESC LIMIT 5').all();
    const recentEnquiries = db.prepare('SELECT id, student_name, class_applying, phone, status, created_at FROM admission_enquiries ORDER BY id DESC LIMIT 5').all();

    res.json({
      metrics: {
        totalNotices: noticesCount.c,
        totalTeachers: teachersCount.c,
        totalEvents: eventsCount.c,
        totalGalleryImages: galleryCount.c,
        totalDownloads: downloadsCount.c,
        totalResults: resultsCount.c,
        totalAdmissions: admissionsCount.c,
        newAdmissions: newAdmissionsCount.c,
      },
      recentNotices,
      recentEnquiries,
    });
  } catch (err: unknown) {
    console.error('Stats fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve administrative statistics' });
  }
});

export default router;
