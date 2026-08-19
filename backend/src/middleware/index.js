// Base middleware placeholder
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const isUniqueConstraintError = err.code === 'P2002';

  res.status(isUniqueConstraintError ? 409 : err.status || 500).json({
    success: false,
    message: isUniqueConstraintError ? 'A product or variant with this SKU already exists.' : err.message || 'Internal Server Error',
    error: isUniqueConstraintError ? 'DUPLICATE_RESOURCE' : err.code || 'INTERNAL_ERROR'
  });
};
