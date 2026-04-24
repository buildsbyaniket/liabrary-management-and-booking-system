import jwt from "jsonwebtoken";
import { User } from "../models/UserModel.js";
import ErrorHandler from "./errorMiddleware.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {

  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    return next(new ErrorHandler("Invalid token", 401));
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 401));
  }

  req.user = user;

  next();
});

export const isAuthorized = (...roles) => {

  roles = roles.map(role => role.toLowerCase());

  return (req, res, next) => {

    if (!req.user) {
      return next(new ErrorHandler("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role?.toLowerCase())) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) not allowed`, 403)
      );
    }

    next();
  };
};