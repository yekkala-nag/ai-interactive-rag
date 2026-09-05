import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { INDEX_TABLE, STORE_TABLE, SIZE_INDEX, PYTHON_VDB_CODE } from './vdbEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };

export default function VectorDBOpsTab() {
  const [sub, setSub] = useState('index');
  const [vecM, setVecM] = useState(5);
  const [dim, setDim] = useState(768);
  const [kind, setKind] = useState('hnsw');
  const s = SIZE_INDEX(vecM, dim, kind);
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="data_platform" moduleLabel="Data & Platform Layers [Vector-DB Ops]"
        title="Vectors Are Cheap Until They're 20 GB — Size First"
        description="RAM math before index choice: vectors × dim × 4 bytes × index multiplier. HNSW by default, IVF at 1–10M, PQ past 100M — and recall@k measured on your filtered queries, never assumed."
        metrics={[{ label: 'HNSW Mult', value: '1.35x RAM' }, { label: 'PQ Mult', value: '0.15x RAM' }, { label: '5M×768', value: '~20 GB' }, { label: 'Recall', value: 'Measure It' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage src="/assets/vector_db_ops.svg" alt="Vector DB ops" title="Index Ladder + RAM Math" caption="Flat → IVF → HNSW → PQ by scale; stores by constraint; filters benchmarked, not assumed." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'index', icon: '🗜️', label: '1. Indexes + Stores', desc: 'Ladder & trade-offs' },
          { id: 'sim', icon: '🔬', label: '2. Sizing Sim', desc: 'GB + guidance' },
          { id: 'code', icon: '🛠️', label: '3. Harness Code', desc: 'RAM + recall@k' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'index' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Index</th><th style={{ padding: '8px' }}>Recall</th><th style={{ padding: '8px' }}>QPS</th><th style={{ padding: '8px' }}>RAM</th><th style={{ textAlign: 'left', padding: '8px' }}>Use</th></tr></thead>
            <tbody>{INDEX_TABLE.map((r, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{r.index}</td><td style={{ padding: '8px', textAlign: 'center', color: '#10b981', fontFamily: 'monospace' }}>{r.recall}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{r.qps}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{r.ram}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.use}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{STORE_TABLE.map((st, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{st.dim}</div><div style={{ fontSize: '11px', color: '#10b981' }}>+ {st.strength}</div><div style={{ fontSize: '11px', color: '#F5A623' }}>! {st.watch}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Index sizing simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Vectors: {vecM}M</label>
              <input type="range" min={0.1} max={100} step={0.1} value={vecM} onChange={e => setVecM(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Dims: {dim}</label>
              <input type="range" min={128} max={3072} step={128} value={dim} onChange={e => setDim(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <select value={kind} onChange={e => setKind(e.target.value)} style={sel}><option value="flat">flat</option><option value="ivf">ivf</option><option value="hnsw">hnsw</option><option value="pq">pq</option></select>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
              <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>raw {s.rawGB} GB → {kind} {s.estGB} GB</div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>{s.guidance}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>{s.recallNote}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Sizing + recall harness</h3></div>
          <CodeBlock language="python" code={PYTHON_VDB_CODE} />
          <Callout type="success"><strong>Ops rules:</strong> benchmark WITH payload filters, tune M/efSearch/nprobe per workload, shard before RAM panic, keep Flat slice as ground truth for recall audits.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
