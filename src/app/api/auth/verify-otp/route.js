import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import User from '@/server/db/models/User';
import { sessionOptions } from '@/lib/session';

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+otpCode +otpExpiry');

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ error: 'Email is already verified.' }, { status: 400 });
    }

    if (!user.otpCode || !user.otpExpiry) {
      return NextResponse.json({ error: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp.trim(), user.otpCode);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // Mark verified and clear OTP
    user.isEmailVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Set session
    const session = await getIronSession(await cookies(), sessionOptions);
    session.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    };
    await session.save();

    return NextResponse.json({
      message: 'Email verified successfully!',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      redirectTo: user.role === 'admin' ? '/admin' : '/student',
    });
  } catch (err) {
    console.error('[VERIFY OTP ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
