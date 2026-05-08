import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Test from '@/server/db/models/Test';
import Enrollment from '@/server/db/models/Enrollment';

export async function GET(req) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    await connectDB();

    // Get enrolled course IDs
    const enrollments = await Enrollment.find({ studentId: auth.user.id, status: 'active' }).select('courseId');
    const enrolledCourseIds = enrollments.map(e => e.courseId);

    const query = {
      isPublished: true,
      $or: [
        { courseId: null },
        { courseId: { $in: enrolledCourseIds } },
      ],
    };
    if (type) query.type = type;

    const tests = await Test.find(query).sort({ createdAt: -1 }).populate('courseId', 'title');
    return NextResponse.json({ tests });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
