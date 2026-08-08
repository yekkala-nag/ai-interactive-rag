export function scoreFontSizeRatio(lineDf) {
  const sizes = lineDf.map(l => l.font_size).filter(s => s > 0);
  const median = computeMedian(sizes) || 10;
  return lineDf.map(l => {
    if (!l.font_size || l.font_size <= 0) return 0;
    const ratio = (l.font_size / median) - 1.0;
    return Math.max(0, Math.min(1.0, ratio));
  });
}

export function scoreIsBold(lineDf) {
  return lineDf.map(l => {
    if (l.bold_ratio !== undefined && l.bold_ratio !== null) {
      return Math.max(0, Math.min(1.0, l.bold_ratio));
    }
    return l.is_bold ? 1.0 : 0.0;
  });
}

export function scoreHasNumericPrefix(lineDf) {
  const prefixRegex = /^\s*(?:\d+(?:\.\d+)*\.?|[IVXLCDM]+\.|[A-Z]\.)(?:\s|$)/;
  return lineDf.map(l => {
    const text = (l.text || '').trim();
    if (prefixRegex.test(text)) {
      const match = text.match(/^(\d+(?:\.\d+)*\.?|[IVXLCDM]+\.|[A-Z]\.)/);
      if (match) {
        const parts = match[1].replace(/\.$/, '').split('.').filter(Boolean);
        l.candidate_level = parts.length > 0 ? parts.length : 1;
        return 1.0;
      }
    }
    l.candidate_level = undefined;
    return 0.0;
  });
}

export function scoreIsShort(lineDf) {
  return lineDf.map(l => {
    const len = (l.text || '').trim().length;
    if (len === 0) return 0.0;
    if (len <= 20) return 1.0;
    if (len >= 90) return 0.0;
    return 1.0 - (len - 20) / 70.0;
  });
}

export function scoreIsLeftAligned(lineDf) {
  const leftMargins = lineDf.map(l => l.x0).filter(x => x > 0);
  const medianLeft = computeMedian(leftMargins) || 0;
  const tolerance = 10;

  return lineDf.map(l => {
    if (medianLeft === 0) return 0.5;
    const diff = Math.abs(l.x0 - medianLeft);
    if (diff <= tolerance) return 1.0;
    if (diff >= tolerance * 3) return 0.0;
    return 1.0 - (diff - tolerance) / (tolerance * 2);
  });
}

export function scoreHasBlankBefore(lineDf) {
  const gaps = [];
  const pageLines = new Map();
  for (const l of lineDf) {
    const key = l.page_num;
    if (!pageLines.has(key)) pageLines.set(key, []);
    pageLines.get(key).push(l);
  }

  for (const [pageNum, lines] of pageLines) {
    lines.sort((a, b) => a.y0 - b.y0);
    for (let i = 1; i < lines.length; i++) {
      const gap = lines[i].y0 - lines[i - 1].y0;
      gaps.push({ page_num: pageNum, line_num: lines[i].line_num, gap });
    }
  }

  const pageMedianGaps = new Map();
  for (const g of gaps) {
    const key = g.page_num;
    if (!pageMedianGaps.has(key)) pageMedianGaps.set(key, []);
    pageMedianGaps.get(key).push(g.gap);
  }
  for (const [page, vals] of pageMedianGaps) {
    pageMedianGaps.set(page, computeMedian(vals));
  }

  const result = new Array(lineDf.length).fill(0.0);
  const lineIndex = new Map();
  lineDf.forEach((l, i) => lineIndex.set(`${l.page_num}-${l.line_num}`, i));

  for (const g of gaps) {
    const idx = lineIndex.get(`${g.page_num}-${g.line_num}`);
    if (idx === undefined) continue;
    const medianGap = pageMedianGaps.get(g.page_num) || 0;
    if (medianGap > 0 && g.gap > medianGap) {
      result[idx] = Math.min(1.0, (g.gap - medianGap) / medianGap);
    }
  }
  return result;
}

export const DEFAULT_WEIGHTS = {
  font_size_ratio: 1.4,
  is_bold: 1.0,
  has_numeric_prefix: 1.6,
  is_short: 0.6,
  is_left_aligned: 0.4,
  has_blank_before: 0.8,
};

export function detectBodyHeadings(lineDf, threshold = 3.0, weights = null) {
  const activeWeights = { ...DEFAULT_WEIGHTS, ...(weights || {}) };

  const signals = {
    font_size_ratio: scoreFontSizeRatio(lineDf),
    is_bold: scoreIsBold(lineDf),
    has_numeric_prefix: scoreHasNumericPrefix(lineDf),
    is_short: scoreIsShort(lineDf),
    is_left_aligned: scoreIsLeftAligned(lineDf),
    has_blank_before: scoreHasBlankBefore(lineDf),
  };

  const scoredLines = lineDf.map((line, i) => {
    let scoreSum = 0;
    for (const [key, w] of Object.entries(activeWeights)) {
      scoreSum += (signals[key]?.[i] || 0) * w;
    }

    return {
      ...line,
      heading_score: scoreSum,
      is_heading_candidate: scoreSum >= threshold,
      signal_font_size_ratio: signals.font_size_ratio[i],
      signal_is_bold: signals.is_bold[i],
      signal_has_numeric_prefix: signals.has_numeric_prefix[i],
      signal_is_short: signals.is_short[i],
      signal_is_left_aligned: signals.is_left_aligned[i],
      signal_has_blank_before: signals.has_blank_before[i],
      candidate_level: line.candidate_level || inferLevelFromText(line.text),
    };
  });

  return scoredLines.filter(l => l.is_heading_candidate);
}

export function mergeSplitHeadings(lineDf) {
  const merged = [];
  let i = 0;
  while (i < lineDf.length) {
    const current = { ...lineDf[i] };
    if (isBareNumberLine(current.text) && i + 1 < lineDf.length) {
      const next = lineDf[i + 1];
      if (next.page_num === current.page_num) {
        current.text = current.text.trim() + ' ' + next.text.trim();
        current.width = Math.max(current.width, (next.x0 + next.width) - current.x0);
        current.font_size = weightedAverageFontSizeFromLines([current, next]);
        current.bold_ratio = (current.bold_ratio + next.bold_ratio) / 2;
        current.is_bold = current.bold_ratio > 0.5;
        current.font_name = next.font_name || current.font_name;
        i += 2;
        merged.push(current);
        continue;
      }
    }
    i += 1;
    merged.push(current);
  }
  return merged;
}

function isBareNumberLine(text) {
  return /^\s*\d+\s*$/.test((text || '').trim());
}

function inferLevelFromText(text) {
  const match = (text || '').trim().match(/^(\d+(?:\.\d+)*\.?|[IVXLCDM]+\.|[A-Z]\.)/);
  if (match) {
    const parts = match[1].replace(/\.$/, '').split('.').filter(Boolean);
    return parts.length > 0 ? parts.length : 1;
  }
  return 1;
}

function weightedAverageFontSizeFromLines(lines) {
  let totalWeight = 0;
  let weightedSum = 0;
  for (const l of lines) {
    const w = (l.text || '').length;
    weightedSum += (l.font_size || 0) * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 10;
}

function computeMedian(arr) {
  if (!arr || !arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

