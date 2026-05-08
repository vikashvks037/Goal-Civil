export function Loader({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center'
    : 'loader-overlay';
  return (
    <div className={wrapper} style={fullScreen ? { background: 'var(--bg-base)' } : {}}>
      <div className="flex flex-col items-center gap-3">
        <div className="loader-spinner" />
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Loading…</p>
      </div>
    </div>
  );
}
