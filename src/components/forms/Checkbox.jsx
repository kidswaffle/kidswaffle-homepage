import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({ label, checked, onChange, id, style, ...rest }) {
  const uid = id || 'kw-cb-' + React.useId();
  return (
    <label htmlFor={uid} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', ...style }}>
      <input id={uid} type="checkbox" checked={checked} onChange={onChange} {...rest}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1 }} />
      <span style={{
        width: 26, height: 26, display: 'grid', placeItems: 'center', flex: '0 0 auto',
        borderRadius: 'var(--radius-xs)',
        background: checked ? 'var(--brand)' : 'var(--surface-input)',
        border: '1px solid ' + (checked ? 'var(--brand)' : 'var(--border-strong)'),
        transition: 'background var(--dur-2) var(--ease-out), border-color var(--dur-2) var(--ease-out)'
      }}>
        {checked && <Icon name="check" size={16} color="#fff" />}
      </span>
      <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{label}</span>
    </label>
  );
}
