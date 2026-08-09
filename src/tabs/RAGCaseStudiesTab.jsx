import { useState } from 'react';
import * as Primitives from '../components/layout/Primitives';
import { Hero, CodeBlock, Stepper } from '../components/ui/Content';
import { Card, Badge, Button, Callout } from '../components/ui/Core';
import DiagramImage from '../components/ui/DiagramImage.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

// ============================================
// FINANCIAL & SDLC CASE STUDY DATA & DIAGRAMS
// ============================================

const FINANCIAL_CASE_STUDY = {
  title: "Advisor Intelligence Copilot — Enterprise Financial RAG Platform",
  subtitle: "Production Case Study: Grounded Wealth Management Assistant with Real-Time Event Streaming & Regulatory Audit Lineage",
  problem: "4,000 wealth advisors spent 25+ minutes per client request searching across fragmented PDF term sheets, research notes, and policy docs—risking non-compliant advice.",
  metrics: {
    business: [
      { label: "Research Time per Client Request", before: "25 mins", after: "9 mins", change: "-64%" },
      { label: "Market Event Prep Time", before: "60 mins", after: "15 mins", change: "-75%" },
      { label: "Advisor Satisfaction Score", before: "3.2 / 5", after: "4.4 / 5", change: "+37.5%" }
    ],
    technical: [
      { label: "Simple Chat p95 Latency", target: "< 5.0s", actual: "3.8s" },
      { label: "Retrieval Recall@10", target: "> 90%", actual: "94.2%" },
      { label: "Citation Accuracy", target: "> 95%", actual: "96.5%" }
    ],
    risk: [
      { label: "Hallucination Rate in QA", target: "< 1.0%", actual: "0.4%" },
      { label: "Policy Non-Compliance", target: "< 0.5%", actual: "0.3%" },
      { label: "Audit Log Completeness", target: "100%", actual: "100%" }
    ]
  },
  useCases: [
    {
      id: "market_event",
      name: "1. Market Event Impact Analysis",
      event: "Central bank raises interest rates by 25 basis points",
      flow: ["Kafka stream receives rate decision", "Flink identifies duration-sensitive asset classes", "Hybrid retrieval fetches fixed income research notes", "Portfolio API identifies sensitive clients", "LLM generates grounded advisor talking points"]
    },
    {
      id: "suitability",
      name: "2. Client Suitability Check",
      event: "Advisor asks: 'Is Product X suitable for Client B in Singapore?'",
      flow: ["Calls CRM API for Client B risk profile & jurisdiction", "Retrieves Product X term sheet & EU/SG suitability policies", "Evaluates concentration limits & minimum investment threshold", "Generates suitability recommendation with policy clause citations"]
    },
    {
      id: "earnings",
      name: "3. Earnings Report Summarization",
      event: "Advisor asks: 'Summarize latest XYZ Bank earnings & impact on equity view'",
      flow: ["Retrieves earnings transcript, analyst notes, & historical rating", "Summarizes earnings surprise, key revenue drivers, and risk factors", "Aligns summary with bank's internal research stance"]
    },
    {
      id: "downgrade",
      name: "4. Downgraded Issuer Alert",
      event: "Rating agency downgrades XYZ Corporation from BBB to BB",
      flow: ["Flink receives rating stream & triggers entity resolution", "Queries Portfolio API to find all 37 affected clients in book", "Retrieves credit policy guidance on downgraded issuers", "Generates pre-approved client communication template for advisor"]
    }
  ]
};

const SDLC_CASE_STUDY_DATA = {
  title: "DevContext Copilot — A Real-Time RAG Platform for the Software Development Life Cycle (SDLC)",
  subtitle: "Production Case Study: Grounding Every Engineering Answer in Code, Docs, Tickets, Runbooks, & Incident Context",
  companyContext: {
    org: "Global IT Services & Product Engineering Enterprise",
    engineers: "~4,000 engineers across 40+ delivery teams",
    codebase: "600+ microservices and multiple monorepos (Java, Python, TypeScript, Go)",
    toolchain: ["GitHub Enterprise", "Jira", "Confluence", "ServiceNow", "PagerDuty", "Jenkins/GitHub Actions", "Datadog", "Slack"],
    compliance: ["SOC 2", "ISO 27001", "Client contractual confidentiality boundaries"]
  },
  painPoints: [
    { point: "Knowledge silos across code, Confluence, Jira, ServiceNow, Slack", impact: "Engineers spend 60–90 min/day searching" },
    { point: "Slow developer onboarding", impact: "6+ weeks to first production contribution" },
    { point: "High Mean Time to Resolution (MTTR)", impact: "Postmortems & runbooks never found during incidents (48 min MTTR)" },
    { point: "Duplicated code & reinvented patterns", impact: "Low reuse, inconsistent quality across teams" },
    { point: "Tribal knowledge loss with attrition", impact: "Undocumented decisions resurfacing as production bugs" },
    { point: "Compliance & security policy drift", impact: "Coding standards & secure-coding rules not consistently applied" },
    { point: "Generic AI assistants unsafe", impact: "Hallucinated APIs, leaked credentials, client confidentiality breaches" }
  ],
  sdlcPhases: [
    { phase: "1. Requirements", persona: "Product Owner / Analyst", query: '"Did we build KYC document verification for a banking client before? Show stories, estimates, and defects."', flow: "Ticket search (KYC, doc-verification) → retrieve 3 past epics, estimates, defect clusters → retrieve compliance reqs → output: prior-art summary, realistic estimate range, citations." },
    { phase: "2. Design", persona: "Architect / Tech Lead", query: '"Which ADRs govern event sourcing for ledger services, and what is the dependency impact of schema changes?"', flow: "ADR retrieval → schema specs → graph traversal (consumers of ledger events) → output: governing decisions, 7 consumer services, compatibility risks, citations." },
    { phase: "3. Development", persona: "Developer (IDE + ChatOps)", query: '"Where is refund idempotency validated, and show the pattern to reuse?"', flow: "Symbol lookup idempotency → semantic code search → rerank → return RefundService.java#L120-L148 + pattern explanation → sandbox compile validation." },
    { phase: "4. Testing", persona: "QA Engineer", query: '"Generate edge-case tests for FX conversion service based on past defects."', flow: "Defect search (FX, rounding, timezone) → retrieve 12 historical defects → retrieve current impl → generate tests → run in sandbox; show only passing tests + citations." },
    { phase: "5. Deployment", persona: "DevOps / Release Mgr", query: '"What changed in the last 3 deploys of payment-gateway, and what is the rollback runbook?"', flow: "Deploy events tool → commit/PR summaries → runbook retrieval → change-policy check → output: change list, risk flags, rollback steps with citations." },
    { phase: "6. Operations", persona: "SRE / On-call", query: '"p99 latency spiked after deploy — find similar past incidents and the fix."', flow: "PagerDuty alert → automatic incident context pack within seconds: recent deploys, similar postmortems, runbook payment-latency.md, dependency health → draft cited summary to Slack." }
  ],
  successMetrics: [
    { metric: "Onboarding time to first PR", before: "6 wks", after: "3.2 wks", delta: "-46%" },
    { metric: "MTTR (P1/P2 incidents)", before: "48 min", after: "26 min", delta: "-46%" },
    { metric: "PR cycle time", before: "30 hrs", after: "20 hrs", delta: "-33%" },
    { metric: "Daily search time per engineer", before: "75 min", after: "30 min", delta: "-60%" },
    { metric: "Suggestion acceptance (merged)", before: "—", after: "38%", delta: "High Adoption" },
    { metric: "Secret leakage incidents", before: "—", after: "0", delta: "100% Secure" },
    { metric: "Developer satisfaction", before: "—", after: "4.3 / 5", delta: "Positive NPS" }
  ],
  queryPipeline12Steps: [
    { step: 1, name: "Authenticate & Tenant Load", detail: "Load developer identity, team permissions, and confidentiality tenant boundary." },
    { step: 2, name: "Classify Intent", detail: "Classify intent: explain / find-code / debug / design / incident / test-gen." },
    { step: 3, name: "Extract Symbols & Entities", detail: "Extract exact method names, service identifiers, error signatures, and file paths." },
    { step: 4, name: "Symbol-Index Exact Lookup", detail: "Query ctags/LSP exact symbol index for 100% precision on identifiers." },
    { step: 5, name: "Semantic Code Search", detail: "Run dense vector search over code embeddings for natural language intent." },
    { step: 6, name: "Doc & ADR Search", detail: "Search Confluence ADRs, architecture standards, and operational runbooks." },
    { step: 7, name: "Ticket & Postmortem Search", detail: "Match stack-trace signatures against historical Jira tickets & postmortems." },
    { step: 8, name: "Service Graph Traversal", detail: "Traverse dependency topology for multi-service impact questions." },
    { step: 9, name: "Live Tool Execution", detail: "Call live tools for real-time telemetry (CI logs, APM metrics, deploy events)." },
    { step: 10, name: "RRF Merge & ACL Filters", detail: "Reciprocal Rank Fusion merge → apply ACL, confidentiality, license, & commit_sha staleness filters." },
    { step: 11, name: "Cross-Encoder Code Reranker", detail: "Rescore top candidate chunks and attach compressed repo map for context." },
    { step: 12, name: "Grounded Code Generation", detail: "LLM generates answer with strict repo/file#Lx-Ly citations and sandbox pass@1 validation." }
  ],
  guardrailLayers: [
    { layer: "Input Layer", controls: "Confidentiality tenant enforcement, prompt injection detection, tenant token verification" },
    { layer: "Retrieval Layer", controls: "ACL permissions, branch/staleness commit_sha filters, restricted-repo blocklist" },
    { layer: "Context Layer", controls: "Gitleaks-style secret scanning & credential redaction before sending to LLM" },
    { layer: "Generation Layer", controls: "Compile & sandbox-test validation (pass@1), hallucinated-API symbol existence check" },
    { layer: "Output Layer", controls: "License copyleft check, confidence threshold gate, human-approval flag for infra changes, audit logging" }
  ],
  lessonsLearned: [
    "Code RAG is retrieval engineering plus compiler discipline — validation (compile/test) is a guardrail, not a nicety.",
    "Symbols beat sentences — exact identifier search (ctags/BM25) is non-negotiable.",
    "Staleness is the #1 trust killer — engineers forgive bad prose, never stale code.",
    "The repo map is the cheapest big win for LLM orientation.",
    "Incident RAG pays for the platform — MTTR reduction justified the entire investment.",
    "Confidentiality is architecture, not policy — tenants must exist in indexes, models, and logs."
  ],
  sdlcStarStory: {
    situation: "4,000-engineer enterprise with knowledge siloed across Git, Confluence, and Jira; MTTR was 48 mins and developer onboarding took 6 weeks.",
    task: "Build a real-time, phase-aware SDLC RAG copilot with verified citations, multi-tenant confidentiality isolation, and zero secret leakage.",
    action: "Architected AST-based code indexing with commit_sha staleness control; hybrid symbol+semantic retrieval; service dependency graph; incident context packs via Kafka/Flink; sandbox compile/test validation; secret & license guardrails.",
    result: "MTTR reduced by -46% (48m → 26m), onboarding time halved (6wks → 3.2wks), 38% suggestion acceptance rate, zero secret incidents, 4.3/5 satisfaction."
  }
};

const SDLC_DIAGRAMS = [
  {
    id: "ast_chunking",
    title: "S1: Tree-Sitter AST Code-Chunking Architecture",
    description: "Language-aware AST parsing extracts function and class chunks while preserving scope breadcrumbs and signature metadata.",
    image: "/assets/sdlc_ast_code_chunking_flow.png",
    nodes: [
      { step: "Source File", detail: "RefundService.java (Raw Source Code)" },
      { step: "Tree-Sitter AST", detail: "Parses file into Class, Method, & Import AST nodes" },
      { step: "Symbol Extraction", detail: "Extracts processRefund(), validateIdempotencyKey(), postToLedger()" },
      { step: "Chunk Packaging", detail: "Attaches metadata: repo > file > symbol + signature + commit_sha" },
      { step: "Vector & Symbol Index", detail: "Indexed in parallel to Dense Vector DB + ctags Symbol Index" }
    ]
  },
  {
    id: "incident_pack",
    title: "S2: Real-Time Incident Context-Pack Generator Flow",
    description: "Event-driven pipeline automatically assembles runbooks, postmortems, recent deploys, and APM metrics when PagerDuty fires.",
    image: "/assets/sdlc_incident_context_pack_flow.png",
    nodes: [
      { step: "PagerDuty Trigger", detail: "Alert: payment-gateway p99 latency > 2s" },
      { step: "Kafka / Flink Stream", detail: "Processes alert, resolves service entity & severity score" },
      { step: "Parallel Retrieval", detail: "Fetches: Runbooks + Past Postmortems + Recent Commits + APM Health" },
      { step: "Context Pack Assembly", detail: "Compresses retrieved evidence & formats cited mitigation draft" },
      { step: "ChatOps Delivery", detail: "Automated bot posts cited incident pack to Slack channel in < 5 seconds" }
    ]
  },
  {
    id: "staleness",
    title: "S3: Commit-SHA Staleness Control Webhook Flow",
    description: "Webhook-driven incremental re-indexing combined with query-time commit_sha HEAD validation.",
    image: "/assets/sdlc_staleness_control_flow.png",
    nodes: [
      { step: "Git Push Webhook", detail: "Developer pushes commit '9f2c1ab' to main branch" },
      { step: "Incremental Re-Index", detail: "Triggers micro-job: re-indexes only touched files; flags old chunks as superseded" },
      { step: "Query-Time HEAD Check", detail: "Retrieval engine checks chunk.commit_sha against branch HEAD" },
      { step: "Drift Down-Ranking", detail: "Stale chunks are either refreshed on the fly or down-ranked" }
    ]
  },
  {
    id: "eval_suite",
    title: "S4: Multi-Metric Code RAG Evaluation Suite",
    description: "Continuous CI/CD regression suite evaluating retrieval, sandbox code compilation, and zero secret leakage.",
    image: "/assets/sdlc_eval_dashboard_mock.png",
    nodes: [
      { step: "Recall@10 (0.92)", detail: "Target > 90% on 800+ golden query-symbol ground truth pairs" },
      { step: "pass@1 Compile (0.78)", detail: "78% pass rate for generated unit tests in isolated Docker sandbox" },
      { step: "Merge Acceptance (38%)", detail: "38% of suggested PR review comments accepted & merged by developers" },
      { step: "Zero Secret Leaks (0)", detail: "100% pass on pre-LLM & post-LLM Gitleaks entropy scans" }
    ]
  },
  {
    id: "tenant_isolation",
    title: "S5: Multi-Tenant Confidentiality Isolation Topology",
    description: "Gateway tenant tokens enforce physical/logical index & model sharding with cross-tenant blocking.",
    image: "/assets/sdlc_tenant_isolation_flow.png",
    nodes: [
      { step: "Auth Gateway", detail: "Validates request token & extracts tenant_id (Tenant A / B / C)" },
      { step: "Pre-Retrieval Filter", detail: "Applies strict WHERE tenant_id = user.tenant_id filter at Vector DB" },
      { step: "Isolated Shards", detail: "Tenant A repos/indexes/models physically isolated from Tenant B" },
      { step: "Cross-Tenant Block", detail: "Hard firewall (T1 x--x T2) prevents cross-client code data leaks" }
    ]
  }
];

const SDLC_90_DAY_ROADMAP = [
  {
    phase: "Phase 1: Days 0–30",
    title: "Docs & Runbooks RAG + ChatOps",
    badge: "Foundation",
    items: [
      "Ingest Confluence docs, ADRs, coding standards, and operational runbooks",
      "Deploy Slack ChatOps bot for natural language policy Q&A",
      "Establish 100-item golden evaluation dataset for policy retrieval",
      "Set up basic RBAC and user permission filtering"
    ]
  },
  {
    phase: "Phase 2: Days 31–60",
    title: "Code Indexing (AST) + IDE Plugin",
    badge: "Code RAG",
    items: [
      "Implement Tree-Sitter AST chunking for Java, Python, TS, and Go",
      "Build ctags/LSP symbol index for exact method & class lookup",
      "Release VS Code & JetBrains IDE plugins with sub-second latency",
      "Deploy Docker sandbox container for pass@1 code compilation checks"
    ]
  },
  {
    phase: "Phase 3: Days 61–90",
    title: "Real-Time Packs, GraphRAG & PR Assist",
    badge: "Advanced Operations",
    items: [
      "Connect Kafka/Flink stream for real-time CI failure & PagerDuty packs",
      "Construct Neo4j service dependency graph for multi-hop impact analysis",
      "Deploy automated read-only PR review assistant with standards citations",
      "Establish DORA productivity analytics baselines (MTTR, PR cycle time)"
    ]
  }
];

const SDLC_CHALLENGES_MATRIX = [
  { challenge: "Stale code after refactors", mitigation: "Git webhook incremental re-index + commit_sha HEAD validation at query time." },
  { challenge: "Monorepo scale (10M+ LOC)", mitigation: "Per-service index shards, compressed repo maps, and hierarchical retrieval." },
  { challenge: "Hallucinated APIs & methods", mitigation: "AST symbol-index existence check + sandbox compile/test validation before display." },
  { challenge: "Secrets in retrieved snippets", mitigation: "Pre-LLM & post-LLM Gitleaks entropy scanning + automated credential redaction." },
  { challenge: "License copyleft contamination", mitigation: "Per-repo license metadata + copyleft detector filter on generated suggestions." },
  { challenge: "Multi-client confidentiality", mitigation: "Tenant-isolated index shards & model hosting + hard DB-level ACL filters." },
  { challenge: "Identifier exact match misses", mitigation: "Exact ctags/LSP symbol index + BM25 lexical search fused via RRF." },
  { challenge: "Context window overflow", mitigation: "Compressed Repo Maps (tree + top symbols) + function-level AST chunks." },
  { challenge: "Evaluation blind spots", mitigation: "Multi-metric Golden Set testing (Recall@10, pass@1, MRR, zero secret leaks)." },
  { challenge: "Developer adoption & trust", mitigation: "Verifiable repo/file#line citations + owner links + inline feedback buttons." },
  { challenge: "IDE latency (under 1s requirement)", mitigation: "Redis semantic cache + lightweight embedding models + pre-filtered ANN search." },
  { challenge: "Knowledge hygiene ceiling", mitigation: "Automated documentation quality scoring & stale doc flagging." },
  { challenge: "Developer skill atrophy risk", mitigation: "Interactive 'Explain Mode' providing step-by-step logic breakdowns instead of auto-patching." }
];

const SDLC_WHERE_USEFUL_MATRIX = {
  useful: [
    { title: "Developer Onboarding", desc: "Halves time for new engineers to merge their first production PR (6 wks → 3.2 wks)." },
    { title: "Real-Time Incident Response", desc: "Assembles context packs (runbooks, postmortems, commits) in under 5s during P1 alerts." },
    { title: "Legacy Code Modernization", desc: "Reduces architecture analysis time by -50% and migration defects by -25%." },
    { title: "Test Debt & Flaky Tests", desc: "Generates defect-history-driven test cases validated in a pass@1 sandbox." },
    { title: "Audit & Compliance Evidence", desc: "Reduces compliance audit prep from days to minutes with exact file:line citations." },
    { title: "M&A Technical Due Diligence", desc: "Quickly maps service topology, dependencies, security risks, and technical debt." }
  ],
  notUseful: [
    { title: "Tiny Greenfield Teams (<10 Devs)", desc: "Codebase fits in developers' heads; setup & maintenance overhead exceeds ROI." },
    { title: "Zero Knowledge Hygiene", desc: "No written ADRs, runbooks, or tickets; RAG cannot retrieve missing documentation." },
    { title: "Purely Algorithmic Tasks", desc: "Tasks requiring heavy mathematical computation or pure creative UI styling without codebase facts." }
  ]
};

const BANKING_MODERNIZATION_CASE = {
  title: "Banking Legacy Modernization Mini-Case Study",
  subtitle: "Applying SDLC RAG to Modernize 15-Year-Old Monolithic Core Banking Microservices",
  metrics: [
    { label: "Architecture Analysis Time", delta: "-50%", detail: "Engineers mapped legacy dependency graphs in days instead of weeks." },
    { label: "Compliance Audit Prep", delta: "Days → Minutes", detail: "Instant retrieval of governing ADRs and security audit trails." },
    { label: "Migration Defect Rate", delta: "-25%", detail: "Sandbox compile validation prevented hallucinated API bugs." }
  ]
};

const SYSTEM_DESIGN_STEPS = [
  { step: "Step 1: Clarify Requirements", detail: "Clarify users, data types, freshness (real-time vs batch), RBAC needs, latency target (<5s), compliance auditing." },
  { step: "Step 2: Define Use Cases", detail: "Policy Q&A, Research summarization, Client portfolio impact, Product suitability, Market event alerts." },
  { step: "Step 3: Define Non-Functional Requirements", detail: "p95 latency < 5s, 99.9% uptime, strict RBAC/ABAC, full request lineage auditability, zero unauthorized PII." },
  { step: "Step 4: Describe Data Sources", detail: "Unstructured (Policies, Research, Transcripts) + Structured APIs (Portfolio, CRM, Market Data) + Streaming (Kafka market events)." },
  { step: "Step 5: Design Ingestion Pipeline", detail: "Parsing -> Clause/Section Chunking -> Metadata Tagging (ACL, Dates) -> Embedding -> OpenSearch Vector & BM25 indexing." },
  { step: "Step 6: Design Query Pipeline", detail: "Auth Gateway -> Intent/Entity Extraction -> Tool Calling (Portfolio API) -> Hybrid Search (Dense + BM25) -> Reranking -> Grounded Generation -> Guardrails." },
  { step: "Step 7: Explain Evaluation Framework", detail: "Golden Dataset testing, Recall@10, Faithfulness scoring, Citation accuracy, LLM-as-judge + Human compliance sample audits." },
  { step: "Step 8: Discuss Production Concerns", detail: "Semantic caching, fallback routing, PII redaction, token budgeting, prompt versioning, canary deployment." },
  { step: "Step 9: Discuss Key Tradeoffs", detail: "Dense vs Hybrid search, Chunk size vs Context noise, Flagship LLM vs Latency/Cost, Real-time streaming vs Infrastructure complexity." }
];

const CODE_PSEUDOCODES = {
  retrieval: `# 1. HYBRID RETRIEVAL & RERANKING PSEUDOCODE
def retrieve(query, user):
    permissions = get_user_permissions(user)
    intent = classify_intent(query)
    entities = extract_entities(query)
    
    filters = {
        "access_control": permissions,
        "effective_date_lte": current_date(),
        "superseded": False,
        "jurisdiction": entities.get("jurisdiction"),
        "document_type": intent.allowed_document_types
    }
    
    # Execute parallel dense and sparse searches
    dense_results = vector_search(query=query, filters=filters, top_k=100)
    sparse_results = bm25_search(query=query, filters=filters, top_k=100)
    
    # Fuse candidate lists via Reciprocal Rank Fusion
    merged_results = reciprocal_rank_fusion(dense_results, sparse_results)
    
    # Rescore top candidates with Cross-Encoder Reranker
    reranked_results = cross_encoder_rerank(query=query, documents=merged_results, top_n=10)
    
    return compress_context(reranked_results)`,

  orchestration: `# 2. AGENTIC RAG ORCHESTRATION PSEUDOCODE
def answer_query(query, user):
    if not authorize(user, query):
        return access_denied_response()
        
    intent = classify_intent(query)
    
    # Execute deterministic API tool calls for live data
    client_data = call_client_portfolio_api(user, query) if intent.requires_client_data else None
    market_data = call_market_data_api(query) if intent.requires_market_data else None
    
    # Retrieve grounded document chunks
    retrieved_docs = retrieve(query, user)
    
    # Assemble structured context
    context = assemble_context(
        retrieved_docs=retrieved_docs,
        client_data=client_data,
        market_data=market_data
    )
    
    prompt = build_system_prompt(query=query, context=context, user=user)
    response = llm.generate(prompt)
    
    # Enforce post-generation guardrail verification
    guardrail_result = run_guardrails(query=query, response=response, context=context)
    if not guardrail_result.passed:
        return safe_fallback_response(guardrail_result)
        
    log_audit_trail(user=user, query=query, retrieved_docs=retrieved_docs, response=response)
    return response`,

  evaluation: `# 3. CONTINUOUS EVALUATION RUNNER PSEUDOCODE
def evaluate_rag_pipeline(golden_dataset):
    results = []
    for item in golden_dataset:
        response = rag_system.answer(item.question)
        
        retrieval_score = evaluate_recall(
            retrieved_sources=response.sources,
            expected_sources=item.expected_sources
        )
        faithfulness_score = evaluate_faithfulness(
            answer=response.answer,
            context=response.context
        )
        citation_score = evaluate_citation_accuracy(
            citations=response.citations,
            context=response.context
        )
        
        results.append({
            "question": item.question,
            "retrieval_recall": retrieval_score,
            "faithfulness": faithfulness_score,
            "citation_accuracy": citation_score
        })
        
    return aggregate_eval_metrics(results)`
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function RAGCaseStudiesTab() {
  const [activeMode, setActiveMode] = useState('casestudy'); // 'casestudy', 'systemdesign', 'star'
  const [activeCaseStudyTab, setActiveCaseStudyTab] = useState('sdlc'); // 'sdlc' or 'financial'
  const [activeSdlcPhase, setActiveSdlcPhase] = useState(0);
  const [activeDiagram, setActiveDiagram] = useState('ast_chunking');
  const [activeUseCase, setActiveUseCase] = useState('market_event');
  const [simStep, setSimStep] = useState(0);
  const [activePseudocode, setActivePseudocode] = useState('retrieval');
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCodeToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="rag"
        moduleLabel="Enterprise Systems & Case Studies"
        title="Enterprise RAG Case Studies & Blueprints"
        description="Comprehensive real-world architectures featuring DevContext Copilot (SDLC RAG Platform), Financial Advisor Copilot, 9-Step System Design Blueprint, STAR Stories, and Production Pseudocodes."
        metrics={[
          { label: 'Production Cases', value: '2 Enterprise' },
          { label: 'System Design', value: '9-Step Framework' },
          { label: 'SDLC Visuals', value: '5 Flow Diagrams' },
          { label: 'Implementation', value: '90-Day Roadmap' },
        ]}
      />

      <Container size="wide">
        {/* TOP NAVIGATION MODES */}
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
          {[
            { id: 'casestudy', label: '🏢 Enterprise Case Studies', desc: 'DevContext SDLC & Advisor Copilot' },
            { id: 'systemdesign', label: '🏗️ System Design Framework', desc: '9-Step Architecture Blueprint' },
            { id: 'star', label: '🚀 STAR & Pseudocodes', desc: 'Production Code & STAR Stories' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeMode === mode.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeMode === mode.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeMode === mode.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>{mode.label}</div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeMode === mode.id ? 0.9 : 0.7 }}>
                {mode.desc}
              </div>
            </button>
          ))}
        </div>

        {/* MODE 1: ENTERPRISE CASE STUDIES (SDLC RAG & FINANCIAL ADVISOR) */}
        {activeMode === 'casestudy' && (
          <Stack gap={6}>
            {/* SUB TAB SELECTOR FOR CASE STUDIES */}
            <Flex gap={3} style={{ marginBottom: 'var(--ds-space-2)' }}>
              <button
                onClick={() => setActiveCaseStudyTab('sdlc')}
                style={{
                  padding: 'var(--ds-space-3) var(--ds-space-5)',
                  borderRadius: 'var(--ds-radius-md)',
                  border: '1px solid',
                  borderColor: activeCaseStudyTab === 'sdlc' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                  background: activeCaseStudyTab === 'sdlc' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-bg-surface)',
                  color: activeCaseStudyTab === 'sdlc' ? 'white' : 'var(--ds-color-text-primary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 'var(--ds-font-size-body)'
                }}
              >
                💻 DevContext Copilot (SDLC RAG Platform)
              </button>
              <button
                onClick={() => setActiveCaseStudyTab('financial')}
                style={{
                  padding: 'var(--ds-space-3) var(--ds-space-5)',
                  borderRadius: 'var(--ds-radius-md)',
                  border: '1px solid',
                  borderColor: activeCaseStudyTab === 'financial' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                  background: activeCaseStudyTab === 'financial' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-bg-surface)',
                  color: activeCaseStudyTab === 'financial' ? 'white' : 'var(--ds-color-text-primary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 'var(--ds-font-size-body)'
                }}
              >
                🏢 Financial Advisor Intelligence Copilot
              </button>
            </Flex>

            {/* VIEW 1: SDLC RAG CASE STUDY (DevContext Copilot) */}
            {activeCaseStudyTab === 'sdlc' && (
              <Stack gap={6}>
                <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(202,138,4,0.12) 0%, rgba(13,148,136,0.12) 100%)' }}>
                  <Stack gap={3}>
                    <Flex gap={2} align="center">
                      <Badge variant="warning">Detailed SDLC RAG Case Study</Badge>
                      <Badge variant="subtle">Enterprise Monorepo Scale</Badge>
                    </Flex>
                    <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>{SDLC_CASE_STUDY_DATA.title}</h2>
                    <h4 style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{SDLC_CASE_STUDY_DATA.subtitle}</h4>
                    <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)' }}>
                      <strong>Enterprise Context:</strong> {SDLC_CASE_STUDY_DATA.companyContext.org} with {SDLC_CASE_STUDY_DATA.companyContext.engineers}, managing {SDLC_CASE_STUDY_DATA.companyContext.codebase}.
                    </p>
                  </Stack>
                </Card>

                {/* PAIN POINTS & IMPACT */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Enterprise Pain Points vs DevContext Copilot Impact</h3>
                  </Section.Header>
                  <Grid columns={2} gap={3}>
                    {SDLC_CASE_STUDY_DATA.painPoints.map((p, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-4)' }}>
                        <Stack gap={1}>
                          <span style={{ fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>❌ {p.point}</span>
                          <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-state-success-light)', fontWeight: 'semibold' }}>
                            🎯 Impact: {p.impact}
                          </span>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* 6 SDLC PHASE WORKFLOWS */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>6 SDLC Phase Coverage & Example Workflows</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Click an SDLC phase to inspect the query flow from requirements to incident response.</p>
                  </Section.Header>

                  <Grid columns={3} gap={3} style={{ marginBottom: 'var(--ds-space-4)' }}>
                    {SDLC_CASE_STUDY_DATA.sdlcPhases.map((sp, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSdlcPhase(idx)}
                        style={{
                          padding: 'var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: '1px solid',
                          borderColor: activeSdlcPhase === idx ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                          background: activeSdlcPhase === idx ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: activeSdlcPhase === idx ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: activeSdlcPhase === idx ? 'bold' : 'normal'
                        }}
                      >
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>{sp.persona}</div>
                        <div style={{ fontSize: 'var(--ds-font-size-body)', marginTop: '2px' }}>{sp.phase}</div>
                      </button>
                    ))}
                  </Grid>

                  {/* ACTIVE SDLC PHASE DETAILS */}
                  {(() => {
                    const activeP = SDLC_CASE_STUDY_DATA.sdlcPhases[activeSdlcPhase];
                    return (
                      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                        <Stack gap={3}>
                          <Flex justify="space-between" align="center">
                            <Badge variant="warning">{activeP.phase} — {activeP.persona}</Badge>
                          </Flex>
                          <div>
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>EXAMPLE DEVELOPER QUERY:</span>
                            <h3 style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-primary)' }}>{activeP.query}</h3>
                          </div>
                          <div>
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>12-STEP QUERY PIPELINE FLOW:</span>
                            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', lineHeight: '1.6' }}>{activeP.flow}</p>
                          </div>
                        </Stack>
                      </Card>
                    );
                  })()}
                </Section>

                {/* 12-STEP QUERY PIPELINE */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>The 12-Step Query Pipeline (Code & Telemetry RAG)</h3>
                  </Section.Header>
                  <Grid columns={3} gap={3}>
                    {SDLC_CASE_STUDY_DATA.queryPipeline12Steps.map((s) => (
                      <Card key={s.step} style={{ padding: 'var(--ds-space-4)' }}>
                        <Stack gap={1}>
                          <Flex align="center" gap={2}>
                            <Badge variant="primary">Step {s.step}</Badge>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{s.name}</strong>
                          </Flex>
                          <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                            {s.detail}
                          </p>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* PILOT RESULTS DASHBOARD */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Production Pilot Results & Metrics</h3>
                  </Section.Header>
                  <Grid columns={4} gap={3}>
                    {SDLC_CASE_STUDY_DATA.successMetrics.map((m, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-4)', textAlign: 'center' }}>
                        <Stack gap={1}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{m.metric}</span>
                          <div style={{ fontSize: 'var(--ds-font-size-h2)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)' }}>
                            {m.after}
                          </div>
                          {m.before !== "—" && (
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
                              Was: {m.before}
                            </span>
                          )}
                          <Badge variant="success">{m.delta}</Badge>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* 5-LAYER GUARDRAIL CONTROLS */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>5-Layer Defense-in-Depth Guardrail Controls</h3>
                  </Section.Header>
                  <Stack gap={2}>
                    {SDLC_CASE_STUDY_DATA.guardrailLayers.map((g, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-3)' }}>
                        <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                          <strong style={{ minWidth: '160px', color: 'var(--ds-color-module-foundations-primary)' }}>{g.layer}</strong>
                          <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', flex: 1 }}>{g.controls}</span>
                        </Flex>
                      </Card>
                    ))}
                  </Stack>
                </Section>

                {/* LESSONS LEARNED */}
                <Callout variant="tip" title="Lessons Learned from SDLC RAG Production Deployment">
                  <ol style={{ margin: 0, paddingLeft: 'var(--ds-space-5)' }}>
                    {SDLC_CASE_STUDY_DATA.lessonsLearned.map((l, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{l}</li>
                    ))}
                  </ol>
                </Callout>

                {/* VISUAL ARCHITECTURE FLOW DIAGRAMS */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>🎨 Visual Architecture & Flow Diagrams</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Click to inspect architecture flows for core SDLC RAG sub-systems.</p>
                  </Section.Header>
                  <Flex gap={2} style={{ marginBottom: 'var(--ds-space-4)', flexWrap: 'wrap' }}>
                    {SDLC_DIAGRAMS.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setActiveDiagram(d.id)}
                        style={{
                          padding: 'var(--ds-space-2) var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: '1px solid',
                          borderColor: activeDiagram === d.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                          background: activeDiagram === d.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: activeDiagram === d.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-secondary)',
                          cursor: 'pointer',
                          fontWeight: activeDiagram === d.id ? 'bold' : 'normal',
                          fontSize: 'var(--ds-font-size-bodySm)'
                        }}
                      >
                        {d.title.split(':')[0]}
                      </button>
                    ))}
                  </Flex>

                  {(() => {
                    const diag = SDLC_DIAGRAMS.find(d => d.id === activeDiagram) || SDLC_DIAGRAMS[0];
                    return (
                      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                        <Stack gap={4}>
                          <div>
                            <Badge variant="warning">{diag.title}</Badge>
                            <p style={{ marginTop: 'var(--ds-space-2)', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-body)' }}>{diag.description}</p>
                          </div>

                          {diag.image && (
                            <DiagramImage
                              src={diag.image}
                              alt={diag.title}
                              caption={diag.description}
                            />
                          )}

                          <div>
                            <h4 style={{ color: 'var(--ds-color-text-primary)', marginBottom: 'var(--ds-space-3)' }}>Interactive Execution Flow Sequence:</h4>
                            <Stepper
                              steps={diag.nodes.map((node) => ({
                                title: node.step,
                                description: node.detail,
                                status: 'complete'
                              }))}
                            />
                          </div>
                        </Stack>
                      </Card>
                    );
                  })()}
                </Section>

                {/* 90-DAY IMPLEMENTATION ROADMAP */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>🗺️ 90-Day Enterprise SDLC Implementation Roadmap</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>A phased 10-step rollout plan from documentation Q&A to full code indexing and real-time incident packs.</p>
                  </Section.Header>
                  <Grid columns={3} gap={4}>
                    {SDLC_90_DAY_ROADMAP.map((r, idx) => (
                      <Card key={idx} variant="bordered" style={{ padding: 'var(--ds-space-4)' }}>
                        <Stack gap={2}>
                          <Flex justify="space-between" align="center">
                            <Badge variant="primary">{r.phase}</Badge>
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>{r.badge}</span>
                          </Flex>
                          <h4 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>{r.title}</h4>
                          <ul style={{ margin: 0, paddingLeft: 'var(--ds-space-4)', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                            {r.items.map((item, i) => (
                              <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                            ))}
                          </ul>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* 14 ENTERPRISE SDLC CHALLENGES & MITIGATIONS MATRIX */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>⚡ 14 Enterprise SDLC RAG Challenges & Engineering Mitigations</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Production gotchas and architectural solutions mapped from real-world deployments.</p>
                  </Section.Header>
                  <Grid columns={2} gap={3}>
                    {SDLC_CHALLENGES_MATRIX.map((c, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-3)' }}>
                        <Stack gap={1}>
                          <span style={{ fontWeight: 'bold', color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                            ⚠️ {c.challenge}
                          </span>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-state-success-light)' }}>
                            ✅ <strong>Mitigation:</strong> {c.mitigation}
                          </span>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* WHERE USEFUL VS WHEN NOT TO USE MATRIX */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>🎯 Where SDLC RAG Delivers ROI vs When NOT to Use</h3>
                  </Section.Header>
                  <Grid columns={2} gap={4}>
                    <Card style={{ padding: 'var(--ds-space-4)', background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.2)' }}>
                      <h4 style={{ color: '#16A34A', marginBottom: 'var(--ds-space-3)' }}>✅ High-Value Adoption Use Cases</h4>
                      <Stack gap={2}>
                        {SDLC_WHERE_USEFUL_MATRIX.useful.map((u, i) => (
                          <div key={i}>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{u.title}</strong>
                            <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>{u.desc}</p>
                          </div>
                        ))}
                      </Stack>
                    </Card>

                    <Card style={{ padding: 'var(--ds-space-4)', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.2)' }}>
                      <h4 style={{ color: '#DC2626', marginBottom: 'var(--ds-space-3)' }}>❌ When NOT to Use RAG</h4>
                      <Stack gap={2}>
                        {SDLC_WHERE_USEFUL_MATRIX.notUseful.map((n, i) => (
                          <div key={i}>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{n.title}</strong>
                            <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>{n.desc}</p>
                          </div>
                        ))}
                      </Stack>
                    </Card>
                  </Grid>
                </Section>

                {/* BANKING LEGACY MODERNIZATION MINI-CASE STUDY */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(13,148,136,0.08) 100%)' }}>
                  <Stack gap={3}>
                    <Badge variant="info">Banking Legacy Modernization Mini-Case Study</Badge>
                    <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>{BANKING_MODERNIZATION_CASE.title}</h3>
                    <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>{BANKING_MODERNIZATION_CASE.subtitle}</p>
                    <Grid columns={3} gap={3} style={{ marginTop: 'var(--ds-space-2)' }}>
                      {BANKING_MODERNIZATION_CASE.metrics.map((m, i) => (
                        <div key={i} style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>{m.label}</span>
                          <div style={{ fontSize: 'var(--ds-font-size-h2)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)' }}>{m.delta}</div>
                          <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0 0 0' }}>{m.detail}</p>
                        </div>
                      ))}
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            )}

            {/* VIEW 2: FINANCIAL ADVISOR CASE STUDY */}
            {activeCaseStudyTab === 'financial' && (
              <Stack gap={6}>
                <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(37,99,235,0.08) 100%)' }}>
                  <Stack gap={3}>
                    <Badge variant="warning">Financial Advisory Case Study</Badge>
                    <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>{FINANCIAL_CASE_STUDY.title}</h2>
                    <h4 style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{FINANCIAL_CASE_STUDY.subtitle}</h4>
                    <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)' }}>
                      <strong>Business Problem:</strong> {FINANCIAL_CASE_STUDY.problem}
                    </p>
                  </Stack>
                </Card>

                {/* METRICS DASHBOARD */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Production High-Level Success Metrics</h3>
                  </Section.Header>
                  <Grid columns={3} gap={4}>
                    <Card style={{ padding: 'var(--ds-space-4)' }}>
                      <h4 style={{ color: 'var(--ds-color-module-foundations-primary)', marginBottom: 'var(--ds-space-3)' }}>💼 Business Impact</h4>
                      {FINANCIAL_CASE_STUDY.metrics.business.map((m, i) => (
                        <div key={i} style={{ marginBottom: 'var(--ds-space-3)' }}>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                          <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--ds-color-text-tertiary)' }}>{m.before}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--ds-color-state-success-light)' }}>→ {m.after}</span>
                            <Badge variant="success">{m.change}</Badge>
                          </div>
                        </div>
                      ))}
                    </Card>

                    <Card style={{ padding: 'var(--ds-space-4)' }}>
                      <h4 style={{ color: '#2563EB', marginBottom: 'var(--ds-space-3)' }}>⚡ Technical Latency & Recall</h4>
                      {FINANCIAL_CASE_STUDY.metrics.technical.map((m, i) => (
                        <div key={i} style={{ marginBottom: 'var(--ds-space-3)' }}>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                          <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                            <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-tertiary)' }}>Target: {m.target}</span>
                            <span style={{ fontWeight: 'bold', color: '#2563EB' }}>Actual: {m.actual}</span>
                          </div>
                        </div>
                      ))}
                    </Card>

                    <Card style={{ padding: 'var(--ds-space-4)' }}>
                      <h4 style={{ color: '#DC2626', marginBottom: 'var(--ds-space-3)' }}>🛡️ Risk & Compliance</h4>
                      {FINANCIAL_CASE_STUDY.metrics.risk.map((m, i) => (
                        <div key={i} style={{ marginBottom: 'var(--ds-space-3)' }}>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                          <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                            <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-tertiary)' }}>Target: {m.target}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--ds-color-state-success-light)' }}>Achieved: {m.actual}</span>
                          </div>
                        </div>
                      ))}
                    </Card>
                  </Grid>
                </Section>

                {/* REAL-TIME USE CASES & SIMULATOR */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Real-Time Financial Advisory Use Cases</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Select a real-world scenario to examine how event streaming and agentic RAG process user queries.</p>
                  </Section.Header>
                  <Grid columns={4} gap={3} style={{ marginBottom: 'var(--ds-space-4)' }}>
                    {FINANCIAL_CASE_STUDY.useCases.map(uc => (
                      <button
                        key={uc.id}
                        onClick={() => { setActiveUseCase(uc.id); setSimStep(0); }}
                        style={{
                          padding: 'var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: '1px solid',
                          borderColor: activeUseCase === uc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                          background: activeUseCase === uc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: activeUseCase === uc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: activeUseCase === uc.id ? 'bold' : 'normal'
                        }}
                      >
                        {uc.name}
                      </button>
                    ))}
                  </Grid>

                  {/* ACTIVE USE CASE DETAILS */}
                  {(() => {
                    const uc = FINANCIAL_CASE_STUDY.useCases.find(u => u.id === activeUseCase);
                    return (
                      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                        <Stack gap={4}>
                          <div>
                            <Badge variant="info">Triggering Event / Query</Badge>
                            <h3 style={{ marginTop: 'var(--ds-space-2)', color: 'var(--ds-color-text-primary)' }}>{uc.event}</h3>
                          </div>
                          <div>
                            <h4 style={{ marginBottom: 'var(--ds-space-3)' }}>Step-by-Step Execution Sequence:</h4>
                            <Stepper
                              steps={uc.flow.map((stepText, idx) => ({
                                title: `Step ${idx + 1}`,
                                description: stepText,
                                status: idx < simStep ? 'complete' : idx === simStep ? 'current' : 'upcoming'
                              }))}
                            />
                          </div>
                          <Flex gap={3}>
                            <Button
                              size="sm"
                              disabled={simStep === 0}
                              onClick={() => setSimStep(s => Math.max(0, s - 1))}
                            >
                              ← Previous Step
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              disabled={simStep >= uc.flow.length - 1}
                              onClick={() => setSimStep(s => Math.min(uc.flow.length - 1, s + 1))}
                            >
                              Next Execution Step →
                            </Button>
                          </Flex>
                        </Stack>
                      </Card>
                    );
                  })()}
                </Section>
              </Stack>
            )}
          </Stack>
        )}

        {/* MODE 2: SYSTEM DESIGN INTERVIEW FRAMEWORK */}
        {activeMode === 'systemdesign' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)' }}>
              <Stack gap={3}>
                <Badge variant="primary">System Design Framework</Badge>
                <h2 style={{ margin: 0 }}>9-Step RAG System Design Blueprint</h2>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodyLg)', margin: 0 }}>
                  Use this structured framework when asked: <em>"Design an enterprise RAG system for a global software enterprise or wealth management bank."</em>
                </p>
              </Stack>
            </Card>

            <Grid columns={3} gap={4}>
              {SYSTEM_DESIGN_STEPS.map((s, idx) => (
                <Card key={idx} variant="bordered" style={{ padding: 'var(--ds-space-4)' }}>
                  <Stack gap={2}>
                    <span style={{
                      display: 'inline-block',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--ds-color-module-foundations-primary)',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: '28px',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {idx + 1}
                    </span>
                    <h4 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>{s.step}</h4>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      {s.detail}
                    </p>
                  </Stack>
                </Card>
              ))}
            </Grid>

            <Callout variant="tip" title="Model Candidate Answer Script (SDLC & Financial RAG)">
              <p style={{ margin: 0, lineHeight: 'var(--ds-font-lineHeight-relaxed)' }}>
                <em>"I would start by clarifying users (devs/SRE/RM), repos &amp; document scale, confidentiality tenants, and latency targets (under 1-2s). For ingestion, I would use Tree-sitter AST chunking for code and clause-level chunking for docs, storing metadata including commit_sha, ACL, and owner. Indexes include exact ctags/LSP symbol search, BM25, and dense vector embeddings fused via Reciprocal Rank Fusion. Live tool calls fetch CI logs, APM metrics, or portfolio data. For security, I enforce pre-retrieval tenant filtering and secret scanning. Finally, generated code is compiled and test-verified in a sandbox before returning cited file#line references."</em>
              </p>
            </Callout>
          </Stack>
        )}

        {/* MODE 3: STAR METHOD & PRODUCTION PSEUDOCODES */}
        {activeMode === 'star' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)' }}>
              <Stack gap={3}>
                <Badge variant="success">STAR Interview Framework</Badge>
                <h3 style={{ margin: 0 }}>DevContext Copilot — SDLC RAG STAR Story</h3>
                <Grid columns={4} gap={3} style={{ marginTop: 'var(--ds-space-2)' }}>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: 'var(--ds-color-module-foundations-primary)' }}>S — Situation</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.situation}</p>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: '#2563EB' }}>T — Task</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.task}</p>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: '#CA8A04' }}>A — Action</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.action}</p>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: '#16A34A' }}>R — Result</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.result}</p>
                  </div>
                </Grid>
              </Stack>
            </Card>

            {/* PSEUDOCODE VIEWER */}
            <Section variant="bordered">
              <Section.Header>
                <h3 style={{ margin: 0 }}>Production Pseudocodes to Show in Interviews</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>Click to view copyable Python pseudocode for key architecture layers.</p>
              </Section.Header>

              <Flex gap={2} style={{ marginBottom: 'var(--ds-space-4)' }}>
                {[
                  { id: 'retrieval', label: '1. Hybrid Retrieval & Reranking' },
                  { id: 'orchestration', label: '2. Agentic RAG Orchestration' },
                  { id: 'evaluation', label: '3. Continuous Evaluation Runner' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePseudocode(p.id)}
                    style={{
                      padding: 'var(--ds-space-2) var(--ds-space-4)',
                      borderRadius: 'var(--ds-radius-md)',
                      border: '1px solid',
                      borderColor: activePseudocode === p.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                      background: activePseudocode === p.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                      color: activePseudocode === p.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-secondary)',
                      cursor: 'pointer',
                      fontWeight: activePseudocode === p.id ? 'bold' : 'normal'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </Flex>

              <Card style={{ padding: 'var(--ds-space-4)' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 'var(--ds-space-3)' }}>
                  <span style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'var(--ds-color-text-secondary)' }}>
                    PRODUCTION PYTHON REFERENCE
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => copyCodeToClipboard(CODE_PSEUDOCODES[activePseudocode])}>
                    {copiedCode ? '✓ Copied' : '📋 Copy Code Snippet'}
                  </Button>
                </Flex>
                <CodeBlock code={CODE_PSEUDOCODES[activePseudocode]} language="python" />
              </Card>
            </Section>
          </Stack>
        )}
      </Container>
    </div>
  );
}
