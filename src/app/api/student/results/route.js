import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Result from '@/server/db/models/Result';

export async function GET() {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const results = await Result.find({ studentId: auth.user.id })
      .sort({ submittedAt: -1 })
      .populate('testId', 'title type totalMarks duration');

    return NextResponse.json({ results });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
