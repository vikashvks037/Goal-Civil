export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state animate-fade-in">
      <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}>{icon}</div>
      <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
      {description && <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
