import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { UserRole } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import {
  createJob,
  submitQuote,
  updateJobStatus,
  uploadJobPhoto,
  createReview
} from '../controllers/jobController';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Job routes
router.post('/', authenticate, authorize(UserRole.DISPATCHER, UserRole.HOMEOWNER), createJob);
router.post('/:id/quote', authenticate, authorize(UserRole.PLUMBER), submitQuote);
router.post('/:id/status', authenticate, updateJobStatus);
router.post('/:id/photo', authenticate, upload.single('photo'), uploadJobPhoto);
router.post('/:id/review', authenticate, authorize(UserRole.HOMEOWNER), createReview);

export default router;