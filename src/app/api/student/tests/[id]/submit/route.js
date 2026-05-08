import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Test from '@/server/db/models/Test';
import Question from '@/server/db/models/Question';
import Result from '@/server/db/models/Result';

export async function POST(req, { params }) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const { answers, timeTaken } = await req.json(); // answers: { questionId, selected | null }[]

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Answers array is required.' }, { status: 400 });
    }

    await connectDB();

    const test = await Test.findById(id);
    if (!test) return NextResponse.json({ error: 'Test not found.' }, { status: 404 });

    const existing = await Result.findOne({ studentId: auth.user.id, testId: id });
    if (existing) return NextResponse.json({ error: 'Already submitted.', resultId: existing._id }, { status: 400 });

    const questions = await Question.find({ testId: id });
    const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

    let score = 0;
    const processedAnswers = answers.map(({ questionId, selected }) => {
      const q = questionMap.get(questionId);
      if (!q) return { questionId, selected, isCorrect: false, marksEarned: 0 };

      let isCorrect = false;
      let marksEarned = 0;

      if (q.type === 'mcq' && selected !== null && selected !== undefined) {
        isCorrect = selected === q.correctAnswer;
        if (isCorrect) {
          marksEarned = q.marks;
          score += q.marks;
        } else {
          marksEarned = -(test.negativeMarks || 0);
          score -= test.negativeMarks || 0;
        }
      }

      return { questionId, selected: selected ?? null, isCorrect, marksEarned };
    });

    score = Math.max(0, score);
    const percentage = test.totalMarks > 0 ? parseFloat(((score / test.totalMarks) * 100).toFixed(2)) : 0;

    const result = await Result.create({
      studentId: auth.user.id,
      testId: id,
      score,
      totalMarks: test.totalMarks,
      percentage,
      timeTaken: timeTaken || 0,
      answers: processedAnswers,
      submittedAt: new Date(),
    });

    // Calculate rank: count how many results have higher score
    const higherCount = await Result.countDocuments({ testId: id, score: { $gt: score } });
    const rank = higherCount + 1;
    await Result.findByIdAndUpdate(result._id, { rank });

    return NextResponse.json({ message: 'Test submitted!', resultId: result._id, score, percentage, rank });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
