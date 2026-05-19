'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

/**
 * CustomSelect — Portal-based dropdown that renders at <body> level.
 * This means it is NEVER clipped by any parent's overflow:hidden/clip/scroll.
 * Works identically on desktop and mobile.
 *
 * Props:
 *   value        – current selected value (string)
 *   onChange     – (value: string) => void
 *   options      – [{ value, label }] or ['string', ...]
 *   className    – classes on the trigger button
 *   placeholder  – shown when nothing is selected
 *   disabled     – boolean
 */
export function CustomSelect({
  value,
  onChange,
  options = [],
  className = '',
  placeholder = 'Select…',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Ensure we only use createPortal after hydration
  useEffect(() => { setMounted(true); }, []);

  // Normalise options to [{ value, label }]
  const normalised = options.map(o =>
    typeof o === 'string' ? { value: o, label: o } : o
  );
  const selected = normalised.find(o => o.value === value);

  const updateCoords = useCallback(() => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) {
      setCoords({
        top: r.bottom + window.scrollY + 4,
        left: r.left + window.scrollX,
        width: Math.max(r.width, 160),
      });
    }
  }, []);

  const openDropdown = () => {
    if (disabled) return;
    updateCoords();
    setOpen(true);
  };

  const close = useCallback(() => setOpen(false), []);

  // Reposition on scroll or resize while open
  useEffect(() => {
    if (!open) return;
    const onScroll = () => updateCoords();
    const onResize = () => updateCoords();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [open, updateCoords]);

  // Close on outside click/touch
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const clickedTrigger = triggerRef.current?.contains(e.target);
      const clickedDropdown = dropdownRef.current?.contains(e.target);
      if (!clickedTrigger && !clickedDropdown) {
        close();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
    };
  }, [open, close]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  const pick = (val) => { onChange(val); close(); };

  // Portal: rendered directly inside <body>, position fixed using computed coords
  const dropdown = mounted && open ? createPortal(
    <ul
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 999999,
        background: 'var(--bg-surface, #ffffff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: '10px',
        boxShadow: '0 8px 28px rgb(0 0 0 / 0.16)',
        padding: '4px',
        listStyle: 'none',
        margin: 0,
        maxHeight: '220px',
        overflowY: 'auto',
      }}
    >
      {normalised.map(o => (
        <li key={o.value}>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); pick(o.value); }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '7px 12px',
              fontSize: '0.82rem',
              fontWeight: o.value === value ? 700 : 500,
              color: o.value === value
                ? 'var(--brand-600, #2563eb)'
                : 'var(--text-primary, #0f172a)',
              background: o.value === value
                ? 'var(--bg-surface-2, #f1f5f9)'
                : 'transparent',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              if (o.value !== value)
                e.currentTarget.style.background = 'var(--bg-surface-2, #f1f5f9)';
            }}
            onMouseLeave={e => {
              if (o.value !== value)
                e.currentTarget.style.background = 'transparent';
            }}
          >
            {o.label}
          </button>
        </li>
      ))}
    </ul>,
    document.body
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={openDropdown}
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.35rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={12}
          style={{
            flexShrink: 0,
            transition: 'transform 0.15s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {dropdown}
    </>
  );
}
