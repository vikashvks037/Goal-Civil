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
    if (file.type !== 'application/pdf') return NextResponse.json({ error: 'Only PDF files allowed.' }, { status: 400 });
    if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'PDF must be under 50MB.' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadToCloudinary(buffer, 'pdfs', 'raw');

    return NextResponse.json({ message: 'PDF uploaded.', url, publicId });
  } catch (err) {
    console.error('[UPLOAD PDF ERROR]', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
