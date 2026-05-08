import { ENDPOINTS } from '@/constants';
import Link from 'next/link';
import { Newspaper, CalendarDays } from 'lucide-react';
import { PageHeader, EmptyState } from '@/shared/components';

async function getCurrentAffairs() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.CURRENT_AFFAIRS.LIST}`, { cache: 'no-store' });
    const data = await res.json();
    return data.articles || [];
  } catch { return []; }
}

export default async function StudentCurrentAffairsPage() {
  const articles = await getCurrentAffairs();

  return (
    <div className="space-y-5">
      <PageHeader title="Current Affairs" subtitle="Stay updated with daily news and analysis" />

      {articles.length === 0 ? (
        <EmptyState icon={<Newspaper size={48} />} title="No articles yet" description="Current affairs articles will appear here." />
      ) : (
        <div className="grid-cards">
          {articles.map((a) => (
            <Link
              key={a._id}
              href={`/blog/${a.slug}`}
              className="article-card flex flex-col group"
            >
              {/* Thumbnail */}
              <div
                className="relative overflow-hidden flex-shrink-0"
                style={{ height: '160px', background: 'linear-gradient(135deg, #1e293b, #334155)' }}
              >
                {a.thumbnail
                  ? <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper size={40} style={{ color: 'rgba(255,255,255,0.2)' }} />
                    </div>
                  )
                }
                {a.category && (
                  <span
                    className="absolute top-3 left-3 badge text-white"
                    style={{ background: 'rgba(37,99,235,0.85)', backdropFilter: 'blur(4px)' }}
                  >
                    {a.category}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="font-bold text-sm leading-snug line-clamp-2 mb-2 transition-colors group-hover:text-blue-500"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {a.title}
                </h3>
                {a.summary && (
                  <p className="text-xs line-clamp-2 mb-3 flex-1" style={{ color: 'var(--text-muted)' }}>
                    {a.summary}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs mt-auto" style={{ color: 'var(--text-muted)' }}>
                  <CalendarDays size={12} />
                  {new Date(a.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
