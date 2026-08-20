import { Router } from 'express';
import {
  addItem,
  clearMyCart,
  getMyCart,
  removeItem,
  updateItemQuantity
} from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getMyCart);
router.post('/items', addItem);
router.put('/items/:variantId', updateItemQuantity);
router.delete('/items/:variantId', removeItem);
router.delete('/', clearMyCart);

export default router;
