import React, { useState, useEffect, useRef } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { STAGES, STEPS, QUERIES, RUN_PIPELINE, PYTHON_PIPELINE_CODE } from './pipelineEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });
const TONE = { ok: '#5EC4C8', bad: '#ef4444', warn: '#F5A623', info: 'var(--ds-color-text-secondary)' };

export default function CompletePipelineTab() {
  const [sub, setSub] = useState('run');
  const [queryId, setQueryId] = useState('refund');
  const [k, setK] = useState(4);
  const [off, setOff] = useState([]);
  const [runToken, setRunToken] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const timers = useRef([]);

  const toggleStep = (id) => {
    setOff(o => (o.includes(id) ? o.filter(x => x !== id) : [...o, id]));
    setRunToken(0);
    setRevealed(0);
  };

  const result = React.useMemo(
    () => (runToken > 0 ? RUN_PIPELINE(queryId, STEPS.map(s => s.id).filter(id => !off.includes(id)), k) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [runToken]
  );

  // Staged reveal animation (instant when reduced motion is preferred)
  useEffect(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (!result) { setRevealed(0); return; }
    const reduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || result.log.length === 0) { setRevealed(result.log.length); return; }
    setRevealed(0);
    result.log.forEach((_, i) => {
      timers.current.push(setTimeout(() => setRevealed(i + 1), 450 * (i + 1)));
    });
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [result]);

  const run = () => setRunToken(t => t + 1);
  const shownLog = result ? result.log.slice(0, revealed) : [];
  const done = result && revealed >= result.log.length;
  const activeStage = shownLog.length ? Math.max(...shownLog.map(l => l.stage)) : 0;
  const m = result && result.metrics ? result.metrics : null;

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [Complete 12-Step Pipeline]"
        title="The Complete RAG Pipeline — Run It Live, Break It on Purpose"
        description="All 12 steps across ingestion, indexing, retrieval, generation and check — toggle any step off and watch precision, recall, faithfulness, latency and cost move. Deterministic, animated, honest about what each skip costs."
        metrics={[
          { label: 'Stages', value: '4' },
          { label: 'Steps', value: '12, toggleable' },
          { label: 'Queries', value: '3 demo' },
          { label: 'Model', value: 'Deterministic' }
        ]}
      />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage
            moduleId="rag_architecture"
            src="/assets/complete_rag_pipeline.svg"
            alt="Complete RAG pipeline infographic"
            title="The Complete RAG Pipeline"
            caption="Infographic map: 4 stages × 12 steps with failure signals. Below, the same pipeline runs live."
            background="#f8fafc"
            maxWidth={1100}
          />
        </div>

        <div style={NAV}>{[
          { id: 'run', icon: '▶️', label: '1. Live Pipeline Run', desc: 'Toggle steps, watch it flow' },
          { id: 'ref', icon: '📋', label: '2. 12-Step Reference', desc: 'Every bullet + signal' },
          { id: 'code', icon: '🛠️', label: '3. Pipeline Code', desc: 'Toggleable Python' }
        ].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
          </button>
        ))}</div>

        {sub === 'run' && (
          <Stack gap={6}>
            {/* Stage progress strip */}
            <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap' }}>
              {STAGES.map(s => {
                const lit = runToken > 0 && activeStage >= s.n;
                const current = runToken > 0 && activeStage === s.n && !done;
                return (
                  <div key={s.n} style={{
                    flex: 1, minWidth: '150px', padding: '8px 12px', borderRadius: '8px',
                    background: lit ? `${s.color}1f` : 'var(--ds-color-bg-surface)',
                    border: `1px solid ${lit ? s.color : 'var(--ds-color-border-subtle)'}`,
                    transition: 'all 0.3s ease',
                    boxShadow: current ? `0 0 0 2px ${s.color}55` : 'none'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: lit ? s.color : 'var(--ds-color-text-tertiary)' }}>
                      STAGE {s.n} · {s.name} {current ? '●' : lit ? '✓' : '○'}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>{s.blurb}</div>
                  </div>
                );
              })}
            </Flex>

            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4}">
              {/* Controls */}
              <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                <label style={{ fontSize: '11px', color: 'white', display: 'block', marginBottom: '4px' }}>Query</label>
                <select value={queryId} onChange={e => { setQueryId(e.target.value); setRunToken(0); }} style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' }}>
                  {QUERIES.map(q => (<option key={q.id} value={q.id}>{q.label} ({q.hint})</option>))}
                </select>
                <label style={{ fontSize: '11px', color: 'white' }}>Top-k: {k}</label>
                <input type="range" min={2} max={6} value={k} onChange={e => { setK(+e.target.value); setRunToken(0); }} style={{ width: '100%', marginBottom: '10px' }} />
                <div style={{ fontSize: '11px', color: '#F5A623', fontWeight: 700, marginBottom: '6px' }}>TOGGLE STEPS (off = break it):</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '10px' }}>
                  {STEPS.map(s => {
                    const on = !off.includes(s.id);
                    return (
                      <label key={s.id} style={{ fontSize: '11px', color: on ? 'white' : 'var(--ds-color-text-tertiary)', cursor: 'pointer', textDecoration: on ? 'none' : 'line-through' }}>
                        <input type="checkbox" checked={on} onChange={() => toggleStep(s.id)} /> {s.name}
                      </label>
                    );
                  })}
                </div>
                <Button variant="primary" onClick={run} style={{ width: '100%' }}>
                  {runToken === 0 ? '▶ Run Pipeline' : '↻ Re-run'}
                </Button>
              </Card>

              {/* Live log */}
              <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', minHeight: '280px' }}>
                <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>PIPELINE TRACE {runToken > 0 && `(${revealed}/${result.log.length})`}</strong>
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '300px', overflowY: 'auto' }}>
                  {runToken === 0 && <div style={{ fontSize: '12px', color: 'var(--ds-color-text-tertiary)' }}>Configure on the left, then run. Try switching metadata or reranking off.</div>}
                  {shownLog.map((l, i) => (
                    <div key={i} style={{ fontSize: '11px', fontFamily: 'monospace', color: TONE[l.tone], animation: 'fadeIn 0.3s ease' }}>
                      <span style={{ opacity: 0.6 }}>[S{l.stage}]</span> {l.text}
                    </div>
                  ))}
                  {result && result.halted && done && (
                    <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 700, marginTop: '6px' }}>⛔ {result.reason}</div>
                  )}
                </div>
              </Card>
            </Grid>

            {/* Metrics + chunks */}
            {done && !result.halted && m && (
              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4}">
                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', animation: 'fadeIn 0.4s ease' }}>
                  <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>RUN METRICS</strong>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)" style={{ marginTop: '8px' }}>
                    {[['Precision@' + k, m.precision, m.precision >= 0.5 ? '#5EC4C8' : '#ef4444'], ['Recall', m.recall, m.recall >= 0.5 ? '#5EC4C8' : '#ef4444'], ['Faithfulness', m.faithfulness, m.evaluated ? (m.faithfulness >= 0.85 ? '#5EC4C8' : '#F5A623') : '#64748b']].map(([l, v, c]) => (
                      <div key={l} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: c }}>{v}</div>
                        <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>{l}{l === 'Faithfulness' && !m.evaluated ? ' (unevaluated)' : ''}</div>
                      </div>
                    ))}
                  </Grid>
                  <Flex justify="space-between" style={{ marginTop: '10px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                    <span>⏱ {m.latencyMs} ms simulated</span>
                    <span>💰 ${m.cost} / query</span>
                  </Flex>
                </Card>
                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', animation: 'fadeIn 0.4s ease' }}>
                  <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>RETRIEVED TOP-{k}</strong>
                  <Stack gap={2} style={{ marginTop: '8px' }}>
                    {result.chunks.map((c, i) => {
                      const rel = c.rel[queryId] === 1;
                      return (
                        <div key={c.id} style={{ fontSize: '11px', fontFamily: 'monospace', padding: '6px 8px', borderRadius: '6px', background: rel ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', borderLeft: `3px solid ${rel ? '#5EC4C8' : '#ef4444'}` }}>
                          <span style={{ color: 'var(--ds-color-text-tertiary)' }}>#{i + 1} [{c.id}]</span>{' '}
                          <span style={{ color: rel ? '#5EC4C8' : '#f87171' }}>{rel ? 'RELEVANT' : 'distractor'}</span>{' '}
                          <span style={{ color: 'var(--ds-color-text-secondary)' }}>{c.text}</span>
                        </div>
                      );
                    })}
                  </Stack>
                </Card>
              </Grid>
            )}
          </Stack>
        )}

        {sub === 'ref' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>📋 All 12 steps — bullets, signals, cost</h3></div>
                {STAGES.map(s => (
                  <div key={s.n}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: s.color, marginBottom: '6px' }}>STAGE {s.n} · {s.name} — {s.blurb}</div>
                    <Stack gap={2}>
                      {STEPS.filter(x => x.stage === s.n).map(x => (
                        <Card key={x.id} style={{ padding: '10px 12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${s.color}` }}>
                          <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '6px' }}>
                            <strong style={{ color: 'white', fontSize: '12px' }}>{x.name}</strong>
                            <Badge variant="subtle" style={{ fontSize: '9px' }}>{x.ms} ms</Badge>
                          </Flex>
                          {x.pts.map((p, i) => (<div key={i} style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>• {p}</div>))}
                          <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>⚠ Signal: {x.signal}</div>
                          <div style={{ fontSize: '11px', color: '#ef4444' }}>✕ Off: {x.off}</div>
                        </Card>
                      ))}
                    </Stack>
                  </div>
                ))}
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0 }}>🛠️ The same toggles, in Python</h3></div>
                <CodeBlock language="python" code={PYTHON_PIPELINE_CODE} />
                <Callout type="success"><strong>Stage order is reliability order:</strong> ingest → index → retrieve → check. The simulator above runs this exact logic — every toggle maps to one branch.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
