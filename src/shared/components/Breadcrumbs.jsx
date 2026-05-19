'use client';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Breadcrumbs — replaces PageHeader everywhere.
 *
 * Props:
 *   crumbs   — array of { label, href? }
 *              last item is always the current page (no href needed)
 *   action   — optional JSX rendered on the right side
 *
 * Usage:
 *   <Breadcrumbs
 *     crumbs={[
 *       { label: 'Dashboard', href: '/student' },
 *       { label: 'My Courses' },
 *     ]}
 *     action={<button className="btn-primary">Add</button>}
 *   />
 */
export function Breadcrumbs({ crumbs = [], action }) {
  return (
    <div className="breadcrumbs-bar">
      <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
        {/* Home icon always first */}
        <Link href="/" className="breadcrumbs-home" aria-label="Home">
          <Home size={13} />
        </Link>

        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={i} className="breadcrumbs-item">
              <ChevronRight size={12} className="breadcrumbs-sep" aria-hidden="true" />
              {!isLast && crumb.href ? (
                <Link href={crumb.href} className="breadcrumbs-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'breadcrumbs-current' : 'breadcrumbs-link'}>
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      {action && <div className="breadcrumbs-action">{action}</div>}
    </div>
  );
}
