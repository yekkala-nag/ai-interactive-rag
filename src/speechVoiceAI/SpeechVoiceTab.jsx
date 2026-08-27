import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  AUDIO_PROCESSING_STAGES,
  VOICE_AGENT_ARCHITECTURES,
  AUDIO_CODEC_RVQ_LEVELS,
  PYTHON_WHISPER_VOICE_SCRIPT
} from './speechEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function SpeechVoiceTab() {
  const [activeSubTab, setActiveSubTab] = useState('pipeline'); 
  // 'pipeline' | 'whisper' | 'voiceagent' | 'codecs' | 'code'

  // Codec level selector
  const [selectedCodecLevel, setSelectedCodecLevel] = useState(1);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Frontiers [Speech & Voice Foundation Models]"
        title="Speech AI, Whisper & Real-Time Voice Agents"
        description="Master speech recognition, neural audio codecs, and low-latency voice agent architectures. Learn how 1D audio waveforms convert to 80-bin Mel-spectrograms, how Whisper predicts word-level timestamps, and how native Speech-to-Speech LLMs achieve <300ms conversational latencies."
        metrics={[
          { label: 'ASR Benchmark', value: 'Whisper Large-v3 Turbo' },
          { label: 'Audio Sampling Rate', value: '16,000 Hz (16 kHz)' },
          { label: 'Feature Representation', value: '80-bin Log-Mel Spectrogram' },
          { label: 'Voice Agent Latency', value: '< 300ms (Native S2S)' }
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
            { id: 'pipeline', icon: '🎙️', label: '1. Audio Feature Pipeline', desc: 'PCM to Mel-spectrogram' },
            { id: 'whisper', icon: '🧠', label: '2. Whisper Architecture', desc: 'Encoder-decoder & timestamps' },
            { id: 'voiceagent', icon: '⚡', label: '3. Voice Agent Latency', desc: 'Cascaded vs Native Speech-to-Speech' },
            { id: 'codecs', icon: '🎵', label: '4. Neural Audio Codecs', desc: 'Residual Vector Quantization (RVQ)' },
            { id: 'code', icon: '🛠️', label: '5. PyTorch Whisper Code', desc: 'Word-level timestamp pipeline' }
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

        {/* ─── SUBTAB 1: AUDIO FEATURE EXTRACTION PIPELINE ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎙️ The 4 Stages of Speech Signal Processing</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How continuous analog air pressure vibrations are recorded, transformed via Fourier analysis, and projected into neural network representations.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  {AUDIO_PROCESSING_STAGES.map((st, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #38BDF8' }}>
                      <strong style={{ fontSize: '12px', color: '#38BDF8', display: 'block', marginBottom: '6px' }}>
                        {st.stage}
                      </strong>
                      <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#10b981', marginBottom: '8px' }}>
                        {st.tech}
                      </div>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        {st.detail}
                      </p>
                    </Card>
                  ))}
                </Grid>

                <Callout type="info">
                  <strong>Why Log-Mel Scale?</strong> Human ear cochleas distinguish small frequency differences at low pitches (100 Hz–1000 Hz) much better than at high pitches (5000 Hz–10,000 Hz). The Mel-scale compresses high frequencies logarithmically to match human phonetic perception.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: WHISPER ARCHITECTURE ─── */}
        {activeSubTab === 'whisper' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧠 OpenAI Whisper Encoder-Decoder Architecture</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Whisper is an Encoder-Decoder Transformer trained on 680,000+ hours of multilingual and multitask audio supervised web data.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8', display: 'block', marginBottom: '8px' }}>
                      AUDIO ENCODER (TRANSFORMER):
                    </strong>
                    <Stack gap={2} style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                      <div>1. Receives 80-channel log-Mel spectrogram chunks (30-second audio windows).</div>
                      <div>2. Two 1D convolution layers with stride=2 downsample audio length to 1500 frames.</div>
                      <div>3. Bidirectional self-attention blocks process the full 30-second context simultaneously.</div>
                      <div>4. Outputs dense acoustic embeddings for decoder cross-attention.</div>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981', display: 'block', marginBottom: '8px' }}>
                      TEXT DECODER & MULTITASK TOKENS:
                    </strong>
                    <Stack gap={2} style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                      <div>1. Starts with special prefix tokens: <code>&lt;|startoftranscript|&gt;</code> <code>&lt;|en|&gt;</code> <code>&lt;|transcribe|&gt;</code> <code>&lt;|notimestamps|&gt;</code>.</div>
                      <div>2. Autoregressively generates text tokens using cross-attention over encoder states.</div>
                      <div>3. Interleaves timestamp tokens (e.g. <code>&lt;|0.00|&gt; ... &lt;|2.40|&gt;</code>) at 20ms precision.</div>
                      <div>4. Fallback decoding: If repetition or temperature drift occurs, retries at higher temperature.</div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: VOICE AGENT LATENCY ─── */}
        {activeSubTab === 'voiceagent' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Voice Agent Architectures: Cascaded vs Native Speech-to-Speech</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Comparing traditional 3-stage voice pipelines with next-generation native multimodal speech models (GPT-4o Voice, Moshi, Ultravox).
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {VOICE_AGENT_ARCHITECTURES.map((v) => (
                    <Card key={v.id} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${v.id === 'native_s2s' ? '#10b981' : '#F5A623'}` }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: v.id === 'native_s2s' ? '#10b981' : '#F5A623' }}>{v.name}</strong>
                        <Badge variant="subtle" style={{ color: v.id === 'native_s2s' ? '#10b981' : '#F5A623', background: v.id === 'native_s2s' ? 'rgba(16,185,129,0.15)' : 'rgba(245,166,35,0.15)' }}>
                          {v.latency}
                        </Badge>
                      </Flex>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
                        Interruption Handling: <strong style={{ color: 'white' }}>{v.interruptionHandling}</strong>
                      </div>

                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                        <strong>Pros:</strong> {v.pros}
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <strong>Cons:</strong> {v.cons}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: NEURAL AUDIO CODECS (RVQ) ─── */}
        {activeSubTab === 'codecs' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎵 Neural Audio Codecs & Residual Vector Quantization (RVQ)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How models like EnCodec, SoundStream, and SNAC tokenize audio streams into hierarchical discrete codes for language modeling.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {AUDIO_CODEC_RVQ_LEVELS.map((c, idx) => (
                    <Button
                      key={idx}
                      variant={selectedCodecLevel === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedCodecLevel(idx)}
                    >
                      {c.level}
                    </Button>
                  ))}
                </div>

                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>
                      {AUDIO_CODEC_RVQ_LEVELS[selectedCodecLevel].level}
                    </strong>
                    <Badge variant="outline">
                      {AUDIO_CODEC_RVQ_LEVELS[selectedCodecLevel].bitrateKbps} kbps Bitrate
                    </Badge>
                  </Flex>

                  <div style={{ background: '#090d16', padding: '10px 12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '12px', color: 'white', marginBottom: '8px' }}>
                    Token Generation Rate: <span style={{ color: '#38BDF8' }}>{AUDIO_CODEC_RVQ_LEVELS[selectedCodecLevel].tokensPerSec} tokens / sec</span>
                  </div>

                  <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                    {AUDIO_CODEC_RVQ_LEVELS[selectedCodecLevel].details}
                  </p>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PYTORCH WHISPER CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production PyTorch Whisper ASR & Voice Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete pipeline utilizing Whisper Large-v3 Turbo with bfloat16 precision and word-level timestamp alignment.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_WHISPER_VOICE_SCRIPT} />

                <Callout type="success">
                  <strong>Voice Activity Detection (VAD) Tip:</strong> In production voice bots, place Silero VAD in front of Whisper to drop silent chunks, saving 40–60% of GPU compute and preventing hallucinated repetitive text loops during background silence.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
