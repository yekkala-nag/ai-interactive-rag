import HubContentPage from "./HubContentPage.jsx";

const CONTENT = {
  hero: {
    title: "Eval & Reliability",
    subtitle: "If you can't measure it, you can't ship it — twice.",
    description: "Six topics on proving AI quality: best-practice baselines, LLM eval quality gates with attribution, banking-grade validation playbooks, reasoning benchmarks that catch benchmark contamination, guardrails for PII and injection, and fault-tolerance patterns that keep systems standing when models stumble.",
    hours: 7,
    icon: "✅",
  },
  stageWord: "GATE",
  stages: [
    { icon: "✓", title: "Baseline", desc: "Best practices and checklists — the floor every system stands on." },
    { icon: "⚖️", title: "Evaluate", desc: "Quality gates with attribution: which change moved which metric." },
    { icon: "🔬", title: "Stress", desc: "Reasoning benchmarks and contamination-aware validation under pressure." },
    { icon: "🛡️", title: "Harden", desc: "Guardrails and fault tolerance that hold when models fail." },
  ],
  topicNoun: "The six topics",
  topicBlurb: "Follow the sequence, or jump to any topic. Tick topics off as you finish them.",
  topicCopy: {
    practices: {
      tagline: "The floor, not the ceiling",
      description: "Best-practice baselines and checklists across RAG, agents, and production: the non-negotiables every system needs before advanced work begins. Boring, load-bearing, first.",
      outcomes: ["Baseline checklist", "Non-negotiables", "Audit readiness"],
    },
    llmevals: {
      tagline: "Gates with attribution",
      description: "LLM eval quality gates that attribute movement: specificity checks, serve/retry/block decisions, and eval-to-launch discipline. Know which change improved quality — and which one only looked like it did.",
      outcomes: ["Quality gates", "Attribution", "Launch discipline"],
    },
    modelvalidation: {
      tagline: "Validation a regulator would accept",
      description: "The GenAI validation playbook from banking: risk tiering, conceptual soundness, outcomes analysis, monitoring, and judging the judge. SR 11-7-grade rigor adapted for language models.",
      outcomes: ["Risk tiering", "Soundness review", "Ongoing monitoring"],
    },
    reasoningbench: {
      tagline: "Test reasoning, not memorization",
      description: "GSM-Symbolic and the contamination problem: models that ace benchmarks they trained on. Learn symbolic mutation, noise injection, and the benchmarks that measure true reasoning instead of recall.",
      outcomes: ["Contamination checks", "Symbolic mutation", "True-reasoning probes"],
    },
    guardrails: {
      tagline: "PII in, secrets out — never",
      description: "Responsible AI and security guardrails: PII and author redaction, copyright and IP-leak defense, prompt-injection and jailbreak resistance with Llama Guard and NeMo-style enforcement.",
      outcomes: ["Redaction pipelines", "Injection defense", "Policy enforcement"],
    },
    llmreliability: {
      tagline: "Graceful under stochastic stress",
      description: "Reliability and fault tolerance: XML markup discipline, Pydantic validation, exponential backoff, multi-provider fallback chains. Stochastic models on deterministic infrastructure — engineer the seam.",
      outcomes: ["Validation contracts", "Backoff & retry", "Fallback chains"],
    },
  },
  metrics: [
    { label: "Regressions caught pre-launch", value: "94%", trend: "gated evals", description: "Quality regressions intercepted by eval gates with attribution before reaching users." },
    { label: "PII leak incidents", value: "0", trend: "redaction + guardrails", description: "Production leaks after redaction pipelines and output guardrails enforced on every path." },
    { label: "Eval-attributed rollbacks", value: "−71%", trend: "serve/retry/block", description: "Bad launches avoided by graduated rollout decisions tied to eval movement, not vibes." },
    { label: "Provider-outage impact", value: "−89%", trend: "fallback chains", description: "User-facing errors during model provider incidents, absorbed by backoff, retry, and multi-provider fallback." },
  ],
  faqBlurb: "The questions every team asks before trusting model output.",
  faqs: [
    {
      q: "Evals based on vibes — what's the alternative?",
      a: "Gates with attribution: fixed golden sets, metric thresholds that block launch, and per-change attribution showing which edit moved quality. The LLM evals topic replaces 'looks good to me' with serve, retry, or block — decided by numbers.",
    },
    {
      q: "Do I need banking-grade validation?",
      a: "The rigor, not the paperwork. Risk tiering, conceptual soundness, outcomes analysis, and monitoring transfer to any serious deployment. Regulated or not, 'judge the judge' robustness checks catch the eval failures that ship bad models quietly.",
    },
    {
      q: "How do I know a benchmark isn't contaminated?",
      a: "Mutate it: symbolic variants, paraphrase, noise injection. If scores collapse under mutation, the model memorized the benchmark. The reasoning-bench topic teaches contamination-aware testing so you measure reasoning, not recall.",
    },
    {
      q: "Guardrails vs. model alignment — which protects users?",
      a: "Both, at different layers. Alignment reduces bad tendencies; guardrails enforce hard boundaries on PII, secrets, injection, and policy regardless of model mood. Defense in depth: never rely on the model's good intentions alone.",
    },
    {
      q: "What fails first when a provider goes down?",
      a: "Whatever lacks a fallback: single-provider calls with no retry policy and no degraded mode. Backoff, multi-provider chains, cached responses, and graceful partial answers turn outages from incidents into footnotes.",
    },
    {
      q: "How do I know my system is reliable enough?",
      a: "Three proofs: evals green and attributed on every change, zero PII or policy escapes on adversarial probes, and a chaos-tested fallback path for provider failure. Green across all three means shippable.",
    },
  ],
  cta: {
    title: "Vibes don't ship. Gates do.",
    sub: "Start with Best Practices — pour the foundation first.",
  },
};

export default function FrEvalHubTab({ onSelectTab }) {
  return <HubContentPage childId="fr_eval" content={CONTENT} onSelectTab={onSelectTab} />;
}
