import { ENDPOINTS } from '@/constants';

const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json());

export const authApi = {
  me:              ()                          => fetch(ENDPOINTS.AUTH.ME).then(r => r.json()),
  login:           (p)           => post(ENDPOINTS.AUTH.LOGIN, p),
  signup:          (p)          => post(ENDPOINTS.AUTH.SIGNUP, p),
  logout:          ()                          => fetch(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' }).then(r => r.json()),
  verifyOtp:       (p)             => post(ENDPOINTS.AUTH.VERIFY_OTP, p),
  resendOtp:       (email)             => post(ENDPOINTS.AUTH.RESEND_OTP, { email }),
  forgotPassword:  (p)  => post(ENDPOINTS.AUTH.FORGOT_PASSWORD, p),
};
