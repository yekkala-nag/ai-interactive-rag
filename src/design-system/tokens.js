/**
 * Design Tokens — Single source of truth for the visual language
 * All values as CSS custom properties for runtime theming
 */

export const tokens = {
  // Color — Semantic, module-coded, accessible
  color: {
    // Base surfaces (light mode)
    bg: {
      canvas: '#FAFAF9',
      surface: '#FFFFFF',
      surfaceHover: '#F5F5F4',
      elevated: '#FFFFFF',
    },
    border: {
      subtle: '#E7E5E4',
      default: '#D6D3D1',
      strong: '#A8A29E',
      focus: '#0D9488',
    },
    text: {
      primary: '#0F172A',
      secondary: '#334155',
      tertiary: '#475569',
      inverse: '#FAFAF9',
      link: '#0D9488',
      linkHover: '#0F766E',
    },

    // Module accents — trio-mapped, all pairs contrast-verified (see P1 notes).
    // primary = fills/graphics · dark = any text on white · light = tinted bg.
    module: {
      foundations: { primary: '#2AB5B0', light: 'rgba(42,181,176,0.14)', dark: '#0C4F4C' },
      rag: { primary: '#FF8A6B', light: 'rgba(255,138,107,0.14)', dark: '#A34A28' },
      context: { primary: '#8B7BD8', light: 'rgba(139,123,216,0.14)', dark: '#4A3F7A' },
      agents: { primary: '#FF8A6B', light: 'rgba(255,138,107,0.14)', dark: '#A34A28' },
      platform: { primary: '#2AB5B0', light: 'rgba(42,181,176,0.14)', dark: '#0C4F4C' },
      frontiers: { primary: '#8B7BD8', light: 'rgba(139,123,216,0.14)', dark: '#4A3F7A' },
    },

    // Brand palette — uniform dashboard language (see DesignSampleTab)
    // Brights = fills/graphics/dots only. Text on white MUST use ink/deep.
    brand: {
      teal: '#2AB5B0',
      tealDark: '#17837F',
      tealInk: '#0C4F4C',
      tealSoft: 'rgba(42,181,176,0.12)',
      coral: '#FF8A6B',
      coralDeep: '#A34A28',
      coralSoft: 'rgba(255,138,107,0.14)',
      lav: '#C5ADEA',
      lavDeep: '#8B7BD8',
      lavInk: '#4A3F7A',
      lavSoft: 'rgba(139,123,216,0.14)',
      ink: '#22303C',
      muted: '#7A8AA0',
      line: '#E6EBF2',
      editor: '#10141D',
    },

    // Semantic states
    state: {
      success: { light: '#16A34A', dark: '#22C55E' },
      warning: { light: '#CA8A04', dark: '#EAB308' },
      error: { light: '#DC2626', dark: '#EF4444' },
      info: { light: '#2563EB', dark: '#3B82F6' },
    },

    // Overlay
    overlay: {
      backdrop: 'rgba(28, 25, 23, 0.4)',
      modal: 'rgba(28, 25, 23, 0.6)',
    },
  },

  // Typography — System font stack
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

  // Spacing — 4px base unit
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

  // Border radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows — Layered
  shadow: {
    xs: '0 1px 2px rgba(0,0,0,0.03)',
    sm: '0 1px 3px rgba(0,0,0,0.05)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 12px 28px rgba(0,0,0,0.08)',
    xl: '0 20px 40px rgba(0,0,0,0.10)',
  },

  // Motion — Respectful
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

  // Breakpoints
  breakpoint: {
    mobile: '640px',
    tablet: '1024px',
    desktop: '1440px',
  },

  // Container widths
  container: {
    narrow: '640px',
    normal: '960px',
    wide: '1280px',
  },

  // Z-index scale
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
};

// CSS custom property generator
export function generateCSSVariables(tokens, prefix = 'ds') {
  const lines = [];

  function flatten(obj, path = []) {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = [...path, key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, newPath);
      } else {
        lines.push(`  --${prefix}-${newPath.join('-')}: ${value};`);
      }
    }
  }

  flatten(tokens);
  return `:root {\n${lines.join('\n')}\n}`;
}

// Module color getter
export function getModuleColors(moduleId) {
  const map = {
    foundations: tokens.color.module.foundations,
    rag: tokens.color.module.rag,
    rag_architecture: tokens.color.module.rag,
    context: tokens.color.module.context,
    context_memory: tokens.color.module.context,
    agents: tokens.color.module.agents,
    agents_frameworks: tokens.color.module.agents,
    platform: tokens.color.module.platform,
    data_platform: tokens.color.module.platform,
    frontiers: tokens.color.module.frontiers,
    frontiers_production: tokens.color.module.frontiers,
  };
  return map[moduleId] || tokens.color.module.foundations;
}

// Semantic color getter
export function getStateColor(state) {
  return tokens.color.state[state] || tokens.color.state.info;
}