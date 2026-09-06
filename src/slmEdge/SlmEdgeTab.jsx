import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { DISTILL_TABLE, SLM_TABLE, FIT_EDGE, PYTHON_SLM_CODE } from './slmEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function SlmEdgeTab() {
  const [sub, setSub] = useState('distill');
  const [params, setParams] = useState(3.8);
  const [bits, setBits] = useState(4);
  const [ram, setRam] = useState(8);
  const [tps, setTps] = useState(15);
  const f = FIT_EDGE(params, bits, ram, tps);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="frontiers_production" moduleLabel="Production & Frontiers [Edge SLMs & Distillation]"
        title="Small Models, Same Evals — Fit the Device"
        description="Distill to 10% size at ~90% quality, quantize to GGUF, pass the server golden set, then ship. Local SLM routes and classifies; cloud verifies. Silent downgrades are incidents."
        metrics={[{ label: 'Distill Keeps', value: '~90% @ 10%' }, { label: 'Fit Rule', value: '≤ 60% RAM' }, { label: 'Pattern', value: 'Local + Cloud' }, { label: 'Gate', value: 'Parity Evals' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="frontiers_production" src="/assets/slm_edge.svg" alt="Edge SLMs" title="Distill → Quantize → Parity-Gate → Fit" caption="Same golden set, smaller body; local/cloud split by latency and privacy." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'distill', icon: '🧪', label: '1. Distill + SLMs', desc: 'Methods & models' },
          { id: 'sim', icon: '🔬', label: '2. Fit Sim', desc: 'Device budget' },
          { id: 'code', icon: '🛠️', label: '3. Deploy Code', desc: 'Gate + pattern' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'distill' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Method</th><th style={{ textAlign: 'left', padding: '8px' }}>How</th><th style={{ padding: '8px' }}>Keeps</th><th style={{ textAlign: 'left', padding: '8px' }}>Needs</th></tr></thead>
            <tbody>{DISTILL_TABLE.map((d, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{d.method}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{d.how}</td><td style={{ padding: '8px', textAlign: 'center', color: '#10b981' }}>{d.keeps}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{d.needs}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{SLM_TABLE.map((m, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #10b981' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{m.model}</div><div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>{m.ram}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{m.best}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Edge fit simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Params: {params}B</label>
              <input type="range" min={0.5} max={14} step={0.1} value={params} onChange={e => setParams(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Bits: {bits}</label>
              <input type="range" min={2} max={16} step={2} value={bits} onChange={e => setBits(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Device RAM: {ram} GB</label>
              <input type="range" min={2} max={32} step={2} value={ram} onChange={e => setRam(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Needed tok/s: {tps}</label>
              <input type="range" min={5} max={60} step={5} value={tps} onChange={e => setTps(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${f.fits ? '#10b981' : '#ef4444'}` }}>
              <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>needs {f.needGB} GB · {f.tps} · {f.fits ? '✓ fits' : '✕ over'}</div>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{f.advice}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Deploy gate code</h3></div>
          <CodeBlock language="python" code={PYTHON_SLM_CODE} />
          <Callout type="success"><strong>Parity is the deploy gate:</strong> edge SLM passes the server golden set or it doesn't ship. Version it, eval it, then fit it.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
