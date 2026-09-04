/**
 * Adaptive Learning Engine & Curriculum Track Registry
 * 
 * Manages adaptive pathways, diagnostic sequence generation,
 * mastery tracking, and cross-tab workflow progression.
 */

import { getTabById, TABS_REGISTRY } from '../registry/tabsRegistry.js';

export const ADAPTIVE_TRACKS = [
  {
    id: 'foundations',
    title: 'AI Foundations & Engineering',
    tagline: 'From first API calls to prompt architectures & self-attention',
    description: 'Recommended for all learners and engineers new to LLM internals. Master prompts, token sampling, attention mechanics, and structured outputs before diving into complex retrieval architectures.',
    level: 'Beginner to Intermediate',
    badgeVariant: 'module',
    duration: '45 mins',
    icon: '🌱',
    color: '#0D9488',
    startingTab: 'firstaiapp',
    tabs: [
      'firstaiapp',
      'promptfundamentals',
      'llmsampling',
      'selfattention',
      'structuredoutputs',
      'archconcepts',
      'workflows',
      'rag'
    ]
  },
  {
    id: 'rag_specialist',
    title: 'Production RAG Systems',
    tagline: 'High-precision retrieval, chunking, reranking & hierarchical fusion',
    description: 'Specialized track for building resilient retrieval augmented generation systems that scale with low latency, high context relevancy, and minimal hallucination.',
    level: 'Intermediate to Advanced',
    badgeVariant: 'primary',
    duration: '60 mins',
    icon: '⚡',
    color: '#2563eb',
    startingTab: 'rag',
    tabs: [
      'rag',
      'ragchunking',
      'qparseloop',
      'filtering',
      'hierrag',
      'prodrag',
      'workflowloop',
      'ragcasestudies'
    ]
  },
  {
    id: 'agent_architect',
    title: 'Autonomous Agent Architectures',
    tagline: 'Tool use, multi-agent coordination, LangChain, LangGraph & ReAct loops',
    description: 'Deep dive into orchestrating autonomous agents. Build CLI agents, typed gatekeepers, multi-agent swarms, and stateful graph workflows.',
    level: 'Advanced',
    badgeVariant: 'accent',
    duration: '75 mins',
    icon: '🤖',
    color: '#7c3aed',
    startingTab: 'fiveassets',
    tabs: [
      'fiveassets',
      'cliagent',
      'agentpairprogramming',
      'agentsastools',
      'multiagent',
      'langchain',
      'langgraph',
      'loopengineering'
    ]
  },
  {
    id: 'enterprise_ops',
    title: 'Enterprise AI Ops & FinOps',
    tagline: 'Token orchestration, model routing, evaluations & zero-latency ops',
    description: 'Architecting cost-effective, audited, and resilient production systems. Master LLM evals, zero-model routers, latency budgets, and token billing optimization.',
    level: 'Enterprise Ready',
    badgeVariant: 'success',
    duration: '55 mins',
    icon: '🏢',
    color: '#059669',
    startingTab: 'tokenorchestrationplaybook',
    tabs: [
      'tokenorchestrationplaybook',
      'routercheap',
      'llmevals',
      'productionragops',
      'enterpriseaiops',
      'enterpriseadvancedplaybook'
    ]
  },
  {
    id: 'full_mastery',
    title: 'Full Systems Mastery',
    tagline: 'The complete end-to-end curriculum spanning all 6 core pillars',
    description: 'A comprehensive journey through modern AI engineering: foundations, retrieval, memory, agents, platform data layers, and production operations.',
    level: 'Comprehensive',
    badgeVariant: 'warning',
    duration: '3.5 hours',
    icon: '👑',
    color: '#d97706',
    startingTab: 'firstaiapp',
    tabs: [
      'firstaiapp',
      'promptfundamentals',
      'llmsampling',
      'selfattention',
      'structuredoutputs',
      'archconcepts',
      'workflows',
      'rag',
      'ragchunking',
      'qparseloop',
      'filtering',
      'hierrag',
      'prodrag',
      'workflowloop',
      'ragcasestudies',
      'ctxeng',
      'memeng',
      'fiveassets',
      'cliagent',
      'agentpairprogramming',
      'multiagent',
      'langchain',
      'langgraph',
      'loopengineering',
      'threelayers',
      'docstruct',
      'modernioformats',
      'tokenorchestrationplaybook',
      'routercheap',
      'llmevals',
      'productionragops',
      'enterpriseaiops',
      'enterpriseadvancedplaybook'
    ]
  }
];

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
  return ADAPTIVE_TRACKS.find(t => t.id === trackId) || ADAPTIVE_TRACKS[0];
}

export function getCurrentTrackId() {
  if (typeof window === 'undefined') return 'foundations';
  const saved = localStorage.getItem(STORAGE_KEY_TRACK);
  if (saved && ADAPTIVE_TRACKS.some(t => t.id === saved)) {
    return saved;
  }
  return 'foundations';
}

export function setCurrentTrackId(trackId) {
  if (typeof window === 'undefined') return;
  if (ADAPTIVE_TRACKS.some(t => t.id === trackId)) {
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
    const startTabId = track.startingTab || track.tabs[0];
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
 * Diagnostic logic to recommend a customized track
 */
export function diagnoseTrack({ experience = 'beginner', goal = 'foundations', focus = 'concepts' } = {}) {
  // Logic rules
  if (experience === 'beginner' || goal === 'foundations') {
    return {
      trackId: 'foundations',
      startingTab: 'firstaiapp',
      rationale: 'Starting with core AI fundamentals will give you the deepest grounding in token sampling, prompting, and attention before moving to retrieval systems.'
    };
  }

  if (goal === 'rag') {
    return {
      trackId: 'rag_specialist',
      startingTab: 'rag',
      rationale: 'Your goal is production retrieval. Jump straight into hybrid search, chunking strategies, and query decomposition loops.'
    };
  }

  if (goal === 'agents') {
    return {
      trackId: 'agent_architect',
      startingTab: 'fiveassets',
      rationale: 'Focus on autonomous decision loops, multi-agent frameworks, tool dispatching, and LangGraph state machines.'
    };
  }

  if (goal === 'enterprise') {
    return {
      trackId: 'enterprise_ops',
      startingTab: 'tokenorchestrationplaybook',
      rationale: 'Target high-scale production: routing token costs, evaluation harnesses, zero-model fallbacks, and SLA monitoring.'
    };
  }

  if (experience === 'advanced') {
    return {
      trackId: 'full_mastery',
      startingTab: 'firstaiapp',
      rationale: 'With your advanced background, conquer the comprehensive 33-step roadmap across all modern AI layers.'
    };
  }

  return {
    trackId: 'foundations',
    startingTab: 'firstaiapp',
    rationale: 'A balanced track covering the modern AI stack from the ground up.'
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
