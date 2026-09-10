// ============================================================================
// AGENT FAN-OUT LOAD ENGINE (Vespa.ai/GigaOm — retrieval under 100s of agents)
// Latency stacking, stale context, relevance drift, unified layer
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const WHY_DIFFERENT = [
  { human: "1 query → 1 retrieval", agent: "retrieve → reason → reformulate → retrieve ×N", mult: "3–8x retrievals per task" },
  { human: "Tolerates 500ms", agent: "Stacks per hop — 4 hops × 400ms = 1.6s+", mult: "Latency compounds, not adds" },
  { human: "Freshness: nice", agent: "Agents act on it — stale = wrong writes", mult: "Staleness becomes corruption" }
];

export const FAILURE_MODES = [
  { mode: "Latency stacking", detail: "Per-hop retrieval × reformulation loops; p95 explodes while p50 looks fine", missed: "Averages hide it — watch p95/p99 per hop" },
  { mode: "Stale context at speed", detail: "Concurrent writes invalidate between agent's read and act", missed: "TTL caches serve confidently-expired facts" },
  { mode: "Relevance drift", detail: "Reformulated queries drift off-intent across hops", missed: "Per-hop relevance unmeasured" },
  { mode: "Fragmented-stack overhead", detail: "Vector DB + ranker + serving disagree under pressure", missed: "Three dashboards, no single truth" }
];

export const WHY_NAIVE_FIXES_FAIL = [
  { fix: "More caching", fails: "Cache hit on stale = fast wrong; thundering on invalidation" },
  { fix: "Bigger vector DB", fails: "Capacity was never the bottleneck — freshness + reformulation storms were" }
];

export const UNIFIED_LAYER = [
  { piece: "One serving path", does: "Retrieval + ranking + freshness in a single layer" },
  { piece: "Freshness contracts", does: "Staleness budgets per query class, enforced not hoped" },
  { piece: "Reformulation budget", does: "Cap hops; deteriorating relevance halts the loop" }
];

// ── Simulator: fan-out load ─────────────────────────────────────────────────
export const FANOUT_LOAD = (agents = 200, reforms = 4, baseMs = 120, cacheHit = 0.4) => {
  const qps = agents * reforms;
  const effMs = baseMs * (1 - cacheHit * 0.7);
  const p95 = Math.round(effMs * reforms * 1.6);
  const staleRisk = Math.min(95, Math.round(agents * reforms * (1 - cacheHit) * 0.05));
  return {
    qps, p95Ms: p95, staleRiskPct: staleRisk,
    verdict: p95 > 1500 ? "WALL HIT — stacking dominates; unify layer + cap reformulations."
      : staleRisk > 40 ? "CORRUPTION RISK — freshness contracts before more cache."
      : "Holding — monitor p95 per hop, not averages.",
    note: "Agents multiply demand AND raise freshness stakes simultaneously."
  };
};

export const PYTHON_FANOUT_CODE = `# ============================================================================
# FAN-OUT LOAD MODEL: agents x reformulations vs freshness/latency budgets
# ============================================================================
def fanout(agents: int, reforms: int = 4, base_ms: int = 120, cache_hit: float = 0.4) -> dict:
    qps = agents * reforms
    p95 = round(base_ms * (1 - cache_hit * 0.7) * reforms * 1.6)
    stale = min(95, round(agents * reforms * (1 - cache_hit) * 0.05))
    verdict = ("WALL HIT" if p95 > 1500 else
               "CORRUPTION RISK" if stale > 40 else "HOLDING")
    return {"qps": qps, "p95_ms": p95, "stale_risk_pct": stale, "verdict": verdict}

if __name__ == "__main__":
    print(fanout(200))          # the wall
    print(fanout(20, cache_hit=0.7))
`;
