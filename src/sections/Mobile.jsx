import React from 'react';
import { Button } from '../components/core/Button.jsx';
import { IconButton } from '../components/core/IconButton.jsx';
import { Icon } from '../components/core/Icon.jsx';
import { Card } from '../components/core/Card.jsx';
import { Pill } from '../components/core/Pill.jsx';
import { SectionHeader } from '../components/marketing/SectionHeader.jsx';
import { KAKAO, goto, useIsMobile } from '../lib.js';

export const NAV = { '브랜드 소개': 'brand', '오감놀이': 'program', '학부모 후기': 'reviews', '수업 영상': 'videos', '자주 묻는 질문': 'faq' };

// Phone header: wordmark + Kakao CTA in a floating pill; the section links fold into a drawer card.
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="kw-mnav" style={{ position: 'sticky', top: 12, zIndex: 50, margin: '12px 16px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 64, padding: '0 10px 0 20px', background: 'var(--surface-card)', borderRadius: 'var(--radius-pill)', boxShadow: 'var(--shadow-nav)' }}>
        <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21, letterSpacing: '-.02em', color: 'var(--text-strong)' }}>
          KIDS<span style={{ color: 'var(--brand)' }}>WAFFLE</span>
        </span>
        <Button size="sm" variant="dark" href={KAKAO} target="_blank" rel="noreferrer">카카오톡 상담</Button>
        <IconButton name={open ? 'x' : 'menu'} label="메뉴" variant="ghost" aria-expanded={open} onClick={() => setOpen(!open)} />
      </div>
      {open && (
        <Card pad={12} radius="var(--radius-lg)" style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: 'var(--shadow-lift)' }}>
          {Object.entries(NAV).map(([label, id]) => (
            <a key={label} href={'#' + id} onClick={(e) => { setOpen(false); goto(id)(e); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 12px', borderRadius: 'var(--radius-sm)', font: 'var(--type-h5)', color: 'var(--text-strong)' }}>
              {label}<Icon name="chevron-right" size={16} style={{ color: 'var(--text-faint)' }} />
            </a>
          ))}
        </Card>
      )}
    </div>
  );
}

// SectionHeader on desktop; on phones the mobile kit's left-aligned stack with a 28px heading.
export function SectionHead({ label, title, lead, tone = 'light', action, align, ...rest }) {
  const mobile = useIsMobile();
  if (!mobile) return <SectionHeader label={label} title={title} lead={lead} tone={tone} action={action} align={align} {...rest} />;
  const dark = tone === 'dark';
  const center = align === 'center';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: center ? 'center' : 'flex-start', textAlign: center ? 'center' : 'left' }}>
      {label && <Pill tone={dark ? 'dark' : 'neutral'}>{label}</Pill>}
      <h2 style={{ font: 'var(--type-h3)', fontSize: 28, color: dark ? '#fff' : 'var(--text-strong)' }}>{title}</h2>
      {lead && <p style={{ font: 'var(--type-body)', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-body)' }}>{lead}</p>}
      {action}
    </div>
  );
}

// Horizontal swipe rail that bleeds to the screen edges.
// `itemWidth` + `center` pads both ends so the first/last card sits in the middle of the screen.
export function Rail({ gap = 12, itemWidth, children }) {
  const pad = itemWidth ? 'max(var(--gutter), calc((100vw - ' + itemWidth + ') / 2))' : 'var(--gutter)';
  return (
    <div className="kw-rail" style={{ display: 'flex', gap, overflowX: 'auto', margin: '0 calc(var(--gutter) * -1)', padding: '4px ' + pad + ' 12px', scrollSnapType: 'x mandatory', scrollPaddingInline: pad, ...(itemWidth ? { '--kw-snap': 'center' } : {}) }}>
      {children}
    </div>
  );
}
