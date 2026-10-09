import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Footer({ wordmark = 'KIDSWAFFLE', tagline = '오감으로 자라는 아이의 첫 놀이 시간', columns = [], social = [], legal = [], info, copyright = '© 2026 KIDSWAFFLE. All rights reserved.', style, ...rest }) {
  return (
    <footer {...rest} style={{ background: 'var(--surface-dark)', color: 'var(--text-on-dark)', padding: '72px 0 32px', ...style }}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 var(--gutter)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px,1.4fr) repeat(auto-fit,minmax(150px,1fr))', gap: 48, paddingBottom: 56 }}>
          <div>
            <div style={{ font: 'var(--type-display-3)', fontFamily: 'var(--font-display)', fontSize: 34, letterSpacing: '-.02em', color: '#fff' }}>
              {wordmark.slice(0, 4)}<span style={{ color: 'var(--kw-yellow)' }}>{wordmark.slice(4)}</span>
            </div>
            <p style={{ marginTop: 12, font: 'var(--type-body-sm)', color: 'var(--text-on-dark-muted)', maxWidth: 280 }}>{tagline}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              {social.map((s) => (
                <a key={s.name} href={s.href || '#'} aria-label={s.name} style={{
                  width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-dark)', color: 'var(--text-on-dark)'
                }}><Icon name={s.icon} size={18} /></a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <div style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-on-dark-muted)' }}>{col.title}</div>
              <ul style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((l) => (
                  <li key={l.label || l}><a href={l.href || '#'} onClick={l.onClick} style={{ font: 'var(--type-body-sm)', color: 'var(--text-on-dark)' }}>{l.label || l}</a>{l.note}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {info && <div style={{ paddingBottom: 28, font: 'var(--type-caption)', color: 'var(--text-on-dark-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>{info}</div>}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between',
          paddingTop: 28, borderTop: '1px solid var(--border-dark)',
          font: 'var(--type-caption)', color: 'var(--text-on-dark-muted)'
        }}>
          <span>{copyright}</span>
          <div style={{ display: 'flex', gap: 20 }}>{legal.map((l) => <a key={l.label || l} href={l.href || '#'} style={{ color: 'var(--text-on-dark-muted)' }}>{l.label || l}</a>)}</div>
        </div>
      </div>
    </footer>
  );
}
