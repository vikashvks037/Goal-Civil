import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { LiveClass } from '@/server/db/models/Other';

export async function PUT(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const liveClass = await LiveClass.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!liveClass) return NextResponse.json({ error: 'Live class not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Live class updated.', liveClass });
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
    await LiveClass.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Live class deleted.' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
