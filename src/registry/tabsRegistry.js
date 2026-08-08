import { lazy } from "react";

export const CATEGORIES = [
  "All",
  "Foundations",
  "RAG Systems",
  "Context & Memory",
  "Agents & Frameworks",
  "Advanced & Frontiers"
];

export const UMBRELLA_TOPICS = [
  {
    id: "foundations",
    title: "Foundations & Architecture",
    icon: "📚",
    color: "#2a8a84",
    description: "Core AI concepts, glossaries, transformers, and prompt engineering",
    tabs: ["overview", "glossary", "archconcepts", "workflows", "unhobbling", "promptmgmt"]
  },
  {
    id: "rag_architecture",
    title: "RAG Architectures & Pipelines",
    icon: "⚡",
    color: "#c9a84c",
    description: "Naive, Hybrid, GraphRAG, Agentic, PDF extractions, and verification",
    tabs: ["rag", "pipeline", "filtering", "hierrag", "qparseloop", "prodrag", "genpatterns", "fourpdfs", "hallucbricks", "agenticrag", "interviewprep"]
  },
  {
    id: "context_memory",
    title: "Context & Memory Engineering",
    icon: "🧠",
    color: "#9b7fd4",
    description: "Context curation, measuring quality, company brain & context graph",
    tabs: ["ctxeng", "ctxmeasure", "companybrain", "contextgraph", "vague", "hallucination", "memeng"]
  },
  {
    id: "agents_frameworks",
    title: "Agent Systems & Frameworks",
    icon: "🤖",
    color: "#c4572a",
    description: "ReAct loops, multi-agent orchestration, CLI agents, LangChain & LangGraph",
    tabs: ["cliagent", "redesign", "fiveassets", "multiagent", "agentsastools", "codingagentsnonprog", "langchain", "langgraph", "compare", "agentscale", "agentdebugging", "agenttasks", "aiproductbuilder"]
  },
  {
    id: "data_platform",
    title: "Data & Platform Layers",
    icon: "🏗️",
    color: "#3b82f6",
    description: "Prompt/Context/Loop layers, document structure, Medallion, and classical ML",
    tabs: ["threelayers", "docstruct", "aidataplat", "medallionarch", "aitestdatabottleneck", "classicalml", "activelearn"]
  },
  {
    id: "frontiers_production",
    title: "Production & Frontiers",
    icon: "🔮",
    color: "#10b981",
    description: "Copilot power features, Claude Code plugins, token cost optimization, and evals",
    tabs: ["powerfeatures", "frontiers", "ragbeyond", "practices", "tokenbill", "progress"]
  }
];

export const TABS_REGISTRY = [
  // ── Umbrella 1 — Foundations & Architecture ──────────────────────────────
  {
    id: "overview",
    label: "Overview Map",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🗺️",
    keywords: ["overview", "introduction", "dashboard"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.OverviewTab })))
  },
  {
    id: "glossary",
    label: "AI Glossary",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📖",
    keywords: ["glossary", "terms", "definitions", "concepts"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIGlossaryTab })))
  },
  {
    id: "archconcepts",
    label: "Architecture Concepts",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔬",
    keywords: ["architecture", "transformer", "attention", "embeddings"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ArchConceptsTab })))
  },
  {
    id: "workflows",
    label: "Claude Workflows",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🚀",
    keywords: ["workflows", "claude", "prompt engineering", "chaining"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClaudeWorkflowsTab })))
  },
  {
    id: "unhobbling",
    label: "Unhobbling Claude 5",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🔓",
    keywords: ["unhobbling", "claude 5", "capabilities", "reasoning"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.UnhobblingTab })))
  },
  {
    id: "promptmgmt",
    label: "Prompt Engineering & SemVer",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📜",
    keywords: ["prompt management", "semver", "prompt engineering", "templates", "versioning"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PromptMgmtTab })))
  },

  // ── Umbrella 2 — RAG Architectures & Pipelines ──────────────────────────────
  {
    id: "rag",
    label: "9 RAG Architectures",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📄",
    keywords: ["rag", "naive", "advanced", "hybrid", "self-rag", "crag", "graphrag"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGTypesTab })))
  },
  {
    id: "pipeline",
    label: "7-Stage Pipeline Sim",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "▶",
    keywords: ["pipeline", "vector db", "embedding", "chunking"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PipelineTab })))
  },
  {
    id: "filtering",
    label: "Retrieval = Filtering",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "✦",
    keywords: ["retrieval", "filtering", "anchor detection", "bm25"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FilteringTab })))
  },
  {
    id: "hierrag",
    label: "Hierarchical Retrieval",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🗂️",
    keywords: ["hierarchical", "table of contents", "toc", "tree"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HierarchicalRetrievalTab })))
  },
  {
    id: "qparseloop",
    label: "Question Parsing Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔂",
    keywords: ["question parsing", "query rewrite", "intent"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.QuestionParsingLoopTab })))
  },
  {
    id: "prodrag",
    label: "Production RAG Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📄",
    keywords: ["production rag", "pdf", "extraction", "tables"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProductionRAGTab })))
  },
  {
    id: "genpatterns",
    label: "7 Generation Patterns",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧬",
    keywords: ["generation patterns", "contracts", "pydantic"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.GenPatternsTab })))
  },
  {
    id: "fourpdfs",
    label: "One Pipeline, Four PDFs",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📚",
    keywords: ["four pdfs", "benchmarks", "evaluation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FourPDFsTab })))
  },
  {
    id: "hallucbricks",
    label: "4 Verification Bricks",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🧱",
    keywords: ["hallucinations", "bricks", "verification"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucBricksTab })))
  },
  {
    id: "agenticrag",
    label: "Agentic RAG Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔍",
    keywords: ["agentic rag", "react loop", "multi-step search"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgenticRAGTab })))
  },
  {
    id: "interviewprep",
    label: "RAG Interview & Case Study",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🎯",
    keywords: ["interview", "questions", "case study", "rag interview", "star format", "system design", "study plan"],
    component: lazy(() => import("../tabs/InterviewPrepTab.jsx"))
  },

  // ── Umbrella 3 — Context & Memory Engineering ─────────────────────────
  {
    id: "ctxeng",
    label: "Context Engineering",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "✶",
    keywords: ["context engineering", "write", "select", "compress", "isolate"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextEngineeringTab })))
  },
  {
    id: "ctxmeasure",
    label: "Measuring Quality",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "📐",
    keywords: ["context quality", "evals", "metrics", "recall"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextMeasureTab })))
  },
  {
    id: "companybrain",
    label: "Company Brain Layer",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧠",
    keywords: ["company brain", "knowledge graph", "enterprise"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompanyBrainTab })))
  },
  {
    id: "contextgraph",
    label: "Context Graph Memory",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⬡",
    keywords: ["context graph", "memory", "state"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextGraphTab })))
  },
  {
    id: "vague",
    label: "Vague Questions",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "◉",
    keywords: ["vague questions", "clarification", "ambiguity"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.VagueQuestionsTab })))
  },
  {
    id: "hallucination",
    label: "Silent Hallucination Loop",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🚨",
    keywords: ["hallucination loop", "silent failure", "detection"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucinationLoopTab })))
  },
  {
    id: "memeng",
    label: "Memory Engineering",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⚡",
    keywords: ["memory engineering", "persistent memory", "long-term"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MemoryEngineeringTab })))
  },

  // ── Umbrella 4 — Agent Systems & Frameworks ──────────────────────
  {
    id: "cliagent",
    label: "Local CLI Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🤖",
    keywords: ["cli agent", "ollama", "python", "subprocess", "qwen"],
    component: lazy(() => import("../cliAgents/CliAgentTab.jsx"))
  },
  {
    id: "redesign",
    label: "Redesign Work First",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏗️",
    keywords: ["redesign work", "process", "automation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RedesignWorkTab })))
  },
  {
    id: "fiveassets",
    label: "5 Assets for Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📦",
    keywords: ["five assets", "tools", "evals", "prompts"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FiveAssetsTab })))
  },
  {
    id: "multiagent",
    label: "Multi-Agent Pipelines",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "◈",
    keywords: ["multi-agent", "orchestration", "handoffs"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MultiAgentTab })))
  },
  {
    id: "agentsastools",
    label: "Agents as Tools",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🛠️",
    keywords: ["agents as tools", "sub-agents", "tool calling"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentsAsToolsTab })))
  },
  {
    id: "codingagentsnonprog",
    label: "Non-Prog Coding Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚡",
    keywords: ["coding agents", "non-programmers", "no-code"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CodingAgentsNonProgTab })))
  },
  {
    id: "langchain",
    label: "LangChain Ecosystem",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🦜",
    keywords: ["langchain", "framework", "chains"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangChainTab })))
  },
  {
    id: "langgraph",
    label: "LangGraph Stateful Graphs",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🕸️",
    keywords: ["langgraph", "state graph", "nodes", "edges"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangGraphTab })))
  },
  {
    id: "compare",
    label: "Framework Comparison",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚖️",
    keywords: ["compare", "langchain vs langgraph", "evaluation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompareTab })))
  },
  {
    id: "agentscale",
    label: "High-Scale Agent Systems",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    keywords: ["high-scale", "millions requests", "production"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HighScaleAgentsTab })))
  },
  {
    id: "agentdebugging",
    label: "AI Agent Debugging",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🐞",
    keywords: ["debugging", "tool errors", "traces", "inspection"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentDebuggingTab })))
  },
  {
    id: "agenttasks",
    label: "11 Agent Task Archetypes",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📋",
    keywords: ["agent tasks", "archetypes", "worktree", "evaluation", "task planning"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentTasksTab })))
  },
  {
    id: "aiproductbuilder",
    label: "AI Product Builder",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🔨",
    keywords: ["product builder", "prd", "cursorrules", "architecture", "system spec"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIProductBuilderTab })))
  },

  // ── Umbrella 5 — Data & Platform Layers ─────────────────────
  {
    id: "threelayers",
    label: "3 Engineering Layers",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🏗️",
    keywords: ["3 layers", "prompt", "context", "loop", "anthropic"],
    component: lazy(() => import("../engineeringLayers/ThreeLayersTab.jsx"))
  },
  {
    id: "docstruct",
    label: "Document Structure & Loop",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "📐",
    keywords: ["document structure", "pdf parsing", "toc", "loop"],
    component: lazy(() => import("../documentStructure/DocumentStructureTab.jsx"))
  },
  {
    id: "aidataplat",
    label: "AI-Native Data Platform",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    keywords: ["data platform", "ai-native", "bigquery"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIDataPlatformTab })))
  },
  {
    id: "medallionarch",
    label: "Medallion Architecture",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🥉",
    keywords: ["medallion", "bronze", "silver", "gold", "data lakehouse"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MedallionArchTab })))
  },
  {
    id: "aitestdatabottleneck",
    label: "AI Test Data Bottleneck",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🧪",
    keywords: ["test data", "synthetic data", "bottleneck"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AITestDataBottleneckTab })))
  },
  {
    id: "classicalml",
    label: "Classical ML Tools",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "📊",
    keywords: ["classical ml", "scikit-learn", "xgboost"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClassicalMLTab })))
  },
  {
    id: "activelearn",
    label: "Active Learning",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🎯",
    keywords: ["active learning", "annotation", "uncertainty"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ActiveLearningTab })))
  },

  // ── Umbrella 6 — Production & Frontiers ─────────────────────
  {
    id: "powerfeatures",
    label: "Power Features",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚡",
    keywords: ["power features", "advanced", "optimizations"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PowerFeaturesTab })))
  },
  {
    id: "frontiers",
    label: "Research Frontiers",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔬",
    keywords: ["research frontiers", "state of art", "future"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ResearchFrontiersTab })))
  },
  {
    id: "ragbeyond",
    label: "Beyond RAG",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔮",
    keywords: ["beyond rag", "future architectures", "agents"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGBeyondTab })))
  },
  {
    id: "practices",
    label: "Best Practices",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "✓",
    keywords: ["best practices", "guidelines", "checklist"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PracticesTab })))
  },
  {
    id: "tokenbill",
    label: "3× Token Bill Fix",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "💸",
    keywords: ["token bill", "cost optimization", "pricing"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.TokenBillTab })))
  },
  {
    id: "progress",
    label: "Progress Tracker",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🎯",
    keywords: ["progress", "tracking", "checklist"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProgressTab })))
  }
];

export const getUmbrellaForTab = (tabId) => {
  const tab = TABS_REGISTRY.find(t => t.id === tabId);
  if (tab && tab.umbrellaId) {
    return UMBRELLA_TOPICS.find(u => u.id === tab.umbrellaId) || UMBRELLA_TOPICS[0];
  }
  return UMBRELLA_TOPICS.find(u => u.tabs.includes(tabId)) || UMBRELLA_TOPICS[0];
};

export const getTabById = (tabId) => {
  return TABS_REGISTRY.find(t => t.id === tabId) || TABS_REGISTRY[0];
};

export const getTabsForUmbrella = (umbrellaId) => {
  const umbrella = UMBRELLA_TOPICS.find(u => u.id === umbrellaId);
  if (!umbrella) return [];
  return TABS_REGISTRY.filter(t => umbrella.tabs.includes(t.id));
};
