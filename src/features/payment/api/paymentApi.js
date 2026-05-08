import { ENDPOINTS } from '@/constants';

const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export const paymentApi = {
  createOrder:    (courseId, couponCode) =>
    post(ENDPOINTS.PAYMENTS.CREATE_ORDER, { courseId, couponCode }),
  verify:         (p) =>
    post(ENDPOINTS.PAYMENTS.VERIFY, p),
  validateCoupon: (code, courseId, originalPrice) =>
    post(ENDPOINTS.COUPONS.VALIDATE, { code, courseId, originalPrice }),
};
