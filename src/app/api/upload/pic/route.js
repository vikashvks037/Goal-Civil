import { NextResponse } from 'next/server';
import { requireStudent } from '@/lib/adminAuth';
import { uploadToCloudinary } from '@/server/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import User from '@/server/db/models/User';

export async function POST(req) {
  const auth = await requireStudent();
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only image files allowed.' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File size must be under 5MB.' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url } = await uploadToCloudinary(buffer, 'profiles', 'image');

    await connectDB();
    await User.findByIdAndUpdate(auth.user.id, { profilePic: url });

    return NextResponse.json({ message: 'Profile picture updated.', url });
  } catch (err) {
    console.error('[UPLOAD PIC ERROR]', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
