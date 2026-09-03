/**
 * advancedPlaybookEngine.js
 * Engine for Enterprise AI Playbook: Advanced Topics
 * (Agentic Patterns, Observability & Distributed Computing)
 * Curated by: Nagaraj Y
 * Disclaimer: This is only for Education purpose
 */

// ==========================================
// 1. CORE AGENTIC PATTERNS
// ==========================================

export const AGENTIC_PATTERNS = [
  {
    id: 'react',
    name: 'Pattern A: ReAct (Reason + Act)',
    badge: 'Fundamental Loop',
    formula: 'Thought ➔ Action ➔ Observation ➔ Synthesis',
    description: 'The LLM explicitly articulates reasoning steps before invoking tools, observing intermediate feedback to iteratively adjust course.',
    sampleQuery: 'What is the population of the city where the 2024 Olympics are held?',
    steps: [
      { step: 1, type: 'thought', text: 'I need to find which city hosted the 2024 Summer Olympics first.' },
      { step: 2, type: 'action', text: 'tool: DuckDuckGoSearchRun("2024 Olympics host city")' },
      { step: 3, type: 'observation', text: 'Observation: Paris, France was the host city for the 2024 Summer Olympics.' },
      { step: 4, type: 'thought', text: 'Now I need to find the population of Paris, France.' },
      { step: 5, type: 'action', text: 'tool: DuckDuckGoSearchRun("Paris France city population")' },
      { step: 6, type: 'observation', text: 'Observation: Paris proper has approximately 2.1 million residents (urban area over 12 million).' },
      { step: 7, type: 'final', text: 'Final Answer: The 2024 Olympics were held in Paris, France, which has an urban population of approximately 2.1 million residents.' }
    ]
  },
  {
    id: 'plan_execute',
    name: 'Pattern B: Plan-and-Execute',
    badge: 'LangGraph StateGraph',
    formula: 'Planner ➔ Step-by-Step Executor ➔ Dynamic Replanner',
    description: 'Decouples high-level planning from step execution. One specialized LLM drafts an actionable step list, an executor iterates through them, and a replanner adjusts if intermediate obstacles arise.',
    sampleQuery: 'Research and summarize the top 3 AI trends in 2024.',
    steps: [
      { step: 1, type: 'planner', text: 'Generated 3-Step Plan: [1. Search AI industry reports for 2024, 2. Synthesize common themes into 3 pillars, 3. Draft executive summary]' },
      { step: 2, type: 'executor', text: 'Executing Step 1: Querying Gartner and Stanford HAI 2024 reports...' },
      { step: 3, type: 'replanner', text: 'Replanner check: Found 4 major trends. Updating plan to focus on Agentic AI, Small Language Models, and RAG Governance.' },
      { step: 4, type: 'executor', text: 'Executing Step 2 & 3: Synthesizing trends and generating final executive briefing.' },
      { step: 5, type: 'final', text: 'Plan Complete: Executive summary produced across 3 verified pillars.' }
    ]
  },
  {
    id: 'multi_agent',
    name: 'Pattern C: Multi-Agent Collaboration',
    badge: 'Peer Network',
    formula: 'Researcher ➔ Analyst ➔ Writer ➔ Reviewer ➔ Approval Loop',
    description: 'Specialized role-based agents operate sequentially with a critique/revision loop. The reviewer must output "APPROVED" before terminating.',
    sampleQuery: 'Create a comprehensive report on quantum computing applications in finance.',
    steps: [
      { step: 1, type: 'researcher', text: 'Researcher: Gathered 14 papers on quantum portfolio optimization and Monte Carlo acceleration.' },
      { step: 2, type: 'analyst', text: 'Analyst: Extracted key quantitative trade-offs: Quadratic speedups vs current qubit error rates.' },
      { step: 3, type: 'writer', text: 'Writer: Drafted 3-page structured whitepaper with technical appendices.' },
      { step: 4, type: 'reviewer', text: 'Reviewer: Missing concrete risk analysis on NISQ era hardware limitations. Verdict: REVISE.' },
      { step: 5, type: 'writer', text: 'Writer (Revision 2): Incorporated quantum error mitigation and NISQ timeline analysis.' },
      { step: 6, type: 'reviewer', text: 'Reviewer: Accuracy and completeness verified. Verdict: APPROVED ✅' }
    ]
  },
  {
    id: 'supervisor',
    name: 'Pattern D: Supervisor-Agent (Hierarchical)',
    badge: 'Hierarchical Router',
    formula: 'Supervisor ➔ Dynamic Delegation ➔ Worker Node ➔ FINISH',
    description: 'A master supervisor evaluates conversation history and delegates each turn to a specialist (Data Scientist, Software Engineer, or Researcher).',
    sampleQuery: 'Build a machine learning model to predict customer churn.',
    steps: [
      { step: 1, type: 'supervisor', text: 'Supervisor: First, we need background domain understanding. Delegating to: RESEARCHER.' },
      { step: 2, type: 'worker', text: 'Researcher: Identified telecommunication churn factors: contract type, monthly charges, customer tenure.' },
      { step: 3, type: 'supervisor', text: 'Supervisor: Need exploratory data analysis and feature distributions. Delegating to: DATA_SCIENTIST.' },
      { step: 4, type: 'worker', text: 'Data Scientist: Computed correlation matrix; monthly charges and fiber optic internet showed highest collinearity with churn.' },
      { step: 5, type: 'supervisor', text: 'Supervisor: Need production training script and FastAPI endpoint. Delegating to: ENGINEER.' },
      { step: 6, type: 'worker', text: 'Engineer: Built LightGBM training pipeline with serialized artifact and inference container.' },
      { step: 7, type: 'supervisor', text: 'Supervisor: All objectives fulfilled. Output: FINISH.' }
    ]
  }
];


// ==========================================
// 2. AGENT MEMORY PATTERNS & TOOLS
// ==========================================

export const MEMORY_PATTERNS = [
  {
    name: 'Short-Term Memory',
    implementation: 'ConversationBufferMemory',
    mechanism: 'Stores raw message tuples in RAM or Redis session keys.',
    pros: 'Zero retrieval latency, full conversational context.',
    cons: 'Blows up context window on long chats ($O(N)$ tokens).',
    bestFor: 'Multi-turn dialogs under 10 messages.'
  },
  {
    name: 'Long-Term Memory',
    implementation: 'VectorStoreRetrieverMemory (Chroma/Qdrant)',
    mechanism: 'Embeds past user statements and queries them via top-k cosine similarity.',
    pros: 'Infinite historical recall without token bloat ($O(k)$ context).',
    cons: 'Embedding lookup latency (15-40ms); semantic retrieval misses chronological ordering.',
    bestFor: 'Persistent customer profiles and multi-session knowledge bases.'
  },
  {
    name: 'Entity Memory',
    implementation: 'EntityMemory (LLM Fact Extraction)',
    mechanism: 'Extracts explicit subject-predicate entities into an evolving knowledge graph/table.',
    pros: 'Structured, deterministic recall of facts (e.g. "User budget: $50k").',
    cons: 'Requires additional LLM extraction call on each conversation turn.',
    bestFor: 'Complex advisory agents (wealth management, legal, healthcare).'
  }
];

export function SIMULATE_TOOL_EXECUTION(toolName, params) {
  if (toolName === 'calculate_roi') {
    const inv = Number(params.investment) || 10000;
    const ret = Number(params.returnAmount) || 25000;
    const roi = (((ret - inv) / inv) * 100).toFixed(1);
    return {
      status: 'SUCCESS',
      output: `ROI Calculation Result: ${roi}% (Net Gain: $${(ret - inv).toLocaleString()})`,
      executionTimeMs: 1
    };
  } else if (toolName === 'search_database') {
    return {
      status: 'SUCCESS',
      output: `Results from [${params.table || 'customers'}]: Found 3 records matching query "${params.query || 'active'}": [ID 101: ACME Corp ($45k ARR), ID 204: GlobalTech ($120k ARR), ID 309: CyberSec ($85k ARR)]`,
      executionTimeMs: 18
    };
  } else if (toolName === 'send_slack_notification') {
    return {
      status: 'SUCCESS',
      output: `Webhook dispatched to #${params.channel || 'alerts'}: "${params.message || 'Workflow completed'}" [Status: 200 OK]`,
      executionTimeMs: 45
    };
  }
  return { status: 'ERROR', output: 'Unknown tool', executionTimeMs: 0 };
}


// ==========================================
// 3. FULL-STACK OBSERVABILITY & METRICS
// ==========================================

export const OBSERVABILITY_LAYERS = [
  {
    layer: '1. Business Metrics Layer',
    color: '#10b981',
    metrics: ['Cost per query (USD)', 'User CSAT rating (1-5)', 'Business unit attribution', 'Token ROI / cost avoided'],
    tooling: 'LangSmith metadata, Custom Analytics Warehouse'
  },
  {
    layer: '2. Application Metrics Layer',
    color: '#38bdf8',
    metrics: ['P95 / P99 Latency (ms)', 'Request throughput (req/s)', 'Cache hit rate (%)', 'Error / fallback frequency'],
    tooling: 'Prometheus, Datadog, CloudWatch'
  },
  {
    layer: '3. LLM Tracing Layer',
    color: '#f59e0b',
    metrics: ['Span waterfall duration', 'Prompt vs completion tokens', 'Tool call payloads', 'Guardrail trip logs'],
    tooling: 'OpenTelemetry GenAI, LangSmith run-tree, Phoenix'
  },
  {
    layer: '4. Infrastructure Layer',
    color: '#a855f7',
    metrics: ['Pod CPU & Memory utilization', 'GPU VRAM & compute occupancy', 'Redis memory & evictions', 'Network I/O wait'],
    tooling: 'Kubernetes metrics-server, Grafana, ELK Stack'
  }
];

export function GENERATE_LIVE_PROMETHEUS_METRICS(qpsRate, cacheHitRatio) {
  const baseLatency = cacheHitRatio > 0.6 ? 140 : 380;
  const promptTokensPerSec = Math.round(qpsRate * 450 * (1 - cacheHitRatio));
  const completionTokensPerSec = Math.round(qpsRate * 120 * (1 - cacheHitRatio));
  const hourlyCostEst = (((promptTokensPerSec * 0.000005) + (completionTokensPerSec * 0.000015)) * 3600).toFixed(2);

  return {
    qpsRate,
    cacheHitRatio: Math.round(cacheHitRatio * 100),
    p95LatencyMs: baseLatency,
    tokensPerSec: promptTokensPerSec + completionTokensPerSec,
    hourlyCostEst,
    activeAgents: Math.round(qpsRate * 1.8),
    errorRate: '0.04%'
  };
}


// ==========================================
// 4. DISTRIBUTED COMPUTING MODELS
// ==========================================

export const DISTRIBUTED_STACKS = [
  {
    tech: 'Celery + Redis',
    role: 'Asynchronous Task Queue & Chords',
    highlight: 'Map-Reduce chord pattern partitions 500-page document into parallel workers, then aggregates summaries into a single final synthesis.',
    snippet: `chord(process_document_chunk.s(chunk) for chunk in chunks)(aggregate_results.s())`
  },
  {
    tech: 'Ray Distributed Cluster',
    role: 'Actor Pools & Remote RAG Service',
    highlight: 'Distributes Python memory across cluster head node and workers. Actor pool automatically balances inference and dense vector retrieval with zero GIL bottlenecks.',
    snippet: `@remote class DistributedRAGService: ... ray.get([pool.process.remote(b) for b in batches])`
  },
  {
    tech: 'Apache Kafka',
    role: 'High-Throughput Event Streaming',
    highlight: 'Decoupled query topics (ai-queries ➔ ai-processing ➔ ai-responses). Guarantees order per query_id with manual offset commit for fault tolerance.',
    snippet: `producer.send('ai-queries', key=query_id, value=event) ... consumer.commit()`
  }
];


// ==========================================
// 5. CONSISTENT HASHING ALGORITHM
// ==========================================

export function SIMULATE_CONSISTENT_HASH_ROUTING(nodes, query) {
  // Simple deterministic hash simulation
  let hashVal = 0;
  for (let i = 0; i < query.length; i++) {
    hashVal = (hashVal * 31 + query.charCodeAt(i)) % 1000000;
  }
  const assignedIndex = hashVal % nodes.length;
  const assignedWorker = nodes[assignedIndex];

  return {
    query,
    hashVal,
    assignedWorker,
    virtualRingPosition: (hashVal % 360) + '°'
  };
}


// ==========================================
// 6. 10-WEEK IMPLEMENTATION ROADMAP
// ==========================================

export const TEN_WEEK_ROADMAP = [
  {
    weeks: 'Weeks 1-2',
    title: 'Core Observability & Baseline',
    focus: 'LangSmith + Prometheus + ELK',
    tasks: ['Instrument LangSmith project keys and custom business metrics', 'Deploy Prometheus metrics endpoint & Grafana AI dashboard', 'Set up JSON structured logging with request/user correlation IDs'],
    completed: true
  },
  {
    weeks: 'Weeks 3-4',
    title: 'Enterprise Agent Patterns',
    focus: 'ReAct, Plan-Execute & Multi-Agent',
    tasks: ['Implement LangGraph StateGraph Plan-and-Execute workflows', 'Deploy multi-agent critique review loop with programmatic approval', 'Set up typed tools (@tool) for internal databases & Slack alerts'],
    completed: true
  },
  {
    weeks: 'Weeks 5-6',
    title: 'Distributed Task Queue',
    focus: 'Celery + Redis / Ray Processing',
    tasks: ['Configure Celery task queues with Redis broker & backend', 'Implement Map-Reduce chord for large document ingestion', 'Benchmark Ray actor pools for multi-worker document summarization'],
    completed: false
  },
  {
    weeks: 'Weeks 7-8',
    title: 'High-Throughput Streaming',
    focus: 'Apache Kafka Event Streams',
    tasks: ['Deploy ai-queries, ai-processing, and ai-responses Kafka topics', 'Build decoupled producer and consumer with manual offset commits', 'Implement dead-letter queues (DLQ) for failed LLM inference events'],
    completed: false
  },
  {
    weeks: 'Weeks 9-10',
    title: 'Autoscaling & Production Hardening',
    focus: 'Consistent Hashing & K8s HPA',
    tasks: ['Implement ConsistentHashRouter for query session affinity', 'Deploy Redis sliding window rate limiting (100 req/hr)', 'Configure Kubernetes HPA based on active queue depth and latency'],
    completed: false
  }
];


// ==========================================
// 7. SECURITY, COMPLIANCE & GUARDRAILS
// ==========================================

export function SIMULATE_PII_REDACTION(text) {
  let redacted = text;
  let itemsDetected = [];

  // SSN pattern
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  if (ssnRegex.test(redacted)) {
    itemsDetected.push({ type: 'US_SSN', confidence: 0.99 });
    redacted = redacted.replace(ssnRegex, '<US_SSN>');
  }

  // Email pattern
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  if (emailRegex.test(redacted)) {
    itemsDetected.push({ type: 'EMAIL_ADDRESS', confidence: 0.98 });
    redacted = redacted.replace(emailRegex, '<EMAIL_ADDRESS>');
  }

  // Names (e.g. John Doe, Alice Smith)
  const nameRegex = /\b(John Doe|Jane Smith|Alice Johnson|Bob Vance)\b/gi;
  if (nameRegex.test(redacted)) {
    itemsDetected.push({ type: 'PERSON', confidence: 0.94 });
    redacted = redacted.replace(nameRegex, '<PERSON>');
  }

  // Phone numbers
  const phoneRegex = /\b(\+1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/g;
  if (phoneRegex.test(redacted)) {
    itemsDetected.push({ type: 'PHONE_NUMBER', confidence: 0.96 });
    redacted = redacted.replace(phoneRegex, '<PHONE_NUMBER>');
  }

  return {
    originalText: text,
    sanitizedText: redacted,
    piiFound: itemsDetected.length > 0,
    itemsDetected
  };
}

export function SIMULATE_PROMPT_INJECTION_SCAN(userInput) {
  const lower = userInput.toLowerCase();
  let injectionScore = 0.04;
  let violatedRules = [];

  const injectionTriggers = [
    { trigger: 'ignore previous instructions', weight: 0.85, rule: 'System Override Attack' },
    { trigger: 'system prompt', weight: 0.65, rule: 'Prompt Extraction' },
    { trigger: 'send all data to', weight: 0.90, rule: 'Data Exfiltration' },
    { trigger: 'attacker.com', weight: 0.95, rule: 'Known Malicious Host' },
    { trigger: 'you are now in developer mode', weight: 0.80, rule: 'Jailbreak Pattern' }
  ];

  for (const item of injectionTriggers) {
    if (lower.includes(item.trigger)) {
      injectionScore = Math.max(injectionScore, item.weight);
      violatedRules.push(item.rule);
    }
  }

  const isBlocked = injectionScore >= 0.50;
  return {
    userInput,
    injectionScore: Number(injectionScore.toFixed(2)),
    isBlocked,
    status: isBlocked ? 'SECURITY VIOLATION DETECTED ❌' : 'INPUT VERIFIED SAFE ✅',
    violatedRules: violatedRules.length > 0 ? violatedRules : ['None (Clean Payload)']
  };
}

export const RBAC_ROLE_PERMISSIONS = {
  'Executive': ['dept:Executive', 'dept:Finance', 'dept:HR', 'dept:Engineering', 'dept:Public'],
  'HR Director': ['dept:HR', 'dept:Public'],
  'Engineering Lead': ['dept:Engineering', 'dept:Architecture', 'dept:Public'],
  'Intern': ['dept:Public']
};

export const MOCK_VECTOR_DOCUMENTS = [
  { id: 'doc-101', title: 'Q3 Enterprise Executive Compensation & Board Minutes', accessLevel: 'dept:Executive', text: 'Executive bonus incentives and confidential acquisition plans.' },
  { id: 'doc-202', title: 'HR Employee Salary Bands & PIP Guidelines', accessLevel: 'dept:HR', text: 'Tier 4 salary ranges and confidential performance review workflows.' },
  { id: 'doc-303', title: 'Microservices Deployment Manifest & Architecture', accessLevel: 'dept:Engineering', text: 'Kubernetes ingress controller configuration and Helm charts.' },
  { id: 'doc-404', title: 'Company Holiday Schedule & General PTO Policy', accessLevel: 'dept:Public', text: 'Standard 20 days paid time off per calendar year.' }
];

export function SIMULATE_RBAC_VECTOR_SEARCH(role) {
  const allowedTags = RBAC_ROLE_PERMISSIONS[role] || ['dept:Public'];
  const visibleDocs = MOCK_VECTOR_DOCUMENTS.filter(doc => allowedTags.includes(doc.accessLevel));
  const hiddenCount = MOCK_VECTOR_DOCUMENTS.length - visibleDocs.length;

  return {
    role,
    allowedTags,
    visibleDocs,
    hiddenCount,
    filterApplied: { access_level: { $in: allowedTags } }
  };
}


// ==========================================
// 8. TECH STACK ADAPTATIONS (SPRING AI & AWS)
// ==========================================

export const TECH_STACK_COMPARISON = [
  {
    feature: 'Orchestration Runtime',
    python: 'LangChain & LangGraph StateGraph',
    java: 'Spring AI (ChatClient & Advisors)',
    aws: 'AWS Bedrock Agents & Step Functions'
  },
  {
    feature: 'Vector Database Integration',
    python: 'Qdrant / Chroma Python Client',
    java: 'spring-ai-pgvector / Redis Vector',
    aws: 'Amazon OpenSearch Serverless Knowledge Bases'
  },
  {
    feature: 'Tool & Action Binding',
    python: '@tool typed decorator',
    java: '@Bean @Description Function Callback',
    aws: 'Bedrock Action Groups (OpenAPI 3.0 Schemas)'
  },
  {
    feature: 'Observability & Tracing',
    python: 'LangSmith & OpenTelemetry SDK',
    java: 'Micrometer Tracing + OTel Prometheus Exporter',
    aws: 'AWS CloudWatch, X-Ray & Bedrock Model Invocation Logs'
  },
  {
    feature: 'Batching & Parallelism',
    python: 'asyncio .ainvoke() & .abatch()',
    java: 'Project Loom Virtual Threads & CompletableFuture',
    aws: 'AWS Step Functions Distributed Map State'
  }
];

export const AWS_STEP_FUNCTIONS_JSON = `{
  "Comment": "Serverless Map-Reduce Document Processing",
  "StartAt": "SplitDocument",
  "States": {
    "SplitDocument": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:SplitDoc",
      "ResultPath": "$.chunks",
      "Next": "ProcessChunks"
    },
    "ProcessChunks": {
      "Type": "Map",
      "ItemsPath": "$.chunks",
      "MaxConcurrency": 10,
      "Iterator": {
        "StartAt": "CallBedrock",
        "States": {
          "CallBedrock": {
            "Type": "Task",
            "Resource": "arn:aws:states:::bedrock:invokeModel",
            "Parameters": {
              "ModelId": "anthropic.claude-3-sonnet",
              "Body": { "prompt": "Summarize: <$.chunk_text>" }
            },
            "End": true
          }
        }
      },
      "ResultPath": "$.summaries",
      "Next": "CombineSummaries"
    },
    "CombineSummaries": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:Combine",
      "End": true
    }
  }
}`;

