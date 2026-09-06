import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { ALIGN_STEPS, MAPPING_TABLE, UNIFY, PYTHON_JOIN_CODE } from './joinEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function CrossDocJoinsTab() {
  const [sub, setSub] = useState('align');
  const [approve, setApprove] = useState(true);
  const u = UNIFY(approve);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [Cross-Doc Table Joins]"
        title="Corpus Questions Need Aligned Schemas, Not Bigger Prompts"
        description="prime_annuelle and premium_amount are the same column in different costumes. Harvest columns, propose mappings with confidence, confirm ambiguity by human, join on validity — then SUM works across contracts."
        metrics={[{ label: 'Pipeline', value: '4 Steps' }, { label: 'Auto Line', value: 'conf ≥ 0.85' }, { label: 'Join Key', value: '+ Validity' }, { label: 'Payoff', value: 'Corpus SUM' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/cross_doc_joins.svg" alt="Cross-doc joins" title="EN + FR → Unified Schedule" caption="Confidence-gated mapping; human confirms ambiguity; validity-aware join." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'align', icon: '🔗', label: '1. Alignment', desc: 'Steps + mapping table' },
          { id: 'sim', icon: '🔬', label: '2. Unify Sim', desc: 'Approve → SUM' },
          { id: 'code', icon: '🛠️', label: '3. Mapping Code', desc: 'unify() + gates' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'align' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{ALIGN_STEPS.map(s2 => (<Card key={s2.step} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #38BDF8' }}><div style={{ fontSize: '12px', color: '#38BDF8', fontWeight: 'bold' }}>{s2.step}. {s2.name}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{s2.detail}</div></Card>))}</Grid>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Contract A</th><th style={{ textAlign: 'left', padding: '8px' }}>Contract B</th><th style={{ textAlign: 'left', padding: '8px' }}>Unified</th><th style={{ padding: '8px' }}>Conf</th><th style={{ padding: '8px' }}>Status</th></tr></thead>
            <tbody>{MAPPING_TABLE.map((m, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontFamily: 'monospace' }}>{m.contractA}</td><td style={{ padding: '8px', color: 'white', fontFamily: 'monospace' }}>{m.contractB}</td><td style={{ padding: '8px', color: '#10b981', fontFamily: 'monospace' }}>{m.unified}</td><td style={{ padding: '8px', textAlign: 'center', color: m.conf < 0.85 ? '#F5A623' : '#10b981', fontWeight: 'bold' }}>{m.conf}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{m.status}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Unification simulator — 2 EN + 2 FR rows</h3></div>
          <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
            <label style={{ fontSize: '12px', color: 'white', cursor: 'pointer' }}><input type="checkbox" checked={approve} onChange={e => setApprove(e.target.checked)} /> approve garantie→coverage (0.72)</label>
          </Card>
          <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
            {u.rows.map((r, i) => (<div key={i} style={{ fontSize: '12px', fontFamily: 'monospace', color: r.coverage === 'UNMAPPED' ? '#F5A623' : 'white' }}>{r.policy} · {r.premium_amount} · {r.start_date} · {r.coverage} <span style={{ color: 'var(--ds-color-text-tertiary)' }}>[{r.src}]</span></div>))}
            <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 'bold', marginTop: '8px' }}>corpus total = {u.total}</div>
            <div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace', marginTop: '4px' }}>{u.sql}</div>
            <div style={{ fontSize: '11px', color: '#F5A623', marginTop: '4px' }}>{u.warning}</div>
          </Card>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Confidence-gated unify code</h3></div>
          <CodeBlock language="python" code={PYTHON_JOIN_CODE} />
          <Callout type="success"><strong>Audit rule:</strong> mappings store confidence + evidence + approver. Corpus answers cite the mapping version — alignment is data, version it.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
