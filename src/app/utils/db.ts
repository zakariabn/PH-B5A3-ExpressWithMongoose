import mongoose from "mongoose";
import "dotenv/config";

const mongoURI = process.env.MONGODB_URI;

let cachedClient: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = await mongoose.connect(mongoURI as string);
    console.log("✅ New database connection successful 1");
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}
