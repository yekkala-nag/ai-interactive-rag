/**
 * Diagram style guide — P2 UI pass
 * One accent family per umbrella. All NEW diagrams and figure chrome
 * use these values; legacy SVGs with bespoke gradients are grandfathered
 * (migrated opportunistically, never in bulk).
 *
 * Rules for new diagrams:
 * 1. Background: deep navy `#090d16 → #101a30` (dark) — never light gray.
 * 2. Exactly ONE umbrella accent + white/gray text. No rainbow gradients.
 * 3. Status colors are global, not per-diagram: ok #10b981, warn #F5A623,
 *    bad #ef4444, info #38bdf8.
 * 4. Room to breathe: ≥40px margins, ≥11px type, one idea per panel.
 */

export const DIAGRAM_ACCENTS = {
  foundations: { primary: '#3b82f6', soft: 'rgba(59,130,246,0.14)' },
  rag_architecture: { primary: '#f59e0b', soft: 'rgba(245,158,11,0.14)' },
  context_memory: { primary: '#ec4899', soft: 'rgba(236,72,153,0.14)' },
  agents_frameworks: { primary: '#10b981', soft: 'rgba(16,185,129,0.14)' },
  data_platform: { primary: '#8b5cf6', soft: 'rgba(139,92,246,0.14)' },
  frontiers_production: { primary: '#a855f7', soft: 'rgba(168,85,247,0.14)' }
};

export const DIAGRAM_STATUS = {
  ok: '#10b981',
  warn: '#F5A623',
  bad: '#ef4444',
  info: '#38bdf8',
  muted: '#64748b'
};

export const DIAGRAM_BG = { from: '#090d16', to: '#101a30' };

export function diagramAccentForModule(moduleId) {
  return (DIAGRAM_ACCENTS[moduleId] || { primary: '#2a8a84', soft: 'rgba(42,138,132,0.14)' }).primary;
}
