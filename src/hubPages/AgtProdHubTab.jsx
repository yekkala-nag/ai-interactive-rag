import HubContentPage from "./HubContentPage.jsx";

const CONTENT = {
  hero: {
    title: "Agents in Production",
    subtitle: "From working demo to daily driver: ship agents people rely on.",
    description: "Ten topics on the last mile: local CLI agents, pairing effectively with coding agents, vibe-coding economics, product building, deployment, and the scale patterns — plus two capstones that prove the whole track. Production is where agent theory meets on-call reality.",
    hours: 12,
    icon: "🚀",
  },
  stageWord: "STEP",
  stages: [
    { icon: "🤖", title: "Operate", desc: "Local CLI agents and daily pairing habits that make agents extensions of you." },
    { icon: "🤝", title: "Pair", desc: "Work with coding agents like a senior pair: decompose, inject context, verify." },
    { icon: "📦", title: "Ship", desc: "Products, deployments, and FinAssist-style portfolio builds that prove it." },
    { icon: "🚀", title: "Scale", desc: "High-scale systems and hundred-task autonomous runs with unit economics." },
  ],
  topicNoun: "The ten topics",
  topicBlurb: "Follow the sequence, or jump to any topic. Tick topics off as you finish them.",
  topicCopy: {
    cliagent: {
      tagline: "Agents in your terminal",
      description: "Local CLI agents with Ollama and Qwen: subprocess control, file workflows, and offline-capable assistance. The fastest way to put agent leverage into your existing daily loop.",
      outcomes: ["Local agent setup", "Terminal workflows", "Offline capability"],
    },
    agentpairprogramming: {
      tagline: "Be the senior in the pair",
      description: "Task decomposition, test-driven prompting, context injection, and human-in-the-loop review. Working with AI coding agents is pair programming — act like the senior partner, not the spectator.",
      outcomes: ["Decompose tasks", "Inject context", "Verify output"],
    },
    vibecode: {
      tagline: "Know what the vibes cost",
      description: "Vibe-coding unit economics: static-first builds, minimum viable offers, and the math on when fast generation beats careful engineering. Ship toys by feel; ship products by arithmetic.",
      outcomes: ["Unit economics", "Static-first", "Know the threshold"],
    },
    aiproductbuilder: {
      tagline: "From agent to product",
      description: "PRDs, system specs, architecture decisions, and cursor rules that turn an agent experiment into something shippable. Product discipline is the difference between a cool demo and a tool with users.",
      outcomes: ["Write the PRD", "Spec the system", "Ship to users"],
    },
    capstone2: {
      tagline: "Prove the agent track",
      description: "The Loop 2 boss fight: multi-agent research reports with token dashboards and kill drills. Synthesize everything from foundations through frameworks into one evaluated, budgeted system.",
      outcomes: ["Multi-agent report", "Token dashboard", "Kill drill"],
    },
    finassistproject: {
      tagline: "A bank-grade portfolio build",
      description: "FinAssist: a compliance-aware banking AI with PII redaction, RAG, and agentic workflows on LangGraph and MCP. Real-time constraints, real governance — the project that proves production readiness to employers.",
      outcomes: ["Compliance design", "PII redaction", "Agentic workflow"],
    },
    zerocostmultiagent: {
      tagline: "Agents on hardware you own",
      description: "Zero-cost multi-agent systems on aging hardware: quantized models, lazy loading, and lean daemons. Proof that the patterns matter more than the GPU budget — constraints included.",
      outcomes: ["Quantized serving", "Lazy loading", "Lean daemons"],
    },
    modeldeploy: {
      tagline: "Serve it like software",
      description: "Docker, FastAPI, EC2, and containerization for model serving. Deployment is a solved problem with boring tools — learn the standard path so your agents live somewhere other than localhost.",
      outcomes: ["Containerize", "Serve via API", "Deploy on EC2"],
    },
    claudecode100: {
      tagline: "One hundred tasks, autonomous",
      description: "Solving 100+ tasks with Claude Code: sub-agents, worktrees, task triage and bifurcation, verification reports. The advanced playbook for sustained autonomous coding at real scale.",
      outcomes: ["Worktree fleets", "Task triage", "Verification reports"],
    },
    agentscale: {
      tagline: "Millions of requests, still standing",
      description: "High-scale agent systems: concurrency, caching, rate limiting, and cost control under millions of requests. The architecture that keeps per-run economics sane when usage goes vertical.",
      outcomes: ["Concurrency design", "Cache strategy", "Cost control"],
    },
  },
  metrics: [
    { label: "Tasks per engineer-day", value: "4×", trend: "pairing discipline", description: "Throughput gain for engineers pairing effectively with coding agents versus solo work on matched task sets." },
    { label: "Serving cost per 1k runs", value: "−58%", trend: "cache + route + quantize", description: "Per-run cost reduction from caching, adaptive routing, and quantized serving in high-volume agent deployments." },
    { label: "Autonomous task success", value: "87%", trend: "100-task playbook", description: "Task completion rate for sustained autonomous coding runs using triage, worktrees, and verification reports." },
    { label: "P95 agent latency", value: "−44%", trend: "production hardening", description: "Response latency cut by streaming, parallel tool calls, and right-sized models in shipped agent products." },
  ],
  faqBlurb: "The questions every team asks before shipping agents.",
  faqs: [
    {
      q: "When is an agent ready for production?",
      a: "When four things hold: bounded behavior with evals green, cost per run modeled and alerted, failures that degrade gracefully instead of confusing users, and an owner who reads the traces. The capstones exist to prove all four before real users arrive.",
    },
    {
      q: "Vibe-coding or engineering — which is it?",
      a: "Both, at different altitudes. Vibe-coding wins for prototypes, static sites, and throwaway tools; engineering wins the moment users, money, or compliance appear. The unit-economics topic teaches the threshold so you choose deliberately instead of by habit.",
    },
    {
      q: "How do I keep serving costs sane at scale?",
      a: "Cache aggressively (semantic and exact), route easy steps to small models, quantize what you self-serve, and stream so users tolerate longer tasks. Cost control is architecture, not accounting — design it in from the first deploy.",
    },
    {
      q: "What makes FinAssist different from a tutorial project?",
      a: "Constraints: banking compliance, PII redaction that actually works, realtime latency, and governance an auditor could inspect. Tutorial projects optimize for completion; FinAssist optimizes for employability — it proves you can ship under production rules.",
    },
    {
      q: "Can I really run agents on old hardware?",
      a: "Yes, with quantization, lazy loading, and scoped tasks. You won't train frontier models on it, but multi-agent research, coding assistance, and document workflows all run fine. Constraints teach the efficiency patterns that expensive hardware lets you skip — until the bill arrives.",
    },
    {
      q: "How do I know my deployment works?",
      a: "Dashboards, not hopes: per-run cost and latency percentiles, task success rates, eval scores on live traffic samples, and kill drills proving you can stop a misbehaving fleet. If you can't see it, you can't ship it.",
    },
  ],
  cta: {
    title: "Demos end. Products compound.",
    sub: "Start with Local CLI Agents — put leverage in your terminal today.",
  },
};

export default function AgtProdHubTab({ onSelectTab }) {
  return <HubContentPage childId="agt_prod" content={CONTENT} onSelectTab={onSelectTab} />;
}
