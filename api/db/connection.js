import mongoose from 'mongoose';
import { config } from '../config/index.js';

let cachedConnection = null;

export const connectDB = async () => {
  // Return cached connection for Vercel serverless
  if (cachedConnection) {
    return true;
  }

  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 1, // Serverless: use single connection
      bufferCommands: false,
    });
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    return false;
  }
};
