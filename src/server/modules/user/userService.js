import { connectDB } from '@/lib/mongodb';
export async function getUserById(id){ await connectDB(); const U=(await import('@/server/db/models/User')).default; return U.findById(id).lean(); }
export async function getUserByEmail(email){ await connectDB(); const U=(await import('@/server/db/models/User')).default; return U.findOne({email:email.toLowerCase()}).lean(); }
