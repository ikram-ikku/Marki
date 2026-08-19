import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
  updateProductStatus
} from '../controllers/product.controller.js';
import { optionalAuth, requireAuth, requireSeller } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', optionalAuth, listProducts);
router.get('/:id', optionalAuth, getProduct);
router.post('/', requireAuth, requireSeller, createProduct);
router.put('/:id', requireAuth, requireSeller, updateProduct);
router.delete('/:id', requireAuth, requireSeller, deleteProduct);
router.patch('/:id/status', requireAuth, requireSeller, updateProductStatus);

export default router;
