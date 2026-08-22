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
    tabs: ["overview", "glossary", "archconcepts", "promptmgmt", "structuredoutputs", "topicmodeling", "workflows", "unhobbling", "aiharness", "promptlearning"]
  },
  {
    id: "rag_architecture",
    title: "RAG Architectures & Pipelines",
    icon: "⚡",
    color: "#c9a84c",
    description: "Naive, Hybrid, GraphRAG, Agentic, PDF extractions, and verification",
    tabs: ["rag", "pipeline", "qparseloop", "filtering", "hierrag", "prodrag", "routercheap", "genpatterns", "fourpdfs", "hallucbricks", "workflowloop", "proxypointer", "agenticrag", "ragcasestudies", "interviewprep", "rowlevelrag", "graphtraversalknowledge", "ragcorpusshapes"]
  },
  {
    id: "context_memory",
    title: "Context & Memory Engineering",
    icon: "🧠",
    color: "#9b7fd4",
    description: "Context curation, measuring quality, company brain & context graph",
    tabs: ["ctxeng", "ctxmeasure", "vague", "hallucination", "contextgraph", "companybrain", "memeng", "contextlimits"]
  },
  {
    id: "agents_frameworks",
    title: "Agent Systems & Frameworks",
    icon: "🤖",
    color: "#c4572a",
    description: "ReAct loops, multi-agent orchestration, CLI agents, LangChain & LangGraph",
    tabs: ["fiveassets", "redesign", "agentsastools", "agenttasks", "cliagent", "codingagentsnonprog", "multiagent", "langchain", "langgraph", "compare", "agentdebugging", "agentscale", "aiproductbuilder", "mcpclient", "loopengineering"]
  },
  {
    id: "data_platform",
    title: "Data & Platform Layers",
    icon: "🏗️",
    color: "#3b82f6",
    description: "Prompt/Context/Loop layers, agentic document parsing, Medallion, and classical ML",
    tabs: ["threelayers", "docstruct", "agenticparsing", "knowledgebase", "aidataplat", "medallionarch", "aitestdatabottleneck", "classicalml", "activelearn", "goaltracker", "vaes", "keras3", "byol", "xlstm", "timeseriesanomaly", "aiusecases", "linearregression", "pandasdataframes", "datahumanization", "llmfinetuning"]
  },
  {
    id: "frontiers_production",
    title: "Production & Frontiers",
    icon: "🔮",
    color: "#10b981",
    description: "Copilot power features, Claude Code plugins, token cost optimization, and evals",
    tabs: ["tokenbill", "llmevals", "reasoningbench", "practices", "powerfeatures", "ragbeyond", "frontiers", "progress", "guardrails", "llmreliability"]
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
    keywords: ["architecture", "transformer", "attention", "foundations", "latent space", "embeddings"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ArchConceptsTab })))
  },
  {
    id: "promptmgmt",
    label: "Prompt Management",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📝",
    keywords: ["prompts", "prompt management", "versioning", "prompt engineering", "templates"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PromptMgmtTab })))
  },
  {
    id: "structuredoutputs",
    label: "Structured Outputs",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "📐",
    keywords: ["structured outputs", "json schema", "constrained decoding", "fsm", "outlines", "pydantic", "instructor", "grammars", "logit masking"],
    component: lazy(() => import("../structuredOutputs/StructuredOutputsTab.jsx"))
  },
  {
    id: "topicmodeling",
    label: "Topic Modeling 2026",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🌱",
    keywords: ["topic modeling", "keynmf", "seeded topic modeling", "turftopic", "llm summarization", "trend tracking", "ecb speeches", "lda"],
    component: lazy(() => import("../topicModeling/TopicModelingTab.jsx"))
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
    id: "aiharness",
    label: "AI Harness & Training Loops",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "⚙️",
    keywords: ["ai harness", "training loops", "transformer architecture", "kv cache", "gqa", "rlhf", "dpo", "gradient descent", "chinchilla", "flash attention", "evals", "failure modes"],
    component: lazy(() => import("../aiHarness/AIHarnessTab.jsx"))
  },
  {
    id: "promptlearning",
    label: "Prompt Learning & English Feedback",
    umbrellaId: "foundations",
    category: "Foundations",
    icon: "🧠",
    keywords: ["prompt learning", "english feedback", "voyager", "karpathy", "meta-prompt", "instruction management", "online optimization", "critique", "evals"],
    component: lazy(() => import("../promptLearning/PromptLearningTab.jsx"))
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
    id: "qparseloop",
    label: "Question Parsing Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔂",
    keywords: ["question parsing", "query rewrite", "intent"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.QuestionParsingLoopTab })))
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
    id: "prodrag",
    label: "Production RAG Pipeline",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📄",
    keywords: ["production rag", "pdf", "extraction", "tables"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProductionRAGTab })))
  },
  {
    id: "routercheap",
    label: "Zero-Model Fast Router",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "⚡",
    keywords: ["zero-model router", "fast-path", "calling the llm less", "latency", "cost", "line_df", "co_occurrence_score", "margin", "09ter", "frugalgpt", "router", "fast router"],
    component: lazy(() => import("../zeroModelRouter/ZeroModelRouterTab.jsx"))
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
    id: "workflowloop",
    label: "Workflow & Loop Dispatcher",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔀",
    keywords: ["workflow loop", "dispatcher", "when to loop", "when to stop", "should_continue", "pdf_qa_loop", "iterate_with_bound", "decide.py", "13", "drift", "audit"],
    component: lazy(() => import("../workflowLoop/WorkflowLoopTab.jsx"))
  },
  {
    id: "proxypointer",
    label: "Proxy-Pointer RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏷️",
    keywords: ["proxy pointer", "proxy pointer rag", "structure meets scale", "skeleton tree", "breadcrumb injection", "faiss pointer map", "gemini flash lite noise filter", "15"],
    component: lazy(() => import("../proxyPointer/ProxyPointerTab.jsx"))
  },
  {
    id: "agenticrag",
    label: "Agentic RAG Loop",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🔍",
    keywords: ["agentic rag", "react loop", "multi-step search", "let the agent search", "openai agents sdk", "14", "tools", "trace"],
    component: lazy(() => import("../agenticRAG/AgenticRAGTab.jsx"))
  },
  {
    id: "ragcasestudies",
    label: "Enterprise Case Studies & Blueprints",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🏢",
    keywords: ["case study", "sdlc rag", "financial rag", "devcontext", "system design", "pseudocode", "architecture", "blueprints"],
    component: lazy(() => import("../tabs/RAGCaseStudiesTab.jsx"))
  },
  {
    id: "interviewprep",
    label: "RAG Interview Prep",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🎯",
    keywords: ["interview", "questions", "rag interview", "q&a", "study plan"],
    component: lazy(() => import("../tabs/InterviewPrepTab.jsx"))
  },
  {
    id: "rowlevelrag",
    label: "Row-Level Table Chunks for RAG",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "📊",
    keywords: ["row level chunks", "table rag", "tabular retrieval", "serialize_table_rows", "pipe parser", "docling", "dual scale index"],
    component: lazy(() => import("../rowLevelRAG/RowLevelRAGTab.jsx"))
  },
  {
    id: "graphtraversalknowledge",
    label: "Always-Fused Graph Traversal Knowledge Layer",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🌐",
    keywords: ["graph traversal", "always fused pipeline", "bitemporal edges", "entity resolution", "two threshold", "valid_from", "valid_to", "discovered contradictions"],
    component: lazy(() => import("../graphTraversalKnowledge/GraphTraversalTab.jsx"))
  },
  {
    id: "ragcorpusshapes",
    label: "Three Kinds of RAG Corpus & Selection",
    umbrellaId: "rag_architecture",
    category: "RAG Systems",
    icon: "🗂️",
    keywords: ["rag corpus shapes", "flat pile failure modes", "unrelated pdfs", "homogeneous typed corpus", "case file bundles", "metadata table indexing", "baseline waste"],
    component: lazy(() => import("../ragCorpusShapes/RAGCorpusShapesTab.jsx"))
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
    id: "contextgraph",
    label: "Context Graph Memory",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⬡",
    keywords: ["context graph", "memory", "state"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ContextGraphTab })))
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
    id: "memeng",
    label: "Memory Engineering",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "⚡",
    keywords: ["memory engineering", "persistent memory", "long-term"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.MemoryEngineeringTab })))
  },
  {
    id: "contextlimits",
    label: "1M Context Limits & Working Memory",
    umbrellaId: "context_memory",
    category: "Context & Memory",
    icon: "🧠",
    keywords: ["1m context window", "working memory", "bapo model", "tobias schnabel", "microsoft research", "variable tracking", "bapo hard", "bapo easy"],
    component: lazy(() => import("../contextLimits/ContextLimitsTab.jsx"))
  },

  // ── Umbrella 4 — Agent Systems & Frameworks ──────────────────────
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
    id: "redesign",
    label: "Redesign Work First",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🏗️",
    keywords: ["redesign work", "process", "automation"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.RedesignWorkTab })))
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
    id: "agenttasks",
    label: "11 Agent Task Archetypes",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "📋",
    keywords: ["agent tasks", "archetypes", "worktree", "evaluation", "task planning"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.AgentTasksTab })))
  },
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
    id: "codingagentsnonprog",
    label: "Non-Prog Coding Agents",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚡",
    keywords: ["coding agents", "non-programmers", "no-code"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CodingAgentsNonProgTab })))
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
    id: "langchain",
    label: "LangChain Ecosystem",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🦜",
    keywords: ["langchain", "framework", "chains", "lcel", "pipeline", "prompts", "models", "parsers", "lang chain"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangChainTab })))
  },
  {
    id: "langgraph",
    label: "LangGraph Stateful Graphs",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🕸️",
    keywords: ["langgraph", "state graph", "nodes", "edges", "hitl", "human in the loop", "checkpointing", "cyclic", "multi-agent", "lang graph"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.LangGraphTab })))
  },
  {
    id: "compare",
    label: "Framework Comparison",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "⚖️",
    keywords: ["compare", "langchain vs langgraph", "comparison", "evaluation", "frameworks", "langchain", "langgraph"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.CompareTab })))
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
    id: "agentscale",
    label: "High-Scale Agent Systems",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "🚀",
    keywords: ["high-scale", "millions requests", "production"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.HighScaleAgentsTab })))
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
  {
    id: "mcpclient",
    label: "MCP Client & Streamlit Apps",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "💻",
    keywords: ["mcp client", "streamlit", "remote mcp server", "deepwiki", "huggingface", "json-rpc 2.0", "stdio", "sse", "tool calling"],
    component: lazy(() => import("../mcpClient/MCPClientTab.jsx"))
  },
  {
    id: "loopengineering",
    label: "Loop Engineering",
    umbrellaId: "agents_frameworks",
    category: "Agents & Frameworks",
    icon: "∞",
    keywords: ["loop engineering", "ralph loop", "ralf", "ralphex", "addy osmani", "boris cherny", "peter steinberger", "goal loop", "loop library", "69 loops", "claude basics", "cross-model review", "autonomous agent loops"],
    component: lazy(() => import("../loopEngineering/LoopEngineeringTab.jsx"))
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
    id: "agenticparsing",
    label: "Agentic Parsing Dispatcher",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "⚡",
    keywords: ["agentic parsing", "dispatcher", "pdf nature", "docling", "fitz", "easyocr", "pick richer", "brick 1"],
    component: lazy(() => import("../agenticParsing/AgenticParsingTab.jsx"))
  },
  {
    id: "knowledgebase",
    label: "Efficient Knowledge Base",
    umbrellaId: "data_platform",
    category: "Advanced & Frontiers",
    icon: "🌱",
    keywords: ["knowledge base", "efficient knowledge base", "top 10 questions", "cleansing", "deduplication", "hnsw", "ivf", "flat", "rbac", "freshness ttl", "17"],
    component: lazy(() => import("../knowledgeBase/KnowledgeBaseTab.jsx"))
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
  {
    id: "goaltracker",
    label: "2026 Goal Tracker Lab",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🎯",
    keywords: ["goal tracker", "vision board", "streamlit", "neon", "postgres", "sabrine bendimerad", "practical lab", "habits", "2026", "metrics"],
    component: lazy(() => import("../goalTracker/GoalTrackerTab.jsx"))
  },
  {
    id: "vaes",
    label: "Variational Autoencoders (VAEs)",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌀",
    keywords: ["variational autoencoders", "vaes", "elbo", "reparameterization trick", "kl divergence", "latent space", "slava efimov", "generative ai"],
    component: lazy(() => import("../vaes/VAETab.jsx"))
  },
  {
    id: "keras3",
    label: "Keras 3.0 Multi-Backend Lab",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "⚡",
    keywords: ["keras 3.0", "pytorch backend", "jax backend", "tensorflow", "nmt", "encoder decoder", "peng qian", "multi-backend"],
    component: lazy(() => import("../keras3/Keras3Tab.jsx"))
  },
  {
    id: "byol",
    label: "BYOL Self-Supervised Learning",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🧬",
    keywords: ["bootstrap your own latent", "byol", "self-supervised learning", "grill et al", "deepmind", "ema", "no negative pairs", "online target network"],
    component: lazy(() => import("../byol/BYOLTab.jsx"))
  },
  {
    id: "xlstm",
    label: "LSTMs & xLSTMs Deep Dive",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🌀",
    keywords: ["lstm", "xlstm", "slstm", "mlstm", "exponential gating", "matrix memory", "hochreiter", "hand calculation", "recurrent neural networks"],
    component: lazy(() => import("../xlstm/XLSTMTab.jsx"))
  },
  {
    id: "timeseriesanomaly",
    label: "Time Series Anomaly Autoencoder",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📈",
    keywords: ["time series anomaly", "autoencoders", "reconstruction error", "mse loss", "1d cnn", "percentile threshold", "unsupervised anomaly detection"],
    component: lazy(() => import("../tsAnomaly/TSAnomalyTab.jsx"))
  },
  {
    id: "aiusecases",
    label: "3 Enterprise AI Use Cases",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🚀",
    keywords: ["3 ai use cases", "beyond chatbot", "feature engineering", "text embeddings", "lead scoring", "unstructured data", "enterprise ai"],
    component: lazy(() => import("../aiUseCases/AIUseCasesTab.jsx"))
  },
  {
    id: "linearregression",
    label: "Linear Regression & Gradient Descent",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "📐",
    keywords: ["linear regression", "cost function", "gradient descent", "mse", "mae", "house pricing", "weight update", "optimization"],
    component: lazy(() => import("../linearRegression/LinearRegressionTab.jsx"))
  },
  {
    id: "pandasdataframes",
    label: "Pandas DataFrames Fundamentals",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🐼",
    keywords: ["pandas dataframes", "numpy arrays", "ndarrays", "dataframe initialization", "read_csv", "dictionaries", "in-memory analytics"],
    component: lazy(() => import("../pandasDataframes/PandasDataFrameTab.jsx"))
  },
  {
    id: "datahumanization",
    label: "Data Humanization & Storytelling",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "💡",
    keywords: ["data humanization", "data storytelling", "scintillating grid", "data artisan", "aida", "scqa", "symptom kpi", "humanized insight", "roi", "data-rich action-poor"],
    component: lazy(() => import("../dataHumanization/DataHumanizationTab.jsx"))
  },
  {
    id: "llmfinetuning",
    label: "LLM Fine-Tuning & QLoRA Guide",
    umbrellaId: "data_platform",
    category: "Data & Platform Layers",
    icon: "🎯",
    keywords: ["fine-tuning", "qlora", "lora", "peft", "4-bit nf4", "double quantization", "paged optimizers", "instruction backtranslation", "sfttrainer", "single gpu"],
    component: lazy(() => import("../llmFinetuning/LLMFinetuningTab.jsx"))
  },

  // ── Umbrella 6 — Production & Frontiers ─────────────────────
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
    id: "llmevals",
    label: "LLM Evals Quality Gate",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚖️",
    keywords: ["llm evals", "evals based on vibes", "missing layer", "attribution", "specificity", "quality gate", "serve retry block", "regression", "product manager", "pm eval", "julia winn", "spam filter", "tax chatbot", "recsys", "eval to launch", "gsm-symbolic", "gsm-noop", "apple benchmark", "true reasoning", "maxime jabarian", "benchmark contamination"],
    component: lazy(() => import("../llmEvals/LLMEvalLayerTab.jsx"))
  },
  {
    id: "reasoningbench",
    label: "LLM Reasoning & GSM-Symbolic",
    umbrellaId: "frontiers_production",
    category: "Production & Frontiers",
    icon: "🔬",
    keywords: ["gsm-symbolic", "gsm-noop", "apple benchmark", "true reasoning", "maxime jabarian", "benchmark contamination", "llm reasoning", "symbolic mutation", "noise collapse"],
    component: lazy(() => import("../reasoningBench/ReasoningBenchTab.jsx"))
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
    id: "powerfeatures",
    label: "Power Features",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚡",
    keywords: ["power features", "advanced", "optimizations"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.PowerFeaturesTab })))
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
    id: "frontiers",
    label: "Research Frontiers",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🔬",
    keywords: ["research frontiers", "state of art", "future"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ResearchFrontiersTab })))
  },
  {
    id: "progress",
    label: "Progress Tracker",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🎯",
    keywords: ["progress", "tracking", "checklist"],
    component: lazy(() => import("../App.jsx").then(m => ({ default: m.ProgressTab })))
  },
  {
    id: "guardrails",
    label: "Responsible AI & Security Guardrails",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "🛡️",
    keywords: ["responsible ai", "guardrails", "pii redaction", "author redaction", "copyright protection", "ip leak defense", "prompt injection", "jailbreak defense", "llama guard", "nemo guardrails"],
    component: lazy(() => import("../guardrails/GuardrailsTab.jsx"))
  },
  {
    id: "llmreliability",
    label: "LLM Reliability & Fault Tolerance",
    umbrellaId: "frontiers_production",
    category: "Advanced & Frontiers",
    icon: "⚙️",
    keywords: ["llm reliability", "fault tolerance", "xml tags", "markup tags", "pydantic validation", "exponential backoff", "multi-provider fallback", "fallback chain", "stochastic"],
    component: lazy(() => import("../llmReliability/LLMReliabilityTab.jsx"))
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
  return umbrella.tabs.map(id => TABS_REGISTRY.find(t => t.id === id)).filter(Boolean);
};
