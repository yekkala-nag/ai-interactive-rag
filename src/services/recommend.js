/**
 * Recommendation engine — Phase 4 of adaptive learning
 * Next-best topics with "why this next" rationale, remediation routing
 * (weakest unmastered prerequisite), 14-day review queue, mastery aggregates.
 */
import { TABS_REGISTRY, UMBRELLA_TOPICS, getTabById } from '../registry/tabsRegistry.js';
import { getTopicMeta, getPrereqIds, getChildById, CHILD_UMBRELLAS } from '../registry/curriculum.js';
import { getMasteryScore, isMastered, getEvidence, isReviewDue, getReviewDue } from './mastery.js';
import { getTrackById, getPlacement } from './adaptiveLearning.js';

/** Topics this topic unlocks (reverse prereq edges), for rationale + priority. */
function unlockedBy(tabId) {
  return TABS_REGISTRY.filter(t => getPrereqIds(t.id).includes(tabId)).map(t => t.id);
}

/**
 * Rank unmastered, prerequisite-ready topics in a track.
 * Score: sequence order + retry priority + unlock value + placement fit + momentum.
 */
export function getNextBest(trackId, n = 3) {
  const track = getTrackById(trackId);
  if (!track) return [];
  const tabs = track.tabs;
  const placement = getPlacement();
  const indexOf = new Map(tabs.map((id, i) => [id, i]));
  const ranked = [];

  for (const id of tabs) {
    if (isMastered(id)) continue;
    const meta = getTopicMeta(id);
    const ev = getEvidence(id);
    const unmet = getPrereqIds(id).filter(p => !isMastered(p));
    if (unmet.length) continue; // not ready — its prereqs surface instead
    const reasons = [];
    let s = (tabs.length - (indexOf.get(id) || 0)) * 0.3; // respect curriculum sequence
    s += (4 - meta.l) * 2; // foundations before deep cuts
    reasons.push(meta.l === 1 ? 'Core level — builds everything above' : `L${meta.l} — prerequisites met`);

    if (ev.quizBest > 0 && ev.quizBest < 0.67) {
      s += 15;
      reasons.unshift(`Retry — last attempt ${Math.round(ev.quizBest * 100)}%`);
    }
    const unlocks = unlockedBy(id).filter(u => !isMastered(u));
    if (unlocks.length) {
      s += Math.min(6, unlocks.length * 2);
      reasons.push(`Unlocks ${unlocks.length} topic${unlocks.length === 1 ? '' : 's'}`);
    }
    const tab = getTabById(id);
    const placed = placement && placement.levels ? placement.levels[tab ? tab.umbrellaId : ''] : 0;
    if (placed && placed >= meta.l) {
      s += 4;
      reasons.push('At your placed level');
    }
    ranked.push({ id, score: +s.toFixed(1), reasons: reasons.slice(0, 2) });
  }
  return ranked.sort((a, b) => b.score - a.score).slice(0, n);
}

/**
 * Remediation: weakest unmastered prerequisite in the closure (BFS).
 * Returns null when the foundation is solid — the fix is retry, not reroute.
 */
export function getRemediation(tabId) {
  const seen = new Set();
  const queue = [...getPrereqIds(tabId)];
  let weakest = null;
  while (queue.length) {
    const id = queue.shift();
    if (seen.has(id)) continue;
    seen.add(id);
    if (!isMastered(id)) {
      const sc = getMasteryScore(id);
      if (!weakest || sc < weakest.score) {
        const tab = getTabById(id);
        weakest = { id, label: tab ? tab.label : id, icon: tab ? tab.icon : '📝', score: sc };
      }
    }
    queue.push(...getPrereqIds(id));
  }
  return weakest;
}

/** Mastered topics past their 14-day review date, most overdue first. */
export function getReviewQueue(limit = 20) {
  return TABS_REGISTRY
    .filter(t => isMastered(t.id) && isReviewDue(t.id))
    .map(t => ({ id: t.id, label: t.label, icon: t.icon, overdueDays: Math.floor((Date.now() - getReviewDue(t.id)) / 86400000) }))
    .sort((a, b) => b.overdueDays - a.overdueDays)
    .slice(0, limit);
}

/** Average mastery + proven counts per umbrella (hub rings). */
export function getUmbrellaMastery() {
  return UMBRELLA_TOPICS.map(u => {
    const scores = u.tabs.map(getMasteryScore);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return {
      id: u.id, title: u.title, icon: u.icon, color: u.color,
      avg, proven: u.tabs.filter(isMastered).length, total: u.tabs.length
    };
  });
}

/** Average mastery per child umbrella (detail drill-down). */
export function getChildMastery(umbrellaId) {
  return CHILD_UMBRELLAS.filter(c => c.umbrellaId === umbrellaId).map(c => {
    const ids = TABS_REGISTRY.filter(t => getTopicMeta(t.id).c === c.id).map(t => t.id);
    const scores = ids.map(getMasteryScore);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { id: c.id, title: c.title, avg, proven: ids.filter(isMastered).length, total: ids.length };
  });
}

/** Any learning evidence at all (fresh-user empty state). */
export function hasAnyEvidence() {
  return TABS_REGISTRY.some(t => {
    const e = getEvidence(t.id);
    return e.visit || (e.quizBest || 0) > 0;
  });
}
