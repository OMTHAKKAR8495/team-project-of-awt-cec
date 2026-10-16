import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';
import { AppError } from './error.middleware';

// Safe destination directory outside any web-accessible public path
export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/resumes');

// Ensure directory exists synchronously on initialization
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 5 MB maximum file size limit
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx', '.txt']);

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueToken = crypto.randomBytes(16).toString('hex');
    const safeName = `resume-${Date.now()}-${uniqueToken}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(
      new AppError(
        `Unsupported file extension '${ext}'. Only .pdf, .docx, and .txt files are accepted.`,
        400
      )
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(
      new AppError(
        `Unsupported MIME type '${file.mimetype}'. Only PDF, DOCX, and TXT resumes are allowed.`,
        400
      )
    );
  }

  cb(null, true);
};

export const resumeUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter,
});

/**
 * Safely removes a file from disk if it exists.
 */
export const cleanupFile = async (filePath?: string): Promise<void> => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.warn(`[Cleanup Warning] Failed to delete file ${filePath}: ${msg}`);
  }
};
