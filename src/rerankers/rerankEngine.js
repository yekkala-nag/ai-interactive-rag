// ============================================================================
// RERANKERS + LATE INTERACTION ENGINE
// Cross-encoder, Cohere/bge, RankGPT, ColBERT, HyDE, query expansion
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const RERANKER_TABLE = [
  { method: "Cross-encoder (bge-reranker, MiniLM)", how: "Joint query+doc scoring, top-50 → top-5", cost: "$$", gain: "+10–20% precision", use: "Default production upgrade" },
  { method: "API reranker (Cohere)", how: "Hosted scoring, multilingual", cost: "$$$", gain: "+12–25%", use: "Multilingual / no-GPU teams" },
  { method: "RankGPT (LLM listwise)", how: "LLM orders candidates with reasoning", cost: "$$$$", gain: "+15–30% (small sets)", use: "High-stakes ≤20 candidates" },
  { method: "ColBERT late interaction", how: "Token-level MaxSim, no joint encode", cost: "$$ (index heavy)", gain: "+8–18% + fine matches", use: "Term-heavy / long docs" },
  { method: "HyDE (hypothetical doc)", how: "LLM drafts answer → embed draft → retrieve", cost: "$$", gain: "+recall on vague queries", use: "Vocabulary-mismatch queries" }
];

export const QUERY_REWRITES = [
  { pattern: "Expand synonyms", example: "'refund window' → + 'return period, reimbursement term'", when: "Vocabulary drift" },
  { pattern: "Decompose multi-hop", example: "'X for CA in 2024?' → [filter CA] + [year 2024] + [concept X]", when: "Scoped questions" },
  { pattern: "HyDE draft", example: "Draft plausible answer, retrieve with its embedding", when: "Short / vague queries" },
  { pattern: "Step-back abstraction", example: "Ask general principle, then specific", when: "Reasoning queries" }
];

// ── Simulator: rerank a candidate list ──────────────────────────────────────
const CANDIDATES = [
  { id: "c1", text: "Refund window definitions and policy scope", bi: 0.81, cross: 0.93 },
  { id: "c2", text: "Unrelated HR onboarding checklist", bi: 0.77, cross: 0.12 },
  { id: "c3", text: "Return period and reimbursement terms FAQ", bi: 0.62, cross: 0.88 },
  { id: "c4", text: "Office holiday calendar 2024", bi: 0.71, cross: 0.05 },
  { id: "c5", text: "Amendment to refund window 30d → 14d", bi: 0.58, cross: 0.95 },
  { id: "c6", text: "Cafeteria menu and catering policy", bi: 0.66, cross: 0.08 }
];

export const RERANK = (mode = "cross", k = 3) => {
  const key = mode === "cross" ? "cross" : "bi";
  const ranked = [...CANDIDATES].sort((a, b) => b[key] - a[key]).slice(0, k);
  const rel = new Set(["c1", "c3", "c5"]);
  const prec = ranked.filter(c => rel.has(c.id)).length / ranked.length;
  return {
    mode: mode === "cross" ? "Cross-encoder rerank (top-50 → top-k)" : "Bi-encoder only (no rerank)",
    ranked, precision: +prec.toFixed(2),
    note: mode === "cross" ? "c5 (0.58 bi → 0.95 cross) rescued; distractors c2/c4 buried." : "Distractors c2/c4 outrank true c3/c5 — this is why you rerank."
  };
};

export const PYTHON_RERANK_CODE = `# ============================================================================
# RERANK PIPELINE: bi-encoder recall -> cross-encoder / ColBERT / RankGPT
# ============================================================================
from sentence_transformers import SentenceTransformer, CrossEncoder

bi = SentenceTransformer("all-MiniLM-L6-v2")
cross = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def retrieve_then_rerank(query: str, corpus: list[str], k: int = 5):
    import numpy as np
    q = bi.encode([query])[0]
    D = bi.encode(corpus)
    sims = (D @ q) / (np.linalg.norm(D, axis=1) * np.linalg.norm(q) + 1e-9)
    top50 = sorted(range(len(corpus)), key=lambda i: -sims[i])[:50]
    pairs = [(query, corpus[i]) for i in top50]
    scores = cross.predict(pairs)
    ranked = sorted(zip(top50, scores), key=lambda t: -t[1])[:k]
    return [(corpus[i], float(s)) for i, s in ranked]

# ColBERT: replace cross.predict with token MaxSim; HyDE: embed LLM draft as query.
`;
