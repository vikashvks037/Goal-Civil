import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import User from '@/server/db/models/User';
import { sendOTPEmail } from '@/server/lib/mailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, password, qualification, dob, gender, city, state, profilePic } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    await connectDB();

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      password: hashedPassword,
      qualification,
      dob: dob ? new Date(dob) : undefined,
      gender,
      city: city?.trim(),
      state: state?.trim(),
      profilePic,
      isEmailVerified: false,
      otpCode: hashedOtp,
      otpExpiry,
    });

    // Send OTP email
    await sendOTPEmail(user.email, user.name, otp);

    return NextResponse.json(
      { message: 'Account created Please check your email for the verification code.', email: user.email },
      { status: 201 }
    );
  } catch (err) {
    console.error('[SIGNUP ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
