import prisma from '../config/prisma.js';

const createError = (message, status = 400, code = 'VALIDATION_ERROR') => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              seller: { select: { storeName: true } }
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  }
};

const ensureCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: cartInclude
    });
  }

  return cart;
};

export const getCart = async (userId) => {
  return ensureCart(userId);
};

export const addItemToCart = async (userId, variantId, quantity = 1) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw createError('Quantity must be a positive integer.');
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
    include: { product: true }
  });

  if (!variant) {
    throw createError('Product variant not found.', 404, 'NOT_FOUND');
  }

  if (variant.product.status !== 'PUBLISHED') {
    throw createError('Product is not available for purchase.', 400, 'UNAVAILABLE');
  }

  const cart = await ensureCart(userId);

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_variantId: {
        cartId: cart.id,
        variantId
      }
    }
  });

  const newQuantity = (existingItem?.quantity || 0) + quantity;

  if (variant.stock < newQuantity) {
    throw createError(`Not enough stock. Only ${variant.stock} available.`, 400, 'INSUFFICIENT_STOCK');
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity: newQuantity
      }
    });
  }

  return getCart(userId);
};

export const updateCartItemQuantity = async (userId, variantId, quantity) => {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw createError('Quantity must be a positive integer.');
  }

  const cart = await getCart(userId);
  const existingItem = cart.items.find(item => item.variantId === variantId);

  if (!existingItem) {
    throw createError('Item not found in cart.', 404, 'NOT_FOUND');
  }

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId }
  });

  if (!variant) {
    throw createError('Product variant not found.', 404, 'NOT_FOUND');
  }

  if (variant.stock < quantity) {
    throw createError(`Not enough stock. Only ${variant.stock} available.`, 400, 'INSUFFICIENT_STOCK');
  }

  await prisma.cartItem.update({
    where: { id: existingItem.id },
    data: { quantity }
  });

  return getCart(userId);
};

export const removeCartItem = async (userId, variantId) => {
  const cart = await getCart(userId);
  const existingItem = cart.items.find(item => item.variantId === variantId);

  if (!existingItem) {
    throw createError('Item not found in cart.', 404, 'NOT_FOUND');
  }

  await prisma.cartItem.delete({
    where: { id: existingItem.id }
  });

  return getCart(userId);
};

export const clearCart = async (userId) => {
  const cart = await getCart(userId);
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id }
  });
  return getCart(userId);
};

export const calculateSubtotal = (cart) => {
  return cart.items.reduce((total, item) => {
    const price = Number(item.variant.product.price);
    return total + (price * item.quantity);
  }, 0);
};
