import React from 'react';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { height: 40, padX: 18, gap: 8, font: 'var(--type-button-sm)', icon: 16 },
  md: { height: 52, padX: 24, gap: 10, font: 'var(--type-button)', icon: 18 },
  lg: { height: 62, padX: 30, gap: 12, font: 'var(--type-button)', icon: 20 }
};
const TONES = {
  primary: { background: 'var(--brand)', color: 'var(--text-on-brand)', border: '1px solid var(--brand)', boxShadow: 'var(--shadow-cta)' },
  dark: { background: 'var(--kw-ink-900)', color: '#fff', border: '1px solid var(--kw-ink-900)', boxShadow: 'var(--shadow-card)' },
  secondary: { background: 'var(--surface-card)', color: 'var(--text-strong)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' },
  soft: { background: 'var(--surface-card-alt)', color: 'var(--text-strong)', border: '1px solid transparent', boxShadow: 'none' },
  ghost: { background: 'transparent', color: 'var(--text-strong)', border: '1px solid transparent', boxShadow: 'none' }
};
const HOVER = { primary: 'var(--brand-hover)', dark: 'var(--kw-ink-700)', secondary: 'var(--kw-cream)', soft: 'var(--kw-waffle-deep)', ghost: 'rgba(46,33,26,.05)' };

export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, full, href, disabled, style, ...rest }) {
  const s = SIZES[size] || SIZES.md;
  const t = TONES[variant] || TONES.primary;
  const [hot, setHot] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} disabled={disabled} {...rest}
      onMouseEnter={() => setHot(true)} onMouseLeave={() => { setHot(false); setDown(false); }}
      onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{
        display: full ? 'flex' : 'inline-flex', width: full ? '100%' : 'auto',
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: '0 ' + s.padX + 'px', borderRadius: 'var(--radius-pill)',
        font: s.font, letterSpacing: '.005em', textDecoration: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .45 : 1, whiteSpace: 'nowrap',
        transition: 'background var(--dur-2) var(--ease-out), transform var(--dur-1) var(--ease-out), box-shadow var(--dur-2) var(--ease-out)',
        transform: down && !disabled ? 'scale(.97)' : 'scale(1)',
        ...t,
        background: hot && !disabled ? HOVER[variant] : t.background,
        ...style
      }}>
      {icon && <Icon name={icon} size={s.icon} />}
      {children}
      {iconRight && <Icon name={iconRight} size={s.icon} />}
    </Tag>
  );
}
