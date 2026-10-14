import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';

export function NavBar({ items = [], active, onNavigate, wordmark = 'KIDSWAFFLE', logoSrc, logoAlt = '키즈와플 KIDSWAFFLE', ctaLabel = '상담 신청하기', secondaryLabel = '상담 문의', secondaryHref, ctaHref, onCta, sticky, style, ...rest }) {
  return (
    <nav {...rest} className="kw-nav" style={{
      position: sticky ? 'sticky' : 'relative', top: sticky ? 20 : 'auto', zIndex: 40,
      display: 'flex', alignItems: 'center', gap: 16, height: 76, padding: '0 12px 0 32px',
      background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-nav)', ...style
    }}>
      <style>{'@media(max-width:1240px){.kw-nav-sec{display:none!important}.kw-nav-link{padding:0 12px!important}}@media(max-width:1060px){.kw-nav-links{display:none!important}.kw-nav{padding-left:20px!important}}'}</style>
      <div className="kw-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: '1 1 auto', minWidth: 0 }}>
        {items.map((it) => {
          const on = active === it.label;
          return (
            <button key={it.label} className="kw-nav-link" onClick={() => onNavigate && onNavigate(it.label)} style={{
              display: 'flex', alignItems: 'center', gap: 6, height: 44, padding: '0 16px',
              borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer',
              font: 'var(--type-nav)', whiteSpace: 'nowrap', color: on ? 'var(--text-strong)' : 'var(--text-body)',
              background: on ? 'var(--kw-cream)' : 'transparent',
              transition: 'background var(--dur-2) var(--ease-out), color var(--dur-2) var(--ease-out)'
            }}>
              {it.label}
              {it.dropdown && <Icon name="chevron-down" size={16} style={{ color: 'var(--text-muted)' }} />}
            </button>
          );
        })}
      </div>
      {logoSrc
        ? (
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label={logoAlt + ' 첫 화면으로'} style={{ order: -1, display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
            <img src={logoSrc} alt={logoAlt} width="584" height="153" style={{ height: 46, width: 'auto' }} />
          </a>
        )
        : (
        <span style={{
          order: -1, font: 'var(--type-h4)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24,
          letterSpacing: '-.02em', color: 'var(--text-strong)', whiteSpace: 'nowrap'
        }}>
          {wordmark.slice(0, 4)}<span style={{ color: 'var(--brand)' }}>{wordmark.slice(4)}</span>
        </span>
        )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto', justifyContent: 'flex-end' }}>
        {secondaryLabel && <Button className="kw-nav-sec" variant="ghost" size="sm" href={secondaryHref} target={secondaryHref && secondaryHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{secondaryLabel}</Button>}
        <Button variant="dark" size="sm" href={ctaHref} onClick={onCta} target={ctaHref && ctaHref.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{ctaLabel}</Button>
      </div>
    </nav>
  );
}
