/**
 * DiagnosticQuiz — Phase 2 placement wizard
 * Step 0: goal. Steps 1–12: one L1 + one L2 question per umbrella,
 * with immediate correctness + explanation (a learning moment, not an exam).
 * Result: per-umbrella placed levels, skips, recommended track + start.
 */
import React, { useMemo, useState } from 'react';
import { QUIZ_QUESTIONS, scoreQuiz } from '../../registry/diagnostics.js';
import { UMBRELLA_TOPICS, getTabById } from '../../registry/tabsRegistry.js';
import { LEVELS } from '../../registry/curriculum.js';
import {
  diagnoseTrack,
  getTrackById,
  savePlacement,
  applyPlacementToTrack,
  setCurrentTrackId
} from '../../services/adaptiveLearning.js';

const GOALS = [
  { id: 'foundations', icon: '🌱', label: 'AI Foundations' },
  { id: 'rag', icon: '⚡', label: 'Production RAG' },
  { id: 'agents', icon: '🤖', label: 'Autonomous Agents' },
  { id: 'enterprise', icon: '🏢', label: 'Enterprise FinOps' },
  { id: 'data', icon: '🗄️', label: 'Data Engineering' }
];

function pickSession() {
  // Deterministic: first L1 + first L2 per umbrella, umbrella order fixed
  const order = ['foundations', 'rag_architecture', 'context_memory', 'agents_frameworks', 'data_platform', 'frontiers_production'];
  const out = [];
  for (const u of order) {
    const l1 = QUIZ_QUESTIONS.find(q => q.umbrella === u && q.level === 1);
    const l2 = QUIZ_QUESTIONS.find(q => q.umbrella === u && q.level === 2);
    if (l1) out.push(l1);
    if (l2) out.push(l2);
  }
  return out;
}

function shuffledOptions(q) {
  // Deterministic shuffle from question id (stable across renders)
  let seed = [...q.id].reduce((a, c) => a + c.charCodeAt(0), 7);
  const idx = q.options.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function DiagnosticQuiz({ open, onClose, initialGoal = 'foundations', onComplete }) {
  const session = useMemo(pickSession, []);
  const [step, setStep] = useState(0); // 0 = goal, 1..N = questions, N+1 = result
  const [goal, setGoal] = useState(initialGoal);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState(null);

  if (!open) return null;
  const total = session.length;

  const reset = () => {
    setStep(0); setAnswers({}); setRevealed(false); setResult(null);
    setGoal(initialGoal);
  };

  const finish = (finalAnswers) => {
    const { levels } = scoreQuiz(finalAnswers);
    const placement = { levels, goal };
    savePlacement(placement);
    const rec = diagnoseTrack({ goal, placement });
    const track = getTrackById(rec.trackId);
    const applied = applyPlacementToTrack(track.tabs, placement);
    setResult({ placement, rec, track, applied });
    setStep(total + 1);
  };

  const choose = (q, optIdx) => {
    if (revealed) return;
    const next = { ...answers, [q.id]: optIdx };
    setAnswers(next);
    setRevealed(true);
  };

  const next = () => {
    setRevealed(false);
    if (step >= total) finish(answers);
    else setStep(step + 1);
  };

  const umbrellaName = (id) => (UMBRELLA_TOPICS.find(u => u.id === id) || { title: id }).title;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(10,12,18,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '640px', maxHeight: '88vh', overflowY: 'auto',
          background: 'var(--ds-color-bg-surface)',
          border: '1px solid var(--ds-color-border-default)',
          borderRadius: '16px', padding: '24px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)'
        }}
      >
        {/* header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ds-color-text-primary)' }}>
            🎯 Knowledge Placement Quiz
          </div>
          <button onClick={() => { reset(); onClose(); }} style={{ background: 'transparent', border: 'none', color: 'var(--ds-color-text-tertiary)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* STEP 0: goal */}
        {step === 0 && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--ds-color-text-secondary)', marginBottom: '12px' }}>
              First, your objective — then 12 quick questions (2 per area). Wrong answers teach; nothing is graded against you.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {GOALS.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  style={{
                    padding: '10px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    border: `1px solid ${goal === g.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-default)'}`,
                    background: goal === g.id ? 'rgba(13,148,136,0.12)' : 'transparent',
                    color: 'var(--ds-color-text-primary)'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{g.icon}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{g.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, background: 'var(--ds-color-module-foundations-primary)', color: 'white' }}
            >
              Start 12 Questions →
            </button>
          </div>
        )}

        {/* STEPS 1..N: questions */}
        {step >= 1 && step <= total && (() => {
          const q = session[step - 1];
          const order = shuffledOptions(q);
          const picked = answers[q.id];
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)' }}>
                  Question {step} of {total} · {umbrellaName(q.umbrella)} · L{q.level}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)' }}>{Math.round((step / total) * 100)}%</span>
              </div>
              <div style={{ height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                <div style={{ height: '100%', width: `${(step / total) * 100}%`, borderRadius: '4px', background: 'var(--ds-color-module-foundations-primary)', transition: 'width 0.2s' }} />
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', marginBottom: '12px' }}>{q.q}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {order.map(origIdx => {
                  const isAnswer = origIdx === q.answer;
                  const isPicked = picked === origIdx;
                  let border = 'var(--ds-color-border-default)', bg = 'transparent';
                  if (revealed && isAnswer) { border = '#10b981'; bg = 'rgba(16,185,129,0.12)'; }
                  else if (revealed && isPicked) { border = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; }
                  return (
                    <button
                      key={origIdx}
                      onClick={() => choose(q, origIdx)}
                      disabled={revealed}
                      style={{
                        padding: '10px 12px', borderRadius: '8px', textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
                        border: `1px solid ${border}`, background: bg,
                        color: 'var(--ds-color-text-primary)', fontSize: '0.85rem'
                      }}
                    >
                      {revealed && isAnswer ? '✓ ' : revealed && isPicked ? '✕ ' : ''}{q.options[origIdx]}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '8px', background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)', fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)' }}>
                  💡 {q.explain}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <button
                  onClick={() => { setRevealed(false); setStep(Math.max(1, step - 1)); }}
                  disabled={step === 1}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--ds-color-border-default)', background: 'transparent', color: 'var(--ds-color-text-secondary)', cursor: 'pointer', opacity: step === 1 ? 0.4 : 1 }}
                >
                  ← Back
                </button>
                <button
                  onClick={next}
                  disabled={!revealed}
                  style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: revealed ? 'pointer' : 'default', background: revealed ? 'var(--ds-color-module-foundations-primary)' : 'rgba(255,255,255,0.08)', color: 'white', opacity: revealed ? 1 : 0.5 }}
                >
                  {step === total ? 'See Placement →' : 'Next →'}
                </button>
              </div>
            </div>
          );
        })()}

        {/* RESULT */}
        {step === total + 1 && result && (
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ds-color-text-primary)', marginBottom: '4px' }}>
              📍 Your placement
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', marginBottom: '12px' }}>{result.rec.rationale}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {Object.entries(result.placement.levels).map(([u, lvl]) => {
                const info = LEVELS[lvl];
                return (
                  <div key={u} style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-canvas)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-secondary)' }}>{umbrellaName(u)}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: info.color }}>{info.short}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '12px', borderRadius: '8px', border: `2px solid ${result.track.color}`, background: 'var(--ds-color-bg-canvas)', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ds-color-text-tertiary)' }}>Recommended path · starts at</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ds-color-text-primary)', marginTop: '2px' }}>
                {result.track.icon} {result.track.title} → {(getTabById(result.rec.startingTab) || {}).label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                {result.track.tabs.length} topics · {result.track.duration}
                {result.applied.skippedCount > 0 && ` · ${result.applied.skippedCount} tested out`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { reset(); onClose(); }}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--ds-color-border-default)', background: 'transparent', color: 'var(--ds-color-text-secondary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Retake
              </button>
              <button
                onClick={() => {
                  setCurrentTrackId(result.rec.trackId);
                  const done = { ...result };
                  reset(); onClose();
                  if (onComplete) onComplete(done);
                }}
                style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer', background: 'var(--ds-color-module-foundations-primary)', color: 'white' }}
              >
                Launch Pathway →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
