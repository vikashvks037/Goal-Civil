import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Payment from '@/server/db/models/Payment';
import Enrollment from '@/server/db/models/Enrollment';
import Course from '@/server/db/models/Course';
import { Coupon } from '@/server/db/models/Other';

export async function POST(req) {
  const auth = await requireStudent();
  if (auth instanceof NextResponse) return auth;

  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !paymentId) {
      return NextResponse.json({ error: 'All payment fields are required.' }, { status: 400 });
    }

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { $set: { razorpayPaymentId, razorpaySignature, status: 'success' } },
      { new: true }
    );

    if (!payment) return NextResponse.json({ error: 'Payment record not found.' }, { status: 404 });

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId: auth.user.id,
      courseId: payment.courseId,
      paymentId: payment._id,
      status: 'active',
    });

    // Increment course enrolledCount
    await Course.findByIdAndUpdate(payment.courseId, { $inc: { enrolledCount: 1 } });

    // Increment coupon usedCount if applicable
    if (payment.couponCode) {
      await Coupon.findOneAndUpdate({ code: payment.couponCode }, { $inc: { usedCount: 1 } });
    }

    return NextResponse.json({ message: 'Payment verified. Course unlocked!', enrollment });
  } catch (err) {
    console.error('[VERIFY PAYMENT ERROR]', err);
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 500 });
  }
}
