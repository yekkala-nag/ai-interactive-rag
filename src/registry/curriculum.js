/**
 * Curriculum Registry — Phase 1 of adaptive learning
 * Hierarchy: umbrella topic → child umbrella → topics
 * Each topic carries: child, level (1 Core / 2 Practitioner / 3 Advanced),
 * prerequisites (topic ids). Pure data + helpers; no UI behavior change.
 */

export const LEVELS = {
  1: { label: 'L1 · Core', short: 'L1', color: '#10b981', blurb: 'Entry points. No prerequisites.' },
  2: { label: 'L2 · Practitioner', short: 'L2', color: '#38bdf8', blurb: 'Builds on L1. Hands-on patterns.' },
  3: { label: 'L3 · Advanced', short: 'L3', color: '#c9a84c', blurb: 'Deep / high-stakes. Needs L2.' }
};

export const CHILD_UMBRELLAS = [
  // ── Foundations & Architecture ──
  { id: 'fnd_start', umbrellaId: 'foundations', title: 'Start Here', blurb: 'First builds, glossary, orientation', order: 1 },
  { id: 'fnd_internals', umbrellaId: 'foundations', title: 'Model Internals', blurb: 'Sampling, attention, models, tokens, serving', order: 2 },
  { id: 'fnd_prompts', umbrellaId: 'foundations', title: 'Prompt Lifecycle', blurb: 'From first prompt to contracts & regression', order: 3 },
  { id: 'fnd_mlsoc', umbrellaId: 'foundations', title: 'ML & Society', blurb: 'RL, alignment, dialogue, topic modeling', order: 4 },
  // ── RAG Architectures & Pipelines ──
  { id: 'rag_core', umbrellaId: 'rag_architecture', title: 'RAG Core', blurb: 'Architectures, pipeline, chunking, parsing', order: 1 },
  { id: 'rag_precision', umbrellaId: 'rag_architecture', title: 'Retrieval Precision', blurb: 'Rerank, eval, tables, multilingual, vision', order: 2 },
  { id: 'rag_advanced', umbrellaId: 'rag_architecture', title: 'Advanced RAG', blurb: 'Production, agents, graphs, SQL, verification', order: 3 },
  { id: 'rag_practice', umbrellaId: 'rag_architecture', title: 'RAG in Practice', blurb: 'Case studies, interview prep', order: 4 },
  // ── Context & Memory Engineering ──
  { id: 'ctx_craft', umbrellaId: 'context_memory', title: 'Context Craft', blurb: 'Curation, vagueness, hallucinations, measurement', order: 1 },
  { id: 'ctx_memory', umbrellaId: 'context_memory', title: 'Memory Systems', blurb: 'Tiers, graphs, company brain', order: 2 },
  { id: 'ctx_long', umbrellaId: 'context_memory', title: 'Long Context', blurb: 'Limits, tactics, compression', order: 3 },
  // ── Agent Systems & Frameworks ──
  { id: 'agt_found', umbrellaId: 'agents_frameworks', title: 'Agent Foundations', blurb: 'Assets, assets-first process, prep, tools', order: 1 },
  { id: 'agt_safety', umbrellaId: 'agents_frameworks', title: 'Planning & Safety', blurb: 'Planners, HITL, sandboxes, evals, gates', order: 2 },
  { id: 'agt_multi', umbrellaId: 'agents_frameworks', title: 'Multi-Agent & Frameworks', blurb: 'Orchestration, A2A, LangChain/Graph, MCP', order: 3 },
  { id: 'agt_prod', umbrellaId: 'agents_frameworks', title: 'Agents in Production', blurb: 'CLI, pair programming, scale, product', order: 4 },
  // ── Data & Platform Layers ──
  { id: 'data_found', umbrellaId: 'data_platform', title: 'Data Foundations', blurb: 'Frames, regression, I/O, storytelling', order: 1 },
  { id: 'data_docs', umbrellaId: 'data_platform', title: 'Document Intelligence', blurb: 'Parsing, KBs, vector search, pipelines', order: 2 },
  { id: 'data_ml', umbrellaId: 'data_platform', title: 'Classical + Self-Supervised ML', blurb: 'ML tools, fraud, VAEs, BYOL, LSTMs', order: 3 },
  { id: 'data_scale', umbrellaId: 'data_platform', title: 'Platform & Scale', blurb: 'Lakehouse, profiling, finetuning, use cases', order: 4 },
  // ── Production & Frontiers ──
  { id: 'fr_eval', umbrellaId: 'frontiers_production', title: 'Eval & Reliability', blurb: 'Evals, reasoning, guardrails, fault tolerance', order: 1 },
  { id: 'fr_ops', umbrellaId: 'frontiers_production', title: 'Cost & Ops', blurb: 'FinOps, tracing, AgentOps, playbooks', order: 2 },
  { id: 'fr_frontiers', umbrellaId: 'frontiers_production', title: 'Frontiers', blurb: 'Vision, diffusion, speech, edge SLMs', order: 3 }
];

// TOPIC_META: tabId → { c: childId, l: level 1|2|3, p: [prerequisite tabIds] }
export const TOPIC_META = {
  // ── Foundations (23) ──
  overview: { c: 'fnd_start', l: 1, p: [] },
  glossary: { c: 'fnd_start', l: 1, p: [] },
  firstaiapp: { c: 'fnd_start', l: 1, p: ['promptfundamentals', 'tokenization'] },
  promptfundamentals: { c: 'fnd_prompts', l: 1, p: [] },
  llmsampling: { c: 'fnd_internals', l: 1, p: [] },
  selfattention: { c: 'fnd_internals', l: 1, p: ['llmsampling'] },
  archconcepts: { c: 'fnd_internals', l: 1, p: ['selfattention'] },
  tokenization: { c: 'fnd_internals', l: 1, p: [] },
  modellandscape: { c: 'fnd_internals', l: 2, p: ['archconcepts'] },
  quantserve: { c: 'fnd_internals', l: 2, p: ['modellandscape'] },
  aiharness: { c: 'fnd_internals', l: 2, p: ['archconcepts'] },
  promptmgmt: { c: 'fnd_prompts', l: 1, p: ['promptfundamentals'] },
  structuredoutputs: { c: 'fnd_prompts', l: 2, p: ['promptfundamentals'] },
  workflows: { c: 'fnd_prompts', l: 2, p: ['promptfundamentals'] },
  unhobbling: { c: 'fnd_prompts', l: 2, p: ['promptfundamentals'] },
  promptlearning: { c: 'fnd_prompts', l: 2, p: ['promptmgmt'] },
  promptdependencygraph: { c: 'fnd_prompts', l: 2, p: ['promptmgmt'] },
  promptcontracts: { c: 'fnd_prompts', l: 3, p: ['promptdependencygraph'] },
  promptregression: { c: 'fnd_prompts', l: 3, p: ['promptdependencygraph'] },
  topicmodeling: { c: 'fnd_mlsoc', l: 2, p: ['firstaiapp'] },
  reinforcementlearning: { c: 'fnd_mlsoc', l: 2, p: ['firstaiapp'] },
  aimoralagency: { c: 'fnd_mlsoc', l: 2, p: ['reinforcementlearning'] },
  dialoguelamda: { c: 'fnd_mlsoc', l: 2, p: ['selfattention'] },
  // ── RAG (26) ──
  rag: { c: 'rag_core', l: 1, p: [] },
  pipeline: { c: 'rag_core', l: 1, p: ['rag'] },
  ragchunking: { c: 'rag_core', l: 1, p: ['rag'] },
  qparseloop: { c: 'rag_core', l: 1, p: ['rag'] },
  filtering: { c: 'rag_core', l: 1, p: ['rag'] },
  ragcorpusshapes: { c: 'rag_core', l: 2, p: ['rag'] },
  hierrag: { c: 'rag_precision', l: 2, p: ['ragchunking'] },
  rerankers: { c: 'rag_precision', l: 2, p: ['filtering'] },
  rageval: { c: 'rag_precision', l: 2, p: ['filtering'] },
  rowlevelrag: { c: 'rag_precision', l: 2, p: ['ragchunking'] },
  tablegridrag: { c: 'rag_precision', l: 2, p: ['ragchunking'] },
  crossdocjoins: { c: 'rag_precision', l: 2, p: ['tablegridrag'] },
  multilingualrag: { c: 'rag_precision', l: 2, p: ['filtering'] },
  multimodalrag: { c: 'rag_precision', l: 2, p: ['tablegridrag'] },
  prodrag: { c: 'rag_advanced', l: 2, p: ['pipeline'] },
  routercheap: { c: 'rag_advanced', l: 2, p: ['pipeline'] },
  genpatterns: { c: 'rag_advanced', l: 2, p: ['pipeline'] },
  fourpdfs: { c: 'rag_advanced', l: 2, p: ['prodrag'] },
  hallucbricks: { c: 'rag_advanced', l: 3, p: ['rageval'] },
  workflowloop: { c: 'rag_advanced', l: 3, p: ['prodrag'] },
  proxypointer: { c: 'rag_advanced', l: 3, p: ['hierrag'] },
  agenticrag: { c: 'rag_advanced', l: 3, p: ['workflowloop'] },
  graphtraversalknowledge: { c: 'rag_advanced', l: 3, p: ['hierrag'] },
  texttosql: { c: 'rag_advanced', l: 3, p: ['tablegridrag'] },
  ragcasestudies: { c: 'rag_practice', l: 2, p: ['prodrag'] },
  interviewprep: { c: 'rag_practice', l: 2, p: ['rag'] },
  // ── Context & Memory (10) ──
  ctxeng: { c: 'ctx_craft', l: 1, p: [] },
  vague: { c: 'ctx_craft', l: 1, p: ['ctxeng'] },
  hallucination: { c: 'ctx_craft', l: 2, p: ['ctxeng'] },
  ctxmeasure: { c: 'ctx_craft', l: 2, p: ['ctxeng'] },
  memeng: { c: 'ctx_memory', l: 1, p: ['ctxeng'] },
  memhierarchy: { c: 'ctx_memory', l: 2, p: ['memeng'] },
  contextgraph: { c: 'ctx_memory', l: 2, p: ['memeng'] },
  companybrain: { c: 'ctx_memory', l: 2, p: ['contextgraph'] },
  contextlimits: { c: 'ctx_long', l: 1, p: ['ctxeng'] },
  longcontext: { c: 'ctx_long', l: 2, p: ['contextlimits'] },
  // ── Agents & Frameworks (24) ──
  fiveassets: { c: 'agt_found', l: 1, p: [] },
  redesign: { c: 'agt_found', l: 1, p: [] },
  projectprepframework: { c: 'agt_found', l: 1, p: ['fiveassets'] },
  agentsastools: { c: 'agt_found', l: 1, p: ['fiveassets'] },
  agenttasks: { c: 'agt_found', l: 1, p: ['fiveassets'] },
  codingagentsnonprog: { c: 'agt_found', l: 1, p: [] },
  agentplanner: { c: 'agt_safety', l: 2, p: ['fiveassets'] },
  agenthitl: { c: 'agt_safety', l: 2, p: ['agentplanner'] },
  agentsandbox: { c: 'agt_safety', l: 2, p: ['agenthitl'] },
  agentevals: { c: 'agt_safety', l: 2, p: ['agentplanner'] },
  agentdebugging: { c: 'agt_safety', l: 2, p: ['agentplanner'] },
  typedagentgate: { c: 'agt_safety', l: 2, p: ['agentsandbox'] },
  multiagent: { c: 'agt_multi', l: 2, p: ['agentsastools'] },
  agenta2a: { c: 'agt_multi', l: 3, p: ['multiagent'] },
  langchain: { c: 'agt_multi', l: 2, p: ['agentsastools'] },
  langgraph: { c: 'agt_multi', l: 3, p: ['langchain'] },
  compare: { c: 'agt_multi', l: 2, p: ['langchain'] },
  mcpclient: { c: 'agt_multi', l: 2, p: ['agentsastools'] },
  loopengineering: { c: 'agt_multi', l: 3, p: ['agentplanner'] },
  cliagent: { c: 'agt_prod', l: 2, p: ['fiveassets'] },
  agentpairprogramming: { c: 'agt_prod', l: 2, p: ['cliagent'] },
  claudecode100: { c: 'agt_prod', l: 3, p: ['agentpairprogramming'] },
  agentscale: { c: 'agt_prod', l: 3, p: ['multiagent'] },
  aiproductbuilder: { c: 'agt_prod', l: 2, p: ['projectprepframework'] },
  // ── Data & Platform (26) ──
  pandasdataframes: { c: 'data_found', l: 1, p: [] },
  linearregression: { c: 'data_found', l: 1, p: [] },
  modernioformats: { c: 'data_found', l: 1, p: ['pandasdataframes'] },
  activelearn: { c: 'data_found', l: 1, p: ['linearregression'] },
  datahumanization: { c: 'data_found', l: 1, p: [] },
  aiusecases: { c: 'data_found', l: 1, p: [] },
  goaltracker: { c: 'data_found', l: 1, p: [] },
  docstruct: { c: 'data_docs', l: 2, p: ['modernioformats'] },
  agenticparsing: { c: 'data_docs', l: 2, p: ['docstruct'] },
  knowledgebase: { c: 'data_docs', l: 2, p: ['docstruct'] },
  vectordbops: { c: 'data_docs', l: 2, p: ['knowledgebase'] },
  datapipeline: { c: 'data_docs', l: 2, p: ['modernioformats'] },
  threelayers: { c: 'data_docs', l: 2, p: ['docstruct'] },
  classicalml: { c: 'data_ml', l: 1, p: ['linearregression'] },
  frauddetectionml: { c: 'data_ml', l: 2, p: ['classicalml'] },
  timeseriesanomaly: { c: 'data_ml', l: 2, p: ['classicalml'] },
  vaes: { c: 'data_ml', l: 2, p: ['linearregression'] },
  byol: { c: 'data_ml', l: 2, p: ['vaes'] },
  xlstm: { c: 'data_ml', l: 2, p: ['classicalml'] },
  keras3: { c: 'data_ml', l: 2, p: ['classicalml'] },
  aidataplat: { c: 'data_scale', l: 2, p: ['datapipeline'] },
  medallionarch: { c: 'data_scale', l: 2, p: ['datapipeline'] },
  aitestdatabottleneck: { c: 'data_scale', l: 2, p: ['classicalml'] },
  pythonprofiling: { c: 'data_scale', l: 2, p: ['pandasdataframes'] },
  pythonengineering: { c: 'data_scale', l: 2, p: ['pythonprofiling'] },
  llmfinetuning: { c: 'data_scale', l: 3, p: ['quantserve'] },
  // ── Production & Frontiers (20) ──
  practices: { c: 'fr_eval', l: 1, p: [] },
  powerfeatures: { c: 'fr_frontiers', l: 1, p: [] },
  progress: { c: 'fr_frontiers', l: 1, p: [] },
  llmevals: { c: 'fr_eval', l: 2, p: ['practices'] },
  reasoningbench: { c: 'fr_eval', l: 2, p: ['llmevals'] },
  guardrails: { c: 'fr_eval', l: 2, p: ['practices'] },
  llmreliability: { c: 'fr_eval', l: 2, p: ['guardrails'] },
  tokenbill: { c: 'fr_ops', l: 1, p: [] },
  finops: { c: 'fr_ops', l: 2, p: ['tokenbill'] },
  productionragops: { c: 'fr_ops', l: 2, p: ['practices'] },
  enterpriseaiops: { c: 'fr_ops', l: 2, p: ['productionragops'] },
  observability: { c: 'fr_ops', l: 2, p: ['enterpriseaiops'] },
  tokenorchestrationplaybook: { c: 'fr_ops', l: 3, p: ['finops'] },
  enterpriseadvancedplaybook: { c: 'fr_ops', l: 3, p: ['enterpriseaiops'] },
  visionlanguage: { c: 'fr_frontiers', l: 2, p: [] },
  diffusionmodels: { c: 'fr_frontiers', l: 2, p: [] },
  speechvoice: { c: 'fr_frontiers', l: 2, p: [] },
  slmedge: { c: 'fr_frontiers', l: 2, p: ['quantserve'] },
  ragbeyond: { c: 'fr_frontiers', l: 2, p: ['prodrag'] },
  frontiers: { c: 'fr_frontiers', l: 3, p: ['ragbeyond'] }
};

// ── Helpers ────────────────────────────────────────────────────────────────
export function getChildById(childId) {
  return CHILD_UMBRELLAS.find(c => c.id === childId) || null;
}

export function getChildrenForUmbrella(umbrellaId) {
  return CHILD_UMBRELLAS.filter(c => c.umbrellaId === umbrellaId).sort((a, b) => a.order - b.order);
}

export function getTopicMeta(tabId) {
  return TOPIC_META[tabId] || { c: null, l: 1, p: [] };
}

export function getLevelInfo(level) {
  return LEVELS[level] || LEVELS[1];
}

/** Tabs of an umbrella grouped by child, preserving registry order within each child. */
export function getGroupedTabsForUmbrella(umbrellaId, tabsInUmbrella) {
  const children = getChildrenForUmbrella(umbrellaId);
  const byChild = new Map(children.map(c => [c.id, []]));
  const ungrouped = [];
  for (const t of tabsInUmbrella) {
    const meta = getTopicMeta(t.id);
    if (meta.c && byChild.has(meta.c)) byChild.get(meta.c).push(t);
    else ungrouped.push(t);
  }
  const groups = children
    .map(c => ({ child: c, tabs: byChild.get(c.id) }))
    .filter(g => g.tabs.length > 0);
  if (ungrouped.length) groups.push({ child: null, tabs: ungrouped });
  return groups;
}

/** Level span of a child, e.g. "L1–L3". */
export function getChildLevelSpan(childId, tabsInUmbrella) {
  const levels = (tabsInUmbrella || [])
    .filter(t => getTopicMeta(t.id).c === childId)
    .map(t => getTopicMeta(t.id).l);
  if (!levels.length) return '';
  const min = Math.min(...levels), max = Math.max(...levels);
  return min === max ? `L${min}` : `L${min}–L${max}`;
}

/** Prerequisite tab ids for a topic (may cross umbrellas). */
export function getPrereqIds(tabId) {
  return getTopicMeta(tabId).p || [];
}
