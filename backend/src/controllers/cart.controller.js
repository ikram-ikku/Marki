import {
  addItemToCart,
  calculateSubtotal,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity
} from '../services/cart.service.js';

export const getMyCart = async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);
    const subtotal = calculateSubtotal(cart);
    return res.status(200).json({
      success: true,
      message: 'Cart retrieved successfully.',
      data: { ...cart, subtotal }
    });
  } catch (error) {
    return next(error);
  }
};

export const addItem = async (req, res, next) => {
  try {
    const { variantId, quantity } = req.body;
    
    if (!variantId) {
      const error = new Error('Variant ID is required.');
      error.status = 400;
      throw error;
    }

    const cart = await addItemToCart(req.user.id, variantId, quantity ? Number(quantity) : 1);
    const subtotal = calculateSubtotal(cart);
    return res.status(200).json({
      success: true,
      message: 'Item added to cart.',
      data: { ...cart, subtotal }
    });
  } catch (error) {
    return next(error);
  }
};

export const updateItemQuantity = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      const error = new Error('Quantity is required.');
      error.status = 400;
      throw error;
    }

    const cart = await updateCartItemQuantity(req.user.id, variantId, Number(quantity));
    const subtotal = calculateSubtotal(cart);
    return res.status(200).json({
      success: true,
      message: 'Cart item quantity updated.',
      data: { ...cart, subtotal }
    });
  } catch (error) {
    return next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const cart = await removeCartItem(req.user.id, variantId);
    const subtotal = calculateSubtotal(cart);
    return res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      data: { ...cart, subtotal }
    });
  } catch (error) {
    return next(error);
  }
};

export const clearMyCart = async (req, res, next) => {
  try {
    const cart = await clearCart(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Cart cleared.',
      data: { ...cart, subtotal: 0 }
    });
  } catch (error) {
    return next(error);
  }
};
