// ============================================================================
// AI ENGINEER ROADMAP ENGINE — roadmap.sh/ai-engineer adapted to this library
// 8 stages, every node mapped to a real tab id (deep-linkable + mastery-aware)
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// Source structure: roadmap.sh AI Engineer (Kamran Ahmed) — node order kept
// ============================================================================

export const ROADMAP_STAGES = [
  {
    n: 1, id: "orient", title: "Orientation", road: "Introduction: what an AI engineer is (vs ML engineer/AGI), core terms",
    tabs: ["overview", "glossary"],
    outcome: "Speak the vocabulary; know the map"
  },
  {
    n: 2, id: "howllm", title: "How LLMs Work", road: "Tokens, context window, temperature/top-k/top-p, fine-tuning, system prompting",
    tabs: ["tokenization", "llmsampling", "selfattention", "archconcepts"],
    outcome: "Predict what sampling and attention do"
  },
  {
    n: 3, id: "promptctx", title: "Prompt + Context Engineering", road: "Role/behavior, constraints, structured output, context eval, CoT/ReAct, compaction, caching",
    tabs: ["promptfundamentals", "promptmgmt", "ctxeng", "vague", "structuredoutputs"],
    outcome: "Steer models reliably, engineer evidence"
  },
  {
    n: 4, id: "models", title: "Choose & Run Models", road: "Model types, providers (Claude/GPT/Gemini/Llama), Ollama/LM Studio/OpenRouter, Hugging Face",
    tabs: ["modellandscape", "quantserve", "slmedge"],
    outcome: "Pick and serve the right model per job"
  },
  {
    n: 5, id: "embeddings", title: "Embeddings + Vector DBs", road: "What embeddings are, embedding models, Chroma/Pinecone/FAISS/Qdrant, indexing, similarity search",
    tabs: ["knowledgebase", "vectordbops"],
    outcome: "Store and search meaning at scale"
  },
  {
    n: 6, id: "rag", title: "RAG Systems", road: "Chunking, retrieval, RAG vs fine-tuning, usecases",
    tabs: ["rag", "pipeline", "ragchunking", "qparseloop", "filtering", "rerankers", "rageval", "prodrag"],
    outcome: "Ship grounded answers, measured"
  },
  {
    n: 7, id: "agents", title: "Agents + MCP", road: "Tools/function calling, multi-agent, LangChain/LlamaIndex/SDKs, MCP client/host/server, security",
    tabs: ["fiveassets", "agentsastools", "agentplanner", "agentsandbox", "agentevals", "multiagent", "langchain", "mcpclient", "langgraph"],
    outcome: "Orchestrate tool-using systems safely"
  },
  {
    n: 8, id: "ship", title: "Eval, Observe, Ship", road: "Deterministic/model evals, RAGAS, regression testing, observability, safety, multimodal, dev tools",
    // vibecode closes as a capstone pointer (loop-earlier by design, not by journey order)
    tabs: ["llmevals", "guardrails", "llmreliability", "finops", "productionragops", "observability", "vibecode"],
    outcome: "Prove it, price it, keep it up"
  }
];

export const ROADMAP_NODE_MAP = [
  { road: "Introduction / Terminology", ours: ["overview", "glossary"], note: "Map + terms, quiz included" },
  { road: "How LLMs Work (sampling, window, tuning)", ours: ["llmsampling", "selfattention", "tokenization", "archconcepts"], note: "Mechanics before magic" },
  { road: "Prompt Engineering", ours: ["promptfundamentals", "promptmgmt", "structuredoutputs"], note: "Contracts included" },
  { road: "Context Engineering", ours: ["ctxeng", "longcontext", "memhierarchy"], note: "Our extension: memory + validity" },
  { road: "Models / Providers / Local (Ollama, HF, OpenRouter)", ours: ["modellandscape", "quantserve", "slmedge"], note: "Choose, then serve" },
  { road: "Embeddings + Vector DBs", ours: ["knowledgebase", "vectordbops"], note: "Meaning at scale" },
  { road: "RAGs (chunking, retrieval, vs fine-tune)", ours: ["rag", "ragchunking", "rerankers", "rageval", "tablegridrag"], note: "Grid tables are our extension" },
  { road: "Agents + MCP", ours: ["fiveassets", "langchain", "mcpclient", "multiagent", "handoffwatch"], note: "Handoff watchdogs are our extension" },
  { road: "Evals / Regression / Observability", ours: ["llmevals", "rageval", "promptregression", "observability"], note: "Prove every layer" },
  { road: "Safety & Ethics", ours: ["guardrails", "agentevals", "aimoralagency"], note: "Red-team included" },
  { road: "Multimodal / Dev tools", ours: ["multimodalrag", "visionlanguage", "agentpairprogramming"], note: "Ship with agents" }
];

// ── Week planner: background + goal + pace → staged schedule ────────────────
const GOAL_WEIGHT = {
  rag: { rag: 1.4, embeddings: 1.3, agents: 0.7, ship: 1.0, orient: 0.8, howllm: 1.0, promptctx: 1.1, models: 0.9 },
  agent: { agents: 1.4, ship: 1.1, rag: 0.9, promptctx: 1.2, orient: 0.8, howllm: 1.0, embeddings: 0.8, models: 0.9 },
  chat: { promptctx: 1.3, models: 1.1, ship: 1.1, orient: 0.9, howllm: 1.0, embeddings: 0.8, rag: 0.8, agents: 0.7 },
  general: { orient: 1, howllm: 1, promptctx: 1, models: 1, embeddings: 1, rag: 1, agents: 1, ship: 1 }
};

const BG_HEADSTART = { new: 0, dev: 1, ml: 2 }; // stages fast-forwarded

export const BUILD_PLAN = (background = "dev", goal = "rag", hrsPerWeek = 6) => {
  const HRS_PER_TOPIC = 0.75;
  const w = GOAL_WEIGHT[goal] || GOAL_WEIGHT.general;
  const skip = BG_HEADSTART[background] || 0;
  let week = 1;
  const rows = ROADMAP_STAGES.map((s, i) => {
    const hrs = s.tabs.length * HRS_PER_TOPIC * (w[s.id] || 1);
    const weeks = Math.max(1, Math.round(hrs / Math.max(1, hrsPerWeek)));
    const done = i < skip;
    const row = { n: s.n, title: s.title, topics: s.tabs.length, weeks: done ? 0 : weeks, startWeek: done ? 0 : week, skipped: done, outcome: s.outcome };
    if (!done) week += weeks;
    return row;
  });
  const totalWeeks = week - 1;
  const firstUp = rows.find(r => !r.skipped);
  return {
    rows, totalWeeks, background, goal, hrsPerWeek,
    headline: `${totalWeeks}-week path · ${hrsPerWeek}h/wk · first up: ${firstUp ? `Stage ${firstUp.n} ${firstUp.title}` : 'review only'}`,
    startTab: firstUp ? stageFirstTab(firstUp.n) : 'overview'
  };
};

function stageFirstTab(n) {
  const s = ROADMAP_STAGES.find(x => x.n === n);
  return s ? s.tabs[0] : 'overview';
}

export const PYTHON_ROADMAP_CODE = `# ============================================================================
# ROADMAP PLANNER: background + goal + pace -> staged week plan
# Adapted from roadmap.sh/ai-engineer stage order
# ============================================================================
HRS_PER_TOPIC = 0.75
WEIGHTS = {
    "rag":   {"rag": 1.4, "embeddings": 1.3, "agents": 0.7},
    "agent": {"agents": 1.4, "ship": 1.1, "rag": 0.9},
}
SKIP = {"new": 0, "dev": 1, "ml": 2}   # stages fast-forwarded by background

STAGES = [("orient", 2), ("howllm", 4), ("promptctx", 5), ("models", 3),
          ("embeddings", 2), ("rag", 8), ("agents", 9), ("ship", 8)]

def build_plan(background="dev", goal="rag", hrs_per_week=6):
    w, week, rows = WEIGHTS.get(goal, {}), 1, []
    for i, (sid, n) in enumerate(STAGES):
        if i < SKIP.get(background, 0):
            rows.append((sid, 0, 0, True)); continue
        weeks = max(1, round(n * HRS_PER_TOPIC * w.get(sid, 1.0) / hrs_per_week))
        rows.append((sid, weeks, week, False)); week += weeks
    return {"rows": rows, "total_weeks": week - 1}

if __name__ == "__main__":
    print(build_plan("dev", "rag", 6))
`;
