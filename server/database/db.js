import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_STACK_LIBRARY_MANAGEMENT_SYSTEM",
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error("Database Connection Failed:", err.message);
    process.exit(1);
  }
};