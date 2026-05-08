import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import Course from '@/server/db/models/Course';
import Payment from '@/server/db/models/Payment';
import { Coupon } from '@/server/db/models/Other';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  const auth = await requireStudent();
  if (auth instanceof NextResponse) return auth;

  try {
    const { courseId, couponCode } = await req.json();
    if (!courseId) return NextResponse.json({ error: 'courseId is required.' }, { status: 400 });

    await connectDB();
    const course = await Course.findById(courseId);
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });
    if (course.isFree) return NextResponse.json({ error: 'This course is free. No payment needed.' }, { status: 400 });

    let finalPrice = course.price;
    let discountAmount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && (!coupon.expiresAt || new Date() < coupon.expiresAt) && coupon.usedCount < coupon.maxUses) {
        if (!coupon.courseId || coupon.courseId.toString() === courseId) {
          discountAmount = coupon.discountType === 'percent'
            ? Math.round((course.price * coupon.discount) / 100)
            : Math.min(coupon.discount, course.price);
          finalPrice = Math.max(0, course.price - discountAmount);
        }
      }
    }

    const amountInPaise = finalPrice * 100;
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const payment = await Payment.create({
      studentId: auth.user.id, courseId, amount: amountInPaise,
      razorpayOrderId: razorpayOrder.id, status: 'pending',
      couponCode: couponCode || undefined, discountAmount,
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      paymentId: payment._id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('[CREATE ORDER ERROR]', err);
    return NextResponse.json({ error: 'Failed to create payment order.' }, { status: 500 });
  }
}
