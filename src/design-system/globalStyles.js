/**
 * Global styles — CSS reset + design token injection
 * Import once at app root
 */

import { generateCSSVariables } from './tokens.js';

export const globalStyles = `
${generateCSSVariables({
  color: {
    bg: {
      canvas: '#F5F5F7',
      surface: '#FFFFFF',
      surfaceHover: '#EDEDF0',
      elevated: '#FFFFFF',
    },
    border: {
      subtle: '#E8E8EC',
      default: '#D4D4DA',
      strong: '#B8B8C4',
      focus: '#5EC4C8',
    },
    text: {
      primary: '#2D2D3A',
      secondary: '#4A4A5A',
      tertiary: '#6E6E80',
      inverse: '#F5F5F7',
      link: '#5EC4C8',
      linkHover: '#3A9B9F',
    },
    module: {
      foundations: { primary: '#5EC4C8', light: 'rgba(94,196,200,0.14)', dark: '#1F6B6E' },
      rag: { primary: '#F0A89A', light: 'rgba(240,168,154,0.14)', dark: '#C47A6A' },
      context: { primary: '#C9B8E8', light: 'rgba(201,184,232,0.14)', dark: '#6B5E94' },
      agents: { primary: '#F0A89A', light: 'rgba(240,168,154,0.14)', dark: '#C47A6A' },
      platform: { primary: '#5EC4C8', light: 'rgba(94,196,200,0.14)', dark: '#1F6B6E' },
      frontiers: { primary: '#C9B8E8', light: 'rgba(201,184,232,0.14)', dark: '#6B5E94' },
    },
    brand: {
      teal: '#5EC4C8',
      tealDark: '#3A9B9F',
      tealInk: '#1F6B6E',
      tealSoft: 'rgba(94,196,200,0.12)',
      coral: '#F0A89A',
      coralDeep: '#C47A6A',
      coralSoft: 'rgba(240,168,154,0.14)',
      lav: '#C9B8E8',
      lavDeep: '#9B89C4',
      lavInk: '#6B5E94',
      lavSoft: 'rgba(201,184,232,0.14)',
      ink: '#2D2D3A',
      muted: '#B8B8C4',
      line: '#E8E8EC',
      editor: '#0F1219',
    },
    state: {
      success: { light: '#2D9D6F', dark: '#34C47D' },
      warning: { light: '#D4930A', dark: '#F5B731' },
      error: { light: '#D44D4D', dark: '#EF6B6B' },
      info: { light: '#4A7DC9', dark: '#6B9EE8' },
    },
    overlay: {
      backdrop: 'rgba(45, 45, 58, 0.4)',
      modal: 'rgba(45, 45, 58, 0.6)',
    },
  },
  font: {
    family: {
      sans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
    },
    size: {
      display: '36px',
      h1: '28px',
      h2: '22px',
      h3: '18px',
      h4: '15px',
      bodyLg: '16px',
      body: '14px',
      bodySm: '13px',
      caption: '11px',
      code: '13px',
      codeSm: '12px',
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.25,
      normal: 1.35,
      relaxed: 1.6,
      loose: 1.7,
    },
    letterSpacing: {
      tight: '-0.02em',
      snug: '-0.01em',
      normal: '0',
      wide: '0.02em',
    },
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadow: {
    xs: '0 1px 2px rgba(0,0,0,0.03)',
    sm: '0 1px 3px rgba(0,0,0,0.05)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 12px 28px rgba(0,0,0,0.08)',
    xl: '0 20px 40px rgba(0,0,0,0.10)',
  },
  motion: {
    duration: {
      instant: '0ms',
      fast: '120ms',
      base: '200ms',
      slow: '320ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  zIndex: {
    base: 0,
    dropdown: 30,
    sticky: 40,
    sidebar: 50,
    modal: 60,
    popover: 70,
    toast: 80,
    tooltip: 90,
  },
})}

/* Reset & Base */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--ds-font-family-sans);
  font-size: var(--ds-font-size-body);
  line-height: var(--ds-font-lineHeight-relaxed);
  color: var(--ds-color-text-primary);
  background: var(--ds-color-bg-canvas);
  min-height: 100vh;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--ds-font-family-display);
  font-weight: var(--ds-font-weight-bold);
  line-height: var(--ds-font-lineHeight-tight);
  color: var(--ds-color-text-primary);
}

h1 { font-size: var(--ds-font-size-h1); letter-spacing: var(--ds-font-letterSpacing-tight); }
h2 { font-size: var(--ds-font-size-h2); letter-spacing: var(--ds-font-letterSpacing-snug); }
h3 { font-size: var(--ds-font-size-h3); letter-spacing: var(--ds-font-letterSpacing-normal); }
h4 { font-size: var(--ds-font-size-h4); letter-spacing: var(--ds-font-letterSpacing-normal); }

p { margin-bottom: var(--ds-space-4); }

a {
  color: var(--ds-color-text-link);
  text-decoration: none;
  transition: color var(--ds-motion-duration-fast) var(--ds-motion-easing-standard);
}
a:hover { color: var(--ds-color-text-linkHover); }
a:focus-visible { outline: 2px solid var(--ds-color-border-focus); outline-offset: 2px; border-radius: var(--ds-radius-sm); }

code, pre {
  font-family: var(--ds-font-family-mono);
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

img, video, iframe, canvas, svg {
  max-width: 100%;
  height: auto;
}

/* Selection */
::selection { background: var(--ds-color-module-foundations-light); color: var(--ds-color-module-foundations-dark); }

/* Focus visible for all interactive */
:focus-visible {
  outline: 2px solid var(--ds-color-border-focus);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Responsive Mobile & Tablet Styles */
@media (max-width: 768px) {
  html { font-size: 14px; }
  h1 { font-size: 22px !important; }
  h2 { font-size: 18px !important; }
  h3 { font-size: 16px !important; }
  h4 { font-size: 14px !important; }
  
  button, select, input {
    touch-action: manipulation;
  }
}

/* Scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--ds-color-border-default); border-radius: var(--ds-radius-full); }
::-webkit-scrollbar-thumb:hover { background: var(--ds-color-border-strong); }
::-webkit-scrollbar-corner { background: transparent; }

/* Utility classes */
.ds-container-narrow { max-width: 640px; margin: 0 auto; }
.ds-container-normal { max-width: 960px; margin: 0 auto; }
.ds-container-wide { max-width: 1280px; margin: 0 auto; }
.ds-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

/* Safe Area Insets for Mobile Notches and Home Indicator Bar */
.bottom-nav {
  padding-bottom: env(safe-area-inset-bottom);
}
.command-palette {
  padding-bottom: env(safe-area-inset-bottom);
}
`;

// Inject styles on import
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = globalStyles;
  document.head.appendChild(styleEl);
}

export default globalStyles;