import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { STREAM_TABLE, LINEAGE_TABLE, SIZE_STREAM, PYTHON_PIPE_CODE } from './pipeEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function DataPipelineTab() {
  const [sub, setSub] = useState('stream');
  const [eps, setEps] = useState(10000);
  const s = SIZE_STREAM(eps);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="data_platform" moduleLabel="Data & Platform Layers [Streaming + Lineage + Versioning]"
        title="Bytes Need Provenance — Stream, Trace, Version, Gate"
        description="Partitions from rate math, lineage from OpenLineage, versions from LakeFS/DVC — and new bytes reach retrieval only through a rag-eval Ship gate on a staging branch."
        metrics={[{ label: 'Partition Rule', value: 'max(rate, consumers)' }, { label: 'Lineage', value: 'Column-Level' }, { label: 'Versions', value: 'LakeFS/DVC' }, { label: 'Promotion', value: 'Ship-Gated' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="data_platform" src="/assets/data_pipeline.svg" alt="Data pipeline" title="Stream → Lineage → Versioned Promotion" caption="Partition math; audit trail; staging-branch evals before prod merge." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'stream', icon: '🌊', label: '1. Stream + Lineage', desc: 'Kafka/Flink, catalogs' },
          { id: 'sim', icon: '🔬', label: '2. Partition Sim', desc: 'Rate → partitions' },
          { id: 'code', icon: '🛠️', label: '3. Pipeline Code', desc: 'parts + branches' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'stream' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Concept</th><th style={{ textAlign: 'left', padding: '8px' }}>Rule</th><th style={{ textAlign: 'left', padding: '8px' }}>Example</th></tr></thead>
            <tbody>{STREAM_TABLE.map((r, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{r.concept}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.rule}</td><td style={{ padding: '8px', color: '#38BDF8', fontFamily: 'monospace' }}>{r.ex}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{LINEAGE_TABLE.map((l, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #10b981' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{l.layer}</div><div style={{ fontSize: '11px', color: '#10b981' }}>{l.tool}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>{l.answers}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Partition + lineage simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Events/sec: {(eps / 1000).toFixed(0)}k</label>
              <input type="range" min={1000} max={200000} step={1000} value={eps} onChange={e => setEps(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${s.lagRisk.startsWith('HIGH') ? '#ef4444' : '#10b981'}` }}>
              <div style={{ fontSize: '16px', color: 'white', fontFamily: 'monospace' }}>{s.partitions} partitions</div>
              <div style={{ fontSize: '12px', color: s.lagRisk.startsWith('HIGH') ? '#ef4444' : '#10b981' }}>{s.lagRisk}</div>
              <div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace', marginTop: '6px' }}>{s.lineage.map((l, i) => (<div key={i}>{i + 1}. {l}</div>))}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{s.advice}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Partition math + branch promotion</h3></div>
          <CodeBlock language="python" code={PYTHON_PIPE_CODE} />
          <Callout type="success"><strong>Promotion invariant:</strong> staging branch → rag eval → Ship → merge prod. Retrieval never reads un-gated bytes.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
