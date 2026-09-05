// ============================================================================
// MULTI-AGENT COMMUNICATION ENGINE — A2A, MCP, supervisor, blackboard
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const PROTOCOL_TABLE = [
  { proto: "Supervisor / orchestrator", how: "One leader decomposes + delegates + merges", overhead: "2 msgs/subtask", best: "Mixed skills, clear ownership", risk: "Leader bottleneck; single point of failure" },
  { proto: "A2A (agent-to-agent)", how: "Peer contracts: tasks, artifacts, auth", overhead: "P2P + discovery", best: "Org-scale agent mesh", risk: "Version skew; needs registry + pins" },
  { proto: "MCP tools (client-server)", how: "Agents call shared tool servers over stdio/SSE", overhead: "per-call RTT", best: "Standard tool reuse", risk: "Confused deputy; scope tools tightly" },
  { proto: "Blackboard (shared state)", how: "Agents read/write common board with leases", overhead: "contention", best: "Exploratory, opportunistic work", risk: "Write conflicts; lease + schema the board" },
  { proto: "Handoff chain", how: "Fixed pipeline: A→B→C with typed artifacts", overhead: "1 msg/stage", best: "Stable production flows", risk: "Brittle to change; version artifacts" }
];

export const TOPOLOGIES = [
  { id: "star", name: "Star (supervisor)", msgs: n => 2 * n, latency: "leader-bound" },
  { id: "mesh", name: "Mesh (A2A peers)", msgs: n => n * (n - 1) / 2, latency: "discovery-bound" },
  { id: "chain", name: "Chain (handoffs)", msgs: n => n - 1, latency: "sum of stages" }
];

// ── Simulator: message/latency estimate ─────────────────────────────────────
export const ESTIMATE_TOPOLOGY = (n = 5, topo = "star", perMsgMs = 120) => {
  const t = TOPOLOGIES.find(x => x.id === topo);
  const msgs = t.msgs(n);
  return {
    topology: t.name, agents: n, messages: msgs,
    estLatencyMs: msgs * perMsgMs, bottleneck: t.latency,
    advice: topo === "mesh" && n > 6 ? "Mesh explodes past ~6 agents — switch to supervisor + registry."
      : topo === "chain" ? "Cheapest but brittle — pin artifact versions between stages."
        : "Default for mixed teams — watch leader load; shard past ~8 workers."
  };
};

export const PYTHON_A2A_CODE = `# ============================================================================
# AGENT MESH: registry-pinned peers + typed handoffs + supervisor fallback
# ============================================================================
REGISTRY = {"researcher": "agent:researcher@1.4", "coder": "agent:coder@2.1"}

def send(task: dict, peer: str) -> dict:
    pinned = REGISTRY[peer]                       # fail closed on unknown peer
    assert task.get("schema_v") == 1, "artifact version skew"
    return {"to": pinned, "ack": True, "task": task["id"]}

def supervisor_run(task, workers: list[str]):
    parts = decompose(task)                       # typed subtasks
    results = [send(p, w) for p, w in zip(parts, workers)]
    return merge(results)                         # leader merges, owns conflicts
`;
