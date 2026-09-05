/**
 * Diagnostics — Phase 2 of adaptive learning
 * Knowledge question bank (4 per umbrella: 2×L1 + 2×L2), role path specs,
 * placement scoring. Each question maps to a child + topic so a correct
 * answer is evidence toward testing out of that level.
 *
 * Option order is shuffled at quiz time; `answer` is the index in `options`.
 */

// ── Role path specs: ordered [{ child, max }] resolved against the DAG ─────
export const ROLE_PATHS = {
  foundations: {
    trackTitle: 'AI Foundations & Engineering',
    tagline: 'From first API calls to prompt architectures & attention',
    description: 'For all learners and engineers new to LLM internals. Core concepts first, then a first taste of retrieval and memory.',
    level: 'Beginner to Intermediate',
    icon: '🌱', color: '#0D9488', badgeVariant: 'module',
    goal: 'foundations',
    children: [
      { child: 'fnd_start', max: 1 },
      { child: 'fnd_internals', max: 1 },
      { child: 'fnd_prompts', max: 1 },
      { child: 'rag_core', max: 1 },
      { child: 'ctx_craft', max: 1 }
    ]
  },
  rag_specialist: {
    trackTitle: 'Production RAG Systems',
    tagline: 'High-precision retrieval, chunking, reranking & verification',
    description: 'For engineers building resilient retrieval systems: core pipeline, precision layer, advanced architectures, and the eval gates that keep them honest.',
    level: 'Intermediate to Advanced',
    icon: '⚡', color: '#2563eb', badgeVariant: 'primary',
    goal: 'rag',
    children: [
      { child: 'fnd_prompts', max: 1 },
      { child: 'rag_core', max: 2 },
      { child: 'rag_precision', max: 2 },
      { child: 'rag_advanced', max: 3 },
      { child: 'rag_practice', max: 2 },
      { child: 'fr_eval', max: 2 }
    ]
  },
  agent_architect: {
    trackTitle: 'Autonomous Agent Architectures',
    tagline: 'Planning, safety, multi-agent mesh & production agents',
    description: 'From agent assets and prep through planners, HITL gates, sandboxes and evals, into orchestration frameworks and production deployment.',
    level: 'Advanced',
    icon: '🤖', color: '#7c3aed', badgeVariant: 'accent',
    goal: 'agents',
    children: [
      { child: 'agt_found', max: 1 },
      { child: 'fnd_prompts', max: 2 },
      { child: 'agt_safety', max: 2 },
      { child: 'agt_multi', max: 3 },
      { child: 'agt_prod', max: 2 }
    ]
  },
  enterprise_ops: {
    trackTitle: 'Enterprise AI Ops & FinOps',
    tagline: 'Evals, cost governance, tracing & safe scale-up',
    description: 'For operating AI in production: reliability gates first, then cost control, observability, hardened agent safety, and retrieval that survives scale.',
    level: 'Enterprise Ready',
    icon: '🏢', color: '#059669', badgeVariant: 'success',
    goal: 'enterprise',
    start: 'llmevals',
    children: [
      { child: 'fr_eval', max: 2 },
      { child: 'fr_ops', max: 3 },
      { child: 'agt_safety', max: 2 },
      { child: 'rag_advanced', max: 2 }
    ]
  },
  data_engineer: {
    trackTitle: 'Data & Document Intelligence',
    tagline: 'Frames, parsing, vector search, lineage & scale',
    description: 'For data engineers feeding AI systems: foundations, document pipelines, classical ML breadth, and the eval discipline that proves the bytes.',
    level: 'Intermediate',
    icon: '🗄️', color: '#3b82f6', badgeVariant: 'module',
    goal: 'data',
    children: [
      { child: 'data_found', max: 1 },
      { child: 'data_docs', max: 2 },
      { child: 'data_ml', max: 2 },
      { child: 'data_scale', max: 2 },
      { child: 'fr_eval', max: 2 }
    ]
  },
  full_mastery: {
    trackTitle: 'Full Systems Mastery',
    tagline: 'The complete curriculum: every child, every level',
    description: 'Comprehensive journey across all six umbrellas in curriculum order. Placement skips what you already prove.',
    level: 'Comprehensive',
    icon: '👑', color: '#d97706', badgeVariant: 'warning',
    goal: 'all',
    children: null // null = every child umbrella, all levels
  }
};

export const GOAL_TO_ROLE = {
  foundations: 'foundations',
  rag: 'rag_specialist',
  agents: 'agent_architect',
  enterprise: 'enterprise_ops',
  data: 'data_engineer',
  all: 'full_mastery'
};

// ── Question bank: 24 questions, 4 per umbrella (2 L1 + 2 L2) ───────────────
export const QUIZ_QUESTIONS = [
  // Foundations
  { id: 'f1', umbrella: 'foundations', child: 'fnd_prompts', level: 1, topic: 'promptfundamentals', q: 'What does a system prompt primarily do?', options: ['Sets the role, rules and constraints the model follows', 'Fine-tunes the model weights', 'Compresses the context window', 'Replaces the need for evals'], answer: 0, explain: 'System prompts steer behavior within a run; they never change weights.' },
  { id: 'f2', umbrella: 'foundations', child: 'fnd_internals', level: 1, topic: 'llmsampling', q: 'Raising the sampling temperature mainly…', options: ['Flattens the distribution — output gets more random', 'Forces greedy decoding', 'Increases the context window', 'Lowers token cost'], answer: 0, explain: 'Temperature scales logits before softmax; higher = flatter = more diverse.' },
  { id: 'f3', umbrella: 'foundations', child: 'fnd_prompts', level: 2, topic: 'structuredoutputs', q: 'The most reliable fix for broken JSON model output is…', options: ['Constrained decoding against a grammar/schema', 'A longer system prompt', 'Higher temperature', 'Retrying until valid'], answer: 0, explain: 'Grammars mask invalid tokens at decode time — structure by construction.' },
  { id: 'f4', umbrella: 'foundations', child: 'fnd_internals', level: 2, topic: 'tokenization', q: 'Hindi/Arabic text costs ~1.8x the tokens of equivalent English mostly because…', options: ['Subword fertility — scripts fragment into more pieces', 'Models refuse non-English', 'Unicode is billed double', 'Right-to-left needs re-encoding'], answer: 0, explain: 'Tokenizer fertility: same meaning, more pieces, bigger bill.' },
  // RAG
  { id: 'r1', umbrella: 'rag_architecture', child: 'rag_core', level: 1, topic: 'ragchunking', q: 'Why does naive fixed-size chunking hurt retrieval?', options: ['It splits mid-sentence and mid-table-row, severing meaning', 'It is too slow to run', 'It uses too little overlap', 'It needs a GPU'], answer: 0, explain: 'Arbitrary windows cut semantic units; boundaries matter more than size.' },
  { id: 'r2', umbrella: 'rag_architecture', child: 'rag_core', level: 1, topic: 'filtering', q: '“Retrieval = filtering” means…', options: ['Apply metadata/BM25 pre-filters before vector search', 'Only use vectors, never keywords', 'Filter the LLM answer after generation', 'Remove stopwords from prompts'], answer: 0, explain: 'Cheap exact filters shrink the candidate set before expensive similarity.' },
  { id: 'r3', umbrella: 'rag_architecture', child: 'rag_precision', level: 2, topic: 'rerankers', q: 'A cross-encoder reranker over the top-50 mainly improves…', options: ['Precision in the final top-k', 'Embedding speed', 'Chunk size selection', 'Prompt length'], answer: 0, explain: 'Joint query+doc scoring rescues buried truths bi-encoders miss.' },
  { id: 'r4', umbrella: 'rag_architecture', child: 'rag_precision', level: 2, topic: 'rageval', q: 'Faithfulness below 0.85 on a RAG eval means…', options: ['A generation fault — fix the cite-or-refuse contract first', 'A retrieval fault — raise k', 'A chunking fault — shrink chunks', 'A sampling fault — lower temperature'], answer: 0, explain: 'Ungrounded claims blame the generator, not the retriever. Fix order matters.' },
  // Context & Memory
  { id: 'c1', umbrella: 'context_memory', child: 'ctx_craft', level: 1, topic: 'ctxeng', q: '“Lost in the middle” refers to…', options: ['Recall collapsing for facts buried mid-context', 'Forgetting the system prompt', 'Running out of tokens', 'Slow first-token latency'], answer: 0, explain: 'Recall is U-shaped: heads and tails stick, middles vanish.' },
  { id: 'c2', umbrella: 'context_memory', child: 'ctx_memory', level: 1, topic: 'memeng', q: 'Episodic vs semantic memory differs as…', options: ['Past-session events vs durable cross-user facts', 'GPU vs CPU memory', 'Short vs long prompts', 'Cache vs database latency'], answer: 0, explain: 'Episodic = what happened; semantic = what is true. Different tiers, different eviction.' },
  { id: 'c3', umbrella: 'context_memory', child: 'ctx_memory', level: 2, topic: 'memhierarchy', q: 'PII detected in a memory event must be…', options: ['Quarantined (hashed + TTL) before any salience scoring', 'Scored normally, redacted at read time', 'Kept verbatim for audit fidelity', 'Embedded but never retrieved'], answer: 0, explain: 'Quarantine-before-scoring: raw spans never land in working or episodic tiers.' },
  { id: 'c4', umbrella: 'context_memory', child: 'ctx_long', level: 2, topic: 'longcontext', q: 'A document larger than the usable window should be handled by…', options: ['Retrieve-then-read: pre-filter, top-k, compress the rest', 'Truncating the middle silently', 'Raising temperature to fit more', 'Splitting across parallel chats'], answer: 0, explain: 'Overflow tokens get retrieved or compressed — never stuffed.' },
  // Agents
  { id: 'a1', umbrella: 'agents_frameworks', child: 'agt_found', level: 1, topic: 'fiveassets', q: 'A ReAct loop iterates…', options: ['Thought → Action → Observation', 'Plan → Approve → Merge', 'Embed → Retrieve → Generate', 'Train → Eval → Deploy'], answer: 0, explain: 'Reasoning interleaved with tool use; observations ground the next thought.' },
  { id: 'a2', umbrella: 'agents_frameworks', child: 'agt_found', level: 1, topic: 'agentsastools', q: '“Agents as tools” means…', options: ['Subagents invoked through tool calls with typed I/O', 'Replacing all tools with one agent', 'Humans operating as tools', 'Disabling function calling'], answer: 0, explain: 'Composition via typed interfaces — agents become callable units.' },
  { id: 'a3', umbrella: 'agents_frameworks', child: 'agt_safety', level: 2, topic: 'agentplanner', q: 'Two steps with no new information should trigger…', options: ['Replan or stop (stall guard)', 'Higher temperature', 'More parallel branches', 'A longer system prompt'], answer: 0, explain: 'Stall detection bounds token burn; loops without progress never recover.' },
  { id: 'a4', umbrella: 'agents_frameworks', child: 'agt_safety', level: 2, topic: 'agentsandbox', q: 'An agent needing a production secret should receive…', options: ['Short-lived brokered credentials, never raw values', 'The raw secret in context', 'Permanent env vars', 'Secrets pasted by the user each turn'], answer: 0, explain: 'Models never see raw secrets; brokers mint scoped, expiring creds.' },
  // Data & Platform
  { id: 'd1', umbrella: 'data_platform', child: 'data_found', level: 1, topic: 'modernioformats', q: 'Parquet predicate pushdown means…', options: ['Reading only needed row-groups/columns', 'Compressing with gzip', 'Sorting rows on write', 'Caching in Redis'], answer: 0, explain: 'Columnar stats let readers skip irrelevant bytes entirely.' },
  { id: 'd2', umbrella: 'data_platform', child: 'data_found', level: 1, topic: 'linearregression', q: 'Gradient descent updates weights…', options: ['Opposite the loss gradient, scaled by learning rate', 'Toward larger loss', 'Randomly each epoch', 'Only on the final layer'], answer: 0, explain: 'Downhill on the loss surface, one scaled step at a time.' },
  { id: 'd3', umbrella: 'data_platform', child: 'data_docs', level: 2, topic: 'vectordbops', q: 'HNSW vs brute-force Flat search trades…', options: ['RAM (~1.35x) for high-QPS approximate recall', 'Accuracy for nothing', 'Latency for storage with no benefit', 'Recall for determinism only'], answer: 0, explain: 'Graph index: ~1.35x RAM, 0.95–0.99 recall, far higher QPS.' },
  { id: 'd4', umbrella: 'data_platform', child: 'data_scale', level: 2, topic: 'medallionarch', q: 'In medallion architecture, Silver holds…', options: ['Cleaned, conformed, queryable data', 'Raw ingested bytes', 'ML feature vectors', 'Dashboard screenshots'], answer: 0, explain: 'Bronze = raw, Silver = clean, Gold = serving-ready.' },
  // Production & Frontiers
  { id: 'p1', umbrella: 'frontiers_production', child: 'fr_ops', level: 1, topic: 'tokenbill', q: '“The cheapest token is…”', options: ['The un-sent one — cache and filter first', 'The output token', 'The embedding token', 'The cached prompt prefix'], answer: 0, explain: 'Calls removed beat calls discounted: cache → route → filter.' },
  { id: 'p2', umbrella: 'frontiers_production', child: 'fr_eval', level: 1, topic: 'guardrails', q: 'PII redaction in a RAG pipeline belongs…', options: ['Before storage and scoring, at ingestion', 'Only in the UI layer', 'After the LLM answers', 'In the vector index config'], answer: 0, explain: 'Redact upstream: quarantined bytes can never leak downstream.' },
  { id: 'p3', umbrella: 'frontiers_production', child: 'fr_ops', level: 2, topic: 'finops', q: 'The correct cost-lever order is…', options: ['Cache → route → filter → compress → rerank', 'Rerank → cache → route', 'Compress → cache → filter', 'Route → rerank → cache'], answer: 0, explain: 'Remove calls first, downgrade the rest, shrink what remains.' },
  { id: 'p4', umbrella: 'frontiers_production', child: 'fr_ops', level: 2, topic: 'observability', q: 'A sane trace-retention default keeps 100% of…', options: ['Error traces (+ sampled success, full canary)', 'All success traces forever', 'Only canary windows', 'Nothing — sample everything at 1%'], answer: 0, explain: 'Errors are cheap to keep and priceless in incidents.' }
];

// ── Scoring: answers {qid: chosenIndex} → per-umbrella placed level 1|2|3 ───
export function scoreQuiz(answers = {}) {
  const perUmbrella = {};
  for (const q of QUIZ_QUESTIONS) {
    const u = perUmbrella[q.umbrella] || (perUmbrella[q.umbrella] = { l1: 0, l1Total: 0, l2: 0, l2Total: 0 });
    const correct = answers[q.id] === q.answer;
    if (q.level === 1) { u.l1Total++; if (correct) u.l1++; }
    else { u.l2Total++; if (correct) u.l2++; }
  }
  const levels = {};
  for (const [u, s] of Object.entries(perUmbrella)) {
    levels[u] = s.l1 === s.l1Total && s.l2 === s.l2Total ? 3 : s.l1 === s.l1Total && s.l2 >= 1 ? 2 : 1;
  }
  return { levels, detail: perUmbrella };
}
