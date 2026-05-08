import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Test from '@/server/db/models/Test';

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const tests = await Test.find().sort({ createdAt: -1 }).populate('courseId', 'title');
  return NextResponse.json({ tests });
}

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { title, type, courseId, chapterId, duration, totalMarks, passingMarks, instructions, negativeMarks, startTime, endTime } = body;

    if (!title || !type || !duration || !totalMarks) {
      return NextResponse.json({ error: 'Title, type, duration and totalMarks are required.' }, { status: 400 });
    }

    await connectDB();
    const test = await Test.create({
      title: title.trim(), type, courseId: courseId || undefined,
      chapterId: chapterId || undefined, duration, totalMarks,
      passingMarks: passingMarks || 0, instructions, negativeMarks: negativeMarks || 0,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
    });

    return NextResponse.json({ message: 'Test created.', test }, { status: 201 });
  } catch (err) {
    console.error('[ADMIN TEST CREATE]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
