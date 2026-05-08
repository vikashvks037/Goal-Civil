import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CurrentAffairs } from '@/server/db/models/Other';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;

    await connectDB();
    const query = { isPublished: true };
    if (category) query.category = category;

    const [posts, total] = await Promise.all([
      CurrentAffairs.find(query).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit)
        .select('title slug category thumbnail publishedAt createdAt'),
      CurrentAffairs.countDocuments(query),
    ]);

    return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
