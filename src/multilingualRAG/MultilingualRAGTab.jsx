import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { STRATEGY_TABLE, FAILURE_TABLE, PICK_ROUTE, PYTHON_MLRAG_CODE } from './mlragEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function MultilingualRAGTab() {
  const [sub, setSub] = useState('routes');
  const [en, setEn] = useState(80);
  const [qlang, setQlang] = useState('hi');
  const [vol, setVol] = useState('high');
  const [lat, setLat] = useState(false);
  const r = PICK_ROUTE(en, qlang, vol, lat);
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [Multilingual RAG]"
        title="One Meaning, Many Token Bills — Route by Corpus"
        description="EN-dominant + low volume → translate the query. Latency-sensitive → native multilingual embed. High volume → translate the corpus once. Entities never travel without source spans."
        metrics={[{ label: 'Routes', value: '3' }, { label: 'hi/ar Tax', value: '1.8x' }, { label: 'Cite Rule', value: 'Source Lang' }, { label: 'Default', value: 'Native Embed' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage src="/assets/multilingual_rag.svg" alt="Multilingual RAG" title="3 Routes + Failure Modes" caption="Corpus mix, latency and volume pick the route; citations stay in source language." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'routes', icon: '🌍', label: '1. Routes + Failures', desc: 'Strategy table' },
          { id: 'sim', icon: '🔬', label: '2. Route Picker Sim', desc: 'Mix → route' },
          { id: 'code', icon: '🛠️', label: '3. Router Code', desc: 'pick_route()' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'routes' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Route</th><th style={{ padding: '8px' }}>Quality</th><th style={{ padding: '8px' }}>Cost</th><th style={{ textAlign: 'left', padding: '8px' }}>Best for</th></tr></thead>
            <tbody>{STRATEGY_TABLE.map((s2, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{s2.route}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{s2.quality}</td><td style={{ padding: '8px', textAlign: 'center', color: '#F5A623' }}>{s2.cost}</td><td style={{ padding: '8px', color: '#10b981' }}>{s2.best}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{FAILURE_TABLE.map((f, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>{f.fail}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{f.detail}</div><div style={{ fontSize: '11px', color: '#10b981' }}>fix: {f.fix}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Route picker simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Corpus English: {en}%</label>
              <input type="range" min={0} max={100} value={en} onChange={e => setEn(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Query language</label>
              <select value={qlang} onChange={e => setQlang(e.target.value)} style={sel}><option value="es">Spanish</option><option value="hi">Hindi</option><option value="ar">Arabic</option><option value="zh">Chinese</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}>Volume</label>
              <select value={vol} onChange={e => setVol(e.target.value)} style={sel}><option value="low">low</option><option value="high">high</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={lat} onChange={e => setLat(e.target.checked)} /> latency-sensitive</label>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
              <strong style={{ color: '#10b981' }}>{r.route}</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px' }}>{r.why}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Router + lang-aware retrieval</h3></div>
          <CodeBlock language="python" code={PYTHON_MLRAG_CODE} />
          <Callout type="success"><strong>Citation invariant:</strong> translated answers cite source-language spans. MT output is never evidence by itself.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
