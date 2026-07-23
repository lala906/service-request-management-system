import { Router } from 'express';
import { requireAuth, isAdmin } from '../middleware/auth';
import { getDashboardStats } from '../controllers/adminController';

const router = Router();

router.get('/stats', requireAuth, isAdmin, getDashboardStats);

export default router;