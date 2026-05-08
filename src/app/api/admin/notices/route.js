import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { Notice } from '@/server/db/models/Other';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const notices = await Notice.find().sort({ createdAt: -1 });
    return NextResponse.json({ notices });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { title, content, audience } = await req.json();
    if (!title || !content) return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });

    await connectDB();
    const notice = await Notice.create({ title: title.trim(), content, audience: audience || 'all', createdBy: auth.user.id });
    return NextResponse.json({ message: 'Notice created.', notice }, { status: 201 });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
