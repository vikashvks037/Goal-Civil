import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local file');
}

let cached = global._mongooseConn;
let promise = global._mongoosePromise;

export async function connectDB() {
  if (cached) return cached;

  if (!promise) {
    promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
    global._mongoosePromise = promise;
  }

  try {
    cached = await promise;
    global._mongooseConn = cached;
  } catch (e) {
    promise = null;
    global._mongoosePromise = null;
    throw e;
  }

  return cached;
}
