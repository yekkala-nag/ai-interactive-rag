import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { ALGO_TABLE, FERTILITY, ESTIMATE_TOKENS, PYTHON_TOKEN_CODE } from './tokenEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: a === b ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' });

export default function TokenizationTab() {
  const [sub, setSub] = useState('algos');
  const [words, setWords] = useState(1000);
  const [lang, setLang] = useState('hi');
  const mult = (FERTILITY.find(f => f.lang.startsWith(lang)) || { mult: 1.3 }).mult;
  const e = ESTIMATE_TOKENS(words, mult);
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="foundations" moduleLabel="Foundations & Architecture [Tokenization]"
        title="Tokenization — Where Every Bill Begins"
        description="BPE merges up, Unigram prunes down, WordPiece likelihood-merges. Fertility decides the multilingual tax: Hindi/Arabic cost ~2x English for identical meaning."
        metrics={[{ label: 'Algos', value: 'BPE · Unigram · WP' }, { label: 'hi/ar Tax', value: '~1.8x' }, { label: 'Rule', value: 'Never Split Token' }, { label: 'EN Baseline', value: '1.3 t/w' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="foundations" src="/assets/tokenization.svg" alt="Tokenization" title="Algos + Fertility Tax" caption="Algorithm choice shapes splits; language shapes the bill." background="#090d16" maxWidth={1100} /></div>
        <div style={NAV}>{[
          { id: 'algos', icon: '🔤', label: '1. Algorithms', desc: 'BPE · Unigram · WordPiece' },
          { id: 'sim', icon: '🔬', label: '2. Fertility Sim', desc: 'Words → tokens → $' },
          { id: 'code', icon: '🛠️', label: '3. Guard Code', desc: 'Estimate + chunk guard' }].map(t => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}><div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'algos' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={3}>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Algorithm</th><th style={{ textAlign: 'left', padding: '8px' }}>How</th><th style={{ padding: '8px' }}>Vocab</th><th style={{ textAlign: 'left', padding: '8px' }}>Trait</th></tr></thead>
            <tbody>{ALGO_TABLE.map((a, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{a.algo}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{a.how}</td><td style={{ padding: '8px', textAlign: 'center', color: '#38BDF8', fontFamily: 'monospace' }}>{a.vocab}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{a.trait}</td></tr>))}</tbody></table></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Language</th><th style={{ padding: '8px' }}>Fertility ×</th><th style={{ textAlign: 'left', padding: '8px' }}>Note</th></tr></thead>
            <tbody>{FERTILITY.map((f, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white' }}>{f.lang}</td><td style={{ padding: '8px', textAlign: 'center', color: f.mult >= 1.5 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{f.mult}x</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{f.note}</td></tr>))}</tbody></table></div>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Fertility & cost simulator</h3></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
              <label style={{ fontSize: '11px', color: 'white' }}>Words: {words}</label>
              <input type="range" min={100} max={10000} step={100} value={words} onChange={e2 => setWords(+e2.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
              <label style={{ fontSize: '11px', color: 'white' }}>Language</label>
              <select value={lang} onChange={e2 => setLang(e2.target.value)} style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px' }}>
                <option value="English">English</option><option value="Spanish">Spanish / French</option><option value="Hindi">Hindi / Arabic</option><option value="Chinese">Chinese</option><option value="Code">Code / JSON</option></select>
            </Card>
            <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${e.fertility >= 2 ? '#ef4444' : '#10b981'}` }}>
              <div style={{ fontSize: '16px', color: 'white', fontFamily: 'monospace' }}>{e.tokens.toLocaleString()} tokens</div>
              <div style={{ fontSize: '12px', color: '#38BDF8' }}>fertility {e.fertility} t/w · ${e.costPer1kDocs}/1k docs @ $5/M</div>
              <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{e.note}</div>
            </Card>
          </Grid>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Estimate + chunk-guard code</h3></div>
          <CodeBlock language="python" code={PYTHON_TOKEN_CODE} />
          <Callout type="success"><strong>Chunking invariant:</strong> budget by estimate, split on whitespace — a chunker that splits inside tokens corrupts embeddings silently.</Callout>
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
