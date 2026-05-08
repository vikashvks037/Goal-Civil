import { ROUTES, ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { FileText, Clock, ChevronRight, BookOpen, BarChart2 } from 'lucide-react';
import { PageHeader, EmptyState } from '@/shared/components';

const TYPE_STYLE = {
  mcq:        { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  subjective: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
  mock:       { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b' },
  chapter:    { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
};

async function getTests() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.STUDENT.TESTS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.tests || [];
  } catch { return []; }
}

export default async function StudentTestsPage() {
  const tests = await getTests();

  return (
    <div className="space-y-5">
      <PageHeader title="Tests" subtitle="Practice tests and mock exams" />

      {tests.length === 0 ? (
        <EmptyState icon={<FileText size={48} />} title="No tests available yet" description="Tests will appear here once published by admin." />
      ) : (
        <div className="grid-cards">
          {tests.map((t) => {
            const ts = TYPE_STYLE[t.type] || { bg: 'rgba(100,116,139,0.12)', color: '#64748b' };
            return (
              <div key={t._id} className="card card-hover p-5 flex flex-col gap-3">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: ts.bg }}
                  >
                    <FileText size={20} style={{ color: ts.color }} />
                  </div>
                  <span
                    className="badge mt-1"
                    style={{ background: ts.bg, color: ts.color }}
                  >
                    {t.type}
                  </span>
                </div>

                {/* Title */}
                <div className="flex-1">
                  <h3 className="font-bold text-sm leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {t.title}
                  </h3>
                  {t.courseId && (
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                      {t.courseId.title}
                    </p>
                  )}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> {t.duration} min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BarChart2 size={12} /> {t.totalMarks} marks
                  </span>
                  {t.totalQuestions && (
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={12} /> {t.totalQuestions} Q
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={ROUTES.STUDENT.TEST(t._id)}
                  className="btn-primary justify-center mt-auto"
                >
                  Start Test <ChevronRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
