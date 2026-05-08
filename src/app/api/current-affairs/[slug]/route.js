import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CurrentAffairs } from '@/server/db/models/Other';

export async function GET(_req, { params }) {
  try {
    const { slug } = await params;
    await connectDB();
    const post = await CurrentAffairs.findOne({ slug, isPublished: true });
    if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    return NextResponse.json({ post });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
