import React from 'react';

// 1. Agentic Patterns Quad Diagram
export function AgenticPatternsQuadDiagram() {
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
          🤖 The 4 Core Enterprise Agentic Patterns
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Autonomous, goal-driven systems that plan, invoke tools, retain memory, and collaborate.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {/* Pattern 1 */}
        <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PATTERN A</span>
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ffffff' }}>ReAct Loop</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>Reason + Act</p>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Thought ➔ Action (Tool) ➔ Observation ➔ Synthesis. Ideal for single-agent search and calculation tasks.
          </div>
        </div>

        {/* Pattern 2 */}
        <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PATTERN B</span>
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ffffff' }}>Plan-and-Execute</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>StateGraph Router</p>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Planner drafts steps ➔ Executor works sequentially ➔ Replanner updates plan on intermediate errors.
          </div>
        </div>

        {/* Pattern 3 */}
        <div style={{ background: '#0f172a', border: '1px solid #f59e0b', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PATTERN C</span>
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ffffff' }}>Multi-Agent Review</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>Specialist Pipeline</p>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Researcher ➔ Analyst ➔ Writer ➔ Reviewer. Cycles back to Writer until Reviewer issues APPROVED.
          </div>
        </div>

        {/* Pattern 4 */}
        <div style={{ background: '#0f172a', border: '1px solid #a855f7', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>PATTERN D</span>
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ffffff' }}>Supervisor-Worker</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>Hierarchical Team</p>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Master Supervisor evaluates state, delegates to Data Scientist, Engineer, or Researcher, then FINISH.
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Full-Stack Observability Stack Diagram
export function FullStackObservabilityStackDiagram() {
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
          📊 Enterprise 4-Layer Observability Stack
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Understanding system behavior, cost attribution, latency bottlenecks, and compliance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Layer 1 */}
        <div style={{ background: '#0f172a', borderLeft: '6px solid #10b981', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>LAYER 1: BUSINESS METRICS</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Cost per query, CSAT user feedback (1-5), business unit cost attribution, token savings ROI</div>
          </div>
          <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
            LangSmith / BI Data Lake
          </span>
        </div>

        {/* Layer 2 */}
        <div style={{ background: '#0f172a', borderLeft: '6px solid #38bdf8', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#38bdf8' }}>LAYER 2: APPLICATION METRICS</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>P95 / P99 latency, requests per second (RPS), error rates, cache hit rate percentage</div>
          </div>
          <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
            Prometheus & Grafana
          </span>
        </div>

        {/* Layer 3 */}
        <div style={{ background: '#0f172a', borderLeft: '6px solid #f59e0b', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#f59e0b' }}>LAYER 3: LLM TRACING</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Run-tree span waterfalls, prompt/completion token usage, tool payload inspection, guardrail trips</div>
          </div>
          <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
            OpenTelemetry & LangSmith
          </span>
        </div>

        {/* Layer 4 */}
        <div style={{ background: '#0f172a', borderLeft: '6px solid #a855f7', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#a855f7' }}>LAYER 4: INFRASTRUCTURE</div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Container CPU/Memory, GPU compute occupancy, Redis memory eviction, structured JSON log events</div>
          </div>
          <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold' }}>
            Kubernetes & ELK Stack
          </span>
        </div>
      </div>
    </div>
  );
}

// 3. End-to-End Enterprise Integration Architecture
export function EndToEndEnterpriseArchitectureDiagram() {
  return (
    <div style={{
      background: '#090d16',
      border: '1px solid #a855f7',
      borderRadius: '12px',
      padding: '24px 20px',
      color: '#f8fafc',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#a855f7' }}>
          🏛️ Complete Enterprise Integration Architecture
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Decoupled, horizontally scalable infrastructure combining Kafka, Celery, Ray, Redis Cluster, and Vector DBs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1.2fr 40px 1.2fr', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
        {/* Tier 1 */}
        <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>INGRESS TIER</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0' }}>API Gateway</div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>Consistent Hash Router + Rate Limiting</div>
        </div>

        <div style={{ fontSize: '18px', color: '#38bdf8', fontWeight: 'bold' }}>➔</div>

        {/* Tier 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #f59e0b', borderRadius: '8px', padding: '8px', fontSize: '11px' }}>
            <strong style={{ color: '#f59e0b' }}>Kafka Event Stream</strong>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>ai-queries ➔ ai-processing</div>
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '8px', padding: '8px', fontSize: '11px' }}>
            <strong style={{ color: '#10b981' }}>Redis Cluster Cache</strong>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>TTL Caching & Invalidation</div>
          </div>
        </div>

        <div style={{ fontSize: '18px', color: '#a855f7', fontWeight: 'bold' }}>➔</div>

        {/* Tier 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #a855f7', borderRadius: '8px', padding: '8px', fontSize: '11px' }}>
            <strong style={{ color: '#a855f7' }}>AI Processing Layer</strong>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>RAG + Agentic StateGraph</div>
          </div>
          <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '8px', padding: '8px', fontSize: '11px' }}>
            <strong style={{ color: '#38bdf8' }}>Distributed Workloads</strong>
            <div style={{ fontSize: '9px', color: '#94a3b8' }}>Celery Chords + Ray Cluster</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4. Security, Compliance & Guardrails Pipeline Diagram
export function SecurityGuardrailsPipelineDiagram() {
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
          🛡️ Enterprise 3-Stage Security & Guardrails Pipeline
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Eliminating PII leaks, neutralizing prompt injections, and enforcing strict RBAC in vector retrieval.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {/* Stage 1 */}
        <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>STAGE 1</span>
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ffffff' }}>Presidio PII Redaction</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>Local NLP Sanitization</p>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Replaces SSNs, emails, phone numbers, and full names with anonymized entity tokens prior to LLM dispatch.
          </div>
        </div>

        {/* Stage 2 */}
        <div style={{ background: '#0f172a', border: '1px solid #ef4444', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>STAGE 2</span>
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ffffff' }}>Injection & Toxicity Defense</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>LLM Guard / NeMo</p>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Scans input prompts against jailbreak patterns and exfiltration triggers. Trips security alarm if score &gt; 0.50.
          </div>
        </div>

        {/* Stage 3 */}
        <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '10px', padding: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>STAGE 3</span>
          <h4 style={{ margin: '8px 0 4px 0', fontSize: '14px', color: '#ffffff' }}>RBAC Pre-Filtered Vector DB</h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: '#94a3b8' }}>Security-Trimmed Search</p>
          <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            Injects user role permissions directly into vector database filter clause, ensuring zero unauthorized chunk exposure.
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Tech Stack Adaptation Comparison Diagram
export function StackAdaptationComparisonDiagram() {
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
          ☕ Multi-Stack Architecture: Python vs Spring AI vs AWS Bedrock
        </h3>
        <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>
          Translating LangChain and LangGraph paradigms into enterprise Java and cloud-native AWS services.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div style={{ background: '#0f172a', border: '1px solid #38bdf8', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#38bdf8' }}>PYTHON ECOSYSTEM</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 8px 0' }}>LangChain & LangGraph</div>
          <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
            Rapid AI research, StateGraph multi-agent cyclical loops, Qdrant/Chroma clients, and native LangSmith tracing.
          </p>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>JAVA / SPRING AI</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 8px 0' }}>Spring AI & Micrometer</div>
          <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
            Enterprise Java Spring Boot services, ChatClient with advisors, pgvector store, and Micrometer OpenTelemetry.
          </p>
        </div>

        <div style={{ background: '#0f172a', border: '1px solid #f59e0b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }}>AWS CLOUD-NATIVE</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 8px 0' }}>Bedrock & Step Functions</div>
          <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, lineHeight: '1.4' }}>
            Managed Bedrock Agents with OpenAPI action groups, OpenSearch Serverless RAG, and Step Functions Map-Reduce.
          </p>
        </div>
      </div>
    </div>
  );
}

