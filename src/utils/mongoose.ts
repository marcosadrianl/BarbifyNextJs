// lib/mongoose.ts
import mongoose from "mongoose";

const conn = {
  isConnected: 0, // Track the connection status
};

/**
 * Connect to the MongoDB database.
 *
 * If the connection is already established, it returns immediately.
 * Otherwise, it attempts to connect to the database using the
 * DATABASE_URL environment variable.
 */
export async function connectDB() {
  try {
    if (conn.isConnected === 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    const db = await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    conn.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");

    return db;
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    throw error;
  }
}
