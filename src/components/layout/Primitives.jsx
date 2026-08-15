/**
 * Layout Primitives — Composable, responsive, accessible
 */

import { useState, useEffect, useRef } from 'react';

// ============================================
// Page — Root layout with sidebar + main
// ============================================
// ============================================
// Page — Root layout with sidebar + main (Responsive Mobile/Tablet)
// ============================================
export function Page({ children, sidebar, sidebarCollapsed, onSidebarToggle, mobileOpen, onCloseMobile }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarWidth = isMobile
    ? (mobileOpen ? '320px' : '0px')
    : (sidebarCollapsed ? '72px' : '320px');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--ds-color-bg-canvas)', position: 'relative' }}>
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobile && mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
            backdropFilter: 'blur(3px)',
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* SIDEBAR CONTAINER */}
      <div style={{
        height: '100vh',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0, left: 0,
        background: 'var(--ds-color-bg-surface)',
        borderRight: '1px solid var(--ds-color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: isMobile ? 100 : 'var(--ds-zIndex-sidebar)',
        width: sidebarWidth,
        minWidth: sidebarWidth,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: isMobile && mobileOpen ? '0 20px 40px rgba(0,0,0,0.4)' : 'none'
      }}>
        {sidebar}
      </div>

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', width: '100%' }} role="main">
        {children}
      </main>
    </div>
  );
}

// ============================================
// Container — Constrained content width (Responsive)
// ============================================
export function Container({ children, size = 'normal', className, style, ...props }) {
  const sizeMap = {
    narrow: '640px',
    normal: '960px',
    wide: '1280px',
    full: '100%',
  };
  return (
    <div style={{
      width: '100%',
      margin: '0 auto',
      padding: '0 clamp(12px, 3vw, 24px)',
      maxWidth: sizeMap[size],
      boxSizing: 'border-box',
      ...style
    }} className={className} {...props}>
      {children}
    </div>
  );
}

// ============================================
// Section — Semantic content block
// ============================================
export function Section({ children, variant = 'default', className, style, ...props }) {
  const variantStyles = {
    default: {},
    bordered: { border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-lg)', padding: 'clamp(12px, 2.5vw, 20px)' },
    elevated: { boxShadow: 'var(--ds-shadow-sm)', borderRadius: 'var(--ds-radius-lg)', padding: 'clamp(12px, 2.5vw, 20px)' },
    hero: { borderRadius: 'var(--ds-radius-xl)', background: 'linear-gradient(135deg, var(--ds-color-bg-surface) 0%, var(--ds-color-bg-surfaceHover) 100%)', border: '1px solid var(--ds-color-border-subtle)', padding: 'clamp(16px, 3vw, 28px)' },
  };
  const sectionStyles = {
    section: { marginBottom: 'var(--ds-space-8)' },
  };
  return (
    <section style={{ ...sectionStyles.section, ...variantStyles[variant], ...style }} className={className} {...props}>
      {children}
    </section>
  );
}

Section.Header = function SectionHeader({ children, style, ...props }) {
  return <header style={{ marginBottom: 'var(--ds-space-4)', ...style }} {...props}>{children}</header>;
};

Section.Body = function SectionBody({ children, style, ...props }) {
  return <div style={{ ...style }} {...props}>{children}</div>;
};

Section.Footer = function SectionFooter({ children, style, ...props }) {
  return <footer style={{ marginTop: 'var(--ds-space-6)', paddingTop: 'var(--ds-space-4)', borderTop: '1px solid var(--ds-color-border-subtle)', ...style }} {...props}>{children}</footer>;
};

// ============================================
// Grid — Responsive grid layout (Auto-wrapping)
// ============================================
export function Grid({ children, columns = { base: 1 }, gap = 'md', className, style, ...props }) {
  const gapMap = { sm: 'var(--ds-space-3)', md: 'var(--ds-space-5)', lg: 'var(--ds-space-8)' };
  const gapVal = typeof gap === 'string' && gapMap[gap] ? gapMap[gap] : typeof gap === 'number' ? `${gap * 4}px` : gap;

  let colStyle = `repeat(1, 1fr)`;

  if (typeof columns === 'number') {
    if (columns >= 6) colStyle = `repeat(auto-fit, minmax(min(100%, 80px), 1fr))`;
    else if (columns >= 4) colStyle = `repeat(auto-fit, minmax(min(100%, 200px), 1fr))`;
    else if (columns === 3) colStyle = `repeat(auto-fit, minmax(min(100%, 240px), 1fr))`;
    else if (columns === 2) colStyle = `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`;
    else colStyle = `repeat(${columns}, 1fr)`;
  } else if (columns && typeof columns === 'object') {
    colStyle = `repeat(${columns.base || 1}, 1fr)`;
  }

  const gridStyles = {
    grid: { display: 'grid', width: '100%', gridTemplateColumns: colStyle, gap: gapVal },
  };
  return (
    <div style={{ ...gridStyles.grid, ...style }} className={className} {...props}>
      {children}
    </div>
  );
}

Grid.Item = function GridItem({ children, span, style, ...props }) {
  const gridStyles = { gridItem: { minWidth: 0 } };
  return <div style={{ ...gridStyles.gridItem, gridColumn: span ? `span ${span}` : undefined, ...style }} {...props}>{children}</div>;
};

// ============================================
// Flex — Simple flex container
// ============================================
export function Flex({ children, direction = 'row', align = 'stretch', justify = 'flex-start', gap = 'md', wrap = false, style, ...props }) {
  const gapMap = { none: 0, xs: 'var(--ds-space-1)', sm: 'var(--ds-space-2)', md: 'var(--ds-space-4)', lg: 'var(--ds-space-6)', xl: 'var(--ds-space-8)' };
  const flexStyles = { flex: { display: 'flex' } };
  return (
    <div style={{ ...flexStyles.flex, flexDirection: direction, alignItems: align, justifyContent: justify, gap: gapMap[gap], flexWrap: wrap ? 'wrap' : 'nowrap', ...style }} {...props}>
      {children}
    </div>
  );
}

// ============================================
// Stack — Vertical stack with consistent spacing
// ============================================
export function Stack({ children, gap = 'md', align = 'stretch', style, ...props }) {
  const gapMap = { none: 0, xs: 'var(--ds-space-1)', sm: 'var(--ds-space-2)', md: 'var(--ds-space-4)', lg: 'var(--ds-space-6)', xl: 'var(--ds-space-8)' };
  const stackStyles = { stack: { display: 'flex', flexDirection: 'column', width: '100%' }, stackItem: { width: '100%' } };
  const childArray = Array.isArray(children) ? children : [children];
  return (
    <div style={{ ...stackStyles.stack, gap: gapMap[gap], alignItems: align, ...style }} {...props}>
      {childArray.map((child, i) => (
        <div key={i} style={stackStyles.stackItem}>{child}</div>
      ))}
    </div>
  );
}