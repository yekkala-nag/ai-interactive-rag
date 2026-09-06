import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { REGRESSION_SIGNALS, ROLLBACK_LADDER, RUN_GOLDEN, PYTHON_REGRESSION_CODE } from './regressionEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function PromptRegressionTab() {
  const [sub, setSub] = useState('signals');
  const [noise, setNoise] = useState(2);
  const g = RUN_GOLDEN(noise);
  const gc = g.verdict.startsWith('SHIP') ? '#10b981' : g.verdict.startsWith('GATE') ? '#F5A623' : '#ef4444';
  const tabs = [
    { id: 'signals', icon: '📡', label: '1. Signals + Ladder', desc: '4 signals, 4 rollback rungs' },
    { id: 'sim', icon: '🔬', label: '2. Golden-Set Sim', desc: 'Inject noise, watch bands' },
    { id: 'code', icon: '🛠️', label: '3. Harness Code', desc: 'golden_run() + verdicts' }
  ];
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [Prompt Regression]"
        title="Prompt Regression — Behaviour Fails Quietly"
        description="Structurally valid prompts still regress behaviourally. Golden sets, old-vs-new diffs, canaries and citation gates catch it; rollback rungs contain it. Every rollback donates its case back to the suite."
        metrics={[{ label: 'Signals', value: '4' }, { label: 'Ship Line', value: '≥ 0.95' }, { label: 'Rollback', value: '< 0.80' }, { label: 'Position', value: 'After Graph' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/prompt_regression.svg" alt="Prompt regression pipeline" title="Golden → Diff → Canary → Citations → Rollback" caption="CI blocks merges; canary halts rollouts; rollback pins last-good and feeds the golden set." background="#090d16" maxWidth={1100} /></div>
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'signals' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>📡 Four regression signals + rollback ladder</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{REGRESSION_SIGNALS.map((s, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{s.signal}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.how}</div><div style={{ fontSize: '11px', color: '#ef4444', fontFamily: 'monospace' }}>alert: {s.alert}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{ROLLBACK_LADDER.map((r, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: '#F5A623', fontWeight: 'bold' }}>{r.stage}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{r.action}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>cost: {r.cost}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Golden-set simulator — 6 cases</h3></div>
          <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
            <label style={{ fontSize: '11px', color: 'white' }}>Injected behaviour noise: {noise} (0 = clean, 3 = schema + safety break)</label>
            <input type="range" min="0" max="3" value={noise} onChange={e => setNoise(+e.target.value)} style={{ width: '100%' }} />
          </Card>
          <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${gc}` }}>
            <Flex justify="space-between" align="center"><strong style={{ color: gc }}>{g.verdict}</strong><Badge variant="subtle" style={{ fontSize: '10px' }}>{g.pass}/{g.total} · {g.rate}</Badge></Flex>
            <Stack gap={2} style={{ marginTop: '8px' }}>{g.rows.map((t, i) => (<div key={i} style={{ fontSize: '12px', color: t.newOk ? 'var(--ds-color-text-secondary)' : '#ef4444' }}>{t.newOk ? '✓' : '✕'} {t.q}</div>))}</Stack>
          </Card>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Regression harness code</h3></div>
          <CodeBlock language="python" code={PYTHON_REGRESSION_CODE} />
          <Callout type="success"><strong>Compounding rule:</strong> every rollback adds its failing case to the golden set. Quiet failures get louder with each incident — the suite is the institutional memory of past regressions.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
