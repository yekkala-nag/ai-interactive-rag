// ============================================================================
// AI OBSERVABILITY ENGINE — traces, evals, LangSmith vs Langfuse, sampling
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const SIGNAL_TABLE = [
  { signal: "Traces + spans", captures: "prompt → retrieval → rerank → generate latency/cost per step", alert: "p95 step latency; cost per task" },
  { signal: "Scores as spans", captures: "precision/recall/faithfulness logged per run", alert: "band slip Ship→Gate" },
  { signal: "Feedback + overrides", captures: "thumbs, HITL edits, gate decisions", alert: "override-rate spike" },
  { signal: "Prompts + versions", captures: "component@version pinned to every span", alert: "floating-version span" }
];

export const PLATFORM_TABLE = [
  { dim: "LangSmith", note: "Deep LangChain-native tracing + evals; $$ at scale" },
  { dim: "Langfuse", note: "OSS, self-hostable, scores + prompts; own the data" },
  { dim: "OTel + warehouse", note: "Vendor-neutral spans → your SQL; most work" }
];

// ── Simulator: sampling vs detection ────────────────────────────────────────
export const SAMPLING_PLAN = (tasksPerDay = 100000, samplePct = 5, bytesPerTraceKB = 40) => {
  const stored = tasksPerDay * samplePct / 100;
  const gbDay = stored * bytesPerTraceKB / 1e6;
  const detectLag = samplePct >= 20 ? "~minutes" : samplePct >= 5 ? "~1 hour" : "~half day";
  return {
    storedPerDay: Math.round(stored), gbPerDay: +gbDay.toFixed(2), gbPerMonth: +(gbDay * 30).toFixed(1),
    detectLag, advice: samplePct < 5 ? "Too thin for incidents — raise errors to 100%, keep success sampled." : "Sane default: 100% errors + 5% success + full canary windows."
  };
};

export const PYTHON_OBS_CODE = `# ============================================================================
# OBSERVABILITY: OTel spans + score logging + sampled retention
# ============================================================================
from opentelemetry import trace
tracer = trace.get_tracer("rag")

def run_task(task_id: str, sample: bool):
    with tracer.start_as_current_span("rag.task") as span:
        span.set_attribute("task.id", task_id)
        span.set_attribute("prompt.version", "base-policy@2")  # pinned!
        # ... retrieval / rerank / generate child spans ...
        span.set_attribute("eval.faithfulness", 0.97)          # scores as spans
        if not sample:
            span.set_attribute("sampled", False)               # drop at export
        return {"ok": True}

# Export: 100% error traces + 5% success + full canary windows.
`;
