'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, Loader2, Mail, Lock, GraduationCap } from 'lucide-react';

const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';
const labelCls = 'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        if (data.redirectTo) setTimeout(() => router.push(`${data.redirectTo}?email=${encodeURIComponent(form.email)}`), 1500);
        return;
      }
      router.push(data.redirectTo || ROUTES.STUDENT.DASHBOARD);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card animate-fade-in-up">
      {/* Top accent */}
      <div className="h-1.5 rounded-t-[22px] -mx-[clamp(1.5rem,5vw,2.5rem)] -mt-[clamp(1.5rem,5vw,2.5rem)] mb-6"
        style={{ background: 'linear-gradient(90deg, #2563eb, #6366f1, #8b5cf6)' }} />

      {/* Logo + heading */}
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 bg-blue-50 dark:bg-blue-950">
          <GraduationCap size={24} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Sign in to your Goal Civil account</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className={labelCls}>Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} required placeholder="you@example.com"
              className={`${inputCls} pl-10`}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
            <Link href={ROUTES.FORGOT_PASSWORD} className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type={showPass ? 'text' : 'password'} name="password"
              value={form.password} onChange={handleChange} required placeholder="••••••••"
              className={`${inputCls} pl-10 pr-11`}
            />
            <button
              type="button" tabIndex={-1}
              onClick={() => setShowPass(p => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-1"
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Signing in…</>
            : <><LogIn size={16} /> Sign In</>}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400">
          <span className="px-3 bg-white dark:bg-gray-900">Don't have an account?</span>
        </div>
      </div>

      <Link
        href={ROUTES.SIGNUP}
        className="w-full flex items-center justify-center py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
      >
        Create a free account
      </Link>

      <p className="text-center text-xs mt-5 text-gray-400">
        🔒 Secured with encrypted HTTP-only cookies
      </p>
    </div>
  );
}
