import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Settings } from '@/server/db/models/Other';

// Public endpoint — no auth required (used by footer, header etc.)
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne().lean();
    if (!settings) settings = { siteName: 'Goal Civil' };
    return NextResponse.json({ settings });
  } catch (err) {
    console.error('[public settings GET]', err);
    return NextResponse.json({ settings: { siteName: 'Goal Civil' } });
  }
}
