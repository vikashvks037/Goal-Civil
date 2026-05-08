import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import User from '@/server/db/models/User';
import { sendOTPEmail } from '@/server/lib/mailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otpCode +otpExpiry');

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ error: 'Email is already verified.' }, { status: 400 });
    }

    // Rate limit: don't resend if OTP was sent less than 1 minute ago
    if (user.otpExpiry && new Date() < new Date(user.otpExpiry.getTime() - 9 * 60 * 1000)) {
      return NextResponse.json({ error: 'Please wait before requesting a new code.' }, { status: 429 });
    }

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otpCode = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, user.name, otp);

    return NextResponse.json({ message: 'A new verification code has been sent to your email.' });
  } catch (err) {
    console.error('[RESEND OTP ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
