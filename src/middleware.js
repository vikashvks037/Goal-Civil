import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'goal-civil-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Get session
  const res = NextResponse.next();
  const session = await getIronSession(req.cookies, sessionOptions);
  const user = session.user;

  // Redirect logged-in users away from auth pages
  const authPaths = ['/login', '/signup', '/verify-otp', '/forgot-password'];
  if (user && authPaths.some(p => pathname.startsWith(p))) {
    const redirectTo = user.role === 'admin' ? '/admin' : '/student';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // Protect student routes
  if (pathname.startsWith('/student')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.url));
    if (user.role !== 'student' && user.role !== 'admin')
      return NextResponse.redirect(new URL('/login', req.url));
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', req.url));
    if (user.role !== 'admin') return NextResponse.redirect(new URL('/student', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/student/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
    '/verify-otp',
    '/forgot-password',
  ],
};
