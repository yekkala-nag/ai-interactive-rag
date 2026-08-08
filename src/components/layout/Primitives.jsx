/**
 * Layout Primitives — Composable, responsive, accessible
 */

import { useState, useEffect, useRef } from 'react';

// ============================================
// Page — Root layout with sidebar + main
// ============================================
export function Page({ children, sidebar, sidebarCollapsed, onSidebarToggle }) {
  const pageStyles = {
    page: { display: 'flex', minHeight: '100vh', background: 'var(--ds-color-bg-canvas)' },
    sidebar: { height: '100vh', position: 'sticky', top: 0, background: 'var(--ds-color-bg-surface)', borderRight: '1px solid var(--ds-color-border-subtle)', display: 'flex', flexDirection: 'column', zIndex: 'var(--ds-zIndex-sidebar)', overflow: 'hidden' },
    main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
  };
  return (
    <div style={pageStyles.page}>
      <aside style={{
        ...pageStyles.sidebar,
        width: sidebarCollapsed ? '72px' : '280px',
        minWidth: sidebarCollapsed ? '72px' : '280px',
        transition: 'width var(--ds-motion-duration-base) var(--ds-motion-easing-standard), min-width var(--ds-motion-duration-base) var(--ds-motion-easing-standard)',
      }} aria-label="Main navigation">
        {sidebar}
      </aside>
      <main style={pageStyles.main} role="main">
        {children}
      </main>
    </div>
  );
}

// ============================================
// Container — Constrained content width
// ============================================
export function Container({ children, size = 'normal', className, style, ...props }) {
  const sizeMap = {
    narrow: '640px',
    normal: '960px',
    wide: '1280px',
    full: '100%',
  };
  const containerStyles = {
    container: { width: '100%', margin: '0 auto', padding: '0 var(--ds-space-6)' },
  };
  return (
    <div style={{ ...containerStyles.container, maxWidth: sizeMap[size], ...style }} className={className} {...props}>
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
    bordered: { border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-lg)' },
    elevated: { boxShadow: 'var(--ds-shadow-sm)', borderRadius: 'var(--ds-radius-lg)' },
    hero: { borderRadius: 'var(--ds-radius-xl)', background: 'linear-gradient(135deg, var(--ds-color-bg-surface) 0%, var(--ds-color-bg-surfaceHover) 100%)', border: '1px solid var(--ds-color-border-subtle)' },
  };
  const sectionStyles = {
    section: { marginBottom: 'var(--ds-space-8)' },
    sectionHeader: { marginBottom: 'var(--ds-space-4)' },
    sectionBody: {},
    sectionFooter: { marginTop: 'var(--ds-space-6)', paddingTop: 'var(--ds-space-4)', borderTop: '1px solid var(--ds-color-border-subtle)' },
  };
  return (
    <section style={{ ...sectionStyles.section, ...variantStyles[variant], ...style }} className={className} {...props}>
      {children}
    </section>
  );
}

Section.Header = function SectionHeader({ children, style, ...props }) {
  const sectionStyles = {
    sectionHeader: { marginBottom: 'var(--ds-space-4)' },
  };
  return <header style={{ ...sectionStyles.sectionHeader, ...style }} {...props}>{children}</header>;
};

Section.Body = function SectionBody({ children, style, ...props }) {
  return <div style={{ ...style }} {...props}>{children}</div>;
};

Section.Footer = function SectionFooter({ children, style, ...props }) {
  const sectionStyles = {
    sectionFooter: { marginTop: 'var(--ds-space-6)', paddingTop: 'var(--ds-space-4)', borderTop: '1px solid var(--ds-color-border-subtle)' },
  };
  return <footer style={{ ...sectionStyles.sectionFooter, ...style }} {...props}>{children}</footer>;
};

// ============================================
// Grid — Responsive grid layout
// ============================================
export function Grid({ children, columns = { base: 1 }, gap = 'md', className, style, ...props }) {
  const gapMap = { sm: 'var(--ds-space-3)', md: 'var(--ds-space-5)', lg: 'var(--ds-space-8)' };
  const colStyle = typeof columns === 'number'
    ? `repeat(${columns}, 1fr)`
    : `repeat(${columns.base || 1}, 1fr)`;

  const gridStyles = {
    grid: { display: 'grid', width: '100%' },
    gridItem: { minWidth: 0 },
  };
  return (
    <div style={{ ...gridStyles.grid, gridTemplateColumns: colStyle, gap: gapMap[gap] }} className={className} {...props}>
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