import { ENDPOINTS, ROUTES } from '@/constants';
import Link from 'next/link';
import {
  BookMarked, FileText, Trophy, Video, Bell, ChevronRight,
  BookOpen, Zap, Target, Clock, Star, CheckCircle, BarChart2, Flame
} from 'lucide-react';
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
      .slice(0, 3);
  } catch { return []; }
}

async function getCurrentUser() {
  try {
    const session = await getIronSession(await cookies(), sessionOptions);
    return session.user || null;
  } catch { return null; }
}

async function getEnrollments() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.STUDENT.ENROLLMENTS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.enrollments || [];
  } catch { return []; }
}

async function getResults() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.STUDENT.RESULTS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

async function getTests() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.STUDENT.TESTS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.tests || [];
  } catch { return []; }
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
  const [user, notices, enrollments, results, tests] = await Promise.all([
    getCurrentUser(), getNotices(), getEnrollments(), getResults(), getTests()
  ]);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const totalEnrolled  = enrollments.length;
  const totalTests     = tests.length;
  const avgScore       = results.length > 0
    ? Math.round(results.reduce((s, r) => s + (r.percentage || 0), 0) / results.length) : 0;
  const bestScore      = results.length > 0 ? Math.max(...results.map(r => r.percentage || 0)) : 0;
  const inProgress     = enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, white, transparent)' }} />
        <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(219,234,254,0.9)' }}>{greeting}! 👋</p>
            <h1 className="text-2xl font-black">{user?.name || 'Student'}</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(219,234,254,0.75)' }}>Keep pushing — your BPSC goal is within reach!</p>
          </div>
          {results.length > 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl px-5 py-3 text-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <Flame size={18} style={{ color: '#fbbf24', marginBottom: '2px' }} />
              <p className="text-xl font-black">{results.length}</p>
              <p className="text-xs" style={{ color: 'rgba(219,234,254,0.8)' }}>Tests Done</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Enrolled', value: totalEnrolled, sub: 'courses', Icon: BookMarked, bg: 'rgba(59,130,246,0.1)', color: '#3b82f6' },
          { label: 'Tests Available', value: totalTests, sub: 'practice sets', Icon: FileText, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
          { label: 'Avg Score', value: results.length > 0 ? `${avgScore}%` : '—', sub: results.length > 0 ? `over ${results.length} tests` : 'take a test first', Icon: Target, bg: 'rgba(16,185,129,0.1)', color: '#10b981' },
          { label: 'Best Score', value: results.length > 0 ? `${bestScore}%` : '—', sub: results.length > 0 ? 'personal best' : 'no tests yet', Icon: Star, bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6' },
        ].map(({ label, value, sub, Icon, bg, color }) => (
          <div key={label} className="card p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>{value}</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Quick Access</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ label, href, Icon, bg, color }) => (
            <Link key={href} href={href} className="card card-hover flex flex-col items-center gap-2 p-3 text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Continue Learning */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Continue Learning</h2>
          <Link href={ROUTES.STUDENT.MY_COURSES} className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1">
            All Courses <ChevronRight size={12} />
          </Link>
        </div>

        {totalEnrolled === 0 ? (
          <div className="card flex flex-col items-center justify-center text-center py-10 gap-3">
            <div style={{ color: 'var(--text-muted)', opacity: 0.4 }}><BookMarked size={36} /></div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>You haven't enrolled in any course yet.</p>
            <Link href={ROUTES.STUDENT.COURSES} className="btn-primary text-sm">Browse Courses →</Link>
          </div>
        ) : inProgress.length === 0 ? (
          <div className="card flex flex-col items-center justify-center text-center py-8 gap-3">
            <CheckCircle size={32} style={{ color: '#10b981', opacity: 0.7 }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              You're enrolled in {totalEnrolled} course{totalEnrolled > 1 ? 's' : ''}. Start studying!
            </p>
            <Link href={ROUTES.STUDENT.MY_COURSES} className="btn-primary text-sm">My Courses →</Link>
          </div>
        ) : (
          <div className="grid-cards">
            {inProgress.slice(0, 3).map((e) => (
              <div key={e._id} className="course-card">
                <div className="relative overflow-hidden flex-shrink-0" style={{ height: '120px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}>
                  {e.courseId?.thumbnail
                    ? <img src={e.courseId.thumbnail} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><BookMarked size={30} style={{ color: 'rgba(255,255,255,0.3)' }} /></div>}
                  <div className="absolute inset-x-0 bottom-0 p-2">
                    <div className="progress-bar" style={{ height: '4px' }}>
                      <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%` }} />
                    </div>
                  </div>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  {e.courseId?.category && <p className="text-xs font-bold mb-1" style={{ color: 'var(--brand-600)' }}>{e.courseId.category}</p>}
                  <h3 className="font-bold text-sm line-clamp-2 mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>{e.courseId?.title}</h3>
                  <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-semibold" style={{ color: '#3b82f6' }}>{e.progress || 0}% done</span>
                    <span>{e.courseId?.totalLectures || 0} lectures</span>
                  </div>
                  <Link href={ROUTES.STUDENT.COURSE(e.courseId?._id)} className="btn-primary justify-center text-xs py-1.5">Continue →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Two-col: Notices + Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>📢 Notices</h2>
            <Link href={ROUTES.STUDENT.NOTIFICATIONS} className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">View all →</Link>
          </div>
          {notices.length === 0 ? (
            <div className="card p-6 flex flex-col items-center text-center gap-2">
              <Bell size={24} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No active notices</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notices.map((n) => (
                <div key={n._id} className="card p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: 'rgba(245,158,11,0.12)' }}>
                      <Bell size={14} style={{ color: '#f59e0b' }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                      <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{n.content}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>🧪 Available Tests</h2>
            <Link href={ROUTES.STUDENT.TESTS} className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">All tests →</Link>
          </div>
          {tests.length === 0 ? (
            <div className="card p-6 flex flex-col items-center text-center gap-2">
              <FileText size={24} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No tests available yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tests.slice(0, 3).map((t) => (
                <Link key={t._id} href={ROUTES.STUDENT.TEST(t._id)}
                  className="card card-hover p-3 flex items-center gap-3"
                  style={{ display: 'flex' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <FileText size={16} style={{ color: '#3b82f6' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                    <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Clock size={10} />{t.duration} min</span>
                      <span className="flex items-center gap-1"><BarChart2 size={10} />{t.totalMarks} marks</span>
                    </div>
                  </div>
                  <ChevronRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent Results */}
      {results.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>📊 Recent Results</h2>
            <Link href={ROUTES.STUDENT.RESULTS} className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors">All results →</Link>
          </div>
          <div className="card overflow-hidden">
            {results.slice(0, 4).map((r, i) => {
              const pct = r.percentage || 0;
              const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#3b82f6' : pct >= 40 ? '#f59e0b' : '#ef4444';
              const label = pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Average' : 'Needs Work';
              return (
                <Link key={r._id} href={ROUTES.STUDENT.RESULT(r._id)}
                  className="flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ borderBottom: i < Math.min(results.length, 4) - 1 ? '1px solid var(--border)' : 'none', display: 'flex' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{ background: `${color}18`, color }}>{pct}%</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{r.testId?.title || 'Test'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 progress-bar" style={{ height: '4px' }}>
                        <div className="progress-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color }}>{label}</span>
                    </div>
                  </div>
                  {r.rank && <span className="text-xs flex items-center gap-1 flex-shrink-0" style={{ color: '#f59e0b' }}><Trophy size={11} /> #{r.rank}</span>}
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </Link>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
