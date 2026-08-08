/**
 * Feedback Components — Toast, Modal, Tooltip, Skeleton, EmptyState
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Core.jsx';
import { Flex } from '../layout/Primitives.jsx';

// ============================================
// Toast — Non-blocking notifications
// ============================================
const toastContainerRef = { current: null };

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = (message, options = {}) => {
    const id = Date.now() + Math.random();
    const toast = { id, message, ...options };
    setToasts(prev => [...prev, toast]);
    if (options.duration !== 0) {
      setTimeout(() => dismiss(id), options.duration || 4000);
    }
    return id;
  };

  const dismiss = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const success = (msg, opts) => show(msg, { ...opts, type: 'success' });
  const error = (msg, opts) => show(msg, { ...opts, type: 'danger', duration: 6000 });
  const warning = (msg, opts) => show(msg, { ...opts, type: 'warning' });
  const info = (msg, opts) => show(msg, { ...opts, type: 'info' });

  return { toasts, show, dismiss, success, error, warning, info };
}

export function ToastProvider({ children }) {
  const { toasts } = useToast();
  return (
    <>
      {children}
      <div style={{
        position: 'fixed', bottom: 'var(--ds-space-6)', right: 'var(--ds-space-6)',
        zIndex: 'var(--ds-zIndex-toast)', display: 'flex', flexDirection: 'column',
        gap: 'var(--ds-space-3)', pointerEvents: 'none',
      }}>
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </>
  );
}

function Toast({ message, type = 'info', title, action, onDismiss, duration = 4000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration !== 0) {
      const timer = setTimeout(() => { setVisible(false); setTimeout(() => onDismiss?.(), 200); }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  if (!visible) return null;

  const typeStyles = {
    info: { bg: 'var(--ds-color-module-platform-light)', border: 'var(--ds-color-module-platform-primary)', icon: 'ℹ️' },
    success: { bg: '#DCFCE7', border: '#16A34A', icon: '✅' },
    warning: { bg: '#FEF9C3', border: '#CA8A04', icon: '⚠️' },
    danger: { bg: '#FEF2F2', border: '#DC2626', icon: '🚫' },
  };
  const style = typeStyles[type];

  return (
    <div
      style={{
        pointerEvents: 'auto',
        display: 'flex', gap: 'var(--ds-space-3)',
        padding: 'var(--ds-space-4)',
        background: style.bg,
        border: `1px solid ${style.border}40`,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: 'var(--ds-radius-lg)',
        boxShadow: 'var(--ds-shadow-lg)',
        minWidth: '300px', maxWidth: '480px',
        animation: 'slideIn var(--ds-motion-duration-base) var(--ds-motion-easing-spring)',
      }}
    >
      <style jsx>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      <span style={{ fontSize: '1.25rem', flexShrink: 0, marginTop: '2px' }}>{style.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: 'var(--ds-font-weight-semibold)', color: style.border, marginBottom: 'var(--ds-space-1)' }}>{title}</div>}
        <div style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-body)', lineHeight: 'var(--ds-font-lineHeight-relaxed)' }}>{message}</div>
        {action && <Button variant="ghost" size="sm" onClick={action.onClick} style={{ marginTop: 'var(--ds-space-2)' }}>{action.label}</Button>}
      </div>
      <button onClick={() => { setVisible(false); onDismiss?.(); }} style={{ background: 'none', border: 'none', color: 'var(--ds-color-text-tertiary)', cursor: 'pointer', padding: 'var(--ds-space-1)', fontSize: '1.25rem', lineHeight: 1, flexShrink: 0 }} aria-label="Dismiss">×</button>
    </div>
  );
}

// ============================================
// Modal — Focus-trapped, accessible
// ============================================
export function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true, style, ...props }) {
  const overlayRef = useRef(null);
  const previousActive = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActive.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      const focusable = overlayRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.[0]?.focus();
      document.addEventListener('keydown', handleKey);
    } else {
      document.body.style.overflow = '';
      previousActive.current?.focus();
    }
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', handleKey); };
  }, [isOpen]);

  const handleKey = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab') trapFocus(e);
  };

  const trapFocus = (e) => {
    const focusable = overlayRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-width: 400px',
    md: 'max-width: 560px',
    lg: 'max-width: 800px',
    xl: 'max-width: 1000px',
    full: 'max-width: 95vw',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 'var(--ds-zIndex-modal)',
        background: 'var(--ds-color-overlay-modal)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--ds-space-6)', animation: 'fadeIn var(--ds-motion-duration-fast)',
      }}
    >
      <style jsx>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div
        ref={overlayRef}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', ...sizeStyles[size],
          background: 'var(--ds-color-bg-surface)',
          borderRadius: 'var(--ds-radius-xl)',
          boxShadow: 'var(--ds-shadow-xl)',
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflow: 'hidden',
          animation: 'slideUp var(--ds-motion-duration-base) var(--ds-motion-easing-spring)',
        }}
        role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}
      >
        <style jsx>{`@keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        {(title || showClose) && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--ds-space-4) var(--ds-space-6)',
            borderBottom: '1px solid var(--ds-color-border-subtle)',
          }}>
            {title && <h2 id="modal-title" style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'var(--ds-font-weight-semibold)' }}>{title}</h2>}
            {showClose && (
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--ds-color-text-tertiary)', cursor: 'pointer', padding: 'var(--ds-space-1)', fontSize: '1.5rem', lineHeight: 1 }} aria-label="Close">×</button>
            )}
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--ds-space-6)', ...style }}>{children}</div>
      </div>
    </div>
  );
}

// ============================================
// Tooltip — Hover/focus, smart positioning
// ============================================
export function Tooltip({ content, children, position = 'top', delay = 200 }) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);
  const childRef = useRef(null);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  const child = React.Children.only(children);
  const childProps = {
    ref: childRef,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  };

  if (!visible) return React.cloneElement(child, childProps);

  return (
    <>
      {React.cloneElement(child, childProps)}
      <div
        style={{
          position: 'fixed', zIndex: 'var(--ds-zIndex-tooltip)',
          background: 'var(--ds-color-text-primary)', color: 'var(--ds-color-text-inverse)',
          padding: 'var(--ds-space-2) var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)',
          fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'var(--ds-font-weight-medium)',
          whiteSpace: 'nowrap', boxShadow: 'var(--ds-shadow-lg)',
          pointerEvents: 'none', animation: 'fadeIn var(--ds-motion-duration-fast)',
        }}
      >
        {content}
      </div>
    </>
  );
}

// ============================================
// Skeleton — Loading placeholders
// ============================================
export function Skeleton({ variant = 'text', width = '100%', height, count = 1, style, ...props }) {
  const variants = {
    text: { height: '1rem', borderRadius: 'var(--ds-radius-sm)', marginBottom: 'var(--ds-space-2)' },
    title: { height: '1.5rem', borderRadius: 'var(--ds-radius-sm)', marginBottom: 'var(--ds-space-3)' },
    card: { height: '200px', borderRadius: 'var(--ds-radius-lg)' },
    avatar: { height: '40px', width: '40px', borderRadius: '50%' },
    button: { height: '40px', width: '120px', borderRadius: 'var(--ds-radius-md)' },
  };

  const v = variants[variant] || variants.text;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-2)', ...style }} {...props}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          style={{
            width: variant === 'avatar' || variant === 'button' ? v.width : width,
            height: height || v.height,
            borderRadius: v.borderRadius,
            background: 'linear-gradient(90deg, var(--ds-color-border-subtle) 25%, var(--ds-color-bg-surfaceHover) 50%, var(--ds-color-border-subtle) 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            ...v,
          }}
        />
      ))}
    </div>
  );
}

if (typeof document !== 'undefined' && !document.getElementById('ds-skeleton-styles')) {
  const style = document.createElement('style');
  style.id = 'ds-skeleton-styles';
  style.textContent = `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;
  document.head.appendChild(style);
}

// ============================================
// EmptyState — Illustrative empty states
// ============================================
export function EmptyState({ icon = '📭', title, description, action, style, ...props }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: 'var(--ds-space-16) var(--ds-space-8)', ...style,
    }} {...props}>
      <div style={{ fontSize: '4rem', marginBottom: 'var(--ds-space-6)', opacity: 0.5 }}>{icon}</div>
      <h3 style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'var(--ds-font-weight-semibold)', color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-space-3)' }}>{title}</h3>
      <p style={{ fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-text-secondary)', maxWidth: '400px', lineHeight: 'var(--ds-font-lineHeight-relaxed)', marginBottom: 'var(--ds-space-6)' }}>{description}</p>
      {action && <Button {...action} />}
    </div>
  );
}

// ============================================
// Progress — Linear/circular progress
// ============================================
export function Progress({ value = 0, max = 100, size = 'md', showLabel = false, label, style, ...props }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const sizeMap = { sm: 4, md: 8, lg: 12 };
  const height = sizeMap[size];

  return (
    <div style={{ width: '100%', ...style }} {...props}>
      <div style={{
        height: height, width: '100%',
        background: 'var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-full)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${percentage}%`,
          background: 'var(--ds-color-module-foundations-primary)',
          borderRadius: 'var(--ds-radius-full)',
          transition: 'width var(--ds-motion-duration-base) var(--ds-motion-easing-standard)',
        }} />
      </div>
      {(showLabel || label) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--ds-space-2)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
          <span>{label || 'Progress'}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
}