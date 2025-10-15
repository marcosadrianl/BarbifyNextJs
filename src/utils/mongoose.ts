import { connect, connection } from "mongoose";
import dotenv from "dotenv";
const conn = {
  isConnected: 0, // Track the connection status
};

/**
 * Connect to the MongoDB database.
 *
 * If the connection is already established, it returns immediately.
 * Otherwise, it attempts to connect to the database using the
 * MONGODB_URI environment variable.
 *
 * @returns {Promise<MongoDB>} A promise that resolves to the connected
 * MongoDB instance.
 *
 * @throws {Error} If there is an error connecting to the database.
 */
export async function connectDB() {
  try {
    if (conn.isConnected === 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    const db = await connect(process.env.MONGODB_URI as string, {
      // Opciones de conexión recomendadas
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("Connected to MongoDB");

    conn.isConnected = db.connections[0].readyState;

    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
