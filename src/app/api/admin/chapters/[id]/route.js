import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Chapter from '@/server/db/models/Chapter';

export async function PUT(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const chapter = await Chapter.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!chapter) return NextResponse.json({ error: 'Chapter not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Chapter updated.', chapter });
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
    await Chapter.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Chapter deleted.' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
