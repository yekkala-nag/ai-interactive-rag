import { enrichLineDfWithStyle } from './pdfParser.js';
import { mergeSplitHeadings, detectBodyHeadings } from './typography.js';
import { scoreHasNumericPrefix } from './typography.js';

const HEADING_VALIDATION_PROMPT = `
You are a document structure analyst. Your task is to validate heading candidates extracted from a PDF body text.

A heading candidate is a short line that might be a section title. False positives include:
- Figure captions (e.g., "Figure 3: architecture")
- Table row labels or cell values
- In-body emphasis (bold text used for emphasis, not titles)
- Enumerated list items
- BLEU scores or other numeric results
- Page numbers

Real headings typically:
- Have a numeric prefix (e.g., "1.", "1.2", "1.2.3", "I.", "A.")
- Are short (under 90 characters)
- Start at the left margin
- Have visual isolation (blank line above)
- Are bold or larger font

You will be given candidates in reading order with page number and surrounding context.
Return ONLY a JSON array of objects with these exact fields: title, page, level, source.
- title: the exact heading text
- page: the page number (1-indexed)
- level: integer hierarchy level (1 for top-level, 2 for subsection, etc.)
- source: always "body_structure"

You may also add missed headings you see in the context.
Do NOT include any explanation or text outside the JSON array.
`;

const HEADING_VALIDATION_SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    required: ['title', 'page', 'level', 'source'],
    properties: {
      title: { type: 'string' },
      page: { type: 'integer' },
      level: { type: 'integer' },
      source: { type: 'string' },
    },
  },
};

export function reconstructTocFromBody(lineDf, spanDf = null, options = {}) {
  let {
    mode = 'auto',
    existingTocDf = null,
    maxPasses = 3,
    llmParse = null,
    threshold = 3.0,
    weights = null,
  } = options;

  let processedLineDf = lineDf;

  if (spanDf && spanDf.length > 0) {
    processedLineDf = enrichLineDfWithStyle(lineDf, spanDf);
  }

  processedLineDf = mergeSplitHeadings(processedLineDf);
  let candidates = detectBodyHeadings(processedLineDf, threshold, weights);

  if (mode === 'auto') {
    if (existingTocDf && existingTocDf.length > 0) {
      const maxLevel = Math.max(...existingTocDf.map(t => t.level || 1));
      if (maxLevel <= 2) {
        mode = 'extend_native';
      } else {
        mode = 'no_toc';
      }
    } else {
      mode = 'no_toc';
    }
  }

  if (mode === 'extend_native' && existingTocDf) {
    candidates = filterExisting(candidates, existingTocDf);
  }

  let tocEntries = candidates.map(c => ({
    title: c.text.trim(),
    page: c.page_num,
    level: c.candidate_level || inferLevel(c.text),
    source: 'body_structure',
    heading_score: c.heading_score,
  }));

  if (llmParse) {
    tocEntries = llmValidationLoop(tocEntries, processedLineDf, llmParse, maxPasses);
  }

  if (mode === 'extend_native' && existingTocDf) {
    const nativeSet = new Set(existingTocDf.map(t => `${t.title}-${t.page}`));
    const newEntries = tocEntries.filter(e => !nativeSet.has(`${e.title}-${e.page}`));
    tocEntries = [...existingTocDf, ...newEntries];
  }

  return tocEntries.sort((a, b) => a.page - b.page || a.level - b.level);
}

function filterExisting(candidates, existingTocDf) {
  const existingKeys = new Set(existingTocDf.map(t => `${t.title.toLowerCase()}-${t.page}`));
  return candidates.filter(c => {
    const key = `${c.text.toLowerCase()}-${c.page_num}`;
    return !existingKeys.has(key);
  });
}

function inferLevel(text) {
  const match = text.match(/^(\d+(?:\.\d+)*\.?|[IVXLCDM]+\.|[A-Z]\.)/);
  if (match) {
    return match[1].split('.').filter(Boolean).length;
  }
  return 1;
}

async function llmValidationLoop(currentEntries, lineDf, llmParse, maxPasses) {
  let converged = false;
  let pass = 0;

  while (!converged && pass < maxPasses) {
    const context = buildContext(currentEntries, lineDf);
    const result = await llmParse(HEADING_VALIDATION_PROMPT, context, HEADING_VALIDATION_SCHEMA);

    if (!result || !Array.isArray(result)) break;

    const newEntries = result.map(r => ({
      title: r.title,
      page: r.page,
      level: r.level || inferLevel(r.title),
      source: r.source || 'body_structure',
      heading_score: r.heading_score || 3.0,
    }));

    if (arraysEqual(JSON.stringify(currentEntries), JSON.stringify(newEntries))) {
      converged = true;
    } else {
      currentEntries = newEntries;
    }
    pass += 1;
  }

  return currentEntries;
}

function buildContext(currentEntries, lineDf) {
  const linesByPage = new Map();
  for (const l of lineDf) {
    if (!linesByPage.has(l.page_num)) linesByPage.set(l.page_num, []);
    linesByPage.get(l.page_num).push(l);
  }

  const context = [];
  context.push('HEADING CANDIDATES (current state):');
  if (currentEntries.length === 0) {
    context.push('None found yet.');
  } else {
    for (const entry of currentEntries) {
      context.push(`- Page ${entry.page}, Level ${entry.level}: "${entry.title}" (score: ${entry.heading_score?.toFixed(2)})`);
    }
  }

  context.push('\nSAMPLE BODY CONTEXT (first 5 pages):');
  const samplePages = Array.from(linesByPage.keys()).slice(0, 5);
  for (const page of samplePages) {
    const lines = linesByPage.get(page) || [];
    context.push(`\n--- Page ${page} ---`);
    for (const l of lines.slice(0, 30)) {
      context.push(`${l.text}`);
    }
  }

  context.push('\nINSTRUCTIONS: Return JSON array of kept headings. Include any missed headings you see in the context.');
  return context.join('\n');
}

function arraysEqual(a, b) {
  return a === b;
}

export function detectDocumentBoundaries(lineDf) {
  const boundaries = [];

  const pages = new Map();
  for (const l of lineDf) {
    if (!pages.has(l.page_num)) pages.set(l.page_num, []);
    pages.get(l.page_num).push(l);
  }

  let prevMaxNumber = -1;
  for (const [pageNum, lines] of pages) {
    const pageNumbers = lines.filter(l => /^\s*\d+\s*$/.test(l.text.trim())).map(l => parseInt(l.text.trim()));
    const maxPageNumber = pageNumbers.length > 0 ? Math.max(...pageNumbers) : -1;

    if (prevMaxNumber >= 0 && maxPageNumber > 0 && maxPageNumber < prevMaxNumber * 0.5) {
      boundaries.push({
        type: 'numbering_reinit',
        page: pageNum,
        confidence: 0.8,
      });
    }

    if (maxPageNumber > 0) prevMaxNumber = maxPageNumber;
  }

  return boundaries;
}

export function reconstructTocFromBodyWithFallback(lineDf, spanDf = null, options = {}) {
  const result = reconstructTocFromBody(lineDf, spanDf, options);
  if (result.length > 0) return result;

  const relaxedThreshold = options.threshold ? options.threshold - 1.0 : 2.0;
  return reconstructTocFromBody(lineDf, spanDf, { ...options, threshold: relaxedThreshold });
}
