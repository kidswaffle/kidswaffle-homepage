import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function TestimonialCard({ quote, author, meta, rating = 5, accent = 'var(--kw-coral)', style, ...rest }) {
  return (
    <div {...rest} style={{
      display: 'flex', flexDirection: 'column', gap: 20, padding: 32,
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-card)', ...style
    }}>
      <Icon name="quote" size={26} style={{ color: accent }} />
      <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-strong)', flex: 1 }}>{quote}</p>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: rating }).map((_, i) => <Icon key={i} name="star" size={16} style={{ color: 'var(--kw-yellow)' }} />)}
      </div>
      <div style={{ paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ font: 'var(--type-h5)', color: 'var(--text-strong)' }}>{author}</div>
        {meta && <div style={{ marginTop: 4, font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{meta}</div>}
      </div>
    </div>
  );
}
