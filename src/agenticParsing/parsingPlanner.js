/**
 * Parsing Planner — Deterministic Dispatch Routing (No LLM)
 * Enterprise Document Intelligence [Vol.1 #5nonies]
 * Maps 6 deterministic nature flags to an ordered list of MethodSteps.
 */

/**
 * @typedef {Object} MethodStep
 * @property {string} id - Unique identifier of the step
 * @property {string} method - Method key (e.g., 'fitz_native', 'docling_tables')
 * @property {string} family - 'native' | 'layout' | 'ocr' | 'structure'
 * @property {string} label - Human-readable name of the method
 * @property {string} rationale - One-line technical justification
 * @property {boolean} optional - If true, failure is isolated into `_error` and dispatcher continues
 * @property {string} targetFrame - 'line_df' | 'span_df' | 'toc_df' | 'table_df' | 'image_df' | 'reference_df'
 * @property {number} estimatedMs - Rough runtime estimation in milliseconds
 */

/**
 * Generates an ordered execution plan based strictly on document nature signals.
 * @param {Object} nature - The detected nature object from detectDocumentNature
 * @returns {Array<MethodStep>} Ordered list of execution steps
 */
export function planParsingMethods(nature) {
  const { signals, label } = nature;
  const plan = [];

  // =========================================================================
  // Case A: Scanned Document Path (is_scanned == true)
  // =========================================================================
  if (signals.is_scanned) {
    plan.push({
      id: 'step-ocr-primary',
      method: 'easyocr_scan',
      family: 'ocr',
      label: 'EasyOCR Scanned Reader',
      rationale: 'Primary text extraction for pages without native digital font layer',
      optional: false,
      targetFrame: 'line_df',
      estimatedMs: 850 * (nature.metrics?.pageCount || 1),
    });

    if (signals.has_tables_signal) {
      plan.push({
        id: 'step-ocr-tables',
        method: 'paddleocr_structure',
        family: 'ocr',
        label: 'PaddleOCR Structure Table Extractor',
        rationale: 'Extract bounding boxes and table cells from raw pixel arrays',
        optional: true,
        targetFrame: 'table_df',
        estimatedMs: 600 * (nature.metrics?.pageCount || 1),
      });
    }

    plan.push({
      id: 'step-ocr-toc',
      method: 'toc_body_structure',
      family: 'structure',
      label: 'TOC Body Typography Loop',
      rationale: 'Derive structural hierarchy from reconstructed OCR line sizes and weights',
      optional: true,
      targetFrame: 'toc_df',
      estimatedMs: 300,
    });

    return plan;
  }

  // =========================================================================
  // Case B: Digital Text Layer (All digital documents start with fitz_native)
  // Rule 1: Every plan starts with fitz_native (Mandatory baseline)
  // =========================================================================
  plan.push({
    id: 'step-fitz-native',
    method: 'fitz_native',
    family: 'native',
    label: 'PyMuPDF (fitz) Native Text Extractor',
    rationale: 'Extracts base line_df and span_df with typography coordinates (<10ms/page)',
    optional: false,
    targetFrame: 'line_df',
    estimatedMs: 12 * (nature.metrics?.pageCount || 1),
  });

  // TOC Recovery Strategy Selection
  if (signals.has_native_outline) {
    // 1. Native Outline available
    plan.push({
      id: 'step-fitz-toc',
      method: 'fitz_native_toc',
      family: 'structure',
      label: 'PyMuPDF Native Outline Extraction',
      rationale: 'Zero-cost extraction of embedded PDF bookmark tree (doc.get_toc())',
      optional: false,
      targetFrame: 'toc_df',
      estimatedMs: 5,
    });

    // If it's an academic/technical paper, enrich native TOC with deeper level-3 subsections
    plan.push({
      id: 'step-toc-enrichment',
      method: 'toc_body_structure',
      family: 'structure',
      label: 'TOC Body Structure Loop (Subsections)',
      rationale: 'Advisory loop to capture Level-3 and sub-headings omitted from native bookmarks',
      optional: true,
      targetFrame: 'toc_df',
      estimatedMs: 250,
    });
  } else if (signals.has_sommaire) {
    // 2. Printed dot-leader contents page
    plan.push({
      id: 'step-toc-sommaire',
      method: 'toc_sommaire',
      family: 'structure',
      label: 'Printed Sommaire Cascade (Cases 1–3)',
      rationale: 'Rebuilds outline directly from dot-leader page patterns on early pages',
      optional: false,
      targetFrame: 'toc_df',
      estimatedMs: 45,
    });
  } else {
    // 3. Pure body typography outline recovery
    plan.push({
      id: 'step-toc-body',
      method: 'toc_body_structure',
      family: 'structure',
      label: 'TOC Body Typography Loop (Case 4)',
      rationale: '6-signal scoring on font sizes and bold flags + bounded LLM validator loop',
      optional: false,
      targetFrame: 'toc_df',
      estimatedMs: 400,
    });
  }

  // Table Extraction Strategy
  if (signals.has_tables_signal) {
    plan.push({
      id: 'step-docling-tables',
      method: 'docling_tables',
      family: 'layout',
      label: 'Docling Deep Layout & Table Parser',
      rationale: 'Resolves complex multi-row nested cells and outputs structured table markdown',
      optional: true,
      targetFrame: 'table_df',
      estimatedMs: 380 * (nature.metrics?.tableLineMatches || 2),
    });
  }

  // Visual / Figure Handling Strategy
  if (signals.has_rich_figures) {
    plan.push({
      id: 'step-vision-figures',
      method: 'vision_llm_figures',
      family: 'multimodal',
      label: 'Vision LLM Chart & Diagram Parser',
      rationale: 'Inspects visual figure assets and produces structured data summaries',
      optional: true,
      targetFrame: 'image_df',
      estimatedMs: 1200,
    });
  }

  // Image Pipeline (Rule 2: optional closing step)
  plan.push({
    id: 'step-image-pipeline',
    method: 'image_pipeline',
    family: 'native',
    label: 'Image Asset Indexer & Metadata Pipeline',
    rationale: 'Indexes image bounding coordinates, resolutions, and text-proximity anchors',
    optional: true,
    targetFrame: 'image_df',
    estimatedMs: 50,
  });

  return plan;
}
