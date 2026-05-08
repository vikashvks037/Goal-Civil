import { ENDPOINTS, ROUTES } from '@/constants';
import Link from 'next/link';
import { BookMarked, FileText, Trophy, Video, Bell, ChevronRight, BookOpen, Zap } from 'lucide-react';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/session';

async function getNotices() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.ADMIN.NOTICES}`, { cache: 'no-store' });
    const data = await res.json();
    return (data.notices || [])
      .filter(n => (n.audience === 'all' || n.audience === 'student') && n.isActive)
      .slice(0, 4);
  } catch { return []; }
}

async function getCurrentUser() {
  try {
    const session = await getIronSession(await cookies(), sessionOptions);
    return session.user || null;
  } catch { return null; }
}

const QUICK_ACTIONS = [
  { label: 'My Courses',   href: '/student/my-courses',  Icon: BookMarked, bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  { label: 'Take Test',    href: '/student/tests',        Icon: FileText,   bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  { label: 'Leaderboard',  href: '/student/leaderboard',  Icon: Trophy,     bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
  { label: 'Live Classes', href: '/student/live-classes', Icon: Video,      bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  { label: 'Browse',       href: '/student/courses',      Icon: BookOpen,   bg: 'rgba(6,182,212,0.12)',  color: '#06b6d4' },
  { label: 'Results',      href: '/student/results',      Icon: Zap,        bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
];

export default async function StudentDashboardPage() {
  const [user, notices] = await Promise.all([getCurrentUser(), getNotices()]);
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="relative z-10">
          <p className="text-sm font-medium mb-1" style={{ color: 'rgba(219,234,254,0.9)' }}>{greeting}! 👋</p>
          <h1 className="text-2xl font-black">{user?.name || 'Student'}</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(219,234,254,0.75)' }}>Keep learning and achieve your BPSC goals!</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Quick Access</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ label, href, Icon, bg, color }) => (
            <Link
              key={href}
              href={href}
              className="card card-hover flex flex-col items-center gap-2 p-3 text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Notices */}
      {notices.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              📢 Notices
            </h2>
            <Link href={ROUTES.STUDENT.NOTIFICATIONS} className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid-cards-sm">
            {notices.map((n) => (
              <div key={n._id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                    <Bell size={15} style={{ color: '#f59e0b' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{n.content}</p>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
                      {new Date(n.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Continue Learning */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Continue Learning</h2>
          <Link href={ROUTES.STUDENT.MY_COURSES} className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1">
            My Courses <ChevronRight size={12} />
          </Link>
        </div>
        <div
          className="card flex flex-col items-center justify-center text-center py-10 gap-3"
        >
          <div style={{ color: 'var(--text-muted)', opacity: 0.4 }}><BookMarked size={36} /></div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Go to My Courses to continue learning.</p>
          <Link href={ROUTES.STUDENT.MY_COURSES} className="btn-primary text-sm">
            My Courses →
          </Link>
        </div>
      </section>
    </div>
  );
}
