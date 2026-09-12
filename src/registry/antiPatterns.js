/**
 * Anti-patterns — what NOT to do, paired with the practice that replaces it.
 * Rendered by TopicFooter. Shown only where authored (no generic filler).
 */
export const ANTI_PATTERNS = {
  vectordbops: { no: "Storing entire PDFs as a single vector.", yes: "Parent-child chunking: small retrieve, large synthesize." },
  modelrouting: { no: "Routing on prompt length alone.", yes: "Route on semantic complexity, tool need, and accumulated context." },
  ragchunking: { no: "Fixed 512/overlap defaults for every corpus.", yes: "Boundary-aware splitting matched to document structure." },
  promptmgmt: { no: "Unversioned prompt edits straight to prod.", yes: "Pins, changelogs, and contract gates on every change." },
  memeng: { no: "Unbounded history stuffed forever.", yes: "Compaction + salience forgetting + TTLs." },
  langchain: { no: "Chains with unvalidated handoffs.", yes: "Schema every seam; validate before the next link." },
  finops: { no: "Flagship model for every call.", yes: "Cache repeats, route by difficulty, filter first." },
  agentevals: { no: "Single-run pass rate as launch evidence.", yes: "pass^k distributions at fixed budgets." },
  guardrails: { no: "Blocklist-only safety.", yes: "Layered controls + red-team battery + evals." },
  knowledgebase: { no: "Ingesting everything equally.", yes: "Top questions first; curate what volume proves." },
  observability: { no: "1% uniform sampling.", yes: "100% errors + 5% success + full canary windows." },
  pythonprofiling: { no: "Micro-tuning before measuring.", yes: "Profile, vectorize, then optimize hotspots." },
  llmfinetuning: { no: "Fine-tuning before prompt/retrieval fixes.", yes: "Cheapest intervention first; tune last." },
  ctxeng: { no: "Stuffing overflow and hoping.", yes: "Retrieve-then-read; compress the rest." },
  mcpclient: { no: "Broad tool scopes for every agent.", yes: "Least privilege per agent, typed handoffs." },
  aitestdatabottleneck: { no: "Shipping without golden sets.", yes: "Fixed cases per version; regressions gate deploys." },
  tokenbill: { no: "Annual bill review.", yes: "Per-team budgets with 70/100% alerts." },
  langgraph: { no: "State everywhere, checkpoint nowhere.", yes: "Named state + checkpointing + HITL interrupts." }
};

export function getAntiPattern(tabId) {
  return ANTI_PATTERNS[tabId] || null;
}
