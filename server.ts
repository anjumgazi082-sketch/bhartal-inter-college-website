import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { initDatabase } from './server/db.js';
import { authenticateUser } from './server/auth.js';

import authRouter from './server/routes/auth.routes.js';
import settingsRouter from './server/routes/settings.routes.js';
import noticesRouter from './server/routes/notices.routes.js';
import teachersRouter from './server/routes/teachers.routes.js';
import eventsRouter from './server/routes/events.routes.js';
import galleryRouter from './server/routes/gallery.routes.js';
import downloadsRouter from './server/routes/downloads.routes.js';
import resultsRouter from './server/routes/results.routes.js';
import admissionsRouter from './server/routes/admissions.routes.js';
import uploadRouter from './server/routes/upload.routes.js';
import statsRouter from './server/routes/stats.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite database schema and initial seed data
  try {
    initDatabase();
    console.log('[Server] Database initialized successfully.');
  } catch (err) {
    console.error('[Server] Database initialization warning:', err);
  }

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));
  app.use(authenticateUser);

  // Serve static public assets & uploaded files
  const publicDir = path.join(process.cwd(), 'public');
  app.use(express.static(publicDir));
  app.use('/uploads', express.static(path.join(publicDir, 'uploads')));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', school: 'Bhartal Inter College', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/notices', noticesRouter);
  app.use('/api/teachers', teachersRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/gallery', galleryRouter);
  app.use('/api/downloads', downloadsRouter);
  app.use('/api/results', resultsRouter);
  app.use('/api/admissions', admissionsRouter);
  app.use('/api/admin/admissions', admissionsRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/admin/stats', statsRouter);

  // 404 for unmatched API routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Server] Vite middleware attached for development.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[Server] Production static handler attached.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bhartal Inter College Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup failure:', err);
});
