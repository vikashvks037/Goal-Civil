import { ENDPOINTS, ROUTES } from '@/constants';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { Breadcrumbs, EmptyState } from '@/shared/components';

async function getNotices() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.ADMIN.NOTICES}`, { cache: 'no-store' });
    const data = await res.json();
    return (data.notices || [])
      .filter(n => (n.audience === 'all' || n.audience === 'student') && n.isActive);
  } catch { return []; }
}

const PRIORITY_STYLE = {
  high:   { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', Icon: AlertTriangle },
  medium: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', Icon: Info },
  low:    { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', Icon: CheckCircle },
};

export default async function StudentNotificationsPage() {
  const notices = await getNotices();

  return (
    <div className="space-y-5">
      <Breadcrumbs crumbs={[{ label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD }, { label: 'Notifications' }]} />

      {notices.length === 0 ? (
        <EmptyState icon={<Bell size={48} />} title="No notifications yet" description="Notices and announcements will appear here." />
      ) : (
        <div className="grid-cards">
          {notices.map((n) => {
            const ps = PRIORITY_STYLE[n.priority] || PRIORITY_STYLE.low;
            const { Icon } = ps;
            return (
              <div key={n._id} className="card p-5 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ps.bg }}>
                    <Icon size={18} style={{ color: ps.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {n.priority && (
                    <span className="badge flex-shrink-0" style={{ background: ps.bg, color: ps.color }}>
                      {n.priority}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
