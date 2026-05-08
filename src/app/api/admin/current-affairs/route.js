import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { CurrentAffairs } from '@/server/db/models/Other';

function slugify(t) {
  return t.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const posts = await CurrentAffairs.find().sort({ createdAt: -1 });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { title, content, category, thumbnail, isPublished } = await req.json();

    if (!title || !content) return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });

    await connectDB();
    let slug = slugify(title);
    const exists = await CurrentAffairs.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const post = await CurrentAffairs.create({
      title: title.trim(), slug, content, category, thumbnail,
      isPublished: !!isPublished,
      publishedBy: auth.user.id,
      publishedAt: isPublished ? new Date() : undefined,
    });

    return NextResponse.json({ message: 'Post created.', post }, { status: 201 });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
