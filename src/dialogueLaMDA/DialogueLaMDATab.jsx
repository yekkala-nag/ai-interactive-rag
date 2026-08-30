import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  SSI_METRIC_PILLARS,
  LAMDA_SAFETY_GROUNDEDNESS_SYSTEM,
  PYTHON_LAMDA_DIALOGUE_SCRIPT
} from './lamdaEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function DialogueLaMDATab() {
  const [activeSubTab, setActiveSubTab] = useState('ssi'); 
  // 'ssi' | 'safety' | 'evolution' | 'code'

  // Interactive SSI evaluation test
  const [selectedPersona, setSelectedPersona] = useState('pluto');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architectures [Conversational AI & Dialogue Systems]"
        title="Open-Domain Dialogue Architecture: Google LaMDA to Gemini"
        description="Explore the architectural breakthroughs that transformed raw language models into engaging, multi-turn conversational agents. Master Google's Sensibleness, Specificity, and Interestingness (SSI) evaluation framework, safety discriminators, and real-time external tool groundedness."
        metrics={[
          { label: 'Core Metric', value: 'SSI (Sensible, Specific, Interesting)' },
          { label: 'Factuality Engine', value: 'Live Search Tool Grounding' },
          { label: 'Pretraining Goal', value: 'Multi-Turn Dialogue Context' },
          { label: 'Lineage', value: 'LaMDA ➔ PaLM ➔ Gemini' }
        ]}
      />

      <Container size="wide">
        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'ssi', icon: '🎯', label: '1. SSI Evaluation Framework', desc: 'Sensibleness, Specificity, Interestingness' },
            { id: 'safety', icon: '🛡️', label: '2. Safety & Tool Groundedness', desc: 'External search & calculator tools' },
            { id: 'evolution', icon: '🚀', label: '3. Conversational AI Lineage', desc: 'From GPT-3 & LaMDA to Gemini' },
            { id: 'code', icon: '💻', label: '4. Dialogue Pipeline Code', desc: 'Multi-turn context & tool grounding' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-3)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: '11px', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: SSI EVALUATION FRAMEWORK ─── */}
        {activeSubTab === 'ssi' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎯 Google's SSI Triad: Sensibleness, Specificity & Interestingness</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why standard perplexity or BLEU scores fail for dialogue: a chatbot that replies "I don't know" to everything is sensible, but fails specificity and interestingness completely.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {SSI_METRIC_PILLARS.map((p, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: `4px solid ${idx === 0 ? '#38BDF8' : idx === 1 ? '#10b981' : '#F5A623'}` }}>
                      <strong style={{ fontSize: '13px', color: idx === 0 ? '#38BDF8' : idx === 1 ? '#10b981' : '#F5A623', display: 'block', marginBottom: '8px' }}>
                        {p.pillar}
                      </strong>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '10px' }}>
                        {p.description}
                      </p>

                      <div style={{ background: 'rgba(239,68,68,0.08)', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #ef4444', fontSize: '11px', color: '#f87171', marginBottom: '6px' }}>
                        <strong>❌ Fails Metric:</strong> {p.badExample}
                      </div>

                      <div style={{ background: 'rgba(16,185,129,0.08)', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #10b981', fontSize: '11px', color: '#34d399' }}>
                        <strong>✅ Satisfies SSI:</strong> {p.goodExample}
                      </div>
                    </Card>
                  ))}
                </Grid>

                <Callout type="info">
                  <strong>The Dialogue Breakthrough:</strong> LaMDA was fine-tuned with human evaluators rating every response across Sensibleness, Specificity, and Interestingness simultaneously, preventing degenerative robotic repetition.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: SAFETY & TOOL GROUNDEDNESS ─── */}
        {activeSubTab === 'safety' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛡️ Safety Filters & External Tool Groundedness</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How Google eliminated hallucinations by allowing the transformer to query real-time search engines and symbolic math calculators mid-generation.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {LAMDA_SAFETY_GROUNDEDNESS_SYSTEM.map((s, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                      <strong style={{ fontSize: '13px', color: '#38BDF8', display: 'block', marginBottom: '6px' }}>
                        {s.component}
                      </strong>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                        {s.function}
                      </p>

                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>
                        💡 Impact: {s.impact}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: EVOLUTION LINEAGE ─── */}
        {activeSubTab === 'evolution' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🚀 The Conversational AI Lineage: From Static LMs to Multimodal Agents</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Understanding how dialogue fine-tuning paved the way for modern multimodal reasoning engines.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #ef4444' }}>
                    <Badge variant="outline" style={{ marginBottom: '6px' }}>2020: GPT-3</Badge>
                    <strong style={{ fontSize: '12px', color: 'white', display: 'block' }}>Raw Autoregressive LM</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                      Single-turn completion; easily derailed in multi-turn chat; hallucinated facts freely.
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #38BDF8' }}>
                    <Badge variant="outline" style={{ marginBottom: '6px' }}>2021: Google LaMDA</Badge>
                    <strong style={{ fontSize: '12px', color: '#38BDF8', display: 'block' }}>SSI Dialogue Tuning</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                      Dedicated multi-turn fine-tuning, search-tool grounding, and persona-taking.
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #F5A623' }}>
                    <Badge variant="outline" style={{ marginBottom: '6px' }}>2022-23: PaLM 2 & ChatGPT</Badge>
                    <strong style={{ fontSize: '12px', color: '#F5A623', display: 'block' }}>RLHF & Instruct Tuning</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                      Large-scale reinforcement learning from human feedback; coding and reasoning abilities.
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', borderTop: '3px solid #10b981' }}>
                    <Badge variant="outline" style={{ marginBottom: '6px' }}>2024+: Gemini & DeepSeek</Badge>
                    <strong style={{ fontSize: '12px', color: '#10b981', display: 'block' }}>Native Multimodal Reasoning</strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                      End-to-end audio/video/text tokens with test-time compute scaling and reasoning chains.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💻 Production Multi-Turn Dialogue & Grounding Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable reference implementation for building sensible, tool-grounded conversational agents.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_LAMDA_DIALOGUE_SCRIPT} />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
