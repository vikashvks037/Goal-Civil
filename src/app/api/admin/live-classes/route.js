import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { LiveClass } from '@/server/db/models/Other';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const classes = await LiveClass.find().sort({ scheduledAt: -1 }).populate('courseId', 'title');
    return NextResponse.json({ classes });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { title, description, link, platform, courseId, scheduledAt, duration } = await req.json();

    if (!title || !link || !scheduledAt) {
      return NextResponse.json({ error: 'Title, link and scheduledAt are required.' }, { status: 400 });
    }

    await connectDB();
    const liveClass = await LiveClass.create({
      title: title.trim(), description, link, platform: platform || 'youtube',
      courseId: courseId || undefined, scheduledAt: new Date(scheduledAt), duration,
    });

    return NextResponse.json({ message: 'Live class scheduled.', liveClass }, { status: 201 });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
