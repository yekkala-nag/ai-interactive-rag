// ============================================================================
// RAG EVALUATION ENGINE — RAGAS-style triad + faithfulness simulator
// Context precision/recall, faithfulness, answer relevance
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const EVAL_METRICS = [
  { metric: "Context precision", asks: "Of retrieved chunks, how many are relevant?", fix: "Tighten pre-filter; add reranker; cut k", range: "0–1 (target ≥0.8)" },
  { metric: "Context recall", asks: "Of needed facts, how many were retrieved?", fix: "Raise k; HyDE/query expansion; chunk overlap", range: "0–1 (target ≥0.85)" },
  { metric: "Faithfulness", asks: "Is every answer claim supported by context?", fix: "Typed generation contract; cite-or-refuse", range: "0–1 (target ≥0.95)" },
  { metric: "Answer relevance", asks: "Does the answer address the question?", fix: "Question parsing loop; scope filters", range: "0–1 (target ≥0.85)" }
];

export const GRADE_TABLE = [
  { band: "Ship", rule: "faithfulness ≥0.95 AND precision ≥0.8", action: "Promote; sample-monitor 5%" },
  { band: "Gate", rule: "faithfulness 0.85–0.95", action: "Block prod; fix top failing claim pattern" },
  { band: "Rebuild", rule: "faithfulness <0.85 OR recall <0.7", action: "Retrieval rebuild, not prompt tuning" }
];

// ── Simulator: score a synthetic QA run ─────────────────────────────────────
export const SCORE_RUN = (retrieved = 8, relevant = 5, needed = 6, found = 5, claims = 10, supported = 9) => {
  const precision = retrieved ? relevant / retrieved : 0;
  const recall = needed ? found / needed : 0;
  const faithfulness = claims ? supported / claims : 0;
  const band = faithfulness >= 0.95 && precision >= 0.8 ? "Ship" : faithfulness >= 0.85 ? "Gate" : "Rebuild";
  const diagnosis = band === "Ship" ? "Healthy — monitor drift."
    : faithfulness < 0.85 ? "Generation ungrounded — enforce cite-or-refuse before tuning retrieval."
      : recall < 0.7 ? "Retrieval blind — raise k / HyDE / overlap; prompt won't save it."
        : "Noisy retrieval — rerank + pre-filter, cut k.";
  return { precision: +precision.toFixed(2), recall: +recall.toFixed(2), faithfulness: +faithfulness.toFixed(2), band, diagnosis };
};

export const PYTHON_RAGEVAL_CODE = `# ============================================================================
# RAG EVAL TRIAD: precision / recall / faithfulness + ship-gate
# ============================================================================
def score_run(retrieved: int, relevant: int, needed: int, found: int,
              claims: int, supported: int) -> dict:
    precision = relevant / max(1, retrieved)
    recall = found / max(1, needed)
    faith = supported / max(1, claims)
    band = ("Ship" if faith >= 0.95 and precision >= 0.8
            else "Gate" if faith >= 0.85 else "Rebuild")
    return {"precision": round(precision, 2), "recall": round(recall, 2),
            "faithfulness": round(faith, 2), "band": band}

if __name__ == "__main__":
    print(score_run(8, 5, 6, 5, 10, 9))   # Gate: noisy retrieval
    print(score_run(5, 5, 6, 6, 10, 10))  # Ship
`;
