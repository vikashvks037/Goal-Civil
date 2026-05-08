import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Question from '@/server/db/models/Question';
import Test from '@/server/db/models/Test';

export async function GET(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const questions = await Question.find({ testId: id }).sort({ order: 1 });
    return NextResponse.json({ questions });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();
    const { text, type, options, correctAnswer, explanation, marks, difficulty } = body;

    if (!text || !type) return NextResponse.json({ error: 'Text and type are required.' }, { status: 400 });
    if (type === 'mcq' && (correctAnswer === undefined || !options?.length)) {
      return NextResponse.json({ error: 'MCQ requires options and correctAnswer.' }, { status: 400 });
    }

    await connectDB();
    const count = await Question.countDocuments({ testId: id });
    const question = await Question.create({
      testId: id, text, type, options: type === 'mcq' ? options : [],
      correctAnswer: type === 'mcq' ? correctAnswer : undefined,
      explanation, marks: marks || 1, difficulty: difficulty || 'medium', order: count,
    });

    // Recalculate totalMarks on test
    const allQ = await Question.find({ testId: id });
    const total = allQ.reduce((s, q) => s + q.marks, 0);
    await Test.findByIdAndUpdate(id, { totalMarks: total });

    return NextResponse.json({ message: 'Question added.', question }, { status: 201 });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
