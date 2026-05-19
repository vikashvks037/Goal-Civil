import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import Content from '@/server/db/models/Content';
import { deleteFromSupabase } from '@/server/lib/supabaseStorage';

export async function PUT(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const content = await Content.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!content) return NextResponse.json({ error: 'Content not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Content updated.', content });
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
    const content = await Content.findByIdAndDelete(id);
    if (content?.storagePath) {
      await deleteFromSupabase(content.storagePath).catch(console.error);
    }
    return NextResponse.json({ message: 'Content deleted.' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
