import React from 'react';
import { Icon } from './Icon.jsx';

export function Accordion({ items = [], defaultOpen = 0, style, ...rest }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{
            background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)', boxShadow: isOpen ? 'var(--shadow-card)' : 'none',
            transition: 'box-shadow var(--dur-2) var(--ease-out)', overflow: 'hidden'
          }}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, padding: '22px 26px', background: 'none', border: 'none', cursor: 'pointer',
              font: 'var(--type-h5)', color: 'var(--text-strong)', textAlign: 'left'
            }}>
              {it.q}
              <Icon name="chevron-down" size={20} style={{
                color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform var(--dur-3) var(--ease-out)'
              }} />
            </button>
            <div style={{
              maxHeight: isOpen ? 800 : 0, opacity: isOpen ? 1 : 0,
              transition: 'max-height var(--dur-3) var(--ease-out), opacity var(--dur-2) var(--ease-out)'
            }}>
              <p style={{ padding: '0 26px 24px', font: 'var(--type-body)', color: 'var(--text-body)' }}>{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
