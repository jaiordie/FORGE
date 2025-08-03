import { Router } from 'express';
import { UserRole } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth';
import { getPlumberJobs } from '../controllers/jobController';
import {
  getPlumberDashboard,
  updateAvailability,
  updateJobPreferences
} from '../controllers/plumberController';

const router = Router();

// All plumber routes require authentication and plumber role
router.use(authenticate);
router.use(authorize(UserRole.PLUMBER));

router.get('/jobs', getPlumberJobs);
router.get('/dashboard', getPlumberDashboard);
router.put('/availability', updateAvailability);
router.put('/preferences', updateJobPreferences);

export default router;