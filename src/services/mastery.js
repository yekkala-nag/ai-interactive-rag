/**
 * Mastery service v2 — Phase 3 of adaptive learning
 * Evidence model per topic: visit (seen) + quizBest (0..1 exit-check score)
 * score = 20 (visited) + 80 * quizBest, capped 100.
 * "Mastered" = score >= 70 (requires proving, not just visiting).
 * Legacy v1 toggles migrate to 100 flagged legacy (trust preserved).
 * Simulator interaction hooks in via recordEvidence(tabId, 'sim').
 */
import { getTopicMeta } from '../registry/curriculum.js';

const KEY_V2 = 'adaptive_mastery_v2';
const KEY_V1 = 'adaptive_completed_tabs';
const EVENT_NAME = 'adaptive-progress-updated';
const MASTERED_AT = 70;
const VISIT_POINTS = 20;
const QUIZ_POINTS = 80;

function broadcast() {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function load() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(KEY_V2);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupt → rebuild below */ }
  // One-time migration from v1 manual toggles
  let migrated = {};
  try {
    const v1 = localStorage.getItem(KEY_V1);
    if (v1) {
      const ids = JSON.parse(v1);
      for (const id of ids) {
        migrated[id] = { visit: true, quizBest: 1, sim: false, legacy: true, updatedAt: Date.now() };
      }
      localStorage.setItem(KEY_V2, JSON.stringify(migrated));
    }
  } catch (e) { /* noop */ }
  return migrated;
}

function persist(store) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_V2, JSON.stringify(store));
    // Bridge: mirror proven topics into the v1 list (add-only, never removes)
    // so track progress, prev/next navigation and the hub keep working.
    const v1raw = localStorage.getItem(KEY_V1);
    const v1 = v1raw ? JSON.parse(v1raw) : [];
    let touched = false;
    for (const [id, e] of Object.entries(store)) {
      const proven = e.legacy === true || masteryScoreOf(e) >= MASTERED_AT;
      if (proven && !v1.includes(id)) { v1.push(id); touched = true; }
    }
    if (touched) localStorage.setItem(KEY_V1, JSON.stringify(v1));
    broadcast();
  } catch (e) {
    console.error('Failed to save mastery', e);
  }
}

function masteryScoreOf(e) {
  if (e.legacy) return 100;
  let s = (e.visit ? VISIT_POINTS : 0) + QUIZ_POINTS * (e.quizBest || 0);
  if (e.sim) s = Math.min(100, s + 5);
  return Math.min(100, Math.round(s));
}

export function getEvidence(tabId) {
  const store = load();
  return store[tabId] || { visit: false, quizBest: 0, sim: false, legacy: false, updatedAt: 0 };
}

/** 0–100 mastery score for a topic. */
export function getMasteryScore(tabId) {
  const e = getEvidence(tabId);
  if (e.legacy) return 100;
  let s = 0;
  if (e.visit) s += VISIT_POINTS;
  s += QUIZ_POINTS * (e.quizBest || 0);
  if (e.sim) s = Math.min(100, s + 5); // small bonus: hands-on counts
  return Math.min(100, Math.round(s));
}

/** Mastered = proven (score >= 70) or legacy-claimed. */
export function isMastered(tabId) {
  const e = getEvidence(tabId);
  return e.legacy === true || getMasteryScore(tabId) >= MASTERED_AT;
}

export function recordVisit(tabId) {
  if (!tabId || typeof window === 'undefined') return;
  const store = load();
  const e = store[tabId] || { visit: false, quizBest: 0, sim: false, legacy: false, updatedAt: 0 };
  if (!e.visit) {
    store[tabId] = { ...e, visit: true, updatedAt: Date.now() };
    persist(store);
  }
}

/** Generic hook: simulators call recordEvidence(tabId, 'sim') on first real use. */
export function recordEvidence(tabId, kind = 'sim') {
  if (!tabId || typeof window === 'undefined') return;
  const store = load();
  const e = store[tabId] || { visit: true, quizBest: 0, sim: false, legacy: false, updatedAt: 0 };
  if (!e[kind]) {
    store[tabId] = { ...e, [kind]: true, visit: true, updatedAt: Date.now() };
    persist(store);
  }
}

/** Record an exit-check attempt; keeps the best score. Returns new score. */
export function recordQuiz(tabId, correct, total) {
  if (!tabId || typeof window === 'undefined') return 0;
  const ratio = total > 0 ? correct / total : 0;
  const store = load();
  const e = store[tabId] || { visit: true, quizBest: 0, sim: false, legacy: false, updatedAt: 0 };
  store[tabId] = {
    ...e,
    visit: true,
    legacy: false, // proving replaces claiming
    quizBest: Math.max(e.quizBest || 0, +ratio.toFixed(2)),
    updatedAt: Date.now()
  };
  persist(store);
  return getMasteryScore(tabId);
}

/** Next review date: proven topics resurface after ~14 days (Phase 4 queue reads this). */
export function getReviewDue(tabId) {
  const e = getEvidence(tabId);
  if (!e.updatedAt) return 0;
  return e.updatedAt + 14 * 86400 * 1000;
}

export function isReviewDue(tabId) {
  return isMastered(tabId) && Date.now() >= getReviewDue(tabId);
}

/** Track-level mastery summary for hub display. */
export function getTrackMastery(tabIds) {
  const scores = tabIds.map(getMasteryScore);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const proven = tabIds.filter(isMastered).length;
  return { avg, proven, total: tabIds.length };
}

export { MASTERED_AT };
