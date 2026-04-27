import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { generatePasswordEmailTemplate } from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";


export const register = catchAsyncErrors(async (req, res, next) => {

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields required", 400));
    }

    const existing = await User.findOne({ email });

    if (existing && existing.accountVerified) {
      return next(new ErrorHandler("User already exists", 400));
    }

    if (existing && !existing.accountVerified) {
      await User.deleteOne({ _id: existing._id });
    }

    const user = await User.create({ name, email, password });

    const otp = user.generateVerificationCode();
    await user.save();

    const sent = await sendVerificationCode(email, otp);

    if (!sent) {
      return res.status(200).json({
        success: true,
        message: "OTP generated (email failed, check logs)",
      });
    }

    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error); // FIX: makes 500 visible
    return next(new ErrorHandler(error.message, 500));
  }
});
/* =========================
   VERIFY OTP (FIXED)
========================= */
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Email or OTP missing", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User not found", 400));
  }

  if (String(user.verificationCode) !== String(otp)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  if (Date.now() > user.verificationCodeExpire) {
    return next(new ErrorHandler("OTP expired", 400));
  }

  user.accountVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpire = null;

  await user.save();

  sendToken(user, 200, "Account verified", res);
});

/* =========================
   LOGIN (FIXED)
========================= */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Enter all fields", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  if (!user.accountVerified) {
    return next(new ErrorHandler("Please verify OTP first", 400));
  }

  sendToken(user, 200, "Login successful", res);
});

/* =========================
   LOGOUT (FIXED COOKIE CLEAR)
========================= */
export const logout = catchAsyncErrors(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

/* =========================
   GET USER
========================= */
export const getUser = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email required", 400));
  }

  const user = await User.findOne({ email, accountVerified: true });

  if (!user) {
    return next(new ErrorHandler("Invalid Email", 400));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = generatePasswordEmailTemplate(resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Reset email sent",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email failed", 500));
  }
});

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Enter all fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, "Password reset successful", res);
});

/* =========================
   UPDATE PASSWORD
========================= */
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Enter all fields", 400));
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Wrong current password", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Passwords not matching", 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated",
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const { name } = req.body;

  if (name) user.name = name;

  // ✅ SAFE IMAGE HANDLING (FIX 500 ERROR)
  if (req.file) {
    user.avatar = {
      public_id: "",
      url: `/uploads/${req.file.filename}`,
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});