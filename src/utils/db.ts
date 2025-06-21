import mongoose from 'mongoose';
import 'dotenv/config';

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/library_management';

let cachedClient: typeof mongoose | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = await mongoose.connect(mongoURI);
    console.log('✅ New database connection successful');
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
} 