import React from 'react';

export function CharacterCard({ name, romanized, role, body, color = 'var(--kw-yellow)', tint = 'var(--kw-yellow-tint)', image, style, ...rest }) {
  const [hot, setHot] = React.useState(false);
  return (
    <div {...rest} onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} style={{
      display: 'flex', flexDirection: 'column', background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)',
      boxShadow: hot ? 'var(--shadow-lift)' : 'var(--shadow-card)',
      transform: hot ? 'translateY(-4px)' : 'none',
      transition: 'box-shadow var(--dur-3) var(--ease-out), transform var(--dur-3) var(--ease-out)',
      overflow: 'hidden', ...style
    }}>
      <div style={{ height: 280, background: tint, display: 'flex', alignItems: image ? 'flex-end' : 'center', justifyContent: 'center', padding: image ? '20px 0 0' : 0, overflow: 'hidden', borderBottom: '4px solid ' + color }}>
        {image
          ? <img src={image} alt={name} style={{ height: 256, width: 'auto', maxWidth: '90%', objectFit: 'contain', objectPosition: 'bottom', transform: hot ? 'translateY(-6px)' : 'none', transition: 'transform var(--dur-4) var(--ease-bounce)' }} />
          : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 34, letterSpacing: '-.02em', color: color, opacity: .85, transform: hot ? 'translateY(-4px)' : 'none', transition: 'transform var(--dur-4) var(--ease-bounce)' }}>{romanized || name}</span>}
      </div>
      <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ font: 'var(--type-h3)', fontSize: 24, color: 'var(--text-strong)' }}>{name}</span>
          {romanized && <span style={{ font: 'var(--type-caption)', fontFamily: 'var(--font-display)', color: 'var(--text-faint)' }}>{romanized}</span>}
        </div>
        <span style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 8, font: 'var(--type-label)', color: 'var(--text-body)' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />{role}
        </span>
        <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{body}</p>
      </div>
    </div>
  );
}
