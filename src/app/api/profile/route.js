import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import User from '@/server/db/models/User';

export async function GET() {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    await connectDB();
    const user = await User.findById(auth.user.id).select('-password -otpCode -otpExpiry');
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('[GET ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const body = await req.json();
    const { name, phone, city, state, qualification, dob, gender } = body;

    await connectDB();
    const user = await User.findByIdAndUpdate(
      auth.user.id,
      { $set: { name, phone, city, state, qualification, dob: dob ? new Date(dob) : undefined, gender } },
      { new: true, select: '-password -otpCode -otpExpiry' }
    );

    return NextResponse.json({ message: 'Profile updated successfully.', user });
  } catch (err) {
    console.error('[PUT ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
