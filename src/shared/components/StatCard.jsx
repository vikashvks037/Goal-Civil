import Link from 'next/link';

export function StatCard({ icon, label, value, sub, color = 'bg-blue-50 text-blue-600', href }) {
  const content = (
    <div className={`stat-card h-full ${href ? 'cursor-pointer hover:border-blue-300 transition-colors' : ''}`}>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <div className="scale-90 sm:scale-100">{icon}</div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide truncate" style={{ color: 'var(--text-muted)' }}>{label}</p>
        <p className="text-lg sm:text-2xl font-black mt-0.5 truncate" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{value}</p>
        {sub && <p className="text-[10px] sm:text-xs mt-0.5 truncate opacity-80" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{content}</Link>;
  }

  return content;
}
