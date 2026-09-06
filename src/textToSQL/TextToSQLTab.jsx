import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { SQL_LOOP, GUARD_TABLE, DIFFICULTY, DRAFT_SQL, PYTHON_T2S_CODE } from './t2sEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function TextToSQLTab() {
  const [sub, setSub] = useState('loop');
  const [intent, setIntent] = useState('lookup');
  const [state, setState] = useState('CA');
  const [cov, setCov] = useState('property');
  const d = DRAFT_SQL(intent, state, cov);
  const sel = { background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', width: '100%', marginBottom: '8px' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [Text-to-SQL]"
        title="Don't Retrieve Aggregates — Compute Them"
        description="Link schema, generate SELECT-only SQL behind four guards, execute with one repair, interpret with SQL+hash citation. Joins carry validity predicates; grain warnings are mandatory."
        metrics={[{ label: 'Loop', value: '4 Steps' }, { label: 'Guards', value: '4 (AST)' }, { label: 'Repairs', value: '1 Then Escalate' }, { label: 'Cite', value: 'SQL + Hash' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/text_to_sql.svg" alt="Text to SQL" title="Link → Guard → Execute → Interpret" caption="Guards parse AST, not vibes; joins never cross versions silently." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'loop', icon: '🔗', label: '1. Loop + Guards', desc: '4 steps, 4 guards' },
          { id: 'sim', icon: '🔬', label: '2. SQL Draft Sim', desc: 'Intent → guarded SQL' },
          { id: 'code', icon: '🛠️', label: '3. Guard Code', desc: 'AST-checked exec' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'loop' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{SQL_LOOP.map(s2 => (<Card key={s2.step} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 'bold' }}>{s2.step}. {s2.name}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s2.detail}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{GUARD_TABLE.map((g, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{g.guard}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{g.blocks}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '8px' }}>Level</th><th style={{ textAlign: 'left', padding: '8px' }}>Example</th><th style={{ textAlign: 'left', padding: '8px' }}>SQL shape</th><th style={{ padding: '8px' }}>Risk</th></tr></thead>
            <tbody>{DIFFICULTY.map((x, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', textAlign: 'center', color: 'white', fontWeight: 'bold' }}>{x.level}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{x.ex}</td><td style={{ padding: '8px', color: '#38BDF8', fontFamily: 'monospace' }}>{x.sql}</td><td style={{ padding: '8px', color: x.risk === 'low' ? '#10b981' : '#F5A623' }}>{x.risk}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Guarded SQL draft simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Intent</label>
              <select value={intent} onChange={e => setIntent(e.target.value)} style={sel}><option value="lookup">cell lookup</option><option value="aggregate">aggregate</option><option value="join">validity join</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}>State</label>
              <select value={state} onChange={e => setState(e.target.value)} style={sel}><option value="CA">CA</option><option value="TX">TX</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}>Coverage</label>
              <select value={cov} onChange={e => setCov(e.target.value)} style={sel}><option value="property">property</option><option value="liability">liability</option></select>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
              <div style={{ fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace' }}>{d.sql}</div>
              {d.guards.map((g, i) => (<div key={i} style={{ fontSize: '11px', color: g.startsWith('⚠') ? '#F5A623' : '#10b981', marginTop: '4px' }}>{g}</div>))}
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '6px' }}>{d.cite}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ AST-guard + repair harness</h3></div>
          <CodeBlock language="python" code={PYTHON_T2S_CODE} />
          <Callout type="success"><strong>Fan-out rule:</strong> joins without validity predicates double-count across versions. Grain review is part of the gate, not post-hoc.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
