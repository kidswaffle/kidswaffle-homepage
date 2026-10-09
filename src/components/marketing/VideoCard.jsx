import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Chip } from '../core/Chip.jsx';

export function VideoCard({ title, duration, topic, thumbnail, tone = 'dark', style, ...rest }) {
  const [hot, setHot] = React.useState(false);
  const dark = tone === 'dark';
  return (
    <a href="#" {...rest} onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} style={{
      display: 'flex', flexDirection: 'column', textDecoration: 'none',
      background: dark ? 'var(--surface-dark-raised)' : 'var(--surface-card)',
      border: '1px solid ' + (dark ? 'var(--border-dark)' : 'var(--border-subtle)'),
      borderRadius: 'var(--radius-xl)', overflow: 'hidden',
      boxShadow: dark ? 'none' : hot ? 'var(--shadow-lift)' : 'var(--shadow-card)',
      transform: hot ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--dur-3) var(--ease-out), box-shadow var(--dur-3) var(--ease-out)', ...style
    }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', background: thumbnail ? 'transparent' : 'var(--kw-waffle)' }}>
        {thumbnail && <img src={thumbnail} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <span style={{
          position: 'absolute', inset: 0, margin: 'auto', width: 62, height: 62,
          display: 'grid', placeItems: 'center', borderRadius: '50%',
          background: hot ? 'var(--brand)' : 'rgba(255,255,255,.92)',
          transition: 'background var(--dur-2) var(--ease-out), transform var(--dur-2) var(--ease-bounce)',
          transform: hot ? 'scale(1.08)' : 'scale(1)'
        }}>
          <Icon name="play" size={22} color={hot ? '#fff' : 'var(--kw-ink-900)'} />
        </span>
        {duration && <span style={{
          position: 'absolute', right: 14, bottom: 14, padding: '5px 12px', borderRadius: 'var(--radius-pill)',
          background: 'rgba(36,26,20,.82)', color: '#fff', font: 'var(--type-caption)'
        }}>{duration}</span>}
      </div>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {topic && <Chip tone={dark ? 'dark' : 'neutral'} style={{ height: 32, alignSelf: 'flex-start' }}>{topic}</Chip>}
        <div style={{ font: 'var(--type-h4)', color: dark ? '#fff' : 'var(--text-strong)' }}>{title}</div>
      </div>
    </a>
  );
}
