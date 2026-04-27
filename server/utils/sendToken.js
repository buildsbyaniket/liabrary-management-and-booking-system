export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 3 * 24 * 60 * 60 * 1000,
});
  return res.status(statusCode).json({
    success: true,
    message,
    user,
  });
};