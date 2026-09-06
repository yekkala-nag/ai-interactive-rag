import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { CONTRACT_PARTS, BREAKING_TABLE, VALIDATE_CHANGE, PYTHON_CONTRACT_CODE } from './contractEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function PromptContractsTab() {
  const [sub, setSub] = useState('parts');
  const [rename, setRename] = useState(true);
  const [schema, setSchema] = useState(false);
  const [caps, setCaps] = useState(false);
  const [pinned, setPinned] = useState(true);
  const v = VALIDATE_CHANGE(rename, schema, caps, pinned);
  const tabs = [
    { id: 'parts', icon: '📜', label: '1. Contract Parts', desc: 'Manifest · pins · schemas' },
    { id: 'sim', icon: '🔬', label: '2. Change Gate Sim', desc: 'Breaking or safe?' },
    { id: 'code', icon: '🛠️', label: '3. CI Gate Code', desc: 'validate_change()' }
  ];
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [Prompt Contracts]"
        title="Prompt Contracts — May This Change Ship?"
        description="The dependency graph says what to retest; contracts say whether the change may ship at all. Four parts, five breaking rules, one CI gate. Upstream of graphs and golden sets."
        metrics={[{ label: 'Parts', value: '4' }, { label: 'Breaking Rules', value: '5' }, { label: 'Gate Cost', value: 'ms in CI' }, { label: 'Position', value: 'Before Graph' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/prompt_contracts.svg" alt="Prompt contracts" title="4 Parts → Compatible vs Breaking" caption="Reword/add-optional ships; rename/schema/caps widen blocks pending alias + major + re-eval." background="#090d16" maxWidth={1100} /></div>
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'parts' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div><h3 style={{ margin: 0 }}>📜 Four contract parts + breaking table</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">{CONTRACT_PARTS.map((c, i) => (<Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 'bold' }}>{c.part}</div><div style={{ fontSize: '11px', color: 'white' }}>{c.rule}</div><div style={{ fontSize: '11px', color: '#ef4444' }}>breaks: {c.breaks}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Change</th><th style={{ padding: '8px' }}>Breaking?</th><th style={{ textAlign: 'left', padding: '8px' }}>Gate</th></tr></thead>
            <tbody>{BREAKING_TABLE.map((b, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white' }}>{b.change}</td><td style={{ padding: '8px', textAlign: 'center', color: b.breaking === 'YES' ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{b.breaking}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{b.gate}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Change-gate simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <Stack gap={2}>
                {[['Section rename w/o alias', rename, setRename], ['Output schema changed', schema, setSchema], ['Capabilities widened', caps, setCaps], ['Versions pinned', pinned, setPinned]].map(([l, val, set], i) => (
                  <label key={i} style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }}><input type="checkbox" checked={val} onChange={e => set(e.target.checked)} /> {l}</label>))}
              </Stack>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${v.violations.length ? '#ef4444' : '#10b981'}` }}>
              <strong style={{ color: v.violations.length ? '#ef4444' : '#10b981' }}>{v.verdict}</strong>
              {v.violations.map((x, i) => (<div key={i} style={{ fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>✕ {x}</div>))}
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '8px' }}>{v.next}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ CI gate code</h3></div>
          <CodeBlock language="python" code={PYTHON_CONTRACT_CODE} />
          <Callout type="success"><strong>Pipeline:</strong> contract gate → dependency graph (candidate set) → golden regression (behaviour). Each answers a different question; skipping any one re-opens quiet failure.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
