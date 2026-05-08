import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Course from '@/server/db/models/Course';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isFree = searchParams.get('isFree');

    await connectDB();

    const query = { isPublished: true };
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (isFree === 'true') query.isFree = true;
    if (isFree === 'false') query.isFree = false;

    const courses = await Course.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ courses });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
