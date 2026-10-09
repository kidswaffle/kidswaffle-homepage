import React from 'react';

export function LogoTicker({ caption, items = [], speed = 34, style, ...rest }) {
  const doubled = items.concat(items);
  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 28, ...style }}>
      <style>{'@keyframes kwTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}'}</style>
      {caption && <p style={{ textAlign: 'center', font: 'var(--type-body)', color: 'var(--text-muted)' }}>{caption}</p>}
      <div style={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
        WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)'
      }}>
        <div style={{ display: 'flex', gap: 20, width: 'max-content', animation: 'kwTicker ' + speed + 's linear infinite' }}>
          {doubled.map((it, i) => {
            const isImg = typeof it === 'object' && it && it.logo;
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                minWidth: 220, height: 116, padding: '0 28px',
                background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)',
                whiteSpace: 'nowrap'
              }}>
                {isImg
                  ? <>
                      <img src={it.logo} alt={it.name} style={{ height: 34, maxWidth: 150, width: 'auto', objectFit: 'contain' }} />
                      <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{it.name}</span>
                    </>
                  : <span style={{ font: 'var(--type-h4)', fontFamily: 'var(--font-display)', color: 'var(--kw-ink-500)' }}>{it}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
