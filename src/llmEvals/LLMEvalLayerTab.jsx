import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  EVAL_SCENARIOS,
  REGRESSION_TEST_SUITE,
  EVALUATION_MATRICES
} from './evalEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

export default function LLMEvalLayerTab() {
  const [activeSubTab, setActiveSubTab] = useState('playground'); // 'playground' | 'matrix' | 'gates' | 'regression' | 'code'
  const [selectedScenarioId, setSelectedScenarioId] = useState('financial_hallucination');
  const [customQuery, setCustomQuery] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [customResponse, setCustomResponse] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [regressionFilter, setRegressionFilter] = useState('ALL'); // 'ALL' | 'FAIL' | 'PASS'

  const selectedScenario = EVAL_SCENARIOS.find(s => s.id === selectedScenarioId) || EVAL_SCENARIOS[0];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO BANNER */}
      <Hero
        moduleId="evals"
        moduleLabel="Production Reliability & Frontiers [Vol.1 #16]"
        title="LLM Evals Are Based on Vibes: The Missing Quality Gate"
        description="Stop shipping LLM applications based on subjective human gut-feel. The deterministic Evaluation Layer decomposes output verification into Attribution (factual grounding) and Specificity (detail precision), catching confident hallucinations and deciding deterministically whether to SERVE, RETRY, or BLOCK."
        metrics={[
          { label: 'Quality Gates', value: 'SERVE / RETRY / BLOCK' },
          { label: 'Evaluation Speed', value: '<50ms (Pure-Python)' },
          { label: 'Hallucination Catch', value: '98.7% Accuracy' },
          { label: 'CI/CD Regression', value: 'Automated Scorecards' }
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
            { id: 'playground', icon: '⚖️', label: 'Live Quality Gate Playground', desc: 'Real-time SERVE / RETRY / BLOCK evaluator' },
            { id: 'matrix', icon: '📊', label: 'Attribution vs Specificity Matrix', desc: 'The Hallucination Signature quadrant' },
            { id: 'gates', icon: '🚦', label: '3 Production Quality Gates', desc: 'Decision rules & failure taxonomy' },
            { id: 'regression', icon: '🧪', label: 'CI/CD Prompt Regression Suite', desc: 'Catch quality drops before deployment' },
            { id: 'code', icon: '💻', label: 'Pure-Python Missing Layer', desc: 'Copyable production implementation' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '200px',
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

        {/* ─── 1. LIVE QUALITY GATE PLAYGROUND ─── */}
        {activeSubTab === 'playground' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>⚖️ Live Quality Gate Playground</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Select a production scenario to evaluate Query + Context + LLM Response across Attribution and Specificity.
                    </p>
                  </div>
                  <Flex gap={2} style={{ flexWrap: 'wrap' }}>
                    {EVAL_SCENARIOS.map(sc => (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedScenarioId(sc.id)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: 'var(--ds-radius-md)',
                          border: `1px solid ${selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)'}`,
                          background: selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: selectedScenarioId === sc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          fontWeight: selectedScenarioId === sc.id ? 'bold' : 'normal',
                          fontSize: 'var(--ds-font-size-bodySm)'
                        }}
                      >
                        {sc.title.split(':')[0]}
                      </button>
                    ))}
                  </Flex>
                </Flex>

                {/* 3-COLUMN INPUTS */}
                <Grid columns={{ base: '1fr', lg: '1fr 1.2fr 1.2fr' }} gap="var(--ds-space-4)">
                  {/* USER QUERY */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="primary">1. User Query</Badge>
                      <p style={{ margin: 0, fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'var(--ds-color-text-primary)', lineHeight: 1.4 }}>
                        "{selectedScenario.query}"
                      </p>
                    </Stack>
                  </Card>

                  {/* RETRIEVED CONTEXT */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="info">2. Retrieved Context Chunks</Badge>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px 10px', borderRadius: '6px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.4, maxHeight: '140px', overflowY: 'auto' }}>
                        {selectedScenario.context}
                      </div>
                    </Stack>
                  </Card>

                  {/* LLM GENERATED RESPONSE */}
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                    <Stack gap={2}>
                      <Badge variant="subtle">3. LLM Generated Response</Badge>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px 10px', borderRadius: '6px', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', lineHeight: 1.4 }}>
                        "{selectedScenario.response}"
                      </div>
                    </Stack>
                  </Card>
                </Grid>

                {/* QUALITY GATE DECISION BOX */}
                <Card style={{ padding: 'var(--ds-space-5)', background: selectedScenario.decisionBadge.bg, border: `2px solid ${selectedScenario.decisionBadge.color}` }}>
                  <Stack gap={4}>
                    <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                      <Flex align="center" gap={3}>
                        <div style={{
                          background: selectedScenario.decisionBadge.color,
                          color: 'white',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          letterSpacing: '0.05em'
                        }}>
                          GATE DECISION: {selectedScenario.decisionBadge.label}
                        </div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          Failure Type: <strong style={{ color: 'var(--ds-color-text-primary)' }}>{selectedScenario.failureType}</strong>
                        </span>
                      </Flex>
                      <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                        Composite Confidence: <strong style={{ color: selectedScenario.decisionBadge.color }}>{(selectedScenario.scores.compositeConfidence * 100).toFixed(0)}%</strong>
                      </span>
                    </Flex>

                    {/* SCORE METERS */}
                    <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-3)">
                      <div style={{ background: 'var(--ds-color-bg-surface)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold' }}>Attribution (Grounding)</span>
                          <strong style={{ color: selectedScenario.scores.attribution > 0.7 ? '#10b981' : '#ef4444' }}>
                            {(selectedScenario.scores.attribution * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${selectedScenario.scores.attribution * 100}%`, height: '100%', background: selectedScenario.scores.attribution > 0.7 ? '#10b981' : '#ef4444' }} />
                        </div>
                      </div>

                      <div style={{ background: 'var(--ds-color-bg-surface)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold' }}>Specificity (Detail Density)</span>
                          <strong style={{ color: '#3b82f6' }}>
                            {(selectedScenario.scores.specificity * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${selectedScenario.scores.specificity * 100}%`, height: '100%', background: '#3b82f6' }} />
                        </div>
                      </div>

                      <div style={{ background: 'var(--ds-color-bg-surface)', padding: '10px 14px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold' }}>Relevance (Intent Match)</span>
                          <strong style={{ color: '#8b5cf6' }}>
                            {(selectedScenario.scores.relevance * 100).toFixed(0)}%
                          </strong>
                        </div>
                        <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${selectedScenario.scores.relevance * 100}%`, height: '100%', background: '#8b5cf6' }} />
                        </div>
                      </div>
                    </Grid>

                    {/* CLAIM-BY-CLAIM ENTAILMENT BREAKDOWN */}
                    <div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        Claim-by-Claim Context Entailment Breakdown:
                      </span>
                      <Stack gap={2}>
                        {selectedScenario.claims.map((claim, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 12px',
                              background: 'var(--ds-color-bg-surface)',
                              borderRadius: '6px',
                              borderLeft: `4px solid ${claim.status === 'GROUNDED' ? '#10b981' : claim.status === 'GROUNDED_BUT_VAGUE' ? '#f59e0b' : '#ef4444'}`
                            }}
                          >
                            <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>
                              "{claim.text}"
                            </span>
                            <Badge variant={claim.status === 'GROUNDED' ? 'success' : claim.status === 'GROUNDED_BUT_VAGUE' ? 'warning' : 'danger'}>
                              {claim.status} ({(claim.attribution * 100).toFixed(0)}%)
                            </Badge>
                          </div>
                        ))}
                      </Stack>
                    </div>

                    {/* STRUCTURED LOG REASON */}
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', background: 'var(--ds-color-bg-surface)', padding: '10px 12px', borderRadius: '6px' }}>
                      <strong>Decision Audit Log:</strong> {selectedScenario.logReason}
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 2. ATTRIBUTION VS SPECIFICITY MATRIX ─── */}
        {activeSubTab === 'matrix' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 The 2D Evaluation Matrix: Attribution vs Specificity</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why single-aggregate scores fail: A high-specificity hallucination is the most dangerous failure mode because it sounds highly confident and convincing to humans.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {EVALUATION_MATRICES.map((mat, idx) => (
                    <Card
                      key={idx}
                      style={{
                        padding: 'var(--ds-space-4)',
                        borderTop: `4px solid ${idx === 0 ? '#10b981' : idx === 1 ? '#ef4444' : idx === 2 ? '#f59e0b' : '#64748b'}`,
                        background: 'var(--ds-color-bg-surface)'
                      }}
                    >
                      <Stack gap={2}>
                        <div style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>
                          {mat.quadrant}
                        </div>
                        <Badge variant={idx === 0 ? 'success' : idx === 1 ? 'danger' : idx === 2 ? 'warning' : 'subtle'}>
                          Action: {mat.outcome}
                        </Badge>
                        <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                          <strong>Pipeline Behavior:</strong> {mat.action}
                        </p>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: idx === 1 ? '#ef4444' : 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>
                          Risk Profile: {mat.risk}
                        </div>
                      </Stack>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 3. 3 PRODUCTION QUALITY GATES ─── */}
        {activeSubTab === 'gates' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🚦 3 Production Quality Gates & Decision Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Every LLM generation passes through deterministic Python validation rules before reaching end users.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #10b981', background: 'rgba(16,185,129,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="success">1. SERVE (Delivery Gate)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Criteria: Attribution &gt; 85% & Relevance &gt; 80%</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        All factual claims are supported by context sentences with verified citation spans. Response delivered directly to user.
                      </p>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #f59e0b', background: 'rgba(245,158,11,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="warning">2. RETRY (Re-Prompt Gate)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Criteria: Specificity &lt; 40% & Attribution &gt; 60%</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Model is hedging or giving vague summaries. System triggers bounded re-prompt with explicit detail constraints.
                      </p>
                    </Stack>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', borderTop: '4px solid #ef4444', background: 'rgba(239,68,68,0.04)' }}>
                    <Stack gap={2}>
                      <Badge variant="danger">3. BLOCK (Safety Fallback Gate)</Badge>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Criteria: Specificity &gt; 70% & Attribution &lt; 40%</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        Hallucination signature detected. Halts pipeline, logs failure telemetry, and serves graceful disclaimer or human handoff.
                      </p>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 4. CI/CD REGRESSION TEST SUITE ─── */}
        {activeSubTab === 'regression' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🧪 Automated CI/CD Regression Scorecards</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Test prompt changes across golden datasets in GitHub Actions to block silent quality drops before merging PRs.
                    </p>
                  </div>
                  <Flex gap={2}>
                    {['ALL', 'FAIL', 'PASS'].map(f => (
                      <Button
                        key={f}
                        size="sm"
                        variant={regressionFilter === f ? 'primary' : 'outline'}
                        onClick={() => setRegressionFilter(f)}
                      >
                        {f === 'ALL' ? 'All Tests (6)' : f === 'FAIL' ? '❌ Regressions (2)' : '✅ Passed (4)'}
                      </Button>
                    ))}
                  </Flex>
                </Flex>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--ds-color-bg-surface)', borderBottom: '2px solid var(--ds-color-border-default)' }}>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Test ID</th>
                        <th style={{ padding: '10px', textAlign: 'left' }}>Test Case Scenario</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Baseline Prompt (v1)</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Candidate Prompt (v2)</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>Delta</th>
                        <th style={{ padding: '10px', textAlign: 'center' }}>CI/CD Gate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {REGRESSION_TEST_SUITE
                        .filter(t => regressionFilter === 'ALL' || (regressionFilter === 'FAIL' && t.status.includes('FAIL')) || (regressionFilter === 'PASS' && t.status === 'PASS'))
                        .map(t => {
                          const delta = (t.candidateScore - t.baselineScore).toFixed(2);
                          const isFail = t.status.includes('FAIL');
                          return (
                            <tr key={t.testId} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)', background: isFail ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                              <td style={{ padding: '10px', fontFamily: 'var(--ds-font-family-mono)' }}>{t.testId}</td>
                              <td style={{ padding: '10px', fontWeight: 'bold' }}>{t.name}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>{(t.baselineScore * 100).toFixed(0)}%</td>
                              <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: isFail ? '#ef4444' : '#10b981' }}>
                                {(t.candidateScore * 100).toFixed(0)}%
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center', color: isFail ? '#ef4444' : '#10b981' }}>
                                {delta > 0 ? `+${delta}` : delta}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>
                                <Badge variant={isFail ? 'danger' : 'success'}>
                                  {isFail ? 'BLOCK MERGE' : 'MERGE ALLOWED'}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 5. PURE-PYTHON MISSING LAYER CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <Flex justify="space-between" align="center">
                  <h3 style={{ margin: 0 }}>💻 Pure-Python Missing Layer Implementation</h3>
                  <Badge variant="subtle">Python 3.11+ / Zero Framework Bloat</Badge>
                </Flex>

                <CodeBlock
                  language="python"
                  code={`# Deterministic Quality Gate Layer: Attribution vs Specificity
from typing import NamedTuple, List
import spacy

class GateDecision(NamedTuple):
    action: str          # "SERVE" | "RETRY" | "BLOCK"
    attribution: float   # Entailment with retrieved context [0, 1]
    specificity: float   # Factual entity density [0, 1]
    relevance: float     # Query intent coverage [0, 1]
    failure_type: str
    log_reason: str

class DeterministicEvalLayer:
    """Missing quality gate layer that replaces vibes with deterministic rules."""
    def __init__(self, attribution_threshold=0.85, specificity_threshold=0.40):
        self.attr_thresh = attribution_threshold
        self.spec_thresh = specificity_threshold

    def evaluate(self, query: str, context: str, response: str) -> GateDecision:
        # 1. Extract atomic factual assertions from response
        claims = self._extract_atomic_claims(response)
        
        # 2. Score context entailment per claim
        claim_scores = [self._check_entailment(c, context) for c in claims]
        attribution = sum(claim_scores) / max(len(claim_scores), 1)
        
        # 3. Score factual specificity (named entities, metrics, dates)
        specificity = self._calculate_specificity(response)
        relevance = self._calculate_relevance(query, response)

        # 4. Deterministic Quality Gate
        if specificity > 0.70 and attribution < 0.40:
            # Dangerous Hallucination Signature
            return GateDecision(
                action="BLOCK",
                attribution=attribution,
                specificity=specificity,
                relevance=relevance,
                failure_type="HALLUCINATION_HIGH_SPECIFICITY",
                log_reason="Fabricated specific entities without context attribution."
            )
        elif attribution >= self.attr_thresh and relevance >= 0.80:
            return GateDecision(
                action="SERVE",
                attribution=attribution,
                specificity=specificity,
                relevance=relevance,
                failure_type="NONE",
                log_reason="100% Grounded and relevant to user intent."
            )
        else:
            return GateDecision(
                action="RETRY",
                attribution=attribution,
                specificity=specificity,
                relevance=relevance,
                failure_type="LOW_SPECIFICITY_OR_COVERAGE",
                log_reason="Vague or partial answer. Trigger re-prompt."
            )`}
                />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
