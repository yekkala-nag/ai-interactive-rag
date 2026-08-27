import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  MODEL_FAMILIES_TAXONOMY,
  EVALUATE_MODEL_SELECTION,
  PYTHON_LITELLM_ROUTING_SCRIPT
} from './landscapeEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function ModelLandscapeTab() {
  const [activeSubTab, setActiveSubTab] = useState('decision'); 
  // 'decision' | 'taxonomy' | 'slms' | 'reasoning' | 'code'

  // Decision Engine State
  const [privacy, setPrivacy] = useState('standard_cloud');
  const [budget, setBudget] = useState('balanced');
  const [task, setTask] = useState('standard_rag');
  const [latency, setLatency] = useState('standard_1s');

  const recommendation = EVALUATE_MODEL_SELECTION({
    privacyRequirement: privacy,
    budgetTier: budget,
    reasoningTask: task,
    targetLatency: latency
  });

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architecture [Foundation Model Landscape & Selection]"
        title="Foundation Model Landscape: Open, Closed, SLMs & Reasoning"
        description="Navigate the rapidly evolving ecosystem of Foundation Models. Compare Open-Weights vs Proprietary APIs, explore on-device Small Language Models (SLMs), master Test-Time Compute reasoning models (o1/DeepSeek-R1), and use the interactive decision engine to select the optimal model for your constraints."
        metrics={[
          { label: 'Frontier Tier', value: 'Claude 3.5 / GPT-4o / Gemini 2.0' },
          { label: 'Open-Weights Lead', value: 'DeepSeek-V3 / Llama 3.3 70B' },
          { label: 'Reasoning Paradigm', value: 'Test-Time Compute (o1 / R1)' },
          { label: 'Edge Footprint', value: '< 4 GB VRAM (Phi-4 / SmolLM)' }
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
            { id: 'decision', icon: '🎯', label: '1. Model Selection Engine', desc: 'Interactive constraint-based recommender' },
            { id: 'taxonomy', icon: '🏛️', label: '2. Complete Model Taxonomy', desc: 'Open vs Closed vs SLM landscape' },
            { id: 'slms', icon: '📱', label: '3. Small Models (SLMs) & Edge', desc: 'Phi-4, SmolLM & on-device AI' },
            { id: 'reasoning', icon: '🧠', label: '4. Reasoning (o1 / R1)', desc: 'Test-Time compute & pure RL' },
            { id: 'code', icon: '🛠️', label: '5. LiteLLM Routing Code', desc: 'Multi-provider fallback gateway' }
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

        {/* ─── SUBTAB 1: MODEL SELECTION DECISION ENGINE ─── */}
        {activeSubTab === 'decision' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎯 Interactive Model Selection Decision Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Input your enterprise constraints (Data privacy, budget, reasoning complexity, latency) to determine the ideal model tier and hosting topology.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Data Privacy Requirement:
                    </label>
                    <select
                      value={privacy}
                      onChange={e => setPrivacy(e.target.value)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value="standard_cloud">Standard Cloud API (SOC2 / Zero Retention)</option>
                      <option value="strict_onprem">Strict On-Premise / Air-Gapped Private VPC</option>
                      <option value="hipaa_compliance">Healthcare HIPAA Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Token Budget Tier:
                    </label>
                    <select
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value="ultra_low">Ultra-Low Cost (&lt; $0.50 / M tokens)</option>
                      <option value="balanced">Balanced Production ($1 - $3 / M tokens)</option>
                      <option value="flagship">Flagship / Maximum Quality ($10+ / M tokens)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Reasoning Complexity:
                    </label>
                    <select
                      value={task}
                      onChange={e => setTask(e.target.value)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value="simple_extraction">Simple Extraction & Classification</option>
                      <option value="standard_rag">Standard Enterprise Document RAG</option>
                      <option value="complex_coding">Complex Multi-File Code Synthesis</option>
                      <option value="math_proof">Multi-Step Mathematical Proof / Logic</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Target Latency (TTFT):
                    </label>
                    <select
                      value={latency}
                      onChange={e => setLatency(e.target.value)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value="realtime_sub300ms">Real-Time Voice (&lt; 300ms)</option>
                      <option value="standard_1s">Standard Interactive (~1 second)</option>
                      <option value="batch">Asynchronous Batch Workflow</option>
                    </select>
                  </div>
                </Grid>

                {/* RECOMMENDATION RESULT */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid #10b981' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '12px', color: '#10b981' }}>RECOMMENDED FOUNDATION MODEL:</strong>
                      <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)' }}>
                        OPTIMAL MATCH
                      </Badge>
                    </Flex>
                    <div style={{ fontSize: '15px', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                      {recommendation.recommendedModel}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                      HOSTING & DEPLOYMENT TOPOLOGY:
                    </div>
                    <div style={{ fontSize: '12px', color: '#38BDF8', fontFamily: 'monospace' }}>
                      {recommendation.hostingTopology}
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '12px', color: '#38BDF8' }}>ESTIMATED PRODUCTION COST:</strong>
                      <Badge variant="outline">{recommendation.estimatedCostPer10kCalls} / 10k calls</Badge>
                    </Flex>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0' }}>
                      {recommendation.rationale}
                    </p>
                    <div style={{ fontSize: '11px', color: '#F5A623' }}>
                      💡 <strong>Architectural Rule:</strong> Implement a Zero-Model Fast Router or FrugalGPT cascade to route 60%+ of queries to cheap models (Gemini Flash / Qwen 7B) and reserve flagship reasoning models strictly for complex failures.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: COMPLETE MODEL TAXONOMY ─── */}
        {activeSubTab === 'taxonomy' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏛️ 2026 Foundation Model Family Taxonomy</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Categorized overview of open-weights, proprietary cloud APIs, compact edge models, and test-time compute reasoning engines.
                  </p>
                </div>

                <Stack gap={4}>
                  {MODEL_FAMILIES_TAXONOMY.map((fam, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                      <strong style={{ fontSize: '13px', color: '#38BDF8', display: 'block', marginBottom: '2px' }}>
                        {fam.family}
                      </strong>
                      <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '0 0 10px 0' }}>
                        {fam.description}
                      </p>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                        {fam.models.map((m, i) => (
                          <Card key={i} style={{ padding: '12px', background: '#090d16', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold', marginBottom: '4px' }}>
                              {m.name}
                            </div>
                            <div style={{ fontSize: '10px', color: '#10b981', fontFamily: 'monospace', marginBottom: '6px' }}>
                              Context: {m.context} | Input: {m.inputCostPerM} | Output: {m.outputCostPerM}
                            </div>
                            <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                              {m.strengths}
                            </p>
                          </Card>
                        ))}
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: SMALL LANGUAGE MODELS (SLMS) ─── */}
        {activeSubTab === 'slms' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📱 The Rise of Small Language Models (SLMs) & On-Device AI</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why high-quality synthetic data (Textbooks Are All You Need) enabled 1B–8B parameter models to match previous-generation 70B models at 1/10th the inference compute.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #38BDF8' }}>
                    <strong style={{ fontSize: '12px', color: '#38BDF8' }}>1. Synthetic Data Filtering</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      Filtering raw web crawls to keep only clean educational explanations allows compact networks to learn dense world representations without memorizing web noise.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #10b981' }}>
                    <strong style={{ fontSize: '12px', color: '#10b981' }}>2. On-Device Privacy & Zero Latency</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      Runs locally on Apple Silicon (via MLX) or mobile phones (via ONNX/WebGPU) with zero internet dependency, zero API egress costs, and absolute data confidentiality.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #F5A623' }}>
                    <strong style={{ fontSize: '12px', color: '#F5A623' }}>3. Specialized Sub-Agent Workhorses</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      Ideal for lightweight task classification, query rewriting, JSON validation, and PII anonymization in multi-agent pipelines.
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: REASONING & THINKING MODELS ─── */}
        {activeSubTab === 'reasoning' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧠 Test-Time Compute & Pure RL Reasoning (o1 / DeepSeek-R1)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How the new paradigm of Test-Time Compute scaling trades inference tokens for superhuman accuracy on math, code, and formal verification.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8', display: 'block', marginBottom: '6px' }}>
                      PRE-TRAINING SCALING VS TEST-TIME COMPUTE:
                    </strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      Traditional LLMs scale capabilities by adding parameters and pre-training tokens. Reasoning models scale capabilities dynamically at inference time by generating internal Chain-of-Thought scratchpads, self-correcting mistakes before returning the final answer.
                    </p>
                    <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#10b981' }}>
                      More Thinking Tokens = Higher Accuracy on Hard Logic
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981', display: 'block', marginBottom: '6px' }}>
                      DEEPSEEK-R1 PURE REINFORCEMENT LEARNING:
                    </strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      Trained using Large-Scale Reinforcement Learning (RL) directly on base models with rule-based verifiable rewards (compiler pass/fail for code, exact match for math) without human Supervised Fine-Tuning (SFT) warm-starts.
                    </p>
                    <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#38BDF8' }}>
                      Emergent Behaviors: Self-Verification, Backtracking, Reflection
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PYTORCH & LITELLM CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Multi-Provider Model Routing Gateway</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Standardized LiteLLM routing architecture providing automatic provider fallbacks, latency-based load balancing, and budget caps.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_LITELLM_ROUTING_SCRIPT} />

                <Callout type="success">
                  <strong>High-Availability Architecture:</strong> Always configure fallback chains (e.g. Claude 3.5 -&gt; GPT-4o -&gt; Self-Hosted Llama 3.3) to protect your production application against single-provider cloud outages and HTTP 429 rate limits.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
