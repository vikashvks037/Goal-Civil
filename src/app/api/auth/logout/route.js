import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';

export async function POST() {
  try {
    const session = await getIronSession(await cookies(), sessionOptions);
    session.destroy();
    return NextResponse.json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('[LOGOUT ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
