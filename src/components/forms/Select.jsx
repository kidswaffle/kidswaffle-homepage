import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Select({ label, hint, options = [], id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || 'kw-sel-' + React.useId();
  return (
    <label htmlFor={uid} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && <span style={{ font: 'var(--type-h5)', fontSize: 15, color: 'var(--text-strong)' }}>{label}</span>}
      <span style={{
        position: 'relative', display: 'flex', alignItems: 'center', height: 56, padding: '0 20px',
        background: 'var(--surface-input)', borderRadius: 'var(--radius-md)',
        border: '1px solid ' + (focus ? 'var(--brand)' : 'var(--border-subtle)'),
        boxShadow: focus ? 'var(--focus-ring)' : 'none'
      }}>
        <select id={uid} {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{
          flex: 1, minWidth: 0, appearance: 'none', border: 'none', outline: 'none', background: 'none',
          font: 'var(--type-body)', color: 'var(--text-strong)', cursor: 'pointer'
        }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <Icon name="chevron-down" size={18} style={{ color: 'var(--text-muted)', pointerEvents: 'none' }} />
      </span>
      {hint && <span style={{ font: 'var(--type-body-sm)', fontSize: 13, color: 'var(--text-muted)' }}>{hint}</span>}
    </label>
  );
}
