import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Enrollment from '@/server/db/models/Enrollment';

export async function GET() {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const enrollments = await Enrollment.find({ studentId: auth.user.id, status: 'active' })
      .populate('courseId', 'title thumbnail totalLectures totalDuration category')
      .sort({ enrolledAt: -1 });

    return NextResponse.json({ enrollments });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
