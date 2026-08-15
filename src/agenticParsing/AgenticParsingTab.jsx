import { useState, useMemo, useCallback } from 'react';
import {
  detectDocumentNature,
  planParsingMethods,
  runStepAdapter,
  synthesizeParsingOutputs,
  PARSER_IDENTITY_CARDS,
  PARSING_FAMILIES,
  SAMPLE_BENCHMARK_PDFS,
} from './index.js';

export default function AgenticParsingTab() {
  // Main sub-view state
  const [activeSubTab, setActiveSubTab] = useState('dispatcher');

  // Selected sample preset
  const [selectedPresetId, setSelectedPresetId] = useState('attention-paper');
  const activePreset = useMemo(
    () => SAMPLE_BENCHMARK_PDFS.find(p => p.id === selectedPresetId) || SAMPLE_BENCHMARK_PDFS[0],
    [selectedPresetId]
  );

  // Editable / Toggable Nature Signals for interactive simulation
  const [interactiveSignals, setInteractiveSignals] = useState({
    is_scanned: activePreset.natureProfile.is_scanned,
    has_native_outline: activePreset.natureProfile.has_native_outline,
    has_sommaire: activePreset.natureProfile.has_sommaire,
    is_composite: activePreset.natureProfile.is_composite,
    has_rich_figures: activePreset.natureProfile.has_rich_figures,
    has_tables_signal: activePreset.natureProfile.has_tables_signal,
  });

  // Keep interactive signals in sync when preset changes
  const handlePresetSelect = (presetId) => {
    setSelectedPresetId(presetId);
    const p = SAMPLE_BENCHMARK_PDFS.find(x => x.id === presetId);
    if (p) {
      setInteractiveSignals({
        is_scanned: p.natureProfile.is_scanned,
        has_native_outline: p.natureProfile.has_native_outline,
        has_sommaire: p.natureProfile.has_sommaire,
        is_composite: p.natureProfile.is_composite,
        has_rich_figures: p.natureProfile.has_rich_figures,
        has_tables_signal: p.natureProfile.has_tables_signal,
      });
      setExecutedPlan(null);
      setExecutionLogs([]);
      setSynthesizedCorpus(null);
    }
  };

  const toggleSignal = (key) => {
    setInteractiveSignals(prev => {
      const next = { ...prev, [key]: !prev[key] };
      // Mutual exclusion rules for clean simulation
      if (key === 'is_scanned' && next.is_scanned) {
        next.has_native_outline = false;
        next.has_sommaire = false;
      }
      return next;
    });
    setExecutedPlan(null);
    setExecutionLogs([]);
    setSynthesizedCorpus(null);
  };

  // Recompute nature and plan dynamically based on signals
  const currentNature = useMemo(() => {
    const fakeLines = interactiveSignals.is_scanned ? [] : (activePreset.sampleLines || []);
    const fakeToc = interactiveSignals.has_native_outline ? (activePreset.nativeBookmarks || []) : [];
    const fakeImages = interactiveSignals.has_rich_figures ? (activePreset.sampleFigures || [{ id: '1' }]) : [];

    const rawNature = detectDocumentNature({
      lineDf: fakeLines,
      spanDf: fakeLines,
      nativeToc: fakeToc,
      pageCount: activePreset.pageCount,
      images: fakeImages,
    });

    // Override with user's interactive toggles
    return {
      ...rawNature,
      signals: interactiveSignals,
      label: interactiveSignals.is_scanned
        ? 'scanned-image'
        : interactiveSignals.has_native_outline && interactiveSignals.has_rich_figures
        ? 'rich-multimodal-paper'
        : interactiveSignals.has_native_outline
        ? 'native-with-outline'
        : interactiveSignals.has_sommaire
        ? 'native-sommaire'
        : interactiveSignals.has_tables_signal
        ? 'table-heavy-document'
        : 'native-body-typography',
      description: interactiveSignals.is_scanned
        ? 'Scanned raster PDF with no digital text layer; triggers OCR engine'
        : interactiveSignals.has_native_outline
        ? 'Digital PDF with native PDF bookmarks / outline metadata'
        : interactiveSignals.has_sommaire
        ? 'Digital PDF with printed Table of Contents (dot-leader sommaire)'
        : 'Digital PDF with body typography headings; triggers Case 4 loop',
    };
  }, [interactiveSignals, activePreset]);

  const currentPlan = useMemo(() => {
    return planParsingMethods(currentNature);
  }, [currentNature]);

  // Execution Simulator State
  const [executing, setExecuting] = useState(false);
  const [executedPlan, setExecutedPlan] = useState(null);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [synthesizedCorpus, setSynthesizedCorpus] = useState(null);
  const [selectedCorpusFrame, setSelectedCorpusFrame] = useState('toc_df');
  const [simulateErrorOnStep, setSimulateErrorOnStep] = useState(null);

  // Run the 4-stage pipeline
  const handleRunPipeline = async () => {
    setExecuting(true);
    setExecutionLogs([]);
    const logs = [];
    const stepOutputs = [];

    logs.push(`[Stage 1: Nature] Probed 6 deterministic flags -> Label: ${currentNature.label} (0 LLMs)`);
    setExecutionLogs([...logs]);
    await new Promise(r => setTimeout(r, 200));

    logs.push(`[Stage 2: Plan] Generated ${currentPlan.length}-step ordered execution plan with error isolation rules`);
    setExecutionLogs([...logs]);
    await new Promise(r => setTimeout(r, 250));

    // Stage 3: Execute
    for (let i = 0; i < currentPlan.length; i++) {
      const step = currentPlan[i];
      logs.push(`[Stage 3: Execute] Running step ${i + 1}/${currentPlan.length}: ${step.method} (${step.label})...`);
      setExecutionLogs([...logs]);

      // Check if user requested simulated failure on this step
      if (simulateErrorOnStep === step.method) {
        if (step.optional) {
          logs.push(`⚠️ [Stage 3: Fault Isolated] Step '${step.method}' threw an exception! Captured into _error; optional step skipped.`);
          stepOutputs.push({
            method: step.method,
            status: 'skipped',
            error: 'Simulated downstream timeout: Connection reset by peer',
          });
        } else {
          logs.push(`🚨 [Stage 3: Fatal Error] Required step '${step.method}' failed! Pipeline halted.`);
          setExecutionLogs([...logs]);
          setExecuting(false);
          return;
        }
      } else {
        // Normal simulated run
        const context = {
          lineDf: activePreset.sampleLines,
          spanDf: activePreset.sampleLines,
          nativeToc: activePreset.nativeBookmarks,
          images: activePreset.sampleFigures,
          pageCount: activePreset.pageCount,
        };
        const output = await runStepAdapter(step, context);
        stepOutputs.push({
          method: step.method,
          status: 'success',
          output,
        });
        logs.push(`✅ [Stage 3: Completed] ${step.method} returned in ${output._meta?.durationMs || 15}ms`);
      }
      setExecutionLogs([...logs]);
      await new Promise(r => setTimeout(r, 180));
    }

    // Stage 4: Synthesize
    logs.push(`[Stage 4: Synthesize] Executing _pick_richer relational folding across ${stepOutputs.length} step outputs...`);
    setExecutionLogs([...logs]);
    await new Promise(r => setTimeout(r, 200));

    const finalCorpus = synthesizeParsingOutputs(stepOutputs, currentNature, currentPlan);
    setSynthesizedCorpus(finalCorpus);
    setExecutedPlan(stepOutputs);

    logs.push(`🎉 [Corpus Enriched] Merged into relational dictionary: line_df (${finalCorpus.line_df.length}), toc_df (${finalCorpus.toc_df.length}), table_df (${finalCorpus.table_df.length}), image_df (${finalCorpus.image_df.length})`);
    setExecutionLogs([...logs]);
    setExecuting(false);
  };

  // Identity Cards Catalog State
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState('all');
  const [searchCardQuery, setSearchCardQuery] = useState('');
  const [selectedCardForModal, setSelectedCardForModal] = useState(null);

  const filteredCards = useMemo(() => {
    return PARSER_IDENTITY_CARDS.filter(card => {
      const matchFamily = selectedFamilyFilter === 'all' || card.family === selectedFamilyFilter;
      const matchQuery = !searchCardQuery ||
        card.name.toLowerCase().includes(searchCardQuery.toLowerCase()) ||
        card.summary.toLowerCase().includes(searchCardQuery.toLowerCase()) ||
        card.targetInput.toLowerCase().includes(searchCardQuery.toLowerCase()) ||
        card.primaryOutput.toLowerCase().includes(searchCardQuery.toLowerCase());
      return matchFamily && matchQuery;
    });
  }, [selectedFamilyFilter, searchCardQuery]);

  // Cost & Regimes Calculator State
  const [docPageCount, setDocPageCount] = useState(100);
  const [monthlyDocs, setMonthlyDocs] = useState(500);
  const [queryRatio, setQueryRatio] = useState(15); // % of pages actually queried in production

  const costCalculations = useMemo(() => {
    // Ex-Ante Agentic Dispatcher:
    // Costs fitz (~$0) + Docling/TOC ($0.0005/pg) + 1 LLM leaf ($0.01/doc)
    const exAnteCostPerDoc = 0.01 + (docPageCount * 0.0006);
    const exAnteTotalMonthly = monthlyDocs * exAnteCostPerDoc;
    const exAnteQueryLatencyMs = 45; // Pre-parsed! Queries are instant vector lookups

    // Lazy Adaptive Parsing:
    // Only parses pages hit by queries (queryRatio %)
    const pagesQueried = Math.ceil(docPageCount * (queryRatio / 100));
    const lazyCostPerDoc = 0.002 + (pagesQueried * 0.0012);
    const lazyTotalMonthly = monthlyDocs * lazyCostPerDoc;
    const lazyQueryLatencyMs = 650; // Incurs runtime parsing latency on hit

    const breakEvenThresholdPages = 40; // If doc < 40 pgs, ex-ante is always better
    const recommendedRegime = queryRatio >= 50 || docPageCount <= 30
      ? 'Ex-Ante Agentic Dispatcher'
      : 'Lazy Adaptive Parsing';

    return {
      exAnteCostPerDoc: exAnteCostPerDoc.toFixed(3),
      exAnteTotalMonthly: exAnteTotalMonthly.toFixed(2),
      exAnteQueryLatencyMs,
      lazyCostPerDoc: lazyCostPerDoc.toFixed(3),
      lazyTotalMonthly: lazyTotalMonthly.toFixed(2),
      lazyQueryLatencyMs,
      recommendedRegime,
      savingsPct: Math.abs(((exAnteTotalMonthly - lazyTotalMonthly) / Math.max(exAnteTotalMonthly, 1)) * 100).toFixed(1),
    };
  }, [docPageCount, monthlyDocs, queryRatio]);

  // Copy helper
  const [copiedKey, setCopiedKey] = useState(null);
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1440px', margin: '0 auto', color: 'var(--ds-color-text-primary, #1e293b)' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(13, 148, 136, 0.08) 50%, rgba(124, 58, 237, 0.08) 100%)',
        border: '1px solid var(--ds-color-border, rgba(226, 232, 240, 0.8))',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{
            background: 'var(--ds-color-module-foundations-primary, #2563eb)',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Enterprise Document Intelligence [Vol.1 #5nonies]
          </span>
          <span style={{
            background: 'rgba(13, 148, 136, 0.15)',
            color: '#0d9488',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '20px',
          }}>
            Closing Brick 1: Document Parsing
          </span>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '6px 0 10px 0', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #1e293b, #3b82f6, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Agentic Document Parsing & Synthesis Dispatcher
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--ds-color-text-secondary, #64748b)', margin: 0, maxWidth: '960px', lineHeight: 1.5 }}>
          <strong>Nature, Plan, Execute, Synthesize</strong> — Rather than an uncontrollable black-box LLM supervisor, this dispatcher uses <strong>deterministic rule routing</strong> plus <strong>specialized LLM leaf workers</strong> to read a PDF’s nature, pick the exact parsing methods that fit (fitz, Docling, PaddleOCR, EasyOCR, MinerU, Surya, Vision LLMs), execute them with error isolation, and fold the outputs into one unified corpus dictionary.
        </p>

        {/* 4 Stages Quick Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '20px' }}>
          {[
            { num: '1', title: 'Nature Probe', desc: '6 deterministic signals; 0 LLMs', icon: '🔍', color: '#2563eb' },
            { num: '2', title: 'Plan Generator', desc: 'Deterministic MethodStep order', icon: '📋', color: '#0d9488' },
            { num: '3', title: 'Execute Shim', desc: '_run_step with error isolation', icon: '⚙️', color: '#d97706' },
            { num: '4', title: 'Synthesizer', desc: '_pick_richer multi-frame folding', icon: '🧩', color: '#7c3aed' },
          ].map(stage => (
            <div key={stage.num} style={{
              background: 'var(--ds-color-bg-surface, rgba(255, 255, 255, 0.8))',
              border: `1px solid ${stage.color}30`,
              borderRadius: '10px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                background: `${stage.color}20`,
                color: stage.color,
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
              }}>
                {stage.num}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{stage.icon} {stage.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary, #94a3b8)' }}>{stage.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Tabs Navigation Bar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--ds-color-border, #e2e8f0)',
        marginBottom: '24px',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        {[
          { id: 'dispatcher', label: '⚡ Live Interactive Dispatcher', desc: 'Run 4-stage pipeline simulation' },
          { id: 'identity_cards', label: '🃏 Parser Identity Cards', desc: '14 methods across 4 families' },
          { id: 'attention_case', label: '📄 Attention Paper Case Study', desc: 'Section 4 NeurIPS run walkthrough' },
          { id: 'decision_matrix', label: '🔀 Dispatcher Rule Matrix', desc: 'Signal-to-plan decision rules' },
          { id: 'cost_regimes', label: '💰 Cost & Regimes Calculator', desc: 'Ex-Ante vs Lazy Adaptive ROI' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: '10px 16px',
              border: 'none',
              background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary, #2563eb)' : 'transparent',
              color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary, #64748b)',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              transition: 'all 0.2s ease',
              boxShadow: activeSubTab === tab.id ? '0 -2px 10px rgba(37, 99, 235, 0.2)' : 'none',
            }}
          >
            <span>{tab.label}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 400 }}>{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: LIVE INTERACTIVE DISPATCHER                                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'dispatcher' && (
        <div>
          {/* Preset Selector */}
          <div style={{
            background: 'var(--ds-color-bg-surface, #ffffff)',
            border: '1px solid var(--ds-color-border, #e2e8f0)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ds-color-text-tertiary, #94a3b8)', letterSpacing: '0.05em' }}>
                Select Benchmark Document Preset
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                {SAMPLE_BENCHMARK_PDFS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: selectedPresetId === preset.id ? '2px solid #2563eb' : '1px solid var(--ds-color-border, #cbd5e1)',
                      background: selectedPresetId === preset.id ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                      color: selectedPresetId === preset.id ? '#2563eb' : 'var(--ds-color-text-primary, #334155)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    {preset.title.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={handleRunPipeline}
                disabled={executing}
                style={{
                  background: executing ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: executing ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                {executing ? (
                  <>
                    <span className="spinner" style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Executing Dispatcher...
                  </>
                ) : (
                  <>▶ Run 4-Stage Pipeline</>
                )}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Stage 1: Nature Radar & 6-Signal Prober */}
            <div style={{
              background: 'var(--ds-color-bg-surface, #ffffff)',
              border: '1px solid var(--ds-color-border, #e2e8f0)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>1</span>
                  Document Nature Signals
                </h3>
                <span style={{
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563eb',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}>
                  {currentNature.label}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary, #64748b)', marginBottom: '16px' }}>
                {currentNature.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { key: 'is_scanned', label: 'is_scanned', desc: 'No extracted text layer; requires OCR engine', icon: '🖨️' },
                  { key: 'has_native_outline', label: 'has_native_outline', desc: 'doc.get_toc() has native bookmark tuples', icon: '📑' },
                  { key: 'has_sommaire', label: 'has_sommaire', desc: 'Printed dot-leader lines on early pages (Title ... 12)', icon: '📖' },
                  { key: 'is_composite', label: 'is_composite', desc: 'Multi-part document boundaries or numbering resets', icon: '📚' },
                  { key: 'has_rich_figures', label: 'has_rich_figures', desc: 'Raster/vector image density above median threshold', icon: '🖼️' },
                  { key: 'has_tables_signal', label: 'has_tables_signal', desc: 'Whitespace column clustering detects tabular grids', icon: '📊' },
                ].map(sig => {
                  const isActive = interactiveSignals[sig.key];
                  return (
                    <div
                      key={sig.key}
                      onClick={() => toggleSignal(sig.key)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: isActive ? '1px solid #2563eb' : '1px solid var(--ds-color-border, #e2e8f0)',
                        background: isActive ? 'rgba(37, 99, 235, 0.06)' : 'var(--ds-color-bg-surfaceHover, #f8fafc)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>{sig.icon}</span>
                        <div>
                          <code style={{ fontSize: '0.85rem', fontWeight: 700, color: isActive ? '#2563eb' : 'inherit' }}>{sig.label}</code>
                          <div style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary, #64748b)' }}>{sig.desc}</div>
                        </div>
                      </div>
                      <div style={{
                        width: '38px',
                        height: '22px',
                        borderRadius: '12px',
                        background: isActive ? '#2563eb' : '#cbd5e1',
                        position: 'relative',
                        transition: 'background 0.2s ease',
                      }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: 'white',
                          position: 'absolute',
                          top: '3px',
                          left: isActive ? '19px' : '3px',
                          transition: 'left 0.2s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stage 2: Generated Execution Plan */}
            <div style={{
              background: 'var(--ds-color-bg-surface, #ffffff)',
              border: '1px solid var(--ds-color-border, #e2e8f0)',
              borderRadius: '12px',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#0d9488', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>2</span>
                  Planned Method Steps ({currentPlan.length})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary, #64748b)' }}>
                  Deterministic Rule Output
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary, #64748b)', marginBottom: '16px' }}>
                Ordered sequence of adapters generated from nature signals.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentPlan.map((step, idx) => {
                  const isOptional = step.optional;
                  const familyColor = step.family === 'native' ? '#2563eb' : step.family === 'layout' ? '#0d9488' : step.family === 'ocr' ? '#d97706' : '#7c3aed';
                  return (
                    <div
                      key={step.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--ds-color-border, #e2e8f0)',
                        borderLeft: `4px solid ${familyColor}`,
                        background: 'var(--ds-color-bg-surfaceHover, #f8fafc)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--ds-color-text-tertiary, #94a3b8)' }}>#{idx + 1}</span>
                          <strong style={{ fontSize: '0.85rem' }}>{step.label}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isOptional ? 'rgba(217, 119, 6, 0.12)' : 'rgba(37, 99, 235, 0.12)',
                            color: isOptional ? '#d97706' : '#2563eb',
                          }}>
                            {isOptional ? 'Optional' : 'Mandatory'}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-secondary, #64748b)', lineHeight: 1.4 }}>
                        {step.rationale}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Error Injection Simulator Toggle */}
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--ds-color-border, #e2e8f0)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', marginBottom: '6px' }}>
                  🧪 Fault Isolation Simulator (Test Error Handling):
                </div>
                <select
                  value={simulateErrorOnStep || ''}
                  onChange={(e) => setSimulateErrorOnStep(e.target.value || null)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    background: 'white',
                  }}
                >
                  <option value="">No Error (All steps succeed)</option>
                  {currentPlan.map(s => (
                    <option key={s.method} value={s.method}>
                      Simulate failure on: {s.method} ({s.optional ? 'Optional' : 'Required'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stage 3: Live Trace & Execution Logs */}
            <div style={{
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700 }}>
                  <span>⚡</span> Dispatcher Execution Trace
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  {executionLogs.length} events
                </span>
              </div>

              <div style={{
                flex: 1,
                minHeight: '260px',
                maxHeight: '340px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: '#020617',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #1e293b',
              }}>
                {executionLogs.length === 0 ? (
                  <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', marginTop: '80px' }}>
                    Click "Run 4-Stage Pipeline" above to execute the dispatcher trace.
                  </div>
                ) : (
                  executionLogs.map((log, i) => (
                    <div key={i} style={{
                      color: log.includes('🚨') ? '#ef4444' : log.includes('⚠️') ? '#f59e0b' : log.includes('✅') ? '#10b981' : log.includes('🎉') ? '#a855f7' : '#94a3b8',
                      lineHeight: 1.4,
                    }}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Stage 4: Synthesized Corpus Relational View */}
          {synthesizedCorpus && (
            <div style={{
              background: 'var(--ds-color-bg-surface, #ffffff)',
              border: '1px solid var(--ds-color-border, #e2e8f0)',
              borderRadius: '12px',
              padding: '24px',
              marginTop: '16px',
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: '#7c3aed', color: 'white', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>4</span>
                    Synthesized Relational Corpus Dictionary
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary, #64748b)', marginTop: '4px' }}>
                    Unified dictionary output folded via <code style={{ color: '#7c3aed', fontWeight: 700 }}>_pick_richer</code> heuristic.
                  </div>
                </div>

                {/* Frame Selector Tabs */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'toc_df', label: `toc_df (${synthesizedCorpus.toc_df.length})`, icon: '📑' },
                    { key: 'table_df', label: `table_df (${synthesizedCorpus.table_df.length})`, icon: '📊' },
                    { key: 'image_df', label: `image_df (${synthesizedCorpus.image_df.length})`, icon: '🖼️' },
                    { key: 'line_df', label: `line_df (${synthesizedCorpus.line_df.length})`, icon: '📝' },
                    { key: 'sources', label: `sources (${synthesizedCorpus.sources.length})`, icon: '🔍' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setSelectedCorpusFrame(f.key)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: selectedCorpusFrame === f.key ? '2px solid #7c3aed' : '1px solid var(--ds-color-border, #cbd5e1)',
                        background: selectedCorpusFrame === f.key ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                        color: selectedCorpusFrame === f.key ? '#7c3aed' : 'inherit',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      {f.icon} {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Frame Viewer Table */}
              <div style={{
                background: 'var(--ds-color-bg-surfaceHover, #f8fafc)',
                border: '1px solid var(--ds-color-border, #e2e8f0)',
                borderRadius: '8px',
                padding: '16px',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                {selectedCorpusFrame === 'toc_df' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: 'var(--ds-color-text-secondary, #64748b)' }}>
                        <th style={{ padding: '8px' }}>Level</th>
                        <th style={{ padding: '8px' }}>Section Heading Title</th>
                        <th style={{ padding: '8px' }}>Start Page</th>
                        <th style={{ padding: '8px' }}>Source Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {synthesizedCorpus.toc_df.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px', fontWeight: 700, color: '#7c3aed' }}>L{row.level || 1}</td>
                          <td style={{ padding: '8px', fontWeight: (row.level || 1) === 1 ? 700 : 500, paddingLeft: `${((row.level || 1) - 1) * 20 + 8}px` }}>
                            {row.title}
                          </td>
                          <td style={{ padding: '8px', color: '#64748b' }}>Page {row.start_page || 1}</td>
                          <td style={{ padding: '8px' }}>
                            <span style={{ fontSize: '0.72rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
                              {row.source || 'fitz_native_toc'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedCorpusFrame === 'table_df' && (
                  <div>
                    {synthesizedCorpus.table_df.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No tabular structures extracted for this nature profile.</div>
                    ) : (
                      synthesizedCorpus.table_df.map((tbl, i) => (
                        <div key={i} style={{ marginBottom: '16px', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong>Table #{i + 1} (Page {tbl.page})</strong>
                            <span style={{ fontSize: '0.72rem', background: '#0d9488', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>{tbl.source}</span>
                          </div>
                          <pre style={{ margin: 0, fontSize: '0.75rem', background: '#f8fafc', padding: '10px', borderRadius: '6px', overflowX: 'auto' }}>
                            {tbl.markdown}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {selectedCorpusFrame === 'image_df' && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {synthesizedCorpus.image_df.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No figures or drawings in document.</div>
                    ) : (
                      synthesizedCorpus.image_df.map((img, i) => (
                        <div key={i} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '0.85rem' }}>{img.title || `Figure ${i + 1}`}</strong>
                            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Page {img.page || 1}</span>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: '#475569', margin: '4px 0' }}>{img.summary || 'Image asset indexed.'}</p>
                          <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '6px' }}>Source: {img.source}</div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {selectedCorpusFrame === 'line_df' && (
                  <div style={{ fontSize: '0.8rem' }}>
                    <div style={{ color: '#64748b', marginBottom: '8px' }}>Showing sample extracted line tokens ({synthesizedCorpus.line_df.length} total rows):</div>
                    {synthesizedCorpus.line_df.slice(0, 15).map((l, i) => (
                      <div key={i} style={{ display: 'flex', gap: '12px', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ color: '#94a3b8', width: '60px' }}>P.{l.page || 1}</span>
                        <span style={{ color: '#2563eb', width: '60px' }}>{l.size || 10}pt</span>
                        <span style={{ flex: 1, fontFamily: 'monospace' }}>{l.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCorpusFrame === 'sources' && (
                  <div>
                    <div style={{ color: '#64748b', marginBottom: '8px' }}>Provenance audit trail of merged frames:</div>
                    {synthesizedCorpus.sources.map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 12px', background: 'white', borderRadius: '6px', marginBottom: '6px', border: '1px solid #e2e8f0' }}>
                        <code>{s.frame}</code>
                        <span style={{ fontWeight: 700, color: '#2563eb' }}>{s.method}</span>
                        <span style={{ color: '#64748b' }}>{s.count} items</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: PARSER IDENTITY CARDS CATALOG                                */}
      {/* ========================================================================= */}
      {activeSubTab === 'identity_cards' && (
        <div>
          {/* Family Filter and Search Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PARSING_FAMILIES.map(fam => (
                <button
                  key={fam.id}
                  onClick={() => setSelectedFamilyFilter(fam.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: selectedFamilyFilter === fam.id ? `2px solid ${fam.color}` : '1px solid var(--ds-color-border, #cbd5e1)',
                    background: selectedFamilyFilter === fam.id ? `${fam.color}15` : 'transparent',
                    color: selectedFamilyFilter === fam.id ? fam.color : 'inherit',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{fam.icon}</span>
                  <span>{fam.name}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search parsers, strengths, outputs..."
              value={searchCardQuery}
              onChange={(e) => setSearchCardQuery(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                minWidth: '280px',
              }}
            />
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredCards.map(card => (
              <div
                key={card.id}
                onClick={() => setSelectedCardForModal(card)}
                style={{
                  background: 'var(--ds-color-bg-surface, #ffffff)',
                  border: `1px solid ${card.color}40`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${card.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: card.color,
                      background: card.badgeColor,
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      {card.familyLabel}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 0 0' }}>{card.name}</h3>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                    {card.license}
                  </span>
                </div>

                {/* Vitals Strip */}
                <div style={{
                  background: 'var(--ds-color-bg-surfaceHover, #f8fafc)',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  margin: '10px 0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px',
                  fontSize: '0.72rem',
                  textAlign: 'center',
                }}>
                  <div>
                    <div style={{ color: '#94a3b8' }}>Speed</div>
                    <div style={{ fontWeight: 700 }}>{card.speed}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>LLM?</div>
                    <div style={{ fontWeight: 700, color: card.callsLlm ? '#d97706' : '#10b981' }}>{card.callsLlm ? 'Yes (Leaf)' : 'No'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>Preserves Style?</div>
                    <div style={{ fontWeight: 700, color: card.preservesStyle ? '#2563eb' : '#64748b' }}>{card.preservesStyle ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-secondary, #475569)', lineHeight: 1.45, flex: 1 }}>
                  {card.summary}
                </p>

                {/* Primary Output */}
                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
                  <span style={{ color: '#94a3b8' }}>Output: </span>
                  <code style={{ fontWeight: 600, color: card.color }}>{card.primaryOutput}</code>
                </div>
              </div>
            ))}
          </div>

          {/* Identity Card Detail Modal */}
          {selectedCardForModal && (
            <div
              onClick={() => setSelectedCardForModal(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px',
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  maxWidth: '680px',
                  width: '100%',
                  padding: '28px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  border: `2px solid ${selectedCardForModal.color}`,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: selectedCardForModal.color,
                      background: selectedCardForModal.badgeColor,
                      padding: '3px 10px',
                      borderRadius: '6px',
                    }}>
                      {selectedCardForModal.familyLabel}
                    </span>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '8px 0 0 0' }}>{selectedCardForModal.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedCardForModal(null)}
                    style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 700 }}
                  >
                    ✕
                  </button>
                </div>

                {/* Vitals Summary Table */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  fontSize: '0.8rem',
                }}>
                  <div>
                    <div style={{ color: '#94a3b8' }}>License</div>
                    <div style={{ fontWeight: 700 }}>{selectedCardForModal.license}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>Runs On</div>
                    <div style={{ fontWeight: 700 }}>{selectedCardForModal.runs}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>Speed</div>
                    <div style={{ fontWeight: 700 }}>{selectedCardForModal.speed}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>LLM Needed?</div>
                    <div style={{ fontWeight: 700, color: selectedCardForModal.callsLlm ? '#d97706' : '#10b981' }}>
                      {selectedCardForModal.callsLlm ? 'Yes (Leaf)' : 'No'}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px 0', color: '#334155' }}>Target Input</h4>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>{selectedCardForModal.targetInput}</div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px 0', color: '#334155' }}>Primary Output</h4>
                  <code style={{ fontSize: '0.85rem', color: selectedCardForModal.color, fontWeight: 700 }}>{selectedCardForModal.primaryOutput}</code>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 6px 0', color: '#10b981' }}>✅ Where It Shines (Strengths)</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    {selectedCardForModal.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 6px 0', color: '#ef4444' }}>⚠️ Where It Breaks (Weaknesses)</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    {selectedCardForModal.weaknesses.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ background: `${selectedCardForModal.color}10`, padding: '12px 16px', borderRadius: '8px', borderLeft: `4px solid ${selectedCardForModal.color}` }}>
                  <strong style={{ fontSize: '0.85rem', color: selectedCardForModal.color }}>Ideal Placement in Dispatcher: </strong>
                  <span style={{ fontSize: '0.85rem', color: '#334155' }}>{selectedCardForModal.idealFor}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: ATTENTION PAPER CASE STUDY (1706.03762v7.pdf)                */}
      {/* ========================================================================= */}
      {activeSubTab === 'attention_case' && (
        <div style={{
          background: 'var(--ds-color-bg-surface, #ffffff)',
          border: '1px solid var(--ds-color-border, #e2e8f0)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
            <span style={{ background: '#2563eb', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
              Article Section 4 Deep Dive
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '8px 0 4px 0' }}>
              Real Run Walkthrough: Attention Is All You Need (<code style={{ color: '#2563eb' }}>data/paper/1706.03762v7.pdf</code>)
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
              Tracing the exact four-step plan produced by the dispatcher on the 15-page canonical NeurIPS transformer paper.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Step 1: Detected Nature */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2563eb', marginBottom: '8px' }}>
                1. Detected Nature: <code style={{ color: '#1e293b' }}>native-with-outline</code>
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', lineHeight: 1.6, color: '#475569' }}>
                <li><code>is_scanned</code>: <strong>False</strong> (1,048 extracted line tokens)</li>
                <li><code>has_native_outline</code>: <strong>True</strong> (15 top-level bookmark tuples)</li>
                <li><code>has_sommaire</code>: <strong>False</strong> (No printed dot-leaders)</li>
                <li><code>has_rich_figures</code>: <strong>True</strong> (Architecture diagram & heatmaps)</li>
                <li><code>has_tables_signal</code>: <strong>True</strong> (WMT benchmark tables)</li>
              </ul>
            </div>

            {/* Step 2: 4-Step Plan */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0d9488', marginBottom: '8px' }}>
                2. Resulting 4-Step Plan
              </div>
              <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', lineHeight: 1.6, color: '#475569' }}>
                <li><strong>fitz_native</strong>: Mandatory base text layer extraction</li>
                <li><strong>fitz_native_toc</strong>: Mandatory 15-row native bookmark read</li>
                <li><strong>toc_body_structure</strong>: Advisory body typography loop for Level-3 subsections</li>
                <li><strong>image_pipeline</strong>: Optional raster bounding box indexer</li>
              </ol>
            </div>

            {/* Step 3: Enriched Relational Dict */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#7c3aed', marginBottom: '8px' }}>
                3. Merged Corpus Dictionary
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.85rem', lineHeight: 1.6, color: '#475569' }}>
                <li><code>line_df</code>: <strong>1,048 rows</strong> (fitz_native)</li>
                <li><code>span_df</code>: <strong>3,480 rows</strong> (build_span_df)</li>
                <li><code>toc_df</code>: <strong>15 rows</strong> (fitz_native_toc) + 7 sub-headings</li>
                <li><code>table_df</code>: <strong>4 tables</strong> (docling_tables)</li>
                <li><strong>Total Dispatcher LLM Calls</strong>: <strong>0</strong></li>
              </ul>
            </div>
          </div>

          {/* Key Insight Callout */}
          <div style={{
            background: 'rgba(37, 99, 235, 0.06)',
            borderLeft: '4px solid #2563eb',
            padding: '16px 20px',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.9rem',
            color: '#1e293b',
            lineHeight: 1.6,
          }}>
            <strong>Why this run matters:</strong> The run cost one <code>line_df</code> build, one <code>span_df</code> build, one native TOC read, and one body-structure loop. <strong>No vision LLM, no OCR, no heavy GPU time.</strong> The plan matched the document.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 4: DISPATCHER RULE MATRIX                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'decision_matrix' && (
        <div style={{
          background: 'var(--ds-color-bg-surface, #ffffff)',
          border: '1px solid var(--ds-color-border, #e2e8f0)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0' }}>
            Dispatcher Rule Routing Matrix
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
            Comprehensive mapping from the 6 coarse nature signals to the ordered execution pipeline.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px' }}>Document Profile</th>
                <th style={{ padding: '10px 12px' }}>Signal Predicates</th>
                <th style={{ padding: '10px 12px' }}>Generated Plan</th>
                <th style={{ padding: '10px 12px' }}>TOC Method</th>
                <th style={{ padding: '10px 12px' }}>Table Method</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  profile: 'Digital with Native Bookmarks',
                  signals: 'is_scanned=F, has_native_outline=T',
                  plan: 'fitz_native -> fitz_native_toc -> toc_body_structure (enrich) -> image_pipeline',
                  toc: 'fitz_native_toc',
                  table: 'docling_tables (if signaled)',
                },
                {
                  profile: 'Digital with Printed Sommaire',
                  signals: 'is_scanned=F, has_native_outline=F, has_sommaire=T',
                  plan: 'fitz_native -> toc_sommaire -> docling_tables -> image_pipeline',
                  toc: 'toc_sommaire',
                  table: 'docling_tables',
                },
                {
                  profile: 'Digital Body Typography Only',
                  signals: 'is_scanned=F, has_native_outline=F, has_sommaire=F',
                  plan: 'fitz_native -> toc_body_structure -> docling_tables -> image_pipeline',
                  toc: 'toc_body_structure',
                  table: 'docling_tables',
                },
                {
                  profile: 'Scanned Raster PDF',
                  signals: 'is_scanned=T',
                  plan: 'easyocr_scan -> paddleocr_structure -> toc_body_structure',
                  toc: 'toc_body_structure (OCR)',
                  table: 'paddleocr_structure',
                },
                {
                  profile: 'Multimodal Research Paper',
                  signals: 'is_scanned=F, has_rich_figures=T, has_tables_signal=T',
                  plan: 'fitz_native -> fitz_native_toc -> docling_tables -> vision_llm_figures -> image_pipeline',
                  toc: 'fitz_native_toc',
                  table: 'docling_tables',
                },
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700 }}>{row.profile}</td>
                  <td style={{ padding: '10px 12px' }}><code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{row.signals}</code></td>
                  <td style={{ padding: '10px 12px', color: '#2563eb', fontSize: '0.8rem' }}>{row.plan}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{row.toc}</td>
                  <td style={{ padding: '10px 12px', color: '#0d9488' }}>{row.table}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 5: COST & REGIMES CALCULATOR                                    */}
      {/* ========================================================================= */}
      {activeSubTab === 'cost_regimes' && (
        <div style={{
          background: 'var(--ds-color-bg-surface, #ffffff)',
          border: '1px solid var(--ds-color-border, #e2e8f0)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 8px 0' }}>
            Cost & Regimes: Ex-Ante Agentic Dispatcher vs Lazy Adaptive Parsing
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
            Calculate ROI, break-even thresholds, and latency differences based on your organization's document archive and query patterns.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Input Controls */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>Workload Parameters</div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>Average Pages per Document:</span>
                  <strong>{docPageCount} pages</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  value={docPageCount}
                  onChange={(e) => setDocPageCount(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>Monthly Ingest Volume:</span>
                  <strong>{monthlyDocs} docs</strong>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={monthlyDocs}
                  onChange={(e) => setMonthlyDocs(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>% Pages Actually Queried:</span>
                  <strong>{queryRatio}%</strong>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={queryRatio}
                  onChange={(e) => setQueryRatio(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Ex-Ante Card */}
            <div style={{
              background: 'rgba(37, 99, 235, 0.05)',
              border: '2px solid #2563eb',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ background: '#2563eb', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                  Ex-Ante Agentic Dispatcher (This Article)
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '8px 0 4px 0' }}>All-Up Ingest Pass</h3>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0 }}>Parses the whole document upfront once.</p>
              </div>

              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>${costCalculations.exAnteTotalMonthly} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>/ mo</span></div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>${costCalculations.exAnteCostPerDoc} per document</div>
              </div>

              <div style={{ fontSize: '0.8rem', borderTop: '1px solid rgba(37, 99, 235, 0.2)', paddingTop: '10px' }}>
                <div>⚡ Query Latency: <strong>{costCalculations.exAnteQueryLatencyMs}ms</strong> (Pre-parsed)</div>
                <div style={{ color: '#10b981', marginTop: '4px', fontWeight: 600 }}>Best for high-value contracts & papers</div>
              </div>
            </div>

            {/* Lazy Adaptive Card */}
            <div style={{
              background: 'rgba(13, 148, 136, 0.05)',
              border: '2px solid #0d9488',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ background: '#0d9488', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                  Lazy Adaptive Parsing (Vol.2 Preview)
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '8px 0 4px 0' }}>On-Demand Retrieval Pass</h3>
                <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0 }}>Parses only the specific pages hit by queries.</p>
              </div>

              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0d9488' }}>${costCalculations.lazyTotalMonthly} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>/ mo</span></div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>${costCalculations.lazyCostPerDoc} per active document</div>
              </div>

              <div style={{ fontSize: '0.8rem', borderTop: '1px solid rgba(13, 148, 136, 0.2)', paddingTop: '10px' }}>
                <div>⏱️ Query Latency: <strong>{costCalculations.lazyQueryLatencyMs}ms</strong> (Runtime Parse)</div>
                <div style={{ color: '#0d9488', marginTop: '4px', fontWeight: 600 }}>Best for 100k+ page unqueried archives</div>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
            <strong>Recommendation for your parameters: </strong>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>{costCalculations.recommendedRegime}</span>.
            {queryRatio < 40 ? ' Because less than 40% of pages are queried, lazy adaptive parsing reduces monthly spend.' : ' Because most pages are queried repeatedly, upfront agentic dispatching eliminates query latency.'}
          </div>
        </div>
      )}
    </div>
  );
}
