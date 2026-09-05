// ============================================================================
// LONG-CONTEXT TACTICS ENGINE
// Needle/haystack, lost-in-the-middle, compression, routing
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const FAILURE_MODES = [
  { mode: "Lost in the middle", symptom: "Facts at 20–80% depth recalled worse than head/tail", fix: "Put anchors (query, instructions, keys) at head AND tail; retrieve-then-read", loss: "up to −30% recall mid-doc" },
  { mode: "Needle dilution", symptom: "1 fact in 100k tokens drowned by distractors", fix: "Pre-filter (metadata/BM25) before stuffing context", loss: "precision collapses with length" },
  { mode: "Instruction drift", symptom: "Long docs wash out system constraints", fix: "Repeat compact constraint block at tail; re-assert before generation", loss: "constraint violations rise" },
  { mode: "Stale working memory", symptom: "Old turns contradict new facts", fix: "Compaction summaries with tombstones + bitemporal flags", loss: "silent inconsistency" }
];

export const COMPRESSION_LADDER = [
  { level: "L0 verbatim", ratio: "1x", use: "Citations, legal spans", risk: "token burn" },
  { level: "L1 extractive", ratio: "3–5x", use: "Keep key sentences + pointers", risk: "low" },
  { level: "L2 abstractive summary", ratio: "10–20x", use: "Episode recaps with entities preserved", risk: "entity drop — verify" },
  { level: "L3 structured state", ratio: "30–50x", use: "Slots/decisions/todos as JSON", risk: "schema drift" }
];

// ── Simulator: context planner ──────────────────────────────────────────────
export const PLAN_CONTEXT = (docTokens = 120000, windowTokens = 128000, needleDepth = 50, overhead = 8000) => {
  const usable = windowTokens - overhead;
  const fits = docTokens <= usable;
  const depthRisk = needleDepth >= 20 && needleDepth <= 80 ? "HIGH (lost-in-the-middle zone)" : "low (head/tail)";
  const strategy = fits && depthRisk.startsWith("low") ? "Stuff full doc; anchor query head+tail"
    : fits ? "Stuff + repeat anchors head/tail + constraint re-assert"
      : "Do NOT stuff: retrieve-then-read (pre-filter → top-k → L1/L2 compress rest)";
  const needTokens = Math.max(0, docTokens - usable);
  return { usable, fits, depthRisk, strategy, overflowTokens: needTokens, compressionNeeded: needTokens > 0 ? `~${Math.ceil(needTokens / 1000)}k tokens must be compressed or retrieved, not stuffed` : "none" };
};

export const PYTHON_LONGCTX_CODE = `# ============================================================================
# LONG-CONTEXT PLANNER: stuff vs retrieve-then-read + anchor placement
# ============================================================================
def plan_context(doc_tokens: int, window: int = 128000, overhead: int = 8000,
                 needle_depth_pct: float = 50.0) -> dict:
    usable = window - overhead
    fits = doc_tokens <= usable
    mid = 20 <= needle_depth_pct <= 80
    if fits and not mid:
        strategy = "STUFF + anchors head/tail"
    elif fits:
        strategy = "STUFF + repeated anchors + constraint re-assert at tail"
    else:
        strategy = "RETRIEVE-THEN-READ: pre-filter -> top-k -> compress rest (L1/L2)"
    return {"usable": usable, "fits": fits,
            "depth_risk": "HIGH" if mid else "low", "strategy": strategy,
            "overflow": max(0, doc_tokens - usable)}

if __name__ == "__main__":
    print(plan_context(120000, needle_depth_pct=50))
    print(plan_context(300000, needle_depth_pct=5))
`;
