import { ENDPOINTS, ROUTES } from '@/constants';
import { Video, ExternalLink, CalendarDays, Radio } from 'lucide-react';
import { Breadcrumbs, EmptyState } from '@/shared/components';

const STATUS = {
  live:      { label: 'LIVE',      bg: 'rgba(16,185,129,0.15)', color: '#10b981', pulse: true },
  scheduled: { label: 'Scheduled', bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', pulse: false },
  completed: { label: 'Completed', bg: 'rgba(100,116,139,0.1)', color: '#64748b', pulse: false },
  cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', pulse: false },
};

async function getLiveClasses() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.ADMIN.LIVE_CLASSES}`, { cache: 'no-store' });
    const data = await res.json();
    return data.liveClasses || [];
  } catch { return []; }
}

export default async function StudentLiveClassesPage() {
  const classes = await getLiveClasses();

  return (
    <div className="space-y-5">
      <Breadcrumbs crumbs={[{ label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD }, { label: 'Live Classes' }]} />

      {classes.length === 0 ? (
        <EmptyState icon={<Video size={48} />} title="No live classes scheduled" description="Live class schedules will appear here." />
      ) : (
        <div className="grid-cards">
          {classes.map((c) => {
            const st = STATUS[c.status] || STATUS.scheduled;
            return (
              <div key={c._id} className="card card-hover flex flex-col overflow-hidden">
                {/* Top accent bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: c.status === 'live' ? '#10b981' : c.status === 'scheduled' ? '#3b82f6' : '#475569' }}
                />

                <div className="p-5 flex flex-col gap-3 flex-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.12)' }}
                    >
                      {c.status === 'live'
                        ? <Radio size={18} style={{ color: '#10b981' }} />
                        : <Video size={18} style={{ color: '#8b5cf6' }} />}
                    </div>
                    <span
                      className={`badge ${st.pulse ? 'animate-pulse' : ''}`}
                      style={{ background: st.bg, color: st.color }}
                    >
                      {st.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-sm leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                      {c.title}
                    </h3>
                    {c.instructor && (
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>by {c.instructor}</p>
                    )}
                  </div>

                  {/* Date + platform */}
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <CalendarDays size={12} />
                    {new Date(c.scheduledAt).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                    {c.platform && <span className="ml-auto badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)' }}>{c.platform}</span>}
                  </div>

                  {/* Join button */}
                  {c.status !== 'completed' && c.status !== 'cancelled' && c.link && (
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary justify-center mt-auto text-sm"
                      style={c.status === 'live'
                        ? { background: '#10b981' }
                        : {}}
                    >
                      <ExternalLink size={14} />
                      {c.status === 'live' ? 'Join Now' : 'Get Link'}
                    </a>
                  )}
                  {(c.status === 'completed' || c.status === 'cancelled') && (
                    <div
                      className="text-center text-xs font-semibold py-2 rounded-xl"
                      style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted)' }}
                    >
                      {c.status === 'completed' ? '✓ Session ended' : '✕ Cancelled'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
