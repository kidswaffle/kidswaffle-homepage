import React from 'react';
import { Chip } from '../core/Chip.jsx';
import { Button } from '../core/Button.jsx';
import { Icon } from '../core/Icon.jsx';

export function ProgramCard({ badge, badgeIcon = 'sparkles', title, body, accent = 'var(--kw-yellow)', image, imageAlt = '', imageFit = 'cover', primaryFocus = [], secondaryFocus = [], ctaLabel = '수업 살펴보기', highlights = [], style, ...rest }) {
  return (
    <div {...rest} style={{
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', ...style
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40, padding: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, justifyContent: 'center' }}>
          {badge && <Chip icon={badgeIcon} tone="neutral">{badge}</Chip>}
          <h3 style={{ font: 'var(--type-h2)', fontSize: 38, color: 'var(--text-strong)' }}>{title}</h3>
          <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-body)', maxWidth: 420 }}>{body}</p>
          {ctaLabel && <Button variant="secondary" iconRight="arrow-right">{ctaLabel}</Button>}
        </div>
        <div style={{ position: 'relative', minHeight: 440, borderRadius: 'var(--radius-xl)', background: accent, overflow: 'hidden', display: imageFit === 'contain' ? 'flex' : 'block', flexDirection: 'column' }}>
          {image && <img src={image} alt={imageAlt} style={imageFit === 'contain' ? { flex: '1 1 0', minHeight: 220, width: '100%', objectFit: 'contain', objectPosition: 'center', padding: '24px 24px 8px', animation: 'kwBob 5.6s ease-in-out infinite' } : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: imageFit, }} />}
          <div style={{
            position: imageFit === 'contain' ? 'relative' : 'absolute', margin: imageFit === 'contain' ? '0 20px 20px' : 0, ...(imageFit === 'contain' ? {} : { left: 20, right: 20, bottom: 20 }), display: 'grid',
            gridTemplateColumns: '1fr 1fr', background: 'var(--surface-card)',
            borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ padding: 20 }}>
              <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-brand)' }}>주요 발달</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>{primaryFocus.map((t) => <Chip key={t} style={{ height: 34 }}>{t}</Chip>)}</div>
            </div>
            <div style={{ padding: 20, borderLeft: '1px solid var(--border-subtle)' }}>
              <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>함께 자라는 힘</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>{secondaryFocus.map((t) => <Chip key={t} style={{ height: 34 }}>{t}</Chip>)}</div>
            </div>
          </div>
        </div>
      </div>
      {highlights.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32,
          padding: 36 + 'px 40px', borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)'
        }}>
          {highlights.map((h) => (
            <div key={h.title} style={{ display: 'flex', gap: 12 }}>
              <Icon name="check" size={18} style={{ color: accent, marginTop: 4 }} />
              <div>
                <div style={{ font: 'var(--type-h5)', color: 'var(--text-strong)' }}>{h.title}</div>
                <p style={{ marginTop: 6, font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{h.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
