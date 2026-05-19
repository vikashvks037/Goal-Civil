import { ROUTES, ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { GraduationCap, Clock, ChevronRight, Trophy, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Breadcrumbs, EmptyState } from '@/shared/components';

async function getResults() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.STUDENT.RESULTS}`, { cache: 'no-store' });
    const data = await res.json();
    return data.results || [];
  } catch { return []; }
}

function scoreMeta(pct) {
  if (pct >= 80) return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Excellent', ring: '#10b981' };
  if (pct >= 60) return { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'Good',      ring: '#3b82f6' };
  if (pct >= 40) return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Average',   ring: '#f59e0b' };
  return          { bg: 'rgba(239,68,68,0.1)',  color: '#ef4444', label: 'Needs Work', ring: '#ef4444' };
}

export default async function StudentResultsPage() {
  const results = await getResults();

  if (results.length === 0) return (
    <div className="space-y-5">
      <Breadcrumbs crumbs={[{ label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD }, { label: 'My Results' }]} />
      <EmptyState icon={<GraduationCap size={48} />} title="No results yet" description="Take a test to see your performance history here." />
    </div>
  );

  const avgPct   = Math.round(results.reduce((s, r) => s + (r.percentage || 0), 0) / results.length);
  const bestPct  = Math.max(...results.map(r => r.percentage || 0));
  const worstPct = Math.min(...results.map(r => r.percentage || 0));
  const { color: avgColor } = scoreMeta(avgPct);

  return (
    <div className="space-y-6">
      <Breadcrumbs crumbs={[{ label: 'Dashboard', href: ROUTES.STUDENT.DASHBOARD }, { label: 'My Results' }]} />

      {/* Performance summary */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)' }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(219,234,254,0.8)' }}>Performance Overview</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-black mb-1">{avgPct}%</div>
              <div className="text-xs" style={{ color: 'rgba(219,234,254,0.75)' }}>Average Score</div>
            </div>
            <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
              <div className="text-3xl font-black mb-1" style={{ color: '#86efac' }}>{bestPct}%</div>
              <div className="text-xs" style={{ color: 'rgba(219,234,254,0.75)' }}>Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black mb-1">{results.length}</div>
              <div className="text-xs" style={{ color: 'rgba(219,234,254,0.75)' }}>Tests Taken</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="grid-cards">
        {results.map((r, idx) => {
          const badge = scoreMeta(r.percentage || 0);
          // trend: compare to previous result
          const prev = results[idx + 1];
          const trend = prev
            ? (r.percentage || 0) > (prev.percentage || 0) ? 'up'
            : (r.percentage || 0) < (prev.percentage || 0) ? 'down' : 'same'
            : null;

          return (
            <div key={r._id} className="card card-hover p-5 flex flex-col gap-3">
              {/* Score circle + badge */}
              <div className="flex items-center justify-between">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl relative"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {r.percentage}%
                  {/* Trend indicator */}
                  {trend && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{
                        background: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#64748b',
                        color: 'white',
                      }}
                    >
                      {trend === 'up' ? <TrendingUp size={10} /> : trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="badge" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
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
                  <span className="font-semibold">{r.score}/{r.totalMarks}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${r.percentage}%`, background: `linear-gradient(90deg, ${badge.color}, ${badge.color}88)` }} />
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><Clock size={11} />{Math.floor((r.timeTaken || 0) / 60)}m</span>
                <span className="flex items-center gap-1"><Target size={11} />{r.correctAnswers || 0} correct</span>
                <span className="ml-auto">{new Date(r.submittedAt).toLocaleDateString('en-IN')}</span>
              </div>

              {/* CTA */}
              <Link href={ROUTES.STUDENT.RESULT(r._id)} className="btn-ghost justify-center text-xs mt-auto">
                View Details <ChevronRight size={13} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
