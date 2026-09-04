/**
 * playbookEngine.js
 * Engine for Enterprise AI Token Management & Orchestration Playbook
 * Curated by: Nagaraj Y
 * Educational use only. No commercial use.
 */

// ==========================================
// 1. DOCKER & K8S SERVICES CONFIGURATION
// ==========================================

export const CONTAINER_SERVICES = [
  {
    id: 'ai-api',
    name: 'FastAPI AI Gateway',
    image: 'custom (python:3.11-slim)',
    port: '8000',
    role: 'Orchestration Runtime',
    description: 'Runs LangChain and LangGraph stateful graphs with 4 async Uvicorn workers. Executes non-blocking .ainvoke().',
    envVars: ['OPENAI_API_KEY', 'REDIS_HOST', 'QDRANT_HOST', 'LANGCHAIN_TRACING_V2=true'],
    status: 'HEALTHY',
    metrics: { cpu: '18%', memory: '420MB', p95Latency: '120ms' }
  },
  {
    id: 'redis',
    name: 'Redis Stack (Vector + Cache)',
    image: 'redis/redis-stack:latest',
    port: '6379 / 8001 (RedisInsight)',
    role: 'Tier-1 Semantic Cache & Rate Limiter',
    description: 'Provides in-memory semantic similarity caching (0ms hits) and token bucket rate-limiting across tenant API keys.',
    envVars: ['REDIS_DATA_DIR=/data'],
    status: 'HEALTHY',
    metrics: { cpu: '4%', memory: '1.2GB', cacheHitRate: '74%' }
  },
  {
    id: 'qdrant',
    name: 'Qdrant Vector Database',
    image: 'qdrant/qdrant:latest',
    port: '6333 (REST) / 6334 (gRPC)',
    role: 'Dense Vector & Hybrid Storage',
    description: 'High-performance vector index supporting HNSW indexing, cosine similarity, payload filtering, and fast reciprocal rank fusion.',
    envVars: ['QDRANT__STORAGE__STORAGE_PATH=/qdrant/storage'],
    status: 'HEALTHY',
    metrics: { cpu: '12%', memory: '2.8GB', searchP95: '24ms' }
  }
];

export const K8S_PRODUCTION_RULES = [
  {
    category: 'Secrets Management',
    principle: 'Zero Plaintext Keys',
    description: 'Never hardcode LLM API keys in Dockerfiles or Compose files. Inject via Kubernetes Secrets backed by HashiCorp Vault or AWS Secrets Manager with dynamic rotation.',
    severity: 'CRITICAL'
  },
  {
    category: 'Autoscaling (HPA)',
    principle: 'Custom Metric Scaling',
    description: 'Scale FastAPI pods on custom metrics (active HTTP request queue depth & LangGraph task concurrency) rather than basic CPU, preventing event-loop congestion.',
    severity: 'HIGH'
  },
  {
    category: 'State & Persistence',
    principle: 'Managed Stateful Tiers',
    description: 'Avoid running Redis and vector storage on unmanaged K8s nodes. Use AWS ElastiCache and Qdrant Cloud to guarantee 99.99% SLAs and automated multi-AZ failover.',
    severity: 'RECOMMENDED'
  }
];


// ==========================================
// 2. LANGSMITH OBSERVABILITY & GOVERNANCE
// ==========================================

export const LANGSMITH_SCENARIOS = [
  {
    id: 'cache_hit',
    title: '1. Semantic Cache Hit (0 Tokens)',
    query: 'What is our standard employee PTO rollover policy?',
    cacheHit: true,
    tokensSaved: 480,
    costAvoided: '$0.024',
    latencyMs: 14,
    routingModel: 'None (Direct Redis Hit)',
    spans: [
      { name: 'Enterprise RAG Pipeline', type: 'chain', latency: '14ms', tokens: 0, status: 'OK' },
      { name: 'redis_semantic_cache_check', type: 'tool', latency: '12ms', tokens: 0, status: 'HIT (sim=0.96)' },
      { name: 'return_cached_response', type: 'output', latency: '2ms', tokens: 0, status: 'DELIVERED' }
    ]
  },
  {
    id: 'router_small',
    title: '2. Low Complexity ➔ Fast Model (gpt-4o-mini)',
    query: 'Summarize our standard password reset policy in 2 bullet points.',
    cacheHit: false,
    tokensSaved: 1200, // saved compared to gpt-4o
    costAvoided: '$0.015',
    latencyMs: 180,
    routingModel: 'gpt-4o-mini',
    spans: [
      { name: 'Enterprise RAG Pipeline', type: 'chain', latency: '180ms', tokens: 260, status: 'OK' },
      { name: 'redis_semantic_cache_check', type: 'tool', latency: '15ms', tokens: 0, status: 'MISS (sim=0.64)' },
      { name: 'assess_complexity_node', type: 'chain', latency: '25ms', tokens: 40, status: 'SCORE: 0.18 (LOW)' },
      { name: 'qdrant_vector_search', type: 'retriever', latency: '40ms', tokens: 0, status: 'RETRIEVED 2 CHUNKS' },
      { name: 'llm_call_gpt4o_mini', type: 'llm', latency: '100ms', tokens: 220, status: 'OK' }
    ]
  },
  {
    id: 'router_large',
    title: '3. High Complexity ➔ Frontier Model (claude-3-5-sonnet)',
    query: 'Reconcile conflicting indemnity caps between Master Services Agreement Section 14 and Data Addendum Section 3.',
    cacheHit: false,
    tokensSaved: 0,
    costAvoided: '$0.000',
    latencyMs: 890,
    routingModel: 'claude-3-5-sonnet',
    spans: [
      { name: 'Enterprise RAG Pipeline', type: 'chain', latency: '890ms', tokens: 3450, status: 'OK' },
      { name: 'redis_semantic_cache_check', type: 'tool', latency: '18ms', tokens: 0, status: 'MISS (sim=0.41)' },
      { name: 'assess_complexity_node', type: 'chain', latency: '35ms', tokens: 60, status: 'SCORE: 0.88 (HIGH)' },
      { name: 'hybrid_retrieval_and_rerank', type: 'retriever', latency: '120ms', tokens: 0, status: 'RETRIEVED 8 CHUNKS' },
      { name: 'llm_call_claude_35_sonnet', type: 'llm', latency: '717ms', tokens: 3390, status: 'OK' }
    ]
  }
];


// ==========================================
// 3. TESTING & RAGAS EVALUATION FRAMEWORK
// ==========================================

export function EVALUATE_RAGAS_BENCHMARK(faithfulnessScore, answerRelevancyScore, contextPrecisionScore) {
  const isFaithfulnessCritical = faithfulnessScore < 0.80;
  const isOverallPassing = faithfulnessScore >= 0.80 && answerRelevancyScore >= 0.75 && contextPrecisionScore >= 0.70;

  let diagnostic = '';
  if (isFaithfulnessCritical) {
    diagnostic = 'CRITICAL ALERT: Faithfulness is below 0.80! Your token compression (e.g. aggressive chunking or LLMLingua) is cutting vital context, causing hallucinated answers.';
  } else if (!isOverallPassing) {
    diagnostic = 'WARNING: Retrieval precision or answer relevancy is below threshold. Refine query decomposition or add neural reranking.';
  } else {
    diagnostic = 'HEALTHY: All RAGAS metrics exceed production gates. Safe to deploy to CI/CD pipeline.';
  }

  return {
    faithfulnessScore,
    answerRelevancyScore,
    contextPrecisionScore,
    isFaithfulnessCritical,
    isOverallPassing,
    diagnostic
  };
}

export const PYTEST_CODE_SAMPLE = `import pytest
from your_app.router import router_app, RouterState

def test_complexity_assessment_node():
    """Verify that the complexity node correctly scores simple questions."""
    initial_state = {
        "query": "What is the capital of France?",
        "complexity_score": 0.0,
        "routing_decision": "",
        "model_response": "",
        "tokens_used": 0,
        "fallback_count": 0
    }
    updated_state = router_app.get_node("assess_complexity").invoke(initial_state)
    assert updated_state["complexity_score"] < 0.4

def test_full_graph_routing():
    """Verify that ambiguous multi-part questions route to frontier models."""
    initial_state = {
        "query": "Explain the ethical and legal implications of autonomous agents.",
        "complexity_score": 0.0,
        "routing_decision": "",
        "model_response": "",
        "tokens_used": 0,
        "fallback_count": 0
    }
    final_state = router_app.invoke(initial_state)
    assert final_state["routing_decision"] == "large_model"
    assert final_state["model_response"] != ""`;


// ==========================================
// 4. PERFORMANCE OPTIMIZATION (ASYNC & PARALLEL)
// ==========================================

export const PERFORMANCE_MODES = [
  {
    id: 'sync_blocking',
    name: '1. Synchronous Blocking (.invoke())',
    latency: '1,450ms',
    concurrency: 'Single Request / Worker',
    eventLoopStatus: 'EVENT LOOP BLOCKED ❌',
    throughput: '4 req/sec',
    verdict: 'DISASTROUS FOR PRODUCTION: Blocks the Python GIL / async event loop, choking other incoming requests.'
  },
  {
    id: 'async_ainvoke',
    name: '2. Async Non-Blocking (.ainvoke())',
    latency: '340ms',
    concurrency: '100+ Concurrent Requests',
    eventLoopStatus: 'EVENT LOOP FREE ✅',
    throughput: '85 req/sec',
    verdict: 'STANDARD BASELINE: Releases event loop during I/O waits, allowing high server throughput.'
  },
  {
    id: 'parallel_graph',
    name: '3. LangGraph Parallel Branching (Send API)',
    latency: '190ms',
    concurrency: 'Simultaneous Multi-Source I/O',
    eventLoopStatus: 'PARALLEL I/O BRANCHES ✅',
    throughput: '120 req/sec',
    verdict: 'MAXIMUM VELOCITY: Queries Vector DB + SQL Database + Web in parallel; total latency equals the slowest single source.'
  },
  {
    id: 'batch_abatch',
    name: '4. Batch Processing (.abatch(concurrency=10))',
    latency: '2,100ms (for 50 chunks)',
    concurrency: '10-Way Rate-Limited Parallelism',
    eventLoopStatus: 'CONTROLLED PIPELINE ✅',
    throughput: '250 chunks/sec',
    verdict: 'IDEAL FOR MAP-REDUCE: Chunks large documents in parallel while strictly respecting provider rate limits.'
  }
];


// ==========================================
// 5. 4-PHASE ENTERPRISE EXECUTION CHECKLIST
// ==========================================

export const FOUR_PHASE_ROADMAP = [
  {
    phase: 1,
    title: 'Phase 1: Audit & Protect',
    timeframe: 'Week 1',
    color: '#38bdf8',
    tasks: [
      { id: 'p1_1', text: 'Implement tiktoken pre-flight checks and auto-truncation in API middleware.', done: true },
      { id: 'p1_2', text: 'Set up LangSmith tracing with project keys to baseline current token usage & costs.', done: true },
      { id: 'p1_3', text: 'Establish baseline P95 latency and per-request token consumption profiles.', done: true }
    ]
  },
  {
    phase: 2,
    title: 'Phase 2: Optimize Retrieval',
    timeframe: 'Weeks 2-3',
    color: '#10b981',
    tasks: [
      { id: 'p2_1', text: 'Upgrade naive character chunking to Parent-Child (Auto-Merging) chunking in Qdrant.', done: true },
      { id: 'p2_2', text: 'Deploy neural cross-encoder reranker (FlashRank/Cohere) to maximize top-k NDCG.', done: true },
      { id: 'p2_3', text: 'Enforce strict Zero-Hallucination and Query Decomposition prompt templates.', done: false }
    ]
  },
  {
    phase: 3,
    title: 'Phase 3: Reduce Costs',
    timeframe: 'Week 4',
    color: '#f59e0b',
    tasks: [
      { id: 'p3_1', text: 'Deploy Redis Stack semantic cache to capture 25-45% of duplicate/similar queries.', done: false },
      { id: 'p3_2', text: 'Implement LangGraph Dynamic Router to divert simple queries to low-cost models.', done: false },
      { id: 'p3_3', text: 'Instrument custom business metrics (tokens_saved, cache_hit) in LangSmith run trees.', done: false }
    ]
  },
  {
    phase: 4,
    title: 'Phase 4: Productionize',
    timeframe: 'Month 2',
    color: '#a855f7',
    tasks: [
      { id: 'p4_1', text: 'Containerize microservices using Docker Compose and deploy to K8s with HPA.', done: false },
      { id: 'p4_2', text: 'Implement RAGAS automated testing suite in CI/CD pipeline (blocking if Faithfulness < 0.80).', done: false },
      { id: 'p4_3', text: 'Migrate all synchronous LLM calls to asyncio / .ainvoke() and parallel LangGraph nodes.', done: false }
    ]
  }
];
