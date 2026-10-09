import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function FeatureBullet({ icon, title, body, color = 'var(--brand)', tint = 'var(--brand-wash)', layout = 'stack', style, ...rest }) {
  const row = layout === 'row';
  return (
    <div {...rest} style={{ display: 'flex', flexDirection: row ? 'row' : 'column', gap: row ? 16 : 18, alignItems: 'flex-start', ...style }}>
      <span style={{ width: 52, height: 52, flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-md)', background: tint }}>
        <Icon name={icon} size={24} color={color} />
      </span>
      <div>
        <div style={{ font: 'var(--type-h4)', color: 'var(--text-strong)' }}>{title}</div>
        <p style={{ marginTop: 8, font: 'var(--type-body)', color: 'var(--text-body)' }}>{body}</p>
      </div>
    </div>
  );
}
