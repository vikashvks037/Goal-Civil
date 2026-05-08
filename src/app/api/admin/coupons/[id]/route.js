import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { requireAdmin } from '@/lib/adminAuth';
import { Coupon } from '@/server/db/models/Other';

export async function PUT(req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const coupon = await Coupon.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!coupon) return NextResponse.json({ error: 'Coupon not found.' }, { status: 404 });
    return NextResponse.json({ message: 'Coupon updated.', coupon });
  } catch (err) {
    console.error('[PUT ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const auth = await requireAdmin();
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    await connectDB();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Coupon deleted.' });
  } catch (err) {
    console.error('[DELETE ERROR]', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
