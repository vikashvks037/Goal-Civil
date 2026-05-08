import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Subject from '@/server/db/models/Subject';

export async function GET(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const subjects = await Subject.find({ courseId: id }).sort({ order: 1 });
    return NextResponse.json({ subjects });
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
    const { title, description, order } = await req.json();

    if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 });

    await connectDB();
    const count = await Subject.countDocuments({ courseId: id });
    const subject = await Subject.create({ title: title.trim(), courseId: id, description, order: order ?? count });

    return NextResponse.json({ message: 'Subject created.', subject }, { status: 201 });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
