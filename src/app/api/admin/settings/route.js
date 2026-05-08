import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { Settings } from '@/server/db/models/Other';

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({ siteName: 'Goal Civil' });
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    await connectDB();
    const settings = await Settings.findOneAndUpdate({}, { $set: body }, { new: true, upsert: true });
    return NextResponse.json({ message: 'Settings updated.', settings });
  } catch (err) {
    console.error('[PUT ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
