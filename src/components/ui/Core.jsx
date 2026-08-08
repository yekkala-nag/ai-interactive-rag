/**
 * Core UI Components — Button, Card, Callout, Input, Badge, Avatar, Divider
 */

import { useState, useRef, useEffect } from 'react';
import { getModuleColors } from '../../design-system/tokens.js';

// ============================================
// Button — Primary, Secondary, Ghost, Danger
// ============================================
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  fullWidth = false,
  leftIcon,
  rightIcon,
  'aria-label': ariaLabel,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const variantStyles = {
    primary: {
      base: { background: 'var(--ds-color-module-foundations-primary)', color: 'white', border: 'none' },
      hover: { background: 'var(--ds-color-module-foundations-dark)' },
      active: { background: 'var(--ds-color-module-foundations-dark)', transform: 'scale(0.98)' },
      disabled: { background: 'var(--ds-color-border-default)', cursor: 'not-allowed' },
    },
    secondary: {
      base: { background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-default)' },
      hover: { background: 'var(--ds-color-bg-surfaceHover)', borderColor: 'var(--ds-color-border-strong)' },
      active: { background: 'var(--ds-color-border-subtle)' },
      disabled: { color: 'var(--ds-color-text-tertiary)', borderColor: 'var(--ds-color-border-subtle)', cursor: 'not-allowed' },
    },
    ghost: {
      base: { background: 'transparent', color: 'var(--ds-color-text-secondary)', border: 'none' },
      hover: { background: 'var(--ds-color-bg-surfaceHover)', color: 'var(--ds-color-text-primary)' },
      active: { background: 'var(--ds-color-border-subtle)' },
      disabled: { color: 'var(--ds-color-text-tertiary)', cursor: 'not-allowed' },
    },
    danger: {
      base: { background: 'var(--ds-color-state-error-light)', color: 'white', border: 'none' },
      hover: { background: 'var(--ds-color-state-error-dark)' },
      active: { background: 'var(--ds-color-state-error-dark)', transform: 'scale(0.98)' },
      disabled: { background: 'var(--ds-color-border-default)', cursor: 'not-allowed' },
    },
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: 'var(--ds-font-size-bodySm)', gap: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-sm)' },
    md: { padding: '10px 18px', fontSize: 'var(--ds-font-size-body)', gap: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-md)' },
    lg: { padding: '14px 24px', fontSize: 'var(--ds-font-size-bodyLg)', gap: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-lg)' },
  };

  const v = variantStyles[variant];
  const s = sizeStyles[size];

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--ds-font-family-sans)',
    fontWeight: 'var(--ds-font-weight-medium)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    transition: 'all var(--ds-motion-duration-fast) var(--ds-motion-easing-standard)',
    cursor: 'pointer',
    ...s,
    ...v.base,
    ...(fullWidth ? { width: '100%' } : {}),
  };

  let style = baseStyle;
  if (disabled || loading) style = { ...baseStyle, ...v.disabled };
  else if (active) style = { ...baseStyle, ...v.active };
  else if (hovered) style = { ...baseStyle, ...v.hover };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseDown={() => !disabled && !loading && setActive(true)}
      onMouseUp={() => setActive(false)}
      onMouseLeave={() => { setActive(false); setHovered(false); }}
      aria-label={ariaLabel}
      aria-busy={loading}
      style={style}
      {...props}
    >
      {loading ? (
        <svg style={{ width: '1em', height: '1em', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="31.4 31.4" style={{ animation: 'spin 1s linear infinite' }}></circle>
        </svg>
      ) : (
        <>
          {leftIcon && <span style={{ display: 'flex' }}>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span style={{ display: 'flex' }}>{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

// Keyframes for spinner
if (typeof document !== 'undefined' && !document.getElementById('ds-spinner-styles')) {
  const style = document.createElement('style');
  style.id = 'ds-spinner-styles';
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

// ============================================
// Card — Content container variants
// ============================================
export function Card({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  className,
  style,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);

  const variantStyles = {
    default: 'background: var(--ds-color-bg-surface); border: 1px solid var(--ds-color-border-subtle);',
    bordered: 'background: var(--ds-color-bg-surface); border: 1px solid var(--ds-color-border-default);',
    elevated: 'background: var(--ds-color-bg-surface); box-shadow: var(--ds-shadow-sm); border: none;',
    interactive: 'background: var(--ds-color-bg-surface); border: 1px solid var(--ds-color-border-subtle); cursor: pointer;',
  };

  const paddingStyles = {
    none: '0',
    sm: 'var(--ds-space-3)',
    md: 'var(--ds-space-5)',
    lg: 'var(--ds-space-6)',
  };

  let cardStyle = `border-radius: var(--ds-radius-lg); transition: all var(--ds-motion-duration-base) var(--ds-motion-easing-standard); ${variantStyles[variant]} ${paddingStyles[padding]}`;

  if (hover || variant === 'interactive') {
    if (isHovered) cardStyle += ' box-shadow: var(--ds-shadow-md); transform: translateY(-2px); border-color: var(--ds-color-border-strong);';
  }

  return (
    <div
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => (hover || variant === 'interactive') && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Media = function CardMedia({ children, ratio = '16/9', style, ...props }) {
  const [ratioW, ratioH] = ratio.split('/').map(Number);
  const paddingBottom = `${(ratioH / ratioW) * 100}%`;
  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom, borderRadius: 'var(--ds-radius-md) var(--ds-radius-md) 0 0', overflow: 'hidden', ...style }} {...props}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
};

Card.Body = function CardBody({ children, style, ...props }) {
  return <div style={{ padding: 'var(--ds-space-5)', ...style }} {...props}>{children}</div>;
};

Card.Footer = function CardFooter({ children, style, ...props }) {
  return <div style={{ padding: 'var(--ds-space-4) var(--ds-space-5)', borderTop: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-surfaceHover)', borderRadius: '0 0 var(--ds-radius-lg) var(--ds-radius-lg)', ...style }} {...props}>{children}</div>;
};

// ============================================
// Callout — Info, Tip, Warning, Danger, Success
// ============================================
export function Callout({ children, type = 'info', title, dismissible = false, onDismiss, style, ...props }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const typeConfig = {
    info: { color: 'var(--ds-color-module-platform-primary)', bg: 'var(--ds-color-module-platform-light)', icon: 'ℹ️', label: 'Information' },
    tip: { color: 'var(--ds-color-module-foundations-primary)', bg: 'var(--ds-color-module-foundations-light)', icon: '💡', label: 'Tip' },
    warning: { color: 'var(--ds-color-state-warning-light)', bg: '#FEF9C3', icon: '⚠️', label: 'Warning' },
    danger: { color: 'var(--ds-color-state-error-light)', bg: 'var(--ds-color-state-error-light)15', icon: '🚫', label: 'Error' },
    success: { color: 'var(--ds-color-state-success-light)', bg: '#DCFCE7', icon: '✅', label: 'Success' },
  };

  const config = typeConfig[type];

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--ds-space-3)',
        padding: 'var(--ds-space-4)',
        background: config.bg,
        border: `1px solid ${config.color}40`,
        borderLeft: `4px solid ${config.color}`,
        borderRadius: 'var(--ds-radius-md)',
        ...style,
      }}
      role="alert"
      {...props}
    >
      <span style={{ fontSize: '1.25em', flexShrink: 0, marginTop: '2px' }}>{config.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: 'var(--ds-font-weight-semibold)', color: config.color, marginBottom: 'var(--ds-space-1)' }}>{title}</div>}
        <div style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-body)', lineHeight: 'var(--ds-font-lineHeight-relaxed)' }}>{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={() => { setVisible(false); onDismiss?.(); }}
          style={{ background: 'none', border: 'none', color: 'var(--ds-color-text-tertiary)', cursor: 'pointer', padding: 'var(--ds-space-1)', fontSize: '1.25rem', lineHeight: 1, flexShrink: 0 }}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ============================================
// Badge — Status, module, count
// ============================================
export function Badge({ children, variant = 'default', size = 'md', dot = false, style, ...props }) {
  const variantStyles = {
    default: { background: 'var(--ds-color-bg-surfaceHover)', color: 'var(--ds-color-text-secondary)', border: '1px solid var(--ds-color-border-subtle)' },
    primary: { background: 'var(--ds-color-module-foundations-light)', color: 'var(--ds-color-module-foundations-dark)' },
    success: { background: '#DCFCE7', color: '#166534' },
    warning: { background: '#FEF9C3', color: '#713F12' },
    danger: { background: '#FEF2F2', color: '#991B1B' },
    module: (moduleId) => {
      const c = getModuleColors(moduleId);
      return { background: c.light, color: c.dark };
    },
  };

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: 'var(--ds-font-size-caption)', borderRadius: 'var(--ds-radius-full)' },
    md: { padding: '4px 10px', fontSize: 'var(--ds-font-size-bodySm)', borderRadius: 'var(--ds-radius-full)' },
    lg: { padding: '6px 14px', fontSize: 'var(--ds-font-size-body)', borderRadius: 'var(--ds-radius-full)' },
  };

  let vStyle = typeof variantStyles[variant] === 'function' ? variantStyles[variant](props.moduleId) : variantStyles[variant];
  if (props.moduleId && variant === 'module') vStyle = variantStyles.module(props.moduleId);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--ds-space-1)',
        fontFamily: 'var(--ds-font-family-sans)',
        fontWeight: 'var(--ds-font-weight-medium)',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
        ...vStyle,
        ...style,
      }}
      {...props}
    >
      {dot && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}

// ============================================
// Input — With label, error, helper
// ============================================
export function Input({
  label,
  error,
  helper,
  required = false,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helper ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-1)', width: '100%' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'var(--ds-font-weight-medium)', color: 'var(--ds-color-text-primary)' }}>
          {label} {required && <span style={{ color: 'var(--ds-color-state-error-light)' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        style={{
          padding: 'var(--ds-space-2) var(--ds-space-3)',
          fontSize: 'var(--ds-font-size-body)',
          fontFamily: 'var(--ds-font-family-sans)',
          color: 'var(--ds-color-text-primary)',
          background: 'var(--ds-color-bg-surface)',
          border: `1px solid ${error ? 'var(--ds-color-state-error-light)' : 'var(--ds-color-border-default)'}`,
          borderRadius: 'var(--ds-radius-md)',
          outline: 'none',
          transition: 'border-color var(--ds-motion-duration-fast), box-shadow var(--ds-motion-duration-fast)',
          width: '100%',
          '&:focus': { borderColor: 'var(--ds-color-border-focus)', boxShadow: '0 0 0 3px var(--ds-color-module-foundations-light)' },
        }}
        {...props}
      />
      {error && <p id={errorId} style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-state-error-light)' }} role="alert">{error}</p>}
      {helper && !error && <p id={helperId} style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>{helper}</p>}
    </div>
  );
}

// ============================================
// Divider — Semantic separator
// ============================================
export function Divider({ orientation = 'horizontal', label, style, ...props }) {
  if (orientation === 'vertical') {
    return <div style={{ width: '1px', height: '100%', background: 'var(--ds-color-border-subtle)', ...style }} {...props} />;
  }

  if (label) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-4)', ...style }} {...props}>
        <div style={{ flex: 1, height: '1px', background: 'var(--ds-color-border-subtle)' }} />
        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'var(--ds-font-weight-medium)', textTransform: 'uppercase', letterSpacing: 'var(--ds-font-letterSpacing-wide)' }}>{label}</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--ds-color-border-subtle)' }} />
      </div>
    );
  }

  return <hr style={{ border: 'none', height: '1px', background: 'var(--ds-color-border-subtle)', margin: 'var(--ds-space-6) 0', ...style }} {...props} />;
}

// ============================================
// Avatar — User/module identifier
// ============================================
export function Avatar({ src, alt, name, size = 'md', moduleId, style, ...props }) {
  const sizeMap = { sm: 28, md: 40, lg: 56, xl: 80 };
  const diameter = sizeMap[size];

  let content;
  if (src) {
    content = <img src={src} alt={alt || name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />;
  } else if (moduleId) {
    const c = getModuleColors(moduleId);
    content = <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: c.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: diameter * 0.4 }}>{props.icon || '⚡'}</div>;
  } else if (name) {
    const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    content = <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--ds-color-border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ds-color-text-secondary)', fontWeight: 'var(--ds-font-weight-semibold)', fontSize: diameter * 0.35 }}>{initials}</div>;
  }

  return (
    <div style={{ width: diameter, height: diameter, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, ...style }} {...props}>
      {content}
    </div>
  );
}