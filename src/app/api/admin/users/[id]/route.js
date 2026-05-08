import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import User from '@/server/db/models/User';

export async function GET(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    const user = await User.findById(id).select('-password -otpCode -otpExpiry');
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const { isActive } = await req.json();
    await connectDB();
    const user = await User.findByIdAndUpdate(id, { $set: { isActive } }, { new: true }).select('-password -otpCode -otpExpiry');
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    return NextResponse.json({ message: 'User updated.', user });
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
    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
