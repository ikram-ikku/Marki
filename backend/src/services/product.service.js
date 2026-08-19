import prisma from '../config/prisma.js';

const productInclude = {
  variants: true,
  seller: {
    select: {
      id: true,
      storeName: true,
      storeLogo: true,
      verificationStatus: true
    }
  }
};

const createError = (message, status, code) => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

export const getSellerByUserId = (userId) => prisma.seller.findUnique({
  where: { userId },
  select: { id: true, verificationStatus: true }
});

export const createProduct = async (userId, productData) => {
  const seller = await getSellerByUserId(userId);

  if (!seller) {
    throw createError('Seller profile not found.', 403, 'SELLER_PROFILE_NOT_FOUND');
  }

  return prisma.product.create({
    data: {
      ...productData,
      sellerId: seller.id,
      variants: {
        create: productData.variants
      }
    },
    include: productInclude
  });
};

export const listProducts = async (user) => {
  if (user?.role === 'ADMIN') {
    return prisma.product.findMany({
      include: productInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  if (user?.role === 'SELLER') {
    const seller = await getSellerByUserId(user.id);

    if (!seller) {
      return [];
    }

    return prisma.product.findMany({
      where: { sellerId: seller.id },
      include: productInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  return prisma.product.findMany({
    where: { status: 'PUBLISHED' },
    include: productInclude,
    orderBy: { createdAt: 'desc' }
  });
};

export const getProductById = async (id, user) => {
  if (user?.role === 'ADMIN') {
    return prisma.product.findUnique({ where: { id }, include: productInclude });
  }

  if (user?.role === 'SELLER') {
    return prisma.product.findFirst({
      where: { id, seller: { userId: user.id } },
      include: productInclude
    });
  }

  return prisma.product.findFirst({
    where: { id, status: 'PUBLISHED' },
    include: productInclude
  });
};

const findOwnedProduct = (id, userId) => prisma.product.findFirst({
  where: { id, seller: { userId } },
  select: { id: true, price: true, mrp: true }
});

export const updateOwnedProduct = async (id, userId, productData) => {
  const product = await findOwnedProduct(id, userId);

  if (!product) {
    throw createError('Product not found or you do not own it.', 404, 'PRODUCT_NOT_FOUND');
  }

  const { variants, ...data } = productData;

  const nextPrice = data.price ?? product.price;
  const nextMrp = data.mrp ?? product.mrp;
  if (nextMrp.lessThan(nextPrice)) {
    throw createError('MRP must be greater than or equal to price.', 400, 'VALIDATION_ERROR');
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(variants && {
        variants: {
          deleteMany: {},
          create: variants
        }
      })
    },
    include: productInclude
  });
};

export const deleteOwnedProduct = async (id, userId) => {
  const product = await findOwnedProduct(id, userId);

  if (!product) {
    throw createError('Product not found or you do not own it.', 404, 'PRODUCT_NOT_FOUND');
  }

  await prisma.product.delete({ where: { id } });
  return { id };
};

export const updateOwnedProductStatus = async (id, userId, status) => {
  const product = await findOwnedProduct(id, userId);

  if (!product) {
    throw createError('Product not found or you do not own it.', 404, 'PRODUCT_NOT_FOUND');
  }

  return prisma.product.update({
    where: { id },
    data: { status },
    include: productInclude
  });
};
