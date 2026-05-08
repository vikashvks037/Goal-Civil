import { connectDB } from '@/lib/mongodb';
export function generateOtp() { return Math.floor(100000 + Math.random() * 900000).toString(); }
export async function withDB(fn) { await connectDB(); return fn(); }
