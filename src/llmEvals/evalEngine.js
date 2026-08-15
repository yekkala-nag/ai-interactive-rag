// ============================================================================
// LLM EVALUATION LAYER: THE MISSING QUALITY GATE THAT DECIDES WHAT SHIPS
// Based on Towards Data Science / Emmimal P. Alexander (Pure-Python Quality Gate)
// ============================================================================

export const EVAL_SCENARIOS = [
  {
    id: "financial_hallucination",
    title: "Scenario 1: Financial CapEx — Hallucination Signature (High Specificity + Zero Attribution)",
    query: "What was Enterprise Corp's total CapEx spend in Q3 2025 and what was the primary allocation?",
    context: `Enterprise Corp Form 10-Q (Q3 2025):
In the third quarter of 2025, operating income reached $412M, up 12% YoY. Research & Development expenses were $140M. Free cash flow stood at $280M. Capital expenditure reporting will be published in the consolidated annual Form 10-K report.`,
    response: `In Q3 2025, Enterprise Corp had a total CapEx spend of $84.5 Million. The primary allocation was $52 Million invested in high-density GPU data center infrastructure and $32.5 Million for corporate facility expansions.`,
    expectedDecision: "BLOCK",
    scores: {
      attribution: 0.12,
      specificity: 0.94,
      relevance: 0.96,
      compositeConfidence: 0.18
    },
    claims: [
      { text: "Total CapEx spend of $84.5 Million in Q3 2025", status: "UNSUPPORTED", attribution: 0.05 },
      { text: "Primary allocation was $52 Million in GPU data centers", status: "UNSUPPORTED", attribution: 0.08 },
      { text: "$32.5 Million for corporate facility expansions", status: "UNSUPPORTED", attribution: 0.05 }
    ],
    failureType: "HALLUCINATION_HIGH_SPECIFICITY",
    logReason: "Dangerous Hallucination Signature: Model fabricated highly specific numbers ($84.5M, $52M, $32.5M) with near-zero context attribution (12%).",
    decisionBadge: { label: "BLOCK & FALLBACK", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" }
  },
  {
    id: "grounded_serve",
    title: "Scenario 2: API Rate Limits — Fully Grounded (High Attribution + High Specificity)",
    query: "What are the tier-2 API rate limits and what happens if the burst quota is exceeded?",
    context: `Platform API Gateway Documentation:
Tier-2 developer accounts are allocated 1,200 requests per minute with a burst capacity of 150 requests per 10-second window. If the burst quota is exceeded, the gateway returns HTTP 429 Too Many Requests with a 'Retry-After' header indicating backoff in milliseconds.`,
    response: `Tier-2 developer accounts have a rate limit of 1,200 requests per minute with a burst allowance of 150 requests per 10 seconds. When burst limits are exceeded, the API returns HTTP 429 (Too Many Requests) along with a 'Retry-After' header specifying backoff duration.`,
    expectedDecision: "SERVE",
    scores: {
      attribution: 0.98,
      specificity: 0.92,
      relevance: 0.95,
      compositeConfidence: 0.96
    },
    claims: [
      { text: "Tier-2 accounts have a rate limit of 1,200 requests/min", status: "GROUNDED", attribution: 1.0 },
      { text: "Burst allowance of 150 requests per 10 seconds", status: "GROUNDED", attribution: 0.98 },
      { text: "Returns HTTP 429 with 'Retry-After' header on burst exceed", status: "GROUNDED", attribution: 0.96 }
    ],
    failureType: "NONE",
    logReason: "100% Entailed: All factual assertions strictly supported by retrieved context chunks.",
    decisionBadge: { label: "SERVE TO USER", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" }
  },
  {
    id: "vague_retry",
    title: "Scenario 3: SLA Penalty — Vague Response (High Attribution + Low Specificity)",
    query: "What specific refund percentage is issued if uptime drops to 99.1%?",
    context: `Enterprise SLA Agreement:
- 99.9% to 99.5% Uptime: 10% Service Credit
- 99.49% to 99.0% Uptime: 25% Service Credit
- Below 99.0% Uptime: 50% Service Credit
Claims must be submitted within 30 days of month-end.`,
    response: `If uptime drops below the target threshold, the company offers a service credit percentage depending on how severe the outage was, and customers can submit a claim.`,
    expectedDecision: "RETRY",
    scores: {
      attribution: 0.88,
      specificity: 0.28,
      relevance: 0.55,
      compositeConfidence: 0.46
    },
    claims: [
      { text: "Offers a service credit depending on outage severity", status: "GROUNDED_BUT_VAGUE", attribution: 0.90 },
      { text: "Customers can submit a claim", status: "GROUNDED", attribution: 0.85 }
    ],
    failureType: "LOW_SPECIFICITY_OMISSION",
    logReason: "Vague & Evasive: Failed to extract the exact 25% credit tier explicitly stated in context.",
    decisionBadge: { label: "RETRY & RE-PROMPT", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" }
  }
];

export const REGRESSION_TEST_SUITE = [
  { testId: "TC-01", name: "OAuth2 PKCE Validation", baselineScore: 0.98, candidateScore: 0.97, status: "PASS" },
  { testId: "TC-02", name: "CapEx Reporting Accuracy", baselineScore: 0.95, candidateScore: 0.22, status: "REGRESSION_FAIL" },
  { testId: "TC-03", name: "API Rate Limits & 429", baselineScore: 0.96, candidateScore: 0.96, status: "PASS" },
  { testId: "TC-04", name: "SLA Tier Credit Percentage", baselineScore: 0.92, candidateScore: 0.44, status: "REGRESSION_FAIL" },
  { testId: "TC-05", name: "Multi-Region Failover Steps", baselineScore: 0.94, candidateScore: 0.95, status: "PASS" },
  { testId: "TC-06", name: "HIPAA Data Isolation Rule", baselineScore: 0.99, candidateScore: 0.99, status: "PASS" }
];

export const EVALUATION_MATRICES = [
  {
    quadrant: "Top-Right: High Attribution + High Specificity",
    outcome: "SERVE (Green)",
    action: "Pass immediately to production delivery",
    risk: "Low Risk (<1%)"
  },
  {
    quadrant: "Top-Left: Low Attribution + High Specificity",
    outcome: "BLOCK (Red - Hallucination Signature)",
    action: "Immediate halt + Fallback message or human handoff",
    risk: "Critical Risk (95% Hallucination)"
  },
  {
    quadrant: "Bottom-Right: High Attribution + Low Specificity",
    outcome: "RETRY (Amber - Vague/Hedging)",
    action: "Re-prompt with specificity booster or multi-hop retrieval",
    risk: "Medium Risk (User Frustration)"
  },
  {
    quadrant: "Bottom-Left: Low Attribution + Low Specificity",
    outcome: "BLOCK / REJECT",
    action: "Complete generation failure; abort pipeline",
    risk: "High Risk"
  }
];
