/**
 * Design Tokens — Single source of truth for the visual language
 * All values as CSS custom properties for runtime theming
 *
 * MASTER PALETTE (v4.0 — September 2026)
 * ─────────────────────────────────────────
 * Primary Teal:      #5EC4C8  (94, 196, 200)  — Headers, buttons, active nav, links
 * Secondary Coral:   #F0A89A  (240, 168, 154) — Accent cards, warnings, highlights
 * Tertiary Lavender: #C9B8E8  (201, 184, 232) — Footer bg, info tags, tertiary accents
 * Base White:        #F5F5F7  (245, 245, 247) — Page bg, card fills, inputs
 * Dark Text/Icon:    #2D2D3A  (45, 45, 58)    — All body text, headings, icons
 * Muted Gray:        #B8B8C4  (184, 184, 196) — Dividers, placeholders, inactive borders
 */

export const tokens = {
  // Color — Semantic, module-coded, accessible
  color: {
    // Base surfaces (light mode) — APPROVED PALETTE
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

    // Module accents — trio-mapped, all pairs contrast-verified.
    // primary = fills/graphics · dark = any text on white · light = tinted bg.
    module: {
      foundations: { primary: '#5EC4C8', light: 'rgba(94,196,200,0.14)', dark: '#1F6B6E' },
      rag: { primary: '#F0A89A', light: 'rgba(240,168,154,0.14)', dark: '#C47A6A' },
      context: { primary: '#C9B8E8', light: 'rgba(201,184,232,0.14)', dark: '#6B5E94' },
      agents: { primary: '#F0A89A', light: 'rgba(240,168,154,0.14)', dark: '#C47A6A' },
      platform: { primary: '#5EC4C8', light: 'rgba(94,196,200,0.14)', dark: '#1F6B6E' },
      frontiers: { primary: '#C9B8E8', light: 'rgba(201,184,232,0.14)', dark: '#6B5E94' },
    },

    // Brand palette — uniform dashboard language
    // Brights = fills/graphics/dots only. Text on white MUST use ink/deep.
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

    // Semantic states
    state: {
      success: { light: '#2D9D6F', dark: '#34C47D' },
      warning: { light: '#D4930A', dark: '#F5B731' },
      error: { light: '#D44D4D', dark: '#EF6B6B' },
      info: { light: '#4A7DC9', dark: '#6B9EE8' },
    },

    // Overlay
    overlay: {
      backdrop: 'rgba(45, 45, 58, 0.4)',
      modal: 'rgba(45, 45, 58, 0.6)',
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
