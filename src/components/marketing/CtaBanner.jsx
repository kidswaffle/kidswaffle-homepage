import React from 'react';
import { Button } from '../core/Button.jsx';

export function CtaBanner({ title, lead, primaryLabel = '상담 신청하기', secondaryLabel, image, tone = 'waffle', style, ...rest }) {
  const dark = tone === 'dark';
  return (
    <div {...rest} style={{
      position: 'relative', display: 'grid', gridTemplateColumns: image ? 'repeat(auto-fit,minmax(320px,1fr))' : '1fr',
      gap: 40, alignItems: 'center', padding: 56, overflow: 'hidden',
      background: dark ? 'var(--surface-dark)' : 'var(--surface-card-alt)',
      borderRadius: 'var(--radius-2xl)', ...style
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20 }}>
        <h2 style={{ font: 'var(--type-h2)', color: dark ? '#fff' : 'var(--text-strong)' }}>{title}</h2>
        {lead && <p style={{ font: 'var(--type-body-lg)', color: dark ? 'var(--text-on-dark-muted)' : 'var(--kw-ink-700)', maxWidth: 460 }}>{lead}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          <Button icon="calendar" size="lg">{primaryLabel}</Button>
          {secondaryLabel && <Button variant={dark ? 'ghost' : 'secondary'} size="lg" iconRight="arrow-right">{secondaryLabel}</Button>}
        </div>
      </div>
      {image && <img src={image} alt="" style={{ justifySelf: 'center', maxHeight: 300, width: 'auto' }} />}
    </div>
  );
}
