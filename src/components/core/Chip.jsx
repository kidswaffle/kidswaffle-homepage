import React from 'react';
import { Icon } from './Icon.jsx';

const TONES = {
  neutral: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-subtle)' },
  brand: { background: 'var(--brand-wash)', color: 'var(--text-brand)', border: '1px solid transparent' },
  yellow: { background: 'var(--kw-yellow-tint)', color: 'var(--kw-ink-700)', border: '1px solid transparent' },
  coral: { background: 'var(--kw-coral-tint)', color: 'var(--kw-ink-700)', border: '1px solid transparent' },
  green: { background: 'var(--kw-green-tint)', color: 'var(--kw-ink-700)', border: '1px solid transparent' },
  sky: { background: 'var(--kw-sky-tint)', color: 'var(--kw-ink-700)', border: '1px solid transparent' },
  mint: { background: 'var(--kw-mint-tint)', color: 'var(--kw-ink-700)', border: '1px solid transparent' },
  dark: { background: 'transparent', color: 'var(--text-on-dark)', border: '1px solid var(--border-dark)' }
};
export function Chip({ children, tone = 'neutral', icon, dot, style, ...rest }) {
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px',
      borderRadius: 'var(--radius-pill)', font: 'var(--type-body-sm)', whiteSpace: 'nowrap',
      ...TONES[tone], ...style
    }}>
      {dot && <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />}
      {icon && <Icon name={icon} size={16} />}
      {children}
    </span>
  );
}
