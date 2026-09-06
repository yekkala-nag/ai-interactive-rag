import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { EVAL_TASKS, ATTACK_CATALOG, SCORE_AGENT, PYTHON_AGENT_EVAL_CODE } from './agentEvalEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };

export default function AgentEvalsTab() {
  const [sub, setSub] = useState('tasks');
  const [p, setP] = useState(0.8);
  const [k, setK] = useState(3);
  const [blk, setBlk] = useState(3);
  const r = SCORE_AGENT(p, k, blk, 4);
  const rc = r.verdict === 'SHIP' ? '#10b981' : r.verdict === 'GATE' ? '#F5A623' : '#ef4444';
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Agent Evals & Red-Team]"
        title="Flaky Agents Fail pass^k — Porous Ones Fail Red-Team"
        description="Single-run pass rates lie: p=0.8 becomes 0.51 at k=3. Four attacks probe injection, exfiltration, drift and jailbreak. Ship needs consistency AND hardness."
        metrics={[{ label: 'Consistency', value: 'pass^k' }, { label: 'Attacks', value: '4-Vector Battery' }, { label: 'Ship', value: 'k≥0.7 + s≥0.9' }, { label: 'Cost Lens', value: '$/Success' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="agents_frameworks" src="/assets/agent_evals.svg" alt="Agent evals" title="Task Battery + Red-Team → Ship/Gate/Rebuild" caption="pass^k punishes flakiness; the battery punishes porosity." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'tasks', icon: '🧪', label: '1. Tasks + Attacks', desc: 'Battery & catalog' },
          { id: 'sim', icon: '🔬', label: '2. Ship-Gate Sim', desc: 'p × k × attacks' },
          { id: 'code', icon: '🛠️', label: '3. Harness Code', desc: 'pass^k + battery' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'tasks' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div><h3 style={{ margin: 0 }}>🧪 τ-style task battery</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{EVAL_TASKS.map((t, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{t.task}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{t.checks}</div><div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>{t.metric}</div></Card>))}</Grid>
          <div><h3 style={{ margin: 0 }}>🔴 Red-team attack catalog</h3></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Attack</th><th style={{ textAlign: 'left', padding: '8px' }}>Vector</th><th style={{ textAlign: 'left', padding: '8px' }}>Defence</th><th style={{ textAlign: 'left', padding: '8px' }}>Detect</th></tr></thead>
            <tbody>{ATTACK_CATALOG.map((a, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: '#ef4444', fontWeight: 'bold' }}>{a.attack}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{a.vector}</td><td style={{ padding: '8px', color: '#10b981' }}>{a.defence}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>{a.detect}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Ship-gate simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Single-run pass p: {p.toFixed(2)}</label>
              <input type="range" min="30" max="100" value={p * 100} onChange={e => setP(+e.target.value / 100)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Repetitions k: {k}</label>
              <input type="range" min="1" max="5" value={k} onChange={e => setK(+e.target.value)} style={{ width: '100%' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Attacks blocked: {blk}/4</label>
              <input type="range" min="0" max="4" value={blk} onChange={e => setBlk(+e.target.value)} style={{ width: '100%' }} />
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${rc}` }}>
              <strong style={{ color: rc, fontSize: '16px' }}>{r.verdict}</strong>
              <div style={{ fontSize: '12px', color: 'white', marginTop: '6px', fontFamily: 'monospace' }}>pass^{k} = {r.passk} · security = {r.security}</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{r.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Eval harness code</h3></div>
          <CodeBlock language="python" code={PYTHON_AGENT_EVAL_CODE} />
          <Callout type="success"><strong>Gate both axes:</strong> flaky-but-secure → planner caps + verifier. Consistent-but-porous → hardening drills. Never trade one for the other.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
