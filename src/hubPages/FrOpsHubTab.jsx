import HubContentPage from "./HubContentPage.jsx";

const CONTENT = {
  hero: {
    title: "Cost & Ops",
    subtitle: "Every token has a price. Every system needs an owner.",
    description: "Nine topics on the economics and operations of AI at scale: from your first app and the 3× token-bill fix through FinOps governance, production RAG and AgentOps, enterprise architecture, observability, and two advanced playbooks on token orchestration and enterprise patterns. The hub where AI stops being a demo and starts being a budget line.",
    hours: 11,
    icon: "💰",
  },
  stageWord: "STEP",
  stages: [
    { icon: "🚀", title: "Launch", desc: "Ship the first app and fix the token bill before it fixes you." },
    { icon: "💸", title: "Govern", desc: "FinOps budgets, semantic caches, and routing that bend the cost curve." },
    { icon: "⚡", title: "Operate", desc: "Production RAG, AgentOps, and observability with honest tracing." },
    { icon: "📖", title: "Codify", desc: "Enterprise playbooks: token orchestration and advanced patterns at scale." },
  ],
  topicNoun: "The nine topics",
  topicBlurb: "Follow the sequence, or jump to any topic. Tick topics off as you finish them.",
  topicCopy: {
    firstaiapp: {
      tagline: "Ship something real, fast",
      description: "Building your first AI app end to end: API keys and environments, summarizers with JSON contracts, error triage, map-reduce chunking. The rite of passage — a production-shaped app, not a notebook.",
      outcomes: ["Ship an app", "JSON contracts", "Handle errors"],
    },
    tokenbill: {
      tagline: "Cut the bill to a third",
      description: "The 3× token-bill fix: caching, routing, and compression patterns that collapse inference spend without touching quality. Every team pays this tuition once — learn it here instead of on the invoice.",
      outcomes: ["Cache hits", "Smart routing", "Compression wins"],
    },
    finops: {
      tagline: "Budgets before surprises",
      description: "FinOps and cost governance: per-run budgets, semantic caches, model routing policies, and savings rituals. Give every team a number, alert before it breaks, and review the spend like revenue depends on it.",
      outcomes: ["Per-run budgets", "Cost alerts", "Savings rituals"],
    },
    productionragops: {
      tagline: "RAG earns its complexity",
      description: "Production RAG and AgentOps: earned versus assumed complexity, FAQ-as-RAG shortcuts, noisy-text handling, pass^k measurement, compounding-error control, and hard loop caps with OpenTelemetry throughout.",
      outcomes: ["Earned complexity", "Error budgets", "Loop caps"],
    },
    enterpriseaiops: {
      tagline: "Architecture with a gateway",
      description: "Enterprise AI architecture and operations: AI gateways, token governance, semantic caching, map-reduce patterns, rerankers, and compression — the reference design for AI that legal, security, and finance all sign.",
      outcomes: ["Gateway design", "Token governance", "Reference stack"],
    },
    enterprisegrade: {
      tagline: "End to end, auditably",
      description: "Enterprise-grade AI from CRISP-DM readiness to drift and bias monitoring: buy-in, MLOps discipline, and the operational proof that the system behaves in quarter four like it did in the pilot.",
      outcomes: ["Readiness gates", "Drift monitoring", "Stakeholder buy-in"],
    },
    observability: {
      tagline: "See every span",
      description: "AI observability and tracing: OpenTelemetry spans, LangSmith and LangFuse sampling, and the dashboards that turn 'the agent felt slow' into a p95 you can point at and a span you can fix.",
      outcomes: ["Trace everything", "Sample smartly", "Dashboard p95s"],
    },
    tokenorchestrationplaybook: {
      tagline: "Conduct the token orchestra",
      description: "The enterprise token management and orchestration playbook: concurrency control, Redis and Qdrant backing, async batching, governance policies, and the infrastructure that keeps thousand-agent fleets in tune.",
      outcomes: ["Concurrency control", "Async batching", "Governance policy"],
    },
    enterpriseadvancedplaybook: {
      tagline: "Agentic patterns at enterprise scale",
      description: "Advanced enterprise topics: ReAct and plan-and-execute agents, supervisor hierarchies, agent memory, Prometheus and ELK observability, Kafka and Celery distribution, consistent hashing, and Redis-cluster rate limiting.",
      outcomes: ["Supervisor hierarchies", "Distributed agents", "Fleet observability"],
    },
  },
  metrics: [
    { label: "Token spend", value: "−67%", trend: "cache + route + compress", description: "Inference cost reduction from the standard trio — semantic caching, adaptive routing, token compression — applied in order." },
    { label: "Budget overruns", value: "−90%", trend: "FinOps alerts", description: "Surprise overruns eliminated by per-run budgets with hard limits and p95 cost-spike alerting." },
    { label: "Mean time to diagnose", value: "−72%", trend: "trace-first ops", description: "Incident diagnosis time cut when every agent run emits sampled spans into searchable dashboards." },
    { label: "Earned-complexity audits passed", value: "100%", trend: "ops reviews", description: "Production systems surviving complexity review — every component justified against a simpler alternative." },
  ],
  faqBlurb: "The questions every team asks before AI meets the budget.",
  faqs: [
    {
      q: "Why is my token bill 3× what I estimated?",
      a: "Three usual suspects: no caching (identical queries re-paid), no routing (small tasks on flagship models), and uncompressed context (full histories every turn). The token-bill topic fixes all three in order — most teams land near a third of the original spend.",
    },
    {
      q: "FinOps for AI — is it just cloud FinOps renamed?",
      a: "Same discipline, new unit economics: the billable unit is the token and the run, not the VM-hour. Per-run budgets, semantic-cache hit rates, and routing policies replace instance rightsizing — but the ritual is identical: budget, alert, review, save.",
    },
    {
      q: "When does RAG earn its complexity?",
      a: "When the questions demand it: large changing corpora, citation requirements, or freshness SLAs. For stable FAQs, a cached prompt beats a pipeline. The production-RAG topic teaches the earned-complexity audit so you build pipelines where they pay and skip them where they don't.",
    },
    {
      q: "What should I trace first?",
      a: "Per-run cost and latency with model, step, and tool attributes — sampled, searchable, alertable. When something is slow or expensive, the span tells you which step. Everything else (evals overlays, user feedback joins) layers on after the money-and-time basics.",
    },
    {
      q: "Do I need the enterprise playbooks as a small team?",
      a: "Read them for the patterns, skip the ceremony. Gateway thinking, token governance, and supervisor hierarchies scale down cleanly; the compliance apparatus doesn't need to. Take the architecture, leave the committee.",
    },
    {
      q: "How do I know my AI operations are mature?",
      a: "Four signs: spend is budgeted and alerted, every run is traceable to cost and latency, complexity survives earned-complexity review, and incidents end in playbook updates. That is the whole hub in one checklist.",
    },
  ],
  cta: {
    title: "Budgets are features. Ship accordingly.",
    sub: "Start with Building Your First AI App — then tame its bill.",
  },
};

export default function FrOpsHubTab({ onSelectTab }) {
  return <HubContentPage childId="fr_ops" content={CONTENT} onSelectTab={onSelectTab} />;
}
