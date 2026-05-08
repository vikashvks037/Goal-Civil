import { ROUTES, ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { BookMarked, ExternalLink } from 'lucide-react';
import { PageHeader, EmptyState } from '@/shared/components';

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

  return (
    <div className="space-y-5">
      <PageHeader title="My Courses" subtitle="Courses you are enrolled in" />

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
        <div className="grid-cards">
          {enrollments.map((e) => (
            <div key={e._id} className="course-card">
              {/* Thumbnail with progress */}
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
                {/* Overlay */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                {/* Progress */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="progress-bar" style={{ height: '4px', marginBottom: '4px' }}>
                    <div className="progress-bar-fill" style={{ width: `${e.progress || 0}%` }} />
                  </div>
                  <p className="text-white text-xs font-semibold">{e.progress || 0}% complete</p>
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
                  <span>{e.courseId?.totalLectures || 0} lectures</span>
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
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
