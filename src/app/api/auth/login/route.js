import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/mongodb';
import User from '@/server/db/models/User';
import { sessionOptions } from '@/lib/session';
import { sendOTPEmail } from '@/server/lib/mailer';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password +otpCode +otpExpiry');

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Your account has been deactivated. Please contact support.' }, { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // If not verified, resend OTP and redirect
    if (!user.isEmailVerified) {
      const otp = crypto.randomInt(100000, 999999).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);
      user.otpCode = hashedOtp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendOTPEmail(user.email, user.name, otp);

      return NextResponse.json(
        { error: 'Email not verified. A new code has been sent.', redirectTo: '/verify-otp', email: user.email },
        { status: 403 }
      );
    }

    // Set session cookie
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
      message: 'Login successful!',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      redirectTo: user.role === 'admin' ? '/admin' : '/student',
    });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
