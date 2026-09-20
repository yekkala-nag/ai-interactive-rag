import HubContentPage from "./HubContentPage.jsx";

const CONTENT = {
  hero: {
    title: "Multi-Agent & Frameworks",
    subtitle: "One agent does tasks. Systems of agents do jobs — pick the right frame.",
    description: "Ten topics across the practitioner-to-advanced arc: orchestration patterns and coordinator designs, A2A agent meshes, the LangChain-to-LangGraph progression with an honest comparison, MCP clients, the Agents SDK, and the loop-engineering discipline that keeps autonomous systems on track. Frameworks change; the coordination problems underneath don't.",
    hours: 12,
    icon: "🤝",
  },
  stageWord: "STEP",
  stages: [
    { icon: "🦜", title: "Frame", desc: "LangChain pipelines for composable work; compare honestly before committing." },
    { icon: "◈", title: "Orchestrate", desc: "Coordinators, specialists, typed findings, and contradiction handling." },
    { icon: "🕸️", title: "Persist", desc: "Stateful graphs with cycles, checkpoints, and human interrupts." },
    { icon: "📡", title: "Connect", desc: "A2A meshes, MCP tools, and loops that run to done." },
  ],
  topicNoun: "The ten topics",
  topicBlurb: "Follow the sequence, or jump to any topic. Tick topics off as you finish them.",
  topicCopy: {
    langchain: {
      tagline: "Composable pipelines that just work",
      description: "Chains, LCEL, prompts, models, parsers, and tools wired into maintainable pipelines. The fastest route from idea to working agent — learn where its abstractions help and where they start fighting you.",
      outcomes: ["LCEL composition", "Retrieval chains", "Know the ceiling"],
    },
    frameworkcompare: {
      tagline: "An honest buyer's guide",
      description: "SDK versus LangChain versus LangGraph across learning curve, flexibility, cycles, human-in-the-loop, and observability. Choose the frame from evidence, not hype — and know when plain Python wins.",
      outcomes: ["Compare 3 frames", "Match frame to job", "Spot overkill"],
    },
    multiagent: {
      tagline: "Specialists with handoffs",
      description: "Multi-agent pipelines: split the job, route the pieces, reconcile the results. Handoff protocols, shared state, and failure isolation for systems where no single agent sees the whole task.",
      outcomes: ["Split & route", "Handoff protocols", "Isolate failures"],
    },
    modelrouting: {
      tagline: "Right model, right step",
      description: "Adaptive routing across fast, balanced, and powerful tiers with just-in-time planning. Stop paying flagship prices for steps a small model handles — route by difficulty, verify by outcome.",
      outcomes: ["Tier design", "Difficulty routing", "Cost/quality frontier"],
    },
    mcpclient: {
      tagline: "Tools as a protocol",
      description: "Model Context Protocol clients and Streamlit apps: remote servers, JSON-RPC plumbing, stdio and SSE transports. Standardize tool access once instead of hand-rolling every integration.",
      outcomes: ["MCP client setup", "Remote servers", "Streamlit frontends"],
    },
    agentsdk: {
      tagline: "Handoffs and tools, batteries included",
      description: "The Agents SDK's triage pattern: handoffs between specialists, agents exposed as tools, orchestrators that stay thin. A opinionated, small-surface route to multi-agent systems that stays debuggable.",
      outcomes: ["Triage pattern", "Handoff design", "Thin orchestrators"],
    },
    multiagentcoord: {
      tagline: "Coordination is the product",
      description: "Coordinator agents, typed findings, contradiction detection, and risk routing across specialists. The difference between agents running in parallel and a system that converges on one correct answer.",
      outcomes: ["Typed findings", "Contradiction detection", "Risk routing"],
    },
    langgraph: {
      tagline: "Graphs with memory and cycles",
      description: "Stateful graphs: nodes, edges, conditional routing, checkpointing, and human interrupts. When the workflow loops back, branches on state, or must survive failure — graduate from chains to graphs.",
      outcomes: ["State graphs", "Cycles & routers", "Interrupt/resume"],
    },
    agenta2a: {
      tagline: "Agents talking to agents",
      description: "A2A protocols and agent meshes: discovery, blackboards, registries, and supervisor patterns for systems where agents find and coordinate with each other instead of waiting for an orchestrator.",
      outcomes: ["Discovery & registry", "Blackboard state", "Supervisor meshes"],
    },
    loopengineering: {
      tagline: "Autonomy that terminates",
      description: "Goal loops with hard caps, stall detection, cross-model review, and the loop library distilled from production practice. The advanced discipline: agents that run to done — and provably stop.",
      outcomes: ["Goal loops", "Termination proofs", "Cross-model review"],
    },
  },
  metrics: [
    { label: "Steps on flagship models", value: "−55%", trend: "adaptive routing", description: "Expensive-model calls avoided by routing routine steps to fast tiers and reserving flagship reasoning for hard steps." },
    { label: "Handoff failures", value: "−68%", trend: "typed findings", description: "Lost context and misrouted work between agents eliminated by typed handoff contracts and contradiction checks." },
    { label: "Runaway loops", value: "0", trend: "hard caps + stall detection", description: "Non-terminating agent runs in production once goal loops carry iteration caps, stall detectors, and verifier exits." },
    { label: "Integration time per tool", value: "−60%", trend: "MCP standardization", description: "Per-tool wiring cost removed by speaking one protocol to every server instead of hand-rolling each integration." },
  ],
  faqBlurb: "The questions every team asks before going multi-agent.",
  faqs: [
    {
      q: "Do I actually need multiple agents?",
      a: "Probably not yet. One well-tooled agent with good evals beats three agents with handoff bugs. Go multi-agent when the job has genuinely separable expertise, parallelizable work, or conflicting concerns — the orchestration topics teach the threshold, and the comparison topic keeps you honest.",
    },
    {
      q: "LangChain or LangGraph?",
      a: "Chains for linear, composable work; graphs when you need cycles, branching on state, persistence, or human interrupts. Many systems use both — LangChain for the retrieval pipeline feeding a LangGraph agent. The comparison topic scores them head to head.",
    },
    {
      q: "What breaks first in multi-agent systems?",
      a: "Handoffs: lost context, ambiguous ownership, contradictions nobody resolves. Typed findings, explicit protocols, and a coordinator that owns convergence fix most of it. The coordination topic exists because 'agents in parallel' is easy and 'a system that agrees' is the actual product.",
    },
    {
      q: "How do loops avoid running forever?",
      a: "Hard iteration caps, stall detection (no progress across N rounds means stop), verifier exits (an independent check declares done), and budget ceilings. Loop engineering is the discipline of making termination structural rather than hopeful.",
    },
    {
      q: "Where does MCP fit in?",
      a: "Between your agents and the outside world: one protocol for tools, data sources, and services instead of bespoke wiring per integration. Learn it once your second custom tool integration starts feeling like the first one with different names.",
    },
    {
      q: "How do I know my multi-agent system works?",
      a: "Three proofs: convergence (runs agree on one answer), attribution (every claim traces to a specialist's typed finding), and termination (no run exceeds its caps). Add per-agent evals from the Safety hub and you can ship the mesh.",
    },
  ],
  cta: {
    title: "Frameworks fade. Coordination compounds.",
    sub: "Start with the LangChain Ecosystem — then earn the graphs.",
  },
};

export default function AgtMultiHubTab({ onSelectTab }) {
  return <HubContentPage childId="agt_multi" content={CONTENT} onSelectTab={onSelectTab} />;
}
