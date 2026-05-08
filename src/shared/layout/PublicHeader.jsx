'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X, GraduationCap, ChevronRight, LogIn, Sun, Moon } from 'lucide-react';

const NAV = [
  { label: 'Home',    href: '#home' },
  { label: 'Courses', href: '#courses' },
  { label: 'About',   href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function PublicHeader() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser]       = useState(null);
  const [checked, setChecked] = useState(false);
  const [dark, setDark]       = useState(false);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Init theme from localStorage
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Auth check
  useEffect(() => {
    fetch(ENDPOINTS.AUTH.ME)
      .then(r => r.json())
      .then(d => setUser(d.user || null))
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  const toggleTheme = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('gc-theme', next ? 'dark' : 'light'); } catch {}
  }, [dark]);

  const dashboardHref = user?.role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.STUDENT.DASHBOARD;

  return (
    <header
      className={`pub-header left-0 right-0 z-50 ${
        scrolled
          ? 'scrolled'
          : 'bg-transparent'
      }`}
      style={{ position: 'fixed', top: 0 }}
    >
      <div className="section-container w-full flex items-center justify-between h-16">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <GraduationCap size={20} className="text-white" />
          </div>
          <span
            className="font-black text-xl tracking-tight"
            style={{ color: scrolled ? 'var(--text-primary)' : '#fff' }}
          >
            Goal<span className="text-blue-400">Civil</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = scrolled ? 'var(--bg-surface-2)' : 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = scrolled ? 'var(--text-primary)' : '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.85)'; }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark mode"
            style={!scrolled ? { background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff' } : {}}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {!checked ? (
            <div className="w-28 h-9 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.1)' }} />
          ) : user ? (
            <Link href={dashboardHref} className="btn-primary text-sm">
              Dashboard <ChevronRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all"
                style={{ color: scrolled ? 'var(--text-secondary)' : 'rgba(255,255,255,0.9)' }}
              >
                <LogIn size={15} /> Login
              </Link>
              <Link href={ROUTES.SIGNUP} className="btn-primary text-sm">
                Join Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile row: theme + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle theme"
            style={!scrolled ? { background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff' } : {}}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen(p => !p)}
            className="p-2 rounded-xl transition-all"
            style={{ color: scrolled ? 'var(--text-primary)' : '#fff', background: !scrolled ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-1 shadow-lg animate-fade-in-up"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        >
          {NAV.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {label}
            </a>
          ))}
          <div className="pt-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border)' }}>
            {user ? (
              <Link href={dashboardHref} onClick={() => setOpen(false)} className="btn-primary justify-center">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  onClick={() => setOpen(false)}
                  className="block text-center py-3 rounded-xl text-sm font-semibold transition-all"
                  style={{ border: '1.5px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  Login
                </Link>
                <Link href={ROUTES.SIGNUP} onClick={() => setOpen(false)} className="btn-primary justify-center">
                  Join Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
