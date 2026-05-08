import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { Coupon } from '@/server/db/models/Other';

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  await connectDB();
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  return NextResponse.json({ coupons });
}

export async function POST(req) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { code, discountType, discount, maxUses, courseId, expiresAt } = await req.json();

  if (!code || !discountType || discount === undefined) {
    return NextResponse.json({ error: 'Code, discountType and discount are required.' }, { status: 400 });
  }

  await connectDB();
  try {
    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType, discount, maxUses: maxUses || 100,
      courseId: courseId || undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    });
    return NextResponse.json({ message: 'Coupon created.', coupon }, { status: 201 });
  } catch (err) {
    if ((err).code === 11000) return NextResponse.json({ error: 'Coupon code already exists.' }, { status: 409 });
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
