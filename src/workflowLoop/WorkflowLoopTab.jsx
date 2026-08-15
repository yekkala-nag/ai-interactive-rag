import { useState, useMemo } from 'react';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { CodeBlock } from '../components/ui/Content.jsx';
import { Container, Section, Grid, Flex, Stack } from '../components/layout/Primitives.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  DEFAULT_ACTIVATIONS,
  WORKFLOW_SCENARIOS,
  decidePipelinePatterns,
  shouldContinue,
  expandQuerySafely
} from './workflowEngine.js';

export function WorkflowLoopTab() {
  const [activeSubTab, setActiveSubTab] = useState('simulator'); // simulator | dispatcher | guardrails | audit | code
  const [selectedScenarioId, setSelectedScenarioId] = useState('transformer_reg');
  const [currentPassIndex, setCurrentPassIndex] = useState(0);

  // Dispatcher interactive playground states
  const [docProfileState, setDocProfileState] = useState({
    has_usable_toc: true,
    is_likely_scanned: false,
    total_pages: 15,
  });
  const [queryIntentState, setQueryIntentState] = useState('listing');
  const [sectionHintState, setSectionHintState] = useState('5.4');
  const [layoutHintState, setLayoutHintState] = useState('table');

  const selectedScenario = useMemo(() => {
    return WORKFLOW_SCENARIOS.find(s => s.id === selectedScenarioId) || WORKFLOW_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Compute Dispatcher activations for the selected scenario
  const scenarioActivations = useMemo(() => {
    return decidePipelinePatterns(selectedScenario.question, selectedScenario.document);
  }, [selectedScenario]);

  // Compute live Dispatcher activations in the playground
  const playgroundActivations = useMemo(() => {
    const mockQuestion = {
      intent: queryIntentState,
      retrieval: {
        section_hint: sectionHintState || null,
        layout_hint: layoutHintState || null,
      }
    };
    return decidePipelinePatterns(mockQuestion, docProfileState);
  }, [docProfileState, queryIntentState, sectionHintState, layoutHintState]);

  const currentPass = selectedScenario.passes[currentPassIndex] || selectedScenario.passes[0];
  const isFinalPass = currentPassIndex === selectedScenario.passes.length - 1;

  const currentPassHistory = selectedScenario.passes.slice(0, currentPassIndex);
  const guardDecision = shouldContinue(currentPassHistory, currentPass.feedback);

  const handleScenarioChange = (id) => {
    setSelectedScenarioId(id);
    setCurrentPassIndex(0);
  };

  return (
    <Container size="normal" style={{ paddingTop: 'var(--ds-space-4)', paddingBottom: 'var(--ds-space-8)' }}>
      {/* HEADER BANNER */}
      <Section variant="bordered" style={{
        marginBottom: 'var(--ds-space-6)',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <Badge variant="primary" size="sm" dot>Enterprise Document Intelligence [Vol.1 #13]</Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-tertiary)' }}>RAG Workflow & Loop Engineering</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0 8px 0', color: 'var(--ds-color-text-primary)' }}>
          The Dispatcher: When to Loop & When to Stop
        </h1>
        <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.95rem', maxWidth: '880px', lineHeight: 1.5, margin: 0 }}>
          Instead of handing orchestration to an unconstrained LLM agent, enterprise RAG keeps control in code. A <strong style={{ color: '#06b6d4' }}>Dispatcher</strong> sets pattern activations upfront, while a <strong style={{ color: '#10b981' }}>Bounded Loop</strong> with safety guards decides when to iterate and when to stop.
        </p>
      </Section>

      {/* ARCHITECTURAL INFOGRAPHIC CARD */}
      <div style={{ marginBottom: 'var(--ds-space-6)' }}>
        <DiagramImage
          src="/assets/rag_workflow_loop_dispatcher.png"
          alt="Enterprise RAG Workflow and Loop Engineering Dispatcher Architecture"
          title="Workflow & Loop Engineering — Dispatcher & Bounded Feedback Architecture"
          caption="Incoming question and document profile trigger deterministic pattern activations. The bounded orchestrator runs Pass 1, evaluates typed feedback flags, routes recovery actions via feedback rails (Pass 2 Two-Hop Resolution), and halts safely via should_continue guardrails."
          background="#0a0f1d"
          maxWidth={1200}
        />
      </div>

      {/* NAVIGATION SUB-TABS */}
      <div style={{
        display: 'flex', gap: '8px', overflowX: 'auto',
        paddingBottom: '8px', marginBottom: 'var(--ds-space-6)',
        borderBottom: '1px solid var(--ds-color-border-subtle)'
      }}>
        {[
          { id: 'simulator', label: '⚡ Live Loop Simulator', icon: '⚡' },
          { id: 'dispatcher', label: '🧭 Dispatcher Matrix', icon: '🧭' },
          { id: 'guardrails', label: '🛑 Termination Guardrails', icon: '🛑' },
          { id: 'audit', label: '📋 Compliance Audit Trail', icon: '📋' },
          { id: 'code', label: '💻 Python Production Code', icon: '💻' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--ds-radius-md)',
              border: activeSubTab === tab.id ? '2px solid #06b6d4' : '1px solid var(--ds-color-border-default)',
              background: activeSubTab === tab.id ? 'rgba(6, 182, 212, 0.1)' : 'var(--ds-color-bg-surface)',
              color: activeSubTab === tab.id ? '#06b6d4' : 'var(--ds-color-text-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. LIVE LOOP EXECUTION SIMULATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'simulator' && (
        <Section variant="bordered">
          <Section.Header>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Live Bounded Loop Execution Simulator
                </h2>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                  Step through multi-pass feedback loops, observe typed signals, and trace recovery actions in real time.
                </p>
              </div>

              {/* Step Controls */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPassIndex(Math.max(0, currentPassIndex - 1))}
                  disabled={currentPassIndex === 0}
                >
                  ⏮ Prev Pass
                </Button>
                <span style={{ fontSize: '0.8rem', fontFamily: 'var(--ds-font-family-mono)', padding: '0 4px', fontWeight: 700 }}>
                  Pass {currentPassIndex + 1} of {selectedScenario.passes.length}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentPassIndex(Math.min(selectedScenario.passes.length - 1, currentPassIndex + 1))}
                  disabled={isFinalPass}
                >
                  ▶ Next Pass
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPassIndex(0)}
                  title="Reset to Pass 1"
                >
                  🔄
                </Button>
              </div>
            </div>
          </Section.Header>

          <Section.Body>
            {/* Scenario Selector Chips */}
            <div style={{ marginBottom: 'var(--ds-space-4)' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Select Enterprise Scenario:
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {WORKFLOW_SCENARIOS.map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => handleScenarioChange(sc.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: selectedScenarioId === sc.id ? '1px solid #06b6d4' : '1px solid var(--ds-color-border-default)',
                      background: selectedScenarioId === sc.id ? 'rgba(6, 182, 212, 0.12)' : 'var(--ds-color-bg-surface)',
                      color: selectedScenarioId === sc.id ? '#06b6d4' : 'inherit',
                      fontSize: '0.8rem',
                      fontWeight: selectedScenarioId === sc.id ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    {sc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario Context Card */}
            <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '14px', marginBottom: 'var(--ds-space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--ds-color-text-tertiary)', fontWeight: 700, marginBottom: '2px' }}>
                    Document: {selectedScenario.document.name}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>
                    "{selectedScenario.question.original_question}"
                  </div>
                </div>

                {/* Dispatcher Activations Pill Row */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {Object.entries(scenarioActivations).map(([key, active]) => (
                    <span
                      key={key}
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--ds-font-family-mono)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: active ? 'rgba(6, 182, 212, 0.15)' : 'var(--ds-color-bg-surfaceHover)',
                        color: active ? '#06b6d4' : 'var(--ds-color-text-tertiary)',
                        border: `1px solid ${active ? 'rgba(6, 182, 212, 0.4)' : 'transparent'}`,
                        fontWeight: active ? 700 : 400
                      }}
                    >
                      {key}: {active ? 'ON' : 'OFF'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PASS EXECUTION DETAILS GRID */}
            <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-4)">
              {/* Left Box: Execution Step & Candidate Passages */}
              <div style={{
                background: 'var(--ds-color-bg-surface)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge variant={isFinalPass ? 'success' : 'primary'} size="sm">
                      Pass #{currentPass.passNumber}
                    </Badge>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>
                      {currentPass.stepName}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)' }}>
                    {currentPass.candidates.length} passage(s) retrieved
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.4, background: 'var(--ds-color-bg-canvas)', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--ds-color-border-subtle)' }}>
                  <strong>Action:</strong> {currentPass.action}
                </div>

                {/* Candidate Passages */}
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ds-color-text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    Retrieved Context Candidates:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {currentPass.candidates.map(cand => (
                      <div
                        key={cand.id}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--ds-color-border-subtle)',
                          background: 'var(--ds-color-bg-canvas)',
                          fontSize: '0.78rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 600, color: '#06b6d4' }}>
                          <span>Page {cand.page} · {cand.section}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--ds-color-text-tertiary)' }}>ID: {cand.id}</span>
                        </div>
                        <div style={{ color: 'var(--ds-color-text-secondary)', lineHeight: 1.35 }}>
                          "{cand.snippet}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Synthesized Output Draft */}
                <div style={{ marginTop: 'auto', background: isFinalPass ? 'rgba(16, 185, 129, 0.06)' : 'rgba(6, 182, 212, 0.06)', border: `1px solid ${isFinalPass ? '#10b981' : '#06b6d4'}`, borderRadius: '6px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: isFinalPass ? '#10b981' : '#06b6d4', fontWeight: 700, marginBottom: '4px' }}>
                    {isFinalPass ? '✅ Final Verified Cited Answer:' : '📝 Pass Draft Output:'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-primary)', lineHeight: 1.45, fontWeight: isFinalPass ? 600 : 400 }}>
                    {currentPass.draftAnswer}
                  </div>
                </div>
              </div>

              {/* Right Box: Typed Feedback & Guardrail Decision Gate */}
              <div style={{
                background: 'var(--ds-color-bg-surface)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>
                      Typed Feedback Signals
                    </span>
                    <Badge variant={currentPass.feedback.complete_answer_found ? 'success' : 'warning'} size="sm">
                      complete_answer: {currentPass.feedback.complete_answer_found ? 'TRUE' : 'FALSE'}
                    </Badge>
                  </div>

                  {/* Feedback Metrics Table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', fontFamily: 'var(--ds-font-family-mono)', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--ds-color-bg-canvas)', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--ds-color-text-secondary)' }}>Confidence Score:</span>
                      <strong style={{ color: currentPass.feedback.confidence >= 0.8 ? '#10b981' : '#f59e0b' }}>
                        {(currentPass.feedback.confidence * 100).toFixed(0)}%
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--ds-color-bg-canvas)', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--ds-color-text-secondary)' }}>Context Structured:</span>
                      <strong style={{ color: currentPass.feedback.context_structured ? '#10b981' : '#ef4444' }}>
                        {currentPass.feedback.context_structured ? 'True' : 'False (Requires Adaptive OCR)'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--ds-color-bg-canvas)', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--ds-color-text-secondary)' }}>Pending References:</span>
                      <strong style={{ color: currentPass.feedback.pending_references?.length ? '#06b6d4' : '#10b981' }}>
                        {currentPass.feedback.pending_references?.length ? JSON.stringify(currentPass.feedback.pending_references) : 'None'}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', background: 'var(--ds-color-bg-canvas)', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--ds-color-text-secondary)' }}>Active Loop Trigger:</span>
                      <strong style={{ color: '#06b6d4' }}>
                        {currentPass.feedback.trigger}
                      </strong>
                    </div>
                  </div>

                  {/* Recovery Action Banner */}
                  <div style={{ padding: '8px 10px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#06b6d4', fontWeight: 700, marginBottom: '2px' }}>
                      Queued Recovery Action:
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--ds-color-text-primary)' }}>
                      {currentPass.feedback.recovery_action}
                    </div>
                  </div>
                </div>

                {/* Guardrail Decision Gate */}
                <div style={{
                  background: guardDecision.shouldContinue ? 'linear-gradient(135deg, #083344 0%, #0f172a 100%)' : 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
                  border: `1px solid ${guardDecision.shouldContinue ? '#06b6d4' : '#10b981'}`,
                  borderRadius: '6px',
                  padding: '10px 12px',
                  color: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, color: guardDecision.shouldContinue ? '#67e8f9' : '#6ee7b7' }}>
                      should_continue() Decision Gate:
                    </span>
                    <Badge variant={guardDecision.shouldContinue ? 'primary' : 'success'} size="sm">
                      {guardDecision.shouldContinue ? 'CONTINUE LOOP' : 'HALT & RETURN'}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                    {guardDecision.reason}
                  </div>
                </div>
              </div>
            </Grid>
          </Section.Body>
        </Section>
      )}

      {/* ========================================================================= */}
      {/* 2. DISPATCHER DECISION MATRIX & PROFILER */}
      {/* ========================================================================= */}
      {activeSubTab === 'dispatcher' && (
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Interactive Dispatcher Decision Matrix
            </h2>
            <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Experiment with document properties and query intents to see how <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>decide_pipeline_patterns()</code> maps inputs to deterministic execution flags.
            </p>
          </Section.Header>

          <Section.Body>
            <Grid columns={{ base: '1fr', lg: '1fr 1fr' }} gap="var(--ds-space-6)">
              {/* Controls Column */}
              <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 12px 0' }}>
                  Document Profile & Intent Controls
                </h3>

                {/* TOC Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Document Has Usable TOC</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)' }}>Detected bookmarks/TOC hierarchy in PDF metadata</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={docProfileState.has_usable_toc}
                    onChange={e => setDocProfileState(prev => ({ ...prev, has_usable_toc: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>

                {/* Scanned Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Is Likely Scanned / Degraded</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)' }}>Contains rasterized pages or noisy OCR</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={docProfileState.is_likely_scanned}
                    onChange={e => setDocProfileState(prev => ({ ...prev, is_likely_scanned: e.target.checked }))}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>

                {/* Intent Selector */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    Parsed Question Intent:
                  </label>
                  <select
                    value={queryIntentState}
                    onChange={e => setQueryIntentState(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--ds-color-border-default)',
                      background: 'var(--ds-color-bg-canvas)',
                      color: 'var(--ds-color-text-primary)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <option value="listing">listing (e.g. "What are all categories under GOVERN?")</option>
                    <option value="section_retrieval">section_retrieval (e.g. "What does Clause 14 specify?")</option>
                    <option value="open_scoped">open_scoped (e.g. "Explain force majeure obligations")</option>
                    <option value="open_corpus_wide">open_corpus_wide (e.g. "Find all references to ESG reporting")</option>
                  </select>
                </div>

                {/* Section & Layout Hints */}
                <Grid columns="1fr 1fr" gap="8px">
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                      Section Hint:
                    </label>
                    <input
                      type="text"
                      value={sectionHintState}
                      onChange={e => setSectionHintState(e.target.value)}
                      placeholder="e.g. 5.4, Clause 8"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--ds-color-border-default)', fontSize: '0.78rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                      Layout Hint:
                    </label>
                    <input
                      type="text"
                      value={layoutHintState}
                      onChange={e => setLayoutHintState(e.target.value)}
                      placeholder="e.g. table, figure"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--ds-color-border-default)', fontSize: '0.78rem' }}
                    />
                  </div>
                </Grid>
              </div>

              {/* Output Activations Matrix */}
              <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 12px 0' }}>
                  Computed Activations Matrix (<code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>Activations</code>)
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(playgroundActivations).map(([flag, isActive]) => (
                    <div
                      key={flag}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isActive ? '#06b6d4' : 'var(--ds-color-border-subtle)'}`,
                        background: isActive ? 'rgba(6, 182, 212, 0.08)' : 'var(--ds-color-bg-canvas)',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: isActive ? '#06b6d4' : 'var(--ds-color-text-primary)' }}>
                          {flag}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--ds-color-text-tertiary)' }}>
                          {flag === 'toc_retrieval' && 'Enabled when document has structured bookmarks'}
                          {flag === 'keyword_retrieval' && 'Always-on primary deterministic filter'}
                          {flag === 'dense_retrieval' && 'Enabled for open-scoped conceptual search'}
                          {flag === 'two_hop_references' && 'Enabled for section/table cross-referencing'}
                          {flag === 'listing_aggregation' && 'Enabled to prevent missing list items'}
                          {flag === 'adaptive_parsing' && 'Enabled to repair OCR degradation'}
                          {flag === 'iterative_feedback' && 'Safety rail monitoring typed generation flags'}
                        </div>
                      </div>
                      <Badge variant={isActive ? 'primary' : 'default'} size="sm">
                        {isActive ? 'ENABLED (True)' : 'DISABLED (False)'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
          </Section.Body>
        </Section>
      )}

      {/* ========================================================================= */}
      {/* 3. TERMINATION GUARDRAILS & SAFETY */}
      {/* ========================================================================= */}
      {activeSubTab === 'guardrails' && (
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              The 4 Termination Guardrails & Query Drift Defense
            </h2>
            <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Why unconstrained agent loops fail in production, and how <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>should_continue()</code> halts safely.
            </p>
          </Section.Header>

          <Section.Body>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)" style={{ marginBottom: 'var(--ds-space-6)' }}>
              {/* Guard 1 */}
              <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🎯</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    1. Candidate Set Stability
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  If Pass 2 returns the exact same candidate passage IDs as Pass 1, further iteration is guaranteed to produce the same result. The loop halts immediately instead of burning iterations.
                </p>
              </div>

              {/* Guard 2 */}
              <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🔄</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    2. Keyword Suggestion Stability
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  If the LLM repeats identical vocabulary expansion terms (<code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>llm_discovered_keywords</code>), the generator has reached a knowledge ceiling. Stop iterating.
                </p>
              </div>

              {/* Guard 3 */}
              <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>📉</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    3. Confidence Drop Threshold
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  If confidence drops by more than 0.10 between passes, the expansion is degrading context. The loop halts and returns the highest-confidence prior answer.
                </p>
              </div>

              {/* Guard 4 */}
              <div style={{ background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🧱</span>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                    4. Hard Max Iteration Bound
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Hard ceiling of <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>max_iterations = 4</code> (default 3). If exhausted, the pipeline returns the provisional answer with an explicit audit flag rather than crashing.
                </p>
              </div>
            </Grid>

            {/* Drift Defense Callout */}
            <Callout type="warning" title="Query Drift Defense (expand_query_safely)">
              <p style={{ margin: '6px 0 0 0', fontSize: '0.82rem', lineHeight: 1.6 }}>
                <strong>The Threat</strong>: Repeated LLM re-writes drift away from original user intent (e.g. <em>"premium"</em> ➔ <em>"insurance"</em> ➔ <em>"reinsurance economics"</em>).<br />
                <strong>The Fix</strong>: Original anchor keywords are permanently frozen in place. Discovered terms are appended and capped at 15 keywords max.
              </p>
            </Callout>
          </Section.Body>
        </Section>
      )}

      {/* ========================================================================= */}
      {/* 4. COMPLIANCE AUDIT TRAIL */}
      {/* ========================================================================= */}
      {activeSubTab === 'audit' && (
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Enterprise Compliance Audit Trail (<code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>IterationRecord</code>)
            </h2>
            <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Full reproducible record of every pass, trigger, candidate diff, and recovery action for compliance audits.
            </p>
          </Section.Header>

          <Section.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedScenario.passes.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'var(--ds-color-bg-surface)',
                    border: '1px solid var(--ds-color-border-subtle)',
                    borderRadius: '8px',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge variant={idx === selectedScenario.passes.length - 1 ? 'success' : 'primary'} size="sm">
                        Iteration #{p.passNumber}
                      </Badge>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.stepName}</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--ds-font-family-mono)', color: 'var(--ds-color-text-tertiary)' }}>
                      Trigger: {p.feedback.trigger}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                    <strong>Action:</strong> {p.action}
                  </div>

                  {/* Audit JSON Payload */}
                  <CodeBlock
                    language="json"
                    code={JSON.stringify({
                      iteration_number: p.passNumber,
                      trigger: p.feedback.trigger,
                      action_taken: p.feedback.recovery_action,
                      confidence_score: p.feedback.confidence,
                      complete_answer_found: p.feedback.complete_answer_found,
                      pending_references: p.feedback.pending_references,
                      candidate_count: p.candidates.length,
                    }, null, 2)}
                  />
                </div>
              ))}
            </div>
          </Section.Body>
        </Section>
      )}

      {/* ========================================================================= */}
      {/* 5. PYTHON PRODUCTION CODE */}
      {/* ========================================================================= */}
      {activeSubTab === 'code' && (
        <Section variant="bordered">
          <Section.Header>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Production Python Implementation
            </h2>
            <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Full workflow code for <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>pdf_qa_loop</code>, <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>decide.py</code>, and <code style={{ fontFamily: 'var(--ds-font-family-mono)' }}>iterate_with_bound</code>.
            </p>
          </Section.Header>

          <Section.Body>
            <CodeBlock
              language="python"
              code={`# Enterprise Document Intelligence [Vol.1 #13]
# RAG Workflow & Loop Engineering: Dispatcher & Bounded Feedback Loops
from typing import Callable, Any, NamedTuple, Literal
import copy

class IterationRecord(NamedTuple):
    iteration: int
    trigger: str
    action_taken: str
    confidence: float
    candidates_count: int

def decide_pipeline_patterns(parsed: Any, doc_profile: Any) -> dict[str, bool]:
    """
    Dispatcher: Encodes team's routing wisdom deterministically in code.
    Returns activation flags for Part III patterns.
    """
    activations = {
        "toc_retrieval": False,
        "keyword_retrieval": True,
        "dense_retrieval": False,
        "two_hop_references": False,
        "listing_aggregation": False,
        "adaptive_parsing": False,
        "iterative_feedback": True,
    }
    
    # 1. TOC retrieval: enable whenever document carries usable bookmarks
    if getattr(doc_profile, "has_usable_toc", False):
        activations["toc_retrieval"] = True
        
    # 2. Dense retrieval fallback for conceptual/open queries
    if getattr(parsed, "intent", "") in ("open_scoped", "open_corpus_wide"):
        activations["dense_retrieval"] = True
        
    # 3. Two-hop references: enable on structural hints or cross-section cues
    if getattr(parsed.retrieval, "section_hint", None) or getattr(parsed.retrieval, "layout_hint", None):
        activations["two_hop_references"] = True
    if getattr(parsed, "intent", "") in ("section_retrieval", "open_scoped"):
        activations["two_hop_references"] = True
        
    # 4. Listing aggregation: enable when question asks for full enumeration
    if getattr(parsed, "intent", "") == "listing":
        activations["listing_aggregation"] = True
        
    # 5. Adaptive parsing: enable if document contains scanned pages
    if getattr(doc_profile, "is_likely_scanned", False):
        activations["adaptive_parsing"] = True
        
    return activations

def should_continue(history: list, current: Any, confidence_drop_threshold: float = 0.1) -> bool:
    """
    Decision Gate: Decides whether loop should run another pass.
    3 Reasons to stop:
    1. Candidate stability (same passages as last pass).
    2. Keyword stability (repeating LLM suggestions).
    3. Decreasing confidence (loop degrading quality).
    """
    if history:
        prev = history[-1]
        if getattr(prev, "candidates", None) == current.candidates:
            return False
        if getattr(prev, "suggested_keywords", None) == current.suggested_keywords:
            return False
        prev_conf = getattr(prev, "confidence", None)
        if prev_conf is not None and current.confidence < prev_conf - confidence_drop_threshold:
            return False
    return current.needs_iteration()

def iterate_with_bound(
    *,
    initial_state: Any,
    run_pass: Callable[[Any], Any],
    is_satisfactory: Callable[[Any], bool],
    adjust: Callable[[Any, Any], Any],
    record: Callable[[int, Any, Any, Any], IterationRecord],
    max_iterations: int = 3,
) -> tuple[Any, list[IterationRecord], bool]:
    """Runs a bounded pipeline feedback loop with complete audit history."""
    state = initial_state
    history: list[IterationRecord] = []
    result = run_pass(state)
    prev_result = None
    
    if is_satisfactory(result):
        history.append(record(0, result, state, prev_result))
        return result, history, False
        
    for i in range(1, max_iterations):
        next_state = adjust(state, result)
        history.append(record(i, result, next_state, prev_result))
        prev_result = result
        state = next_state
        result = run_pass(state)
        if is_satisfactory(result):
            return result, history, False
            
    return result, history, True # Exhausted bound gracefully`}
            />
          </Section.Body>
        </Section>
      )}
    </Container>
  );
}

export default WorkflowLoopTab;
