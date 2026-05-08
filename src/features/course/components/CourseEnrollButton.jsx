'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, ShoppingCart } from 'lucide-react';

export default function CourseEnrollButton({ courseId, courseSlug, price, isFree }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [finalPrice, setFinalPrice] = useState(price);
  const [couponApplied, setCouponApplied] = useState(false);

  const applyCoupon = async () => {
    if (!coupon) return;
    const r = await fetch(ENDPOINTS.COUPONS.VALIDATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: coupon, courseId, originalPrice: price }),
    });
    const d = await r.json();
    if (d.valid) {
      setFinalPrice(d.finalPrice);
      setCouponMsg(`✓ Saved ₹${d.discountAmount}!`);
      setCouponApplied(true);
    } else {
      setCouponMsg(d.error || 'Invalid coupon');
      setCouponApplied(false);
    }
  };

  const handleEnroll = async () => {
    const meRes = await fetch(ENDPOINTS.AUTH.ME);
    const meData = await meRes.json();
    if (!meData.user) {
      router.push(`${ROUTES.LOGIN}?redirect=${ROUTES.STUDENT.COURSE_DETAIL(courseSlug)}`);
      return;
    }

    const enrollRes = await fetch(ENDPOINTS.ENROLLMENTS.CHECK(courseId));
    const enrollData = await enrollRes.json();
    if (enrollData.enrolled) {
      router.push(ROUTES.STUDENT.MY_COURSES);
      return;
    }

    if (isFree || finalPrice === 0) {
      router.push(ROUTES.STUDENT.MY_COURSES);
      return;
    }

    setLoading(true);
    try {
      const orderRes = await fetch(ENDPOINTS.PAYMENTS.CREATE_ORDER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, couponCode: couponApplied ? coupon : undefined }),
      });
      const orderData = await orderRes.json();
      if (!orderData.orderId) {
        alert('Failed to create order. Please try again.');
        setLoading(false);
        return;
      }

      if (!window.Razorpay) {
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          document.head.appendChild(s);
        });
      }

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Goal Civil',
        description: 'Course Enrollment',
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyRes = await fetch(ENDPOINTS.PAYMENTS.VERIFY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentId: orderData.paymentId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.enrollment) {
            router.push(`${ROUTES.STUDENT.MY_COURSES}?enrolled=1`);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: meData.user.name, email: meData.user.email },
        theme: { color: '#2563EB' },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {!isFree && price > 0 && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={coupon}
              onChange={(e) => {
                setCoupon(e.target.value.toUpperCase());
                setCouponMsg('');
              }}
              placeholder="Coupon code"
              maxLength={20}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-semibold"
            />
            <button
              onClick={applyCoupon}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
            >
              Apply
            </button>
          </div>
          {couponMsg && (
            <p className={`text-xs font-semibold ${couponApplied ? 'text-green-600' : 'text-red-500'}`}>
              {couponMsg}
            </p>
          )}
          {couponApplied && finalPrice !== price && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 line-through">₹{price.toLocaleString()}</span>
              <span className="text-xl font-black text-gray-900">₹{finalPrice.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl font-black text-base shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Processing...
          </>
        ) : isFree || finalPrice === 0 ? (
          <>
            <ArrowRight size={18} /> Enroll for Free
          </>
        ) : (
          <>
            <ShoppingCart size={18} /> Buy Now — ₹{finalPrice.toLocaleString()}
          </>
        )}
      </button>
    </div>
  );
}
