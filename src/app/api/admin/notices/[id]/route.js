import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { Notice } from '@/server/db/models/Other';

export async function PUT(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const notice = await Notice.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!notice) return NextResponse.json({ error: 'Notice not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Notice updated.', notice });
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
    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Notice deleted.' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
