// utils/db.js or lib/dbConnect.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URL;

if (!MONGODB_URI) {
  throw new Error("❌ Missing environment variable: DB_URL");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    // ✅ Reuse existing connection
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
}
