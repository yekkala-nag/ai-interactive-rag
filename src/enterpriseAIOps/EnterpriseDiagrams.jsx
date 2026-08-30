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
