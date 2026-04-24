export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // localhost only
    sameSite: "lax",
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000, //  ADD THIS 
  });

  return res.status(statusCode).json({
    success: true,
    message,
    user,
  });
};