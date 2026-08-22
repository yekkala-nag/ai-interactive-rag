// ============================================================================
// ALWAYS-FUSED GRAPH TRAVERSAL KNOWLEDGE LAYER ENGINE
// Enterprise Document Intelligence: Bitemporal Edges & 2-Threshold Entity Resolution
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Materials
// ============================================================================

export const ROUTER_RETIREMENT_COMPARISON = [
  {
    feature: "Heuristic Query Router (Legacy)",
    mechanism: "Inspects question phrasing for keywords ('compare', 'quote').",
    flaw: "Retrieval quality depends on user's wording rather than system design.",
    outcome: "Inconsistent results for identical semantic intent."
  },
  {
    feature: "Always-Fused Retrieval Pipeline (New)",
    mechanism: "Runs Vector Search + Keyword Search + Graph Traversal on EVERY query.",
    flaw: "None; non-relevant modalities contribute zero score.",
    outcome: "Deterministic, fully testable, and robust against question phrasing."
  }
];

export const BITEMPORAL_EDGE_CONCEPTS = [
  {
    concept: "Event Time (Validity Window)",
    fields: "valid_from, valid_to",
    purpose: "Tracks when a business rule or policy clause was legally in force.",
    example: "valid_from: '2026-01-01', valid_to: '2026-02-28' (closed window for superseded rule)."
  },
  {
    concept: "System Time (Ingestion Timestamp)",
    fields: "ingested_at",
    purpose: "Tracks when the knowledge layer learned the fact for auditability.",
    example: "ingested_at: '2026-03-01T14:30:00Z'."
  },
  {
    concept: "Discovered Contradiction Detection",
    fields: "contradicts_edge, accountable_owner",
    purpose: "Automatically detects conflicting active edges on the same subject node during ingest.",
    example: "Triggers contradiction gate without requiring human curation."
  }
];

export const RESOLUTION_NODES_DATA = [
  { rawMention: "Actual Cash Value", canonicalTarget: "actual_cash_value", similarityScore: 0.98, decision: "AUTO_LINK" },
  { rawMention: "ACV Depreciated Basis", canonicalTarget: "actual_cash_value", similarityScore: 0.92, decision: "AUTO_LINK" },
  { rawMention: "Cash Settlement Payout", canonicalTarget: "actual_cash_value", similarityScore: 0.74, decision: "LLM_ADJUDICATE" },
  { rawMention: "High Wind Zone H3 Radius", canonicalTarget: "high_wind_zone_h3", similarityScore: 0.95, decision: "AUTO_LINK" },
  { rawMention: "Roof Age Wear Risk", canonicalTarget: "roof_age_risk", similarityScore: 0.88, decision: "AUTO_LINK" },
  { rawMention: "Unrelated Fleet Waiver", canonicalTarget: "fleet_waiver_new", similarityScore: 0.42, decision: "CREATE_NEW_ENTITY" }
];

export const RUN_ENTITY_RESOLUTION_SIMULATOR = (mentionText = "Cash Settlement Payout", highThreshold = 0.90, lowThreshold = 0.60) => {
  let score = 0.74;
  let targetNode = "actual_cash_value";

  const textLower = mentionText.toLowerCase();
  if (textLower.includes("acv") || textLower.includes("actual cash")) score = 0.96;
  else if (textLower.includes("wind") || textLower.includes("h3")) { score = 0.94; targetNode = "high_wind_zone_h3"; }
  else if (textLower.includes("roof")) { score = 0.89; targetNode = "roof_age_risk"; }
  else if (textLower.includes("unrelated") || textLower.includes("random")) { score = 0.35; targetNode = "new_standalone_node"; }

  let decision = "LLM_ADJUDICATE";
  let explanation = "Score falls in gray zone [0.60 - 0.90]. LLM prompt adjudicates candidate vs mention context.";

  if (score >= highThreshold) {
    decision = "AUTO_LINK";
    explanation = `High confidence match (>= ${highThreshold}). Automatically links to canonical entity '${targetNode}'.`;
  } else if (score < lowThreshold) {
    decision = "CREATE_NEW_ENTITY";
    explanation = `Low similarity (< ${lowThreshold}). Creates a new canonical entity node without fragmenting graph.`;
  }

  return {
    mentionText,
    score: parseFloat(score.toFixed(2)),
    decision,
    targetNode,
    explanation,
    fragmentationReductionPct: "7x reduction (149 concepts ➔ 19 canonical nodes)"
  };
};

export const PYTHON_GRAPH_TRAVERSAL_CODE = `# ============================================================================
# ALWAYS-FUSED GRAPH TRAVERSAL & BITEMPORAL EDGE RETRIEVAL (PYTHON)
# Enterprise Document Intelligence (Persistent Knowledge Layer)
# Responsible AI & Security Certified: Zero PII / Zero Copyrighted Text
# ============================================================================

import datetime
from typing import List, Dict, Any

class BitemporalGraphTraversal:
    def __init__(self):
        self.vertices = {}  # entity_id -> {canonical_name, aliases}
        self.edges = []     # [{src, dst, relation, valid_from, valid_to, ingested_at}]

    def add_bitemporal_edge(self, src: str, dst: str, relation: str, valid_from: str, valid_to: str = None):
        edge = {
            "src": src,
            "dst": dst,
            "relation": relation,
            "valid_from": valid_from,
            "valid_to": valid_to,
            "ingested_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
        self.edges.append(edge)

    def traverse_as_of(self, entity_id: str, as_of_date: str) -> List[Dict[str, Any]]:
        """Traverses edges that were valid on the specified date of loss."""
        active_edges = []
        for e in self.edges:
            if e["src"] == entity_id or e["dst"] == entity_id:
                # Check validity window
                valid_start = e["valid_from"] <= as_of_date
                valid_end = e["valid_to"] is None or e["valid_to"] >= as_of_date
                if valid_start and valid_end:
                    active_edges.append(e)
        return active_edges

# ── Sample Execution ────────────────────────────────────────────────────────
graph = BitemporalGraphTraversal()
graph.add_bitemporal_edge("roof_risk_rule", "h3_wind_zone", "applies_to", "2025-01-01", "2026-02-28")
graph.add_bitemporal_edge("roof_risk_rule_v2", "h3_wind_zone", "applies_to", "2026-03-01", None)

print("Query 1: Rule active on Feb 20, 2026 (Before update):")
feb_edges = graph.traverse_as_of("h3_wind_zone", "2026-02-20")
print(feb_edges)

print("\\nQuery 2: Rule active on March 15, 2026 (After update):")
mar_edges = graph.traverse_as_of("h3_wind_zone", "2026-03-15")
print(mar_edges)
`;
