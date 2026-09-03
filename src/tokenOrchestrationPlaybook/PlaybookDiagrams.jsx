import React from 'react';

// 1. Container Stack Topology & Port Visualizer
export function ContainerStackTopologyDiagram() {
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
          🐳 Containerized Microservices Stack (Docker & Kubernetes)
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Standardized enterprise topology for LangChain, LangGraph, Redis Semantic Caching, and Qdrant Vector Storage.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* Service 1 */}
        <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8' }}>SERVICE: ai-api</span>
            <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#7dd3fc', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>PORT 8000</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
            FastAPI AI Gateway
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Python 3.11-slim container running LangGraph workflows with 4 async Uvicorn workers. Dispatches non-blocking calls.
          </p>
          <div style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '4px' }}>
            Endpoints: <code>POST /query</code>, <code>POST /batch</code>
          </div>
        </div>

        {/* Service 2 */}
        <div style={{ background: '#0f172a', border: '1px solid #ef4444', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ef4444' }}>SERVICE: redis</span>
            <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>PORT 6379 / 8001</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
            Redis Stack
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Semantic caching with vector indexing, token bucket rate limiting, and RedisInsight UI on port 8001 for real-time memory inspection.
          </p>
          <div style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '4px' }}>
            Capabilities: Semantic Cache, Session Memory
          </div>
        </div>

        {/* Service 3 */}
        <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>SERVICE: qdrant</span>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>PORT 6333 / 6334</span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
            Qdrant Vector DB
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            High-speed HNSW indexing for hybrid search. Exposes REST API on port 6333 and low-latency gRPC RPC on port 6334.
          </p>
          <div style={{ fontSize: '10px', color: '#94a3b8', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '4px' }}>
            Persistence: <code>/qdrant/storage</code> volume
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. LangSmith Trace Waterfall & Run Tree Diagram
export function LangSmithTraceWaterfallDiagram() {
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
          📊 LangSmith Token Governance & Custom Business Metadata
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Attaching custom business metadata (`tokens_saved`, `cache_hit`, `routing_model`) to prove ROI to leadership.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        {/* Left: Waterfall Tree */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', border: '1px solid var(--ds-color-border-subtle)' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '10px' }}>
            RUN-TREE WATERFALL SPANS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', borderLeft: '4px solid #38bdf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>root: Enterprise RAG Pipeline</strong>
                <span style={{ color: '#38bdf8' }}>14ms</span>
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', borderLeft: '4px solid #10b981', marginLeft: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>tool: redis_semantic_cache_check</span>
                <span style={{ color: '#10b981' }}>12ms</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '1px 6px', borderRadius: '3px', fontSize: '10px' }}>
                  cache_hit: true
                </span>
                <span style={{ background: 'rgba(56, 189, 248, 0.2)', color: '#7dd3fc', padding: '1px 6px', borderRadius: '3px', fontSize: '10px' }}>
                  tokens_saved: 450
                </span>
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', borderLeft: '4px solid #a855f7', marginLeft: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>output: deliver_cached_answer</span>
                <span style={{ color: '#a855f7' }}>2ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: ROI Dashboard Summary */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '16px', border: '1px solid var(--ds-color-border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '8px' }}>
            EXECUTIVE ROI DASHBOARD
          </div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#10b981', marginBottom: '4px' }}>
            12.45M TOKENS SAVED
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8', marginBottom: '12px' }}>
            $8,715 Cost Avoidance This Month
          </div>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            By grouping traces by <code>cache_hit: true</code> and routing model in LangSmith, engineering teams can prove token efficiency metrics directly to the CFO.
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. LangGraph Parallel Branching Diagram
export function LangGraphParallelBranchingDiagram() {
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
          ⚡ Async Non-Blocking & Parallel LangGraph Multi-Source Execution
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Executing Vector DB search and SQL Database queries concurrently via the LangGraph StateGraph API.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr 60px 1fr', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
        {/* Entry Point */}
        <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>ENTRY NODE</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0' }}>User Query</div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>State: <code>AgentState</code></div>
        </div>

        <div style={{ fontSize: '18px', color: '#f59e0b', fontWeight: 'bold' }}>➔</div>

        {/* Parallel Branches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
            <strong style={{ color: '#10b981' }}>Node A: vector_search</strong>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Runs async Qdrant query</div>
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '8px', padding: '10px', fontSize: '12px' }}>
            <strong style={{ color: '#10b981' }}>Node B: sql_search</strong>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Runs async SQL database query</div>
          </div>
        </div>

        <div style={{ fontSize: '18px', color: '#f59e0b', fontWeight: 'bold' }}>➔</div>

        {/* Merge Node */}
        <div style={{ background: '#0f172a', border: '1px solid #a855f7', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 'bold' }}>SYNTHESIZE NODE</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0' }}>llm_synthesize</div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Merges vector + SQL context</div>
        </div>
      </div>
    </div>
  );
}
