/**
 * Redesigned Overview Tab — Template for new design system
 * Demonstrates Hero, Section, Card, Diagram, CodeBlock, Callout, Accordion, Tabs, Stepper
 */

import { useState } from 'react';
import { TABS_REGISTRY } from '../registry/tabsRegistry.js';
import { Container, Section, Grid, Flex, Stack } from '../components/layout/Primitives.jsx';
import { Hero, Diagram, CodeBlock, Accordion, Tabs, Stepper } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { getModuleColors } from '../design-system/tokens.js';

const RAG_TYPES = [
  { id: 'naive', label: 'Naive RAG', level: 'Foundational', icon: '📄', color: '#0D9488', tagline: 'Chunk → embed → retrieve → generate' },
  { id: 'advanced', label: 'Advanced RAG', level: 'Intermediate', icon: '⚙️', color: '#CA8A04', tagline: 'HyDE + rerank + compression' },
  { id: 'hybrid', label: 'Hybrid RAG', level: 'Production Standard', icon: '🔀', color: '#DC2626', tagline: 'Dense + sparse via RRF' },
  { id: 'selfrag', label: 'Self-RAG', level: 'Advanced', icon: '🪞', color: '#DC2626', tagline: 'Model decides when to retrieve' },
  { id: 'crag', label: 'Corrective RAG', level: 'Advanced', icon: '🩺', color: '#DC2626', tagline: 'Web fallback when local retrieval fails' },
  { id: 'graphrag', label: 'Graph RAG', level: 'Cutting Edge', icon: '🕸️', color: '#9333EA', tagline: 'Knowledge graphs for multi-hop reasoning' },
  { id: 'agentic', label: 'Agentic RAG', level: 'Advanced', icon: '🤖', color: '#DC2626', tagline: 'Multi-step ReAct retrieval loops' },
  { id: 'multimodal', label: 'Multimodal RAG', level: 'Cutting Edge', icon: '🖼️', color: '#9333EA', tagline: 'Text + images + tables together' },
  { id: 'raptor', label: 'RAPTOR', level: 'Cutting Edge', icon: '🌲', color: '#9333EA', tagline: 'Recursive tree of summaries' },
];

const PIPELINE_STEPS = [
  { label: 'Query', icon: '💬', detail: 'User natural language input', color: '#CA8A04' },
  { label: 'Rewrite', icon: '✏️', detail: 'HyDE / query expansion', color: '#0D9488' },
  { label: 'Hybrid Search', icon: '🔀', detail: 'Dense + BM25, top-20', color: '#6366F1' },
  { label: 'Re-rank', icon: '📐', detail: 'Cross-encoder, top-5', color: '#DC2626' },
  { label: 'Compress', icon: '✂️', detail: 'Contextual extraction', color: '#0D9488' },
  { label: 'Agent Loop', icon: '🤖', detail: 'ReAct multi-step retrieval', color: '#CA8A04' },
  { label: 'Answer', icon: '✅', detail: 'Cited response', color: '#16A34A' },
];

const QUICK_START_STEPS = [
  { label: 'Pick Your Architecture', detail: 'Start with Hybrid RAG for production', icon: '1' },
  { label: 'Set Up Retrieval', detail: 'Vector DB + BM25 index', icon: '2' },
  { label: 'Add Reranking', detail: 'Cross-encoder for precision', icon: '3' },
  { label: 'Implement Compression', detail: 'Trim context before generation', icon: '4' },
  { label: 'Add Evaluation', detail: 'Measure recall, latency, cost', icon: '5' },
];

const MODULE_CARDS = [
  { moduleId: 'foundations', label: 'Foundations', count: 5, desc: 'Core concepts, architecture, prompting', href: '#' },
  { moduleId: 'rag', label: 'RAG Systems', count: 10, desc: 'Retrieval architectures & pipelines', href: '#' },
  { moduleId: 'context', label: 'Context & Memory', count: 7, desc: 'Context engineering & evaluation', href: '#' },
  { moduleId: 'agents', label: 'Agent Systems', count: 11, desc: 'ReAct, multi-agent, frameworks', href: '#' },
  { moduleId: 'platform', label: 'Platform & Production', count: 15, desc: 'Engineering layers, cost, frontiers', href: '#' },
];

export function OverviewTab() {
  const [activeTab, setActiveTab] = useState('architectures');
  const [activeStep, setActiveStep] = useState(0);
  const [expandedUmbrella, setExpandedUmbrella] = useState(null);

  return (
    <>
      <Hero
        moduleId="foundations"
        moduleLabel="Module 1"
        title="Modern AI Systems Architecture"
        description="A comprehensive, interactive knowledge base for building production-grade RAG, agent, and context engineering systems. 48 deep-dive topics across 5 modules — from foundational concepts to cutting-edge frontiers."
        metrics={[
          { label: 'Modules', value: '5' },
          { label: 'Topics', value: '48' },
          { label: 'Diagrams', value: '30+' },
          { label: 'Code Examples', value: '100+' },
        ]}
        actions={[
          { label: 'Start Learning', variant: 'primary', onClick: () => setActiveTab('architectures') },
          { label: 'View Progress', variant: 'secondary', onClick: () => setActiveTab('progress') },
        ]}
      />

      <Container size="normal">
        {/* QUICK START */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>Quick Start Path</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>New here? Follow this 5-step path to build your first production RAG system.</p>
          </Section.Header>
          <Section.Body>
            <Stepper
              steps={QUICK_START_STEPS}
              activeStep={activeStep}
              onStepClick={setActiveStep}
              autoPlay={false}
            />
          </Section.Body>
        </Section>

        {/* RAG ARCHITECTURES OVERVIEW */}
        <Section>
          <Section.Header>
            <Flex justify="space-between" align="center" wrap gap="md">
              <div>
                <h2 style={{ fontSize: 'var(--ds-font-size-h2)' }}>RAG Architectures at a Glance</h2>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>9 architectures from baseline to cutting edge — each with interactive explorer, code, and tradeoffs.</p>
              </div>
            </Flex>
          </Section.Header>
          <Section.Body>
            <Tabs
              tabs={[
                { id: 'architectures', label: 'Architectures', icon: '🏗️' },
                { id: 'pipeline', label: 'Pipeline', icon: '▶' },
                { id: 'patterns', label: 'Patterns', icon: '🧬' },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="pills"
            />

            {activeTab === 'architectures' && (
              <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="md" style={{ marginTop: 'var(--ds-space-6)' }}>
                {RAG_TYPES.map((type, i) => (
                  <Card key={type.id} variant="interactive" padding="md" hover>
                    <Flex gap="md" align="flex-start">
                      <span style={{ fontSize: '2rem', flexShrink: 0 }}>{type.icon}</span>
                      <div style={{ flex: 1 }}>
                        <Flex align="center" gap="sm" wrap style={{ marginBottom: 'var(--ds-space-2)' }}>
                          <span style={{ fontWeight: 'var(--ds-font-weight-semibold)', fontSize: 'var(--ds-font-size-body)' }}>{type.label}</span>
                          <Badge variant="default" size="sm">{type.level}</Badge>
                        </Flex>
                        <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', marginBottom: 'var(--ds-space-3)' }}>{type.tagline}</p>
                        <Button variant="ghost" size="sm" onClick={() => { /* navigate */ }}>Explore →</Button>
                      </div>
                    </Flex>
                  </Card>
                ))}
              </Grid>
            )}

            {activeTab === 'pipeline' && (
              <div style={{ marginTop: 'var(--ds-space-6)' }}>
                <Diagram
                  src="/assets/pipeline_flow.svg"
                  alt="7-stage RAG pipeline from query to answer"
                  title="RAG Pipeline — Seven Stages"
                  caption="Each stage progressively filters noise: hybrid fusion, reranking, and compression before generation."
                />
                <Stack gap="md" style={{ marginTop: 'var(--ds-space-6)' }}>
                  {PIPELINE_STEPS.map((step, i) => (
                    <Card key={step.label} variant="default" padding="sm" style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-4)' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: 'var(--ds-radius-full)',
                        background: `${step.color}15`, border: `2px solid ${step.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: step.color, fontWeight: 'bold', flexShrink: 0
                      }}>{step.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'var(--ds-font-weight-medium)', color: 'var(--ds-color-text-primary)' }}>{step.label}</div>
                        <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{step.detail}</div>
                      </div>
                    </Card>
                  ))}
                </Stack>
              </div>
            )}

            {activeTab === 'patterns' && (
              <Stack gap="md" style={{ marginTop: 'var(--ds-space-6)' }}>
                <Card variant="bordered" padding="md">
                  <h3 style={{ marginBottom: 'var(--ds-space-3)' }}>7 Generation Patterns</h3>
                  <p style={{ color: 'var(--ds-color-text-secondary)', marginBottom: 'var(--ds-space-4)' }}>Contract-based generation with Pydantic schemas — the foundation of reliable structured output.</p>
                  <Grid columns={{ base: 1, md: 2 }} gap="sm">
                    {['Extract', 'Classify', 'Summarize', 'Generate', 'Transform', 'Validate', 'Route'].map(p => (
                      <Badge key={p} variant="module" moduleId="rag" size="sm">{p}</Badge>
                    ))}
                  </Grid>
                </Card>
                <Card variant="bordered" padding="md">
                  <h3 style={{ marginBottom: 'var(--ds-space-3)' }}>4 Verification Bricks</h3>
                  <p style={{ color: 'var(--ds-color-text-secondary)', marginBottom: 'var(--ds-space-4)' }}>Grounding, citation, consistency, and factuality checks that stop hallucinations before they reach users.</p>
                  <Grid columns={{ base: 1, md: 2 }} gap="sm">
                    {['Grounding', 'Citation', 'Consistency', 'Factuality'].map(p => (
                      <Badge key={p} variant="module" moduleId="rag" size="sm">{p}</Badge>
                    ))}
                  </Grid>
                </Card>
              </Stack>
            )}
          </Section.Body>
        </Section>

        {/* ARCHITECTURE CONCEPTS */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: 'var(--ds-font-size-h2)' }}>Core Architecture Concepts</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>The three techniques powering the most efficient frontier models in 2025–2026.</p>
          </Section.Header>
          <Section.Body>
            <Grid columns={{ base: 1, md: 3 }} gap="md">
              {[
                { id: 'mla', icon: '🧠', label: 'Multi-Head Latent Attention', color: '#0D9488', metric: '2.7–4.7×', sub: 'KV cache reduction', desc: 'Compresses KV cache by projecting to low-dimensional latent, up-projecting at inference.' },
                { id: 'moe', icon: '🎯', label: 'Mixture of Experts', color: '#CA8A04', metric: '5.5%', sub: 'Params active per token', desc: 'Routes each token to top-k experts; 671B total, 37B active — dense quality at sparse cost.' },
                { id: 'spec', icon: '⚡', label: 'Speculative Decoding', color: '#9333EA', metric: '2–4×', sub: 'Throughput gain', desc: 'Small draft model proposes tokens; large model verifies in parallel. Lossless speedup.' },
              ].map(item => (
                <Card key={item.id} variant="elevated" padding="lg" hover>
                  <Flex gap="md" align="flex-start" style={{ marginBottom: 'var(--ds-space-4)' }}>
                    <span style={{ fontSize: '2rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 'var(--ds-font-weight-semibold)', fontSize: 'var(--ds-font-size-body)' }}>{item.label}</div>
                      <Badge variant="module" moduleId={item.id === 'mla' ? 'foundations' : item.id === 'moe' ? 'foundations' : 'foundations'} size="sm">DeepSeek / Llama 4 / Qwen3</Badge>
                    </div>
                  </Flex>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--ds-space-3)', marginBottom: 'var(--ds-space-3)' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'var(--ds-font-weight-bold)', color: item.color, fontFamily: 'var(--ds-font-family-display)', lineHeight: 1 }}>{item.metric}</div>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{item.sub}</div>
                  </div>
                  <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 'var(--ds-font-lineHeight-relaxed)' }}>{item.desc}</p>
                  <Button variant="ghost" size="sm" style={{ marginTop: 'var(--ds-space-3)' }}>Explore →</Button>
                </Card>
              ))}
            </Grid>
          </Section.Body>
        </Section>

        {/* MODULE NAVIGATION */}
        <Section>
          <Section.Header>
            <h2 style={{ fontSize: 'var(--ds-font-size-h2)' }}>All Modules</h2>
            <p style={{ color: 'var(--ds-color-text-secondary)' }}>Click any module to explore its topics. Progress tracked automatically.</p>
          </Section.Header>
          <Section.Body>
            <Accordion
              items={MODULE_CARDS.map(m => ({
                title: (
                  <Flex justify="space-between" align="center">
                    <Flex alignItems="center" gap="md">
                      <Badge variant="module" moduleId={m.moduleId} size="md" dot>{m.label}</Badge>
                      <span style={{ fontWeight: 'var(--ds-font-weight-medium)' }}>{m.desc}</span>
                    </Flex>
                    <Badge variant="default" size="sm">{m.count} topics</Badge>
                  </Flex>
                ),
                content: (
                  <Grid columns={{ base: 1, md: 2 }} gap="sm" style={{ marginTop: 'var(--ds-space-4)' }}>
                    {TABS_REGISTRY.filter(t => t.umbrellaId === m.moduleId).slice(0, 6).map(t => (
                      <Card key={t.id} variant="interactive" padding="sm" hover style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
                        <span style={{ fontSize: '1.5rem' }}>{t.icon}</span>
                        <span style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{t.label}</span>
                      </Card>
                    ))}
                  </Grid>
                ),
              }))}
            />
          </Section.Body>
        </Section>

        {/* KEY RESOURCES */}
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: 'var(--ds-font-size-h2)' }}>Key Resources</h2>
          </Section.Header>
          <Section.Body>
            <Grid columns={{ base: 1, md: 3 }} gap="md">
              <Card variant="default" padding="lg">
                <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>📖 AI Glossary</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: 'var(--ds-space-4)' }}>21 essential terms across 4 layers: Models, RAG, Agents, Production.</p>
                <Button variant="ghost" size="sm">Open Glossary</Button>
              </Card>
              <Card variant="default" padding="lg">
                <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>🎯 Best Practices</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: 'var(--ds-space-4)' }}>13 emerging patterns from 2025–2026 production deployments.</p>
                <Button variant="ghost" size="sm">View Practices</Button>
              </Card>
              <Card variant="default" padding="lg">
                <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>📊 Progress Tracker</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: 'var(--ds-space-4)' }}>Track your learning across all 48 topics with completion checkpoints.</p>
                <Button variant="ghost" size="sm">View Progress</Button>
              </Card>
            </Grid>
          </Section.Body>
        </Section>
      </Container>
    </>
  );
}