import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireStudent } from '@/lib/adminAuth';
import { Coupon } from '@/server/db/models/Other';
import Course from '@/server/db/models/Course';

export async function POST(req) {
  try {
    const auth = await requireStudent();
    if (auth instanceof NextResponse) return auth;

    const { code, courseId, originalPrice } = await req.json();
    if (!code || !courseId) return NextResponse.json({ error: 'Code and courseId are required.' }, { status: 400 });

    await connectDB();
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });

    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code.' }, { status: 400 });
    if (coupon.expiresAt && new Date() > coupon.expiresAt) return NextResponse.json({ error: 'Coupon has expired.' }, { status: 400 });
    if (coupon.usedCount >= coupon.maxUses) return NextResponse.json({ error: 'Coupon usage limit reached.' }, { status: 400 });
    if (coupon.courseId && coupon.courseId.toString() !== courseId) {
      return NextResponse.json({ error: 'Coupon not valid for this course.' }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 });

    const price = originalPrice || course.price;
    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      discountAmount = Math.round((price * coupon.discount) / 100);
    } else {
      discountAmount = Math.min(coupon.discount, price);
    }
    const finalPrice = Math.max(0, price - discountAmount);

    return NextResponse.json({ valid: true, discountAmount, finalPrice, coupon: { code: coupon.code, discountType: coupon.discountType, discount: coupon.discount } });
  } catch (err) {
    console.error('[POST ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
