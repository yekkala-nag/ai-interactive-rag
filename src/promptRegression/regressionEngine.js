// ============================================================================
// PROMPT REGRESSION DETECTION ENGINE (companion: Prompt Regression Is Why)
// Golden sets, behavioural diffs, canary + rollback
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const REGRESSION_SIGNALS = [
  { signal: "Golden-set pass rate", how: "Fixed N Q/A pairs run on every prompt version", alert: "drop >2pp vs baseline" },
  { signal: "Behavioural diff", how: "Old vs new outputs on same inputs; judge meaningful shifts", alert: ">5% meaningful-change rate" },
  { signal: "Canary error/cost", how: "5% traffic shadow; watch refusal + tool-error + spend", alert: "any red metric 2 windows" },
  { signal: "Citation integrity", how: "Claims-per-citation + unsupported-claim count", alert: "unsupported >0 in gate" }
];

export const ROLLBACK_LADDER = [
  { stage: "CI gate", action: "Block merge on golden/behavioural fail", cost: "minutes" },
  { stage: "Canary", action: "Auto-halt rollout, keep 95% on old", cost: "minutes–hour" },
  { stage: "Full rollback", action: "Pin back component@last-good; tombstone bad version", cost: "hour" },
  { stage: "Post-mortem", action: "Add failing case to golden set; contract-test the gap", cost: "day" }
];

// ── Simulator: golden-set run ───────────────────────────────────────────────
export const RUN_GOLDEN = (noise = 2) => {
  const base = [
    { q: "Refund window?", oldOk: true, newOk: true },
    { q: "Privacy retention?", oldOk: true, newOk: true },
    { q: "Medical dosage?", oldOk: true, newOk: noise >= 2 },
    { q: "Escalation path?", oldOk: true, newOk: noise >= 1 },
    { q: "Output is valid JSON?", oldOk: true, newOk: noise >= 3 },
    { q: "Cites sources?", oldOk: true, newOk: true }
  ];
  const pass = base.filter(t => t.newOk).length;
  const rate = pass / base.length;
  const verdict = rate >= 0.95 ? "SHIP" : rate >= 0.8 ? "GATE — inspect diffs" : "ROLLBACK — regressed";
  return { total: base.length, pass, rate: +rate.toFixed(2), verdict, rows: base };
};

export const PYTHON_REGRESSION_CODE = `# ============================================================================
# PROMPT REGRESSION: golden set + behavioural diff + canary gate
# ============================================================================
def golden_run(results: list[tuple[bool, bool]]):
    """[(old_ok, new_ok), ...] -> pass rate + verdict."""
    n = len(results)
    passed = sum(1 for _, new_ok in results if new_ok)
    rate = passed / max(1, n)
    verdict = "SHIP" if rate >= 0.95 else ("GATE" if rate >= 0.8 else "ROLLBACK")
    regressed = [i for i, (o, nw) in enumerate(results) if o and not nw]
    return {"pass": passed, "total": n, "rate": round(rate, 2),
            "verdict": verdict, "regressed_idx": regressed}

if __name__ == "__main__":
    print(golden_run([(True, True)] * 4 + [(True, False), (True, True)]))
`;
