// ============================================================================
// AGENT SANDBOX ENGINE — tiers, tool-risk, confused-deputy defence
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const SANDBOX_TIERS = [
  { tier: "T0 read-only", allows: "search, read KB, draft", blocks: "all mutation", use: "Research, summarisation" },
  { tier: "T1 staged writes", allows: "PRs, drafts, sandboxed FS", blocks: "prod, network-egress, secrets", use: "Code, content (default)" },
  { tier: "T2 scoped prod", allows: "allow-listed APIs + budgets", blocks: "everything else (deny-by-default)", use: "Refunds < cap, scheduled posts" },
  { tier: "T3 privileged", allows: "break-glass only, dual approval", blocks: "standing access — just-in-time", use: "Incident response" }
];

export const TOOL_RISKS = [
  { tool: "kb.read / search", risk: "Low", control: "T0; audit sample" },
  { tool: "code.exec / shell", risk: "Critical", control: "T1 sandbox, no net, timeout + CPU/RAM caps" },
  { tool: "db.write / refund.issue", risk: "High", control: "T2 + HITL gate + idempotency key" },
  { tool: "email.send / publish", risk: "High", control: "T2 + approval + rate limit" },
  { tool: "secret.read", risk: "Critical", control: "Never to model; brokered short-lived creds" }
];

// ── Simulator: sandbox tier from tool set ───────────────────────────────────
export const SCORE_SANDBOX = (tools = ["code.exec"], prod = false, standingSecrets = false) => {
  const critical = tools.some(t => /exec|shell|secret/i.test(t));
  const mutating = tools.some(t => /write|issue|send|publish|delete/i.test(t));
  let tier = "T0 read-only";
  if (critical || mutating) tier = "T1 staged writes";
  if (prod && mutating) tier = "T2 scoped prod";
  if (standingSecrets || /secret/i.test(tools.join())) tier += " + SECRET BROKER REQUIRED";
  const controls = ["deny-by-default egress", "CPU/RAM/time caps", "idempotency keys on mutation",
    prod ? "HITL approval gate" : "async audit", standingSecrets ? "remove standing secrets NOW" : "short-lived brokered creds"];
  return { tier, critical, mutating, controls };
};

export const PYTHON_SANDBOX_CODE = `# ============================================================================
# SANDBOX: deny-by-default tool broker with budgets + idempotency
# ============================================================================
ALLOW = {"kb.read", "pr.open", "refund.issue"}   # T2 allow-list example

def broker_call(agent: str, tool: str, args: dict, budget: dict) -> dict:
    assert tool in ALLOW, f"denied: {tool} not allow-listed"
    assert budget["spend"] < budget["cap"], "budget exhausted"
    key = args.get("idempotency_key")
    assert key and not seen(key), "mutation needs fresh idempotency key"
    log(agent, tool, args)                       # every call audited
    return {"ok": True, "tool": tool}

# shell/exec: run in gVisor/Firecracker jail, no network, 30s/512MB caps.
# secrets: broker mints 5-min creds; model never sees raw values.
`;
