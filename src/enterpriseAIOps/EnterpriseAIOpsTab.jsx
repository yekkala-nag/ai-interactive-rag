import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  ENTERPRISE_PILLARS,
  SAMPLE_ENTERPRISE_DATASETS,
  RUN_RAG_PIPELINE_SIMULATION,
  PRESET_ROUTER_PROMPTS,
  RUN_DYNAMIC_ROUTER_SIMULATION,
  RUN_MAP_REDUCE_SIMULATION,
  CALCULATE_ENTERPRISE_SAVINGS
} from './enterpriseAIOpsEngine.js';
import {
  AdvancedRAGPipelineDiagram,
  MapReducePatternDiagram,
  DynamicModelRoutingDiagram
} from './EnterpriseDiagrams.jsx';

const { Container, Grid, Flex, Stack } = Primitives;

export default function EnterpriseAIOpsTab() {
  const [activeSubTab, setActiveSubTab] = useState('framework'); 
  // 'framework' | 'pipeline' | 'mapreduce' | 'router' | 'calculator' | 'code'

  // Subtab 2: Pipeline Simulator State
  const [selectedDatasetId, setSelectedDatasetId] = useState('legal_msa');
  const [isCacheHit, setIsCacheHit] = useState(false);
  const [topKCount, setTopKCount] = useState(3);
  const [compressionRatio, setCompressionRatio] = useState(60);

  const ragSimResult = RUN_RAG_PIPELINE_SIMULATION(selectedDatasetId, isCacheHit, topKCount, compressionRatio);

  // Subtab 3: Map-Reduce Simulator State
  const [partitionCount, setPartitionCount] = useState(4);
  const mapReduceResult = RUN_MAP_REDUCE_SIMULATION(partitionCount);

  // Subtab 4: Router Simulator State
  const [selectedPromptId, setSelectedPromptId] = useState('p1');
  const routerResult = RUN_DYNAMIC_ROUTER_SIMULATION(selectedPromptId);

  // Subtab 5: FinOps Calculator State
  const [monthlyRequests, setMonthlyRequests] = useState(500000);
  const [avgRawTokens, setAvgRawTokens] = useState(45000);
  const [cacheHitRate, setCacheHitRate] = useState(38);
  const [smallModelRouteRate, setSmallModelRouteRate] = useState(65);

  const finops = CALCULATE_ENTERPRISE_SAVINGS(monthlyRequests, avgRawTokens, cacheHitRate, smallModelRouteRate);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Operations [Enterprise AI Architecture & Token Governance]"
        title="Enterprise AI Architecture & Operations: Beating Token Limits at Scale"
        description="When token limits and latency bottlenecks threaten enterprise AI delivery, the solution shifts from individual prompt engineering to systematic AI architecture and operations. Explore organizational frameworks for AI Gateways, Tier-1 Semantic Caching, Dynamic Model Cascades, Multi-Stage RAG compression, and Map-Reduce document operations."
        metrics={[
          { label: 'Token Reduction', value: '85% - 95% Across Org' },
          { label: 'Annual Cost Savings', value: '$1.2M+ on High Volume' },
          { label: 'Architecture', value: 'Semantic Cache + RAG + Router' },
          { label: 'Processing Pattern', value: 'Parallel Map-Reduce & Cascades' }
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
            { id: 'framework', icon: '🏛️', label: '1. Strategy Framework', desc: '4 pillars of enterprise token governance' },
            { id: 'pipeline', icon: '⚡', label: '2. Advanced RAG & Token Pipeline', desc: 'Live workflow & token compression simulation' },
            { id: 'mapreduce', icon: '📑', label: '3. Map-Reduce Operations', desc: 'Live parallel document worker simulation' },
            { id: 'router', icon: '🔀', label: '4. Dynamic Model Routing', desc: 'Live complexity classifier & cascade simulator' },
            { id: 'calculator', icon: '💰', label: '5. Token FinOps Calculator', desc: 'ROI, annual cost & quota modeling' },
            { id: 'code', icon: '🛠️', label: '6. AI Gateway & Python Code', desc: 'LiteLLM, semantic cache & scripts' }
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
                background: activeSubTab === tab.id ? 'var(--ds-color-module-frontiers-primary, #10b981)' : 'transparent',
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

        {/* ─── SUBTAB 1: STRATEGY FRAMEWORK ─── */}
        {activeSubTab === 'framework' && (
          <Stack gap={6}>
            <Callout variant="info">
              <strong>Enterprise Token Governance Shift:</strong> Moving from ad-hoc prompt tweaks to platform-level infrastructure. Managing token constraints at an organizational level requires standardizing gateway policies, enforcing multi-tier semantic caching, implementing smart routing cascades, and decoupling big document processing from synchronous web requests.
            </Callout>

            <Grid cols={2} gap={4}>
              {ENTERPRISE_PILLARS.map(pillar => (
                <Card key={pillar.id} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                  <Stack gap={3}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '24px' }}>{pillar.icon}</span>
                        <h4 style={{ margin: 0, fontSize: '16px' }}>{pillar.title}</h4>
                      </div>
                      <Badge variant="success">{pillar.metrics.savings}</Badge>
                    </div>

                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ds-color-text-secondary)' }}>
                      {pillar.summary}
                    </p>

                    <div style={{ background: '#090d16', padding: '12px', borderRadius: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginBottom: '6px' }}>
                        KEY ARCHITECTURAL MECHANISMS:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        {pillar.mechanisms.map((mech, i) => (
                          <li key={i}>{mech}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      <span><strong>Latency:</strong> {pillar.metrics.latency}</span>
                      <span>•</span>
                      <span><strong>Operational Risk:</strong> {pillar.metrics.risk}</span>
                    </div>
                  </Stack>
                </Card>
              ))}
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h4 style={{ margin: '0 0 12px 0' }}>📋 Enterprise AI Token Governance Maturity Model</h4>
              <div style={{ overflowX: 'auto', background: '#090d16', padding: '14px', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'monospace' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#10b981' }}>Maturity Level</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#10b981' }}>Architecture Pattern</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#10b981' }}>Token Efficiency</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#10b981' }}>Cost / 1M Requests</th>
                      <th style={{ textAlign: 'left', padding: '8px', color: '#10b981' }}>Organizational Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '8px', color: '#ef4444' }}>Level 1: Ad-Hoc</td>
                      <td style={{ padding: '8px' }}>Direct API calls, raw document prompting</td>
                      <td style={{ padding: '8px' }}>0% (Full context overflow)</td>
                      <td style={{ padding: '8px' }}>$15,000 - $35,000</td>
                      <td style={{ padding: '8px', color: '#ef4444' }}>Severe Budget Spikes, Lost in the Middle</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '8px', color: '#f59e0b' }}>Level 2: Basic RAG</td>
                      <td style={{ padding: '8px' }}>Fixed chunking (1000 tok) + vector DB</td>
                      <td style={{ padding: '8px' }}>60% reduction</td>
                      <td style={{ padding: '8px' }}>$6,000 - $12,000</td>
                      <td style={{ padding: '8px' }}>Chunk truncation, irrelevant context noise</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '8px', color: '#3b82f6' }}>Level 3: Multi-Stage</td>
                      <td style={{ padding: '8px' }}>Hybrid search + Reranking + LLMLingua</td>
                      <td style={{ padding: '8px' }}>85% reduction</td>
                      <td style={{ padding: '8px' }}>$2,200 - $4,500</td>
                      <td style={{ padding: '8px' }}>Low (High precision grounded answers)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px', color: '#10b981' }}>Level 4: Enterprise Ops</td>
                      <td style={{ padding: '8px' }}>AI Gateway + Semantic Cache + Router + Map-Reduce</td>
                      <td style={{ padding: '8px', color: '#10b981', fontWeight: 'bold' }}>94%+ reduction</td>
                      <td style={{ padding: '8px', color: '#10b981', fontWeight: 'bold' }}>$650 - $1,400</td>
                      <td style={{ padding: '8px', color: '#10b981' }}>Minimal (Guaranteed SLAs & Cost Predictability)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: ADVANCED RAG & TOKEN PIPELINE (LIVE SIMULATION) ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            {/* Visual Diagram */}
            <AdvancedRAGPipelineDiagram />

            {/* LIVE SIMULATION CONTROLS */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Live RAG & Token Optimization Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Simulate how real-world enterprise documents are processed through Semantic Cache ➔ Hybrid Search ➔ Cross-Encoder Reranker ➔ LLMLingua.
                  </p>
                </div>
                <Badge variant={ragSimResult.status === 'CACHE_HIT' ? 'success' : 'primary'}>
                  {ragSimResult.stage}
                </Badge>
              </div>

              <Grid cols={3} gap={4} style={{ marginBottom: '20px' }}>
                {/* Control 1: Dataset Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#38bdf8' }}>
                    1. Select Enterprise Corpus:
                  </label>
                  <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', color: 'white', borderRadius: '6px' }}
                  >
                    {SAMPLE_ENTERPRISE_DATASETS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.rawTokens.toLocaleString()} tokens)</option>
                    ))}
                  </select>
                </div>

                {/* Control 2: Semantic Cache Toggle */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '6px', color: '#f59e0b' }}>
                    2. Tier-1 Semantic Cache:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setIsCacheHit(false)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: !isCacheHit ? '1px solid #10b981' : '1px solid var(--ds-color-border-subtle)',
                        background: !isCacheHit ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                        color: !isCacheHit ? '#10b981' : 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Miss (Full Pipeline)
                    </button>
                    <button
                      onClick={() => setIsCacheHit(true)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '6px',
                        border: isCacheHit ? '1px solid #10b981' : '1px solid var(--ds-color-border-subtle)',
                        background: isCacheHit ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                        color: isCacheHit ? '#10b981' : 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Hit (Instant 12ms)
                    </button>
                  </div>
                </div>

                {/* Control 3: Reranker Top-K & Compression */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', color: '#a855f7' }}>Rerank Top-K Chunks: {topKCount}</span>
                    <span style={{ color: '#10b981' }}>Compress: {compressionRatio}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={topKCount}
                    onChange={(e) => setTopKCount(Number(e.target.value))}
                    disabled={isCacheHit}
                    style={{ width: '100%', accentColor: '#a855f7', opacity: isCacheHit ? 0.3 : 1 }}
                  />
                </div>
              </Grid>

              {/* LIVE SIMULATION TELEMETRY */}
              <div style={{ background: '#090d16', borderRadius: '8px', padding: '18px', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8' }}>
                    📊 Live Execution Telemetry & Cost Meter
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                    <span><strong>Total Token Reduction:</strong> <span style={{ color: '#10b981', fontWeight: 'bold' }}>{ragSimResult.tokenReductionPct}%</span></span>
                    <span><strong>End-to-End Latency:</strong> <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{ragSimResult.latencyMs}ms</span></span>
                    <span><strong>Inference Cost:</strong> <span style={{ color: '#a855f7', fontWeight: 'bold' }}>${ragSimResult.costUsd}</span></span>
                  </div>
                </div>

                {/* STEP-BY-STEP TRACE */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {ragSimResult.traceSteps.map((t, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '4px', fontSize: '12px' }}>
                      <div style={{ color: '#cbd5e1' }}>
                        <strong style={{ color: '#10b981' }}>{idx + 1}. {t.node}:</strong> {t.detail}
                      </div>
                      <span style={{ color: '#64748b', fontFamily: 'monospace' }}>{t.time}</span>
                    </div>
                  ))}
                </div>

                {/* GROUNDED OUTPUT */}
                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #10b981', borderRadius: '6px', padding: '14px' }}>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                    🎯 GENERATED GROUNDED ANSWER:
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.6' }}>
                    {ragSimResult.response}
                  </div>
                </div>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: MAP-REDUCE OPERATIONS (LIVE SIMULATION) ─── */}
        {activeSubTab === 'mapreduce' && (
          <Stack gap={6}>
            {/* Visual Diagram */}
            <MapReducePatternDiagram />

            {/* LIVE SIMULATION CONTROLS */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0 }}>📑 Live Parallel Map-Reduce Worker Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Observe how a 280,000 token corporate agreement is partitioned across concurrent SLM map workers and synthesized in a single master reduce call.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Partitions:</span>
                  {[2, 3, 4, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setPartitionCount(num)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: partitionCount === num ? '1px solid #10b981' : '1px solid var(--ds-color-border-subtle)',
                        background: partitionCount === num ? '#10b981' : '#090d16',
                        color: partitionCount === num ? '#000' : 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}
                    >
                      {num}x Workers
                    </button>
                  ))}
                </div>
              </div>

              {/* MAP WORKERS GRID */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '8px' }}>
                  PARALLEL MAP PHASE WORKERS ({partitionCount} Concurrent SLM Instances):
                </div>
                <Grid cols={2} gap={3}>
                  {mapReduceResult.partitions.map(p => (
                    <div key={p.partitionId} style={{ background: '#090d16', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '6px', padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 'bold', color: '#f8fafc' }}>{p.title}</span>
                        <Badge variant="neutral">{p.tokenCount.toLocaleString()} tokens</Badge>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                        <div><strong>Worker:</strong> {p.workerModel}</div>
                        <div style={{ color: '#10b981', marginTop: '2px' }}><strong>Extracted:</strong> {p.extractedJson.extractedKeyFact}</div>
                      </div>
                    </div>
                  ))}
                </Grid>
              </div>

              {/* MASTER REDUCE SYNTHESIS */}
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
                    MASTER REDUCE SYNTHESIS PHASE ({mapReduceResult.reduceSynthesis.reducerModel})
                  </div>
                  <Badge variant="success">Input to Master: {mapReduceResult.reduceSynthesis.inputTokensToReducer} tokens (99.4% Compression)</Badge>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#f1f5f9', lineHeight: '1.6' }}>
                  {mapReduceResult.reduceSynthesis.summary}
                </p>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  <strong>Risk Assessment:</strong> <span style={{ color: '#f59e0b' }}>{mapReduceResult.reduceSynthesis.overallRisk}</span> • Full 280,000 token corpus analyzed with zero token overflow.
                </div>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: DYNAMIC MODEL ROUTING (LIVE SIMULATION) ─── */}
        {activeSubTab === 'router' && (
          <Stack gap={6}>
            {/* Visual Diagram */}
            <DynamicModelRoutingDiagram />

            {/* LIVE SIMULATION CONTROLS */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>🔀 Live Dynamic Model Complexity Router</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Test how the AI router classifies query difficulty and dynamically directs traffic to Small Fast SLMs vs Large Frontier Reasoning Models.
              </p>

              {/* PROMPT SELECTOR */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                {PRESET_ROUTER_PROMPTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPromptId(p.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '6px',
                      border: selectedPromptId === p.id ? '1px solid #10b981' : '1px solid var(--ds-color-border-subtle)',
                      background: selectedPromptId === p.id ? 'rgba(16, 185, 129, 0.15)' : 'var(--ds-color-bg-surface)',
                      color: 'var(--ds-color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: selectedPromptId === p.id ? '#10b981' : '#f8fafc' }}>
                        {p.label}
                      </span>
                      <Badge variant={p.complexity < 0.5 ? 'success' : 'primary'}>
                        Complexity: {p.complexity}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                      "{p.prompt}"
                    </div>
                  </button>
                ))}
              </div>

              {/* ROUTER DECISION TRACE */}
              <div style={{ background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '18px' }}>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '12px' }}>
                  ROUTING DECISION ENGINE TRACE:
                </div>

                <Grid cols={2} gap={4} style={{ marginBottom: '14px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>ROUTED MODEL TARGET</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: routerResult.isHighComplexity ? '#a855f7' : '#10b981', marginTop: '2px' }}>
                      {routerResult.targetModel}
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                      Latency: <strong>{routerResult.latency}</strong> | Cost: <strong>{routerResult.cost}</strong>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>FINOPS SAVINGS vs DIRECT FRONTIER</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#38bdf8', marginTop: '2px' }}>
                      {routerResult.savingsPct}
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                      Baseline Frontier Cost: <del style={{ color: '#ef4444' }}>{routerResult.baselineCost}</del>
                    </div>
                  </div>
                </Grid>

                <div style={{ fontSize: '12px', color: '#e2e8f0', background: 'rgba(56, 189, 248, 0.08)', padding: '10px 14px', borderRadius: '4px', borderLeft: '3px solid #38bdf8' }}>
                  <strong>Classification Rational:</strong> {routerResult.classificationReason}
                </div>
              </div>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: TOKEN FINOPS CALCULATOR ─── */}
        {activeSubTab === 'calculator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>💰 Enterprise AI Token FinOps & ROI Calculator</h3>
              <p style={{ margin: '0 0 20px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Calculate monthly and annual cost savings when implementing Tier-1 Semantic Caching, Multi-Stage RAG context compression, and SLM Model Routing across organizational workloads.
              </p>

              <Grid cols={2} gap={4}>
                {/* SLIDERS */}
                <Stack gap={4}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Monthly Inbound AI Requests:</span>
                      <strong style={{ color: '#10b981' }}>{monthlyRequests.toLocaleString()} reqs</strong>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="50000"
                      value={monthlyRequests}
                      onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#10b981' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Avg Raw Document Tokens per Request:</span>
                      <strong style={{ color: '#38bdf8' }}>{avgRawTokens.toLocaleString()} tokens</strong>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="150000"
                      step="5000"
                      value={avgRawTokens}
                      onChange={(e) => setAvgRawTokens(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#38bdf8' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Tier-1 Semantic Cache Hit Rate:</span>
                      <strong style={{ color: '#f59e0b' }}>{cacheHitRate}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="80"
                      step="2"
                      value={cacheHitRate}
                      onChange={(e) => setCacheHitRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>Small/Fast Model Routing Ratio:</span>
                      <strong style={{ color: '#a855f7' }}>{smallModelRouteRate}%</strong>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="95"
                      step="5"
                      value={smallModelRouteRate}
                      onChange={(e) => setSmallModelRouteRate(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#a855f7' }}
                    />
                  </div>
                </Stack>

                {/* RESULTS CARD */}
                <div style={{ background: '#090d16', border: '1px solid #10b981', borderRadius: '8px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    FINANCIAL IMPACT SUMMARY
                  </div>

                  <div style={{ marginTop: '14px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>ESTIMATED ANNUAL ORGANIZATIONAL SAVINGS</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{finops.annualSavings}</div>
                    <div style={{ fontSize: '13px', color: '#38bdf8' }}>{finops.savingsPercent}% Total Token Spend Reduction</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#ef4444' }}>Baseline Monthly Cost (Raw Frontier):</span>
                      <strong>{finops.baselineMonthlyCost}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#10b981' }}>Optimized Architecture Monthly Cost:</span>
                      <strong>{finops.optimizedMonthlyCost}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#f59e0b' }}>Net Monthly Cash Savings:</span>
                      <strong>{finops.monthlySavings}</strong>
                    </div>
                  </div>
                </div>
              </Grid>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 6: CODE & CONFIG ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>🛠️ Production AI Gateway & Semantic Caching Implementation</h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Production Python pipeline implementing Redis semantic vector caching, LiteLLM proxy failover, and Map-Reduce document partitioning.
              </p>

              <CodeBlock
                language="python"
                code={`import os
import redis
from qdrant_client import QdrantClient
from litellm import completion

# 1. Initialize Centralized AI Gateway & Semantic Cache
qdrant = QdrantClient(host="qdrant.internal", port=6333)
redis_client = redis.Redis(host="redis.internal", port=6379, db=0)

def query_enterprise_ai_gateway(user_prompt: str, document_chunks: list[str]) -> str:
    """
    Enterprise AI Gateway Handler with Semantic Caching and Model Routing
    """
    # Step A: Tier-1 Semantic Cache Lookup
    prompt_embedding = get_embedding(user_prompt)
    cache_hit = qdrant.search(
        collection_name="semantic_prompt_cache",
        query_vector=prompt_embedding,
        limit=1,
        score_threshold=0.94  # Cosine similarity threshold
    )
    if cache_hit:
        return f"[CACHE HIT (0ms)] {cache_hit[0].payload['response']}"

    # Step B: Dynamic Model Complexity Router
    complexity_score = evaluate_query_complexity(user_prompt)
    if complexity_score < 0.35:
        target_model = "bedrock/anthropic.claude-3-haiku-20240307-v1:0"
    else:
        target_model = "azure/gpt-4o"

    # Step C: Multi-Stage Token Compression & Inference
    compressed_context = compress_tokens_llmlingua(document_chunks, target_ratio=0.4)
    
    response = completion(
        model=target_model,
        messages=[
            {"role": "system", "content": "You are an enterprise AI compliance auditor."},
            {"role": "user", "content": f"Context: {compressed_context}\\n\\nQuery: {user_prompt}"}
        ],
        temperature=0.0
    )
    
    answer = response.choices[0].message.content
    
    # Store in Semantic Cache
    store_semantic_cache(user_prompt, prompt_embedding, answer)
    return answer`}
              />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
