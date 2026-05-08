'use client';
import { ENDPOINTS, ROUTES } from '@/constants';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Users, BookOpen, FileText, CreditCard, BarChart2,
  Newspaper, Radio, Tag, Settings, Bell, LogOut, Menu, ChevronRight,
  GraduationCap, Trophy, Calendar, UserCircle, BookMarked, Video,
  Sun, Moon, X, Layout,
} from 'lucide-react';

const adminNav = [
  { label: 'Dashboard',       href: '/admin',                    icon: LayoutDashboard },
  { label: 'Students',        href: '/admin/users',              icon: Users },
  { label: 'Courses',         href: '/admin/courses',            icon: BookOpen },
  { label: 'Tests',           href: '/admin/tests',              icon: FileText },
  { label: 'Payments',        href: '/admin/payments',           icon: CreditCard },
  { label: 'Analytics',       href: '/admin/analytics',          icon: BarChart2 },
  { label: 'Current Affairs', href: '/admin/current-affairs',    icon: Newspaper },
  { label: 'Live Classes',    href: '/admin/live-classes',       icon: Radio },
  { label: 'Coupons',         href: '/admin/coupons',            icon: Tag },
  { label: 'Notices',         href: '/admin/notices',            icon: Bell },
  { label: 'Homepage',        href: '/admin/homepage',           icon: Layout },
  { label: 'Settings',        href: '/admin/settings',           icon: Settings },
];

const studentNav = [
  { label: 'Dashboard',       href: '/student',                  icon: LayoutDashboard },
  { label: 'Browse Courses',  href: '/student/courses',          icon: BookOpen },
  { label: 'My Courses',      href: '/student/my-courses',       icon: BookMarked },
  { label: 'Tests',           href: '/student/tests',            icon: FileText },
  { label: 'Results',         href: '/student/results',          icon: GraduationCap },
  { label: 'Leaderboard',     href: '/student/leaderboard',      icon: Trophy },
  { label: 'Current Affairs', href: '/student/current-affairs',  icon: Newspaper },
  { label: 'Live Classes',    href: '/student/live-classes',     icon: Video },
  { label: 'Schedule',        href: '/student/schedule',         icon: Calendar },
  { label: 'Notifications',   href: '/student/notifications',    icon: Bell },
  { label: 'Profile',         href: '/student/profile',          icon: UserCircle },
];

/* ── Sidebar (no user footer) ─────────────────────────── */
function SidebarContent({ nav, isAdmin, collapsed, pathname, onNavClick }) {
  return (
    <>
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-[60px] flex-shrink-0 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)', justifyContent: collapsed ? 'center' : 'flex-start' }}
      >
        <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center font-black text-sm text-white flex-shrink-0">G</div>
        {!collapsed && (
          <span className="font-black text-lg tracking-tight text-white">Goal Civil</span>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-2.5 flex-shrink-0">
          <span
            className="badge text-xs"
            style={isAdmin
              ? { background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }
              : { background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }
            }
          >
            {isAdmin ? '⚙ Admin Panel' : '🎓 Student Panel'}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`nav-item ${active ? 'active' : ''}`}
              style={collapsed ? { justifyContent: 'center', padding: '0.625rem' } : {}}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && <ChevronRight size={13} className="ml-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

/* ── User Dropdown (header) ───────────────────────────── */
function UserDropdown({ user, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger — only avatar */}
      <button
        onClick={() => setOpen(o => !o)}
        className="rounded-full transition-all"
        style={{ cursor: 'pointer', outline: open ? '2px solid #3b82f6' : '2px solid transparent', outlineOffset: '2px' }}
        title={user?.name}
      >
        <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
          {user?.profilePic
            ? <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
            : user?.name?.[0]?.toUpperCase()}
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.12)',
            animation: 'fade-in 0.15s ease',
          }}
        >
          {/* User info — no avatar */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            <span
              className="inline-block text-xs font-semibold mt-1.5 px-2 py-0.5 rounded-full"
              style={isAdmin
                ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }
                : { background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
            >
              {isAdmin ? 'Administrator' : 'Student'}
            </span>
          </div>

          {/* Logout */}
          <div className="p-2">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
              style={{ color: '#ef4444', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Layout ──────────────────────────────────────── */
export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]                           = useState(null);
  const [sidebarOpen, setSidebarOpen]             = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dark, setDark]                           = useState(false);

  const isAdmin = pathname.startsWith('/admin');
  const nav     = isAdmin ? adminNav : studentNav;

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    fetch(ENDPOINTS.AUTH.ME)
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); else router.push(ROUTES.LOGIN); })
      .catch(() => router.push(ROUTES.LOGIN));
  }, [router]);

  useEffect(() => { setMobileSidebarOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    await fetch(ENDPOINTS.AUTH.LOGOUT, { method: 'POST' });
    router.push(ROUTES.HOME);
  };

  const toggleTheme = useCallback(() => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('gc-theme', next ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <div className="dashboard-wrapper">

      {/* ── Desktop Sidebar ─────────────────────── */}
      <div
        className="dashboard-sidebar hidden md:flex"
        style={{ width: sidebarOpen ? '240px' : '68px' }}
      >
        <SidebarContent
          nav={nav} isAdmin={isAdmin} collapsed={!sidebarOpen}
          pathname={pathname} onNavClick={() => {}}
        />
      </div>

      {/* ── Mobile Sidebar Overlay ───────────────── */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[200] flex">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', animation: 'fade-in 0.2s' }}
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div
            className="relative flex flex-col animate-slide-left"
            style={{
              width: 'min(280px, 85vw)',
              background: 'var(--bg-sidebar)',
              height: '100%',
              zIndex: 1,
              boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header row */}
            <div
              className="flex items-center justify-between px-4 flex-shrink-0 border-b"
              style={{ height: '60px', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center font-black text-sm text-white flex-shrink-0">G</div>
                <span className="font-black text-lg tracking-tight text-white">Goal Civil</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: '#94a3b8' }}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Role badge */}
            <div className="px-4 py-2.5 flex-shrink-0">
              <span
                className="badge text-xs"
                style={isAdmin
                  ? { background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }
                  : { background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }
                }
              >
                {isAdmin ? '⚙ Admin Panel' : '🎓 Student Panel'}
              </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 scrollbar-thin">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`nav-item ${active ? 'active' : ''}`}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span>{item.label}</span>
                    {active && <ChevronRight size={13} className="ml-auto opacity-70" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ── Main Area ───────────────────────────── */}
      <div className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">
          {/* Desktop: collapse toggle */}
          <button
            onClick={() => setSidebarOpen(p => !p)}
            className="hidden md:flex p-2 rounded-xl transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>

          {/* Mobile: open sidebar */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl transition-all"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Page title on mobile */}
          <span className="md:hidden font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            {nav.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label || 'Dashboard'}
          </span>

          <div className="flex-1" />

          {/* Right: Theme toggle + User dropdown */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <UserDropdown user={user} isAdmin={isAdmin} onLogout={handleLogout} />
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content scrollbar-thin">
          {children}
        </main>
      </div>
    </div>
  );
}
