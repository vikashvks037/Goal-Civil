import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Course from '@/server/db/models/Course';

export async function GET(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const course = await Course.findById(id);
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    return NextResponse.json({ course });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();

    await connectDB();
    const course = await Course.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Course updated.', course });
  } catch (err) {
    console.error('[PUT ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    await Course.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Course deleted.' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
