import React from 'react';
import { Pill } from '../core/Pill.jsx';

export function SectionHeader({ label, title, lead, align = 'split', tone = 'light', action, style, ...rest }) {
  const dark = tone === 'dark';
  const split = align === 'split';
  return (
    <div {...rest} style={{
      display: 'flex', flexDirection: split ? 'row' : 'column',
      alignItems: split ? 'flex-start' : align === 'center' ? 'center' : 'flex-start',
      justifyContent: 'space-between', gap: split ? 48 : 20,
      textAlign: align === 'center' ? 'center' : 'left', flexWrap: 'wrap', ...style
    }}>
      {label && <Pill tone={dark ? 'dark' : 'neutral'}>{label}</Pill>}
      <div style={{ maxWidth: split ? 640 : 760, display: 'flex', flexDirection: 'column', gap: 16, alignItems: align === 'center' ? 'center' : 'flex-start' }}>
        <h2 style={{ font: 'var(--type-h2)', textWrap: 'balance', color: dark ? '#fff' : 'var(--text-strong)' }}>{title}</h2>
        {lead && <p style={{ font: 'var(--type-body-lg)', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-body)' }}>{lead}</p>}
        {action}
      </div>
    </div>
  );
}
