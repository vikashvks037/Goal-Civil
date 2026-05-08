import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function PageHeader(props) {
  if (props.variant === 'hero') {
    return (
      <div className="hero-header mb-6">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{props.title}</h1>
          {props.subtitle && <p className="text-base" style={{ color: 'rgba(219,234,254,0.85)' }}>{props.subtitle}</p>}
          {props.action && <div className="mt-5">{props.action}</div>}
        </div>
      </div>
    );
  }

  const { title, subtitle, action, breadcrumbs } = props;

  return (
    <div className="page-header">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs mb-1.5 flex-wrap" style={{ color: 'var(--text-muted)' }}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} />}
                {crumb.href
                  ? <Link href={crumb.href} className="hover:text-blue-500 transition-colors">{crumb.label}</Link>
                  : <span style={i === breadcrumbs.length - 1 ? { color: 'var(--text-secondary)', fontWeight: 600 } : {}}>{crumb.label}</span>
                }
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
