import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { COST_MODEL, MONTHLY_BILL, PYTHON_FINOPS_CODE } from './finopsEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };

export default function FinOpsTab() {
  const [sub, setSub] = useState('levers');
  const [calls, setCalls] = useState(500);
  const [inp, setInp] = useState(3000);
  const [out, setOut] = useState(500);
  const [routed, setRouted] = useState(60);
  const [cached, setCached] = useState(30);
  const b = MONTHLY_BILL(calls, inp, out, routed, cached);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="frontiers_production" moduleLabel="Production & Frontiers [FinOps & Cost Governance]"
        title="Cheapest Token Is the Un-Sent One"
        description="Five levers in order: cache removes calls, routing downgrades the rest, filtering cuts calls, compression shrinks prompts, rerank shrinks context. Model the bill before it models you."
        metrics={[{ label: 'Levers', value: '5 Ordered' }, { label: 'Routing', value: '5–10x' }, { label: 'Cache', value: '30–60%' }, { label: 'Typical Save', value: '~70%' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="frontiers_production" src="/assets/finops.svg" alt="FinOps" title="Flagship-Only vs Optimized Bill" caption="Same 500k calls: $11k → $3k via cache + routing + filtering." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'levers', icon: '💸', label: '1. Cost Levers', desc: '5 in apply-order' },
          { id: 'sim', icon: '🔬', label: '2. Bill Simulator', desc: 'Monthly math live' },
          { id: 'code', icon: '🛠️', label: '3. Model Code', desc: 'bill() + policy' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'levers' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '8px' }}>#</th><th style={{ textAlign: 'left', padding: '8px' }}>Lever</th><th style={{ padding: '8px' }}>Saves</th><th style={{ textAlign: 'left', padding: '8px' }}>Needs</th><th style={{ textAlign: 'left', padding: '8px' }}>Risk</th></tr></thead>
            <tbody>{COST_MODEL.map((c, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{i + 1}</td><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{c.lever}</td><td style={{ padding: '8px', textAlign: 'center', color: '#10b981' }}>{c.saves}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{c.needs}</td><td style={{ padding: '8px', color: '#F5A623' }}>{c.risk}</td></tr>))}</tbody></table></div>
          <Callout type="success"><strong>Apply in order:</strong> cache → route → filter → compress → rerank. Each later lever multiplies a smaller base — order is the strategy.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Monthly bill simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Calls: {calls}k/mo</label>
              <input type="range" min="10" max="5000" step="10" value={calls} onChange={e => setCalls(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Input tok/call: {inp}</label>
              <input type="range" min={500} max={20000} step={500} value={inp} onChange={e => setInp(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Output tok/call: {out}</label>
              <input type="range" min={100} max={4000} step={100} value={out} onChange={e => setOut(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Routed to mini: {routed}%</label>
              <input type="range" min="0" max="95" value={routed} onChange={e => setRouted(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Cache hit: {cached}%</label>
              <input type="range" min="0" max="80" value={cached} onChange={e => setCached(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '12px', color: 'var(--ds-color-text-tertiary)', textDecoration: 'line-through' }}>Flagship-only: ${b.full.toLocaleString()}/mo</div>
              <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold' }}>${b.opt.toLocaleString()}/mo</div>
              <div style={{ fontSize: '12px', color: 'white' }}>saved ${b.saved.toLocaleString()} ({b.savedPct}%)</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{b.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Bill model code + governance policy</h3></div>
          <CodeBlock language="python" code={PYTHON_FINOPS_CODE} />
          <Callout type="success"><strong>Governance:</strong> per-team budgets with alerts at 70/100%, router-margin review weekly, cache TTL/version audits, no prod deploy without cost estimate in the PR.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
