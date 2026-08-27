import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  ATTENTION_EXAMPLE_SENTENCES,
  ATTENTION_ARCHITECTURES,
  POSITIONAL_ENCODINGS,
  COMPUTE_SYNTHETIC_ATTENTION_MATRIX,
  PYTHON_SELF_ATTENTION_SCRIPT
} from './attentionEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function SelfAttentionTab() {
  const [activeSubTab, setActiveSubTab] = useState('interactive'); 
  // 'interactive' | 'matrix' | 'architectures' | 'positional' | 'code'

  // Interactive sentence selector
  const [selectedSentenceIdx, setSelectedSentenceIdx] = useState(0);

  // Matrix Heatmap state
  const [headSpecialization, setHeadSpecialization] = useState('syntactic');

  const activeSentence = ATTENTION_EXAMPLE_SENTENCES[selectedSentenceIdx];
  const heatmapMatrix = COMPUTE_SYNTHETIC_ATTENTION_MATRIX(activeSentence.sentence, headSpecialization);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="foundations"
        moduleLabel="Foundations & Architecture [Transformers & Self-Attention]"
        title="Inside Transformer Self-Attention: A Step-by-Step Guide"
        description="Understand the fundamental mechanism powering modern LLMs. Learn how Query, Key, and Value projections compute token-to-token contextual relevance, how causal masking prevents lookahead leakage, and how MHA evolved into GQA and MLA."
        metrics={[
          { label: 'Attention Complexity', value: 'O(N^2) Standard -> O(N) Flash' },
          { label: 'Key Innovation', value: 'Scaled Dot-Product (QK^T / sqrt(d_k))' },
          { label: 'Modern Standard', value: 'GQA (Grouped-Query Attention)' },
          { label: 'Positional Encoding', value: 'RoPE (Rotary Position Embedding)' }
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
            { id: 'interactive', icon: '👁️', label: '1. Attention Weight Visualizer', desc: 'Token-to-token attention weights' },
            { id: 'matrix', icon: '🧮', label: '2. 2D Attention Heatmap', desc: 'Causal autoregressive matrix' },
            { id: 'architectures', icon: '⚡', label: '3. MHA vs GQA vs MLA', desc: 'KV cache memory scaling' },
            { id: 'positional', icon: '🔄', label: '4. Positional Encodings', desc: 'RoPE vs ALiBi vs Absolute' },
            { id: 'code', icon: '🛠️', label: '5. PyTorch Implementation', desc: 'ScaledDotProductAttention code' }
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

        {/* ─── SUBTAB 1: INTERACTIVE ATTENTION WEIGHT VISUALIZER ─── */}
        {activeSubTab === 'interactive' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>👁️ Token-to-Token Attention Weight Distribution</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Select a sentence scenario to observe how the Query vector of the target token attends across all previous Key tokens to resolve ambiguity.
                  </p>
                </div>

                {/* SCENARIO SELECTOR */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ATTENTION_EXAMPLE_SENTENCES.map((ex, idx) => (
                    <Button
                      key={ex.id}
                      variant={selectedSentenceIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedSentenceIdx(idx)}
                    >
                      {ex.title}
                    </Button>
                  ))}
                </div>

                {/* SENTENCE TOKEN CHIPS */}
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
                    TOKENS IN CONTEXT (TARGET TOKEN HIGHLIGHTED IN GREEN):
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {activeSentence.sentence.map((tok, i) => {
                      const isTarget = i === activeSentence.targetTokenIdx;
                      const weight = activeSentence.attentionWeights[i] || 0;
                      return (
                        <div
                          key={i}
                          style={{
                            padding: '6px 12px',
                            background: isTarget ? '#10b981' : `rgba(56, 189, 248, ${Math.max(0.1, weight * 1.5)})`,
                            color: isTarget ? '#090d16' : 'white',
                            borderRadius: '6px',
                            fontFamily: 'monospace',
                            fontSize: '13px',
                            fontWeight: isTarget || weight > 0.3 ? 'bold' : 'normal',
                            border: weight > 0.3 ? '1px solid #38BDF8' : '1px solid rgba(255,255,255,0.1)',
                            textAlign: 'center'
                          }}
                        >
                          <div>{tok}</div>
                          <div style={{ fontSize: '10px', opacity: 0.85, marginTop: '2px' }}>
                            {isTarget ? '[QUERY]' : `${(weight * 100).toFixed(0)}%`}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', background: '#090d16', padding: '12px', borderRadius: '4px', borderLeft: '4px solid #38BDF8' }}>
                    💡 <strong>Self-Attention Resolution:</strong> {activeSentence.explanation}
                  </div>
                </Card>

                {/* STEP-BY-STEP QKV MATH BREAKDOWN */}
                <div>
                  <strong style={{ fontSize: '13px', color: 'white', display: 'block', marginBottom: '8px' }}>
                    The 4 Steps of Scaled Dot-Product Attention:
                  </strong>
                  <Grid columns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                    <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #38BDF8' }}>
                      <strong style={{ fontSize: '11px', color: '#38BDF8' }}>Step 1: Linear Projections</strong>
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'white', background: '#090d16', padding: '6px', margin: '6px 0', borderRadius: '3px' }}>
                        Q = X * W_Q<br/>K = X * W_K<br/>V = X * W_V
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                        Input embedding X is projected into Query, Key, and Value representations.
                      </div>
                    </Card>

                    <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #10b981' }}>
                      <strong style={{ fontSize: '11px', color: '#10b981' }}>Step 2: Scaled Dot-Product</strong>
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'white', background: '#090d16', padding: '6px', margin: '6px 0', borderRadius: '3px' }}>
                        S = (Q * K^T) / sqrt(d_k)
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                        Calculates raw similarity scores between all query and key token pairs.
                      </div>
                    </Card>

                    <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #F5A623' }}>
                      <strong style={{ fontSize: '11px', color: '#F5A623' }}>Step 3: Causal Softmax</strong>
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'white', background: '#090d16', padding: '6px', margin: '6px 0', borderRadius: '3px' }}>
                        A = Softmax(Mask(S))
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                        Masks future tokens and normalizes rows to probability distributions summing to 1.0.
                      </div>
                    </Card>

                    <Card style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #a78bfa' }}>
                      <strong style={{ fontSize: '11px', color: '#a78bfa' }}>Step 4: Value Aggregation</strong>
                      <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'white', background: '#090d16', padding: '6px', margin: '6px 0', borderRadius: '3px' }}>
                        Output = A * V
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                        Computes a weighted sum over the Value vectors to form the contextualized representation.
                      </div>
                    </Card>
                  </Grid>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: 2D ATTENTION MATRIX HEATMAP ─── */}
        {activeSubTab === 'matrix' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 2D Causal Autoregressive Attention Matrix Heatmap</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Visualizing the lower-triangular causal attention matrix. Notice that in autoregressive decoders, tokens can only attend to preceding tokens (upper-right triangle is strictly zero).
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant={headSpecialization === 'syntactic' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setHeadSpecialization('syntactic')}
                  >
                    Head Type: Syntactic & Semantic
                  </Button>
                  <Button
                    variant={headSpecialization === 'previous_token' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setHeadSpecialization('previous_token')}
                  >
                    Head Type: Previous-Token Induction
                  </Button>
                  <Button
                    variant={headSpecialization === 'first_token' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setHeadSpecialization('first_token')}
                  >
                    Head Type: First-Token Anchor / Bos
                  </Button>
                </div>

                {/* MATRIX VISUALIZATION */}
                <div style={{ overflowX: 'auto', background: '#090d16', padding: '16px', borderRadius: '8px' }}>
                  <table style={{ borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'monospace' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '6px 10px', color: 'var(--ds-color-text-tertiary)', textAlign: 'right' }}>Query \ Key</th>
                        {activeSentence.sentence.map((tok, j) => (
                          <th key={j} style={{ padding: '6px 8px', color: '#38BDF8', textAlign: 'center' }}>
                            {tok}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeSentence.sentence.map((queryTok, i) => (
                        <tr key={i}>
                          <td style={{ padding: '6px 10px', color: '#10b981', fontWeight: 'bold', textAlign: 'right', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                            {queryTok}
                          </td>
                          {heatmapMatrix[i].map((val, j) => {
                            const isMasked = j > i;
                            const intensity = val;
                            return (
                              <td
                                key={j}
                                style={{
                                  padding: '6px 8px',
                                  textAlign: 'center',
                                  background: isMasked ? '#090d16' : `rgba(56, 189, 248, ${intensity * 1.2})`,
                                  color: isMasked ? 'rgba(255,255,255,0.1)' : intensity > 0.3 ? '#090d16' : 'white',
                                  fontWeight: intensity > 0.3 ? 'bold' : 'normal',
                                  border: '1px solid rgba(255,255,255,0.03)'
                                }}
                              >
                                {isMasked ? '0.0' : val.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Callout type="info">
                  <strong>Induction Heads Discovery:</strong> Anthropic researchers identified that Transformer attention heads specialize: some heads look back at the previous token, others act as "Induction Heads" that detect patterns (<code>[A][B] ... [A] -&gt; [B]</code>), enabling in-context few-shot learning!
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: ARCHITECTURAL EVOLUTION (MHA VS GQA VS MLA) ─── */}
        {activeSubTab === 'architectures' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Architectural Evolution: MHA ➔ GQA ➔ MQA ➔ MLA</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How modern LLM architectures solved the KV Cache memory bottleneck during long-context inference (128K–1M tokens).
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {ATTENTION_ARCHITECTURES.map((arch) => (
                    <Card key={arch.id} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#38BDF8' }}>{arch.name}</strong>
                        <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)' }}>
                          {arch.kvMemoryMultiplier}
                        </Badge>
                      </Flex>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
                        {arch.paper}
                      </div>

                      <div style={{ background: '#090d16', padding: '8px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', marginBottom: '8px' }}>
                        <div style={{ color: '#38BDF8' }}>Query Heads: {arch.qHeads}</div>
                        <div style={{ color: '#10b981' }}>Key/Value Heads: {arch.kvHeads}</div>
                      </div>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        {arch.desc}
                      </p>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: POSITIONAL ENCODINGS (ROPE VS ALIBI) ─── */}
        {activeSubTab === 'positional' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔄 Positional Encodings: Injecting Word Order into Attention</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Because self-attention is permutation-invariant (order-agnostic), positional encodings are mathematically required to inform the model of word sequence order.
                  </p>
                </div>

                <Stack gap={3}>
                  {POSITIONAL_ENCODINGS.map((pe) => (
                    <Card key={pe.id} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#10b981' }}>{pe.name}</strong>
                        <Badge variant="outline">{pe.usedBy}</Badge>
                      </Flex>

                      <div style={{ background: '#090d16', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: 'white', margin: '6px 0' }}>
                        Mechanism: {pe.mechanism}
                      </div>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <strong>Why it dominates:</strong> {pe.advantages}
                      </div>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PYTORCH CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production PyTorch Multi-Head Attention Implementation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Clean, readable tensor operations implementing scaled dot-product attention, multi-head tensor reshaping, causal masking, and output projections.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_SELF_ATTENTION_SCRIPT} />

                <Callout type="success">
                  <strong>FlashAttention Optimization:</strong> In production models, standard PyTorch attention is replaced by <code>flash_attn_func</code> which fuses QK^T, softmax, and V multiplication into a single GPU SRAM kernel, achieving near-hardware-peak throughput without materializing the O(N^2) attention matrix.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
