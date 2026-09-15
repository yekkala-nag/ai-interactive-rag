// ============================================================================
// MEMORY HIERARCHY & LIFECYCLE ENGINE
// Tiers (working/episodic/semantic), MemGPT paging, forgetting, privacy
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// Extended with: 6 Best AI Agent Memory Frameworks (ML Mastery) — MemGPT,
// Letta, LangMem, Zep, Mem0, and CrewAI Memory comparison
// ============================================================================

export const MEMORY_TIERS = [
  { tier: "Working", scope: "Current session, prompt window", capacity: "4k–1M tokens", latency: "instant", evict: "Compaction / summarise on overflow", example: "open task, recent turns" },
  { tier: "Episodic", scope: "Past sessions, per user", capacity: "1k–100k events", latency: "ms (vector + metadata)", evict: "Salience-scored forgetting", example: "user prefers API over UI" },
  { tier: "Semantic", scope: "Cross-user durable facts", capacity: "curated KB", latency: "ms–s (review-gated)", evict: "Human/LLM curation only", example: "refund window = 14 days" },
  { tier: "Cold archive", scope: "Compliance / audit trail", capacity: "unbounded", latency: "s–min", evict: "Retention policy (TTL)", example: "2024 consent logs" }
];

export const MEMGPT_LOOP = [
  { step: 1, name: "Main-context pressure check", detail: "Token budget meter; if >85% trigger paging" },
  { step: 2, name: "Function-call page-out", detail: "LLM emits archival_search / recall to move spans out" },
  { step: 3, name: "External store read", detail: "Vector + metadata fetch into scratchpad" },
  { step: 4, name: "Page-in + continue", detail: "Resume with pointers, not full history" }
];

export const FORGETTING_RULES = [
  { rule: "Recency × salience score", detail: "score = 0.6·salience + 0.3·recency + 0.1·frequency; drop below threshold", keeps: "preferences, corrections, decisions" },
  { rule: "Contradiction supersedes", detail: "New verified fact tombstones old (bitemporal valid_to)", keeps: "latest verified only" },
  { rule: "Privacy redaction first", detail: "PII spans quarantined before salience scoring", keeps: "nothing raw — hashes/pointers only" },
  { rule: "User-erase wins", detail: "'Forget X' deletes + confirms; audit logs the deletion", keeps: "tombstone receipt" }
];

// ── Simulator: route a memory event ─────────────────────────────────────────
export const ROUTE_MEMORY = (kind = "preference", pii = false, verified = true, ageDays = 30, salience = 0.8) => {
  if (pii) return { tier: "Quarantine → Cold archive (hashed)", action: "Redact spans, store pointer + TTL; never in working/episodic raw.", risk: "high if skipped" };
  const recency = Math.max(0, 1 - ageDays / 90);
  const score = 0.6 * salience + 0.3 * recency + 0.1 * 0.5;
  if (kind === "session-fact") return { tier: "Working", action: "Keep in context; compact on overflow.", score: +score.toFixed(2) };
  if (!verified) return { tier: "Episodic (unverified flag)", action: "Retrievable but labelled; promote on verification.", score: +score.toFixed(2) };
  if (score >= 0.5) return { tier: score >= 0.75 ? "Semantic (curated)" : "Episodic", action: score >= 0.75 ? "Promote to durable KB with provenance." : "Keep episodic; re-score on access.", score: +score.toFixed(2) };
  return { tier: "Cold archive", action: "Page out; TTL-governed.", score: +score.toFixed(2) };
};

export const PYTHON_MEMORY_CODE = `# ============================================================================
# MEMORY HIERARCHY: tier + salience forgetting + PII quarantine
# ============================================================================
from dataclasses import dataclass
import time, hashlib

@dataclass
class MemoryEvent:
    text: str; kind: str            # session-fact | preference | correction | decision
    salience: float                # 0..1 (LLM-judged importance)
    ts: float = time.time()
    pii: bool = False
    verified: bool = True

def quarantine(text: str) -> str:
    return "sha256:" + hashlib.sha256(text.encode()).hexdigest()[:16]

def route(ev: MemoryEvent) -> str:
    if ev.pii:
        return f"COLD(hashed={quarantine(ev.text)})"
    age_days = (time.time() - ev.ts) / 86400
    recency = max(0.0, 1 - age_days / 90)
    score = 0.6 * ev.salience + 0.3 * recency + 0.1 * 0.5
    if ev.kind == "session-fact":
        return f"WORKING(score={score:.2f})"
    if not ev.verified:
        return f"EPISODIC-unverified(score={score:.2f})"
    if score >= 0.75:
        return f"SEMANTIC(score={score:.2f})"
    return f"EPISODIC(score={score:.2f})" if score >= 0.5 else f"COLD(score={score:.2f})"

if __name__ == "__main__":
    print(route(MemoryEvent("prefers API over UI", "preference", 0.9)))
    print(route(MemoryEvent("SSN 123-45-6789", "session-fact", 0.9, pii=True)))
`;

// ============================================================================
// 6 BEST AI AGENT MEMORY FRAMEWORKS (ML MASTERY 2026)
// MemGPT, Letta, LangMem, Zep, Mem0, CrewAI Memory — Deep Comparison
// ============================================================================

export const MEMORY_FRAMEWORKS_2026 = [
  {
    name: "MemGPT",
    category: "OS-Level Memory Management",
    keyInsight: "Virtual memory for LLMs — paging between main context (RAM) and external storage (disk/Vector DB). Inspired by OS memory hierarchy.",
    architecture: [
      "Main Context: Fixed token budget (e.g., 8k), always in prompt",
      "External Context: Vector DB + key-value store for archival/recall",
      "Function Calls: LLM emits archival_search, memory_insert, memory_replace",
      "Compaction: Summarization when main context >85% full"
    ],
    strengths: ["Theoretical grounding (OS analogy)", "Automatic paging", "Open source, self-hostable", "Multi-user isolation"],
    limitations: ["Custom function calling format", "Steeper learning curve", "Vector DB ops can be slow"],
    bestFor: "Long-running agents, multi-session continuity, research prototypes",
    github: "https://github.com/cpacker/MemGPT",
    license: "Apache 2.0"
  },
  {
    name: "Letta (formerly MemGPT Cloud)",
    category: "Managed Agent Platform with Memory",
    keyInsight: "Production-hosted MemGPT with REST API, agent management UI, and built-in tool ecosystem. Adds persistence, monitoring, and team collaboration.",
    architecture: [
      "Agent Server: Stateful agents with persistent memory across sessions",
      "Memory Blocks: Core memory (persona, human) + archival memory + recall memory",
      "Tool Framework: Built-in tools (web, code, file) + custom tool registration",
      "Multi-tenancy: Org/workspace isolation, RBAC, audit logs"
    ],
    strengths: ["Zero-infrastructure deployment", "Agent versioning & rollback", "Rich dashboard + analytics", "Enterprise SSO/SCIM"],
    limitations: ["Vendor lock-in", "Pricing at scale", "Less control over memory internals"],
    bestFor: "Production agent deployments, teams needing managed infrastructure, compliance-heavy environments",
    website: "https://www.letta.com",
    license: "SaaS (proprietary)"
  },
  {
    name: "LangMem (LangChain Memory)",
    category: "LangChain-Native Memory Primitives",
    keyInsight: "Composable memory modules for LangChain/LangGraph: conversation buffer, entity memory, summary memory, vector store retriever. Drop-in for LCEL chains.",
    architecture: [
      "ConversationBufferMemory: Raw message history (token-heavy)",
      "ConversationSummaryMemory: Rolling LLM summary (token-efficient)",
      "EntityMemory: Extracts & tracks entities across turns",
      "VectorStoreRetrieverMemory: Semantic search over past interactions"
    ],
    strengths: ["Native LangChain/LangGraph integration", "Modular — mix & match", "Mature ecosystem", "Streaming support"],
    limitations: ["No automatic paging/compaction", "Manual memory management", "Single-threaded conversation model"],
    bestFor: "LangChain/LangGraph projects, rapid prototyping, simple chatbots",
    github: "https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/memory",
    license: "MIT"
  },
  {
    name: "Zep",
    category: "Long-Term Memory Service (Graph + Vector)",
    keyInsight: "Knowledge graph + vector hybrid. Builds temporal knowledge graph from conversations: entities, relationships, timestamps. Supports time-travel queries.",
    architecture: [
      "Memory Graph: Nodes=entities, Edges=relationships, Properties=attributes + time",
      "Vector Index: Embeddings for semantic search",
      "Automatic Extraction: LLM extracts facts/entities from each message",
      "Time-Travel: Query graph state at any historical timestamp"
    ],
    strengths: ["Temporal reasoning (what did user say 3 months ago?)", "Graph + vector hybrid retrieval", "High-performance Go backend", "Open core + cloud"],
    limitations: ["Graph complexity for simple use cases", "Self-hosting needs resources", "Schema evolution handling"],
    bestFor: "Personal assistants, customer support, any app needing temporal memory",
    github: "https://github.com/getzep/zep",
    license: "Apache 2.0 (core), Commercial (cloud)"
  },
  {
    name: "Mem0",
    category: "Lightweight Memory Layer for AI Apps",
    keyInsight: "Minimal API: add(), search(), get(). Automatic fact extraction, deduplication, and user-scoped memory. Designed for easy integration, not OS-level control.",
    architecture: [
      "Fact Extraction: LLM pulls atomic facts from conversation",
      "Deduplication: Embedding-based near-dup detection + merge",
      "User Scoping: Memories isolated per user_id / agent_id / session_id",
      "Simple API: mem0.add(messages, user_id), mem0.search(query, user_id)"
    ],
    strengths: ["Dead-simple integration (5 lines)", "Auto fact extraction + dedup", "Generous free tier", "Multi-tenant by default"],
    limitations: ["Less control over memory policies", "No graph/temporal reasoning", "Black-box extraction"],
    bestFor: "Quick memory addition to existing apps, multi-user chatbots, MVPs",
    github: "https://github.com/mem0ai/mem0",
    license: "Apache 2.0"
  },
  {
    name: "CrewAI Memory",
    category: "Multi-Agent Crew Memory (Short/Long/Entity)",
    keyInsight: "Memory scoped to crew execution: short-term (task), long-term (cross-task), entity (facts). Shared across agents in a crew for collaborative memory.",
    architecture: [
      "ShortTermMemory: Task-scoped, cleared after crew kickoff",
      "LongTermMemory: Persistent across crew runs, shared by all agents",
      "EntityMemory: Structured fact store (name→value) with TTL",
      "Crew-Level: Agents read/write same memory stores; no external DB needed"
    ],
    strengths: ["Native to CrewAI multi-agent flows", "Shared memory = emergent collaboration", "Zero external infra for simple cases", "CrewAI ecosystem integration"],
    limitations: ["Tied to CrewAI framework", "No vector search (keyword/entity only)", "Limited persistence options"],
    bestFor: "CrewAI multi-agent crews, collaborative research agents, agent swarms",
    github: "https://github.com/joaomdmoura/crewAI",
    license: "MIT"
  }
];

export const MEMORY_FRAMEWORK_SELECTION_GUIDE = [
  {
    scenario: "Need OS-level virtual memory with automatic paging",
    recommended: "MemGPT (self-host) / Letta (managed)",
    reason: "Only frameworks with true main-context paging + external storage abstraction"
  },
  {
    scenario: "Building with LangChain/LangGraph, need drop-in memory",
    recommended: "LangMem",
    reason: "Native LCEL composables, no architecture changes"
  },
  {
    scenario: "Need temporal queries: \"What did user prefer in March?\"",
    recommended: "Zep",
    reason: "Knowledge graph with timestamps enables time-travel"
  },
  {
    scenario: "Quick memory for multi-user chatbot, minimal code",
    recommended: "Mem0",
    reason: "5-line integration, auto fact extraction, user scoping built-in"
  },
  {
    scenario: "Multi-agent crew (CrewAI) needs shared memory",
    recommended: "CrewAI Memory",
    reason: "Designed for agent-to-agent memory sharing within crew"
  },
  {
    scenario: "Enterprise: compliance, audit, SSO, multi-tenant",
    recommended: "Letta (cloud) or Zep (self-host enterprise)",
    reason: "RBAC, audit logs, data residency, support SLAs"
  }
];

export const PYTHON_MEMORY_FRAMEWORK_COMPARISON = `# ============================================================================
# MEMORY FRAMEWORK QUICKSTART COMPARISON
# Run each to see API differences — pick based on architecture fit
# ============================================================================

# 1. MEMGPT (self-hosted)
# pip install memgpt
from memgpt import create_client
client = create_client()
agent = client.create_agent(
    name="assistant",
    persona="You are a helpful assistant with long-term memory.",
    human="User prefers concise answers."
)
# Agent automatically pages memory via function calls

# 2. LETTA (cloud)
# pip install letta
from letta import LettaClient
client = LettaClient(token="sk-letta-...")
agent = client.agents.create(
    name="assistant",
    memory_blocks=[{"label": "persona", "value": "Helpful assistant"}]
)
response = client.agents.messages.create(agent_id=agent.id, messages=[{"role": "user", "content": "Hi!"}])

# 3. LANGMEM (LangChain)
# pip install langchain langchain-openai
from langchain.memory import ConversationSummaryBufferMemory
from langchain_openai import ChatOpenAI
memory = ConversationSummaryBufferMemory(llm=ChatOpenAI(), max_token_limit=2000)
# Use in LCEL chain: chain = prompt | llm | memory

# 4. ZEP (self-host or cloud)
# pip install zep-cloud
from zep_cloud import ZepClient
client = ZepClient(api_key="sk-zep-...")
user = client.user.add(user_id="user_123", email="user@example.com")
client.memory.add(session_id="sess_1", messages=[{"role": "user", "content": "I love Rust"}])
results = client.memory.search(session_id="sess_1", query="programming language")

# 5. MEM0
# pip install mem0ai
from mem0 import Memory
mem = Memory()
mem.add([{"role": "user", "content": "I prefer dark mode"}], user_id="user_123")
results = mem.search("UI preference", user_id="user_123")

# 6. CREWAI MEMORY
# pip install crewai
from crewai import Agent, Task, Crew, Process
from crewai.memory import ShortTermMemory, LongTermMemory, EntityMemory
agent = Agent(role="Researcher", goal="Find info")
task = Task(description="Research X", agent=agent)
crew = Crew(
    agents=[agent], tasks=[task],
    memory=True,
    short_term_memory=ShortTermMemory(),
    long_term_memory=LongTermMemory(),
    entity_memory=EntityMemory()
)
result = crew.kickoff()
`;
