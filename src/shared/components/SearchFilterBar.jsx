'use client';
import { Search, X } from 'lucide-react';
import { CustomSelect } from '@/shared/components/CustomSelect';

export function SearchFilterBar({
  searchValue, onSearchChange,
  searchPlaceholder = 'Search...',
  selects = [],
  hasFilters, onClear,
}) {
  return (
    <div className="filter-bar">
      {/* Search */}
      <div className="relative flex-1" style={{ minWidth: '180px' }}>
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="input-base pl-9"
        />
      </div>

      {/* Selects */}
      {selects.map((s, i) => (
        <CustomSelect
          key={i}
          value={s.value}
          onChange={s.onChange}
          placeholder={s.placeholder}
          options={[{ value: '', label: s.placeholder }, ...s.options]}
          className="input-base"
        />
      ))}

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl transition-all"
          style={{ color: '#ef4444' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <X size={14} /> Clear
        </button>
      )}
    </div>
  );
}
