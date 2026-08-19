export const customerAccess = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Customer access granted'
  });
};

export const sellerAccess = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Seller access granted'
  });
};

export const adminAccess = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Admin access granted'
  });
};
