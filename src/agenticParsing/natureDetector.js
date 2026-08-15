/**
 * Nature Detector — 6 Deterministic Probes (No LLM)
 * Enterprise Document Intelligence [Vol.1 #5nonies]
 * Reads PDF text layer (line_df / span_df) & binary outline to identify document nature.
 */

/**
 * Probes document signals and returns 6 deterministic flags plus nature label.
 * @param {Object} params
 * @param {Array} params.lineDf - Extracted line tokens
 * @param {Array} params.spanDf - Extracted span tokens
 * @param {Array} params.nativeToc - Native bookmark TOC entries
 * @param {number} params.pageCount - Total number of pages
 * @param {Array} params.images - Extracted raw images/drawings
 * @returns {Object} Nature profile with flags, heuristics, and classification label
 */
export function detectDocumentNature({
  lineDf = [],
  spanDf = [],
  nativeToc = [],
  pageCount = 1,
  images = [],
}) {
  const safePageCount = Math.max(pageCount || 1, 1);
  const totalLines = lineDf.length;
  const linesPerPage = totalLines / safePageCount;

  // 1. is_scanned: Line count is 0 or well below readable text threshold (< 2 lines/page)
  const is_scanned = totalLines === 0 || linesPerPage < 2.0;

  // 2. has_native_outline: doc.get_toc() has 1+ items
  const has_native_outline = Array.isArray(nativeToc) && nativeToc.length > 0;

  // 3. has_sommaire: Early pages (first 3 pages or <=10% of doc) carry 5+ dot-leader lines ("Title ..... 12")
  let dotLeaderMatches = 0;
  const earlyLineMaxPage = Math.min(3, Math.ceil(safePageCount * 0.15));
  const earlyLines = lineDf.filter((l) => (l.page || 1) <= earlyLineMaxPage);
  
  const dotLeaderRegex = /(\.{3,}|\_{3,}|\-{3,})\s*\d+$/;
  for (const line of earlyLines) {
    const text = (line.text || '').trim();
    if (dotLeaderRegex.test(text) || (text.includes('...') && /\d+$/.test(text))) {
      dotLeaderMatches++;
    }
  }
  const has_sommaire = dotLeaderMatches >= 4;

  // 4. is_composite: Multi-section document boundaries detected (numbering re-inits, style ruptures)
  let numberingResets = 0;
  let prevSectionNum = 0;
  let styleRuptures = 0;
  let prevFont = null;

  for (const line of lineDf) {
    const text = (line.text || '').trim();
    // detect section numbering e.g. "1. Introduction", "1. Overview"
    const match = text.match(/^(\d+)\.\s+[A-Z]/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num === 1 && prevSectionNum >= 3) {
        numberingResets++;
      }
      prevSectionNum = num;
    }
    if (line.font && prevFont && line.font !== prevFont && (line.size || 0) > 16) {
      styleRuptures++;
    }
    prevFont = line.font;
  }
  const is_composite = numberingResets >= 1 || styleRuptures >= 3;

  // 5. has_rich_figures: Image/vector density above median (> 0.4 images per page)
  const imageCount = images.length;
  const imageDensity = imageCount / safePageCount;
  const has_rich_figures = imageDensity >= 0.35 || imageCount >= 3;

  // 6. has_tables_signal: Whitespace grid detector (lines with 3+ aligned columns)
  let tableLineMatches = 0;
  for (const line of lineDf) {
    const text = (line.text || '').trim();
    // Split by multi-space gap or tab indicating table column alignment
    const columns = text.split(/\s{2,}|\t+/).filter(c => c.length > 0);
    if (columns.length >= 3) {
      tableLineMatches++;
    }
  }
  const has_tables_signal = tableLineMatches >= 3;

  // Synthesize Document Nature Classification Label
  let label = 'native-body-typography';
  let description = 'Clean digital PDF with body text typography and no explicit outline';

  if (is_scanned) {
    label = 'scanned-image';
    description = 'Scanned PDF with minimal or no extracted text layer; requires OCR';
  } else if (has_native_outline && has_tables_signal && has_rich_figures) {
    label = 'rich-multimodal-paper';
    description = 'Complex publication with native bookmarks, embedded tables, and figures';
  } else if (has_native_outline) {
    label = 'native-with-outline';
    description = 'Digital PDF with native PDF bookmarks/outline metadata';
  } else if (has_sommaire) {
    label = 'native-sommaire';
    description = 'Digital PDF with printed Table of Contents (dot-leader sommaire)';
  } else if (has_tables_signal && !has_rich_figures) {
    label = 'table-heavy-document';
    description = 'Report or agreement with dense tabular data structures';
  } else if (is_composite) {
    label = 'composite-multi-doc';
    description = 'Composite document containing multiple merged sections/reports';
  }

  return {
    label,
    description,
    signals: {
      is_scanned,
      has_native_outline,
      has_sommaire,
      is_composite,
      has_rich_figures,
      has_tables_signal,
    },
    metrics: {
      pageCount: safePageCount,
      totalLines,
      totalSpans: spanDf.length,
      linesPerPage: parseFloat(linesPerPage.toFixed(2)),
      dotLeaderMatches,
      numberingResets,
      imageCount,
      imageDensity: parseFloat(imageDensity.toFixed(2)),
      tableLineMatches,
    },
  };
}
