// ============================================================================
// HUMAN-IN-THE-LOOP PATTERNS ENGINE — gates, escalation, audit
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const HITL_PATTERNS = [
  { id: "approve", name: "Approval gate", where: "Before irreversible tools (delete, pay, publish)", cost: "1 human-click latency", risk: "gate fatigue — batch + risk-score ordering" },
  { id: "suggest", name: "Suggest-then-edit", where: "Drafts, code, comms — human edits, agent applies", cost: "review minutes", risk: "rubber-stamping — require diff review" },
  { id: "escalate", name: "Confidence escalation", where: "Score < threshold OR novel situation → human", cost: "p95 latency bump", risk: "threshold tuning; log overrides" },
  { id: "audit", name: "Async audit trail", where: "Every decision logged; sampled review post-hoc", cost: "storage + sample review", risk: "too late for irreversible acts — pair with gates" }
];

export const AUTONOMY_LADDER = [
  { level: "L0 advise", human: "Decides everything", example: "summaries, options" },
  { level: "L1 act-supervised", human: "Approves each act", example: "draft PR, staged deploy" },
  { level: "L2 act-bounded", human: "Approves classes; audits samples", example: "refunds < $50 auto" },
  { level: "L3 autonomous", human: "Audits + kill-switch", example: "read-only monitors" }
];

// ── Simulator: required gate from risk ──────────────────────────────────────
export const REQUIRED_GATE = (irreversible = true, blast = "many-users", confidence = 0.6, novelty = "routine") => {
  const score = (irreversible ? 3 : 0) + (blast === "many-users" ? 2 : blast === "single-user" ? 1 : 0)
    + (confidence < 0.7 ? 2 : 0) + (novelty === "novel" ? 2 : 0);
  if (score >= 6) return { gate: "L1 act-supervised — approval gate per act", autonomy: "L1", reason: `risk score ${score}/9: irreversible + wide blast + low confidence/novelty.` };
  if (score >= 3) return { gate: "L2 act-bounded — class approval + sampled audit", autonomy: "L2", reason: `risk score ${score}/9: bounded autonomy with audit sampling.` };
  return { gate: "L3 autonomous + async audit trail", autonomy: "L3", reason: `risk score ${score}/9: reversible, narrow, confident — monitor only.` };
};

export const PYTHON_HITL_CODE = `# ============================================================================
# HITL GATE: risk-scored approval + confidence escalation + audit
# ============================================================================
def risk_score(irreversible: bool, blast: str, confidence: float, novel: bool) -> int:
    s = (3 if irreversible else 0) + {"org": 3, "many-users": 2, "single-user": 1}.get(blast, 0)
    s += (2 if confidence < 0.7 else 0) + (2 if novel else 0)
    return s

def required_gate(**kw) -> str:
    s = risk_score(**kw)
    return "L1-supervised" if s >= 6 else ("L2-bounded" if s >= 3 else "L3-audit")

def guarded_act(action, ctx):
    gate = required_gate(irreversible=action.irreversible, blast=action.blast,
                         confidence=ctx.confidence, novel=ctx.novel)
    if gate == "L1-supervised":
        approve(action)            # blocks until human clicks
    audit_log(action, gate, ctx)   # always, every act
    return execute(action)
`;
