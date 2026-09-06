/**
 * useModalA11y — shared accessible-modal behavior (P0)
 * - Moves focus into the dialog on open, restores it on close
 * - Traps Tab / Shift+Tab inside the dialog
 * - Escape dismisses (only when `dismissable`)
 * - Returns an onBackdrop handler that honors `dismissable`
 */
import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useModalA11y(open, onClose, opts = {}) {
  const { dismissable = true, autofocus = true } = opts;
  const ref = useRef(null);
  const prevFocus = useRef(null);
  const wasOpen = useRef(false);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // Focus in on open / restore on close (transition-guarded so rerenders don't steal focus)
  useEffect(() => {
    if (open && !wasOpen.current) {
      wasOpen.current = true;
      prevFocus.current = document.activeElement;
      if (autofocus) {
        const el = ref.current;
        const first = el ? el.querySelector(FOCUSABLE) : null;
        const target = first || el;
        if (target && target.focus) {
          try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
        }
      }
    } else if (!open && wasOpen.current) {
      wasOpen.current = false;
      const prev = prevFocus.current;
      prevFocus.current = null;
      if (prev && prev.focus) {
        try { prev.focus({ preventScroll: true }); } catch (e) { prev.focus(); }
      }
    }
  }, [open, autofocus]);

  // Trap Tab + Escape while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissable) {
        e.stopPropagation();
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const el = ref.current;
      if (!el) return;
      const items = [...el.querySelectorAll(FOCUSABLE)].filter(n => n.offsetParent !== null);
      if (items.length === 0) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, dismissable]);

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget && dismissable) closeRef.current();
  };

  return { ref, onBackdrop };
}
