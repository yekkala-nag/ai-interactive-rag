import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { WHY_BRIDGE, ANATOMY, PROVIDER_SHAPES, FAILURE_MODES, TASK_IDS, BUILD_CALL, PYTHON_TOOLS_CODE } from './toolsEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });
const TASK_LABELS = { weather: 'Get weather', refund: 'Refund lookup', escalate: 'Escalate ticket' };

export default function ToolCallingTab() {
  const [sub, setSub] = useState('bridge');
  const [task, setTask] = useState('weather');
  const [good, setGood] = useState(true);
  const r = BUILD_CALL(task, good);
  const rc = r.verdict.startsWith('VALID') ? '#10b981' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Function Calling Basics]"
        title="Wishes In, Actions Out — Schemas In Between"
        description="The bridge from data pipelines to agent execution: typed function contracts both sides understand. Build a call, break a call, watch validation decide before anything executes."
        metrics={[{ label: 'Contract', value: 'JSON Schema' }, { label: 'Rule', value: 'Validate first' }, { label: 'Batch', value: 'Parallel calls' }, { label: 'Writes', value: 'Idempotent' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/tool_calling.svg" alt="Function calling bridge" title="Data → Schema → Action" caption="Schemas turn model wishes into machine actions — validated pre-execution." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'bridge', icon: '🌉', label: '1. Bridge + Anatomy', desc: 'Why + parts' },
          { id: 'sim', icon: '🔬', label: '2. Call Builder Sim', desc: 'Good vs broken args' },
          { id: 'code', icon: '🛠️', label: '3. Contract Code', desc: 'Validate first' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'bridge' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{WHY_BRIDGE.map((w, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>{w.from} → {w.to}</div><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{w.bridge}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{ANATOMY.map((a, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #10b981' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold', fontFamily: 'monospace' }}>{a.part}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{a.role}</div><div style={{ fontSize: '11px', color: '#F5A623' }}>{a.bad}</div></Card>))}</Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">{FAILURE_MODES.map((f, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #ef4444' }}><div style={{ fontSize: '12px', color: '#ef4444', fontWeight: 'bold' }}>{f.fail}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>→ {f.fix}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Call-builder simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap', marginBottom: '10px' }}>
                {TASK_IDS.map(id => (<Button key={id} variant={task === id ? 'primary' : 'secondary'} size="sm" onClick={() => setTask(id)}>{TASK_LABELS[id]}</Button>))}
              </Flex>
              <Flex gap="var(--ds-space-2)">
                <Button variant={good ? 'primary' : 'secondary'} size="sm" onClick={() => setGood(true)}>Send good args</Button>
                <Button variant={!good ? 'primary' : 'secondary'} size="sm" onClick={() => setGood(false)}>Send broken args</Button>
              </Flex>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <div style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace' }}>{r.fn}({r.args})</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{r.schema}</div>
              <div style={{ fontSize: '13px', color: rc, fontWeight: 'bold', marginTop: '6px' }}>{r.verdict}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{r.explain}</div>
            </Card>
          </Grid>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{PROVIDER_SHAPES.map((p, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{p.provider}</div><div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>{p.shape}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{p.note}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Schema-first tools, validated</h3></div>
          <CodeBlock language="python" code={PYTHON_TOOLS_CODE} />
          <Callout type="success"><strong>Bridge rule:</strong> data teams emit schemas agents can satisfy; agent teams validate before executing. The contract is the collaboration.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
