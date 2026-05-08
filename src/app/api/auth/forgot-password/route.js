import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import User from '@/server/db/models/User';
import { sendPasswordResetOTP } from '@/server/lib/mailer';

// Step 1: Send reset OTP
export async function POST(req) {
  try {
    const { email, otp, newPassword, step } = await req.json();

    await connectDB();

    // STEP 1: Send OTP
    if (step === 'send' || !step) {
      if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 });

      const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+otpCode +otpExpiry');
      if (!user) {
        // Don't reveal if email exists — generic message
        return NextResponse.json({ message: 'If this email exists, a reset code has been sent.' });
      }

      const resetOtp = crypto.randomInt(100000, 999999).toString();
      const hashed = await bcrypt.hash(resetOtp, 10);
      user.otpCode = hashed;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendPasswordResetOTP(user.email, user.name, resetOtp);

      return NextResponse.json({ message: 'If this email exists, a reset code has been sent.', email: user.email });
    }

    // STEP 2: Verify OTP + set new password
    if (step === 'reset') {
      if (!email || !otp || !newPassword) {
        return NextResponse.json({ error: 'Email, OTP, and new password are required.' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() })
        .select('+otpCode +otpExpiry +password');

      if (!user || !user.otpCode || !user.otpExpiry) {
        return NextResponse.json({ error: 'Invalid or expired reset code.' }, { status: 400 });
      }

      if (new Date() > user.otpExpiry) {
        return NextResponse.json({ error: 'Reset code has expired. Please request a new one.' }, { status: 400 });
      }

      const valid = await bcrypt.compare(otp.trim(), user.otpCode);
      if (!valid) {
        return NextResponse.json({ error: 'Invalid reset code.' }, { status: 400 });
      }

      user.password = await bcrypt.hash(newPassword, 12);
      user.otpCode = undefined;
      user.otpExpiry = undefined;
      user.isEmailVerified = true; // ensure verified
      await user.save();

      return NextResponse.json({ message: 'Password reset successfully You can now log in.' });
    }

    return NextResponse.json({ error: 'Invalid step.' }, { status: 400 });
  } catch (err) {
    console.error('[FORGOT PASSWORD ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
