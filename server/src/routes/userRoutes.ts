import { Router } from 'express';
import { requireAuth, isAdmin } from '../middleware/auth';

import {
  getAllUsers,
  toggleUserStatus,
  changeUserRole,
} from '../controllers/userController';

const router = Router();

router.get(
  '/',
  requireAuth,
  isAdmin,
  getAllUsers
);

router.patch(
  '/:id/status',
  requireAuth,
  isAdmin,
  toggleUserStatus
);

router.patch(
  '/:id/role',
  requireAuth,
  isAdmin,
  changeUserRole
);

export default router;