import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Result from '@/server/db/models/Result';
import Question from '@/server/db/models/Question';

export async function GET(_req, { params }) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();

    const result = await Result.findOne({ _id: id, studentId: auth.user.id })
      .populate('testId', 'title type totalMarks duration passingMarks negativeMarks');

    if (!result) return NextResponse.json({ error: 'Result not found.' }, { status: 404 });

    // Get all questions WITH correct answers for analysis
    const questionIds = result.answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const qMap = new Map(questions.map(q => [q._id.toString(), q]));

    const analysis = result.answers.map((ans) => {
      const q = qMap.get(ans.questionId?.toString());
      return {
        question: q ? { _id: q._id, text: q.text, type: q.type, options: q.options, correctAnswer: q.correctAnswer, explanation: q.explanation, marks: q.marks } : null,
        selected: ans.selected,
        isCorrect: ans.isCorrect,
        marksEarned: ans.marksEarned,
      };
    });

    return NextResponse.json({ result, analysis });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
