import { ROUTES, ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { GraduationCap, TrendingUp, Clock, ChevronRight, Trophy, Target } from 'lucide-react';
import { PageHeader, EmptyState } from '@/shared/components';

async function getResults() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.STUDENT.RESULTS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

function ScoreBadge({ pct }) {
  if (pct >= 80) return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Excellent' };
  if (pct >= 60) return { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'Good' };
  if (pct >= 40) return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Average' };
  return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Needs Work' };
}

export default async function StudentResultsPage() {
  const results = await getResults();

  return (
    <div className="space-y-5">
      <PageHeader title="My Results" subtitle="Your test performance history" />

      {results.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={48} />}
          title="No results yet"
          description="Take a test to see your performance history here."
        />
      ) : (
        <div className="grid-cards">
          {results.map((r) => {
            const badge = ScoreBadge({ pct: r.percentage });
            return (
              <div key={r._id} className="card card-hover p-5 flex flex-col gap-3">

                {/* Score circle + badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {r.percentage}%
                  </div>
                  <div className="text-right">
                    <span className="badge" style={{ background: badge.bg, color: badge.color }}>
                      {badge.label}
                    </span>
                    {r.rank && (
                      <p className="text-xs mt-1.5 flex items-center gap-1 justify-end" style={{ color: '#f59e0b' }}>
                        <Trophy size={12} /> Rank #{r.rank}
                      </p>
                    )}
                  </div>
                </div>

                {/* Test name */}
                <div>
                  <h3 className="font-bold text-sm leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {r.testId?.title || 'Test'}
                  </h3>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    <span>Score</span>
                    <span>{r.score}/{r.totalMarks}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${r.percentage}%`, background: `linear-gradient(90deg, ${badge.color}, ${badge.color}88)` }} />
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><Clock size={11} />{Math.floor(r.timeTaken / 60)}m</span>
                  <span className="flex items-center gap-1"><Target size={11} />{r.correctAnswers || 0} correct</span>
                  <span className="ml-auto">{new Date(r.submittedAt).toLocaleDateString('en-IN')}</span>
                </div>

                {/* CTA */}
                <Link
                  href={ROUTES.STUDENT.RESULT(r._id)}
                  className="btn-ghost justify-center text-xs mt-auto"
                >
                  View Details <ChevronRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
