'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle, KeyRound, RefreshCw } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const callForgotPassword = async (body) => {
    const res = await fetch(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return { res, data: await res.json() };
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const { res, data } = await callForgotPassword({ step: 'send', email: email.trim() });
      if (!res.ok) { setError(data.error || 'Failed to send code.'); return; }
      setInfo(data.message);
      setStep('reset');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { setError('Please enter the OTP.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    try {
      const { res, data } = await callForgotPassword({ step: 'reset', email, otp: otp.trim(), newPassword });
      if (!res.ok) { setError(data.error || 'Reset failed.'); return; }
      setStep('done');
      setTimeout(() => router.push(ROUTES.LOGIN), 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

        <div className="px-8 py-8">

          {/* ── DONE ── */}
          {step === 'done' && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950 mb-5">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Password Reset!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Your password has been updated. Redirecting you to login…
              </p>
              <Link href={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all">
                Go to Login
              </Link>
            </div>
          )}

          {/* ── SEND OTP ── */}
          {step === 'email' && (
            <>
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 mb-4">
                  <KeyRound className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Forgot password?</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Enter your email and we'll send you a reset code.
                </p>
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5">⚠️</span><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      required placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm shadow-amber-400/30 transition-all">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Mail className="w-4 h-4" /> Send Reset Code</>}
                </button>
              </form>
            </>
          )}

          {/* ── RESET FORM ── */}
          {step === 'reset' && (
            <>
              <div className="text-center mb-7">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 mb-4">
                  <Lock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Set new password</h1>
                {info && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{info}</p>}
              </div>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm flex items-start gap-2.5">
                  <span className="shrink-0 mt-0.5">⚠️</span><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                {/* OTP */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Reset Code (OTP)</label>
                  <input
                    type="text" inputMode="numeric" maxLength={6}
                    value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(''); }}
                    placeholder="6-digit code from email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-center tracking-widest font-bold text-lg"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPass ? 'text' : 'password'} value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      placeholder="Min. 6 characters" required
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                    <button type="button" onClick={() => setShowPass((p) => !p)} tabIndex={-1}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password" value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                      placeholder="Re-enter new password" required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => { setStep('email'); setError(''); }}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> Resend
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm shadow-amber-400/30 transition-all">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</> : <><Lock className="w-4 h-4" /> Reset Password</>}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Back to login */}
          {step !== 'done' && (
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
              <Link href={ROUTES.LOGIN}
                className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
