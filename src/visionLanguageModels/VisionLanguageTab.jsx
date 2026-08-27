import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  VLM_EXAMPLE_TASKS,
  VLM_CONNECTOR_ARCHITECTURES,
  VIT_PATCH_CALCULATION,
  PYTHON_VLM_PIPELINE_SCRIPT
} from './vlmEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function VisionLanguageTab() {
  const [activeSubTab, setActiveSubTab] = useState('pipeline'); 
  // 'pipeline' | 'patcher' | 'connectors' | 'vqa' | 'code'

  // Patch calculator state
  const [imageResolution, setImageResolution] = useState(448);
  const [patchSize, setPatchSize] = useState(14);

  const patchStats = VIT_PATCH_CALCULATION(imageResolution, imageResolution, patchSize);

  // VQA task selector
  const [selectedTaskIdx, setSelectedTaskIdx] = useState(0);
  const activeTask = VLM_EXAMPLE_TASKS[selectedTaskIdx];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Frontiers [Vision-Language Models & Multimodal AI]"
        title="Vision-Language Models (VLMs) & Multimodal Architecture"
        description="Master the end-to-end architecture of modern Multimodal AI. Explore how Vision Transformers (ViT) extract spatial image patches, how Cross-Modal Connectors (LLaVA MLP, Q-Former, Gated Cross-Attention) project visual tokens into LLM embedding spaces, and how contrastive pretraining (CLIP/SigLIP) aligns vision and language."
        metrics={[
          { label: 'Vision Encoder', value: 'CLIP / SigLIP / ViT-H' },
          { label: 'Patch Dimensions', value: '14x14 or 16x16 pixels' },
          { label: 'Modalities', value: 'Text + Images + Documents' },
          { label: 'Connector', value: '2-Layer MLP / Perceiver' }
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
            { id: 'pipeline', icon: '🖼️', label: '1. VLM Pipeline Architecture', desc: 'ViT + Connector + LLM backbone' },
            { id: 'patcher', icon: '📐', label: '2. Patch Token Sizer', desc: 'Resolution & token calculation' },
            { id: 'connectors', icon: '⚡', label: '3. Cross-Modal Connectors', desc: 'MLP vs Q-Former vs Cross-Attn' },
            { id: 'vqa', icon: '🔬', label: '4. Visual Reasoning VQA', desc: 'Chart, invoice & grounding cases' },
            { id: 'code', icon: '🛠️', label: '5. PyTorch & LLaVA Code', desc: 'Hugging Face VLM pipeline' }
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

        {/* ─── SUBTAB 1: VLM PIPELINE ARCHITECTURE ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🖼️ The 3-Stage Vision-Language Model Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How image pixels are transformed into token embeddings that a standard decoder-only LLM can read as prefix tokens.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '4px solid #38BDF8' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#38BDF8' }}>Stage 1: Vision Encoder (ViT)</strong>
                      <Badge variant="subtle">CLIP / SigLIP</Badge>
                    </Flex>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      Splits the 2D image into a grid of 14x14 pixel patches. Flattens each patch, adds 2D positional encodings, and runs multiple Transformer self-attention blocks to produce dense feature vectors.
                    </p>
                    <div style={{ background: '#090d16', padding: '6px 10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#38BDF8' }}>
                      Input: [3, 448, 448] -&gt; Output: [1024, 1024]
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '4px solid #10b981' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#10b981' }}>Stage 2: Cross-Modal Connector</strong>
                      <Badge variant="subtle">2-Layer MLP</Badge>
                    </Flex>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      Projects the visual representation space into the exact dimensional embedding space of the target LLM. Acts as the "translator" between vision and text.
                    </p>
                    <div style={{ background: '#090d16', padding: '6px 10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#10b981' }}>
                      W_proj: Linear(1024 -&gt; 4096)
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '4px solid #F5A623' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#F5A623' }}>Stage 3: Autoregressive LLM</strong>
                      <Badge variant="subtle">Llama / Mistral</Badge>
                    </Flex>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      Treats projected visual tokens as prefix embeddings (`&lt;image&gt;`), interleaves them with text tokens, and performs standard causal next-token generation.
                    </p>
                    <div style={{ background: '#090d16', padding: '6px 10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#F5A623' }}>
                      Context: [Visual Tokens] + [Text Tokens]
                    </div>
                  </Card>
                </Grid>

                <Callout type="info">
                  <strong>Contrastive Alignment (CLIP / SigLIP):</strong> Before fine-tuning a VLM, the vision encoder is pre-trained on billions of (image, caption) pairs using contrastive loss ($I \\cdot T^T$), maximizing the cosine similarity of matching pairs while pushing non-matching pairs apart in the shared latent space.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: PATCH TOKEN SIZER ─── */}
        {activeSubTab === 'patcher' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📐 Vision Transformer (ViT) Patch & Token Sizer</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Calculate the exact number of visual tokens injected into the LLM context window based on image resolution and patch size.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Image Resolution:
                    </label>
                    <select
                      value={imageResolution}
                      onChange={e => setImageResolution(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    >
                      <option value={224}>224 x 224 (Standard Low-Res CLIP)</option>
                      <option value={336}>336 x 336 (LLaVA-1.5 Standard)</option>
                      <option value={448}>448 x 448 (SigLIP High-Res)</option>
                      <option value={672}>672 x 672 (High-Res Document OCR)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Patch Size (Pixels per Patch):
                    </label>
                    <select
                      value={patchSize}
                      onChange={e => setPatchSize(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    >
                      <option value={14}>14 x 14 pixels (ViT-L/14, SigLIP - Fine Grain)</option>
                      <option value={16}>16 x 16 pixels (ViT-B/16 - Standard)</option>
                      <option value={32}>32 x 32 pixels (ViT-B/32 - Coarse Fast)</option>
                    </select>
                  </div>
                </Grid>

                {/* COMPUTED TOKEN METRICS */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid #10b981' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '10px' }}>
                      <strong style={{ fontSize: '13px', color: '#10b981' }}>TOTAL VISUAL TOKENS IN LLM CONTEXT:</strong>
                      <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)' }}>
                        {patchStats.totalVisualTokens} Tokens
                      </Badge>
                    </Flex>
                    <Stack gap={2} style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                      <Flex justify="space-between">
                        <span style={{ color: 'var(--ds-color-text-secondary)' }}>Grid Dimensions:</span>
                        <span style={{ color: 'white' }}>{patchStats.numPatchesX} x {patchStats.numPatchesY} patches</span>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ color: 'var(--ds-color-text-secondary)' }}>Raw Patch Pixel Dimension:</span>
                        <span style={{ color: 'white' }}>{patchStats.rawPixelDim} float values (14x14x3)</span>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ color: 'var(--ds-color-text-secondary)' }}>[CLS] Special Token:</span>
                        <span style={{ color: 'white' }}>1 token</span>
                      </Flex>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8', display: 'block', marginBottom: '8px' }}>
                      ENGINEERING IMPLICATIONS & COST:
                    </strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0' }}>
                      Each image occupies <strong>{patchStats.totalVisualTokens} tokens</strong> in the LLM context window. On a 10-turn conversation with 3 images, visual tokens alone consume ~{(patchStats.totalVisualTokens * 3).toLocaleString()} context tokens per call!
                    </p>
                    <div style={{ fontSize: '11px', color: '#F5A623' }}>
                      💡 <strong>Architectural Rule:</strong> For high-throughput production, use <em>AnyRes / Dynamic Patch Slicing</em> (slicing high-res images into 336x336 tiles plus an overview thumbnail) to balance OCR precision with token bill costs.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: CROSS-MODAL CONNECTORS ─── */}
        {activeSubTab === 'connectors' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Cross-Modal Connector Architectures</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Comparing how different foundation models bridge the dimensional gap between visual features and language model layers.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {VLM_CONNECTOR_ARCHITECTURES.map((conn) => (
                    <Card key={conn.id} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#38BDF8' }}>{conn.name}</strong>
                        <Badge variant="outline">{conn.models}</Badge>
                      </Flex>

                      <div style={{ background: '#090d16', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', color: '#10b981', fontFamily: 'monospace', margin: '6px 0 8px 0' }}>
                        {conn.mechanism}
                      </div>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                        <strong>Pros:</strong> {conn.pros}
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <strong>Cons:</strong> {conn.cons}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: VQA REASONING PLAYGROUND ─── */}
        {activeSubTab === 'vqa' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔬 Visual Question Answering (VQA) Task Benchmark</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Live examples of complex enterprise visual reasoning across financial charts, unstructured scanned invoices, and spatial bounding boxes.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {VLM_EXAMPLE_TASKS.map((t, idx) => (
                    <Button
                      key={t.id}
                      variant={selectedTaskIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedTaskIdx(idx)}
                    >
                      {t.title}
                    </Button>
                  ))}
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>IMAGE TYPE:</div>
                    <div style={{ fontSize: '13px', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                      {activeTask.imageType} ({activeTask.visualTokens} Visual Tokens)
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>USER PROMPT QUESTION:</div>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', color: '#38BDF8', fontFamily: 'monospace', fontSize: '12px', marginBottom: '8px' }}>
                      "{activeTask.inputQuestion}"
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>VISUAL ATTENTION FOCUS REGION:</div>
                    <div style={{ color: '#F5A623', fontSize: '12px', fontFamily: 'monospace', marginTop: '2px' }}>
                      {activeTask.visualAttentionFocus}
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '12px', color: '#10b981' }}>✅ VLM STRUCTURED RESPONSE</strong>
                      <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.2)' }}>
                        {activeTask.connectorUsed}
                      </Badge>
                    </Flex>
                    <pre style={{ background: '#090d16', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#34d399', whiteSpace: 'pre-wrap', margin: 0 }}>
                      {activeTask.vlmResponse}
                    </pre>
                  </Card>
                </Grid>
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
                  <h3 style={{ margin: 0 }}>🛠️ Production PyTorch & LLaVA VLM Inference Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete reference pipeline for multimodal vision-language inference with Transformers and BitsAndBytes.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_VLM_PIPELINE_SCRIPT} />

                <Callout type="success">
                  <strong>Responsible AI & Multimodal Safety:</strong> Ensure images are scanned for adversarial perturbations (pixel-level noise attacks that trick vision encoders) and PII faces before passing to the multimodal processor.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
