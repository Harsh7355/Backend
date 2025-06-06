const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return res.status(error.code || 500).json({
        success: false,
        msg: error.message || "Something went wrong",
      });
    }
  };
};

export default asyncHandler;
