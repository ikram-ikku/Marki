export const checkHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Marki API is running"
  });
};
