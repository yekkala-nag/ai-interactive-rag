import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { MEMORY_TIERS, MEMGPT_LOOP, FORGETTING_RULES, ROUTE_MEMORY, PYTHON_MEMORY_CODE } from './memoryEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const TIER_COLORS = { Working: '#38BDF8', Episodic: '#F5A623', Semantic: '#10b981', 'Cold archive': '#64748b' };

export default function MemHierarchyTab() {
  const [sub, setSub] = useState('tiers');
  const [kind, setKind] = useState('preference');
  const [pii, setPii] = useState(false);
  const [verified, setVerified] = useState(true);
  const [age, setAge] = useState(30);
  const [sal, setSal] = useState(0.8);
  const route = ROUTE_MEMORY(kind, pii, verified, age, sal);
  const tabs = [
    { id: 'tiers', icon: '🗂️', label: '1. Tiers + MemGPT Loop', desc: '4 tiers & paging workflow' },
    { id: 'sim', icon: '🔬', label: '2. Memory Router Sim', desc: 'Route any event live' },
    { id: 'code', icon: '🛠️', label: '3. Forgetting + Code', desc: 'Rules & Python' }
  ];
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="context_memory" moduleLabel="Context & Memory Engineering [Memory Hierarchy & Lifecycle]"
        title="Memory Has Tiers — Route, Page, Forget on Purpose"
        description="Working context is scarce; episodic, semantic and cold tiers are cheap. Score every event, page like MemGPT, quarantine PII before scoring, and forget by rule — not by accident."
        metrics={[{ label: 'Tiers', value: '4 (Hot → Cold)' }, { label: 'Router', value: '0.6·sal + 0.3·rec + 0.1·freq' }, { label: 'PII Rule', value: 'Quarantine First' }, { label: 'Erase', value: 'User Wins' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage src="/assets/mem_hierarchy.svg" alt="Memory hierarchy" title="4 Tiers + MemGPT Paging + PII Rule" caption="Hot working → scored episodic → curated semantic → TTL cold. PII never lands raw." background="#090d16" maxWidth={1100} /></div>
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'tiers' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🗂️ Four tiers + MemGPT paging loop</h3></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Tier</th><th style={{ textAlign: 'left', padding: '8px' }}>Scope</th><th style={{ padding: '8px' }}>Capacity</th><th style={{ textAlign: 'left', padding: '8px' }}>Eviction</th><th style={{ textAlign: 'left', padding: '8px' }}>Example</th></tr></thead>
            <tbody>{MEMORY_TIERS.map((r, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: TIER_COLORS[r.tier], fontWeight: 'bold' }}>{r.tier}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.scope}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', textAlign: 'center' }}>{r.capacity}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.evict}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.example}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{MEMGPT_LOOP.map(s => (<Card key={s.step} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>{s.step}. {s.name}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s.detail}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Memory router simulator</h3><p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Score = 0.6·salience + 0.3·recency + 0.1·frequency. PII short-circuits everything.</p></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Event kind</label>
              <select value={kind} onChange={e => setKind(e.target.value)} style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' }}>
                <option value="session-fact">session-fact</option><option value="preference">preference</option><option value="correction">correction</option><option value="decision">decision</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={pii} onChange={e => setPii(e.target.checked)} /> contains PII</label><br />
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} /> verified</label>
              <label style={{ fontSize: '11px', color: 'white', display: 'block', marginTop: '8px' }}>Age: {age}d</label>
              <input type="range" min="0" max="90" value={age} onChange={e => setAge(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Salience: {sal.toFixed(2)}</label>
              <input type="range" min="0" max="100" value={sal * 100} onChange={e => setSal(+e.target.value / 100)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
              <strong style={{ color: '#10b981' }}>TIER: {route.tier}</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px' }}>{route.action}</div>
              {route.score !== undefined && <div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace', marginTop: '4px' }}>score = {route.score}</div>}
              {route.risk && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>risk: {route.risk}</div>}
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Forgetting rules + Python router</h3></div>
          <Stack gap={3}>{FORGETTING_RULES.map((r, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: '#F5A623', fontWeight: 'bold' }}>{r.rule}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{r.detail}</div><div style={{ fontSize: '11px', color: '#10b981' }}>keeps: {r.keeps}</div></Card>))}</Stack>
          <CodeBlock language="python" code={PYTHON_MEMORY_CODE} />
          <Callout type="success"><strong>Privacy invariant:</strong> quarantine → hash + TTL before any scoring. 'Forget X' deletes with receipt; contradictions tombstone via valid_to.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
