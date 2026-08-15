import React, { useState, useEffect } from 'react';
import * as Primitives from '../components/layout/Primitives';
import { Hero, CodeBlock, Stepper } from '../components/ui/Content';
import { Card, Badge, Button, Callout } from '../components/ui/Core';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  POLICY_DOCUMENTS,
  listDocsTool,
  searchDocsTool,
  readDocTool,
  AGENTIC_SCENARIOS,
  DESIGN_DECISIONS_EVALUATOR
} from './agenticEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

export default function AgenticRAGTab() {
  // Navigation subtabs
  const [activeSection, setActiveSection] = useState('problem'); // 'problem', 'loop', 'tools', 'trace', 'decisions'

  // Tool Playground state
  const [selectedTool, setSelectedTool] = useState('list_docs');
  const [toolSearchQuery, setToolSearchQuery] = useState('conference hotel');
  const [toolSelectedDoc, setToolSelectedDoc] = useState('conference_guidelines.md');
  const [toolExecutionResult, setToolExecutionResult] = useState(null);

  // Scenario & Trace Simulator state
  const [activeScenarioId, setActiveScenarioId] = useState('berlin_conference');
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [expandedTurnCard, setExpandedTurnCard] = useState(null);

  // Interactive Architecture Calculator state
  const [calcScale, setCalcScale] = useState('small');
  const [calcSla, setCalcSla] = useState('balanced');
  const [calcComplexity, setCalcComplexity] = useState('multi_hop');

  // Active scenario object
  const activeScenario = AGENTIC_SCENARIOS.find(s => s.id === activeScenarioId) || AGENTIC_SCENARIOS[0];
  const activeTurn = activeScenario.turns[currentTurnIdx] || activeScenario.turns[0];

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentTurnIdx(prev => {
          if (prev >= activeScenario.turns.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeScenario]);

  // Execute Tool in Playground
  const handleExecuteTool = () => {
    if (selectedTool === 'list_docs') {
      setToolExecutionResult(listDocsTool());
    } else if (selectedTool === 'search_docs') {
      setToolExecutionResult(searchDocsTool(toolSearchQuery));
    } else if (selectedTool === 'read_doc') {
      setToolExecutionResult(readDocTool(toolSelectedDoc));
    }
  };

  useEffect(() => {
    handleExecuteTool();
  }, [selectedTool, toolSearchQuery, toolSelectedDoc]);

  // Calculate accumulated trace stats
  const accumulatedTurns = activeScenario.turns.slice(0, currentTurnIdx + 1);
  const totalPromptTokens = accumulatedTurns.reduce((acc, t) => acc + (t.tokensPrompt || 0), 0);
  const totalCompletionTokens = accumulatedTurns.reduce((acc, t) => acc + (t.tokensCompletion || 0), 0);
  const totalLatencyMs = accumulatedTurns.reduce((acc, t) => acc + (t.latencyMs || 0), 0);
  const estimatedCost = (((totalPromptTokens / 1000) * 0.0025) + ((totalCompletionTokens / 1000) * 0.01)).toFixed(4);

  const SECTIONS = [
    { id: 'problem', icon: '🔴', label: 'The Problem with Standard RAG', color: '#c4572a', desc: 'Failure modes of single-shot retrieval' },
    { id: 'loop', icon: '🔄', label: 'The Agentic Loop', color: '#2a8a84', desc: 'Search ➔ Read ➔ Decide cycle' },
    { id: 'tools', icon: '🧰', label: 'Three Tools', color: '#9b7fd4', desc: 'Interactive Tool Sandbox' },
    { id: 'trace', icon: '🔬', label: 'Agent Trace (Real Run)', color: '#c9a84c', desc: '4-Scenario execution simulator' },
    { id: 'decisions', icon: '⚖️', label: '5 Design Decisions', color: '#10b981', desc: 'Architecture scorecard calculator' }
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="rag"
        moduleLabel="Enterprise Document Intelligence [Vol.1 #14]"
        title="Agentic RAG: Let the Agent Search"
        description="Standard RAG retrieves once and hopes for the best. Agentic RAG gives the model tools to search, read, evaluate evidence completeness, and loop until it can answer with 100% policy grounding. Minimal OpenAI Agents SDK architecture with 3 tools, 0 embeddings, and an interactive execution simulator."
        metrics={[
          { label: 'Curated Tools', value: '3 Tools' },
          { label: 'Policy Corpus', value: '6 Docs' },
          { label: 'Embeddings Required', value: '0 (Token Match)' },
          { label: 'Scenarios', value: '4 Real Traces' }
        ]}
      />

      <Container size="wide">
        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-8)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {SECTIONS.map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              style={{
                flex: 1,
                minWidth: '200px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSection === sec.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSection === sec.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSection === sec.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSection === sec.id ? 0.9 : 0.7 }}>
                {sec.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── 1. THE PROBLEM WITH STANDARD RAG ─── */}
        {activeSection === 'problem' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(196,87,42,0.12) 0%, rgba(201,168,76,0.12) 100%)' }}>
              <Stack gap={3}>
                <Flex gap={2} align="center">
                  <Badge variant="danger">Single-Shot RAG Breakdown</Badge>
                  <Badge variant="subtle">Top-k Information Blindspot</Badge>
                </Flex>
                <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>The 3 Failure Modes of Standard RAG</h2>
                <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)', margin: 0 }}>
                  Standard RAG performs a single vector lookup, packs the top-k chunks into a prompt, and generates an answer in one shot. When answers depend on multi-document cross-referencing or recent policy overrides, single-shot retrieval fails silently.
                </p>
              </Stack>
            </Card>

            <Grid columns={3} gap={4}>
              {[
                {
                  icon: '🎯',
                  title: '1. Semantic Similarity ≠ Usefulness',
                  color: '#c4572a',
                  desc: 'Vector cosine similarity finds chunks with similar vocabulary (e.g. hotel room descriptions), but misses the actual governance clause that contains the approval exception threshold.'
                },
                {
                  icon: '📉',
                  title: '2. Right Evidence Ranked Beyond Top-k',
                  color: '#c9a84c',
                  desc: 'The essential policy update (e.g. 14-day advance notice) exists in the database, but ranks at position #6. With a static top-k=3 limit, the LLM is starved of ground truth and forced to hallucinate.'
                },
                {
                  icon: '✂️',
                  title: '3. Context Split Across Doc Boundaries',
                  color: '#9b7fd4',
                  desc: 'Policy rules are distributed across multiple files (Guidelines ➔ Approval Matrix ➔ 2026 Amendments). A single embedding query cannot simultaneously target all 3 disparate files.'
                }
              ].map((f, i) => (
                <Card key={i} style={{ padding: 'var(--ds-space-4)', borderTop: `3px solid ${f.color}` }}>
                  <Stack gap={2}>
                    <div style={{ fontSize: '1.8rem' }}>{f.icon}</div>
                    <strong style={{ fontSize: 'var(--ds-font-size-body)', color: f.color }}>{f.title}</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: 0, lineHeight: '1.6' }}>{f.desc}</p>
                  </Stack>
                </Card>
              ))}
            </Grid>

            {/* SIDE-BY-SIDE INTERACTIVE LAB */}
            <Section variant="bordered">
              <Section.Header>
                <h3 style={{ margin: 0 }}>⚔️ Side-by-Side: Standard Single-Shot RAG vs Agentic Multi-Step RAG</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>Comparing how both paradigms process a complex cross-document query.</p>
              </Section.Header>

              <Grid columns={2} gap={4}>
                {/* STANDARD RAG */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <Stack gap={3}>
                    <Flex justify="space-between" align="center">
                      <Badge variant="danger">Standard Single-Shot RAG</Badge>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#DC2626', fontWeight: 'bold' }}>Single Pass (k=3)</span>
                    </Flex>
                    <div>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Query:</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', fontStyle: 'italic', margin: '2px 0 0 0' }}>"Attending Berlin conference. Can I book official hotel above cap, and what approval is needed?"</p>
                    </div>
                    <div>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Retrieved Chunks:</strong>
                      <ul style={{ margin: '4px 0 0 0', paddingLeft: 'var(--ds-space-4)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <li>travel_policy.md#Sec2 (Berlin cap is $280/night)</li>
                        <li>conference_guidelines.md#Sec1 (2 conferences/year)</li>
                        <li>travel_policy.md#Sec3 (Meals per diem $110)</li>
                      </ul>
                    </div>
                    <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#DC2626', fontWeight: 'bold' }}>❌ FAILED OUTCOME:</span>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '2px 0 0 0' }}>
                        Missed the official hotel exception in Guidelines, missed Director threshold in Approval Matrix, and missed 14-day notice rule in 2026 updates.
                      </p>
                    </div>
                  </Stack>
                </Card>

                {/* AGENTIC RAG */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Stack gap={3}>
                    <Flex justify="space-between" align="center">
                      <Badge variant="success">Agentic Multi-Step RAG</Badge>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#10B981', fontWeight: 'bold' }}>Iterative Loop (3 Tools)</span>
                    </Flex>
                    <div>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Query:</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', fontStyle: 'italic', margin: '2px 0 0 0' }}>"Attending Berlin conference. Can I book official hotel above cap, and what approval is needed?"</p>
                    </div>
                    <div>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Autonomous Search Actions:</strong>
                      <ol style={{ margin: '4px 0 0 0', paddingLeft: 'var(--ds-space-4)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                        <li>search_docs() ➔ Identifies exception rule in Guidelines</li>
                        <li>list_docs() ➔ Discovers approval_matrix.md & 2026 updates</li>
                        <li>read_doc() across 3 candidate files ➔ Synthesizes multi-clause answer</li>
                      </ol>
                    </div>
                    <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#10B981', fontWeight: 'bold' }}>✅ 100% GROUNDED OUTCOME:</span>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '2px 0 0 0' }}>
                        Verifies hotel is allowed, identifies Manager + Director sign-off levels, and cites mandatory 14-day international notice rule.
                      </p>
                    </div>
                  </Stack>
                </Card>
              </Grid>
            </Section>
          </Stack>
        )}

        {/* ─── 2. THE AGENTIC LOOP ─── */}
        {activeSection === 'loop' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(42,138,132,0.12) 0%, rgba(155,127,212,0.12) 100%)' }}>
              <Stack gap={3}>
                <Badge variant="primary">Core Architecture Pattern</Badge>
                <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>The Search ➔ Read ➔ Decide Loop</h2>
                <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)', margin: 0 }}>
                  In Agentic RAG, retrieval is not a fixed pre-processing step. The agent executes targeted tool calls, evaluates its own provisional evidence, and decides whether to search again or generate the final cited answer.
                </p>
              </Stack>
            </Card>

            <Grid columns={2} gap={4}>
              {/* CODE DEFINITION */}
              <Card style={{ padding: 'var(--ds-space-4)' }}>
                <Stack gap={2}>
                  <Flex justify="space-between" align="center">
                    <strong style={{ fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-module-foundations-primary)' }}>
                      OpenAI Agents SDK Agent Definition
                    </strong>
                    <Badge variant="subtle">Python Reference</Badge>
                  </Flex>
                  <CodeBlock
                    language="python"
                    code={`from agents import Agent, Runner

# Define the Agent with curated document tools
agent = Agent(
    name="Policy Research Assistant",
    instructions=INSTRUCTIONS,
    model="gpt-5.4",
    tools=[list_docs, search_docs, read_doc],
)

# Run bounded loop with max_turns ceiling
result = await Runner.run(
    agent, 
    user_query, 
    max_turns=12
)`}
                  />
                </Stack>
              </Card>

              {/* SYSTEM INSTRUCTIONS */}
              <Card style={{ padding: 'var(--ds-space-4)' }}>
                <Stack gap={2}>
                  <Flex justify="space-between" align="center">
                    <strong style={{ fontSize: 'var(--ds-font-size-body)', color: '#c9a84c' }}>
                      Prompt Instructions Shaping the Loop
                    </strong>
                    <Badge variant="subtle">System Prompt</Badge>
                  </Flex>
                  <CodeBlock
                    language="python"
                    code={`INSTRUCTIONS = """
[Role]
You are a careful internal policy research assistant.

[Research Behavior]
1. Answer employee questions using the document tools.
2. Search and read documents until you have sufficient evidence.
3. Keep all conclusions strictly grounded in policy text.

[Expected Output]
- Provide a direct, actionable answer first.
- Explain the evidence and decision rules.
- Cite the exact document filenames used for every claim.
""".strip()`}
                  />
                </Stack>
              </Card>
            </Grid>
          </Stack>
        )}

        {/* ─── 3. THREE CURATED TOOLS SANDBOX ─── */}
        {activeSection === 'tools' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🧰 Interactive 3-Tool Execution Sandbox</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Test the 3 curated search tools live against the 6-document synthetic company policy corpus.
                    </p>
                  </div>
                  <Badge variant="info">In-Memory Policy Corpus (6 Docs)</Badge>
                </Flex>

                {/* TOOL SELECTOR BUTTONS */}
                <Grid columns={3} gap={3} style={{ marginTop: 'var(--ds-space-2)' }}>
                  {[
                    { id: 'list_docs', label: '1. list_docs()', icon: '📋', desc: 'Orient to corpus metadata without body text' },
                    { id: 'search_docs', label: '2. search_docs(query)', icon: '🔍', desc: 'Keyword token overlap search (Top 3 snippets)' },
                    { id: 'read_doc', label: '3. read_doc(doc_name)', icon: '📖', desc: 'Full text deep-read of candidate document' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTool(t.id)}
                      style={{
                        padding: 'var(--ds-space-3) var(--ds-space-4)',
                        borderRadius: 'var(--ds-radius-md)',
                        border: '1px solid',
                        borderColor: selectedTool === t.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                        background: selectedTool === t.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                        color: selectedTool === t.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: selectedTool === t.id ? 'bold' : 'normal'
                      }}
                    >
                      <div style={{ fontSize: 'var(--ds-font-size-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                        {t.desc}
                      </div>
                    </button>
                  ))}
                </Grid>

                {/* TOOL CONTROLS */}
                {selectedTool === 'search_docs' && (
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                      ENTER SEARCH QUERY (KEYWORD OVERLAP):
                    </label>
                    <Flex gap={2} style={{ marginTop: '4px' }}>
                      <input
                        type="text"
                        value={toolSearchQuery}
                        onChange={(e) => setToolSearchQuery(e.target.value)}
                        placeholder="e.g. conference hotel, 14 days advance, lost receipt, remote work"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 'var(--ds-radius-md)',
                          border: '1px solid var(--ds-color-border-subtle)',
                          background: 'var(--ds-color-bg-canvas)',
                          color: 'var(--ds-color-text-primary)'
                        }}
                      />
                      <Button size="sm" variant="primary" onClick={handleExecuteTool}>Search</Button>
                    </Flex>
                  </div>
                )}

                {selectedTool === 'read_doc' && (
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                      SELECT POLICY DOCUMENT TO READ:
                    </label>
                    <select
                      value={toolSelectedDoc}
                      onChange={(e) => setToolSelectedDoc(e.target.value)}
                      style={{
                        width: '100%',
                        marginTop: '4px',
                        padding: '8px 12px',
                        borderRadius: 'var(--ds-radius-md)',
                        border: '1px solid var(--ds-color-border-subtle)',
                        background: 'var(--ds-color-bg-canvas)',
                        color: 'var(--ds-color-text-primary)'
                      }}
                    >
                      {Object.keys(POLICY_DOCUMENTS).map(docKey => (
                        <option key={docKey} value={docKey}>{docKey} — {POLICY_DOCUMENTS[docKey].title}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* LIVE TOOL EXECUTION OUTPUT */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={2}>
                    <Flex justify="space-between" align="center">
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                        LIVE TOOL RETURN VALUE
                      </span>
                      <Badge variant="subtle">Python Dict / JSON Output</Badge>
                    </Flex>
                    <CodeBlock
                      language={typeof toolExecutionResult === 'string' ? 'markdown' : 'json'}
                      code={typeof toolExecutionResult === 'string' ? toolExecutionResult : JSON.stringify(toolExecutionResult, null, 2)}
                    />
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 4. AGENT TRACE (REAL RUN SIMULATOR) ─── */}
        {activeSection === 'trace' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                {/* SCENARIO SELECTOR */}
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>🔬 Multi-Scenario Agent Execution Trace Simulator</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                      Step through autonomous agent turns across 4 real enterprise scenarios.
                    </p>
                  </div>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant={isAutoPlaying ? "danger" : "primary"}
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    >
                      {isAutoPlaying ? "⏸ Pause Auto-Play" : "▶ Play Auto-Trace ⚡"}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setCurrentTurnIdx(0); setIsAutoPlaying(false); }}
                    >
                      🔄 Reset
                    </Button>
                  </Flex>
                </Flex>

                <Grid columns={4} gap={3}>
                  {AGENTIC_SCENARIOS.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => { setActiveScenarioId(sc.id); setCurrentTurnIdx(0); setIsAutoPlaying(false); }}
                      style={{
                        padding: 'var(--ds-space-3) var(--ds-space-4)',
                        borderRadius: 'var(--ds-radius-md)',
                        border: '1px solid',
                        borderColor: activeScenarioId === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                        background: activeScenarioId === sc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                        color: activeScenarioId === sc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: activeScenarioId === sc.id ? 'bold' : 'normal'
                      }}
                    >
                      <div style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold' }}>{sc.title.split(':')[0]}</div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '2px' }}>
                        {sc.title.split(':')[1]}
                      </div>
                    </button>
                  ))}
                </Grid>

                {/* SCENARIO QUERY CARD */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={2}>
                    <Flex justify="space-between" align="center">
                      <Badge variant="warning">{activeScenario.title}</Badge>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>{activeScenario.persona}</span>
                    </Flex>
                    <div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>USER QUESTION:</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: 'var(--ds-font-size-body)', fontStyle: 'italic', color: 'var(--ds-color-text-primary)' }}>
                        "{activeScenario.query}"
                      </p>
                    </div>
                  </Stack>
                </Card>

                {/* TELEMETRY & BUDGET TICKER */}
                <Grid columns={4} gap={3}>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Current Turn</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)' }}>
                      Turn {currentTurnIdx + 1} of {activeScenario.turns.length}
                    </div>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Accumulated Latency</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: '#2563EB' }}>
                      {totalLatencyMs}ms
                    </div>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Tokens Consumed</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: '#CA8A04' }}>
                      {totalPromptTokens + totalCompletionTokens}
                    </div>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Estimated Cost</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: '#10B981' }}>
                      ${estimatedCost}
                    </div>
                  </div>
                </Grid>

                {/* TURN STEPPER BAR */}
                <Stepper
                  activeStep={currentTurnIdx}
                  onStepClick={(idx) => { setCurrentTurnIdx(idx); setIsAutoPlaying(false); }}
                  steps={activeScenario.turns.map((t, idx) => ({
                    label: `Turn ${t.turn}`,
                    detail: t.tool.split('(')[0],
                    status: idx < currentTurnIdx ? 'complete' : idx === currentTurnIdx ? 'current' : 'upcoming'
                  }))}
                />

                {/* ACTIVE TURN CARD */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', border: `1px solid ${activeTurn.color}` }}>
                  <Stack gap={4}>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={2}>
                        <span style={{ fontSize: '1.4rem' }}>{activeTurn.icon}</span>
                        <strong style={{ fontSize: 'var(--ds-font-size-body)', color: activeTurn.color }}>
                          Turn {activeTurn.turn}: {activeTurn.tool}
                        </strong>
                      </Flex>
                      <Badge variant="subtle">Latency: +{activeTurn.latencyMs}ms</Badge>
                    </Flex>

                    {/* AGENT SCRATCHPAD THOUGHT */}
                    <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)', borderLeft: `3px solid ${activeTurn.color}` }}>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: activeTurn.color }}>
                        🧠 AGENT REASONING / SCRATCHPAD:
                      </span>
                      <p style={{ margin: '2px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)' }}>
                        {activeTurn.thought}
                      </p>
                    </div>

                    {/* TOOL INPUT & OUTPUT */}
                    <Grid columns={2} gap={3}>
                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>TOOL INPUT PARAMS:</span>
                        <CodeBlock language="json" code={JSON.stringify(activeTurn.input, null, 2)} />
                      </div>
                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>TOOL RETURNED OUTPUT:</span>
                        <CodeBlock language={typeof activeTurn.output === 'string' ? 'markdown' : 'json'} code={typeof activeTurn.output === 'string' ? activeTurn.output : JSON.stringify(activeTurn.output, null, 2)} />
                      </div>
                    </Grid>

                    {/* AGENT DECISION */}
                    <div>
                      <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                        🎯 AGENT'S DECISION AFTER TURN:
                      </span>
                      <p style={{ margin: '2px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', fontStyle: 'italic' }}>
                        "{activeTurn.decision}"
                      </p>
                    </div>
                  </Stack>
                </Card>

                {/* PLAYBACK STEPPER BUTTONS */}
                <Flex justify="space-between" align="center">
                  <Button
                    size="sm"
                    disabled={currentTurnIdx === 0}
                    onClick={() => { setCurrentTurnIdx(s => Math.max(0, s - 1)); setIsAutoPlaying(false); }}
                  >
                    ← Previous Turn
                  </Button>

                  <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                    Turn {currentTurnIdx + 1} of {activeScenario.turns.length}
                  </span>

                  <Button
                    size="sm"
                    variant="primary"
                    disabled={currentTurnIdx >= activeScenario.turns.length - 1}
                    onClick={() => { setCurrentTurnIdx(s => Math.min(activeScenario.turns.length - 1, s + 1)); setIsAutoPlaying(false); }}
                  >
                    Next Turn →
                  </Button>
                </Flex>

                {/* FINAL ANSWER DISPLAY */}
                {currentTurnIdx >= activeScenario.turns.length - 1 && (
                  <Card style={{ padding: 'var(--ds-space-5)', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Stack gap={3}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="success">✅ Final Grounded Answer Synthesized</Badge>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#10B981', fontWeight: 'bold' }}>100% Policy Grounded</span>
                      </Flex>
                      <p style={{ margin: 0, fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-text-primary)', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {activeScenario.finalAnswer}
                      </p>
                      <div>
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>VERIFIED POLICY CITATIONS:</span>
                        <Flex gap={2} style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                          {activeScenario.citations.map((c, i) => (
                            <Badge key={i} variant="subtle" style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                              📄 {c}
                            </Badge>
                          ))}
                        </Flex>
                      </div>
                    </Stack>
                  </Card>
                )}
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── 5. FIVE DESIGN DECISIONS & ARCHITECTURE CALCULATOR ─── */}
        {activeSection === 'decisions' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(37,99,235,0.12) 100%)' }}>
              <Stack gap={3}>
                <Badge variant="success">System Design Framework</Badge>
                <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>5 Decisions Before You Build Agentic RAG</h2>
                <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)', margin: 0 }}>
                  Agentic loops add flexibility but increase latency and token consumption. Use the architecture calculator below to determine whether your project needs Single-Shot RAG, Curated Agentic Loops, or Multi-Agent Swarms.
                </p>
              </Stack>
            </Card>

            {/* INTERACTIVE ARCHITECTURE SCORECARD CALCULATOR */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <h3 style={{ margin: 0 }}>⚙️ Interactive RAG Architecture Selector</h3>

                <Grid columns={3} gap={3}>
                  <div>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>1. Corpus Scale</label>
                    <select
                      value={calcScale}
                      onChange={(e) => setCalcScale(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)' }}
                    >
                      <option value="small">Small (5 – 50 documents)</option>
                      <option value="medium">Medium (50 – 5,000 documents)</option>
                      <option value="massive">Enterprise (10,000+ documents)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>2. Latency SLA</label>
                    <select
                      value={calcSla}
                      onChange={(e) => setCalcSla(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)' }}
                    >
                      <option value="subsecond">Sub-Second (&lt;800ms) Inline</option>
                      <option value="balanced">Interactive (&lt;3.0s) Assistant</option>
                      <option value="deep_research">Deep Research (&lt;15s) Audit</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>3. Reasoning Complexity</label>
                    <select
                      value={calcComplexity}
                      onChange={(e) => setCalcComplexity(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)' }}
                    >
                      <option value="factoid">Single-Hop Factoid Lookup</option>
                      <option value="multi_hop">Multi-Hop & Conflict Resolution</option>
                      <option value="synthesis">Global Synthesis / Multi-Doc</option>
                    </select>
                  </div>
                </Grid>

                {/* ARCHITECTURE VERDICT */}
                <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: '1px solid var(--ds-color-module-foundations-primary)' }}>
                  <Stack gap={1}>
                    <Badge variant="primary">Recommended Architecture Verdict</Badge>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)', marginTop: '4px' }}>
                      {calcSla === 'subsecond' || calcComplexity === 'factoid'
                        ? '⚡ Single-Shot RAG with Zero-Model Fast Router'
                        : calcScale === 'massive' || calcComplexity === 'synthesis'
                        ? '🕸️ Hierarchical GraphRAG + Multi-Agent Dispatcher'
                        : '🔄 Bounded Agentic RAG Loop with Curated Tools (3-5 Turns)'}
                    </div>
                    <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                      {calcSla === 'subsecond'
                        ? 'For sub-second latency SLAs, avoid multi-turn agent loops. Use pre-computed dense embeddings with a zero-model router.'
                        : calcComplexity === 'multi_hop'
                        ? 'For multi-hop questions with document cross-referencing, use an iterative Search ➔ Read ➔ Decide agent loop with max_turns=6.'
                        : 'For large-scale enterprise aggregation, split tasks across a Planner-Retriever-Writer multi-agent swarm.'}
                    </p>
                  </Stack>
                </div>
              </Stack>
            </Card>

            {/* 5 CORE DESIGN QUESTIONS */}
            <Section variant="bordered">
              <Section.Header>
                <h3 style={{ margin: 0 }}>The 5 Core Design Questions Explained</h3>
              </Section.Header>
              <Grid columns={2} gap={4}>
                {[
                  {
                    num: 'Q1',
                    icon: '🎛️',
                    title: 'How much freedom should the agent have?',
                    ans: 'Start with curated tools (list_docs, search_docs, read_doc). Avoid giving raw bash or unrestricted file system access unless strictly necessary.',
                    rec: 'Curated tools are easy to audit, test, and sandbox.'
                  },
                  {
                    num: 'Q2',
                    icon: '🗂️',
                    title: 'Should the agent search raw text only?',
                    ans: 'No. Build a knowledge metadata layer (titles, effective dates, section summaries). This allows the agent to orient before committing to full reads.',
                    rec: 'list_docs() returns metadata without burning context tokens on body text.'
                  },
                  {
                    num: 'Q3',
                    icon: '🧮',
                    title: 'Do we still need embeddings?',
                    ans: 'Maybe. For small curated corpora, keyword token overlap is fast, cheap, and 100% interpretable. For large corpora, add embeddings as a tool action.',
                    rec: 'Start with keyword search; add vector retrieval as a secondary tool action.'
                  },
                  {
                    num: 'Q4',
                    icon: '🤝',
                    title: 'Should one agent handle everything?',
                    ans: 'Start with a single agent. Only introduce multi-agent swarms (Planner-Retriever-Writer) when task complexity exceeds a single model context.',
                    rec: 'Single agent = lower latency and easier debugging.'
                  },
                  {
                    num: 'Q5',
                    icon: '⚖️',
                    title: 'Should we always default to Agentic RAG?',
                    ans: 'No. Agentic RAG increases latency and cost. Always use deterministic single-shot RAG for factoids, and reserve agentic loops for multi-hop questions.',
                    rec: 'Use the Dispatcher pattern to route queries dynamically.'
                  }
                ].map((q, idx) => (
                  <Card key={idx} style={{ padding: 'var(--ds-space-4)' }}>
                    <Stack gap={2}>
                      <Flex justify="space-between" align="center">
                        <Badge variant="primary">{q.num}</Badge>
                        <span style={{ fontSize: '1.4rem' }}>{q.icon}</span>
                      </Flex>
                      <strong style={{ fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-text-primary)' }}>{q.title}</strong>
                      <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: 0, lineHeight: '1.6' }}>{q.ans}</p>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-2) var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-module-foundations-primary)', fontWeight: 'bold' }}>
                        💡 Recommendation: {q.rec}
                      </div>
                    </Stack>
                  </Card>
                ))}
              </Grid>
            </Section>
          </Stack>
        )}
      </Container>
    </div>
  );
}
