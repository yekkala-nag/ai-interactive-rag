// ============================================================================
// ROW-LEVEL TABLE CHUNKS FOR RAG ENGINE
// Enterprise Document Intelligence: Dual-Scale Tabular Retrieval
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Materials
// ============================================================================

export const RETRIEVAL_MISMATCH_CONCEPTS = [
  {
    concept: "Whole-Table Chunking (Single Rectangle)",
    retrievalUnit: "Entire Bounded Table Rectangle (e.g. 40 Rows, 1,200 Tokens)",
    problem: "Forces the LLM generation model to perform filtering that the retriever should have done, injecting 39 irrelevant rows into context.",
    bestFor: "Overview queries asking for broad table summaries ('Which events are covered?')."
  },
  {
    concept: "Row-Level Chunking (Targeted Semantic Sentence)",
    retrievalUnit: "Individual Body Row paired with Column Headers (e.g. 1 Row, 45 Tokens)",
    problem: "None for targeted lookup queries; reads like a standalone semantic sentence ('Event: Theft | Cap: $50,000').",
    bestFor: "Specific field lookup queries ('What is the cap for vehicle theft?')."
  },
  {
    concept: "Dual-Scale Retrieval & Dispatcher",
    retrievalUnit: "Parallel Dual Index (`line_df` for geometry + `row_df` for row-level chunks)",
    problem: "Solves both query types without choosing one scale over another.",
    bestFor: "Production Enterprise RAG systems handling mixed document corpora."
  }
];

export const MARKDOWN_PIPE_PARSER_RULES = [
  { rule: "Rule 1: Pipe Boundaries", detail: "A valid table row starts and ends with '|', containing at least one interior pipe." },
  { rule: "Rule 2: Separator Line", detail: "A separator row containing dashes and colons ('| --- | --- |') marks the split between header and body." },
  { rule: "Rule 3: Contiguous Lines", detail: "Consecutive pipe rows on the same page (or across an immediate page break) belong to the same table." },
  { rule: "Rule 4: Reset Condition", detail: "Any non-pipe line breaks the table run and resets the table parser state." }
];

export const SAMPLE_INSURANCE_TABLE_ROWS = [
  { id: "row_1", event: "Collision & Comprehensive", cap: "$100,000", deductible: "$500", eligibility: "Primary Active Vehicle" },
  { id: "row_2", event: "Vehicle Theft & Vandalism", cap: "$50,000", deductible: "$250", eligibility: "Police Report Required within 24h" },
  { id: "row_3", event: "Third-Party Property Liability", cap: "$500,000", deductible: "$0", eligibility: "Standard Fleet Policy" },
  { id: "row_4", event: "Roadside Emergency Towing", cap: "$1,500", deductible: "$0", eligibility: "Unlimited Coverage within 100 miles" },
  { id: "row_5", event: "Windshield & Glass Damage", cap: "$2,500", deductible: "$50", eligibility: "Certified Auto Glass Network" }
];

export const RUN_DUAL_INDEX_RETRIEVAL_SIMULATOR = (searchQuery = "vehicle theft cap", mode = "row_level") => {
  const headers = ["Covered Event", "Coverage Cap", "Deductible", "Eligibility Condition"];

  if (mode === "whole_table") {
    const fullTableText = SAMPLE_INSURANCE_TABLE_ROWS.map(r =>
      `| ${r.event} | ${r.cap} | ${r.deductible} | ${r.eligibility} |`
    ).join("\n");

    return {
      mode: "Whole-Table Chunking",
      retrievedChunksCount: 1,
      totalTokens: 480,
      contextNoisePct: 80,
      retrievedContext: `| ${headers.join(" | ")} |\n| --- | --- | --- | --- |\n${fullTableText}`,
      matchedRowId: "Whole Table (5 rows)",
      relevanceScore: 0.65
    };
  }

  // Row-level chunking
  const queryLower = searchQuery.toLowerCase();
  const matchedRow = SAMPLE_INSURANCE_TABLE_ROWS.find(r =>
    r.event.toLowerCase().includes("theft") || r.event.toLowerCase().includes(queryLower)
  ) || SAMPLE_INSURANCE_TABLE_ROWS[1];

  const serializedRow = `Covered Event: ${matchedRow.event} | Coverage Cap: ${matchedRow.cap} | Deductible: ${matchedRow.deductible} | Eligibility Condition: ${matchedRow.eligibility}`;

  return {
    mode: "Row-Level Chunking",
    retrievedChunksCount: 1,
    totalTokens: 42,
    contextNoisePct: 0,
    retrievedContext: serializedRow,
    matchedRowId: matchedRow.id,
    relevanceScore: 0.98
  };
};

export const PYTHON_ROW_LEVEL_RAG_CODE = `# ============================================================================
# ROW-LEVEL TABLE SERIALIZATION & DUAL-INDEX RETRIEVAL (PYTHON)
# Enterprise Document Intelligence (Brick 7sexies Companion)
# Responsible AI & Security Certified: Zero PII / Zero Copyrighted Text
# ============================================================================

import pandas as pd
from typing import List, Dict, Any

def group_contiguous_pipe_rows(lines_df: pd.DataFrame) -> List[pd.DataFrame]:
    """Detects contiguous markdown pipe lines representing tables."""
    table_groups = []
    current_group = []
    
    for idx, row in lines_df.iterrows():
        text = str(row.get("text", "")).strip()
        # Rule 1: Starts and ends with pipe
        if text.startswith("|") and text.endswith("|") and text.count("|") >= 3:
            current_group.append(row)
        else:
            if current_group:
                table_groups.append(pd.DataFrame(current_group))
                current_group = []
    if current_group:
        table_groups.append(pd.DataFrame(current_group))
    return table_groups

def serialize_table_rows(line_df: pd.DataFrame) -> pd.DataFrame:
    """Serializes each body row of every table into a retrievable chunk."""
    tables = group_contiguous_pipe_rows(line_df)
    out = []
    
    for tid, table in enumerate(tables, start=1):
        lines = table["text"].tolist()
        if len(lines) < 3:
            continue  # Must have header, separator, and at least 1 body row
            
        # Extract headers from row above separator
        headers = [c.strip() for c in lines[0].split("|")[1:-1]]
        body_lines = lines[2:]  # Skip header and separator | --- | --- |
        
        for row_idx, line in enumerate(body_lines):
            cells = [c.strip() for c in line.split("|")[1:-1]]
            # Pair headers with values: 'Header: Value | Header2: Value2'
            serialized_row = " | ".join(f"{h}: {c}" for h, c in zip(headers, cells))
            
            out.append({
                "table_id": f"table_{tid}",
                "row_index": row_idx + 1,
                "column_headers": headers,
                "row_cells": cells,
                "row_serialized": serialized_row
            })
            
    return pd.DataFrame(out)

# ── Sample Execution Pipeline ──────────────────────────────────────────────
sample_data = {
    "page_num": [1, 1, 1, 1],
    "line_num": [10, 11, 12, 13],
    "text": [
        "| Event | Cap | Deductible |",
        "| --- | --- | --- |",
        "| Theft | $50,000 | $250 |",
        "| Liability | $500,000 | $0 |"
    ]
}

df_lines = pd.DataFrame(sample_data)
df_rows = serialize_table_rows(df_lines)

print("Generated Row-Level Retrievable Chunks:\\n")
for idx, row in df_rows.iterrows():
    print(f"Chunk {row['row_index']}: {row['row_serialized']}")
`;
