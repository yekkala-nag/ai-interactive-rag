import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { FAILURE_MODES, COMPRESSION_LADDER, PLAN_CONTEXT, PYTHON_LONGCTX_CODE } from './longContextEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function LongContextTab() {
  const [sub, setSub] = useState('failures');
  const [doc, setDoc] = useState(120000);
  const [win, setWin] = useState(128000);
  const [depth, setDepth] = useState(50);
  const plan = PLAN_CONTEXT(doc, win, depth);
  const tabs = [
    { id: 'failures', icon: '🕳️', label: '1. Failure Modes', desc: '4 ways long context fails' },
    { id: 'sim', icon: '🔬', label: '2. Context Planner Sim', desc: 'Stuff vs retrieve-then-read' },
    { id: 'code', icon: '🛠️', label: '3. Ladder + Code', desc: 'Compression L0–L3' }
  ];
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="context_memory" moduleLabel="Context & Memory Engineering [Long-Context Tactics]"
        title="Long Context Isn't Long Memory — Plan It"
        description="Recall is U-shaped: heads and tails stick, middles vanish. Anchor twice, compress on a ladder, and retrieve-then-read the moment you overflow."
        metrics={[{ label: 'Danger Zone', value: '20–80% Depth' }, { label: 'Mid Loss', value: 'Up to −30%' }, { label: 'Ladder', value: 'L0 → L3 (50x)' }, { label: 'Rule', value: 'Overflow = Retrieve' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="context_memory" src="/assets/long_context.svg" alt="Long context tactics" title="U-Curve + Anchors + Compression Ladder" caption="Double-anchor head/tail; L0–L3 compression; overflow triggers retrieve-then-read." background="#090d16" maxWidth={1100} /></div>
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'failures' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div><h3 style={{ margin: 0 }}>🕳️ Four long-context failure modes</h3></div>
          {FAILURE_MODES.map((f, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
            <Flex justify="space-between" align="center"><strong style={{ color: 'white' }}>{f.mode}</strong><Badge variant="subtle" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '9px' }}>{f.loss}</Badge></Flex>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)" style={{ fontSize: '11px', marginTop: '6px' }}>
              <div><span style={{ color: '#F5A623', fontWeight: 'bold' }}>Symptom: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{f.symptom}</span></div>
              <div><span style={{ color: '#10b981', fontWeight: 'bold' }}>Fix: </span><span style={{ color: 'var(--ds-color-text-secondary)' }}>{f.fix}</span></div></Grid></Card>))}
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Context planner simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Doc tokens: {(doc / 1000).toFixed(0)}k</label>
              <input type="range" min="10000" max="500000" step="10000" value={doc} onChange={e => setDoc(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Window: {(win / 1000).toFixed(0)}k</label>
              <input type="range" min={32000} max={1000000} step={16000} value={win} onChange={e => setWin(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Needle depth: {depth}%</label>
              <input type="range" min="0" max="100" value={depth} onChange={e => setDepth(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${plan.fits ? '#10b981' : '#ef4444'}` }}>
              <div style={{ fontSize: '12px', color: 'white' }}>Usable: {(plan.usable / 1000).toFixed(0)}k · Fits: {plan.fits ? 'yes' : 'NO'}</div>
              <div style={{ fontSize: '12px', color: plan.depthRisk.startsWith('HIGH') ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>Depth risk: {plan.depthRisk}</div>
              <div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 'bold', marginTop: '6px' }}>{plan.strategy}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{plan.compressionNeeded}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Compression ladder L0–L3 + planner code</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{COMPRESSION_LADDER.map((l, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{l.level}</div><div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>{l.ratio}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{l.use}</div><div style={{ fontSize: '11px', color: '#F5A623' }}>risk: {l.risk}</div></Card>))}</Grid>
          <CodeBlock language="python" code={PYTHON_LONGCTX_CODE} />
          <Callout type="success"><strong>Rule:</strong> never stuff overflow. Overflow tokens get retrieved or compressed — stuffing them is how needles drown.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
