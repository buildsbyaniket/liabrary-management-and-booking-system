class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for field: ${field}`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid JSON Web Token. Try again.", 401);
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token expired. Login again.", 401);
  }

  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(", ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;