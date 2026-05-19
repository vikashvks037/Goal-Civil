import { ENDPOINTS, ROUTES } from '@/constants';
import Link from 'next/link';
import { Newspaper, ChevronRight } from 'lucide-react';
import { Breadcrumbs, EmptyState } from '@/shared/components';

async function getArticles() {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res  = await fetch(`${base}${ENDPOINTS.CURRENT_AFFAIRS.LIST}`, { cache: 'no-store' });
    const data = await res.json();
    return data.articles || [];
  } catch { return []; }
}

export default async function StudentCurrentAffairsPage() {
  const articles = await getArticles();

  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { label: 'Dashboard',       href: ROUTES.STUDENT.DASHBOARD },
          { label: 'Current Affairs' },
        ]}
      />

      {articles.length === 0 ? (
        <EmptyState icon={<Newspaper size={48} />} title="No articles yet" description="Current affairs articles will appear here." />
      ) : (
        <div className="grid-cards">
          {articles.map((a) => (
            <Link
              key={a._id}
              href={`/student/current-affairs/${a.slug}`}
              className="article-card flex flex-col overflow-hidden"
              style={{ display: 'flex' }}
            >
              {a.thumbnail && (
                <div className="h-40 overflow-hidden flex-shrink-0">
                  <img src={a.thumbnail} alt="" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
              )}
              <div className="p-4 flex flex-col flex-1">
                {a.category && (
                  <span className="badge mb-2" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>{a.category}</span>
                )}
                <h3 className="font-bold text-sm line-clamp-2 mb-2 flex-1" style={{ color: 'var(--text-primary)' }}>{a.title}</h3>
                {a.summary && (
                  <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>{a.summary}</p>
                )}
                <div className="flex items-center justify-between text-xs mt-auto" style={{ color: 'var(--text-muted)' }}>
                  <span>{new Date(a.publishedAt || a.createdAt).toLocaleDateString('en-IN')}</span>
                  <span className="flex items-center gap-1 text-blue-500 font-semibold">Read <ChevronRight size={12} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
