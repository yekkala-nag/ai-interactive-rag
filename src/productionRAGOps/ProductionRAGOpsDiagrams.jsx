import React from 'react';

// 1. AgentOps Trajectory & Compounding Reliability Diagram
export function AgentOpsTrajectoryDiagram() {
  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #38bdf8',
      borderRadius: '12px',
      padding: '24px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
          ⛓️ Modern AgentOps: Trajectory Observability & Compounding Loops
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Moving beyond stateless request monitoring to stateful loop inspection, hard caps, and pre-action side-effect gates.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left: Traditional MLOps vs Reality */}
        <div style={{ background: '#0f172a', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ef4444' }}>❌ TRADITIONAL MLOPS ASSUMPTION</span>
            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Silent Failure</span>
          </div>
          <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', textAlign: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>DASHBOARD REPORTS:</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#10b981' }}>▲ 85% SUCCESS</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>Stateless single-step scoring</div>
          </div>
          <div style={{ fontSize: '12px', color: '#fca5a5', lineHeight: '1.5' }}>
            ⚠️ <strong>The 10-Step Reality:</strong> An agent running 10 autonomous steps with 85% per-step reliability achieves only:
            <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#f8fafc', fontSize: '14px', margin: '6px 0' }}>
              0.85¹⁰ ≈ 19.6% True Completion Rate!
            </div>
            The MLOps dashboard remains 85% green while 4 out of 5 users experience failed tasks.
          </div>
        </div>

        {/* Right: Modern AgentOps Architecture */}
        <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>✅ MODERN AGENTOPS INSTRUMENTATION</span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Full Trajectory</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '6px', fontSize: '12px', borderLeft: '3px solid #38bdf8' }}>
              <strong style={{ color: '#38bdf8' }}>1. pass^k Reliability:</strong> Measures consistency over k repeated runs rather than 1 lucky pass.
            </div>
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '6px', fontSize: '12px', borderLeft: '3px solid #f59e0b' }}>
              <strong style={{ color: '#f59e0b' }}>2. Hard Loop Caps:</strong> Flags deterministic non-progress after 3-5 identical tool calls instead of 20.
            </div>
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '6px', fontSize: '12px', borderLeft: '3px solid #10b981' }}>
              <strong style={{ color: '#10b981' }}>3. Pre-Action Side-Effect Gates:</strong> Validates database writes, payments, and emails before execution.
            </div>
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '6px', fontSize: '12px', borderLeft: '3px solid #a855f7' }}>
              <strong style={{ color: '#a855f7' }}>4. Cost per Successful Trajectory:</strong> Accounts for 15x multi-agent token multipliers on real outcomes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Earned RAG Complexity Ladder Diagram
export function EarnedComplexityLadderDiagram() {
  const steps = [
    { lvl: 0, title: 'L0: Direct Context', badge: '< 200k tokens', color: '#64748b', desc: 'No retrieval subsystem. Feed context window directly.' },
    { lvl: 1, title: 'L1: Corpus Structure', badge: 'Clean Parsing', color: '#0284c7', desc: 'Preserve tables, headers, and metadata before search.' },
    { lvl: 2, title: 'L2: BM25 Lexical', badge: 'Exact Codes', color: '#0d9488', desc: 'Unbeatable for error codes (TS-999), SKUs, and citations.' },
    { lvl: 3, title: 'L3: Dense Vectors', badge: 'Paraphrases', color: '#10b981', desc: 'Overcomes vocabulary mismatch and semantic synonyms.' },
    { lvl: 4, title: 'L4: Hybrid RRF', badge: 'Sparse + Dense', color: '#f59e0b', desc: 'Reciprocal rank fusion combining keyword & concept search.' },
    { lvl: 5, title: 'L5: Neural Rerank', badge: 'Cross-Encoder', color: '#f97316', desc: 'Re-orders top-50 candidate pool to maximize top-5 NDCG.' },
    { lvl: 6, title: 'L6: Contextual Chunks', badge: 'Context Prepend', color: '#ec4899', desc: 'Anthropic pattern: prepend document summary to each chunk.' },
    { lvl: 7, title: 'L7: Query Rewrite', badge: 'Decomposition', color: '#a855f7', desc: 'Splits multi-part questions into targeted sub-searches.' },
    { lvl: 8, title: 'L8: Agentic Multi-Hop', badge: 'Adaptive Search', color: '#6366f1', desc: 'Dynamic branching, iterative evidence gathering, and stopping rules.' }
  ];

  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #10b981',
      borderRadius: '12px',
      padding: '24px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#10b981' }}>
          🪜 The 8-Level Earned RAG Complexity Escalation Ladder
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          "Architectural complexity should correspond to a demonstrated failure mode, not adopted as a default."
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {steps.map(s => (
          <div key={s.lvl} style={{
            display: 'grid',
            gridTemplateColumns: '160px 140px 1fr',
            gap: '12px',
            alignItems: 'center',
            background: '#0f172a',
            borderLeft: `4px solid ${s.color}`,
            borderRadius: '6px',
            padding: '10px 14px'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#f8fafc' }}>
              {s.title}
            </div>
            <div>
              <span style={{ background: `${s.color}22`, border: `1px solid ${s.color}66`, color: s.color, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                {s.badge}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              {s.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. FAQ as RAG Inverted Flow Diagram
export function FAQAsRAGInvertedFlowDiagram() {
  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #38bdf8',
      borderRadius: '12px',
      padding: '24px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
          🔄 FAQ as RAG: Inverted Pipeline & Semantic Cache Router
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          When you author the corpus upstream, retrieval doubles as an exact-answer cache and few-shot prompt bank.
        </p>
      </div>

      {/* 3 Outcome Paths */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '18px' }}>
        {/* Path 1: Direct */}
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #10b981', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#10b981', fontSize: '13px' }}>1. DIRECT MATCH</strong>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '11px' }}>sim ≥ 0.92</span>
          </div>
          <div style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 'bold', marginBottom: '4px' }}>
            Zero-Token Canonical Cache Hit
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Returns pre-written canonical answer verbatim. 0 LLM tokens, single-digit millisecond latency.
          </p>
        </div>

        {/* Path 2: Adjacent */}
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid #38bdf8', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#38bdf8', fontSize: '13px' }}>2. ADJACENT MATCH</strong>
            <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '11px' }}>0.78 ≤ sim &lt; 0.92</span>
          </div>
          <div style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 'bold', marginBottom: '4px' }}>
            Dynamic Few-Shot LLM Rewrite
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Retrieves top-3 curated Q&A pairs as in-context examples. LLM rewrites tone & scope safely.
          </p>
        </div>

        {/* Path 3: Miss */}
        <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <strong style={{ color: '#f59e0b', fontSize: '13px' }}>3. CORPUS MISS</strong>
            <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '11px' }}>sim &lt; 0.78</span>
          </div>
          <div style={{ fontSize: '12px', color: '#f8fafc', fontWeight: 'bold', marginBottom: '4px' }}>
            Expert Escalation & Logging
          </div>
          <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Never hallucinates; surfaces gap to human editor queue for weekly clustering and promotion.
          </p>
        </div>
      </div>

      {/* Flywheel Loop Banner */}
      <div style={{ background: '#0b1120', border: '1px dashed #38bdf8', borderRadius: '8px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
          🔄 <strong>The Feedback Flywheel:</strong> Logged misses ➔ Clustered by embedding proximity ➔ Human authors 1 canonical entry ➔ Tomorrow, 40+ user queries hit the 0ms cache!
        </div>
        <span style={{ background: '#38bdf8', color: '#000', fontWeight: 'bold', fontSize: '11px', padding: '4px 10px', borderRadius: '4px' }}>
          Continuous Self-Improvement
        </span>
      </div>
    </div>
  );
}

// 4. Noisy Text & OCR Degradation Diagram
export function NoisyTextStrategyForkDiagram() {
  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #f59e0b',
      borderRadius: '12px',
      padding: '24px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#f59e0b' }}>
          🔤 Noisy Text in RAG: The Strategy Fork (Clean vs Fuzz)
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Why 40 years of classical spell-check fail on real-word errors and OCR substitutions ('rn' ➔ 'm', '0' ➔ 'O').
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '8px' }}>
            FORK 1: HIGH-VALUE REFERENCE DOCUMENTS
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', marginBottom: '6px' }}>
            "Clean Them Once" (Ingestion Post-Processing)
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
            For core policy documents, statutes, contracts, and product manuals: Run OCR post-correction once with LLM layout reconstruction. Pay compute once during indexing; keep search pristine.
          </p>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
            FORK 2: HIGH-VOLUME COMMODITY DOCUMENTS
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', marginBottom: '6px' }}>
            "Optimise the Search Instead" (Fuzzy & Character N-Grams)
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
            For millions of incoming customer invoices, support tickets, and raw scans: Do not rewrite the files. Index using Character 3-Grams + Dense Embeddings to tolerate noisy tokens at query time.
          </p>
        </div>
      </div>
    </div>
  );
}

// 5. Defensible Absence Evidence Chain Diagram (The 4 Bricks)
export function AbsenceEvidenceChainDiagram() {
  const bricks = [
    {
      num: 'BRICK 1',
      title: 'Relational Parse Coverage',
      badge: 'Completeness Proof',
      color: '#38bdf8',
      desc: 'Proves the document was actually parsed: 63/63 pages, 0 OCR dropouts, 1,420 lines extracted, 0 blank pages.'
    },
    {
      num: 'BRICK 2',
      title: 'Validated Concept Vocabulary',
      badge: 'Domain Synonyms',
      color: '#10b981',
      desc: 'Enumerates the domain keywords checked (e.g. AI = [AI, artificial intelligence, ML, deep learning, LLM]).'
    },
    {
      num: 'BRICK 3',
      title: 'Full Document Sweep (Not Top-K!)',
      badge: 'Exhaustive Scan',
      color: '#f59e0b',
      desc: 'Top-k fails on absence claims. Full sweep reports zero target occurrences and explains closest distractor passages.'
    },
    {
      num: 'BRICK 4',
      title: 'Structured Justification Schema',
      badge: 'AnswerWithAbsenceEvidence',
      color: '#a855f7',
      desc: 'Delivers structured JSON citing parse completeness, validated keywords, and audited non-occurrence justification.'
    }
  ];

  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #38bdf8',
      borderRadius: '12px',
      padding: '24px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>
          🛡️ Defensible "Not in This Document" RAG: The 4-Brick Evidence Chain
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          "A confident wrong answer is a bug. A bare 'no answer' with no justification is almost as bad."
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {bricks.map((b, idx) => (
          <div key={idx} style={{
            background: '#0f172a',
            borderTop: `4px solid ${b.color}`,
            borderRadius: '8px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: b.color }}>{b.num}</span>
              <span style={{ fontSize: '10px', background: `${b.color}22`, color: b.color, padding: '2px 6px', borderRadius: '4px' }}>
                {b.badge}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '6px' }}>
              {b.title}
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4', flex: 1 }}>
              {b.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Three-Layer Defense Stack Diagram (Beyond Valid JSON)
export function ThreeLayerDefenseDiagram() {
  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #ef4444',
      borderRadius: '12px',
      padding: '24px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#f8fafc' }}>
          🏗️ The Three-Layer Defense Stack: Schema Is the Floor, Not the Ceiling
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Why schema compliance guarantees shape, but semantic validators and uncertainty surfacing guarantee truth.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Layer 3 */}
        <div style={{ background: '#0f172a', borderLeft: '4px solid #a855f7', borderRadius: '6px', padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '13px' }}>LAYER 3: UNCERTAINTY SURFACING & AUDITING</span>
            <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '2px 8px', borderRadius: '4px' }}>Semantic Verification</span>
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Optional per-field confidence scores, explicit "unknown" tokens, and secondary LLM-as-judge audits on sampled edge cases. Prevents forced hallucinations on out-of-domain inputs (e.g. elephant receipts).
          </div>
        </div>

        {/* Layer 2 */}
        <div style={{ background: '#0f172a', borderLeft: '4px solid #10b981', borderRadius: '6px', padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '13px' }}>LAYER 2: SEMANTIC & CROSS-FIELD VALIDATORS</span>
            <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '2px 8px', borderRadius: '4px' }}>Business Logic</span>
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Relational rules: Assert <code>end_date &gt;= start_date</code>, verify <code>(sentiment == "positive") == (score &gt; 0.5)</code>, and telemetry entropy monitors catching 0.98 confidence flatlines.
          </div>
        </div>

        {/* Layer 1 */}
        <div style={{ background: '#0f172a', borderLeft: '4px solid #38bdf8', borderRadius: '6px', padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '13px' }}>LAYER 1: SCHEMA & CONSTRAINED DECODING (THE FLOOR)</span>
            <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#7dd3fc', padding: '2px 8px', borderRadius: '4px' }}>Syntax Only</span>
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Pydantic, Zod, XGrammar, and Outlines. Guarantees 100% valid JSON types (string is string, number is number), but completely blind to whether the content is true.
          </div>
        </div>
      </div>
    </div>
  );
}

