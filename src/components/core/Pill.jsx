import React from 'react';

const TONES = {
  neutral: { background: 'var(--kw-cream-deep)', color: 'var(--text-muted)' },
  waffle: { background: 'var(--surface-card-alt)', color: 'var(--kw-ink-700)' },
  dark: { background: 'var(--surface-dark-raised)', color: 'var(--text-on-dark)' },
  brand: { background: 'var(--brand-wash)', color: 'var(--text-brand)' }
};
export function Pill({ children, tone = 'neutral', style, ...rest }) {
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', height: 34, padding: '0 16px',
      borderRadius: 'var(--radius-pill)', font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase',
      ...TONES[tone], ...style
    }}>{children}</span>
  );
}
