import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { ExitCheck } from '../components/ui/ExitCheck.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

const MILESTONES = [
  { m: "Ingest one real PDF", done: "parse → text + tables preserved, bboxes kept", proves: ["pipeline", "ragchunking"] },
  { m: "Chunk + embed it", done: "boundary-aware chunks, one embedding model", proves: ["ragchunking"] },
  { m: "Retrieve top-k for 5 test questions", done: "precision + recall measured, not vibed", proves: ["filtering", "qparseloop"] },
  { m: "Grounded answer UI", done: "citations shown beside every claim", proves: ["promptfundamentals"] },
  { m: "Unit math written down", done: "cost/query + latency budget on paper", proves: ["tokenbill"] }
];

const RUBRIC = [
  { bar: "Every answer cites its chunk", weight: "Must-have" },
  { bar: "Vague question clarifies instead of guessing", weight: "Must-have" },
  { bar: "Runs end-to-end from a fresh clone", weight: "Must-have" },
  { bar: "README states what it cannot answer", weight: "Nice-to-have" }
];

export default function Capstone1Tab({ onSelectTab }) {
  const [done, setDone] = useState([]);
  const [exitOpen, setExitOpen] = useState(false);
  const toggle = (i) => setDone(d => (d.includes(i) ? d.filter(x => x !== i) : [...d, i]));
  const pct = Math.round((done.length / MILESTONES.length) * 100);
  const complete = done.length === MILESTONES.length;
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="rag_architecture"
        moduleLabel="Loop 1 Capstone · Boss Fight"
        title="Capstone 1: Ship a Single-Document RAG Chatbot"
        description="Loop 1 synthesis: one PDF in, grounded cited answers out, wrapped in a simple UI — with measured retrieval and written-down unit math. Portfolio piece #1."
        metrics={[
          { label: 'Milestones', value: `${done.length}/${MILESTONES.length}` },
          { label: 'Complete', value: `${pct}%` },
          { label: 'Proves', value: 'Loop 1 RAG' },
          { label: 'Artifact', value: 'Deployed URL' }
        ]}
      />
      <Container size="wide">
        <Stack gap={6}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
            <Stack gap={4}>
              <div><h3 style={{ margin: 0 }}>🏁 Mission brief</h3>
                <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                  Pick one real PDF you care about (a policy, a manual, a paper). Build the smallest system that answers questions about it — and proves every answer. No second document, no agents, no excuses.
                </p></div>
              <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: complete ? '#2AB5B0' : '#2AB5B0', borderRadius: '4px', transition: 'width 0.3s ease' }} />
              </div>
              <Stack gap={2}>
                {MILESTONES.map((ms, i) => (
                  <label key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px 12px', background: 'var(--ds-color-bg-surface)', borderRadius: '8px', border: `1px solid ${done.includes(i) ? 'rgba(16,185,129,0.4)' : 'var(--ds-color-border-subtle)'}`, cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} style={{ marginTop: '3px' }} />
                    <span>
                      <strong style={{ color: done.includes(i) ? '#2AB5B0' : 'var(--ds-color-text-primary)' }}>{done.includes(i) ? '✓ ' : `${i + 1}. `}{ms.m}</strong>
                      <span style={{ display: 'block', color: 'var(--ds-color-text-secondary)', fontSize: '0.78rem' }}>{ms.done}</span>
                      <span style={{ display: 'block', color: 'var(--ds-color-text-tertiary)', fontSize: '0.7rem' }}>proves: {ms.proves.join(' · ')}</span>
                    </span>
                  </label>
                ))}
              </Stack>
            </Stack>
          </Card>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
            <Stack gap={3}>
              <div><h3 style={{ margin: 0 }}>⚖️ Boss rubric — all must-haves to pass</h3></div>
              {RUBRIC.map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '8px 0', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                  <span style={{ color: 'var(--ds-color-text-primary)' }}>{r.bar}</span>
                  <Badge variant="subtle" style={{ fontSize: '9px', color: r.weight === 'Must-have' ? '#ef4444' : 'var(--ds-color-text-tertiary)' }}>{r.weight}</Badge>
                </div>
              ))}
              <Button variant="primary" disabled={!complete} onClick={() => setExitOpen(true)} style={{ opacity: complete ? 1 : 0.5 }}>
                {complete ? '⚔️ Face the boss — review quiz' : `Finish all ${MILESTONES.length} milestones to unlock (${done.length}/${MILESTONES.length})`}
              </Button>
              <ExitCheck open={exitOpen} tabId="capstone1" onClose={() => setExitOpen(false)} onSelectTab={onSelectTab} />
            </Stack>
          </Card>
          <Callout type="success"><strong>Portfolio rule:</strong> link the deployed URL + a 5-line writeup (corpus, chunking choice, measured precision, cost/query). Reviewers hire evidence, not adjectives.</Callout>
        </Stack>
      </Container>
    </div>
  );
}
