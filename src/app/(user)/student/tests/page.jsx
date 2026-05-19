import { ROUTES, ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { FileText, Clock, ChevronRight, BookOpen, BarChart2, Zap, Search } from 'lucide-react';
import { Breadcrumbs, EmptyState } from '@/shared/components';

const TYPE_STYLE = {
  mcq:        { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6', label: 'MCQ' },
  subjective: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', label: 'Subjective' },
  mock:       { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Mock Test' },
  chapter:    { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Chapter Test' },
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

  // Group by type
  const byType = tests.reduce((acc, t) => {
    const key = t.type || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const typeOrder = ['mock', 'chapter', 'mcq', 'subjective'];
  const sortedTypes = [
    ...typeOrder.filter(t => byType[t]?.length),
    ...Object.keys(byType).filter(t => !typeOrder.includes(t)),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD }, { label: 'Tests' }]} />

      {tests.length === 0 ? (
        <EmptyState icon={<FileText size={48} />} title="No tests available yet" description="Tests will appear here once published by admin." />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Tests', value: tests.length, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
              { label: 'Mock Tests',  value: byType.mock?.length || 0,    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
              { label: 'Chapter Tests', value: byType.chapter?.length || 0, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
              { label: 'MCQ Tests',  value: byType.mcq?.length || 0,     color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="card p-4 flex flex-col gap-1">
                <p className="text-2xl font-black" style={{ color }}>{value}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Tests grouped by type */}
          {sortedTypes.map(type => {
            const ts = TYPE_STYLE[type] || { bg: 'rgba(100,116,139,0.12)', color: '#64748b', label: type };
            return (
              <section key={type}>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ts.color }} />
                  {ts.label} ({byType[type].length})
                </h3>
                <div className="grid-cards">
                  {byType[type].map((t) => (
                    <div key={t._id} className="card card-hover p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: ts.bg }}>
                          <FileText size={20} style={{ color: ts.color }} />
                        </div>
                        <span className="badge mt-1" style={{ background: ts.bg, color: ts.color }}>{ts.label}</span>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-sm leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
                        {t.courseId && (
                          <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{t.courseId.title}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {t.duration} min</span>
                        <span className="flex items-center gap-1.5"><BarChart2 size={12} /> {t.totalMarks} marks</span>
                        {t.totalQuestions && <span className="flex items-center gap-1.5"><BookOpen size={12} /> {t.totalQuestions} Q</span>}
                      </div>

                      <Link href={ROUTES.STUDENT.TEST(t._id)} className="btn-primary justify-center mt-auto">
                        Start Test <ChevronRight size={15} />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
