import { lazy } from "react";

export const CATEGORIES = [
  "All",
  "Foundations",
  "RAG Systems",
  "Context & Memory",
  "Agents & Frameworks",
  "Advanced & Frontiers"
];

export const TABS_REGISTRY = [
  // ── Module 1 — Foundations ──────────────────────────────
  {
    id: "glossary",
    label: "① AI Glossary 📖",
    category: "Foundations",
    icon: "📖",
    keywords: ["glossary", "terms", "definitions", "concepts"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIGlossaryTab })))
  },
  {
    id: "overview",
    label: "② Overview",
    category: "Foundations",
    icon: "🗺️",
    keywords: ["overview", "introduction", "dashboard"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.OverviewTab })))
  },
  {
    id: "archconcepts",
    label: "③ Architecture Concepts 🔬",
    category: "Foundations",
    icon: "🔬",
    keywords: ["architecture", "transformer", "attention", "embeddings"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ArchConceptsTab })))
  },
  {
    id: "workflows",
    label: "④ Claude Workflows 🚀",
    category: "Foundations",
    icon: "🚀",
    keywords: ["workflows", "claude", "prompt engineering", "chaining"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClaudeWorkflowsTab })))
  },
  {
    id: "unhobbling",
    label: "⑤ Unhobbling Claude 5 🔓",
    category: "Foundations",
    icon: "🔓",
    keywords: ["unhobbling", "claude 5", "capabilities", "reasoning"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.UnhobblingTab })))
  },

  // ── Module 2 — RAG Systems ──────────────────────────────
  {
    id: "rag",
    label: "⑥ RAG Types",
    category: "RAG Systems",
    icon: "📄",
    keywords: ["rag", "naive", "advanced", "hybrid", "self-rag", "crag", "graphrag"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGTypesTab })))
  },
  {
    id: "pipeline",
    label: "⑦ Pipeline ▶",
    category: "RAG Systems",
    icon: "▶",
    keywords: ["pipeline", "vector db", "embedding", "chunking"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PipelineTab })))
  },
  {
    id: "filtering",
    label: "⑧ Retrieval = Filtering ✦",
    category: "RAG Systems",
    icon: "✦",
    keywords: ["retrieval", "filtering", "anchor detection", "bm25"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FilteringTab })))
  },
  {
    id: "hierrag",
    label: "⑨ Hierarchical Retrieval 🗂️",
    category: "RAG Systems",
    icon: "🗂️",
    keywords: ["hierarchical", "table of contents", "toc", "tree"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HierarchicalRetrievalTab })))
  },
  {
    id: "qparseloop",
    label: "⑩ Question Parsing Loop 🔂",
    category: "RAG Systems",
    icon: "🔂",
    keywords: ["question parsing", "query rewrite", "intent"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.QuestionParsingLoopTab })))
  },
  {
    id: "prodrag",
    label: "⑪ Production RAG 📄",
    category: "RAG Systems",
    icon: "📄",
    keywords: ["production rag", "pdf", "extraction", "tables"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProductionRAGTab })))
  },
  {
    id: "genpatterns",
    label: "⑫ 7 Generation Patterns 🧬",
    category: "RAG Systems",
    icon: "🧬",
    keywords: ["generation patterns", "contracts", "pydantic"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.GenPatternsTab })))
  },
  {
    id: "fourpdfs",
    label: "⑬ One Pipeline, Four PDFs 📚",
    category: "RAG Systems",
    icon: "📚",
    keywords: ["four pdfs", "benchmarks", "evaluation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FourPDFsTab })))
  },
  {
    id: "hallucbricks",
    label: "⑭ 4 Bricks Stop Hallucinations 🧱",
    category: "RAG Systems",
    icon: "🧱",
    keywords: ["hallucinations", "bricks", "verification"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucBricksTab })))
  },
  {
    id: "agenticrag",
    label: "⑮ Agentic RAG 🔍",
    category: "RAG Systems",
    icon: "🔍",
    keywords: ["agentic rag", "react loop", "multi-step search"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgenticRAGTab })))
  },

  // ── Module 3 — Context & Memory ─────────────────────────
  {
    id: "ctxeng",
    label: "⑯ Context Engineering ✶",
    category: "Context & Memory",
    icon: "✶",
    keywords: ["context engineering", "write", "select", "compress", "isolate"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextEngineeringTab })))
  },
  {
    id: "ctxmeasure",
    label: "⑰ Measuring Context Quality 📐",
    category: "Context & Memory",
    icon: "📐",
    keywords: ["context quality", "evals", "metrics", "recall"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextMeasureTab })))
  },
  {
    id: "companybrain",
    label: "⑱ Company Brain & Context Layer 🧠",
    category: "Context & Memory",
    icon: "🧠",
    keywords: ["company brain", "knowledge graph", "enterprise"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompanyBrainTab })))
  },
  {
    id: "contextgraph",
    label: "⑲ Context Graph ⬡",
    category: "Context & Memory",
    icon: "⬡",
    keywords: ["context graph", "memory", "state"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextGraphTab })))
  },
  {
    id: "vague",
    label: "⑳ Vague Questions ◉",
    category: "Context & Memory",
    icon: "◉",
    keywords: ["vague questions", "clarification", "ambiguity"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.VagueQuestionsTab })))
  },
  {
    id: "hallucination",
    label: "㉑ Silent Hallucination Loop 🚨",
    category: "Context & Memory",
    icon: "🚨",
    keywords: ["hallucination loop", "silent failure", "detection"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HallucinationLoopTab })))
  },
  {
    id: "memeng",
    label: "㉒ Memory Engineering ⚡",
    category: "Context & Memory",
    icon: "⚡",
    keywords: ["memory engineering", "persistent memory", "long-term"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MemoryEngineeringTab })))
  },

  // ── Module 4 — Agents & Frameworks ──────────────────────
  {
    id: "cliagent",
    label: "🤖 Local CLI Agents (Ollama + Python)",
    category: "Agents & Frameworks",
    icon: "🤖",
    keywords: ["cli agent", "ollama", "python", "subprocess", "qwen"],
    component: lazy(() => import("../cliAgents/CliAgentTab.jsx"))
  },
  {
    id: "redesign",
    label: "㉒ Redesign Work First 🏗️",
    category: "Agents & Frameworks",
    icon: "🏗️",
    keywords: ["redesign work", "process", "automation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RedesignWorkTab })))
  },
  {
    id: "fiveassets",
    label: "㉓ 5 Assets for Agents 📦",
    category: "Agents & Frameworks",
    icon: "📦",
    keywords: ["five assets", "tools", "evals", "prompts"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.FiveAssetsTab })))
  },
  {
    id: "multiagent",
    label: "㉔ Multi-Agent ◈",
    category: "Agents & Frameworks",
    icon: "◈",
    keywords: ["multi-agent", "orchestration", "handoffs"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MultiAgentTab })))
  },
  {
    id: "agentsastools",
    label: "㉘ Agents as Tools 🛠️",
    category: "Agents & Frameworks",
    icon: "🛠️",
    keywords: ["agents as tools", "sub-agents", "tool calling"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentsAsToolsTab })))
  },
  {
    id: "codingagentsnonprog",
    label: "㉙ Non-Programming Coding Agents ⚡",
    category: "Agents & Frameworks",
    icon: "⚡",
    keywords: ["coding agents", "non-programmers", "no-code"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CodingAgentsNonProgTab })))
  },
  {
    id: "langchain",
    label: "㉘ LangChain",
    category: "Agents & Frameworks",
    icon: "🦜",
    keywords: ["langchain", "framework", "chains"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangChainTab })))
  },
  {
    id: "langgraph",
    label: "㉙ LangGraph",
    category: "Agents & Frameworks",
    icon: "🕸️",
    keywords: ["langgraph", "state graph", "nodes", "edges"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangGraphTab })))
  },
  {
    id: "compare",
    label: "㉚ Compare",
    category: "Agents & Frameworks",
    icon: "⚖️",
    keywords: ["compare", "langchain vs langgraph", "evaluation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompareTab })))
  },
  {
    id: "agentscale",
    label: "㊲ High-Scale Agent Systems 🚀",
    category: "Agents & Frameworks",
    icon: "🚀",
    keywords: ["high-scale", "millions requests", "production"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HighScaleAgentsTab })))
  },
  {
    id: "agentdebugging",
    label: "🐞 AI Agent Debugging",
    category: "Agents & Frameworks",
    icon: "🐞",
    keywords: ["debugging", "tool errors", "traces", "inspection"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentDebuggingTab })))
  },

  // ── Module 5 — Advanced & Frontiers ─────────────────────
  {
    id: "threelayers",
    label: "🏗️ 3 Engineering Layers (Prompt, Context, Loop)",
    category: "Advanced & Frontiers",
    icon: "🏗️",
    keywords: ["3 layers", "prompt", "context", "loop", "anthropic"],
    component: lazy(() => import("../engineeringLayers/ThreeLayersTab.jsx"))
  },
  {
    id: "docstruct",
    label: "📐 Document Structure & Loop Engineering",
    category: "Advanced & Frontiers",
    icon: "📐",
    keywords: ["document structure", "pdf parsing", "toc", "loop"],
    component: lazy(() => import("../documentStructure/DocumentStructureTab.jsx"))
  },
  {
    id: "classicalml",
    label: "㉕ Classical ML Tools 📊",
    category: "Advanced & Frontiers",
    icon: "📊",
    keywords: ["classical ml", "scikit-learn", "xgboost"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ClassicalMLTab })))
  },
  {
    id: "activelearn",
    label: "㉖ Active Learning 🎯",
    category: "Advanced & Frontiers",
    icon: "🎯",
    keywords: ["active learning", "annotation", "uncertainty"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ActiveLearningTab })))
  },
  {
    id: "aidataplat",
    label: "㉗ AI-Native Data Platform 🏛️",
    category: "Advanced & Frontiers",
    icon: "🏛️",
    keywords: ["data platform", "ai-native", "bigquery"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AIDataPlatformTab })))
  },
  {
    id: "medallionarch",
    label: "㉚ Medallion Architecture 🥉🥈🥇",
    category: "Advanced & Frontiers",
    icon: "🥉",
    keywords: ["medallion", "bronze", "silver", "gold", "data lakehouse"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MedallionArchTab })))
  },
  {
    id: "aitestdatabottleneck",
    label: "㉛ AI Test Data Bottleneck 🧪",
    category: "Advanced & Frontiers",
    icon: "🧪",
    keywords: ["test data", "synthetic data", "bottleneck"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AITestDataBottleneckTab })))
  },
  {
    id: "powerfeatures",
    label: "㉛ Power Features ⚡",
    category: "Advanced & Frontiers",
    icon: "⚡",
    keywords: ["power features", "advanced", "optimizations"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PowerFeaturesTab })))
  },
  {
    id: "frontiers",
    label: "㉜ Research Frontiers 🔬",
    category: "Advanced & Frontiers",
    icon: "🔬",
    keywords: ["research frontiers", "state of art", "future"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ResearchFrontiersTab })))
  },
  {
    id: "ragbeyond",
    label: "㉝ Beyond RAG 🔮",
    category: "Advanced & Frontiers",
    icon: "🔮",
    keywords: ["beyond rag", "future architectures", "agents"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RAGBeyondTab })))
  },
  {
    id: "practices",
    label: "㉞ Best Practices",
    category: "Advanced & Frontiers",
    icon: "✓",
    keywords: ["best practices", "guidelines", "checklist"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PracticesTab })))
  },
  {
    id: "progress",
    label: "㉟ Progress 🎯",
    category: "Advanced & Frontiers",
    icon: "🎯",
    keywords: ["progress", "tracking", "checklist"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProgressTab })))
  },
  {
    id: "tokenbill",
    label: "㊱ 3× Token Bill Fix 💸",
    category: "Advanced & Frontiers",
    icon: "💸",
    keywords: ["token bill", "cost optimization", "pricing"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.TokenBillTab })))
  }
];
