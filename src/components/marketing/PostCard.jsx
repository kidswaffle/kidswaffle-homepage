import React from 'react';
import { Chip } from '../core/Chip.jsx';
import { Icon } from '../core/Icon.jsx';

export function PostCard({ title, excerpt, category, date, readTime, thumbnail, tint = 'var(--kw-waffle)', featured, style, ...rest }) {
  const [hot, setHot] = React.useState(false);
  return (
    <a href="#" {...rest} onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} style={{
      display: 'flex', flexDirection: featured ? 'row' : 'column', textDecoration: 'none',
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)', overflow: 'hidden',
      boxShadow: hot ? 'var(--shadow-lift)' : 'var(--shadow-card)',
      transform: hot ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--dur-3) var(--ease-out), box-shadow var(--dur-3) var(--ease-out)', ...style
    }}>
      <div style={{
        position: 'relative', background: tint, overflow: 'hidden',
        flex: featured ? '0 0 46%' : 'none', aspectRatio: featured ? 'auto' : '16/10'
      }}>
        {thumbnail && <img src={thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hot ? 'scale(1.03)' : 'scale(1)', transition: 'transform var(--dur-4) var(--ease-out)' }} />}
      </div>
      <div style={{ padding: featured ? 40 : 26, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {category && <Chip style={{ height: 32, alignSelf: 'flex-start' }}>{category}</Chip>}
        <div style={{ font: featured ? 'var(--type-h3)' : 'var(--type-h4)', color: 'var(--text-strong)' }}>{title}</div>
        {excerpt && <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{excerpt}</p>}
        <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 14, font: 'var(--type-caption)', color: 'var(--text-faint)' }}>
          {date && <span>{date}</span>}
          {readTime && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="clock" size={13} />{readTime}</span>}
          <Icon name="arrow-up-right" size={16} style={{ marginLeft: 'auto', color: hot ? 'var(--brand)' : 'var(--text-faint)', transition: 'color var(--dur-2) var(--ease-out)' }} />
        </div>
      </div>
    </a>
  );
}
