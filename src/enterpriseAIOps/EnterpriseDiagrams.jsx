import React from 'react';

/**
 * Clean, High-Readability Vector Diagrams for Enterprise AI Operations
 * Matches the user's architectural blueprints directly.
 */

// 1. Advanced RAG and Token Optimization Pipeline Diagram
export function AdvancedRAGPipelineDiagram() {
  return (
    <div style={{
      background: '#f8fafc',
      padding: '32px 24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      color: '#0f172a',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0a2540', letterSpacing: '-0.5px' }}>
          Advanced RAG and Token Optimization Pipeline
        </h2>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        gap: '12px',
        padding: '10px 0'
      }}>
        {/* Node 1: User Query */}
        <div style={{ flex: '0 0 auto', width: '130px', textAlign: 'center' }}>
          <div style={{
            background: '#ffffff',
            border: '2px solid #93c5fd',
            borderRadius: '12px',
            padding: '24px 12px',
            fontWeight: 800,
            fontSize: '16px',
            color: '#1e3a8a',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.08)'
          }}>
            User<br />Query
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 'bold' }}>➔</div>

        {/* Node 2: Semantic Cache */}
        <div style={{ flex: '0 0 auto', width: '145px', textAlign: 'center' }}>
          <div style={{
            background: '#38bdf8',
            borderRadius: '12px',
            padding: '24px 10px',
            fontWeight: 700,
            fontSize: '15px',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(56, 189, 248, 0.25)'
          }}>
            Semantic<br />Cache
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '12px', lineHeight: '1.3' }}>
            Cache hit/miss<br />decision
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 'bold' }}>➔</div>

        {/* Node 3: Hybrid Vector Search */}
        <div style={{ flex: '0 0 auto', width: '155px', textAlign: 'center' }}>
          <div style={{
            background: '#0ea5e9',
            borderRadius: '12px',
            padding: '24px 10px',
            fontWeight: 700,
            fontSize: '15px',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(14, 165, 233, 0.25)'
          }}>
            Hybrid<br />Vector Search
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '12px', lineHeight: '1.3' }}>
            Multi-source<br />embedding retrieval
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 'bold' }}>➔</div>

        {/* Node 4: Reranker */}
        <div style={{ flex: '0 0 auto', width: '145px', textAlign: 'center' }}>
          <div style={{
            background: '#0284c7',
            borderRadius: '12px',
            padding: '24px 10px',
            fontWeight: 700,
            fontSize: '15px',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(2, 132, 199, 0.25)'
          }}>
            Reranker
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '12px', lineHeight: '1.3' }}>
            Cross-encoder<br />relevance scoring
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 'bold' }}>➔</div>

        {/* Node 5: Token Compression */}
        <div style={{ flex: '0 0 auto', width: '155px', textAlign: 'center' }}>
          <div style={{
            background: '#2563eb',
            borderRadius: '12px',
            padding: '24px 10px',
            fontWeight: 700,
            fontSize: '15px',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.25)'
          }}>
            Token<br />Compression
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '12px', lineHeight: '1.3' }}>
            Context-aware<br />token pruning
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: '#3b82f6', fontSize: '22px', fontWeight: 'bold' }}>➔</div>

        {/* Node 6: Large Language Model */}
        <div style={{ flex: '0 0 auto', width: '155px', textAlign: 'center' }}>
          <div style={{
            background: '#1d4ed8',
            borderRadius: '12px',
            padding: '24px 10px',
            fontWeight: 700,
            fontSize: '15px',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(29, 78, 216, 0.3)'
          }}>
            Large<br />Language Model
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '12px', lineHeight: '1.3' }}>
            LLM inference with<br />optimized input
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Map-Reduce Pattern for Long Document Processing Diagram
export function MapReducePatternDiagram() {
  return (
    <div style={{
      background: '#f8fafc',
      padding: '32px 24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      color: '#0f172a',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0a2540', letterSpacing: '-0.5px' }}>
          Map-Reduce Pattern for Long Document Processing
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Top: Input Document */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            "Input Document"
          </div>
          <div style={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: '10px',
            padding: '16px 28px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '32px' }}>📄</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Large Text Document</div>
          </div>
        </div>

        {/* Map Phase Divider */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1', borderTop: '1px dashed #94a3b8' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', background: '#e2e8f0', padding: '4px 10px', borderRadius: '4px' }}>
            "Map Phase"
          </span>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1', borderTop: '1px dashed #94a3b8' }} />
        </div>

        {/* Middle: Map Phase Chunks */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', width: '100%' }}>
          {['Chunk 1', 'Chunk 2', 'Chunk 3'].map((chunk, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                maxWidth: '180px',
                background: '#60a5fa',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                padding: '18px 12px',
                textAlign: 'center',
                color: '#ffffff',
                boxShadow: '0 6px 14px rgba(59, 130, 246, 0.2)'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🤖</div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9 }}>AI Processor</div>
              <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '2px' }}>{chunk}</div>
            </div>
          ))}
        </div>

        {/* Reduce Phase Divider */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1', borderTop: '1px dashed #94a3b8' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', background: '#e2e8f0', padding: '4px 10px', borderRadius: '4px' }}>
            "Reduce Phase"
          </span>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1', borderTop: '1px dashed #94a3b8' }} />
        </div>

        {/* Bottom: Final Summary */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>
            🤖 AI
          </div>
          <div style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 'bold' }}>➔</div>
          <div style={{
            background: '#fde68a',
            border: '2px solid #f59e0b',
            borderRadius: '10px',
            padding: '16px 36px',
            textAlign: 'center',
            boxShadow: '0 6px 14px rgba(245, 158, 11, 0.15)'
          }}>
            <div style={{ fontSize: '28px' }}>📑</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>"Final Summary"</div>
          </div>
          <div style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 'bold' }}>⬅</div>
          <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}>
            🤖 AI
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Dynamic Model Routing for LLMs Diagram
export function DynamicModelRoutingDiagram() {
  return (
    <div style={{
      background: '#f8fafc',
      padding: '32px 24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      color: '#0f172a',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#0a2540', letterSpacing: '-0.5px' }}>
          Dynamic Model Routing for LLMs
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        {/* Node 1: Incoming Request */}
        <div style={{
          background: '#e0f2fe',
          border: '2px solid #38bdf8',
          borderRadius: '24px',
          padding: '12px 32px',
          fontWeight: 800,
          fontSize: '16px',
          color: '#0369a1',
          boxShadow: '0 4px 10px rgba(56, 189, 248, 0.15)'
        }}>
          Incoming Request
        </div>

        {/* Down Arrow */}
        <div style={{ color: '#0ea5e9', fontSize: '20px', fontWeight: 'bold' }}>↓</div>

        {/* Node 2: AI Router (Hexagonal Shape) */}
        <div style={{
          background: '#0284c7',
          border: '2px solid #0369a1',
          borderRadius: '14px',
          padding: '14px 36px',
          fontWeight: 800,
          fontSize: '16px',
          color: '#ffffff',
          boxShadow: '0 6px 16px rgba(2, 132, 199, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚡</span>
          <span>AI Router</span>
        </div>

        {/* Branching Arrows with Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '640px', padding: '0 40px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
            ↙ Low Complexity
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>
            High Complexity ↘
          </div>
        </div>

        {/* Node 3: Left (Small/Fast) vs Right (Large/Reasoning) */}
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', width: '100%', maxWidth: '720px' }}>
          {/* Small Model */}
          <div style={{
            flex: 1,
            background: '#34d399',
            border: '2px solid #059669',
            borderRadius: '14px',
            padding: '20px 16px',
            textAlign: 'center',
            color: '#064e3b',
            boxShadow: '0 6px 16px rgba(52, 211, 153, 0.25)'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>Small/Fast Model</div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>(Low Token Cost)</div>
          </div>

          {/* Large Model */}
          <div style={{
            flex: 1,
            background: '#60a5fa',
            border: '2px solid #2563eb',
            borderRadius: '14px',
            padding: '20px 16px',
            textAlign: 'center',
            color: '#1e3a8a',
            boxShadow: '0 6px 16px rgba(96, 165, 250, 0.25)'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 800 }}>Large/Reasoning Model</div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>(High Token Cost)</div>
          </div>
        </div>

        {/* Converging Down Arrows */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '400px', padding: '0 50px' }}>
          <div style={{ color: '#059669', fontSize: '20px', fontWeight: 'bold' }}>↘</div>
          <div style={{ color: '#2563eb', fontSize: '20px', fontWeight: 'bold' }}>↙</div>
        </div>

        {/* Node 4: Final Output */}
        <div style={{
          background: '#0f766e',
          border: '2px solid #115e59',
          borderRadius: '24px',
          padding: '12px 36px',
          fontWeight: 800,
          fontSize: '16px',
          color: '#ffffff',
          boxShadow: '0 6px 16px rgba(15, 118, 110, 0.3)'
        }}>
          Final Output
        </div>
      </div>
    </div>
  );
}

// 4. Enterprise Context Strategy Decision Tree Diagram
export function EnterpriseDecisionTreeDiagram() {
  return (
    <div style={{
      background: '#090d16',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      borderRadius: '12px',
      padding: '28px 24px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>
          🌳 Enterprise Context Strategy Decision Tree
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Standardized architectural decision framework for engineering and product teams building production AI systems.
        </p>
      </div>

      {/* ROOT NODE: Safe Token Limit Check */}
      <div style={{ maxWidth: '640px', margin: '0 auto 20px auto', textAlign: 'center' }}>
        <div style={{
          background: '#1e293b',
          border: '2px solid #38bdf8',
          borderRadius: '10px',
          padding: '16px 20px',
          boxShadow: '0 4px 14px rgba(56, 189, 248, 0.15)'
        }}>
          <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '4px' }}>
            START EVALUATION
          </div>
          <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#ffffff' }}>
            Does input or required context exceed model's safe token limit (&gt;80% max context)?
          </div>
        </div>
      </div>

      {/* TWO PRIMARY BRANCHES: NO vs YES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* BRANCH NO: Standard Prompting */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid #10b981',
          borderRadius: '10px',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'inline-block', background: '#10b981', color: '#000', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', marginBottom: '10px' }}>
              BRANCH: NO
            </div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#10b981' }}>
              Use Standard Prompting
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
              Direct single-shot or few-shot inference. Input comfortably fits inside attention window without degradation.
            </p>
          </div>

          <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '6px', fontSize: '11px', color: '#94a3b8' }}>
            🛡️ <strong>Requirement:</strong> Monitor token telemetry via OpenTelemetry/LangSmith.
          </div>
        </div>

        {/* BRANCH YES: Goal-Oriented Sub-Branches */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '10px',
          padding: '18px'
        }}>
          <div style={{ display: 'inline-block', background: '#38bdf8', color: '#000', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', marginBottom: '10px' }}>
            BRANCH: YES ➔ What is the primary goal of the task?
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
            
            {/* Goal 1: Specific Q&A */}
            <div style={{ background: '#0f172a', border: '1px solid #3b82f6', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 'bold', marginBottom: '4px' }}>
                GOAL: Specific Q&A on Knowledge Base
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#60a5fa', marginBottom: '6px' }}>
                ⚡ USE: Advanced RAG
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                Hybrid Search (BM25 + Dense) + Cross-Encoder Reranker. Retrieve only top 3-5 relevant chunks; do NOT pass raw corpus.
              </div>
            </div>

            {/* Goal 2: Massive Document Summary */}
            <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#6ee7b7', fontWeight: 'bold', marginBottom: '4px' }}>
                GOAL: Analyze Massive Document (100+ pgs)
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#34d399', marginBottom: '6px' }}>
                📑 USE: Map-Reduce Pattern
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                Partition document into chunks ➔ Parallel SLM worker summary extraction ➔ Single Master Reduce aggregation.
              </div>
            </div>

            {/* Goal 3: Continuous Stream */}
            <div style={{ background: '#0f172a', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#fde68a', fontWeight: 'bold', marginBottom: '4px' }}>
                GOAL: Continuous Stream (Live Chat / Logs)
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '6px' }}>
                🔄 USE: Sliding Window + Summary
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                Retain last $N$ tokens verbatim + maintain a dynamic rolling compressed summary of all historical turns.
              </div>
            </div>

            {/* Goal 4: Mixed/Unknown Workloads */}
            <div style={{ background: '#0f172a', border: '1px solid #a855f7', borderRadius: '8px', padding: '12px' }}>
              <div style={{ fontSize: '11px', color: '#e9d5ff', fontWeight: 'bold', marginBottom: '4px' }}>
                GOAL: Mixed / Unknown Workload
              </div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#c084fc', marginBottom: '6px' }}>
                🔀 USE: Dynamic Model Router
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                Classifier evaluates task difficulty: route simple requests to cheap SLMs ($0.05/M) and escalate complex tasks to Frontier LLMs.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// 5. Pre-Flight Token Checks & Fallbacks Workflow Diagram
export function PreflightFallbackWorkflowDiagram() {
  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #38bdf8',
      borderRadius: '12px',
      padding: '28px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#38bdf8' }}>
          🛡️ Pre-Flight Token Check & Multi-Tier AI Fallback Cascade
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Automated pre-flight inspection gate, graceful truncation degradation, and provider circuit breaker failovers.
        </p>
      </div>

      {/* THREE-PATH PRE-FLIGHT GATE */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px auto',
        gap: '20px',
        background: '#0b1120',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        marginBottom: '24px'
      }}>
        {/* Left: Input & Estimator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>USER REQUEST</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>Incoming Prompt + Context</div>
          </div>
          <div style={{ textAlign: 'center', color: '#38bdf8', fontSize: '18px' }}>⬇️</div>
          <div style={{ background: '#0284c7', border: '2px solid #38bdf8', borderRadius: '8px', padding: '14px', textAlign: 'center', color: '#ffffff', boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold' }}>🛡️ PRE-FLIGHT GATE</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Token Estimator Shield</div>
            <div style={{ fontSize: '10px', opacity: 0.9, marginTop: '2px' }}>(cl100k_base &lt; 4,000 threshold)</div>
          </div>
        </div>

        {/* Right: 3 Execution Paths */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Green Path */}
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid #10b981', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ background: '#10b981', color: '#000', fontWeight: 'bold', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>
                1) GREEN PATH
              </span>
              <strong style={{ color: '#10b981', fontSize: '13px' }}>Safe Context &lt; 4,000 Tokens</strong>
              <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>Proceeds directly without modification to Primary LLM.</div>
            </div>
            <div style={{ background: '#10b981', color: '#000', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
              ➔ Primary LLM (GPT-4o)
            </div>
          </div>

          {/* Amber Path */}
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>
                2) AMBER PATH
              </span>
              <strong style={{ color: '#f59e0b', fontSize: '13px' }}>Moderate Overflow (4k - 8k Tokens)</strong>
              <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>Triggers Auto-Truncation + LLMLingua pruning + System Notice.</div>
            </div>
            <div style={{ background: '#f59e0b', color: '#000', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
              ➔ Safe Truncated LLM
            </div>
          </div>

          {/* Red Path */}
          <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid #ef4444', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ background: '#ef4444', color: '#fff', fontWeight: 'bold', fontSize: '10px', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>
                3) RED PATH
              </span>
              <strong style={{ color: '#ef4444', fontSize: '13px' }}>Severe Overload (&gt; 8k Tokens)</strong>
              <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '2px' }}>Trips single-prompt circuit breaker; dispatches parallel map-reduce.</div>
            </div>
            <div style={{ background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>
              ➔ Map-Reduce Fallback
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-PROVIDER CIRCUIT BREAKER & FAILOVER ARCHITECTURE */}
      <div style={{
        background: '#090d16',
        padding: '18px',
        borderRadius: '10px',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#c084fc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>⚡ Multi-Provider Circuit Breaker Failover Tier</span>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'normal' }}>(Zero-Downtime High Availability)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
          {/* Tier 1: Primary */}
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>TIER 1: PRIMARY</span>
              <span style={{ color: '#10b981' }}>● HEALTHY</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>OpenAI GPT-4o</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Direct fast inference (P50 150ms). Primary production traffic.</div>
          </div>

          {/* Tier 2: Secondary */}
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>TIER 2: SECONDARY</span>
              <span style={{ color: '#f59e0b' }}>● STANDBY / AUTO</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>Claude 3.5 Sonnet (Bedrock)</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Trips automatically on HTTP 429, timeouts &gt;5s, or &gt;10% error spikes.</div>
          </div>

          {/* Tier 3: Local Fallback */}
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span style={{ color: '#a855f7', fontWeight: 'bold' }}>TIER 3: AIR-GAP / LOCAL</span>
              <span style={{ color: '#38bdf8' }}>● AIR-GAP READY</span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f8fafc', marginBottom: '4px' }}>Local vLLM (Llama 3.1 70B)</div>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Disaster recovery fallback during multi-cloud WAN outages.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

