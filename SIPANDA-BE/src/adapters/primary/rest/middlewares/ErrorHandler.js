export default function errorHandler(err, req, res, next) {
  const statusCode =
    err.statusCode || (err.name === "INVALID_STATUS_TRANSITION" ? 409 : 500);

  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      error: {
        name: "VALIDATION_ERROR",
        message: err.errors[0].message,
      },
    });
  }

  res.status(statusCode).json({
    data: null,
    error: {
      name: err.name || "INTERNAL_ERROR",
      message: err.message || "Error",
      details: err.details || null,
    },
  });
}
