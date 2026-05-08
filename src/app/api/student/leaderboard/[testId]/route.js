import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Result from '@/server/db/models/Result';

export async function GET(_req, { params }) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const { testId } = await params;
    await connectDB();

    const leaderboard = await Result.find({ testId })
      .sort({ score: -1, timeTaken: 1 })
      .limit(50)
      .populate('studentId', 'name profilePic');

    const ranked = leaderboard.map((r, i) => ({
      rank: i + 1,
      student: r.studentId,
      score: r.score,
      totalMarks: r.totalMarks,
      percentage: r.percentage,
      timeTaken: r.timeTaken,
      isMe: r.studentId?._id?.toString() === auth.user.id,
    }));

    return NextResponse.json({ leaderboard: ranked });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
