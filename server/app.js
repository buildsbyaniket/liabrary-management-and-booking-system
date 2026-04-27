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

config({ path: "./config/config.env" });

const app = express();

/* =========================
   TRUST PROXY (RENDER REQUIRED)
========================= */
app.set("trust proxy", 1);

/* =========================
   CORS (PRODUCTION SAFE)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://liabrary-management-and-booking-system-2.onrender.com",
  "https://liabrary-management-and-booking-system-2-client.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
  })
);

/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   FILE UPLOAD SAFETY
========================= */
app.use(
  expressFileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static("uploads"));

/* =========================
   DB CONNECTION
   (CRITICAL: MUST USE ATLAS ONLY)
========================= */
connectDB();

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
  res.status(200).send("Server Running");
});

/* =========================
   ERROR HANDLER (LAST)
========================= */
app.use(errorMiddleware);

export default app;