import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { PROTOCOL_TABLE, ESTIMATE_TOPOLOGY, PYTHON_A2A_CODE } from './a2aEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };

export default function AgentA2ATab() {
  const [sub, setSub] = useState('proto');
  const [n, setN] = useState(5);
  const [topo, setTopo] = useState('star');
  const est = ESTIMATE_TOPOLOGY(n, topo);
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [A2A & Agent Mesh]"
        title="Agents Talking Is a Cost Decision, Not a Style Choice"
        description="Chain costs n−1 messages, star 2n, mesh n(n−1)/2 — plus discovery and version skew. Supervisor by default; A2A peers with a pinned registry; chains only for stable flows."
        metrics={[{ label: 'Default', value: 'Supervisor' }, { label: 'Mesh Limit', value: '~6 Agents' }, { label: 'Registry', value: 'Pin or Fail' }, { label: 'Chain', value: 'n−1 Msgs' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/agent_a2a.svg" alt="Agent mesh topologies" title="Star vs Mesh vs Chain + Registry Rule" caption="Message math per topology; registry pins make skew fail closed." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'proto', icon: '📡', label: '1. Protocols', desc: '5 patterns compared' },
          { id: 'sim', icon: '🔬', label: '2. Topology Sim', desc: 'Messages + latency' },
          { id: 'code', icon: '🛠️', label: '3. Mesh Code', desc: 'Pinned peers' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'proto' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Protocol</th><th style={{ textAlign: 'left', padding: '8px' }}>How</th><th style={{ padding: '8px' }}>Overhead</th><th style={{ textAlign: 'left', padding: '8px' }}>Best for</th><th style={{ textAlign: 'left', padding: '8px' }}>Risk</th></tr></thead>
            <tbody>{PROTOCOL_TABLE.map((p, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{p.proto}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{p.how}</td><td style={{ padding: '8px', textAlign: 'center', color: '#38BDF8', fontFamily: 'monospace' }}>{p.overhead}</td><td style={{ padding: '8px', color: '#10b981' }}>{p.best}</td><td style={{ padding: '8px', color: '#ef4444' }}>{p.risk}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Topology cost simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Agents: {n}</label>
              <input type="range" min="2" max="12" value={n} onChange={e => setN(+e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Topology</label>
              <select value={topo} onChange={e => setTopo(e.target.value)} style={sel}><option value="star">star (supervisor)</option><option value="mesh">mesh (A2A peers)</option><option value="chain">chain (handoffs)</option></select>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
              <strong style={{ color: 'white' }}>{est.topology} × {est.agents} agents</strong>
              <div style={{ fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace', marginTop: '6px' }}>{est.messages} msgs · ~{(est.estLatencyMs / 1000).toFixed(1)}s @120ms · {est.bottleneck}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '6px' }}>{est.advice}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Registry-pinned mesh code</h3></div>
          <CodeBlock language="python" code={PYTHON_A2A_CODE} />
          <Callout type="success"><strong>Rules:</strong> unknown peer → fail closed. Artifact skew → reject. MCP tools scoped per-agent (confused deputy). Boards leased + schema'd.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
