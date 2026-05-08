'use client';

const variants = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  danger: 'inline-flex items-center justify-content-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border-none',
};

export function Button({
  children, variant = 'primary', size = 'md',
  className = '', disabled, onClick, type = 'button', ...rest
}) {
  const sizeMap = { sm: 'text-xs px-3 py-1.5', md: '', lg: 'text-base px-6 py-3' };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant] || variants.primary} ${sizeMap[size]} ${className}`}
      style={variant === 'danger' ? { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1.5px solid rgba(239,68,68,0.3)' } : {}}
      onMouseEnter={variant === 'danger' ? e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; } : undefined}
      onMouseLeave={variant === 'danger' ? e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; } : undefined}
      {...rest}
    >
      {children}
    </button>
  );
}
