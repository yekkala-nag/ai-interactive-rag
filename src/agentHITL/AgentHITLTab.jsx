import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { HITL_PATTERNS, AUTONOMY_LADDER, REQUIRED_GATE, PYTHON_HITL_CODE } from './hitlEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };

export default function AgentHITLTab() {
  const [sub, setSub] = useState('gates');
  const [irrev, setIrrev] = useState(true);
  const [blast, setBlast] = useState('many-users');
  const [conf, setConf] = useState(0.6);
  const [novel, setNovel] = useState('routine');
  const g = REQUIRED_GATE(irrev, blast, conf, novel);
  const gc = g.autonomy === 'L1' ? '#ef4444' : g.autonomy === 'L2' ? '#F5A623' : '#10b981';
  const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' };
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Human-in-the-Loop]"
        title="Humans Decide the Irreversible — Agents Handle the Rest"
        description="A 0–9 risk score picks L1 supervised, L2 bounded, or L3 audited autonomy. Four gates cover every act; audit logs all of them — but audit can't un-send, so pair it with gates."
        metrics={[{ label: 'Score', value: '0–9 Risk Sum' }, { label: 'L1 Line', value: '≥ 6' }, { label: 'L2 Band', value: '3–5' }, { label: 'Audit', value: 'Every Act' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage src="/assets/agent_hitl.svg" alt="HITL autonomy" title="L1/L2/L3 + Four Gates" caption="Risk score routes acts; fatigue defence keeps gates honest; audit is universal." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'gates', icon: '🛂', label: '1. Gates + Ladder', desc: '4 gates, L0–L3' },
          { id: 'sim', icon: '🔬', label: '2. Risk Gate Sim', desc: 'Score → autonomy' },
          { id: 'code', icon: '🛠️', label: '3. Gate Code', desc: 'Risk-scored broker' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'gates' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{HITL_PATTERNS.map((p, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{p.name}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{p.where}</div><div style={{ fontSize: '11px', color: '#F5A623' }}>cost: {p.cost}</div><div style={{ fontSize: '11px', color: '#ef4444' }}>risk: {p.risk}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ padding: '8px' }}>Level</th><th style={{ textAlign: 'left', padding: '8px' }}>Human role</th><th style={{ textAlign: 'left', padding: '8px' }}>Example</th></tr></thead>
            <tbody>{AUTONOMY_LADDER.map((a, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold', textAlign: 'center' }}>{a.level}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{a.human}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{a.example}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Risk-gate simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}><input type="checkbox" checked={irrev} onChange={e => setIrrev(e.target.checked)} /> irreversible act (+3)</label>
              <label style={{ fontSize: '11px', color: 'white', display: 'block', marginTop: '8px' }}>Blast radius</label>
              <select value={blast} onChange={e => setBlast(e.target.value)} style={sel}><option value="single-user">single user (+1)</option><option value="many-users">many users (+2)</option><option value="org">org-wide (+3)</option></select>
              <label style={{ fontSize: '11px', color: 'white' }}>Confidence: {conf.toFixed(2)} {conf < 0.7 && '(+2)'}</label>
              <input type="range" min="0" max="100" value={conf * 100} onChange={e => setConf(+e.target.value / 100)} style={{ width: '100%', marginBottom: '8px' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Situation</label>
              <select value={novel} onChange={e => setNovel(e.target.value)} style={sel}><option value="routine">routine</option><option value="novel">novel (+2)</option></select>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${gc}` }}>
              <strong style={{ color: gc }}>{g.gate}</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px' }}>Autonomy: {g.autonomy}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{g.reason}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Risk-scored gate code</h3></div>
          <CodeBlock language="python" code={PYTHON_HITL_CODE} />
          <Callout type="success"><strong>Fatigue defence:</strong> risk-ordered queues, batched similar approvals, mandatory diff review. A gate humans wave through is decoration.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
