import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  SAMPLE_PROMPTS,
  DECODING_STRATEGIES,
  CALCULATE_SAMPLING_DISTRIBUTION,
  PYTHON_LOGITS_PROCESSOR_SCRIPT
} from './samplingEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function LLMSamplingTab() {
  const [activeSubTab, setActiveSubTab] = useState('simulator'); 
  // 'simulator' | 'strategies' | 'tracer' | 'math' | 'code'

  // Simulator State
  const [selectedPromptId, setSelectedPromptId] = useState('factual_code');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.90);
  const [minP, setMinP] = useState(0.05);
  const [repetitionPenalty, setRepetitionPenalty] = useState(1.0);
  const [isGreedy, setIsGreedy] = useState(false);

  // Tracer State
  const [tracerStep, setTracerStep] = useState(0);

  const activePrompt = SAMPLE_PROMPTS.find(p => p.id === selectedPromptId) || SAMPLE_PROMPTS[0];

  const distribution = CALCULATE_SAMPLING_DISTRIBUTION({
    rawCandidates: activePrompt.vocabCandidates,
    temperature,
    topK,
    topP,
    minP,
    repetitionPenalty,
    isGreedy
  });

  // Autoregressive steps for Tracer
  const tracerSteps = [
    {
      step: 1,
      inputContext: "The capital of France is",
      nextLogits: [
        { token: " Paris", prob: 0.94, selected: true },
        { token: " a", prob: 0.03, selected: false },
        { token: " known", prob: 0.01, selected: false },
        { token: " located", prob: 0.01, selected: false }
      ],
      explanation: "Step 1: The model computes self-attention over the 5 input tokens and projects the final hidden state to logits. 'Paris' dominates with 94% probability."
    },
    {
      step: 2,
      inputContext: "The capital of France is Paris",
      nextLogits: [
        { token: ",", prob: 0.72, selected: true },
        { token: ".", prob: 0.21, selected: false },
        { token: " which", prob: 0.05, selected: false },
        { token: " and", prob: 0.01, selected: false }
      ],
      explanation: "Step 2: 'Paris' is appended to the context. A new forward pass is executed (leveraging the KV cache for the previous 5 tokens). A comma is sampled."
    },
    {
      step: 3,
      inputContext: "The capital of France is Paris,",
      nextLogits: [
        { token: " which", prob: 0.65, selected: true },
        { token: " home", prob: 0.18, selected: false },
        { token: " known", prob: 0.12, selected: false },
        { token: " the", prob: 0.03, selected: false }
      ],
      explanation: "Step 3: Context now contains 7 tokens. The model attends to all previous tokens and predicts 'which' with 65% probability."
    },
    {
      step: 4,
      inputContext: "The capital of France is Paris, which",
      nextLogits: [
        { token: " is", prob: 0.88, selected: true },
        { token: " houses", prob: 0.07, selected: false },
        { token: " boasts", prob: 0.03, selected: false }
      ],
      explanation: "Step 4: Autoregressive token generation continues until the model emits an <|endoftext|> / </s> EOS token or hits max_new_tokens."
    }
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architecture [LLM Generation & Sampling Mechanics]"
        title="How LLMs Generate Text: Logits, Softmax & Sampling"
        description="Master the mathematics and mechanics behind autoregressive language model generation. Explore how raw neural network logits transform into probability distributions, and how Temperature, Top-K, Top-P (Nucleus), and Min-P govern the balance between precision and creativity."
        metrics={[
          { label: 'Core Mechanism', value: 'Autoregressive Next-Token' },
          { label: 'Sampling Methods', value: 'Greedy, Temp, Top-K, Top-P, Min-P' },
          { label: 'Logit Space', value: 'Unbounded Reals (\\mathbb{R})' },
          { label: 'Probability Space', value: '[0, 1] Summing to 1.0' }
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
            { id: 'simulator', icon: '🎛️', label: '1. Live Sampling Simulator', desc: 'Real-time probability mass reshaping' },
            { id: 'strategies', icon: '⚖️', label: '2. Decoding Strategies', desc: 'Greedy vs Top-P vs Min-P' },
            { id: 'tracer', icon: '🔍', label: '3. Autoregressive Tracer', desc: 'Step-by-step token generation loop' },
            { id: 'math', icon: '🧮', label: '4. Mathematical Formulas', desc: 'Softmax, logit scaling & cutoffs' },
            { id: 'code', icon: '🛠️', label: '5. PyTorch & vLLM Code', desc: 'Custom LogitsProcessor implementation' }
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

        {/* ─── SUBTAB 1: LIVE SAMPLING SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎛️ Real-Time Logits & Probability Mass Reshaper</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Adjust hyperparameters to see how the unnormalized logits from the Language Model Head (W_lm_head) get reshaped, truncated, and normalized into final token probabilities.
                  </p>
                </div>

                {/* SCENARIO PICKER */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SAMPLE_PROMPTS.map(p => (
                    <Button
                      key={p.id}
                      variant={selectedPromptId === p.id ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedPromptId(p.id)}
                    >
                      {p.title}
                    </Button>
                  ))}
                </div>

                {/* PROMPT CONTEXT DISPLAY */}
                <Card style={{ padding: '12px 14px', background: '#090d16', borderLeft: '4px solid #38BDF8' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>INPUT PROMPT CONTEXT:</div>
                  <pre style={{ margin: 0, color: 'white', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {activePrompt.prompt}
                  </pre>
                </Card>

                {/* HYPERPARAMETER CONTROLS */}
                <Grid columns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }} gap="var(--ds-space-3)">
                  {/* Temperature */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 'bold' }}>Temperature (T):</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'white' }}>{temperature.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="0.0"
                      max="2.0"
                      step="0.05"
                      value={temperature}
                      onChange={e => {
                        const val = parseFloat(e.target.value);
                        setTemperature(val);
                        setIsGreedy(val === 0);
                      }}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      {temperature === 0 ? '0.0 (Greedy argmax)' : temperature < 0.5 ? 'Low (Sharp & Factual)' : temperature < 1.0 ? 'Balanced' : 'High (Wild / Creative)'}
                    </div>
                  </Card>

                  {/* Top-K */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>Top-K Cutoff:</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'white' }}>{topK}</span>
                    </Flex>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      step="1"
                      value={topK}
                      onChange={e => setTopK(parseInt(e.target.value, 10))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      Keeps top {topK} candidate tokens
                    </div>
                  </Card>

                  {/* Top-P */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#F5A623', fontWeight: 'bold' }}>Top-P (Nucleus):</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'white' }}>{topP.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="0.10"
                      max="1.0"
                      step="0.05"
                      value={topP}
                      onChange={e => setTopP(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      Cum. mass threshold: {Math.round(topP * 100)}%
                    </div>
                  </Card>

                  {/* Min-P */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 'bold' }}>Min-P Threshold:</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'white' }}>{minP.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="0.0"
                      max="0.30"
                      step="0.01"
                      value={minP}
                      onChange={e => setMinP(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      Discard tokens &lt; {(minP * 100).toFixed(0)}% of top token
                    </div>
                  </Card>

                  {/* Repetition Penalty */}
                  <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                      <label style={{ fontSize: '11px', color: '#fb7185', fontWeight: 'bold' }}>Repetition Penalty:</label>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'white' }}>{repetitionPenalty.toFixed(2)}</span>
                    </Flex>
                    <input
                      type="range"
                      min="1.0"
                      max="1.5"
                      step="0.05"
                      value={repetitionPenalty}
                      onChange={e => setRepetitionPenalty(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '10px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                      {repetitionPenalty === 1.0 ? '1.0 (No penalty)' : `Penalty divisor: ${repetitionPenalty}`}
                    </div>
                  </Card>
                </Grid>

                {/* DISTRIBUTION VISUALIZATION TABLE & BARS */}
                <div>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '12px', color: 'white' }}>
                      TOKEN CANDIDATE PROBABILITY DISTRIBUTION:
                    </strong>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      Surviving Tokens in Sampling Pool: <strong style={{ color: '#10b981' }}>{distribution.filter(d => d.isSurviving).length} / {distribution.length}</strong>
                    </div>
                  </Flex>

                  <Stack gap={2}>
                    {distribution.map((item, idx) => (
                      <Card
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: item.isSurviving ? 'var(--ds-color-bg-surface)' : 'rgba(255,255,255,0.02)',
                          opacity: item.isSurviving ? 1.0 : 0.35,
                          borderLeft: `4px solid ${item.isSurviving ? '#10b981' : '#64748b'}`
                        }}
                      >
                        <Flex justify="space-between" align="center" style={{ marginBottom: '4px' }}>
                          <Flex align="center" gap="8px">
                            <span style={{ fontFamily: 'monospace', fontSize: '13px', color: item.isSurviving ? '#38BDF8' : '#94a3b8', fontWeight: 'bold', background: '#090d16', padding: '2px 6px', borderRadius: '3px' }}>
                              "{item.token}"
                            </span>
                            <Badge variant="subtle" style={{ fontSize: '10px' }}>
                              Logit: {item.rawLogit}
                            </Badge>
                            {!item.isKeptByTopK && <Badge variant="outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>Cut by Top-K</Badge>}
                            {!item.isKeptByTopP && <Badge variant="outline" style={{ color: '#F5A623', borderColor: '#F5A623' }}>Cut by Top-P</Badge>}
                            {!item.isKeptByMinP && <Badge variant="outline" style={{ color: '#a78bfa', borderColor: '#a78bfa' }}>Cut by Min-P</Badge>}
                          </Flex>

                          <div style={{ fontFamily: 'monospace', fontSize: '12px', color: item.isSurviving ? '#10b981' : '#64748b', fontWeight: 'bold' }}>
                            {(item.finalProb * 100).toFixed(1)}% probability
                          </div>
                        </Flex>

                        {/* Probability Progress Bar */}
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${item.finalProb * 100}%`,
                              height: '100%',
                              background: item.isSurviving ? 'linear-gradient(90deg, #38BDF8, #10b981)' : '#64748b',
                              transition: 'width 0.2s ease'
                            }}
                          />
                        </div>
                      </Card>
                    ))}
                  </Stack>
                </div>

                <Callout type="info">
                  <strong>How to use this simulator:</strong> Set <code>Temperature = 0</code> to observe <em>Greedy Decoding</em> where only the top token has 100% probability. Raise <code>Temperature = 1.5</code> to watch tail tokens gain probability. Turn on <code>Min-P = 0.10</code> to observe how low-probability hallucinated tokens are cleanly eliminated without arbitrary Top-K cutoffs.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: DECODING STRATEGIES & TRADEOFFS ─── */}
        {activeSubTab === 'strategies' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ Comprehensive Comparison of LLM Decoding Strategies</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Different enterprise tasks require different decoding algorithms. Selecting the wrong sampling strategy is one of the leading causes of hallucinations and broken JSON schemas.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {DECODING_STRATEGIES.map((strat) => (
                    <Card key={strat.id} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#38BDF8' }}>{strat.name}</strong>
                        <Badge variant="outline" style={{ color: '#F5A623', borderColor: '#F5A623' }}>
                          {strat.idealTemperature}
                        </Badge>
                      </Flex>

                      <Card style={{ padding: '6px 10px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '11px', margin: '6px 0 10px 0' }}>
                        {strat.formula}
                      </Card>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                        <strong>Pros:</strong> {strat.pros}
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                        <strong>Cons:</strong> {strat.cons}
                      </div>
                      <div style={{ fontSize: '11px', color: '#10b981' }}>
                        🎯 <strong>Ideal for:</strong> {strat.useCases}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: AUTOREGRESSIVE GENERATION TRACER ─── */}
        {activeSubTab === 'tracer' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔍 Step-by-Step Autoregressive Token Generation Tracer</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Trace the autoregressive loop forward pass by forward pass. See how generated tokens are iteratively fed back into the context window to condition subsequent token logits.
                  </p>
                </div>

                {/* STEP SELECTOR BUTTONS */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {tracerSteps.map((st, idx) => (
                    <Button
                      key={idx}
                      variant={tracerStep === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setTracerStep(idx)}
                    >
                      Step {st.step}
                    </Button>
                  ))}
                </div>

                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>CONTEXT WINDOW AT STEP {tracerSteps[tracerStep].step}:</div>
                  <div style={{ fontSize: '14px', color: 'white', fontFamily: 'monospace', padding: '8px 12px', background: '#090d16', borderRadius: '4px', marginBottom: '12px' }}>
                    {tracerSteps[tracerStep].inputContext} <span style={{ background: '#10b981', color: '#090d16', padding: '1px 4px', borderRadius: '2px', fontWeight: 'bold' }}>[NEXT_TOKEN_PREDICTION]</span>
                  </div>

                  <strong style={{ fontSize: '12px', color: '#38BDF8', display: 'block', marginBottom: '6px' }}>
                    Predicted Candidate Probabilities at Step {tracerSteps[tracerStep].step}:
                  </strong>

                  <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-2)" style={{ marginBottom: '12px' }}>
                    {tracerSteps[tracerStep].nextLogits.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 12px',
                          background: item.selected ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                          border: item.selected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '4px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontFamily: 'monospace', color: item.selected ? '#10b981' : 'white', fontWeight: item.selected ? 'bold' : 'normal' }}>
                          "{item.token}" {item.selected && '✓ (SAMPLED)'}
                        </span>
                        <span style={{ fontFamily: 'monospace', color: item.selected ? '#10b981' : 'var(--ds-color-text-tertiary)' }}>
                          {(item.prob * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </Grid>

                  <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                    💡 <strong>Mechanics Explanation:</strong> {tracerSteps[tracerStep].explanation}
                  </div>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: MATHEMATICAL FORMULATIONS ─── */}
        {activeSubTab === 'math' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Mathematical Formulations of Logit Transformations</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Detailed breakdown of the mathematical operations applied to raw logit vectors before token sampling.
                  </p>
                </div>

                <Stack gap={3}>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8' }}>1. Unnormalized Logits to Probabilities (Standard Softmax)</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"P(t_i) = exp(z_i) / sum_{j=1}^{|V|} exp(z_j)"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      The final layer of the Transformer outputs a vector of raw scores z in R^|V| where |V| is the vocabulary size (e.g. 128,256 in Llama 3). The Softmax function maps unbounded real numbers into a valid probability distribution where sum(P(t_i)) = 1.0.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>2. Temperature Scaling (T)</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"P(t_i; T) = exp(z_i / T) / sum_{j=1}^{|V|} exp(z_j / T)"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Dividing logits by temperature T &gt; 0 scales the variance. As T -&gt; 0, the highest logit dominates with probability approaching 1.0 (Greedy argmax). As T -&gt; infinity, the distribution approaches a uniform distribution 1 / |V| (maximum entropy / randomness).
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
                    <strong style={{ fontSize: '13px', color: '#F5A623' }}>3. Top-P (Nucleus) Cumulative Probability Cutoff</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"V^(p) = min { V' subseteq V : sum_{t in V'} P(t) >= p }"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Finds the smallest subset of tokens whose cumulative probability mass exceeds threshold p in (0, 1]. All other tokens have their logits set to -infinity, preventing the model from sampling unreliable tail tokens.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #a78bfa' }}>
                    <strong style={{ fontSize: '13px', color: '#a78bfa' }}>4. Min-P Dynamic Probability Thresholding</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"Mask(t_i) = z_i if P(t_i) >= P_max * p_min else -infinity"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Min-P discards tokens whose probability is smaller than p_min times the probability of the most confident token. When the model is uncertain, many tokens survive; when the model is confident, only the top token survives.
                    </p>
                  </Card>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PRODUCTION PYTORCH & VLLM CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production PyTorch LogitsProcessor & vLLM Sampling Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable implementation of custom sampling processors in PyTorch, Transformers, and vLLM inference server.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_LOGITS_PROCESSOR_SCRIPT} />

                <Callout type="success">
                  <strong>Production Best Practice:</strong> For deterministic tasks (SQL, JSON schema extraction, Code), always configure <code>temperature=0.0</code>. For open-ended reasoning, use <code>temperature=0.7</code> combined with <code>min_p=0.05</code> to eliminate degenerative tail tokens.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
