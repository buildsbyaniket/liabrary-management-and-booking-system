import express from "express";
import multer from "multer";
import {
  forgotPassword,
  resetPassword,
  getUser,
  login,
  logout,
  register,
  verifyOTP,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";

import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* =========================
   MULTER SETUP (ADD THIS)
========================= */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* =========================
   AUTH ROUTES
========================= */

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

router.get("/logout", logout);

router.get("/me", isAuthenticated, getUser);

/* =========================
   PASSWORD ROUTES
========================= */

router.put("/password/update", isAuthenticated, updatePassword);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

/* =========================
   PROFILE ROUTE (FIXED)
========================= */

router.put(
  "/profile/update",
  isAuthenticated,
  upload.single("avatar"), // 🔥 THIS IS REQUIRED
  updateProfile
);

export default router;