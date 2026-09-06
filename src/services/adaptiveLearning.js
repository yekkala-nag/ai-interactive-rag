/**
 * Adaptive Learning Engine & Curriculum Track Registry
 * 
 * Manages adaptive pathways, diagnostic sequence generation,
 * mastery tracking, and cross-tab workflow progression.
 */

import { getTabById, TABS_REGISTRY, UMBRELLA_TOPICS } from '../registry/tabsRegistry.js';
import { CHILD_UMBRELLAS, getTopicMeta, getPrereqIds } from '../registry/curriculum.js';
import { ROLE_PATHS, JOURNEY_LOOPS } from '../registry/diagnostics.js';

/** Stable, bounded: prerequisites precede dependents whenever both are listed. */
function repairOrder(ids) {
  const pos = new Map(ids.map((id, i) => [id, i]));
  let changed = true, guard = 0;
  while (changed && guard++ < 12) {
    changed = false;
    for (const id of [...ids]) {
      for (const p of getPrereqIds(id)) {
        if (pos.has(p) && pos.get(p) > pos.get(id)) {
          ids.splice(ids.indexOf(p), 1);
          ids.splice(ids.indexOf(id), 0, p);
          ids.forEach((x, i) => pos.set(x, i));
          changed = true;
        }
      }
    }
  }
  return ids;
}

/**
 * Build an ordered tab list for a role spec: children in spec order,
 * topics in registry order filtered by max level, then DAG repair so
 * prerequisites always precede dependents (when both are in the track).
 */
export function buildTrackTabs(roleId) {
  const spec = ROLE_PATHS[roleId];
  if (!spec) return [];
  const orderIndex = new Map();
  TABS_REGISTRY.forEach((t, i) => orderIndex.set(t.id, i));
  let children = spec.children;
  if (!children) {
    // full_mastery: every child umbrella in curriculum order, all levels
    const umbOrder = new Map(UMBRELLA_TOPICS.map((u, i) => [u.id, i]));
    children = [...CHILD_UMBRELLAS]
      .sort((a, b) => (umbOrder.get(a.umbrellaId) - umbOrder.get(b.umbrellaId)) || (a.order - b.order))
      .map(c => ({ child: c.id, max: 3 }));
  }
  const ids = [];
  const SKIP = new Set(['overview', 'progress']); // hub / tracker pages, not learning topics
  for (const { child, max } of children) {
    const inChild = TABS_REGISTRY.filter(t => {
      const m = getTopicMeta(t.id);
      return m.c === child && m.l <= max;
    }).sort((a, b) => orderIndex.get(a.id) - orderIndex.get(b.id));
    for (const t of inChild) if (!ids.includes(t.id) && !SKIP.has(t.id)) ids.push(t.id);
  }
  return repairOrder(ids.filter(id => TABS_REGISTRY.some(t => t.id === id)));
}

/**
 * Journey loops: explicit story order from JOURNEY_LOOPS, registry-validated,
 * then the same DAG repair. Cross-loop prerequisites are assumed met by
 * earlier loops (validated separately).
 */
export function buildJourneyTabs(loopId) {
  const spec = JOURNEY_LOOPS[loopId];
  if (!spec) return [];
  const valid = new Set(TABS_REGISTRY.map(t => t.id));
  const ids = spec.order.filter(id => valid.has(id));
  return repairOrder(ids);
}

function estimateDuration(tabCount) {
  const mins = tabCount * 7;
  if (mins < 60) return `~${mins} mins`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `~${h}h ${m}m` : `~${h} hours`;
}

function makeTrack(id) {
  const spec = ROLE_PATHS[id];
  const tabs = buildTrackTabs(id);
  // No hardcoded on-ramp: track order IS the pedagogy (orient → terms → build).
  // Placement skipping (applyPlacementToTrack) moves proven learners forward.
  const startingTab = (spec.start && tabs.includes(spec.start)) ? spec.start : tabs[0];
  return {
    id,
    title: spec.trackTitle,
    tagline: spec.tagline,
    description: spec.description,
    level: spec.level,
    badgeVariant: spec.badgeVariant,
    duration: estimateDuration(tabs.length),
    icon: spec.icon,
    color: spec.color,
    startingTab,
    tabs
  };
}

// Generated from the curriculum DAG — never hand-edit lists here;
// change ROLE_PATHS (diagnostics.js) or TOPIC_META (curriculum.js).
export const ADAPTIVE_TRACKS = [
  'foundations',
  'rag_specialist',
  'agent_architect',
  'enterprise_ops',
  'data_engineer',
  'full_mastery'
].map(makeTrack);

function makeJourney(id) {
  const spec = JOURNEY_LOOPS[id];
  const tabs = buildJourneyTabs(id);
  return {
    id,
    title: spec.trackTitle,
    tagline: spec.tagline,
    description: spec.description,
    level: spec.level,
    badgeVariant: spec.badgeVariant,
    duration: estimateDuration(tabs.length),
    icon: spec.icon,
    color: spec.color,
    startingTab: tabs[0],
    tabs
  };
}

// The spiral: same shape as role tracks, so every consumer (bar, hub,
// progress, prev/next) works unchanged.
export const JOURNEY_TRACKS = [
  'journey_loop1',
  'journey_loop2',
  'journey_loop3'
].map(makeJourney);

const ALL_TRACKS = [...ADAPTIVE_TRACKS, ...JOURNEY_TRACKS];

const STORAGE_KEY_TRACK = 'adaptive_current_track';
const STORAGE_KEY_COMPLETED = 'adaptive_completed_tabs';
const STORAGE_KEY_ACTIVE = 'adaptive_active_tab';
const EVENT_NAME = 'adaptive-progress-updated';

/**
 * Dispatch an internal event so all components update immediately
 */
function broadcastProgressChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function getTracks() {
  return ADAPTIVE_TRACKS;
}

export function getTrackById(trackId) {
  return ALL_TRACKS.find(t => t.id === trackId) || ADAPTIVE_TRACKS[0];
}

export function getCurrentTrackId() {
  if (typeof window === 'undefined') return 'foundations';
  const saved = localStorage.getItem(STORAGE_KEY_TRACK);
  if (saved && saved !== 'rag' && ALL_TRACKS.some(t => t.id === saved)) {
    return saved;
  }
  return 'foundations';
}

export function setCurrentTrackId(trackId) {
  if (typeof window === 'undefined') return;
  if (ALL_TRACKS.some(t => t.id === trackId)) {
    localStorage.setItem(STORAGE_KEY_TRACK, trackId);
    broadcastProgressChange();
  }
}

export function getCompletedTabs() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isTabMastered(tabId) {
  const completed = getCompletedTabs();
  return completed.includes(tabId);
}

export function toggleTabMastery(tabId) {
  if (typeof window === 'undefined') return false;
  const completed = getCompletedTabs();
  let updated;
  const wasMastered = completed.includes(tabId);
  if (wasMastered) {
    updated = completed.filter(id => id !== tabId);
  } else {
    updated = [...completed, tabId];
  }
  try {
    localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(updated));
    broadcastProgressChange();
  } catch (e) {
    console.error('Failed to save adaptive progress', e);
  }
  return !wasMastered;
}

export function getTrackProgress(trackId) {
  const track = getTrackById(trackId);
  const completed = getCompletedTabs();
  const trackTabSet = new Set(track.tabs);
  const completedInTrack = completed.filter(id => trackTabSet.has(id)).length;
  const total = track.tabs.length;
  const percent = total > 0 ? Math.round((completedInTrack / total) * 100) : 0;
  return {
    completed: completedInTrack,
    total,
    percent
  };
}

/**
 * Returns previous topic in the given track or umbrella fallback
 */
export function getPreviousTopic(currentTabId, trackId = getCurrentTrackId()) {
  if (currentTabId === 'overview') return null;
  const track = getTrackById(trackId);
  const index = track.tabs.indexOf(currentTabId);
  if (index > 0) {
    const prevId = track.tabs[index - 1];
    return {
      tabId: prevId,
      tab: getTabById(prevId),
      isFirst: index - 1 === 0,
      inTrack: true
    };
  }
  if (index === 0) {
    return {
      tabId: 'overview',
      tab: { id: 'overview', label: 'Adaptive Hub', icon: '🎯' },
      isFirst: true,
      inTrack: false
    };
  }
  // If current tab is outside active track, fallback to previous tab in registry
  const regIndex = TABS_REGISTRY.findIndex(t => t.id === currentTabId);
  if (regIndex > 0) {
    const prevId = TABS_REGISTRY[regIndex - 1].id;
    return {
      tabId: prevId,
      tab: getTabById(prevId),
      isFirst: regIndex - 1 === 0,
      inTrack: false
    };
  }
  return null;
}

/**
 * Returns next topic in the given track or umbrella fallback
 */
export function getNextTopic(currentTabId, trackId = getCurrentTrackId()) {
  const track = getTrackById(trackId);
  if (currentTabId === 'overview') {
    const startTabId = track.id === 'foundations' ? 'firstaiapp' : (track.startingTab || 'firstaiapp');
    return {
      tabId: startTabId,
      tab: getTabById(startTabId),
      isLast: false,
      inTrack: true
    };
  }

  const index = track.tabs.indexOf(currentTabId);
  if (index >= 0 && index < track.tabs.length - 1) {
    const nextId = track.tabs[index + 1];
    return {
      tabId: nextId,
      tab: getTabById(nextId),
      isLast: index + 1 === track.tabs.length - 1,
      inTrack: true
    };
  }

  if (index === track.tabs.length - 1) {
    return {
      tabId: 'overview',
      tab: { id: 'overview', label: 'Track Completed! View Hub', icon: '🏆' },
      isLast: true,
      isCompleted: true,
      inTrack: true
    };
  }

  // If tab is outside active track, jump to the track's next uncompleted or starting topic
  const nextUncompleted = track.tabs.find(id => !isTabMastered(id)) || track.startingTab;
  return {
    tabId: nextUncompleted,
    tab: getTabById(nextUncompleted),
    isLast: false,
    inTrack: true
  };
}

/**
 * Placement storage (quiz results): { levels: {umbrellaId: 1|2|3}, goal, date }
 */
const STORAGE_KEY_PLACEMENT = 'adaptive_placement_v1';

export function savePlacement(placement) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PLACEMENT, JSON.stringify({ ...placement, date: Date.now() }));
    broadcastProgressChange();
  } catch (e) {
    console.error('Failed to save placement', e);
  }
}

export function getPlacement() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLACEMENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearPlacement() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_PLACEMENT);
    broadcastProgressChange();
  } catch (e) { /* noop */ }
}

/**
 * Apply a placement to a track's tab list: topics in an umbrella at levels
 * strictly below the placed level are marked skippable. Returns the
 * effective start tab (first non-skipped) plus skip statistics.
 */
export function applyPlacementToTrack(trackTabs, placement) {
  if (!placement || !placement.levels) {
    return { startTab: trackTabs[0], skipped: [], skippedCount: 0 };
  }
  const skipped = trackTabs.filter(id => {
    const tab = getTabById(id);
    if (!tab) return false;
    const placed = placement.levels[tab.umbrellaId];
    if (!placed || placed <= 1) return false;
    return getTopicMeta(id).l < placed;
  });
  const remaining = trackTabs.filter(id => !skipped.includes(id));
  return { startTab: remaining[0] || trackTabs[0], skipped, skippedCount: skipped.length };
}

/**
 * Diagnostic logic to recommend a customized track.
 * v2: when quiz placement exists, the start tab skips tested-out levels
 * and the rationale reports exactly what was skipped.
 */
export function diagnoseTrack({ experience = 'beginner', goal = 'foundations', focus = 'concepts', placement = null } = {}) {
  const quiz = placement || getPlacement();
  const goalMap = {
    foundations: 'foundations',
    rag: 'rag_specialist',
    agents: 'agent_architect',
    enterprise: 'enterprise_ops',
    data: 'data_engineer'
  };

  const fallbackRationale = {
    foundations: 'Starting with core AI fundamentals will give you the deepest grounding in token sampling, prompting, and attention before moving to retrieval systems.',
    rag_specialist: 'Your goal is production retrieval. The DAG-ordered path runs core pipeline → precision layer → advanced architectures → eval gates.',
    agent_architect: 'Focus on agent assets and prep, then planners, safety gates and evals before orchestration frameworks and production.',
    enterprise_ops: 'Target high-scale production: reliability gates first, then cost control, tracing, hardened safety, and scale-proof retrieval.',
    data_engineer: 'Feed AI systems well: data foundations, document pipelines and vector search, ML breadth, then the eval discipline that proves the bytes.',
    full_mastery: 'The comprehensive curriculum in DAG order across all six umbrellas.'
  };

  let trackId;
  if (goal && goalMap[goal]) trackId = goalMap[goal];
  else if (experience === 'advanced') trackId = 'full_mastery';
  else trackId = 'foundations';

  const track = getTrackById(trackId);
  if (quiz && quiz.levels) {
    const applied = applyPlacementToTrack(track.tabs, quiz);
    const testedOut = Object.entries(quiz.levels)
      .filter(([, lvl]) => lvl > 1)
      .map(([u, lvl]) => `${(UMBRELLA_TOPICS.find(x => x.id === u) || { title: u }).title} → L${lvl}`)
      .join('; ');
    return {
      trackId,
      startingTab: applied.startTab,
      skipped: applied.skipped,
      rationale: testedOut
        ? `Quiz placed you at ${testedOut}. Skipping ${applied.skippedCount} proven topic${applied.skippedCount === 1 ? '' : 's'} — you start at “${(getTabById(applied.startTab) || {}).label}”.`
        : `Quiz confirms L1 starts across the board — the full path is yours, in dependency order.`
    };
  }

  return {
    trackId,
    startingTab: track.startingTab,
    rationale: fallbackRationale[trackId] || fallbackRationale.foundations
  };
}

/**
 * Hook/Listener helper for React components
 */
export function subscribeToAdaptiveProgress(callback) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener('storage', callback);
  };
}
