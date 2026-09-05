// ============================================================================
// AGENT PLANNING PATTERNS ENGINE — ReAct vs Plan-Execute vs Reflexion vs ToT
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const PLANNER_PATTERNS = [
  { id: "react", name: "ReAct (reason+act loop)", trace: "Thought → Action → Observation × N", calls: "3–15 LLM", best: "Open-ended research, unknown tools needed", fail: "Loops without progress; needs step cap + progress check" },
  { id: "planexec", name: "Plan-Execute (plan then dispatch)", trace: "Plan → [parallel subtasks] → replan on drift", calls: "2–8 LLM", best: "Decomposable tasks with clear dependencies", fail: "Bad upfront plan poisons all branches" },
  { id: "reflexion", name: "Reflexion (self-critique)", trace: "Attempt → critique → retry (bounded)", calls: "4–12 LLM", best: "Code/reasoning tasks with verifiable outcome", fail: "Critic agrees with itself; needs external verifier" },
  { id: "tot", name: "Tree-of-Thoughts (branch+vote)", trace: "Branch k candidates → score → keep best", calls: "k× depth (expensive)", best: "Puzzles, high-stakes single decisions", fail: "Combinatorial cost; cap breadth aggressively" }
];

export const PLANNER_GUARDRAILS = [
  { guard: "Hard step cap", rule: "max_steps = 8–12; halt + escalate on breach", stops: "infinite loops" },
  { guard: "Progress monitor", rule: "No new information in 2 steps → replan or stop", stops: "token burn" },
  { guard: "Plan review gate", rule: "Plan-Execute plans need approval for irreversible tools", stops: "bad-plan blast radius" },
  { guard: "External verifier", rule: "Reflexion critic ≠ actor (tests, tools, second model)", stops: "self-congratulation" }
];

// ── Simulator: recommend a pattern ──────────────────────────────────────────
export const RECOMMEND_PLANNER = (decomposable = true, verifiable = true, stakes = "low", unknowns = "many") => {
  let pick = "react", why = "Unknowns dominate — interleave reasoning with tool use.";
  if (decomposable && unknowns === "few") { pick = "planexec"; why = "Clear decomposition + known tools — plan once, parallelise."; }
  if (verifiable && stakes !== "low" && !decomposable) { pick = "reflexion"; why = "Verifiable outcome rewards critique-retry cycles."; }
  if (stakes === "critical" && unknowns === "few") { pick = "tot"; why = "One critical decision — pay for branches, vote, keep best."; }
  const meta = PLANNER_PATTERNS.find(p => p.id === pick);
  return { pick: meta.name, why, trace: meta.trace, calls: meta.calls, caution: meta.fail };
};

export const PYTHON_PLANNER_CODE = `# ============================================================================
# PLANNER: bounded ReAct + Plan-Execute dispatcher with guardrails
# ============================================================================
MAX_STEPS, STALL_LIMIT = 10, 2

def react_loop(task: str, act, observe) -> dict:
    seen, stall = [], 0
    for step in range(MAX_STEPS):
        thought, action = act(task, seen)          # LLM: Thought + Action
        obs = observe(action)                      # tool result
        stall = stall + 1 if obs in seen else 0
        seen.append(obs)
        if done(obs): return {"status": "done", "steps": step + 1}
        if stall >= STALL_LIMIT: return {"status": "replan", "steps": step + 1}
    return {"status": "escalate", "steps": MAX_STEPS}

def plan_execute(task: str, plan, dispatch) -> dict:
    steps = plan(task)                             # LLM: full plan first
    if needs_approval(steps): request_approval(steps)
    results = [dispatch(s) for s in independent(steps)]
    drifted = [s for s in results if drift(s)]
    if drifted: return plan_execute(task, plan, dispatch)  # bounded replan
    return {"status": "done", "subtasks": len(steps)}

def needs_approval(steps) -> bool:
    return any(s.get("irreversible") for s in steps)
`;
