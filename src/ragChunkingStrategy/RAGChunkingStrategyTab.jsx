import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  CHUNKING_STRATEGIES,
  SAMPLE_DOCUMENT,
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
  contextual_retrieval: "🏷️",
  late_chunking: "⏳"
};

const RISK_COLORS = {
  low: "#10b981",
  medium: "#F5A623",
  high: "#ef4444"
};

export default function RAGChunkingStrategyTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [selectedStrategy, setSelectedStrategy] = useState('recursive_character');
  const [simResult, setSimResult] = useState(null);

  const runSimulation = () => {
    const result = SIMULATE_CHUNKING(selectedStrategy, SAMPLE_DOCUMENT);
    setSimResult(result);
  };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [Chunking Strategies]"
        title="RAG Chunking Strategies: From Fixed-Size to Late Chunking"
        description="Stop losing context at chunk boundaries. Master 8 chunking strategies from naive fixed-size to Anthropic's Contextual Retrieval and Jina's Late Chunking, with interactive simulations and production Python code."
        metrics={[
          { label: 'Strategies', value: '8 Distinct Methods' },
          { label: 'Quality Range', value: '42% → 94% Retrieval' },
          { label: 'Cost Spectrum', value: '$ → $$$' },
          { label: 'Best Practice', value: 'Parent-Child + Context' }
        ]}
      />

      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage
            src="/assets/rag_chunking_strategies.png"
            alt="RAG Chunking Strategies Comparison"
            title="Chunking Strategy Decision Matrix"
            caption="Overview: Left: Strategy categories from Naive to LLM-Enhanced. Middle: Quality vs Cost tradeoff. Right: Production pipeline with Parent-Child + Contextual Retrieval."
            background="#090d16"
            maxWidth={1050}
          />
        </div>

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
            { id: 'overview', icon: '📊', label: '1. Strategy Overview', desc: 'All 8 strategies at a glance' },
            { id: 'simulator', icon: '🔬', label: '2. Interactive Simulator', desc: 'Compare chunking on live document' },
            { id: 'comparison', icon: '⚡', label: '3. Speed vs Quality Matrix', desc: 'Cost & performance tradeoffs' },
            { id: 'code', icon: '🛠️', label: '4. Production Python Code', desc: 'Ready-to-use implementations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '210px',
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

        {/* ─── SUBTAB 1: STRATEGY OVERVIEW ─── */}
        {activeSubTab === 'overview' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 8 Chunking Strategies: Naive → LLM-Enhanced</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Chunking is the single highest-leverage decision in RAG. Choosing the wrong strategy loses 30-50% of retrieval accuracy before embedding even begins.
                  </p>
                </div>

                <Stack gap={3}>
                  {CHUNKING_STRATEGIES.map((s) => (
                    <Card key={s.id} style={{
                      padding: '14px',
                      background: 'var(--ds-color-bg-surface)',
                      borderLeft: `4px solid ${RISK_COLORS[s.riskLevel]}`
                    }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '4px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#38BDF8' }}>
                          {STRATEGY_ICONS[s.id]} {s.name}
                        </strong>
                        <Flex gap="var(--ds-space-2)" align="center">
                          <Badge variant="subtle" style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', fontSize: '9px' }}>
                            {s.category}
                          </Badge>
                          <Badge variant="subtle" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--ds-color-text-tertiary)', fontSize: '9px' }}>
                            {s.riskLevel} risk
                          </Badge>
                        </Flex>
                      </Flex>

                      <p style={{ margin: '4px 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        {s.description}
                      </p>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)" style={{ marginTop: '8px', fontSize: '11px' }}>
                        <div>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>Pros:</span>{' '}
                          <span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.pros.join(', ')}</span>
                        </div>
                        <div>
                          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Cons:</span>{' '}
                          <span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.cons.join(', ')}</span>
                        </div>
                        <div>
                          <span style={{ color: '#F5A623', fontWeight: 'bold' }}>Best For:</span>{' '}
                          <span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.bestFor}</span>
                        </div>
                      </Grid>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: INTERACTIVE SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔬 Interactive Chunking Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    See exactly how each strategy splits the same 5-section Enterprise Data Governance Policy document.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#F5A623', display: 'block', marginBottom: '10px' }}>
                      SELECT STRATEGY & RUN:
                    </strong>

                    <select
                      value={selectedStrategy}
                      onChange={e => setSelectedStrategy(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'var(--ds-color-bg-surface)',
                        color: 'white',
                        border: '1px solid var(--ds-color-border-subtle)',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '12px',
                        marginBottom: '10px'
                      }}
                    >
                      {CHUNKING_STRATEGIES.map(s => (
                        <option key={s.id} value={s.id}>
                          {STRATEGY_ICONS[s.id]} {s.name} — {s.category}
                        </option>
                      ))}
                    </select>

                    <Button onClick={runSimulation} variant="primary" style={{ width: '100%', marginBottom: '10px' }}>
                      Run Chunking Simulation
                    </Button>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      Document: "{SAMPLE_DOCUMENT.title}"
                      <br />{SAMPLE_DOCUMENT.sections.length} sections, ~{SAMPLE_DOCUMENT.sections.reduce((a, s) => a + s.content.split(/\s+/).length, 0)} words
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${simResult ? '#10b981' : 'var(--ds-color-border-subtle)'}` }}>
                    <strong style={{ fontSize: '11px', color: simResult ? '#10b981' : 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '8px' }}>
                      {simResult ? 'SIMULATION RESULTS' : 'AWAITING SIMULATION...'}
                    </strong>

                    {simResult ? (
                      <Stack gap={2} style={{ fontSize: '11px' }}>
                        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                          <div>Chunks: <span style={{ color: 'white', fontWeight: 'bold' }}>{simResult.totalChunks}</span></div>
                          <div>Quality: <span style={{ color: '#10b981', fontWeight: 'bold' }}>{simResult.semanticQuality}</span></div>
                          <div>Retrieval: <span style={{ color: '#38BDF8', fontWeight: 'bold' }}>{simResult.retrievalPrecision}</span></div>
                        </Grid>
                        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                          <div>Avg Words: <span style={{ color: 'white' }}>{simResult.avgChunkWords}</span></div>
                          <div>Structure: <span style={{ color: simResult.structurePreserved ? '#10b981' : '#ef4444' }}>{simResult.structurePreserved ? 'Preserved' : 'Lost'}</span></div>
                          <div>Synthesis: <span style={{ color: 'white' }}>{simResult.synthesisQuality}</span></div>
                        </Grid>
                      </Stack>
                    ) : (
                      <p style={{ color: 'var(--ds-color-text-tertiary)', fontSize: '11px', margin: 0 }}>
                        Click "Run Chunking Simulation" to see results
                      </p>
                    )}
                  </Card>
                </Grid>

                {simResult && (
                  <Stack gap={3}>
                    <strong style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)' }}>
                      Generated Chunks (first {Math.min(simResult.chunks.length, 4)} of {simResult.totalChunks}):
                    </strong>
                    {simResult.chunks.map((chunk) => (
                      <Card key={chunk.id} style={{
                        padding: '10px',
                        background: 'var(--ds-color-bg-surface)',
                        borderLeft: `3px solid ${chunk.breaksMidSentence ? '#ef4444' : '#10b981'}`
                      }}>
                        <Flex justify="space-between" align="center" style={{ marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                            Chunk #{chunk.id} — {chunk.wordCount} words
                          </span>
                          <Flex gap="var(--ds-space-2)">
                            {chunk.breaksMidSentence && (
                              <Badge variant="subtle" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontSize: '9px' }}>
                                BREAKS MID-SENTENCE
                              </Badge>
                            )}
                            {chunk.preservesStructure && (
                              <Badge variant="subtle" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', fontSize: '9px' }}>
                                STRUCTURE PRESERVED
                              </Badge>
                            )}
                          </Flex>
                        </Flex>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>
                          {chunk.preview}
                        </div>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: SPEED VS QUALITY MATRIX ─── */}
        {activeSubTab === 'comparison' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Chunking Strategy: Speed vs Quality vs Cost Matrix</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    The fundamental RAG chunking tradeoff: better retrieval quality costs more compute and time. Choose based on your document value and query volume.
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '11px'
                  }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                        <th style={{ padding: '8px', textAlign: 'left', color: 'var(--ds-color-text-secondary)' }}>Strategy</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>Speed</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>Quality</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>Cost</th>
                        <th style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>Context</th>
                        <th style={{ padding: '8px', textAlign: 'left', color: 'var(--ds-color-text-secondary)' }}>Best For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CHUNKING_COMPARISON_TABLE.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                          <td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{row.strategy}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: row.speed === '1x' ? '#10b981' : row.speed.includes('x') ? '#F5A623' : '#ef4444' }}>{row.speed}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: row.quality === 'Low' ? '#ef4444' : row.quality === 'Good' ? '#10b981' : '#38BDF8' }}>{row.quality}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{row.cost}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{row.context}</td>
                          <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{row.best}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Callout type="success">
                  <strong>Production Recommendation:</strong> Start with Parent-Child chunking for the best retrieval+context balance. Add Contextual Retrieval if retrieval accuracy above 90% is required. Use Late Chunking for research-heavy workloads.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PRODUCTION PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Python Chunking Implementations</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-paste ready implementations for all 5 core chunking strategies, including Parent-Child hierarchical and Contextual Retrieval with LLM context enrichment.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_CHUNKING_CODE} />

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> Zero personal author details or unredacted PII. 100% public domain policy document mock.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
