import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Enrollment from '@/server/db/models/Enrollment';

export async function GET(_req, { params }) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const { courseId } = await params;
    await connectDB();

    const enrollment = await Enrollment.findOne({ studentId: auth.user.id, courseId, status: 'active' });
    return NextResponse.json({ enrolled: !!enrollment, enrollment: enrollment || null });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
