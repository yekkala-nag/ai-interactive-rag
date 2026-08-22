// ============================================================================
// THREE KINDS OF RAG CORPUS & ARCHITECTURE SELECTION ENGINE
// Enterprise Document Intelligence: Corpus Taxonomy & Metadata Table Indexing
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Text
// ============================================================================

export const FLAT_PILE_FAILURE_MODES = [
  {
    mode: "1. Vocabulary Drift",
    symptom: "User query uses different vocabulary from legal/medical source docs.",
    flatPileOutcome: "Top-k similarity retrieval completely misses target candidates.",
    fix: "Pre-filtering on metadata fields (doc_type, client_id) before vector search."
  },
  {
    mode: "2. Cross-File Bleeding",
    symptom: "Retrieved top-30 chunks span 3 unrelated contracts never meant to be read together.",
    flatPileOutcome: "LLM hallucinates a single answer synthesizing incompatible agreements.",
    fix: "Document boundary scoping & single-document context isolation."
  },
  {
    mode: "3. Multi-Document Dilution",
    symptom: "Key clause gets buried under 25 generic policy introduction passages.",
    flatPileOutcome: "Top-k chunk pool floods prompt window with irrelevant context noise.",
    fix: "Summary lines per file + hierarchical TOC routing."
  },
  {
    mode: "4. Missing-File Silence",
    symptom: "Required document (e.g. police report in claim folder) is missing entirely.",
    flatPileOutcome: "Returns empty string / 'NA', which LLM misinterprets as 'no obligation'.",
    fix: "Case file bundle validator checking expected vs actual file manifests."
  },
  {
    mode: "5. Supersession Failure",
    symptom: "System answers from an outdated 2019 master agreement instead of 2024 amendment.",
    flatPileOutcome: "Retrieves superseded clause because cosine score is identical.",
    fix: "Bitemporal validity date range filtering (valid_from <= date_of_loss <= valid_to)."
  }
];

export const CORPUS_SHAPES_TAXONOMY = [
  {
    shape: "Shape 1: Pile of Unrelated PDFs",
    characteristics: "Shared drive of unrelated reports. No universal fields across all files.",
    architecture: "Summary line per file + Hierarchical TOC routing.",
    wrongBuildCost: "Low compute prep, but 80% wasted LLM calls on irrelevant PDFs."
  },
  {
    shape: "Shape 2: Homogeneous Typed Corpus",
    characteristics: "5,000 contracts of same product, 10 years of invoices, identical structure.",
    architecture: "Structured Metadata Table Index (`doc_type = 'contract' AND client = 'X'`).",
    wrongBuildCost: "Enormous vector store compute wasted; cross-file bleeding hallucinations."
  },
  {
    shape: "Shape 3: Case File Bundles",
    characteristics: "Folder per claim/applicant holding policy + police report + invoice + photos.",
    architecture: "Bundle Assembly first, cross-file comparison & missing-file validation second.",
    wrongBuildCost: "Missing required files go undetected; cross-file contradictions missed."
  }
];

export const SAMPLE_NIST_CORPUS = [
  { id: "nist_csf", title: "NIST Cybersecurity Framework v1.1", hasDefinition: true, score: 0.95, text: "A Profile represents the alignment of the Systems & Assets..." },
  { id: "fips_199", title: "FIPS 199 Security Standards", hasDefinition: false, score: 0.12, text: "NA" },
  { id: "sp_800_207", title: "SP 800-207 Zero Trust Architecture", hasDefinition: false, score: 0.08, text: "NA" },
  { id: "ai_100_1", title: "NIST AI 100-1 Risk Management", hasDefinition: false, score: 0.05, text: "/" },
  { id: "cswp_29", title: "NIST CSWP 29 IoT Cybersecurity", hasDefinition: false, score: 0.10, text: "NA" }
];

export const RUN_CORPUS_BENCHMARK_SIMULATOR = (architecture = "naive_loop") => {
  if (architecture === "naive_loop") {
    return {
      architecture: "Naive For-Loop Baseline",
      totalDocuments: 5,
      successfulAnswers: 1,
      wastedCalls: 4,
      totalWallTimeSec: 14.3,
      perDocTimeSec: 2.86,
      wastedCallPct: 80,
      queryFilterApplied: "None (Iterates over all 5 PDFs)",
      retrievedResult: "NIST CSF v1.1 (Page 5: Definition of Profile)"
    };
  }

  // Pre-filtered metadata index
  return {
    architecture: "Metadata Table Indexing",
    totalDocuments: 5,
    successfulAnswers: 1,
    wastedCalls: 0,
    totalWallTimeSec: 2.86,
    perDocTimeSec: 2.86,
    wastedCallPct: 0,
    queryFilterApplied: "doc_type = 'framework' AND topic = 'profile_definition'",
    retrievedResult: "NIST CSF v1.1 (Page 5: Definition of Profile)"
  };
};

export const PYTHON_CORPUS_SHAPES_CODE = `# ============================================================================
# THREE KINDS OF RAG CORPUS & METADATA FILTERING (PYTHON)
# Enterprise Document Intelligence (Brick #14A Baseline & Index)
# Responsible AI & Security Certified: Zero PII / Zero Copyrighted Text
# ============================================================================

import pandas as pd
from typing import List, Dict, Any

class CorpusClassifier:
    def __init__(self, pdf_manifest: List[Dict[str, Any]]):
        self.df = pd.DataFrame(pdf_manifest)

    def classify_corpus_shape(self, has_relations: bool, has_universal_fields: bool, is_bundled: bool) -> str:
        """Determines corpus shape based on 3 diagnostic business questions."""
        if has_universal_fields and is_bundled:
            return "Shape 3: Case File Bundles (Bundle assembly first)"
        elif has_universal_fields:
            return "Shape 2: Homogeneous Typed Corpus (Structured metadata index)"
        else:
            return "Shape 1: Pile of Unrelated PDFs (Summary lines + TOC routing)"

    def query_with_metadata_filter(self, doc_type: str, client_id: str = None) -> pd.DataFrame:
        """Applies exact SQL/metadata filter before vector retrieval."""
        filtered = self.df[self.df["doc_type"] == doc_type]
        if client_id and "client_id" in filtered.columns:
            filtered = filtered[filtered["client_id"] == client_id]
        return filtered

# ── Sample Execution ────────────────────────────────────────────────────────
corpus_manifest = [
    {"doc_id": "doc_101", "doc_type": "distribution_agreement", "client_id": "retailer_x", "year": 2019},
    {"doc_id": "doc_102", "doc_type": "distribution_agreement", "client_id": "retailer_y", "year": 2021},
    {"doc_id": "doc_103", "doc_type": "invoice", "client_id": "retailer_x", "year": 2022},
    {"doc_id": "doc_104", "doc_type": "policy_certificate", "client_id": "retailer_z", "year": 2023}
]

classifier = CorpusClassifier(corpus_manifest)
shape = classifier.classify_corpus_shape(has_relations=True, has_universal_fields=True, is_bundled=False)
print(f"Detected Corpus Architecture: {shape}")

filtered_candidates = classifier.query_with_metadata_filter(doc_type="distribution_agreement", client_id="retailer_x")
print(f"\\nFiltered Candidates (Reduced 250,000 files to {len(filtered_candidates)} files before embedding):")
print(filtered_candidates[["doc_id", "doc_type", "client_id", "year"]])
`;
