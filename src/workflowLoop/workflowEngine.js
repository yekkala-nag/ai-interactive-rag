/**
 * Enterprise Document Intelligence [Vol.1 #13]
 * RAG Workflow & Loop Engineering: The Dispatcher Engine
 * 
 * Core principle: Keep orchestration logic in explicit, auditable code.
 * Dispatcher decides pattern activations upfront; Bounded Loop evaluates typed signals
 * and terminates safely via should_continue guards.
 */

export const DEFAULT_ACTIVATIONS = {
  toc_retrieval: false,
  keyword_retrieval: true,
  dense_retrieval: false,
  two_hop_references: false,
  listing_aggregation: false,
  adaptive_parsing: false,
  iterative_feedback: true,
};

/**
 * Dispatcher: Computes pattern activations based on question intent & document profile
 */
export function decidePipelinePatterns(parsedQuestion, docProfile) {
  const activations = { ...DEFAULT_ACTIVATIONS };

  // TOC retrieval: enable whenever document has a usable TOC
  if (docProfile.has_usable_toc) {
    activations.toc_retrieval = true;
  }

  // Dense retrieval (embeddings): fallback for open queries whose vocabulary may diverge
  if (['open_scoped', 'open_corpus_wide'].includes(parsedQuestion.intent)) {
    activations.dense_retrieval = true;
  }

  // Two-hop references: enable on structural hints or cross-section references
  if (parsedQuestion.retrieval?.section_hint || parsedQuestion.retrieval?.layout_hint) {
    activations.two_hop_references = true;
  }
  if (['section_retrieval', 'open_scoped'].includes(parsedQuestion.intent)) {
    activations.two_hop_references = true;
  }

  // Listing aggregation: enable when question intent is listing
  if (parsedQuestion.intent === 'listing') {
    activations.listing_aggregation = true;
  }

  // Adaptive parsing: enable if document contains scanned or degraded pages
  if (docProfile.is_likely_scanned) {
    activations.adaptive_parsing = true;
  }

  return activations;
}

/**
 * Safe query expansion preventing drift by capping keywords and preserving anchors
 */
export function expandQuerySafely(parsedQuestion, newKeywords = [], maxKeywords = 15) {
  const originals = [...(parsedQuestion.retrieval?.anchor_keywords || parsedQuestion.keywords || [])];
  const additions = newKeywords.filter(k => !originals.includes(k));
  let combined = [...originals, ...additions];

  if (combined.length > maxKeywords) {
    const keptOriginals = originals.slice(0, maxKeywords);
    const room = maxKeywords - keptOriginals.length;
    combined = room > 0 ? [...keptOriginals, ...additions.slice(-room)] : keptOriginals;
  }

  return {
    ...parsedQuestion,
    retrieval: {
      ...parsedQuestion.retrieval,
      anchor_keywords: combined,
    }
  };
}

/**
 * Decision Gate: Decides whether the iteration loop should run another pass.
 * Three reasons to stop:
 * 1. Candidates are stable (same set as last pass): nothing new will be found.
 * 2. Suggested keywords are stable: the LLM is repeating itself.
 * 3. Confidence is decreasing: loop is degrading results.
 */
export function shouldContinue(history = [], currentResult = {}, confidenceDropThreshold = 0.1) {
  if (!currentResult.needs_iteration) {
    return { shouldContinue: false, reason: "Answer is complete and verified (complete_answer_found=True)." };
  }

  if (history.length > 0) {
    const prev = history[history.length - 1];

    // 1. Candidate set stability check
    const prevCandIds = prev.candidates?.map(c => c.id || c.page).sort().join(',') || '';
    const currCandIds = currentResult.candidates?.map(c => c.id || c.page).sort().join(',') || '';
    if (prevCandIds && prevCandIds === currCandIds) {
      return { shouldContinue: false, reason: "Guard Triggered: Candidates are stable (identical passage set returned). Stopping to prevent infinite loop." };
    }

    // 2. Keyword suggestion stability check
    const prevKws = prev.suggested_keywords?.sort().join(',') || '';
    const currKws = currentResult.suggested_keywords?.sort().join(',') || '';
    if (prevKws && prevKws === currKws) {
      return { shouldContinue: false, reason: "Guard Triggered: Keyword suggestions are stable (LLM repeating same expansion). Stopping." };
    }

    // 3. Confidence drop check
    if (prev.confidence !== undefined && currentResult.confidence !== undefined) {
      if (currentResult.confidence < prev.confidence - confidenceDropThreshold) {
        return { shouldContinue: false, reason: `Guard Triggered: Confidence dropped by ${(prev.confidence - currentResult.confidence).toFixed(2)} (from ${prev.confidence} to ${currentResult.confidence}). Loop is degrading quality.` };
      }
    }
  }

  return { shouldContinue: true, reason: "Proceeding: Valid recovery action queued." };
}

// 4 Realistic Scenarios with full multi-pass execution history
export const WORKFLOW_SCENARIOS = [
  {
    id: "transformer_reg",
    title: "Transformer Regularization & Table 3 BLEU (Vaswani et al. 2017)",
    document: {
      name: "Attention Is All You Need (arXiv:1706.03762)",
      total_pages: 15,
      has_usable_toc: true,
      is_likely_scanned: false,
      bookmarks_count: 22,
    },
    question: {
      original_question: "What regularization techniques does the Transformer paper use, and where do they show the impact on BLEU?",
      keywords: ["regularization", "dropout", "label smoothing", "BLEU"],
      intent: "listing",
      retrieval: {
        main_query: "regularization techniques and their impact on BLEU",
        rewrites: ["Residual Dropout", "Attention Dropout", "Label Smoothing", "Table 3"],
        anchor_keywords: ["regularization", "dropout", "label smoothing", "Table 3"],
        section_hint: "5.4",
        layout_hint: "table",
      }
    },
    passes: [
      {
        passNumber: 1,
        stepName: "TOC Jump + Section 5.4 Listing Aggregation",
        action: "TOC retrieval navigated to Section 5.4 'Regularization' on page 7. Listing aggregation extracted 3 techniques.",
        candidates: [
          { id: "p7", page: 7, section: "5.4 Regularization", snippet: "We employ three types of regularization during training: Residual Dropout, Attention Dropout, and Label Smoothing..." },
          { id: "p8", page: 8, section: "5.4 Regularization (cont)", snippet: "Pdrop = 0.1 for residual layers. Label smoothing with epsilon_ls = 0.1..." }
        ],
        draftAnswer: "The Transformer paper uses 3 regularization techniques: (1) Residual Dropout (Pdrop = 0.1), (2) Embedding Dropout, and (3) Label Smoothing (eps = 0.1). Results on BLEU are reported in Table 3.",
        feedback: {
          complete_answer_found: false,
          needs_iteration: true,
          confidence: 0.68,
          pending_references: ["Table 3"],
          context_structured: true,
          trigger: "pending_references",
          recovery_action: "Queue two-hop retrieval to fetch Table 3 from page 9"
        }
      },
      {
        passNumber: 2,
        stepName: "Two-Hop Reference Resolution (Table 3 on Page 9)",
        action: "Followed pending reference 'Table 3' to page 9 and merged quantitative ablation data into context.",
        candidates: [
          { id: "p7", page: 7, section: "5.4 Regularization", snippet: "We employ three types of regularization during training..." },
          { id: "p8", page: 8, section: "5.4 Regularization (cont)", snippet: "Pdrop = 0.1 for residual layers..." },
          { id: "p9", page: 9, section: "Table 3 Variations on Transformer", snippet: "Table 3: (A) Base model 27.3 BLEU. (B) Dropout 0.1: 27.3 BLEU vs Dropout 0.2: 26.5 BLEU. (C) Label smoothing eps=0.1: 27.3 BLEU (+0.4 BLEU gain over 0.0)." }
        ],
        draftAnswer: "The Transformer uses three regularization techniques: (1) Residual Dropout (Pdrop = 0.1), (2) Sub-layer Embedding Dropout, and (3) Label Smoothing (eps = 0.1). In Table 3 (page 9), label smoothing hurts perplexity as the model learns to be more unsure, but improves BLEU accuracy from 26.9 to 27.3 (+0.4 BLEU).",
        feedback: {
          complete_answer_found: true,
          needs_iteration: false,
          confidence: 0.96,
          pending_references: [],
          context_structured: true,
          trigger: "none",
          recovery_action: "Termination: All criteria satisfied."
        }
      }
    ]
  },
  {
    id: "nist_csf",
    title: "NIST CSF 2.0 Governance & Supply Chain Risk",
    document: {
      name: "NIST Cybersecurity Framework 2.0 (NIST.CSWP.29)",
      total_pages: 32,
      has_usable_toc: true,
      is_likely_scanned: false,
      bookmarks_count: 48,
    },
    question: {
      original_question: "What are all the Categories under GOVERN, and which one covers supply chain risk?",
      keywords: ["GOVERN", "categories", "supply chain", "risk management"],
      intent: "listing",
      retrieval: {
        main_query: "GOVERN function categories and Cybersecurity Supply Chain Risk Management",
        rewrites: ["GV.OC", "GV.RM", "GV.RR", "GV.PO", "GV.OV", "GV.SC"],
        anchor_keywords: ["GOVERN", "GV.SC", "supply chain"],
        section_hint: "Table 1 Core",
        layout_hint: "table",
      }
    },
    passes: [
      {
        passNumber: 1,
        stepName: "TOC Jump to Table 1 Core + Listing Aggregation",
        action: "Jumped to Table 1 (page 14) and extracted 6 GOVERN categories: Organizational Context (GV.OC), Risk Management Strategy (GV.RM), Roles & Responsibilities (GV.RR), Policy (GV.PO), Oversight (GV.OV), and Supply Chain (GV.SC).",
        candidates: [
          { id: "p14", page: 14, section: "Core Table 1 - GOVERN", snippet: "GV.OC, GV.RM, GV.RR, GV.PO, GV.OV, GV.SC: Cybersecurity Supply Chain Risk Management." }
        ],
        draftAnswer: "There are 6 Categories under GOVERN: GV.OC, GV.RM, GV.RR, GV.PO, GV.OV, and GV.SC. GV.SC covers Cybersecurity Supply Chain Risk Management.",
        feedback: {
          complete_answer_found: false,
          needs_iteration: true,
          confidence: 0.75,
          suggested_keywords: ["GV.SC subcategories", "third-party risk", "supplier assessment"],
          context_structured: true,
          trigger: "vocabulary_gap",
          recovery_action: "Re-retrieve to pull specific Subcategory outcomes under GV.SC"
        }
      },
      {
        passNumber: 2,
        stepName: "Subcategory Deep-Dive on GV.SC (Page 18)",
        action: "Expanded retrieval with 'supplier assessment' and retrieved detailed outcomes GV.SC-01 through GV.SC-10 on page 18.",
        candidates: [
          { id: "p14", page: 14, section: "Core Table 1 - GOVERN", snippet: "GV.SC: Cybersecurity Supply Chain Risk Management summary." },
          { id: "p18", page: 18, section: "GV.SC Subcategories", snippet: "GV.SC-01: C-SCRM program established; GV.SC-04: Suppliers known and prioritized; GV.SC-06: Due diligence conducted before entering contracts." }
        ],
        draftAnswer: "The GOVERN (GV) function contains 6 Categories: Organizational Context (GV.OC), Risk Management Strategy (GV.RM), Roles & Responsibilities (GV.RR), Policy (GV.PO), Oversight (GV.OV), and Cybersecurity Supply Chain Risk Management (GV.SC). GV.SC covers supply chain risk across 10 specific subcategories (GV.SC-01 to GV.SC-10), requiring formal supplier prioritization, contract due diligence, and risk monitoring.",
        feedback: {
          complete_answer_found: true,
          needs_iteration: false,
          confidence: 0.98,
          pending_references: [],
          context_structured: true,
          trigger: "none",
          recovery_action: "Termination: Complete verified answer synthesized."
        }
      }
    ]
  },
  {
    id: "lease_scanned_ocr",
    title: "Commercial Lease Agreement - Scanned Annex Repair",
    document: {
      name: "Commercial Lease & Restoration Agreement #CL-4091",
      total_pages: 18,
      has_usable_toc: false,
      is_likely_scanned: true,
      bookmarks_count: 0,
    },
    question: {
      original_question: "What are the tenant's restoration obligations upon handover, including Schedule B?",
      keywords: ["restoration", "handover", "tenant obligations", "Schedule B"],
      intent: "section_retrieval",
      retrieval: {
        main_query: "tenant restoration obligations at lease expiration Schedule B",
        rewrites: ["wear and tear", "Schedule B fit-out removal", "original condition"],
        anchor_keywords: ["restoration", "Schedule B", "handover"],
        section_hint: "Clause 14",
        layout_hint: "scanned_annex",
      }
    },
    passes: [
      {
        passNumber: 1,
        stepName: "Native Text Scan - Clause 14 Discovery",
        action: "Retrieved Clause 14 on page 5. Clause references 'Schedule B - Detailed Fit-Out Specifications' on scanned page 16.",
        candidates: [
          { id: "p5", page: 5, section: "Clause 14 Surrender & Restoration", snippet: "Tenant shall yield up premises in good tenantable repair, ordinary wear excepted, and remove all items in Schedule B..." },
          { id: "p16", page: 16, section: "Schedule B [Scanned Image]", snippet: "[OCR unreadable noise: ~~~~~~ ~~~ @#$ !! tenant fitout]" }
        ],
        draftAnswer: "Under Clause 14, the tenant must restore premises to good condition (wear excepted) and remove fit-outs per Schedule B, but Schedule B text is unreadable.",
        feedback: {
          complete_answer_found: false,
          needs_iteration: true,
          confidence: 0.42,
          context_structured: false,
          flagged_pages: [16],
          trigger: "unstructured_context",
          recovery_action: "Adaptive Parsing: Trigger high-resolution vision OCR cascade on page 16"
        }
      },
      {
        passNumber: 2,
        stepName: "Adaptive Vision OCR on Scanned Page 16",
        action: "Ran high-resolution Vision LLM parsing specifically on page 16, restoring tabular inventory of partition walls and cabling.",
        candidates: [
          { id: "p5", page: 5, section: "Clause 14 Surrender & Restoration", snippet: "Tenant shall yield up premises in good tenantable repair..." },
          { id: "p16_repaired", page: 16, section: "Schedule B (Vision OCR Repaired)", snippet: "Item 1: Demolish demountable acoustic partitions. Item 2: Remove raised floor Cat-6 cabling. Item 3: Repaint walls in RAL 9010 neutral white." }
        ],
        draftAnswer: "Under Clause 14 and Schedule B (page 16), the tenant must: (1) Demolish demountable acoustic partitions, (2) Remove all raised floor Cat-6 cabling, (3) Repaint interior walls in RAL 9010 neutral white, and (4) Restore perimeter flooring to base building condition.",
        feedback: {
          complete_answer_found: true,
          needs_iteration: false,
          confidence: 0.94,
          pending_references: [],
          context_structured: true,
          trigger: "none",
          recovery_action: "Termination: Successfully resolved via adaptive parsing cascade."
        }
      }
    ]
  },
  {
    id: "early_guardrail",
    title: "Safety Guardrail: Candidate Stability Early Exit",
    document: {
      name: "Master Services Agreement (Acme Corp)",
      total_pages: 12,
      has_usable_toc: false,
      is_likely_scanned: false,
      bookmarks_count: 0,
    },
    question: {
      original_question: "What is the penalty for early termination in year 10?",
      keywords: ["penalty", "early termination", "year 10"],
      intent: "open_scoped",
      retrieval: {
        main_query: "early termination penalty in year 10",
        rewrites: ["termination for convenience year 10", "liquidated damages"],
        anchor_keywords: ["penalty", "termination", "year 10"],
      }
    },
    passes: [
      {
        passNumber: 1,
        stepName: "Initial Keyword Pass - Clause 8 Termination",
        action: "Retrieved Clause 8 on page 4 regarding 3-year initial term and mutual 30-day notice. No mention of year 10.",
        candidates: [
          { id: "p4", page: 4, section: "Clause 8 Term and Termination", snippet: "The initial term is 3 years. Either party may terminate with 30 days notice after initial term without penalty." }
        ],
        draftAnswer: "The agreement specifies a 3-year initial term with 30-day notice, with no penalties mentioned for subsequent years.",
        feedback: {
          complete_answer_found: false,
          needs_iteration: true,
          confidence: 0.50,
          suggested_keywords: ["liquidated damages", "long-term extension", "decade"],
          context_structured: true,
          trigger: "vocabulary_gap",
          recovery_action: "Attempt query rewrite with expanded vocabulary"
        }
      },
      {
        passNumber: 2,
        stepName: "Pass 2 with Expanded Keywords (Returns Identical Candidates)",
        action: "Executed expanded search. Vector index and BM25 returned identical passage set (Page 4 Clause 8). Candidate set is STABLE.",
        candidates: [
          { id: "p4", page: 4, section: "Clause 8 Term and Termination", snippet: "The initial term is 3 years. Either party may terminate with 30 days notice after initial term without penalty." }
        ],
        draftAnswer: "The agreement does not define a 10-year term. Under Clause 8.2 (page 4), any termination occurring after the initial 3-year commitment requires only 30 days written notice with zero penalty fees.",
        feedback: {
          complete_answer_found: false,
          needs_iteration: true,
          confidence: 0.52,
          suggested_keywords: ["liquidated damages", "long-term extension", "decade"],
          context_structured: true,
          trigger: "stable_candidates",
          recovery_action: "GUARD TERMINATION: should_continue cut the loop because candidate passages did not change."
        }
      }
    ]
  }
];
