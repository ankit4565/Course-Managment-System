const errorMiddleware = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  // zod validation error
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: err.issues[0].message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

module.exports = errorMiddleware;