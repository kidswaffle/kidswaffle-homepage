import React from 'react';

export function SegmentedTabs({ items = [], value, onChange, tone = 'light', style, ...rest }) {
  const dark = tone === 'dark';
  return (
    <div {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: 6,
      background: dark ? 'var(--surface-dark-raised)' : 'var(--surface-card)',
      border: '1px solid ' + (dark ? 'var(--border-dark)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-pill)', boxShadow: dark ? 'none' : 'var(--shadow-card)', ...style
    }}>
      {items.map((it) => {
        const on = value === it.label;
        return (
          <button key={it.label} onClick={() => onChange && onChange(it.label)} style={{
            display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 22px',
            border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer', font: 'var(--type-nav)',
            fontSize: 16,
            background: on ? (dark ? 'var(--kw-ink-900)' : 'var(--kw-cream)') : 'transparent',
            color: on ? (dark ? '#fff' : 'var(--text-strong)') : (dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'),
            boxShadow: on && !dark ? 'inset 0 0 0 1px var(--border-subtle)' : 'none',
            transition: 'background var(--dur-2) var(--ease-out), color var(--dur-2) var(--ease-out)'
          }}>
            {on && it.dot && <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.dot }} />}
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
