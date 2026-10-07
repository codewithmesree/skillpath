import mongoose from 'mongoose';
import dns from 'dns';
import '@/models/User';
import '@/models/Course';

function ensureDns() {
  // Only override DNS on local Windows if needed
  if (process.platform === 'win32') {
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    } catch {
      // Ignore in environments where setServers isn't supported
    }
  }
}

ensureDns();

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Please add MONGODB_URI to your environment variables (e.g. Vercel Project Settings -> Environment Variables).');
  }

  ensureDns();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'skillpath',
      serverSelectionTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
