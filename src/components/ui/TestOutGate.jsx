/**
 * TestOutGate — pillar pre-flight checks that prove, not just place.
 * Samples one exit-bank question per topic (L1-first, unproven only);
 * each correct answer records a proven quiz score for that topic.
 * Correct = tested out. Wrong = routed into the standard path.
 */
import React, { useMemo, useState } from 'react';
import { UMBRELLA_TOPICS, getTabsForUmbrella, getTabById } from '../../registry/tabsRegistry.js';
import { getTopicMeta } from '../../registry/curriculum.js';
import { getExitCheck } from '../../registry/exitChecks.js';
import { isMastered, recordQuiz } from '../../services/mastery.js';
import { useModalA11y } from '../../hooks/useModalA11y.js';

function pickQuestions(umbrellaId, maxN = 5) {
  const cands = getTabsForUmbrella(umbrellaId)
    .filter(t => !isMastered(t.id) && getExitCheck(t.id))
    .sort((a, b) => getTopicMeta(a.id).l - getTopicMeta(b.id).l)
    .slice(0, maxN);
  return cands.map(t => ({ tabId: t.id, q: getExitCheck(t.id)[0] }));
}

function shuffleFor(id, n) {
  let seed = [...id].reduce((a, c) => a + c.charCodeAt(0), 29);
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
}

export function TestOutGate({ open, umbrellaId, onClose, onSelectTab }) {
  const mod = UMBRELLA_TOPICS.find(u => u.id === umbrellaId) || UMBRELLA_TOPICS[0];
  const session = useMemo(() => (open ? pickQuestions(umbrellaId) : []), [open, umbrellaId]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const { ref: dialogRef, onBackdrop } = useModalA11y(open, onClose, {
    dismissable: done || (results.length === 0 && picked === null)
  });

  if (!open) return null;

  const reset = () => { setIdx(0); setPicked(null); setResults([]); setDone(false); };
  const q = session[idx];
  const order = q ? shuffleFor(`${q.tabId}:0`, q.q.o.length) : [];
  const proven = results.filter(r => r.ok);

  const answer = (oi) => {
    if (picked !== null || !q) return;
    const ok = oi === q.q.a;
    if (ok) recordQuiz(q.tabId, 1, 1); // a correct pre-flight answer IS proof
    const next = [...results, { tabId: q.tabId, ok }];
    setPicked(oi);
    setTimeout(() => {
      if (idx + 1 >= session.length) {
        setResults(next);
        setDone(true);
      } else {
        setResults(next);
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 650);
  };

  return (
    <div onClick={onBackdrop} style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(10,12,18,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`Pre-flight check: ${mod.title}`} onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '600px', maxHeight: '88vh', overflowY: 'auto', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-default)', borderRadius: '16px', padding: '24px', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--ds-color-text-primary)' }}>
            🛫 Pre-Flight Check — {mod.icon} {mod.title}
          </div>
          <button onClick={() => { reset(); onClose(); }} style={{ background: 'transparent', border: 'none', color: 'var(--ds-color-text-tertiary)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-secondary)', marginBottom: '14px' }}>
          {session.length === 0
            ? 'Everything checkable here is already proven — nothing to test out of. 🎉'
            : 'One question per unproven topic (easiest first). Each correct answer proves that topic on the spot.'}
        </div>

        {!done && q && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
              <span>Question {idx + 1} of {session.length} · {(getTabById(q.tabId) || {}).label}</span>
              <span>{proven.length} proven so far</span>
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ds-color-text-primary)', marginBottom: '12px' }}>{q.q.q}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {order.map(oi => {
                const isAnswer = oi === q.q.a;
                const isPicked = picked === oi;
                let border = 'var(--ds-color-border-default)', bg = 'transparent';
                if (picked !== null && isAnswer) { border = '#2AB5B0'; bg = 'rgba(16,185,129,0.12)'; }
                else if (picked !== null && isPicked) { border = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; }
                return (
                  <button key={oi} onClick={() => answer(oi)} disabled={picked !== null}
                    style={{ padding: '10px 12px', borderRadius: '8px', textAlign: 'left', cursor: picked !== null ? 'default' : 'pointer', border: `1px solid ${border}`, background: bg, color: 'var(--ds-color-text-primary)', fontSize: '0.85rem' }}>
                    {picked !== null && isAnswer ? '✓ ' : picked !== null && isPicked ? '✕ ' : ''}{q.q.o[oi]}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '8px', background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)', fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)' }}>
                💡 {q.q.e}
              </div>
            )}
          </div>
        )}

        {(done || session.length === 0) && session.length > 0 && (
          <div>
            <div style={{ padding: '14px', borderRadius: '10px', border: `2px solid ${proven.length ? '#2AB5B0' : '#F5A623'}`, background: 'var(--ds-color-bg-canvas)', textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: proven.length ? '#2AB5B0' : '#F5A623' }}>
                Tested out of {proven.length}/{results.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                {proven.length ? 'Proven topics skip ahead everywhere — tracks, next-best, and review.' : 'Standard path it is — the journey meets you where you are.'}
              </div>
            </div>
            {results.filter(r => !r.ok).map(r => {
              const t = getTabById(r.tabId) || { label: r.tabId, icon: '📝' };
              return (
                <div key={r.tabId} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                  <span>📍 {t.icon} {t.label} — routed into the standard path</span>
                  {onSelectTab && (
                    <button onClick={() => { reset(); onClose(); onSelectTab(r.tabId); }}
                      style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--ds-color-border-default)', background: 'transparent', color: 'var(--ds-color-text-primary)', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Study →
                    </button>
                  )}
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => { reset(); onClose(); }}
                style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid var(--ds-color-border-default)', background: 'transparent', color: 'var(--ds-color-text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
