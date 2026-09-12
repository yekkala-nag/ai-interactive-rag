/**
 * Diagram style guide — P2 UI pass
 * One accent family per umbrella. All NEW diagrams and figure chrome
 * use these values; legacy SVGs with bespoke gradients are grandfathered
 * (migrated opportunistically, never in bulk).
 *
 * Rules for new diagrams:
 * 1. Background: deep navy `#090d16 → #101a30` (dark) — never light gray.
 * 2. Exactly ONE umbrella accent + white/gray text. No rainbow gradients.
 * 3. Status colors are global, not per-diagram: ok #2AB5B0, warn #F5A623,
 *    bad #ef4444, info #2AB5B0.
 * 4. Room to breathe: ≥40px margins, ≥11px type, one idea per panel.
 */

export const DIAGRAM_ACCENTS = {
  foundations: { primary: '#2AB5B0', soft: 'rgba(42,181,176,0.14)' },
  rag_architecture: { primary: '#FF8A6B', soft: 'rgba(255,138,107,0.14)' },
  context_memory: { primary: '#8B7BD8', soft: 'rgba(139,123,216,0.14)' },
  agents_frameworks: { primary: '#FF8A6B', soft: 'rgba(255,138,107,0.14)' },
  data_platform: { primary: '#2AB5B0', soft: 'rgba(42,181,176,0.14)' },
  frontiers_production: { primary: '#8B7BD8', soft: 'rgba(139,123,216,0.14)' }
};

export const DIAGRAM_STATUS = {
  ok: '#2AB5B0',
  warn: '#F5A623',
  bad: '#ef4444',
  info: '#2AB5B0',
  muted: '#64748b'
};

export const DIAGRAM_BG = { from: '#090d16', to: '#101a30' };

export function diagramAccentForModule(moduleId) {
  return (DIAGRAM_ACCENTS[moduleId] || { primary: '#2AB5B0', soft: 'rgba(42,181,176,0.14)' }).primary;
}
