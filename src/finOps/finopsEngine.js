// ============================================================================
// FINOPS ENGINE — token cost model, cache/router levers, budget simulator
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const COST_MODEL = [
  { lever: "Model routing (flagship → mini)", saves: "5–10x per routed call", needs: "Zero-model router + confidence margin", risk: "misroute on hard queries" },
  { lever: "Semantic cache", saves: "30–60% on repeated Qs", needs: "Embedding threshold + TTL + tenant scope", risk: "stale answers — TTL + version" },
  { lever: "Call less (filter first)", saves: "40–70% LLM calls", needs: "Deterministic pre-filter + fast path", risk: "filter misses — measure recall" },
  { lever: "Prompt compression", saves: "20–40% input tokens", needs: "L1/L2 ladder; repeat anchors", risk: "entity drop — verify" },
  { lever: "Rerank instead of big-k", saves: "50%+ context tokens", needs: "top-50 → cross-encoder top-5", risk: "rerank latency" }
];

export const PRICE_TABLE = [
  { model: "Flagship", perMTokIn: 5.00, perMTokOut: 15.00 },
  { model: "Mini", perMTokIn: 0.30, perMTokOut: 1.20 },
  { model: "Embedding", perMTokIn: 0.02, perMTokOut: 0.00 }
];

// ── Simulator: monthly bill ─────────────────────────────────────────────────
export const MONTHLY_BILL = (callsK = 500, inTok = 3000, outTok = 500, routedPct = 60, cachedPct = 30) => {
  const bill = (price, k, tok) => k * 1000 * tok / 1e6 * price;
  const full = bill(5, callsK, inTok) + bill(15, callsK, outTok);
  const eff = callsK * (1 - cachedPct / 100);
  const routed = eff * routedPct / 100, flag = eff - routed;
  const opt = bill(5, flag, inTok) + bill(15, flag, outTok) + bill(0.3, routed, inTok) + bill(1.2, routed, outTok);
  return {
    full: Math.round(full), opt: Math.round(opt), saved: Math.round(full - opt),
    savedPct: full ? Math.round((1 - opt / full) * 100) : 0,
    note: "Cache removes calls first (cheapest token is the un-sent one); routing downgrades the rest."
  };
};

export const PYTHON_FINOPS_CODE = `# ============================================================================
# FINOPS: bill model + cache-first + route-second savings
# ============================================================================
PRICE = {"flag_in": 5.0, "flag_out": 15.0, "mini_in": 0.3, "mini_out": 1.2}

def monthly(calls_k: int, in_tok: int, out_tok: int, routed: float, cached: float) -> dict:
    full = calls_k * 1000 * (in_tok / 1e6 * PRICE["flag_in"] + out_tok / 1e6 * PRICE["flag_out"])
    eff = calls_k * (1 - cached)
    r, f = eff * routed, eff * (1 - routed)
    opt = (f * 1000 * (in_tok / 1e6 * PRICE["flag_in"] + out_tok / 1e6 * PRICE["flag_out"])
           + r * 1000 * (in_tok / 1e6 * PRICE["mini_in"] + out_tok / 1e6 * PRICE["mini_out"]))
    return {"full": round(full), "optimized": round(opt), "saved_pct": round(100 * (1 - opt / full))}

if __name__ == "__main__":
    print(monthly(500, 3000, 500, routed=0.6, cached=0.3))
`;
