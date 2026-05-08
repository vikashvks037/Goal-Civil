import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/adminAuth';
import { uploadToCloudinary } from '@/server/lib/cloudinary';

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    if (!file.type.startsWith('video/')) return NextResponse.json({ error: 'Only video files allowed.' }, { status: 400 });
    if (file.size > 500 * 1024 * 1024) return NextResponse.json({ error: 'Video must be under 500MB.' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadToCloudinary(buffer, 'videos', 'video');

    return NextResponse.json({ message: 'Video uploaded.', url, publicId });
  } catch (err) {
    console.error('[UPLOAD VIDEO ERROR]', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
