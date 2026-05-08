import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Chapter from '@/server/db/models/Chapter';

export async function GET(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const chapters = await Chapter.find({ subjectId: id }).sort({ order: 1 });
    return NextResponse.json({ chapters });
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
    const count = await Chapter.countDocuments({ subjectId: id });
    const chapter = await Chapter.create({ title: title.trim(), subjectId: id, description, order: order ?? count });

    return NextResponse.json({ message: 'Chapter created.', chapter }, { status: 201 });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
