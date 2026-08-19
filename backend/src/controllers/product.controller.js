import {
  createProduct as createProductService,
  deleteOwnedProduct,
  getProductById,
  listProducts as listProductsService,
  updateOwnedProduct,
  updateOwnedProductStatus
} from '../services/product.service.js';

const createError = (message, status = 400, code = 'VALIDATION_ERROR') => {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
};

const normalizeString = (value) => typeof value === 'string' ? value.trim() : value;

const parseDecimal = (value, fieldName, { required = false, minimum = 0 } = {}) => {
  if (value === undefined || value === null || value === '') {
    if (required) {
      throw createError(`${fieldName} is required.`);
    }
    return undefined;
  }

  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum) {
    throw createError(`${fieldName} must be a number greater than or equal to ${minimum}.`);
  }

  return number;
};

const validateVariants = (variants, { required = false } = {}) => {
  if (variants === undefined) {
    if (required) {
      throw createError('At least one product variant is required.');
    }
    return undefined;
  }

  if (!Array.isArray(variants) || variants.length === 0) {
    throw createError('Variants must be a non-empty array.');
  }

  const sizes = new Set();
  const skus = new Set();

  return variants.map((variant, index) => {
    const size = normalizeString(variant?.size);
    const sku = normalizeString(variant?.sku);
    const stock = variant?.stock;

    if (!size) {
      throw createError(`Variant ${index + 1} size is required.`);
    }

    if (!sku) {
      throw createError(`Variant ${index + 1} SKU is required.`);
    }

    if (!Number.isInteger(stock) || stock < 0) {
      throw createError(`Variant ${index + 1} stock must be a non-negative integer.`);
    }

    if (sizes.has(size)) {
      throw createError('Each variant size must be unique for a product.');
    }

    if (skus.has(sku)) {
      throw createError('Each variant SKU must be unique.');
    }

    sizes.add(size);
    skus.add(sku);
    return { size, sku, stock };
  });
};

const validateProductData = (body, { isCreate = false } = {}) => {
  const data = {};
  const requiredTextFields = ['name', 'brand', 'category', 'description', 'sku', 'gender', 'color', 'material'];
  const optionalTextFields = ['subCategory'];

  for (const field of requiredTextFields) {
    if (body[field] === undefined && !isCreate) {
      continue;
    }

    const value = normalizeString(body[field]);
    if (!value) {
      throw createError(`${field} is required.`);
    }
    data[field] = value;
  }

  for (const field of optionalTextFields) {
    if (body[field] !== undefined) {
      data[field] = normalizeString(body[field]) || null;
    }
  }

  const price = parseDecimal(body.price, 'Price', { required: isCreate, minimum: 0.01 });
  const mrp = parseDecimal(body.mrp, 'MRP', { required: isCreate, minimum: 0.01 });
  const discount = parseDecimal(body.discount, 'Discount', { minimum: 0 });

  if (price !== undefined) data.price = price;
  if (mrp !== undefined) data.mrp = mrp;
  if (discount !== undefined) data.discount = discount;

  if (data.price !== undefined && data.mrp !== undefined && data.mrp < data.price) {
    throw createError('MRP must be greater than or equal to price.');
  }

  const variants = validateVariants(body.variants, { required: isCreate });
  if (variants !== undefined) data.variants = variants;

  if (!isCreate && Object.keys(data).length === 0) {
    throw createError('At least one product field must be provided for update.');
  }

  return data;
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await createProductService(req.user.id, validateProductData(req.body, { isCreate: true }));
    return res.status(201).json({ success: true, message: 'Product created successfully.', data: product });
  } catch (error) {
    return next(error);
  }
};

export const listProducts = async (req, res, next) => {
  try {
    const products = await listProductsService(req.user);
    return res.status(200).json({ success: true, message: 'Products retrieved successfully.', data: products });
  } catch (error) {
    return next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id, req.user);
    if (!product) {
      throw createError('Product not found.', 404, 'PRODUCT_NOT_FOUND');
    }
    return res.status(200).json({ success: true, message: 'Product retrieved successfully.', data: product });
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await updateOwnedProduct(req.params.id, req.user.id, validateProductData(req.body));
    return res.status(200).json({ success: true, message: 'Product updated successfully.', data: product });
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await deleteOwnedProduct(req.params.id, req.user.id);
    return res.status(200).json({ success: true, message: 'Product deleted successfully.', data: product });
  } catch (error) {
    return next(error);
  }
};

export const updateProductStatus = async (req, res, next) => {
  try {
    const allowedStatuses = ['PUBLISHED', 'UNPUBLISHED', 'DRAFT'];
    const status = normalizeString(req.body.status)?.toUpperCase();

    if (!allowedStatuses.includes(status)) {
      throw createError('Status must be one of: PUBLISHED, UNPUBLISHED, DRAFT.');
    }

    const product = await updateOwnedProductStatus(req.params.id, req.user.id, status);
    return res.status(200).json({ success: true, message: 'Product status updated successfully.', data: product });
  } catch (error) {
    return next(error);
  }
};
