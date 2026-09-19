// ============================================================================
// COMPLETE 12-STEP RAG PIPELINE ENGINE (infographic-faithful)
// 4 stages × 3 steps, each with failure signal; deterministic live simulator
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const STAGES = [
  { n: 1, name: "INGESTION", color: "#3A9B9F", blurb: "Everything downstream depends on this" },
  { n: 2, name: "INDEXING", color: "#8b5cf6", blurb: "Output: a searchable knowledge base" },
  { n: 3, name: "RETRIEVAL", color: "#C47A6A", blurb: "Sharper query → sharper match" },
  { n: 4, name: "GENERATION & CHECK", color: "#f472b6", blurb: "No retrieval, no grounded answer" }
];

export const STEPS = [
  // Stage 1
  { id: "source", stage: 1, name: "Source Collection", pts: ["Pull from PDFs, APIs, sites", "Include transcripts and raw text", "Everything downstream depends on this"], signal: "Missing source = silent coverage gap", ms: 120, off: "3 of 8 chunks never exist" },
  { id: "loading", stage: 1, name: "Document Loading", pts: ["Normalize content across formats", "Prepare files for chunking", "Signal: inconsistent formats break parsing"], signal: "Format soup → parser drops tables", ms: 90, off: "2 chunks garbled (tables lost)" },
  { id: "chunking", stage: 1, name: "Semantic Chunking", pts: ["Split on meaning, not length", "Preserve context across boundaries", "If this fails → retrieval gets noisy"], signal: "Split rows/sentences poison similarity", ms: 140, off: "Top relevant chunk sinks out of top-k" },
  // Stage 2
  { id: "embeddings", stage: 2, name: "Vector Embeddings", pts: ["Turn chunks into numeric vectors", "Capture meaning, not just words"], signal: "Weak model = synonym blindness", ms: 160, off: "Cannot run — pipeline halts (no vectors)" },
  { id: "store", stage: 2, name: "Vector Store", pts: ["Index embeddings for fast lookup", "Built for scale and speed", "Output → a searchable knowledge base"], signal: "Flat scan dies past ~100k vectors", ms: 70, off: "Retrieval falls back to slow scan" },
  { id: "metadata", stage: 2, name: "Metadata Tagging", pts: ["Capture author, title, tags, relations", "Feeds filtering & reranking later", "If skipped → precision drops fast"], signal: "No tags = no pre-filter", ms: 60, off: "2 distractors survive filtering" },
  // Stage 3
  { id: "rewrite", stage: 3, name: "Query Rewriting", pts: ["Clarify vague or partial queries", "Expand intent before the search", "Sharper query → sharper match"], signal: "Vague query retrieves vague chunks", ms: 300, off: "Recall −30%: a relevant chunk never matches" },
  { id: "hybrid", stage: 3, name: "Hybrid Search", pts: ["Blend vector and keyword search", "Semantic meets exact match", "Covers gaps pure vector leaves"], signal: "Codes/names need lexical match", ms: 180, off: "Keyword-only relevant chunk missed" },
  { id: "rerank", stage: 3, name: "Reranking", pts: ["Score results by true relevance", "Push a real model, not similarity", "Signal: high recall, low relevance"], signal: "Bi-encoder top-k buries truth", ms: 220, off: "Distractor outranks truth in top-k" },
  // Stage 4
  { id: "assemble", stage: 4, name: "Context Assembly", pts: ["Order and compress top context", "Fit signal inside the prompt"], signal: "Overflow truncates the best chunk", ms: 90, off: "Context stuffed raw — best chunk cut off" },
  { id: "generate", stage: 4, name: "Answer Generation", pts: ["Ground the response in retrieved data", "No retrieval, no grounded answer"], signal: "Parametric fallback = hallucination", ms: 1500, off: "No answer at all" },
  { id: "eval", stage: 4, name: "Evaluation", pts: ["Score faithfulness, latency, cost", "Verify citations against sources", "If skipped → no one catches drift"], signal: "Silent decay ships to users", ms: 400, off: "Faithfulness unverified — drift invisible" }
];

// Synthetic corpus: 8 chunks, 3 queries with known relevant sets
const CHUNKS = [
  { id: "c1", text: "Property deductible $500 · auto $250 · liability $0", rel: { refund: 0, deductible: 1, escalation: 0 }, kw: 0, vec: 2 },
  { id: "c2", text: "Refund window 14 days from purchase, receipt required", rel: { refund: 1, deductible: 0, escalation: 0 }, kw: 1, vec: 1 },
  { id: "c3", text: "Cafeteria menu and office holiday calendar 2024", rel: { refund: 0, deductible: 0, escalation: 0 }, kw: 0, vec: 3 },
  { id: "c4", text: "Property coverage deductible waived for glass-only claims", rel: { refund: 0, deductible: 1, escalation: 0 }, kw: 1, vec: 4 },
  { id: "c5", text: "Amendment: refund window 30d → 14d (2024-03-01)", rel: { refund: 1, deductible: 0, escalation: 0 }, kw: 0, vec: 5 },
  { id: "c6", text: "Escalation: L1 support → L2 specialist → duty manager", rel: { refund: 0, deductible: 0, escalation: 1 }, kw: 1, vec: 2 },
  { id: "c7", text: "Onboarding checklist for new HR hires", rel: { refund: 0, deductible: 0, escalation: 0 }, kw: 0, vec: 1 },
  { id: "c8", text: "Escalation SLA: acknowledge 1h, resolve 24h, page on breach", rel: { refund: 0, deductible: 0, escalation: 1 }, kw: 0, vec: 3 }
];

export const QUERIES = [
  { id: "refund", label: "What is the refund window?", hint: "keyword-heavy ('refund')" },
  { id: "deductible", label: "Deductible for property coverage?", hint: "needs rerank (c4 buried)" },
  { id: "escalation", label: "What is the escalation path?", hint: "needs metadata filter" }
];

// ── Deterministic pipeline run ──────────────────────────────────────────────
export const RUN_PIPELINE = (queryId = "refund", on = null, k = 4) => {
  const enabled = new Set(on || STEPS.map(s => s.id));
  const isOn = (id) => enabled.has(id);
  const log = [];
  const push = (stage, text, tone = "info") => log.push({ stage, text, tone });

  if (!isOn("embeddings")) {
    return { halted: true, reason: "Embeddings off — no vectors, pipeline cannot run.", log: [{ stage: 2, text: "✕ HALT: vectors are the pipeline's blood.", tone: "bad" }], metrics: null, chunks: [] };
  }

  // Stage 1
  push(1, isOn("source") ? "✓ Sources collected: PDFs + API + transcripts (8 chunks)" : "✕ Source step off: 3 chunks never exist", isOn("source") ? "ok" : "bad");
  push(1, isOn("loading") ? "✓ Normalized across formats; tables preserved" : "✕ Loading off: 2 table chunks garbled", isOn("loading") ? "ok" : "bad");
  push(1, isOn("chunking") ? "✓ Semantic boundaries kept; rows intact" : "✕ Fixed windows split a key row mid-cell", isOn("chunking") ? "ok" : "bad");

  // Retrieval pool construction
  let pool = CHUNKS.map(c => ({ ...c }));
  if (!isOn("source")) pool = pool.filter(c => !["c5", "c7", "c3"].includes(c.id));
  if (!isOn("rewrite")) {
    const drop = pool.find(c => c.rel[queryId] === 1);
    if (drop) { pool = pool.filter(c => c.id !== drop.id); push(3, `✕ No rewrite: vague query misses ${drop.id}`, "bad"); }
  } else push(3, "✓ Query rewritten + intent expanded", "ok");
  if (!isOn("hybrid")) {
    const kwOnly = pool.find(c => c.rel[queryId] === 1 && c.kw === 1 && c.vec > 2);
    const victim = kwOnly || pool.find(c => c.rel[queryId] === 1);
    if (victim && pool.filter(c => c.rel[queryId] === 1).length > 1) {
      pool = pool.filter(c => c.id !== victim.id);
      push(3, `✕ Vector-only: keyword-dependent ${victim.id} missed`, "bad");
    }
  } else push(3, "✓ Hybrid: semantic + lexical cover each other's gaps", "ok");

  // Stage 2 (metadata filter)
  const distractorIds = pool.filter(c => c.rel[queryId] === 0).map(c => c.id);
  let filtered = isOn("metadata") ? distractorIds.slice(0, 2) : [];
  if (isOn("metadata")) push(2, `✓ Metadata pre-filter drops ${filtered.length} distractors`, "ok");
  else push(2, "✕ No tags: all distractors survive to ranking", "bad");
  pool = pool.filter(c => !filtered.includes(c.id));

  // Ranking
  let ranked;
  if (!isOn("chunking")) {
    // broken chunk sinks the best relevant out of reach
    ranked = [...pool].sort((a, b) => (a.rel[queryId] === 1 && b.rel[queryId] === 0 ? 1 : b.rel[queryId] - a.rel[queryId] || a.vec - b.vec));
    push(1, "✕ Noisy chunks: a top relevant sinks below the fold", "bad");
  } else if (isOn("rerank")) {
    ranked = [...pool].sort((a, b) => b.rel[queryId] - a.rel[queryId] || a.vec - b.vec);
    push(3, "✓ Cross-encoder rerank: truth on top", "ok");
  } else {
    ranked = [...pool].sort((a, b) => a.vec - b.vec);
    push(3, "✕ Bi-encoder only: a distractor leads top-k", "bad");
  }
  if (!isOn("store")) push(2, "⚠ No index: flat scan (fine at 8 chunks, dead at 8M)", "warn");
  else push(2, "✓ Indexed lookup, millisecond scale", "ok");

  const topk = ranked.slice(0, k);
  const relTotal = CHUNKS.filter(c => c.rel[queryId] === 1).length;
  const relHit = topk.filter(c => c.rel[queryId] === 1).length;
  const precision = topk.length ? relHit / topk.length : 0;
  const recall = relTotal ? relHit / relTotal : 0;

  // Stage 4
  if (!isOn("assemble")) push(4, "✕ Raw stuffing: best chunk risks truncation", "warn");
  else push(4, `✓ Assembled ${topk.length} chunks, ordered + compressed`, "ok");
  if (!isOn("generate")) {
    return { halted: true, reason: "Generation off — retrieval without an answer.", log, metrics: null, chunks: topk };
  }
  push(4, `✓ Answer grounded in ${relHit} relevant chunk${relHit === 1 ? "" : "s"}`, relHit ? "ok" : "bad");
  let faith = relHit >= 2 ? 0.97 : relHit === 1 ? 0.88 : 0.4;
  if (!isOn("eval")) { push(4, "✕ Unevaluated: faithfulness + drift invisible", "warn"); }
  else { push(4, `✓ Eval: faithfulness ${faith.toFixed(2)}, citations verified`, "ok"); faith = +faith.toFixed(2); }

  const ms = STEPS.filter(s => enabled.has(s.id)).reduce((a, s) => a + s.ms, 0);
  const metrics = {
    precision: +precision.toFixed(2), recall: +recall.toFixed(2),
    faithfulness: isOn("eval") ? faith : +(faith * 0.9).toFixed(2),
    latencyMs: ms, cost: +((topk.length * 0.004 + (isOn("rerank") ? 0.02 : 0) + (isOn("generate") ? 0.05 : 0))).toFixed(3),
    evaluated: isOn("eval")
  };
  return { halted: false, log, metrics, chunks: topk };
};

export const PYTHON_PIPELINE_CODE = `# ============================================================================
# COMPLETE 12-STEP RAG PIPELINE (infographic-faithful, toggleable)
# Stage order is the reliability order: ingest -> index -> retrieve -> check
# ============================================================================
STAGES = {
    "ingest": ["source", "loading", "chunking"],
    "index": ["embeddings", "store", "metadata"],
    "retrieve": ["rewrite", "hybrid", "rerank"],
    "check": ["assemble", "generate", "eval"],
}

def run_pipeline(query: str, k: int = 4, off: set = frozenset()):
    on = lambda s: s not in off
    log = []
    if not on("embeddings"):
        return {"halted": "no vectors, no pipeline"}
    chunks = collect() if on("source") else collect()[3:]
    if not on("rewrite"):
        chunks = drop_vague_miss(chunks, query); log.append("recall -30%")
    pool = hybrid(query, chunks) if on("hybrid") else vector_only(query, chunks)
    pool = metadata_filter(pool) if on("metadata") else pool  # else: distractors stay
    ranked = cross_rerank(pool) if on("rerank") else bi_order(pool)
    topk = assemble(ranked[:k]) if on("assemble") else ranked[:k]
    if not on("generate"):
        return {"halted": "retrieval without an answer", "topk": topk}
    answer, faith = generate(topk)
    if on("eval"):
        faith = evaluate(answer, topk)   # citations verified, drift watched
    return {"answer": answer, "faithfulness": faith, "log": log}
`;
