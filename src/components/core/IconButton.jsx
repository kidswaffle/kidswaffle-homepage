import React from 'react';
import { Icon } from './Icon.jsx';

const SZ = { sm: 36, md: 44, lg: 52 };
const TONES = {
  solid: { background: 'var(--brand)', color: '#fff', border: '1px solid var(--brand)' },
  outline: { background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-subtle)' },
  ghost: { background: 'transparent', color: 'var(--text-strong)', border: '1px solid transparent' },
  dark: { background: 'var(--surface-dark-raised)', color: 'var(--text-on-dark)', border: '1px solid var(--border-dark)' }
};
export function IconButton({ name, label, variant = 'outline', size = 'md', style, ...rest }) {
  const d = SZ[size] || SZ.md;
  const [hot, setHot] = React.useState(false);
  return (
    <button aria-label={label} {...rest}
      onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)}
      style={{
        width: d, height: d, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-pill)', cursor: 'pointer',
        transition: 'background var(--dur-2) var(--ease-out), transform var(--dur-1) var(--ease-out)',
        transform: hot ? 'scale(1.06)' : 'scale(1)', ...TONES[variant], ...style
      }}>
      <Icon name={name} size={size === 'sm' ? 16 : 20} />
    </button>
  );
}
