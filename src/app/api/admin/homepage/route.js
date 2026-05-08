import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { HomepageContent } from '@/server/db/models/Other';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;
    await connectDB();
    let content = await HomepageContent.findOne().lean();
    if (!content) content = {};
    return NextResponse.json({ content });
  } catch (err) {
    console.error('[admin homepage GET]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;
    const body = await req.json();
    await connectDB();
    const content = await HomepageContent.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json({ message: 'Homepage updated.', content });
  } catch (err) {
    console.error('[admin homepage PUT]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
