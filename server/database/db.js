// server/database/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_STACK_LIBRARY_MANAGEMENT_SYSTEM",
    });

    console.log("Connected DB:", connection.connection.name);
  } catch (err) {
    console.log("Error connecting to database", err);
  }
};