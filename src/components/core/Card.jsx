import React from 'react';

const TONES = {
  white: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-subtle)' },
  waffle: { background: 'var(--surface-card-alt)', color: 'var(--kw-ink-700)', border: '1px solid transparent' },
  cream: { background: 'var(--surface-band)', color: 'var(--text-body)', border: '1px solid transparent' },
  dark: { background: 'var(--surface-dark-raised)', color: 'var(--text-on-dark)', border: '1px solid var(--border-dark)' }
};
export function Card({ children, tone = 'white', pad = 32, radius = 'var(--radius-xl)', elevated = true, hoverLift, style, ...rest }) {
  const [hot, setHot] = React.useState(false);
  return (
    <div {...rest}
      onMouseEnter={hoverLift ? () => setHot(true) : undefined}
      onMouseLeave={hoverLift ? () => setHot(false) : undefined}
      style={{
        padding: pad, borderRadius: radius, ...TONES[tone],
        boxShadow: elevated ? (hot ? 'var(--shadow-lift)' : 'var(--shadow-card)') : 'none',
        transform: hot ? 'translateY(-4px)' : 'none',
        transition: 'box-shadow var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out)',
        ...style
      }}>{children}</div>
  );
}
