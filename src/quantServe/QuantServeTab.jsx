import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { QUANT_TABLE, SERVE_TABLE, SIZE_MODEL, PYTHON_QUANT_CODE } from './quantEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function QuantServeTab() {
  const [sub, setSub] = useState('quants');
  const [params, setParams] = useState(70);
  const [bits, setBits] = useState(4);
  const [ctx, setCtx] = useState(32);
  const s = SIZE_MODEL(params, bits, ctx);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [Quantization & Serving]"
        title="Eval in FP16, Serve in INT4, Edge in GGUF"
        description="70B drops 140GB → 35GB at −1–3% quality. VRAM math (weights + KV cache) picks the quant; workload picks vLLM, TensorRT, TGI, or llama.cpp."
        metrics={[{ label: 'INT4 Saving', value: '4x VRAM' }, { label: 'Quality Cost', value: '−1–3%' }, { label: 'KV at 32k', value: '~10 GB' }, { label: 'Default', value: 'vLLM INT4' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/quant_serve.svg" alt="Quantization" title="Quant Ladder + Stack Picks" caption="Ladder by VRAM; stacks by latency/throughput/ops; KV cache always budgeted." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'quants', icon: '🗜️', label: '1. Quants + Stacks', desc: 'Ladder & runtimes' },
          { id: 'sim', icon: '🔬', label: '2. VRAM Sim', desc: 'Fit the GPUs' },
          { id: 'code', icon: '🛠️', label: '3. Sizing Code', desc: 'vram_gb() + pick' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'quants' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Format</th><th style={{ padding: '8px' }}>Bits</th><th style={{ padding: '8px' }}>Quality</th><th style={{ padding: '8px' }}>70B VRAM</th><th style={{ textAlign: 'left', padding: '8px' }}>Use</th></tr></thead>
            <tbody>{QUANT_TABLE.map((q, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{q.fmt}</td><td style={{ padding: '8px', textAlign: 'center', color: '#38BDF8', fontFamily: 'monospace' }}>{q.bits}</td><td style={{ padding: '8px', textAlign: 'center', color: q.quality.includes('lossless') || q.quality === 'baseline' ? '#10b981' : '#F5A623' }}>{q.quality}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{q.vram70B}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{q.use}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{SERVE_TABLE.map((st, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #10b981' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{st.stack}</div><div style={{ fontSize: '11px', color: '#10b981' }}>{st.best}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>{st.needs}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 VRAM fit simulator (1×80GB assumed)</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Params: {params}B</label>
              <input type="range" min={1} max={180} value={params} onChange={e => setParams(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Quant bits: {bits}</label>
              <input type="range" min={2} max={16} step={2} value={bits} onChange={e => setBits(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Context: {ctx}k</label>
              <input type="range" min={4} max={128} step={4} value={ctx} onChange={e => setCtx(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${s.fits ? '#10b981' : '#ef4444'}` }}>
              <div style={{ fontSize: '13px', color: 'white', fontFamily: 'monospace' }}>weights {s.weightsGB} + KV {s.kvGB} = {s.totalGB} GB {s.fits ? '✓ fits' : '✕ over'}</div>
              <div style={{ fontSize: '12px', color: '#38BDF8', marginTop: '6px' }}>{s.stack}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Sizing code</h3></div>
          <CodeBlock language="python" code={PYTHON_QUANT_CODE} />
          <Callout type="success"><strong>Deploy rule:</strong> quality deltas come from YOUR evals, not vendor charts. INT2 without measurement is hope, not engineering.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
