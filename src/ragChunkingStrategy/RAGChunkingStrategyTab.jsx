import React, { useState, useEffect } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  CHUNKING_STRATEGIES,
  SAMPLE_DOCUMENTS,
  PIPELINE_WORKFLOW_STEPS,
  FAILURE_MODE_SCENARIOS,
  SIMULATE_CHUNKING,
  CHUNKING_COMPARISON_TABLE,
  PYTHON_CHUNKING_CODE
} from './chunkingEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

const STRATEGY_ICONS = {
  fixed_size: "📏",
  recursive_character: "🔄",
  markdown_header: "#️⃣",
  semantic_chunking: "🧠",
  sentence_window: "🪟",
  parent_child: "🌳",
  contextual_retrieval: "✨",
  late_chunking: "⏳"
};

const RISK_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444"
};

export default function RAGChunkingStrategyTab() {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState('workflow'); // 'workflow' | 'simulator' | 'shredding' | 'latechunking' | 'optimizer' | 'matrix' | 'code'

  // Workflow Pipeline State
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Simulator State
  const [selectedDocId, setSelectedDocId] = useState(SAMPLE_DOCUMENTS[0].id);
  const [selectedStrategy, setSelectedStrategy] = useState('parent_child');
  const [chunkSizeSlider, setChunkSizeSlider] = useState(80);
  const [overlapSlider, setOverlapSlider] = useState(15);
  const [activeChunkModal, setActiveChunkModal] = useState(null);
  const [simResult, setSimResult] = useState(null);

  // Failure scenario state
  const [activeScenarioId, setActiveScenarioId] = useState(FAILURE_MODE_SCENARIOS[0].id);

  // Optimizer state
  const [calcContextWindow, setCalcContextWindow] = useState(32768); // 32k
  const [calcQueryType, setCalcQueryType] = useState('targeted'); // 'targeted' | 'broad'
  const [calcDocVolume, setCalcDocVolume] = useState(100000); // 100k pages

  const activeDoc = SAMPLE_DOCUMENTS.find(d => d.id === selectedDocId) || SAMPLE_DOCUMENTS[0];
  const activePipelineStep = PIPELINE_WORKFLOW_STEPS[activeStepIdx] || PIPELINE_WORKFLOW_STEPS[0];
  const activeScenario = FAILURE_MODE_SCENARIOS.find(s => s.id === activeScenarioId) || FAILURE_MODE_SCENARIOS[0];

  // Auto-run simulation on document, strategy, or slider change
  useEffect(() => {
    const res = SIMULATE_CHUNKING(selectedStrategy, activeDoc, {
      chunkSize: chunkSizeSlider,
      overlap: overlapSlider
    });
    setSimResult(res);
  }, [selectedStrategy, selectedDocId, chunkSizeSlider, overlapSlider]);

  // Workflow Autoplay Timer
  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setActiveStepIdx(prev => (prev + 1) % PIPELINE_WORKFLOW_STEPS.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // Optimizer calculations
  const recommendedChunkTokens = calcQueryType === 'targeted' ? 256 : 1024;
  const recommendedOverlapTokens = Math.round(recommendedChunkTokens * 0.12);
  const totalChunksEst = Math.round((calcDocVolume * 400) / (recommendedChunkTokens - recommendedOverlapTokens));
  const embeddingStorageMB = ((totalChunksEst * 1536 * 4) / (1024 * 1024)).toFixed(1);
  const monthlyCostEst = ((totalChunksEst * recommendedChunkTokens * 0.00002) / 1000).toFixed(2);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [Chunking Strategies]"
        title="RAG Chunking Strategies: Boundary Integrity to Late Chunking"
        description="Chunking is the single highest-leverage decision in RAG. Explore 8 distinct splitting paradigms—from naive fixed-size windows to AST Markdown structures, Anthropic's Contextual Retrieval, and Jina's bidirectional Late Chunking."
        metrics={[
          { label: 'Chunking Strategies', value: '8 Paradigms' },
          { label: 'Quality Spectrum', value: '42% → 94% Recall' },
          { label: 'Context Retention', value: '98% SOTA' },
          { label: 'Industry Best Practice', value: 'Parent-Child + Context' }
        ]}
      />

      <Container size="wide">
        {/* DUAL ARCHITECTURAL DIAGRAM CARDS */}
        <Grid columns={{ base: '1fr', lg: '1.2fr 0.8fr' }} gap="var(--ds-space-4)" style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage moduleId="rag_architecture"
            src="/assets/rag_chunking_strategies.svg"
            alt="RAG Chunking Strategies Decision Matrix and Taxonomy"
            title="Chunking Strategy Decision Matrix & Taxonomy"
            caption="Overview of 4 core architectural tiers: Naive Fixed-Size, Structural / AST, Parent-Child Hierarchical, and Contextual / Late Chunking."
            background="#090d16"
            maxWidth={800}
          />
          <DiagramImage moduleId="rag_architecture"
            src="/assets/rag_late_chunking_workflow.svg"
            alt="Traditional Chunking vs Jina Late Chunking Workflow"
            title="Traditional vs Late Chunking Architecture"
            caption="How Late Chunking eliminates boundary blindspots via whole-document self-attention layers before span mean-pooling."
            background="#090d16"
            maxWidth={600}
          />
        </Grid>

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
            { id: 'workflow', icon: '⚡', label: '1. 8-Stage Pipeline Runner', desc: 'Step-by-step ingestion lifecycle' },
            { id: 'simulator', icon: '🔬', label: '2. Live Chunking Simulator', desc: 'Real-time boundary & cut inspector' },
            { id: 'shredding', icon: '💥', label: '3. Semantic Shredding Cases', desc: 'Failure modes & grounding fixes' },
            { id: 'latechunking', icon: '✨', label: '4. Late & Contextual Deep-Dive', desc: 'Attention maps & situational prefixes' },
            { id: 'optimizer', icon: '🧮', label: '5. Sizing & Cost Calculator', desc: 'Chunk size, overlap & token math' },
            { id: 'matrix', icon: '📊', label: '6. Speed vs Quality Matrix', desc: 'Tradeoffs & recommendations' },
            { id: 'code', icon: '💻', label: '7. Production Python Code', desc: 'Ready-to-use implementations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            SUBTAB 1: 8-STAGE INGESTION PIPELINE RUNNER
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'workflow' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>⚡ 8-Stage Document Chunking & Indexing Pipeline</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Interactive step-through: Trace how unstructured enterprise text is normalized, parsed into AST structures, sliced, enriched, and indexed.
                    </p>
                  </div>
                  <Flex gap="var(--ds-space-2)" align="center">
                    <Button
                      variant={isAutoPlaying ? "danger" : "secondary"}
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    >
                      {isAutoPlaying ? "⏹️ Pause Auto-Play" : "▶️ Auto-Play Pipeline"}
                    </Button>
                  </Flex>
                </Flex>

                {/* Step Selector Badges */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {PIPELINE_WORKFLOW_STEPS.map((step, idx) => {
                    const isCurrent = activeStepIdx === idx;
                    return (
                      <button
                        key={step.id}
                        onClick={() => { setActiveStepIdx(idx); setIsAutoPlaying(false); }}
                        style={{
                          background: isCurrent ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-bg-surface)',
                          border: `1px solid ${isCurrent ? '#38bdf8' : 'var(--ds-color-border-subtle)'}`,
                          borderRadius: 'var(--ds-radius-md)',
                          padding: '10px 8px',
                          color: isCurrent ? 'white' : 'var(--ds-color-text-secondary)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>{step.icon}</div>
                        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Stage {step.stepNumber}</div>
                        <div style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {step.name.split(' ')[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Step Detailed Card */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38bdf8' }}>
                  <Stack gap={3}>
                    <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                      <Flex gap="var(--ds-space-2)" align="center">
                        <span style={{ fontSize: '24px' }}>{activePipelineStep.icon}</span>
                        <div>
                          <strong style={{ fontSize: '16px', color: '#38bdf8' }}>
                            Stage {activePipelineStep.stepNumber}: {activePipelineStep.name}
                          </strong>
                          <div style={{ fontSize: '12px', color: 'var(--ds-color-text-tertiary)' }}>
                            Category: {activePipelineStep.category} | Average Latency: {activePipelineStep.latency}
                          </div>
                        </div>
                      </Flex>
                      <Flex gap="var(--ds-space-2)">
                        <Button
                          variant="ghost"
                          disabled={activeStepIdx === 0}
                          onClick={() => setActiveStepIdx(prev => Math.max(0, prev - 1))}
                        >
                          ← Previous
                        </Button>
                        <Button
                          variant="primary"
                          disabled={activeStepIdx === PIPELINE_WORKFLOW_STEPS.length - 1}
                          onClick={() => setActiveStepIdx(prev => Math.min(PIPELINE_WORKFLOW_STEPS.length - 1, prev + 1))}
                        >
                          Next Stage →
                        </Button>
                      </Flex>
                    </Flex>

                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ds-color-text-secondary)', lineHeight: '1.5' }}>
                      {activePipelineStep.description}
                    </p>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                      <div style={{ background: '#090d16', padding: '12px', borderRadius: '6px', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <strong style={{ fontSize: '11px', color: '#f59e0b', display: 'block', marginBottom: '6px' }}>
                          INPUT STAGE PAYLOAD:
                        </strong>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#94a3b8', whiteSpace: 'pre-wrap' }}>
                          {activePipelineStep.inputExample}
                        </div>
                      </div>
                      <div style={{ background: '#090d16', padding: '12px', borderRadius: '6px', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <strong style={{ fontSize: '11px', color: '#10b981', display: 'block', marginBottom: '6px' }}>
                          OUTPUT TRANSFORM &amp; METADATA:
                        </strong>
                        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#6ee7b7', whiteSpace: 'pre-wrap' }}>
                          {activePipelineStep.outputExample}
                        </div>
                      </div>
                    </Grid>

                    <Callout type="warning" title="Critical Production Engineering Rule:">
                      <span style={{ fontSize: '12px' }}>{activePipelineStep.criticalConsideration}</span>
                    </Callout>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            SUBTAB 2: LIVE CHUNKING SIMULATOR & BOUNDARY INSPECTOR
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔬 Live Chunking Simulator &amp; Boundary Inspector</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Select a realistic enterprise document, adjust target parameters, and observe how each splitting strategy affects sentence cuts, overlap integrity, and context retention.
                  </p>
                </div>

                {/* Controls Bar */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                      1. SELECT DOCUMENT TYPE:
                    </label>
                    <select
                      value={selectedDocId}
                      onChange={e => setSelectedDocId(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#090d16',
                        color: 'white',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '12px'
                      }}
                    >
                      {SAMPLE_DOCUMENTS.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.type} — {doc.title.substring(0, 30)}...
                        </option>
                      ))}
                    </select>
                  </Card>

                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <label style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
                      2. CHUNKING STRATEGY:
                    </label>
                    <select
                      value={selectedStrategy}
                      onChange={e => setSelectedStrategy(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#090d16',
                        color: 'white',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '12px'
                      }}
                    >
                      {CHUNKING_STRATEGIES.map(s => (
                        <option key={s.id} value={s.id}>
                          {STRATEGY_ICONS[s.id]} {s.name} ({s.category})
                        </option>
                      ))}
                    </select>
                  </Card>

                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>TARGET CHUNK SIZE:</span>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{chunkSizeSlider} words</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="200"
                      value={chunkSizeSlider}
                      onChange={e => setChunkSizeSlider(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#38bdf8', marginBottom: '8px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>SLIDING OVERLAP:</span>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{overlapSlider} words</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={overlapSlider}
                      onChange={e => setOverlapSlider(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                  </Card>
                </Grid>

                {/* Simulator Scorecard Metrics */}
                {simResult && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '8px',
                    background: '#090d16',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--ds-color-border-subtle)'
                  }}>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>TOTAL CHUNKS</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{simResult.totalChunks}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>RETRIEVAL PRECISION</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>{simResult.retrievalPrecision}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>SEMANTIC INTEGRITY</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: simResult.semanticQuality === 'Poor' ? '#ef4444' : '#10b981' }}>
                        {simResult.semanticQuality}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>SEVERED SENTENCES</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: simResult.severedSentencesCount > 0 ? '#ef4444' : '#10b981' }}>
                        {simResult.severedSentencesCount} cuts
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>CONTEXT RETENTION</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{simResult.contextRetention}</div>
                    </div>
                  </div>
                )}

                {/* Generated Chunks Visualization Grid */}
                {simResult && (
                  <Stack gap={3}>
                    <Flex justify="space-between" align="center">
                      <strong style={{ fontSize: '13px', color: 'var(--ds-color-text-primary)' }}>
                        Generated Slices for "{activeDoc.title}" ({simResult.chunks.length} chunks generated):
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                        Click any chunk card for deep metadata inspection
                      </span>
                    </Flex>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {simResult.chunks.map((chunk) => (
                        <div
                          key={chunk.id}
                          onClick={() => setActiveChunkModal(chunk)}
                          style={{
                            background: 'var(--ds-color-bg-surface)',
                            border: `1px solid ${chunk.breaksMidSentence ? '#ef4444' : 'var(--ds-color-border-subtle)'}`,
                            borderLeft: `4px solid ${chunk.breaksMidSentence ? '#ef4444' : '#10b981'}`,
                            borderRadius: '6px',
                            padding: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                            <Flex gap="var(--ds-space-2)" align="center">
                              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#38bdf8' }}>
                                Chunk #{chunk.id}
                              </span>
                              <Badge variant="subtle" style={{ background: 'rgba(255,255,255,0.08)', fontSize: '9px' }}>
                                {chunk.wordCount} words
                              </Badge>
                              {chunk.isChildVector && (
                                <Badge variant="subtle" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', fontSize: '9px' }}>
                                  Child Vector ➔ {chunk.parentId}
                                </Badge>
                              )}
                            </Flex>

                            <Flex gap="var(--ds-space-2)">
                              {chunk.breaksMidSentence ? (
                                <Badge variant="subtle" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '9px' }}>
                                  ⚠️ BREAKS MID-SENTENCE
                                </Badge>
                              ) : (
                                <Badge variant="subtle" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '9px' }}>
                                  ✓ BOUNDARY CLEAN
                                </Badge>
                              )}
                            </Flex>
                          </Flex>

                          <div style={{
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            color: 'var(--ds-color-text-secondary)',
                            lineHeight: '1.4',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {chunk.preview}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Stack>
                )}
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            SUBTAB 3: SEMANTIC SHREDDING & BOUNDARY FAILURE SCENARIOS
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'shredding' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💥 Semantic Shredding: Why Naive Chunking Fails in Production</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Examine 3 critical failure cases where fixed token cuts alter facts, lose table headers, or sever entity references, creating subtle hallucinations.
                  </p>
                </div>

                {/* Scenario Tabs */}
                <Flex gap="var(--ds-space-2)" style={{ flexWrap: 'wrap' }}>
                  {FAILURE_MODE_SCENARIOS.map(sc => (
                    <Button
                      key={sc.id}
                      variant={activeScenarioId === sc.id ? "primary" : "secondary"}
                      onClick={() => setActiveScenarioId(sc.id)}
                    >
                      {sc.title}
                    </Button>
                  ))}
                </Flex>

                {/* Scenario Display Card */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                        {activeScenario.category} Case Study
                      </div>
                      <h4 style={{ margin: '4px 0', fontSize: '15px' }}>
                        User Query: "{activeScenario.query}"
                      </h4>
                    </div>

                    <div style={{ background: '#090d16', padding: '12px', borderRadius: '6px', border: '1px solid var(--ds-color-border-subtle)' }}>
                      <strong style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        ORIGINAL SOURCE DOCUMENT EXCERPT:
                      </strong>
                      <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.4', fontFamily: 'monospace' }}>
                        {activeScenario.rawDocumentText}
                      </div>
                    </div>

                    {/* Side-by-Side Comparison */}
                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                      {/* Naive Fixed-Size Failure */}
                      <Card style={{ padding: '14px', background: '#1c1015', border: '1px solid rgba(239,68,68,0.4)', borderTop: '4px solid #ef4444' }}>
                        <Stack gap={2}>
                          <Flex justify="space-between" align="center">
                            <strong style={{ fontSize: '12px', color: '#ef4444' }}>
                              ❌ Naive Fixed-Size Chunking
                            </strong>
                            <Badge variant="subtle" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '9px' }}>
                              {activeScenario.naiveChunk.retrievalStatus}
                            </Badge>
                          </Flex>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fca5a5', background: '#090d16', padding: '8px', borderRadius: '4px' }}>
                            {activeScenario.naiveChunk.text}
                          </div>
                          <div style={{ fontSize: '11px', color: '#f87171' }}>
                            <strong>Severed Part:</strong> {activeScenario.naiveChunk.severedText}
                          </div>
                          <div style={{ fontSize: '11px', color: '#fca5a5', fontWeight: 'bold' }}>
                            {activeScenario.naiveChunk.outcome}
                          </div>
                        </Stack>
                      </Card>

                      {/* Advanced Chunking Fix */}
                      <Card style={{ padding: '14px', background: '#0d1f1a', border: '1px solid rgba(16,185,129,0.4)', borderTop: '4px solid #10b981' }}>
                        <Stack gap={2}>
                          <Flex justify="space-between" align="center">
                            <strong style={{ fontSize: '12px', color: '#10b981' }}>
                              ✅ {activeScenario.advancedChunk.strategy}
                            </strong>
                            <Badge variant="subtle" style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '9px' }}>
                              {activeScenario.advancedChunk.retrievalStatus}
                            </Badge>
                          </Flex>
                          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#6ee7b7', background: '#090d16', padding: '8px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                            {activeScenario.advancedChunk.text}
                          </div>
                          <div style={{ fontSize: '11px', color: '#34d399', fontWeight: 'bold' }}>
                            {activeScenario.advancedChunk.outcome}
                          </div>
                        </Stack>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            SUBTAB 4: LATE CHUNKING & CONTEXTUAL RETRIEVAL DEEP-DIVE
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'latechunking' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>✨ Late Chunking (Jina) vs. Contextual Retrieval (Anthropic)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How modern RAG solves context loss: either by applying whole-document bidirectional attention before pooling, or prepending LLM-generated situational prefixes.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {/* Contextual Retrieval Deep-Dive */}
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '4px solid #a855f7' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <strong style={{ fontSize: '14px', color: '#c084fc' }}>
                          🏷️ Anthropic Contextual Retrieval
                        </strong>
                        <Badge variant="subtle" style={{ background: 'rgba(168,85,247,0.2)', color: '#c084fc', fontSize: '10px' }}>
                          Prompt Enriched
                        </Badge>
                      </Flex>
                      <p style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        At ingestion time, pass the full document and candidate chunk to a fast LLM. The LLM generates a 50-80 token situational preface explaining where the chunk sits in the overall document.
                      </p>

                      <div style={{ background: '#090d16', padding: '12px', borderRadius: '6px', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: '#a855f7', fontWeight: 'bold', marginBottom: '4px' }}>
                          PROMPT TEMPLATE:
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#cbd5e1' }}>
                          {`<document>
{full_document}
</document>
Here is the chunk:
<chunk>
{chunk_text}
</chunk>
Give a short 1-2 sentence context to situate this chunk for search.`}
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', color: '#34d399' }}>
                        ✓ <strong>Result:</strong> Boosts BM25 lexical keyword matching (+35% MRR) by turning ambiguous pronouns into explicit entity names.
                      </div>
                    </Stack>
                  </Card>

                  {/* Late Chunking Deep-Dive */}
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '4px solid #38bdf8' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <strong style={{ fontSize: '14px', color: '#38bdf8' }}>
                          ⏳ Jina Late Chunking
                        </strong>
                        <Badge variant="subtle" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', fontSize: '10px' }}>
                          Attention Pooling
                        </Badge>
                      </Flex>
                      <p style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Instead of slicing the text into isolated chunks first, feed the entire 8,192 token document through a long-context transformer backbone. Then mean-pool token embeddings within each chunk span.
                      </p>

                      <div style={{ background: '#090d16', padding: '12px', borderRadius: '6px', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '4px' }}>
                          TRANSFORMER POOLING MECHANISM:
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#cbd5e1' }}>
                          {`Token_Embeddings = Model(Full_Document_8k)
For span [start_idx, end_idx]:
   Chunk_Vector = Mean(Token_Embeddings[start:end])
   Chunk_Vector = L2_Normalize(Chunk_Vector)`}
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', color: '#34d399' }}>
                        ✓ <strong>Result:</strong> Zero LLM generation cost at ingestion. Each chunk vector natively retains full-document cross-attention references.
                      </div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            SUBTAB 5: SIZING & COST CALCULATOR (OPTIMIZER)
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'optimizer' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 RAG Chunk Size, Overlap &amp; Cost Optimizer</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Calculate optimal chunk token sizes, recommended sliding overlap percentages, storage footprint, and embedding costs based on your document volume and LLM context window.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '6px' }}>
                      LLM CONTEXT WINDOW:
                    </div>
                    <select
                      value={calcContextWindow}
                      onChange={e => setCalcContextWindow(Number(e.target.value))}
                      style={{ width: '100%', background: '#090d16', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    >
                      <option value="8192">8k Tokens (GPT-4 / Legacy)</option>
                      <option value="32768">32k Tokens (Standard Cloud)</option>
                      <option value="131072">128k Tokens (GPT-4o / Claude 3)</option>
                      <option value="1048576">1M Tokens (Gemini 1.5 Pro)</option>
                    </select>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '6px' }}>
                      QUERY SPECIFICITY:
                    </div>
                    <select
                      value={calcQueryType}
                      onChange={e => setCalcQueryType(e.target.value)}
                      style={{ width: '100%', background: '#090d16', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    >
                      <option value="targeted">Targeted Factoid (Specific clauses, error codes)</option>
                      <option value="broad">Broad Synthesis (Summaries, cross-document analysis)</option>
                    </select>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>DOC VOLUME:</span>
                      <span style={{ color: 'white', fontWeight: 'bold' }}>{calcDocVolume.toLocaleString()} pages</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="10000"
                      value={calcDocVolume}
                      onChange={e => setCalcDocVolume(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#38bdf8' }}
                    />
                  </Card>
                </Grid>

                {/* Sizing Calculations Scorecard */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  background: '#090d16',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--ds-color-border-subtle)'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>RECOMMENDED CHUNK SIZE</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>{recommendedChunkTokens} tokens</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>~{Math.round(recommendedChunkTokens * 0.75)} words</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>OPTIMAL SLIDING OVERLAP</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>{recommendedOverlapTokens} tokens</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>12% overlap boundary</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>ESTIMATED VECTOR COUNT</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{totalChunksEst.toLocaleString()} vectors</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>Index RAM: {embeddingStorageMB} MB</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)' }}>EMBEDDING API INGESTION</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>${monthlyCostEst}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>@ $0.02 / 1M tokens</div>
                  </div>
                </div>

                <Callout type="success" title="Engineering Sizing Rule of Thumb:">
                  <span style={{ fontSize: '12px' }}>
                    Always set chunk size to fit exactly 1 coherent thought or table (256-512 tokens). Apply a sliding overlap of <strong>O = min(0.15 × C, 100 tokens)</strong> to prevent edge-boundary data severing.
                  </span>
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            SUBTAB 6: SPEED VS QUALITY VS COST MATRIX
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'matrix' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 Comprehensive Speed vs Quality vs Cost Tradeoff Matrix</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Comparative analysis across all 8 chunking paradigms. Balance ingestion latency, storage multiplier, and downstream retrieval accuracy.
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#38bdf8' }}>Strategy</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>Ingest Speed</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>Recall Quality</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>Storage</th>
                        <th style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>Cost</th>
                        <th style={{ padding: '10px', textAlign: 'left', color: '#94a3b8' }}>Best Production Use Case</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHUNKING_COMPARISON_TABLE.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                          <td style={{ padding: '10px', color: 'white', fontWeight: 'bold' }}>{row.strategy}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: row.speed.includes('1x') ? '#10b981' : row.speed.includes('2x') || row.speed.includes('4x') ? '#f59e0b' : '#ef4444' }}>
                            {row.speed}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center', color: Number(row.quality.replace('%','')) > 85 ? '#10b981' : Number(row.quality.replace('%','')) > 60 ? '#38bdf8' : '#ef4444', fontWeight: 'bold' }}>
                            {row.quality}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{row.storage}</td>
                          <td style={{ padding: '10px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{row.cost}</td>
                          <td style={{ padding: '10px', color: 'var(--ds-color-text-secondary)' }}>{row.best}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Callout type="success">
                  <strong>Enterprise Recommendation:</strong> For general production RAG, use <strong>Parent-Child (Hierarchical)</strong> chunking as your default. Add <strong>Anthropic Contextual Retrieval</strong> for ambiguous queries or legal search where precision above 90% is mandatory.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════
            SUBTAB 7: PRODUCTION PYTHON CODE IMPLEMENTATIONS
           ═══════════════════════════════════════════════════════════════════════ */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💻 Production Python Chunking Implementations</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Clean, tested, copy-paste ready implementations for Recursive Character Splitting, Decoupled Parent-Child Hierarchies, Anthropic Contextual Retrieval, and Native Jina Late Chunking.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_CHUNKING_CODE} />

                <Callout type="success">
                  <strong>Responsible AI &amp; Enterprise Security:</strong> 100% compliant mock data. Zero third-party telemetry or unredacted PII.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
