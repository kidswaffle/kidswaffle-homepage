import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Input({ label, hint, error, icon, id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const uid = id || 'kw-in-' + React.useId();
  return (
    <label htmlFor={uid} style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && <span style={{ font: 'var(--type-h5)', fontSize: 15, color: 'var(--text-strong)' }}>{label}</span>}
      <span style={{
        display: 'flex', alignItems: 'center', gap: 10, height: 56, padding: '0 20px',
        background: 'var(--surface-input)', borderRadius: 'var(--radius-md)',
        border: '1px solid ' + (error ? 'var(--kw-danger)' : focus ? 'var(--brand)' : 'var(--border-subtle)'),
        boxShadow: focus ? 'var(--focus-ring)' : 'none',
        transition: 'border-color var(--dur-2) var(--ease-out), box-shadow var(--dur-2) var(--ease-out)'
      }}>
        {icon && <Icon name={icon} size={18} style={{ color: 'var(--text-muted)' }} />}
        <input id={uid} {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{
          flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'none',
          font: 'var(--type-body)', color: 'var(--text-strong)'
        }} />
      </span>
      {(error || hint) && <span style={{ font: 'var(--type-body-sm)', fontSize: 13, color: error ? 'var(--kw-danger)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </label>
  );
}
