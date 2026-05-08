import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { sessionOptions } from './session';

export async function requireAdmin() {
  const session = await getIronSession(await cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }
  return { user: session.user };
}

export async function requireStudent() {
  const session = await getIronSession(await cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return { user: session.user };
}
