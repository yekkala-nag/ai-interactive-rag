// ============================================================================
// DATA PIPELINE ENGINE — streaming (Kafka/Flink), lineage, DVC/LakeFS
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const STREAM_TABLE = [
  { concept: "Topics + partitions", rule: "partitions ≈ max(target throughput / per-partition, consumers)", ex: "12 partitions for 60k ev/s" },
  { concept: "Windowing (tumbling/sliding)", rule: "Late-data grace + watermarks; idempotent sinks", ex: "5-min tumbling, 1-min grace" },
  { concept: "Exactly-once (Flink)", rule: "Checkpointing + transactional sinks", ex: "Ask: do you need it? (2x cost)" },
  { concept: "Schema registry", rule: "Avro/Protobuf + compatibility checks in CI", ex: "Block breaking field removal" }
];

export const LINEAGE_TABLE = [
  { layer: "Catalog (table/column)", tool: "OpenLineage / Marquez, Unity", answers: "Where did premium_amount come from?" },
  { layer: "Versioning (data)", tool: "DVC / LakeFS branches", answers: "Which bytes trained v3? Diff v3↔v4?" },
  { layer: "Versioning (code+docs)", tool: "Git + doc prep framework", answers: "Which prompt version read it?" }
];

// ── Simulator: partition + lineage ──────────────────────────────────────────
export const SIZE_STREAM = (eventsPerSec = 10000, perPart = 5000, consumers = 4) => {
  const parts = Math.max(consumers, Math.ceil(eventsPerSec / perPart));
  return {
    partitions: parts, lagRisk: parts > 48 ? "HIGH — rebalance/compact; consider tiered storage" : "healthy",
    lineage: ["kafka.topic:claims (v7 schema)", "flink:dedup+window (chkpt 2min)", "lakefs: silver/claims@branch-prod", "rag:index run#441 → 2.1M chunks"],
    advice: "Lineage answers audits; LakeFS branches let retrieval test new bytes without moving prod."
  };
};

export const PYTHON_PIPE_CODE = `# ============================================================================
# STREAM + LINEAGE: partitions, idempotent sink, versioned promotion
# ============================================================================
def partitions(events_s: int, per_part: int = 5000, consumers: int = 4) -> int:
    import math
    return max(consumers, math.ceil(events_s / per_part))

# Flink: keyBy(policy_id) -> 5-min tumbling + 1-min lateness -> idempotent upsert.
# LakeFS: ingest to branch 'staging', run rag eval, merge to 'prod' on Ship.
# OpenLineage: emit run facets per job; Marquez answers column-level origin.
`;
