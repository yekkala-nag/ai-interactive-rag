/**
 * DESIGN SAMPLE — isolated preview of the proposed uniform dashboard language.
 * Palette: teal #2AB5B0 · coral #FF8A6B · lavender #C5ADEA · white bg.
 * NOTHING outside this file is affected. Approve to roll out app-wide.
 */
import React, { useState } from 'react';
import { Container } from '../components/layout/Primitives.jsx';

const TEAL = '#2AB5B0';
const TEAL_DARK = '#17837F';
const CORAL = '#FF8A6B';
const LAV = '#C5ADEA';
const INK = '#22303C';
const MUTED = '#7A8AA0';
const EDITOR_BG = '#10141D';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home' },
  { icon: '🥾', label: 'My Path' },
  { icon: '🕸️', label: 'Skill Tree' },
  { icon: '🧪', label: 'Playground' },
  { icon: '🔁', label: 'Reviews' }
];

const SKILLS = [
  { label: 'Chunking', state: 'done' },
  { label: 'Filtering', state: 'done' },
  { label: 'Rerankers', state: 'current' },
  { label: 'Eval Triad', state: 'next' },
  { label: 'Prod RAG', state: 'locked' },
  { label: 'Agentic', state: 'locked' }
];

const CODE_LINES = [
  <span key="l1"><span style={{ color: CORAL }}>from</span> <span style={{ color: '#E6EAF2' }}>sentence_transformers</span> <span style={{ color: CORAL }}>import</span> <span style={{ color: '#E6EAF2' }}>CrossEncoder</span></span>,
  <span key="l2">{' '}</span>,
  <span key="l3"><span style={{ color: '#E6EAF2' }}>reranker</span> <span style={{ color: MUTED }}>=</span> <span style={{ color: LAV }}>CrossEncoder</span><span style={{ color: '#E6EAF2' }}>(</span><span style={{ color: '#5EEAD4' }}>'cross-encoder/ms-marco-MiniLM-L-6-v2'</span><span style={{ color: '#E6EAF2' }}>)</span></span>,
  <span key="l4"><span style={{ color: '#E6EAF2' }}>scores</span> <span style={{ color: MUTED }}>=</span> <span style={{ color: '#E6EAF2' }}>reranker</span><span style={{ color: MUTED }}>.</span><span style={{ color: LAV }}>predict</span><span style={{ color: '#E6EAF2' }}>(pairs)</span> <span style={{ color: MUTED }}># top-50 → top-5</span></span>,
  <span key="l5"><span style={{ color: CORAL }}>return</span> <span style={{ color: '#E6EAF2' }}>ranked[:</span><span style={{ color: LAV }}>5</span><span style={{ color: '#E6EAF2' }}>]</span></span>
];

const FAKE_OUTPUT = [
  '> top-50 → top-5 in 41ms',
  '> P@5 0.33 → 1.00 · distractors buried',
  '✓ ready to paste into your retriever'
];

function SkillNode({ label, state }) {
  const isDone = state === 'done';
  const isCurrent = state === 'current';
  const isNext = state === 'next';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '72px' }}>
      <div style={{
        width: '46px', height: '46px', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', fontWeight: 800,
        background: isDone ? TEAL : isCurrent ? CORAL : '#fff',
        color: isDone || isCurrent ? '#fff' : LAV,
        border: `2px solid ${isDone ? TEAL : isCurrent ? CORAL : LAV}`,
        boxShadow: isCurrent ? `0 0 0 6px rgba(255,138,107,0.18)` : isDone ? 'none' : 'inset 0 0 0 3px rgba(197,173,234,0.18)',
        opacity: state === 'locked' ? 0.55 : 1
      }}>
        {isDone ? '✓' : isCurrent ? '▶' : isNext ? '○' : '🔒'}
      </div>
      <div style={{ fontSize: '0.68rem', fontWeight: 600, color: isCurrent ? INK : MUTED, textAlign: 'center' }}>{label}</div>
    </div>
  );
}

export default function DesignSampleTab() {
  const [nav, setNav] = useState('Home');
  const [ran, setRan] = useState(false);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Container size="wide">
        <div style={{ fontSize: '0.8rem', color: MUTED, margin: '12px 2px 10px 2px' }}>
          🎨 <strong>Design sample only</strong> — proposed uniform language. Nothing else in the app changed. Approve below to roll out.
        </div>

        <div style={{
          display: 'flex', background: '#fff', borderRadius: '20px', overflow: 'hidden',
          border: '1px solid #E6EBF2', boxShadow: '0 18px 50px rgba(34,48,60,0.10)',
          minHeight: '640px'
        }}>
          {/* LEFT — teal gradient sidebar */}
          <aside style={{
            width: '208px', flexShrink: 0, padding: '22px 14px',
            background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
            color: '#fff', display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '2px 8px 18px 8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05rem' }}>🧭</div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', letterSpacing: '-0.01em' }}>LearnLoop</div>
            </div>
            {NAV_ITEMS.map(item => {
              const active = nav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setNav(item.label)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(255,255,255,0.22)' : 'transparent',
                    color: '#fff', fontSize: '0.83rem', fontWeight: active ? 700 : 500,
                    textAlign: 'left', transition: 'background 0.15s ease'
                  }}
                >
                  <span>{item.icon}</span>{item.label}
                </button>
              );
            })}
            <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.16)', borderRadius: '14px', padding: '12px' }}>
              <div style={{ fontSize: '1.2rem' }}>🔥</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>6-day streak</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>Prove one topic to reach 7</div>
            </div>
          </aside>

          {/* MAIN */}
          <main style={{ flex: 1, padding: '26px 28px', minWidth: 0, background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: INK, letterSpacing: '-0.02em' }}>Good evening, Learner 👋</div>
                <div style={{ fontSize: '0.82rem', color: MUTED }}>Loop 1 · Trail — pick up where the evidence left off.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: TEAL_DARK, background: 'rgba(42,181,176,0.12)', padding: '5px 12px', borderRadius: '9999px' }}>● 64 avg mastery</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `linear-gradient(135deg, ${LAV}, ${TEAL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>L</div>
              </div>
            </div>

            {/* Coral progress */}
            <div style={{ border: '1px solid #E6EBF2', borderRadius: '16px', padding: '16px 18px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <div style={{ fontWeight: 800, color: INK, fontSize: '0.9rem' }}>Loop 1 · Trail</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: CORAL }}>72%</div>
              </div>
              <div style={{ height: '10px', borderRadius: '6px', background: '#F1F4F9', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: '72%', borderRadius: '6px',
                  background: `linear-gradient(90deg, ${CORAL}, #FFB199)`,
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)',
                    animation: 'sampleShimmer 2.2s infinite'
                  }} />
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: MUTED, marginTop: '6px' }}>26 of 36 topics proven · next: Rerankers →</div>
              <style>{`@keyframes sampleShimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } } @media (prefers-reduced-motion: reduce) { @keyframes sampleShimmer { from { transform: none; } to { transform: none; } } }`}</style>
            </div>

            {/* Stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              {[
                { v: '18', l: 'Topics proven', c: TEAL },
                { v: '3', l: 'Ready to unlock', c: CORAL },
                { v: '2', l: 'Due for review', c: LAV }
              ].map(s => (
                <div key={s.l} style={{ border: '1px solid #E6EBF2', borderRadius: '14px', padding: '12px 14px', borderTop: `3px solid ${s.c}` }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: INK }}>{s.v}</div>
                  <div style={{ fontSize: '0.72rem', color: MUTED }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Lavender skill strip */}
            <div style={{ border: '1px solid #E6EBF2', borderRadius: '16px', padding: '16px 18px', marginBottom: '14px' }}>
              <div style={{ fontWeight: 800, color: INK, fontSize: '0.9rem', marginBottom: '12px' }}>Up next in <span style={{ color: TEAL_DARK }}>RAG Core</span></div>
              <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: '4px' }}>
                {SKILLS.map((s, i) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <SkillNode label={s.label} state={s.state} />
                    {i < SKILLS.length - 1 && (
                      <div style={{ width: '26px', height: '2px', background: i < 2 ? TEAL : '#E3D9F7', marginTop: '22px', borderRadius: '2px', flexShrink: 0 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dark code editor */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', background: EDITOR_BG, border: '1px solid #1E2635' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderBottom: '1px solid #1E2635' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FEBC2E' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
                <span style={{ marginLeft: '6px', fontSize: '0.72rem', color: '#8A94A8', fontFamily: 'monospace' }}>rerank_pipeline.py</span>
                <button
                  onClick={() => setRan(r => !r)}
                  style={{
                    marginLeft: 'auto', background: CORAL, border: 'none', color: '#fff',
                    fontWeight: 800, fontSize: '0.75rem', padding: '6px 16px', borderRadius: '9px', cursor: 'pointer'
                  }}
                >
                  {ran ? '↻ Re-run' : '▶ Run'}
                </button>
              </div>
              <div style={{ display: 'flex', padding: '14px 0 14px 0', fontFamily: 'monospace', fontSize: '0.78rem', lineHeight: 1.7 }}>
                <div style={{ padding: '0 12px', color: '#3D475C', userSelect: 'none', textAlign: 'right' }}>
                  {CODE_LINES.map((_, i) => (<div key={i}>{i + 1}</div>))}
                </div>
                <div style={{ flex: 1, paddingRight: '14px' }}>
                  {CODE_LINES.map((ln, i) => (<div key={i} style={{ whiteSpace: 'pre' }}>{ln}</div>))}
                </div>
              </div>
              {ran && (
                <div style={{ borderTop: '1px solid #1E2635', padding: '12px 14px 14px 44px', fontFamily: 'monospace', fontSize: '0.76rem', animation: 'fadeIn 0.3s ease' }}>
                  {FAKE_OUTPUT.map((ln, i) => (
                    <div key={i} style={{ color: ln.startsWith('✓') ? '#5EEAD4' : '#9AA6BE' }}>{ln}</div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
