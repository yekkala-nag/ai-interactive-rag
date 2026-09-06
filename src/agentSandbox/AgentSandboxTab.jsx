import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { SANDBOX_TIERS, TOOL_RISKS, SCORE_SANDBOX, PYTHON_SANDBOX_CODE } from './sandboxEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const TOOLS = ['kb.read', 'code.exec', 'db.write', 'email.send', 'refund.issue', 'secret.read'];

export default function AgentSandboxTab() {
  const [sub, setSub] = useState('tiers');
  const [tools, setTools] = useState(['code.exec']);
  const [prod, setProd] = useState(false);
  const [secrets, setSecrets] = useState(false);
  const s = SCORE_SANDBOX(tools, prod, secrets);
  const toggle = (t) => setTools(x => x.includes(t) ? x.filter(y => y !== t) : [...x, t]);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Sandboxing]"
        title="Deny by Default — Broker Every Dangerous Call"
        description="T0 read-only up to T3 break-glass. Tool output is data, never instruction. Secrets are brokered 5-minute creds the model never sees. Mutations carry idempotency keys."
        metrics={[{ label: 'Default', value: 'T1 Staged' }, { label: 'Egress', value: 'Deny Default' }, { label: 'Secrets', value: 'Brokered 5-min' }, { label: 'Mutations', value: 'Idempotent' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/agent_sandbox.svg" alt="Sandbox tiers" title="T0–T3 + Deputy Defence + Secrets" caption="Escalate tiers with risk; quarantine tool output; broker secrets." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'tiers', icon: '🏰', label: '1. Tiers + Tool Risks', desc: 'T0–T3, 5 tool classes' },
          { id: 'sim', icon: '🔬', label: '2. Tier Scorer Sim', desc: 'Tools → tier + controls' },
          { id: 'code', icon: '🛠️', label: '3. Broker Code', desc: 'Allow-list + budgets' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'tiers' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{SANDBOX_TIERS.map((t, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${i === 3 ? '#ef4444' : i === 0 ? '#38BDF8' : '#10b981'}` }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{t.tier}</div><div style={{ fontSize: '11px', color: '#10b981' }}>✓ {t.allows}</div><div style={{ fontSize: '11px', color: '#ef4444' }}>✕ {t.blocks}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{t.use}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Tool</th><th style={{ padding: '8px' }}>Risk</th><th style={{ textAlign: 'left', padding: '8px' }}>Control</th></tr></thead>
            <tbody>{TOOL_RISKS.map((r, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontFamily: 'monospace' }}>{r.tool}</td><td style={{ padding: '8px', textAlign: 'center', color: r.risk === 'Critical' ? '#ef4444' : r.risk === 'High' ? '#F5A623' : '#10b981', fontWeight: 'bold' }}>{r.risk}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.control}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Sandbox tier scorer</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>TOOL SET:</strong>
              <Stack gap={2}>{TOOLS.map(t => (<label key={t} style={{ fontSize: '12px', color: 'white', fontFamily: 'monospace', cursor: 'pointer' }}><input type="checkbox" checked={tools.includes(t)} onChange={() => toggle(t)} /> {t}</label>))}</Stack>
              <label style={{ fontSize: '11px', color: 'white', display: 'block', marginTop: '8px' }}><input type="checkbox" checked={prod} onChange={e => setProd(e.target.checked)} /> production target</label>
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={secrets} onChange={e => setSecrets(e.target.checked)} /> standing secrets exist</label>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
              <strong style={{ color: '#ef4444' }}>{s.tier}</strong>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>critical: {s.critical ? 'yes' : 'no'} · mutating: {s.mutating ? 'yes' : 'no'}</div>
              <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '8px' }}>REQUIRED CONTROLS:</div>
              {s.controls.map((c, i) => (<div key={i} style={{ fontSize: '11px', color: 'white' }}>• {c}</div>))}
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Tool-broker code</h3></div>
          <CodeBlock language="python" code={PYTHON_SANDBOX_CODE} />
          <Callout type="success"><strong>Invariants:</strong> allow-list only, budget-checked, idempotent mutations, audited calls, jailed exec, brokered secrets. Standing secrets are an incident, not a config.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
