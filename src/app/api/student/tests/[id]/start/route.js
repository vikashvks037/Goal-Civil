import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Test from '@/server/db/models/Test';
import Question from '@/server/db/models/Question';
import Result from '@/server/db/models/Result';

export async function POST(_req, { params }) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ error: 'Test not found.' }, { status: 404 });
    if (!test.isPublished) return NextResponse.json({ error: 'Test not available.' }, { status: 403 });

    // Check if already attempted
    const existing = await Result.findOne({ studentId: auth.user.id, testId: id });
    if (existing) return NextResponse.json({ error: 'You have already attempted this test.', resultId: existing._id }, { status: 400 });

    // Return questions WITHOUT correctAnswer
    const questions = await Question.find({ testId: id })
      .sort({ order: 1 })
      .select('-correctAnswer -explanation');

    return NextResponse.json({ test, questions });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
