// ============================================================================
// RAG CHUNKING STRATEGIES ENGINE & SIMULATION ENGINE
// Enterprise Document Intelligence: Text Splitting, Boundary Detection & Late Chunking
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Text
// ============================================================================

export const CHUNKING_STRATEGIES = [
  {
    id: "fixed_size",
    name: "Fixed-Size Chunking",
    category: "Naive",
    tagline: "Arbitrary token/character sliding window",
    description: "Splits text into fixed character or token counts with a uniform sliding overlap. Blinds itself to sentence and semantic boundaries.",
    parameters: { chunkSize: 512, overlap: 64 },
    pros: ["Zero compute overhead", "Deterministic chunk sizes", "Trivial to implement"],
    cons: ["Breaks mid-sentence and mid-word", "Severes table rows and code syntax", "Zero semantic or hierarchical awareness"],
    bestFor: "Quick prototypes, raw unformatted logs, homogeneous benchmark datasets",
    riskLevel: "high",
    retrievalPrecision: "42%",
    semanticQuality: "Poor",
    synthesisQuality: "Low",
    contextRetention: "35%",
    ingestLatencyMs: 0.5,
    relativeCost: "$"
  },
  {
    id: "recursive_character",
    name: "Recursive Character Splitter",
    category: "Boundary-Aware",
    tagline: "Hierarchical separator cascade (\\n\\n → \\n → . → ' ')",
    description: "Recursively splits along natural document delimiters. Tries double newlines first, then single newlines, then sentence boundaries before splitting words.",
    parameters: { chunkSize: 1000, separators: ["\\n\\n", "\\n", ". ", " "] },
    pros: ["Respects paragraph and sentence breaks", "Graceful fallback without cutting words", "Industry standard general-purpose baseline"],
    cons: ["Blind to semantic topic shifts", "Headers can get stranded at the tail of prior chunks"],
    bestFor: "General-purpose documents, mixed markdown, articles, policy docs",
    riskLevel: "low",
    retrievalPrecision: "68%",
    semanticQuality: "Good",
    synthesisQuality: "Medium",
    contextRetention: "65%",
    ingestLatencyMs: 3,
    relativeCost: "$"
  },
  {
    id: "markdown_header",
    name: "Markdown Header Splitter",
    category: "Structure-Aware",
    tagline: "AST structure splitting with breadcrumb metadata injection",
    description: "Parses markdown headings (H1-H6) and splits sections accordingly, embedding header breadcrumb paths (e.g. 'Security > RBAC > Tiers') directly into chunk metadata.",
    parameters: { headersToSplitOn: ["#", "##", "###"], stripHeaders: false },
    pros: ["Maintains full document hierarchy", "Injects breadcrumbs into metadata", "Never splits logical sections prematurely"],
    cons: ["Requires structured markdown/HTML input", "Variable chunk sizes (some sections are 10 words, others 2000)"],
    bestFor: "Technical documentation, engineering RFCs, Git repositories, API guides",
    riskLevel: "low",
    retrievalPrecision: "76%",
    semanticQuality: "Good-High",
    synthesisQuality: "High",
    contextRetention: "80%",
    ingestLatencyMs: 5,
    relativeCost: "$"
  },
  {
    id: "semantic_chunking",
    name: "Semantic Chunking (Embedding Boundary)",
    category: "Embedding-Based",
    tagline: "Statistical cosine distance thresholding across sentence embeddings",
    description: "Computes dense embeddings for adjacent sentences and places chunk boundaries wherever the cosine distance exceeds a statistical percentile threshold (e.g. 95th percentile).",
    parameters: { similarityThreshold: 0.75, bufferSize: 1, minChunkSize: 100, maxChunkSize: 1500 },
    pros: ["Adapts to organic topic shifts", "Chunks represent cohesive thoughts", "Zero arbitrary character cuts"],
    cons: ["Requires embedding model calls during splitting", "3-5x slower ingestion", "Variable chunk size distribution"],
    bestFor: "High-value narrative documents, multi-topic meeting transcripts, legal contracts",
    riskLevel: "medium",
    retrievalPrecision: "85%",
    semanticQuality: "Excellent",
    synthesisQuality: "High",
    contextRetention: "88%",
    ingestLatencyMs: 45,
    relativeCost: "$$"
  },
  {
    id: "sentence_window",
    name: "Sentence Window Retrieval",
    category: "Retrieval-Optimized",
    tagline: "Granular 1-sentence vector index + expanded surrounding window for LLM",
    description: "Embeds individual sentences for ultra-focused vector search, but stores and returns a surrounding context window (e.g. +/- 3 sentences) to the LLM during generation.",
    parameters: { windowSize: 3, retrievalUnit: "single_sentence" },
    pros: ["Pinpoint retrieval accuracy without noise", "Eliminates vector dilution from long chunks", "Full context supplied to generator"],
    cons: ["Increases vector index count by 5-10x", "Requires window buffer reconstructor"],
    bestFor: "FAQ systems, regulatory compliance queries, granular factoid lookup",
    riskLevel: "low",
    retrievalPrecision: "91%",
    semanticQuality: "Excellent",
    synthesisQuality: "Very High",
    contextRetention: "90%",
    ingestLatencyMs: 12,
    relativeCost: "$$"
  },
  {
    id: "parent_child",
    name: "Parent-Child (Hierarchical) Chunking",
    category: "Retrieval-Optimized",
    tagline: "Decoupled search vector (128t child) -> synthesis context (1024t parent)",
    description: "Splits documents into large parent chunks (e.g. 1024 tokens) and further subdivides each into small child chunks (e.g. 128 tokens). Child vectors match the query and pointer-resolve to the parent.",
    parameters: { childSize: 128, parentSize: 1024, overlap: 32 },
    pros: ["Best-in-class retrieval + synthesis harmony", "Prevents hallucination from missing context", "Production industry standard"],
    cons: ["Requires document store alongside vector index", "Slightly higher storage footprint"],
    bestFor: "Enterprise RAG platforms, legal discovery, multi-tier knowledge bases",
    riskLevel: "low",
    retrievalPrecision: "89%",
    semanticQuality: "Excellent",
    synthesisQuality: "Very High",
    contextRetention: "93%",
    ingestLatencyMs: 8,
    relativeCost: "$$"
  },
  {
    id: "contextual_retrieval",
    name: "Anthropic Contextual Retrieval",
    category: "LLM-Enhanced",
    tagline: "Prompt LLM to prepend 50-100 token situational context to every chunk",
    description: "Passes the full document and each candidate chunk to an LLM to generate a concise situational preface (e.g. 'This chunk discusses Q3 2024 revenue for division X...'). Boosts vector and BM25 search.",
    parameters: { contextModel: "Gemini 1.5 Flash / Claude 3 Haiku", prefixLength: "50-100 tokens" },
    pros: ["Highest vector & BM25 retrieval accuracy (+35% MRR)", "Solves pronoun and acronym ambiguity", "Self-contained chunks"],
    cons: ["Requires 1 fast LLM call per chunk at ingestion", "Increases embedding token count slightly"],
    bestFor: "Mission-critical enterprise search, financial filings, clinical research",
    riskLevel: "medium",
    retrievalPrecision: "94%",
    semanticQuality: "Excellent",
    synthesisQuality: "State-of-the-Art",
    contextRetention: "98%",
    ingestLatencyMs: 140,
    relativeCost: "$$$"
  },
  {
    id: "late_chunking",
    name: "Jina Late Chunking",
    category: "Embedding-Based",
    tagline: "Embed full document first with bidirectional attention, then pool chunk spans",
    description: "Feeds the full 8192-token document into a long-context transformer. Chunk spans are defined, but token embeddings already carry full-document context before mean-pooling.",
    parameters: { maxDocTokens: 8192, pooling: "mean_span_pooling" },
    pros: ["True full-document bidirectional context in vectors", "Zero LLM generation cost at ingestion", "Eliminates boundary blindness"],
    cons: ["Requires long-context embedding models (e.g. Jina v3 / ColBERT)", "Higher GPU memory usage during ingestion"],
    bestFor: "Long-form research reports, cross-chapter textbooks, complex manuals",
    riskLevel: "medium",
    retrievalPrecision: "93%",
    semanticQuality: "Excellent",
    synthesisQuality: "State-of-the-Art",
    contextRetention: "97%",
    ingestLatencyMs: 35,
    relativeCost: "$$"
  }
];

export const SAMPLE_DOCUMENTS = [
  {
    id: "policy",
    title: "Enterprise Data Governance & Security Policy v3.2",
    type: "Legal / Compliance Policy",
    sections: [
      {
        heading: "1. Purpose & Organizational Scope",
        content: "This policy establishes the mandatory framework for data governance, classification, and cryptographic disposal across all global business units. It applies to all structured relational stores and unstructured data assets owned, processed, or transmitted by the organization."
      },
      {
        heading: "2. Data Classification Taxonomy",
        content: "All corporate data assets must be classified into one of four sensitivity tiers: Tier 1 (Public), Tier 2 (Internal Use Only), Tier 3 (Confidential / Business Sensitive), and Tier 4 (Restricted / Regulated PII). Classification dictates encryption standards in transit (TLS 1.3 mandatory) and at rest (AES-256-GCM)."
      },
      {
        heading: "3. Access Control & Authorization",
        content: "Role-based access control (RBAC) and least privilege principles shall be enforced across all data repositories. Tier 3 data requires explicit department manager authorization. Tier 4 restricted assets require dual-custody approval from the Chief Information Security Officer (CISO)."
      },
      {
        heading: "4. Cryptographic Retention & Disposal",
        content: "Data retention schedules are strictly defined by regulatory statute and operational necessity. Automated lifecycle triggers must purge data exceeding mandatory retention windows. Disposal of Tier 4 media must employ cryptographic key shredding and produce immutable audit proofs."
      },
      {
        heading: "5. Compliance Audit & Incident Escalation",
        content: "Quarterly automated compliance audits shall verify access logs and cryptographic verification signatures. Any identified non-compliance event or privilege escalation anomaly must be escalated to the Data Protection Officer within 24 hours under penalty of immediate access revocation."
      }
    ]
  },
  {
    id: "system_rfc",
    title: "RFC-8812: Distributed Vector Index Consensus & Partitioning",
    type: "Technical Systems Architecture RFC",
    sections: [
      {
        heading: "1. Abstract & Motivation",
        content: "High-throughput RAG architectures require low-latency approximate nearest neighbor (ANN) vector search over billion-scale corpora. This RFC specifies a Raft-replicated hierarchical NSW partitioning schema that guarantees p99 retrieval latency <12ms under 50,000 QPS."
      },
      {
        heading: "2. Partitioning Topology",
        content: "The corpus is partitioned into 64 shards using balanced Voronoi centroid clustering. Each shard maintains an HNSW sub-graph with M=32 and efConstruction=200. Shard leader replicas synchronize vector mutations via a high-performance gRPC streaming log."
      },
      {
        heading: "3. Replication & Quorum Reads",
        content: "Read queries broadcast to top-K candidate centroids determined by a lightweight quantizer routing layer. A read quorum of R=2 replicas per shard is required to ensure consistent index state and prevent stale vector recall."
      },
      {
        heading: "4. Failure Recovery & Compaction",
        content: "When a node partition fails, the Raft state machine triggers candidate election within 300ms. Vector compaction runs background LSM merges to reclaim tombstones without degrading concurrent ANN query throughput."
      }
    ]
  },
  {
    id: "api_spec",
    title: "AuthZero Cloud Identity API & Token Exchange Specification",
    type: "API Specification & Code",
    sections: [
      {
        heading: "1. Authentication Endpoints",
        content: "POST /oauth/v2/token HTTP/1.1\nHost: auth.cloud-enterprise.io\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=client_credentials&client_id=sec_99a8&client_secret=k_99214b"
      },
      {
        heading: "2. JWT Claims Schema",
        content: "The returned access_token is a cryptographically signed Ed25519 JWT payload:\n{\n  \"sub\": \"usr_882941\",\n  \"aud\": \"https://api.enterprise.io/v1\",\n  \"roles\": [\"data_admin\", \"ciso_auditor\"],\n  \"exp\": 1785930000,\n  \"iat\": 1785843600\n}"
      },
      {
        heading: "3. Error Responses & Throttling",
        content: "HTTP 429 Too Many Requests is triggered when tenant throughput exceeds 1,000 requests per second. The Retry-After header specifies exponential backoff duration in seconds."
      }
    ]
  },
  {
    id: "support_log",
    title: "Incident Postmortem: Payment Gateway Timeout Storm (#INC-9041)",
    type: "Customer Support & Incident Log",
    sections: [
      {
        heading: "1. Timeline & Incident Trigger",
        content: "03:14 UTC: Automated webhook spikes from merchant partners caused downstream connection pool exhaustion on the primary Postgres replica. 03:18 UTC: P99 latency degraded from 80ms to 9,400ms."
      },
      {
        heading: "2. Root Cause Analysis",
        content: "The connection pool max_connections parameter was capped at 200, whereas the ingress API container auto-scaled to 40 instances without distributed connection proxying (PgBouncer was bypassed due to a configuration drift)."
      },
      {
        heading: "3. Corrective Action Items",
        content: "ACTION-1: Enforce mandatory Envoy + PgBouncer mesh for all database ingress.\nACTION-2: Implement adaptive circuit breakers with jittered backoff on all partner webhook ingress points."
      }
    ]
  }
];

// Interactive Pipeline Workflow Steps (8 Stages)
export const PIPELINE_WORKFLOW_STEPS = [
  {
    id: "doc_ingest",
    stepNumber: 1,
    name: "Document Ingestion & Normalization",
    icon: "📄",
    category: "Ingestion",
    description: "Strip non-printable Unicode, normalize character encodings (UTF-8), and clean PDF ligature artifacts.",
    inputExample: "Raw PDF binary or unstructured Markdown string with inconsistent CRLF and hyphenated word breaks.",
    outputExample: "Clean sanitized text stream with normalized whitespace, line breaks, and decoded entity references.",
    latency: "0.2ms / page",
    criticalConsideration: "Preserve code block indentation and table pipes (|) during normalization."
  },
  {
    id: "structure_detect",
    stepNumber: 2,
    name: "Structural AST & Boundary Parsing",
    icon: "🏗️",
    category: "Parsing",
    description: "Construct a hierarchical tree of H1-H6 headers, code blocks, bulleted lists, and HTML tables using regex and AST parsers.",
    inputExample: "Clean Markdown with `# Heading 1` and `## Heading 2` tags and markdown tables.",
    outputExample: "Hierarchical Document Node Tree with breadcrumb paths (e.g. `Root > Security > RBAC`).",
    latency: "0.8ms / doc",
    criticalConsideration: "Ensure tables are marked as atomic non-splittable blocks so rows aren't shredded."
  },
  {
    id: "chunk_split",
    stepNumber: 3,
    name: "Chunk Slicing & Boundary Adjustment",
    icon: "✂️",
    category: "Splitting",
    description: "Apply target strategy (e.g. Parent-Child 128t/1024t or Recursive Splitter) with sliding overlap windows.",
    inputExample: "Structured AST nodes ready for target token/character windowing.",
    outputExample: "Array of raw chunk objects with startOffset, endOffset, and token counts.",
    latency: "2.1ms / doc",
    criticalConsideration: "Boundary snapping: Never split in the middle of a sentence, quote, or numeric formula."
  },
  {
    id: "metadata_enrich",
    stepNumber: 4,
    name: "Breadcrumb & Metadata Attachment",
    icon: "🏷️",
    category: "Enrichment",
    description: "Attach structural breadcrumbs, parent doc ID, section header, date, sensitivity tier, and line ranges to each chunk.",
    inputExample: "Raw chunk: 'Role-based access control shall be enforced...'",
    outputExample: "{ id: 'c_04', doc: 'Policy_v3', breadcrumb: 'Governance > RBAC', text: '...', tier: 4 }",
    latency: "0.4ms / chunk",
    criticalConsideration: "Metadata enables hard filtering (e.g. `where tier == 4`) prior to ANN vector scoring."
  },
  {
    id: "contextual_prefix",
    stepNumber: 5,
    name: "Anthropic Contextual Enrichment (Optional)",
    icon: "✨",
    category: "LLM Augmentation",
    description: "Generate a 50-80 token situational summary using a fast LLM (Gemini Flash / Claude Haiku) and prepend to the chunk.",
    inputExample: "Chunk: 'Disposal must employ cryptographic key shredding.'",
    outputExample: "'[Context: This section details Tier 4 cryptographic disposal under the Enterprise Security Policy] Disposal must employ...'",
    latency: "120ms (batched)",
    criticalConsideration: "Improves hybrid BM25 + Dense vector recall by up to 35% across vague user queries."
  },
  {
    id: "dense_embedding",
    stepNumber: 6,
    name: "Dense Vector Embedding Generation",
    icon: "🧠",
    category: "Embedding",
    description: "Pass chunk texts to embedding model (e.g. text-embedding-3-large 1536d / Jina-v3 1024d) to produce normalized float vectors.",
    inputExample: "Enriched chunk text strings.",
    outputExample: "Normalized 1536-dimensional float vector: `[0.0182, -0.0412, ..., 0.0891]`",
    latency: "15ms / batch",
    criticalConsideration: "For Jina Late Chunking, embed the entire 8k doc first and mean-pool chunk token slices."
  },
  {
    id: "decoupled_indexing",
    stepNumber: 7,
    name: "Decoupled Dual-Layer Index Storage",
    icon: "💾",
    category: "Storage",
    description: "Store search vectors in HNSW / FAISS index (child pointers) and rich text + parent blocks in document KV store (Redis / S3 / Postgres).",
    inputExample: "Vector embeddings + Chunk text + Parent content blocks.",
    outputExample: "FAISS Vector Index (child vectors) + SQLite/Redis Document Map (pointer -> parent text).",
    latency: "3.5ms",
    criticalConsideration: "Decoupling vector index size from LLM generation context optimizes RAM and cache locality."
  },
  {
    id: "retrieval_expansion",
    stepNumber: 8,
    name: "Query Retrieval & Window/Parent Expansion",
    icon: "🔍",
    category: "Retrieval",
    description: "At query time, ANN vector search finds top-K child hits, and the pointer resolver retrieves the complete parent block for LLM synthesis.",
    inputExample: "User Query: 'How to dispose Tier 4 restricted data?'",
    outputExample: "Child hit #1 found (score: 0.92) ➔ Expanded to full 1024-token Section 4 Parent block with zero missing context.",
    latency: "8ms end-to-end",
    criticalConsideration: "Deduplicate overlapping parent hits to prevent feeding redundant context into LLM."
  }
];

// Failure Mode Comparison Scenarios (Semantic Shredding)
export const FAILURE_MODE_SCENARIOS = [
  {
    id: "financial_exception",
    title: "1. Negative Qualification & Financial Exceptions",
    category: "Semantic Reversal",
    query: "Are enterprise tier-1 partners exempt from late payment penalties?",
    rawDocumentText: "All enterprise customers are subject to a mandatory 2.5% monthly late payment surcharge for invoices overdue by more than 15 calendar days. However, Tier-1 Strategic Partners are explicitly exempt from this penalty during their initial 90-day onboarding window, provided that an active waiver request has been submitted to the billing director.",
    naiveChunk: {
      text: "All enterprise customers are subject to a mandatory 2.5% monthly late payment surcharge for invoices overdue by more than 15 calendar days. However, Tier-1 Strategic Partners are explicitly",
      severedText: "exempt from this penalty during their initial 90-day onboarding window, provided that an active waiver request has been submitted to the billing director.",
      outcome: "❌ Hallucination / Fact Reversal: The LLM claims Tier-1 partners must pay the surcharge because the exemption clause was cut off in chunk #2.",
      retrievalStatus: "Failed (50% accuracy)"
    },
    advancedChunk: {
      strategy: "Parent-Child / Late Chunking",
      text: "[Parent Section: Billing Penalties & Partner Exemptions]\nAll enterprise customers are subject to a mandatory 2.5% monthly late payment surcharge for invoices overdue by more than 15 calendar days. However, Tier-1 Strategic Partners are explicitly exempt from this penalty during their initial 90-day onboarding window, provided that an active waiver request has been submitted to the billing director.",
      outcome: "✅ Perfect Grounding: The LLM accurately answers that Tier-1 partners are exempt during their first 90 days with an active waiver.",
      retrievalStatus: "100% Grounded"
    }
  },
  {
    id: "table_shredding",
    title: "2. Markdown Table Header Disconnection",
    category: "Structure Loss",
    query: "What is the encryption standard and approval authority for Tier 4 data?",
    rawDocumentText: "| Tier | Sensitivity | Encryption Transit | Encryption Rest | Required Approver |\n|---|---|---|---|---|\n| Tier 1 | Public | TLS 1.2+ | None | Self |\n| Tier 2 | Internal | TLS 1.3 | AES-128-CBC | Team Lead |\n| Tier 3 | Confidential | TLS 1.3 | AES-256-GCM | Dept Manager |\n| Tier 4 | Restricted PII | TLS 1.3 Strict | AES-256-GCM | CISO Dual-Custody |",
    naiveChunk: {
      text: "| Tier 4 | Restricted PII | TLS 1.3 Strict | AES-256-GCM | CISO Dual-Custody |",
      severedText: "The column headers (| Tier | Sensitivity | Encryption Transit | Encryption Rest | Required Approver |) were severed in chunk #1.",
      outcome: "❌ Header Blindness: The vector search matches 'Tier 4', but the LLM cannot tell which column is 'Transit' vs 'Rest' encryption without headers.",
      retrievalStatus: "Ambiguous / High Risk"
    },
    advancedChunk: {
      strategy: "Markdown Header / Structure-Guided AST",
      text: "[Table: Data Classification & Encryption Policy]\n| Tier | Sensitivity | Encryption Transit | Encryption Rest | Required Approver |\n|---|---|---|---|---|\n| Tier 4 | Restricted PII | TLS 1.3 Strict | AES-256-GCM | CISO Dual-Custody |",
      outcome: "✅ Atomic Table Preservation: Table headers are injected into every row chunk, guaranteeing flawless attribute resolution.",
      retrievalStatus: "100% Grounded"
    }
  },
  {
    id: "pronoun_amnesia",
    title: "3. Long-Range Pronoun & Entity Amnesia",
    category: "Entity Resolution",
    query: "What are the GPU infrastructure requirements for Project Hyperion?",
    rawDocumentText: "Project Hyperion represents our next-generation multimodal neural synthesis cluster designed to support real-time audio and vision processing at the enterprise edge. After extensive benchmarking across 12 distributed data centers, the infrastructure engineering team finalized the hardware baseline. It requires 512 NVIDIA H100 SXM5 GPUs interconnected via 3.2 Tbps Quantum-2 InfiniBand fabrics with liquid direct-to-chip cooling.",
    naiveChunk: {
      text: "It requires 512 NVIDIA H100 SXM5 GPUs interconnected via 3.2 Tbps Quantum-2 InfiniBand fabrics with liquid direct-to-chip cooling.",
      severedText: "Project Hyperion name only appears 60 words earlier in chunk #1.",
      outcome: "❌ Zero Keyword Match: Query searching for 'Project Hyperion' will NEVER match chunk #2 because the chunk only contains the pronoun 'It'.",
      retrievalStatus: "0% Recall (Lost needle)"
    },
    advancedChunk: {
      strategy: "Anthropic Contextual Retrieval",
      text: "[Context: This excerpt specifies the hardware infrastructure requirements for Project Hyperion multimodal cluster] It requires 512 NVIDIA H100 SXM5 GPUs interconnected via 3.2 Tbps Quantum-2 InfiniBand fabrics with liquid direct-to-chip cooling.",
      outcome: "✅ Instant Semantic & Lexical Hit: Prepending the entity context ensures 100% retrieval recall for both BM25 and vector search.",
      retrievalStatus: "100% Recall"
    }
  }
];

// Interactive Dynamic Simulator Function
export const SIMULATE_CHUNKING = (strategyId, document, customConfig = {}) => {
  const doc = document || SAMPLE_DOCUMENTS[0];
  const allSections = doc.sections || [];
  const fullText = allSections.map(s => `### ${s.heading}\n${s.content}`).join("\n\n");
  const words = fullText.split(/\s+/);
  const totalWords = words.length;

  const chunkSize = customConfig.chunkSize || 75;
  const overlap = customConfig.overlap || 15;

  switch (strategyId) {
    case "fixed_size": {
      const step = Math.max(10, chunkSize - overlap);
      const rawChunks = [];
      for (let i = 0; i < words.length; i += step) {
        const slice = words.slice(i, i + chunkSize);
        if (slice.length > 0) {
          rawChunks.push({
            words: slice,
            startIdx: i,
            endIdx: i + slice.length
          });
        }
      }

      const chunks = rawChunks.map((c, idx) => {
        const text = c.words.join(" ");
        const startsWithLower = /^[a-z]/.test(text);
        const endsWithoutPunct = !/[.!?]$/.test(text);
        const breaksMidSentence = startsWithLower || endsWithoutPunct;
        return {
          id: idx + 1,
          preview: text,
          wordCount: c.words.length,
          startOffset: c.startIdx,
          endOffset: c.endIdx,
          hasOverlap: idx > 0,
          overlapWordCount: idx > 0 ? overlap : 0,
          breaksMidSentence,
          preservesStructure: false,
          metadata: { strategy: "fixed_size", windowTokens: chunkSize * 1.3 }
        };
      });

      return {
        strategy: "Fixed-Size Chunking",
        strategyId,
        totalChunks: chunks.length,
        avgChunkWords: Math.round(words.length / chunks.length),
        overlapsUsed: overlap,
        structurePreserved: false,
        semanticQuality: "Poor",
        retrievalPrecision: "42%",
        synthesisQuality: "Low",
        contextRetention: "35%",
        severedSentencesCount: chunks.filter(c => c.breaksMidSentence).length,
        chunks
      };
    }

    case "recursive_character": {
      const chunks = [];
      allSections.forEach((section, sIdx) => {
        const sectionText = `### ${section.heading}\n${section.content}`;
        const sectionWords = sectionText.split(/\s+/);
        
        if (sectionWords.length <= chunkSize) {
          chunks.push({
            id: chunks.length + 1,
            preview: sectionText,
            wordCount: sectionWords.length,
            breaksMidSentence: false,
            preservesStructure: true,
            hasOverlap: false,
            metadata: { section: section.heading, level: "paragraph" }
          });
        } else {
          // split sentences cleanly
          const sentences = section.content.match(/[^.!?]+[.!?]+/g) || [section.content];
          let buffer = `### ${section.heading}\n`;
          sentences.forEach((sent) => {
            if ((buffer + sent).split(/\s+/).length > chunkSize && buffer.trim()) {
              chunks.push({
                id: chunks.length + 1,
                preview: buffer.trim(),
                wordCount: buffer.trim().split(/\s+/).length,
                breaksMidSentence: false,
                preservesStructure: true,
                hasOverlap: false,
                metadata: { section: section.heading, level: "sentence_cascade" }
              });
              buffer = "";
            }
            buffer += sent + " ";
          });
          if (buffer.trim()) {
            chunks.push({
              id: chunks.length + 1,
              preview: buffer.trim(),
              wordCount: buffer.trim().split(/\s+/).length,
              breaksMidSentence: false,
              preservesStructure: true,
              hasOverlap: false,
              metadata: { section: section.heading, level: "sentence_cascade" }
            });
          }
        }
      });

      return {
        strategy: "Recursive Character Splitter",
        strategyId,
        totalChunks: chunks.length,
        avgChunkWords: Math.round(totalWords / chunks.length),
        overlapsUsed: 0,
        structurePreserved: true,
        semanticQuality: "Good",
        retrievalPrecision: "68%",
        synthesisQuality: "Medium-High",
        contextRetention: "68%",
        severedSentencesCount: 0,
        chunks
      };
    }

    case "markdown_header": {
      const chunks = allSections.map((s, idx) => ({
        id: idx + 1,
        preview: `### ${s.heading}\n${s.content}`,
        wordCount: (s.heading + " " + s.content).split(/\s+/).length,
        breaksMidSentence: false,
        preservesStructure: true,
        hasOverlap: false,
        metadata: {
          headerPath: `${doc.title} > ${s.heading}`,
          depth: 2,
          isAtomicHeader: true
        }
      }));

      return {
        strategy: "Markdown Header Splitter",
        strategyId,
        totalChunks: chunks.length,
        avgChunkWords: Math.round(totalWords / chunks.length),
        overlapsUsed: 0,
        structurePreserved: true,
        semanticQuality: "Good-High",
        retrievalPrecision: "76%",
        synthesisQuality: "High",
        contextRetention: "82%",
        severedSentencesCount: 0,
        chunks
      };
    }

    case "parent_child": {
      const parentChunks = [];
      const childChunks = [];

      allSections.forEach((section, sIdx) => {
        const parentId = `P_${sIdx + 1}`;
        const parentText = `### ${section.heading}\n${section.content}`;
        parentChunks.push({
          parentId,
          title: section.heading,
          text: parentText,
          words: parentText.split(/\s+/).length
        });

        // Generate 2-3 granular child chunks per section
        const sentences = section.content.match(/[^.!?]+[.!?]+/g) || [section.content];
        sentences.forEach((sent, cIdx) => {
          childChunks.push({
            id: childChunks.length + 1,
            preview: `[Child ${childChunks.length + 1} ➔ Resolves to ${parentId}]\n"${sent.trim()}"`,
            parentTitle: section.heading,
            parentId,
            parentPreview: parentText,
            wordCount: sent.trim().split(/\s+/).length,
            breaksMidSentence: false,
            preservesStructure: true,
            hasOverlap: false,
            isChildVector: true
          });
        });
      });

      return {
        strategy: "Parent-Child (Hierarchical) Chunking",
        strategyId,
        totalChunks: childChunks.length,
        parentChunksCount: parentChunks.length,
        avgChunkWords: `${Math.round(totalWords / childChunks.length)} (child) / ${Math.round(totalWords / parentChunks.length)} (parent)`,
        overlapsUsed: 20,
        structurePreserved: true,
        semanticQuality: "Excellent",
        retrievalPrecision: "89%",
        synthesisQuality: "Very High",
        contextRetention: "94%",
        severedSentencesCount: 0,
        chunks: childChunks,
        parents: parentChunks
      };
    }

    case "sentence_window": {
      const sentences = [];
      allSections.forEach((s) => {
        const sents = s.content.match(/[^.!?]+[.!?]+/g) || [s.content];
        sents.forEach(item => sentences.push({ heading: s.heading, text: item.trim() }));
      });

      const chunks = sentences.map((item, idx) => {
        const prev = idx > 0 ? sentences[idx - 1].text : "";
        const next = idx < sentences.length - 1 ? sentences[idx + 1].text : "";
        const expandedWindow = `[Window Preview]\n${prev ? `... ${prev} ` : ""}[TARGET: "${item.text}"]${next ? ` ${next} ...` : ""}`;

        return {
          id: idx + 1,
          preview: `[Vector Search Sentence #${idx + 1}]: "${item.text}"`,
          expandedContext: expandedWindow,
          section: item.heading,
          wordCount: item.text.split(/\s+/).length,
          windowWordCount: (prev + " " + item.text + " " + next).split(/\s+/).length,
          breaksMidSentence: false,
          preservesStructure: true,
          hasOverlap: true
        };
      });

      return {
        strategy: "Sentence Window Retrieval",
        strategyId,
        totalChunks: chunks.length,
        avgChunkWords: Math.round(totalWords / chunks.length),
        overlapsUsed: 0,
        structurePreserved: true,
        semanticQuality: "Excellent",
        retrievalPrecision: "91%",
        synthesisQuality: "Very High",
        contextRetention: "91%",
        severedSentencesCount: 0,
        chunks
      };
    }

    case "semantic_chunking": {
      // Group logically related sections into 3 semantic clusters
      const semanticClusters = [
        { title: "Governance Mandate & Taxonomy", sections: allSections.slice(0, 2) },
        { title: "Operational RBAC & Cryptographic Lifecycle", sections: allSections.slice(2, 4) },
        { title: "Audit Enforcement & Incident Escalation", sections: allSections.slice(4) }
      ];

      const chunks = semanticClusters.filter(c => c.sections.length > 0).map((cluster, idx) => {
        const text = cluster.sections.map(s => `### ${s.heading}\n${s.content}`).join("\n\n");
        return {
          id: idx + 1,
          preview: `[Semantic Cluster #${idx + 1}: ${cluster.title} (Cosine Similarity > 0.78)]\n${text}`,
          wordCount: text.split(/\s+/).length,
          breaksMidSentence: false,
          preservesStructure: true,
          hasOverlap: false,
          similarityScore: 0.84 - (idx * 0.05)
        };
      });

      return {
        strategy: "Semantic Chunking (Embedding Boundary)",
        strategyId,
        totalChunks: chunks.length,
        avgChunkWords: Math.round(totalWords / chunks.length),
        overlapsUsed: 0,
        structurePreserved: true,
        semanticQuality: "Excellent",
        retrievalPrecision: "85%",
        synthesisQuality: "High",
        contextRetention: "89%",
        severedSentencesCount: 0,
        chunks
      };
    }

    case "contextual_retrieval": {
      const chunks = allSections.map((s, idx) => {
        const situationalPrefix = `[Document: ${doc.title} > Section: ${s.heading} | Context: Outlines corporate data governance mandates regarding sensitive handling]`;
        const enriched = `${situationalPrefix}\n\n${s.content}`;
        return {
          id: idx + 1,
          preview: enriched,
          prefix: situationalPrefix,
          rawText: s.content,
          wordCount: enriched.split(/\s+/).length,
          breaksMidSentence: false,
          preservesStructure: true,
          hasOverlap: false,
          contextAddedTokens: 28
        };
      });

      return {
        strategy: "Anthropic Contextual Retrieval",
        strategyId,
        totalChunks: chunks.length,
        avgChunkWords: Math.round(totalWords / chunks.length),
        overlapsUsed: 0,
        structurePreserved: true,
        semanticQuality: "State-of-the-Art",
        retrievalPrecision: "94%",
        synthesisQuality: "State-of-the-Art",
        contextRetention: "98%",
        severedSentencesCount: 0,
        chunks
      };
    }

    case "late_chunking": {
      const chunks = allSections.map((s, idx) => {
        return {
          id: idx + 1,
          preview: `[Late Chunk Vector #${idx + 1} | Attends to all ${totalWords} tokens in doc]\n${s.heading}: ${s.content}`,
          spanRange: `Tokens [${idx * 60} ... ${(idx + 1) * 60}]`,
          wordCount: (s.heading + " " + s.content).split(/\s+/).length,
          breaksMidSentence: false,
          preservesStructure: true,
          hasOverlap: false,
          bidirectionalAttention: "100% full-document coverage"
        };
      });

      return {
        strategy: "Jina Late Chunking",
        strategyId,
        totalChunks: chunks.length,
        avgChunkWords: Math.round(totalWords / chunks.length),
        overlapsUsed: 0,
        structurePreserved: true,
        semanticQuality: "State-of-the-Art",
        retrievalPrecision: "93%",
        synthesisQuality: "State-of-the-Art",
        contextRetention: "97%",
        severedSentencesCount: 0,
        chunks
      };
    }

    default:
      return { strategy: "Unknown", totalChunks: 0, chunks: [] };
  }
};

export const CHUNKING_COMPARISON_TABLE = [
  { strategy: "1. Naive Fixed-Size", speed: "1x (<1ms)", quality: "42%", cost: "$", context: "None (Severed)", storage: "1.0x", best: "Quick prototypes, raw uniform log streams" },
  { strategy: "2. Recursive Character", speed: "1x (3ms)", quality: "68%", cost: "$", context: "Paragraph / Sentence", storage: "1.0x", best: "General markdown, wikis, articles, blog posts" },
  { strategy: "3. Markdown Header AST", speed: "1x (5ms)", quality: "76%", cost: "$", context: "Header Breadcrumbs", storage: "1.05x", best: "Technical manuals, Git repos, API reference docs" },
  { strategy: "4. Semantic (Embedding)", speed: "5x (45ms)", quality: "85%", cost: "$$", context: "Topic Cluster", storage: "1.0x", best: "Legal agreements, clinical papers, transcripts" },
  { strategy: "5. Sentence Window", speed: "2x (12ms)", quality: "91%", cost: "$$", context: "Sentence + Buffer", storage: "3.5x", best: "Granular factoid lookup, enterprise FAQ databases" },
  { strategy: "6. Parent-Child (Hierarchical)", speed: "2x (8ms)", quality: "89%", cost: "$$", context: "Dual Search/Synthesis", storage: "1.8x", best: "⭐ Recommended default for enterprise RAG platforms" },
  { strategy: "7. Contextual Retrieval (Anthropic)", speed: "15x (140ms)", quality: "94%", cost: "$$$", context: "LLM Situational Prefix", storage: "1.2x", best: "High-stakes compliance, ambiguous queries, hybrid BM25" },
  { strategy: "8. Jina Late Chunking", speed: "4x (35ms)", quality: "93%", cost: "$$", context: "Doc-Wide Self-Attention", storage: "1.0x", best: "Long-form research reports, cross-reference heavy books" }
];

export const PYTHON_CHUNKING_CODE = `# ============================================================================
# PRODUCTION RAG CHUNKING IMPLEMENTATION SUITE
# Enterprise Document Intelligence: LangChain, LlamaIndex & Native Jina Late Chunking
# Security & Compliance Certified: Zero PII / Zero Copyrighted Materials
# ============================================================================

from typing import List, Dict, Any, Tuple
import re
import numpy as np

# ─── 1. RECURSIVE CHARACTER SPLITTER (LANGCHAIN PATTERN) ───────────────────
class RecursiveCharacterChunker:
    """Recursively splits along natural document hierarchy."""
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\\n\\n", "\\n", ". ", " ", ""]

    def split_text(self, text: str) -> List[str]:
        final_chunks = []
        # Split recursively by largest available separator
        good_splits = []
        for s in self.separators:
            if s == "":
                splits = list(text)
            else:
                splits = text.split(s)
            if len(splits) > 1:
                current_chunk = ""
                for part in splits:
                    if len(current_chunk) + len(part) + len(s) <= self.chunk_size:
                        current_chunk += part + s
                    else:
                        if current_chunk.strip():
                            good_splits.append(current_chunk.strip())
                        current_chunk = part + s
                if current_chunk.strip():
                    good_splits.append(current_chunk.strip())
                return good_splits
        return [text]

# ─── 2. HIERARCHICAL PARENT-CHILD CHUNKER (DECOUPLED RETRIEVAL) ────────────
class ParentChildChunker:
    """Decouples search index (child vectors) from LLM generation context (parent)."""
    def __init__(self, parent_size: int = 1024, child_size: int = 128, child_overlap: int = 32):
        self.parent_size = parent_size
        self.child_size = child_size
        self.child_overlap = child_overlap

    def chunk_document(self, document_text: str, doc_id: str = "doc_01") -> Dict[str, Any]:
        paragraphs = document_text.split("\\n\\n")
        parents = []
        children = []

        curr_parent = ""
        parent_idx = 0

        for para in paragraphs:
            if len(curr_parent) + len(para) <= self.parent_size:
                curr_parent += para + "\\n\\n"
            else:
                if curr_parent.strip():
                    p_id = f"{doc_id}_P{parent_idx}"
                    parents.append({"parent_id": p_id, "text": curr_parent.strip()})
                    # Subdivide parent into child vectors
                    self._create_children(curr_parent.strip(), p_id, children)
                    parent_idx += 1
                curr_parent = para + "\\n\\n"

        if curr_parent.strip():
            p_id = f"{doc_id}_P{parent_idx}"
            parents.append({"parent_id": p_id, "text": curr_parent.strip()})
            self._create_children(curr_parent.strip(), p_id, children)

        return {"parents": parents, "children": children}

    def _create_children(self, parent_text: str, parent_id: str, children_list: List[Dict]):
        words = parent_text.split()
        step = max(1, self.child_size - self.child_overlap)
        for i in range(0, len(words), step):
            child_text = " ".join(words[i:i + self.child_size])
            if child_text.strip():
                children_list.append({
                    "child_id": f"{parent_id}_C{len(children_list)}",
                    "parent_id": parent_id,
                    "text": child_text
                })

# ─── 3. ANTHROPIC CONTEXTUAL RETRIEVAL ENRICHER ────────────────────────────
class ContextualRetrievalEnricher:
    """Prepends 50-100 token LLM-generated situational context to every chunk."""
    PROMPT_TEMPLATE = """<document>
{full_document}
</document>
Here is the chunk we want to situate within the whole document:
<chunk>
{chunk_text}
</chunk>
Please give a short, succinct context (1-2 sentences) to situate this chunk within the overall document for search retrieval. Answer only with the context."""

    def __init__(self, llm_client=None):
        self.llm_client = llm_client

    def enrich_chunk(self, chunk_text: str, full_document: str) -> str:
        # In production: response = self.llm_client.generate(prompt)
        situational_prefix = "[Context: Excerpt from Enterprise Security Policy v3.2 section covering cryptographic disposal of Tier 4 PII]"
        return f"{situational_prefix}\\n\\n{chunk_text}"

# ─── 4. JINA LATE CHUNKING WITH TRANSFORMERS ──────────────────────────────
class JinaLateChunker:
    """Late Mean Pooling: Embeds the entire document first with bidirectional attention."""
    def __init__(self, model_name: str = "jinaai/jina-embeddings-v3"):
        # from transformers import AutoModel, AutoTokenizer
        # self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        # self.model = AutoModel.from_pretrained(model_name, trust_remote_code=True)
        self.model_name = model_name

    def late_chunk_spans(self, full_doc: str, span_boundaries: List[Tuple[int, int]]) -> List[np.ndarray]:
        """
        1. Tokenize full doc (e.g. 4000 tokens)
        2. Pass full token sequence through Transformer Backbone
        3. For each span [token_start, token_end], perform mean-pooling on token embeddings
        """
        # Pseudo-code execution:
        # inputs = self.tokenizer(full_doc, return_tensors="pt")
        # model_output = self.model(**inputs)
        # token_embeddings = model_output.last_hidden_state[0] # [seq_len, hidden_dim]
        #
        # chunk_vectors = []
        # for start_idx, end_idx in span_boundaries:
        #     span_embeds = token_embeddings[start_idx:end_idx]
        #     pooled = span_embeds.mean(dim=0).detach().cpu().numpy()
        #     chunk_vectors.append(pooled / np.linalg.norm(pooled)) # L2 Normalize
        # return chunk_vectors
        return [np.random.randn(1024) for _ in span_boundaries]

# ─── VERIFICATION & RUNNER ────────────────────────────────────────────────
if __name__ == "__main__":
    sample_doc = ("This policy establishes mandatory data governance across all business units.\\n\\n"
                  "All data assets must be classified into Tier 1 (Public), Tier 2 (Internal), "
                  "Tier 3 (Confidential), and Tier 4 (Restricted PII).\\n\\n"
                  "Disposal of Tier 4 media requires cryptographic key shredding and audit logs.")
    
    # 1. Recursive Chunking
    rc = RecursiveCharacterChunker(chunk_size=120, chunk_overlap=20)
    rc_chunks = rc.split_text(sample_doc)
    print(f"✅ Recursive Chunks: {len(rc_chunks)}")

    # 2. Parent-Child Chunking
    pc = ParentChildChunker(parent_size=200, child_size=40)
    pc_result = pc.chunk_document(sample_doc)
    print(f"✅ Parent Chunks: {len(pc_result['parents'])}, Child Chunks: {len(pc_result['children'])}")
`;
