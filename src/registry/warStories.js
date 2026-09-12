/**
 * War stories — anonymized production failures, one per topic max.
 * Rendered by TopicFooter (the "Graveyard" callout). All synthetic/
 * anonymized composites; zero PII, zero client-identifying detail.
 */
export const WAR_STORIES = {
  contextlimits: {
    title: "The $12,000 weekend",
    body: "A fintech forgot to truncate chat history in their agent loop. Friday deploy, silent context growth, Monday invoice: $12k in tokens for conversations nobody re-read. Fix: compaction + hard window cap + spend alert."
  },
  hallucination: {
    title: "The case that never existed",
    body: "A legal RAG cited a precedent with full confidence — eloquent, formatted, entirely fabricated. Root cause: poor chunking severed the citation from its source. Fix: cite-or-refuse contracts and claim-level attribution."
  },
  ragchunking: {
    title: "The missing clause",
    body: "Fixed 512-token windows split a liability table mid-row for months. Every query about caps retrieved half a sentence. Nobody noticed until an auditor did. Fix: boundary-aware splitting + row-level chunks."
  },
  finops: {
    title: "Flagship-everything invoice",
    body: "Team routed every call — including health checks — to the flagship model. $11k/month before anyone looked. A router + cache took it to $3k with identical answers. Fix: route by difficulty, cache repeats."
  },
  agentsandbox: {
    title: "The helpful exfiltration",
    body: "A support agent pasted a retrieved secret into a customer-facing summary to 'be thorough'. Fix: brokered short-lived creds; models never see raw secrets; tool-output quarantine."
  },
  handoffwatch: {
    title: "The polite wrong refund",
    body: "Billing API returned 200 with zero records (bad ID two hops up). Drafting node read it as 'no history' and emailed a denial. Fix: seam graders that halt on implausible handoffs."
  },
  memhierarchy: {
    title: "The audit finding",
    body: "PII sat verbatim in episodic memory for 11 months — no TTL, no quarantine. The audit didn't debate impact; it wrote a finding. Fix: hash + TTL before any salience scoring."
  },
  productionragops: {
    title: "The flaky ship",
    body: "Agent passed its demo 4/4, failed 40% of nights in prod. Nobody had measured pass^k. Fix: trial statistics with fixed budgets before any launch claim."
  },
  vectordbops: {
    title: "The Flat-index wall",
    body: "Brute-force search sailed at 100k vectors and died at 10M — p99 went vertical overnight. Fix: HNSW by default, recall@k measured on your filtered queries."
  },
  llmevals: {
    title: "Vibes launched, users regressed",
    body: "Shipped on 'looks good to me'. Users found the regression in week one — a golden set would have found it in CI. Fix: eval-to-launch gates, never vibes."
  },
  guardrails: {
    title: "The retrieved injection",
    body: "A helpdesk RAG summarized a poisoned KB article's hidden instructions and offered refunds to everyone. Fix: instruction hierarchy + tool-output quarantine + red-team battery."
  },
  tokenbill: {
    title: "The runaway night loop",
    body: "No step cap on a ReAct loop + a vague goal = $3k of tokens chasing its own tail until morning. Fix: max steps, stall detection, budget alerts."
  },
  agenticrag: {
    title: "The 47-step answer",
    body: "Multi-step search with no halting rule retrieved 47 chunks for a one-fact question. Correct answer, absurd bill. Fix: bounded iteration + sufficiency checks."
  },
  mcpclient: {
    title: "The deputy confusion",
    body: "A broadly-scoped MCP tool executed a retrieved instruction as a command. Fix: least-privilege scopes per agent, typed handoffs."
  },
  datapipeline: {
    title: "The silent schema shift",
    body: "Upstream renamed a column; silver kept flowing with nulls for a week. Lineage found it in minutes — without it, months. Fix: schema registry + lineage as first-class."
  },
  vibecode: {
    title: "The $52 Saturday",
    body: "Two-hour vibe-coded app, 200 delighted users, −$48/day unit economics. Fix: MVP offer first, static-first, unit math on day one."
  }
};

export function getWarStory(tabId) {
  return WAR_STORIES[tabId] || null;
}
