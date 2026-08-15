/**
 * Multi-Frame Synthesizer & _pick_richer Heuristic
 * Enterprise Document Intelligence [Vol.1 #5nonies]
 * Folds per-step outputs into one unified relational corpus dictionary.
 */

/**
 * Merges two versions of a frame key, keeping the strictly more informative one.
 * Rule: Higher row count with compatible schema, or deeper hierarchical levels.
 * @param {Array} currentFrame - The currently retained frame
 * @param {Array} newFrame - The new candidate frame from a subsequent step
 * @param {string} frameKey - The name of the frame ('toc_df', 'table_df', etc.)
 * @returns {Array} The selected richer frame
 */
export function pickRicher(currentFrame = [], newFrame = [], frameKey = '') {
  if (!currentFrame || currentFrame.length === 0) return newFrame || [];
  if (!newFrame || newFrame.length === 0) return currentFrame || [];

  if (frameKey === 'toc_df') {
    // For TOC: if newFrame has deeper levels or more validated sections, merge/reconcile
    const currentMaxLevel = Math.max(...currentFrame.map(t => t.level || 1), 1);
    const newMaxLevel = Math.max(...newFrame.map(t => t.level || 1), 1);

    if (newFrame.length > currentFrame.length || newMaxLevel > currentMaxLevel) {
      // Reconcile: Keep native root items, append body-enriched sub-sections
      const existingTitles = new Set(currentFrame.map(t => (t.title || '').toLowerCase().trim()));
      const uniqueNew = newFrame.filter(t => !existingTitles.has((t.title || '').toLowerCase().trim()));
      return [...currentFrame, ...uniqueNew].sort((a, b) => (a.start_page || 0) - (b.start_page || 0));
    }
    return currentFrame;
  }

  if (frameKey === 'table_df') {
    // Keep the frame with more structured cells or higher total row count
    const currentTotalCells = currentFrame.reduce((acc, t) => acc + (t.rowCount || 1) * (t.colCount || 1), 0);
    const newTotalCells = newFrame.reduce((acc, t) => acc + (t.rowCount || 1) * (t.colCount || 1), 0);
    return newTotalCells >= currentTotalCells ? newFrame : currentFrame;
  }

  if (frameKey === 'image_df') {
    // Merge image bounding boxes with visual LLM summaries if matching
    return [...currentFrame, ...newFrame.filter(n => !currentFrame.some(c => c.id === n.id))];
  }

  // Default: Keep higher row count
  return newFrame.length > currentFrame.length ? newFrame : currentFrame;
}

/**
 * Synthesizes all step outputs into a single, standardized corpus dict.
 * @param {Array} stepOutputs - List of step execution outcomes
 * @param {Object} nature - The document nature profile
 * @param {Array} plan - The execution plan used
 * @returns {Object} Enriched unified corpus dictionary with sources audit trail
 */
export function synthesizeParsingOutputs(stepOutputs = [], nature = {}, plan = []) {
  const corpus = {
    line_df: [],
    span_df: [],
    toc_df: [],
    table_df: [],
    image_df: [],
    reference_df: [],
    sources: [],
    nature,
    plan,
    stats: {
      totalStepsExecuted: stepOutputs.filter(s => s.status === 'success').length,
      totalStepsSkipped: stepOutputs.filter(s => s.status === 'skipped' || s.status === 'error').length,
      totalExecutionTimeMs: 0,
    },
  };

  for (const step of stepOutputs) {
    if (!step || step.status !== 'success' || !step.output) continue;

    const out = step.output;
    const method = step.method;

    if (out._meta?.durationMs) {
      corpus.stats.totalExecutionTimeMs += out._meta.durationMs;
    }

    // 1. line_df
    if (out.line_df && out.line_df.length > 0) {
      corpus.line_df = pickRicher(corpus.line_df, out.line_df, 'line_df');
      corpus.sources.push({ frame: 'line_df', method, count: corpus.line_df.length });
    }

    // 2. span_df
    if (out.span_df && out.span_df.length > 0) {
      corpus.span_df = pickRicher(corpus.span_df, out.span_df, 'span_df');
      corpus.sources.push({ frame: 'span_df', method, count: corpus.span_df.length });
    }

    // 3. toc_df
    if (out.toc_df && out.toc_df.length > 0) {
      corpus.toc_df = pickRicher(corpus.toc_df, out.toc_df, 'toc_df');
      corpus.sources.push({ frame: 'toc_df', method, count: corpus.toc_df.length });
    }

    // 4. table_df
    if (out.table_df && out.table_df.length > 0) {
      corpus.table_df = pickRicher(corpus.table_df, out.table_df, 'table_df');
      corpus.sources.push({ frame: 'table_df', method, count: corpus.table_df.length });
    }

    // 5. image_df
    if (out.image_df && out.image_df.length > 0) {
      corpus.image_df = pickRicher(corpus.image_df, out.image_df, 'image_df');
      corpus.sources.push({ frame: 'image_df', method, count: corpus.image_df.length });
    }

    // 6. reference_df
    if (out.reference_df && out.reference_df.length > 0) {
      corpus.reference_df = pickRicher(corpus.reference_df, out.reference_df, 'reference_df');
      corpus.sources.push({ frame: 'reference_df', method, count: corpus.reference_df.length });
    }
  }

  corpus.stats.totalExecutionTimeMs = parseFloat(corpus.stats.totalExecutionTimeMs.toFixed(2));
  return corpus;
}
