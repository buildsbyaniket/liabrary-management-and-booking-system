import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import expressFileUpload from "express-fileupload";

import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import userRouter from "./routes/userRouter.js";

// ❌ TEMP DISABLE (important)
// import { notifyUsers } from "./services/notifyUsers.js";
// import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

config({ path: "./config/config.env" });

const app = express();

/* =========================
   FIX 1: TRUST PROXY (KEEP - REQUIRED FOR RENDER COOKIES)
========================= */
app.set("trust proxy", 1);

/* =========================
   FIX 2: CORS (NO CHANGE BUT CRITICAL NOTE)
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://liabrary-management-and-booking-system-2-client.onrender.com",
    ],
    credentials: true,
  })
);

/* =========================
   DB CONNECT
========================= */
connectDB();

/* =========================
   MIDDLEWARE ORDER FIX (IMPORTANT)
   body parsing must come BEFORE file upload
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   FIX 3: FILE UPLOAD SAFETY
   (prevents undefined req.files crash)
========================= */
app.use(
  expressFileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB safety cap
    abortOnLimit: true,
  })
);

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static("uploads"));

/* =========================
   ROUTES
========================= */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/borrow", borrowRouter);
app.use("/api/v1/user", userRouter);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("Server Running");
});

/* =========================
   ERROR HANDLING (KEEP LAST)
========================= */
app.use(errorMiddleware);

export default app;