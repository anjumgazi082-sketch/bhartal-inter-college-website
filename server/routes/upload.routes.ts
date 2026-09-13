import { Router, type Request, type Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { requireAdmin } from '../auth.js';

const router = Router();

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// POST /api/upload
// Accepts JSON with { filename: string, dataUrl: string } (base64 data URL)
router.post('/', requireAdmin, (req: Request, res: Response) => {
  try {
    const { filename, dataUrl } = req.body;
    if (!filename || !dataUrl) {
      res.status(400).json({ error: 'Filename and base64 dataUrl are required' });
      return;
    }

    // Parse base64 header
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      res.status(400).json({ error: 'Invalid base64 data URL format' });
      return;
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // Size limit: 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      res.status(400).json({ error: 'File size exceeds maximum allowed limit of 10MB' });
      return;
    }

    // Allowed mime types
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      res.status(400).json({ error: `File type "${mimeType}" is not supported. Please upload JPEG, PNG, WEBP, or PDF.` });
      return;
    }

    // Safe extension derivation
    const ext = path.extname(filename).toLowerCase() || (mimeType === 'application/pdf' ? '.pdf' : '.jpg');
    const sanitizedBase = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
    const uniqueId = crypto.randomBytes(6).toString('hex');
    const safeFilename = `${sanitizedBase}_${uniqueId}${ext}`;

    const filePath = path.join(uploadsDir, safeFilename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;
    res.json({
      success: true,
      fileUrl: publicUrl,
      filename: safeFilename,
      size: buffer.length,
      mimeType,
    });
  } catch (err: unknown) {
    console.error('File upload error:', err);
    res.status(500).json({ error: 'Failed to process file upload' });
  }
});

export default router;
