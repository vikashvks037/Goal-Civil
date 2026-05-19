import { ROUTES, ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { BookMarked, ExternalLink, Clock, CheckCircle, PlayCircle, TrendingUp } from 'lucide-react';
import { Breadcrumbs, EmptyState } from '@/shared/components';

async function getEnrollments() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.STUDENT.ENROLLMENTS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.enrollments || [];
  } catch { return []; }
}

export default async function StudentMyCoursesPage() {
  const enrollments = await getEnrollments();

  // Segment by progress
  const inProgress  = enrollments.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100);
  const notStarted  = enrollments.filter(e => (e.progress || 0) === 0);
  const completed   = enrollments.filter(e => (e.progress || 0) >= 100);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD }, { label: 'My Courses' }]} />

      {enrollments.length === 0 ? (
        <EmptyState
          icon={<BookMarked size={48} />}
          title="No courses enrolled yet"
          description="Browse our courses and start learning today"
          action={
            <Link href={ROUTES.STUDENT.COURSES} className="btn-primary">
              <ExternalLink size={15} /> Browse Courses
            </Link>
          }
        />
      ) : (
        <>
          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'In Progress', count: inProgress.length, Icon: PlayCircle, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
              { label: 'Not Started', count: notStarted.length, Icon: BookMarked, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              { label: 'Completed',   count: completed.length,  Icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            ].map(({ label, count, Icon, color, bg }) => (
              <div key={label} className="card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{count}</p>
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* In Progress */}
          {inProgress.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <TrendingUp size={13} style={{ color: '#3b82f6' }} /> In Progress
              </h3>
              <div className="grid-cards">
                {inProgress.map((e) => <CourseCard key={e._id} enrollment={e} />)}
              </div>
            </section>
          )}

          {/* Not Started */}
          {notStarted.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <BookMarked size={13} style={{ color: '#f59e0b' }} /> Not Started
              </h3>
              <div className="grid-cards">
                {notStarted.map((e) => <CourseCard key={e._id} enrollment={e} />)}
              </div>
            </section>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <CheckCircle size={13} style={{ color: '#10b981' }} /> Completed
              </h3>
              <div className="grid-cards">
                {completed.map((e) => <CourseCard key={e._id} enrollment={e} completed />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function CourseCard({ enrollment: e, completed = false }) {
  const progress = e.progress || 0;
  const progressColor = progress >= 100 ? '#10b981' : progress >= 50 ? '#3b82f6' : '#f59e0b';

  return (
    <div className="course-card">
      {/* Thumbnail */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: '160px', background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
      >
        {e.courseId?.thumbnail
          ? <img src={e.courseId.thumbnail} alt="" className="w-full h-full object-cover" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <BookMarked size={36} style={{ color: 'rgba(255,255,255,0.3)' }} />
            </div>
          )}
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
        
        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 inset-x-0">
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: progressColor, transition: 'width 0.6s ease-out' }} />
          </div>
        </div>

        {/* Progress label */}
        <div className="absolute bottom-2 left-4 right-4 flex items-center justify-between">
          <span className="text-white text-xs font-bold">{progress}% complete</span>
          {completed && (
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#10b981' }}>
              <CheckCircle size={12} /> Done
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {e.courseId?.category && (
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--brand-600)' }}>{e.courseId.category}</p>
        )}
        <h3 className="font-bold text-sm line-clamp-2 mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>
          {e.courseId?.title}
        </h3>
        <div className="flex items-center justify-between text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1"><Clock size={11} />{e.courseId?.totalLectures || 0} lectures</span>
          <span
            className="badge"
            style={{
              background: e.status === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.1)',
              color: e.status === 'active' ? '#10b981' : '#64748b',
            }}
          >
            {e.status}
          </span>
        </div>
        <Link
          href={ROUTES.STUDENT.COURSE(e.courseId?._id)}
          className="btn-primary justify-center text-sm"
          style={completed ? { background: '#10b981' } : {}}
        >
          {completed ? '✓ Review Course' : progress > 0 ? 'Continue Learning' : 'Start Learning'}
        </Link>
      </div>
    </div>
  );
}
