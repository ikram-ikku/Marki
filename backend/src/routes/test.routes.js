import { Router } from 'express';
import { customerAccess, sellerAccess, adminAccess } from '../controllers/test.controller.js';
import { requireAdmin, requireAuth, requireSeller } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/customer', requireAuth, customerAccess);
router.get('/seller', requireAuth, requireSeller, sellerAccess);
router.get('/admin', requireAuth, requireAdmin, adminAccess);

export default router;
