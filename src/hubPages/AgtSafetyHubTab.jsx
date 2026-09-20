import HubContentPage from "./HubContentPage.jsx";

const CONTENT = {
  hero: {
    title: "Planning & Safety",
    subtitle: "Autonomy is earned: plan explicitly, gate boldly, sandbox everything.",
    description: "Nine practitioner topics on keeping agents useful and harmless at the same time: planning patterns that bound behavior, human-in-the-loop gates at the right altitude, sandboxes that contain tool use, evals and red-teaming that find failures before users do, and the debugging discipline that closes the loop. The hub that turns a capable agent into a deployable one.",
    hours: 10,
    icon: "🛡️",
  },
  stageWord: "LAYER",
  stages: [
    { icon: "🔁", title: "Plan", desc: "Explicit planning loops with step caps, stall detection, and verifiers." },
    { icon: "🛂", title: "Gate", desc: "Human approvals at irreversible actions — never on trivia." },
    { icon: "🏰", title: "Contain", desc: "Sandboxes, typed tools, and hard bounds around every side effect." },
    { icon: "🧪", title: "Prove", desc: "Evals, seam checks, and debugging that catch failures pre-deploy." },
  ],
  topicNoun: "The nine topics",
  topicBlurb: "Follow the sequence, or jump to any topic. Tick topics off as you finish them.",
  topicCopy: {
    agentplanner: {
      tagline: "Reason, act, verify — on a leash",
      description: "ReAct, plan-and-execute, reflection, and tree search with the guardrails that make them safe: step caps, stall detection, and verifier passes that check the plan before the tools run.",
      outcomes: ["Bounded loops", "Stall detection", "Verifier passes"],
    },
    agenthitl: {
      tagline: "Humans at irreversible altitude",
      description: "Approval gates where they matter — payments, deletions, external sends — and nowhere else. Design escalation ladders, risk scoring, and audit trails so oversight scales instead of bottlenecking.",
      outcomes: ["Gate placement", "Risk scoring", "Audit trails"],
    },
    agentsandbox: {
      tagline: "Deny by default",
      description: "Run tools in gVisor, Firecracker, or tight containers with secret brokers and idempotency keys. The confused-deputy problem is real; sandboxing is how you stop prompt text from becoming shell commands.",
      outcomes: ["Deny-by-default", "Secrets brokering", "Idempotent tools"],
    },
    typedagentgate: {
      tagline: "Types as safety rails",
      description: "Typed tools, hard numeric bounds, and composer gates that refuse contradiction. When the schema makes bad actions unrepresentable, whole failure classes disappear instead of being handled.",
      outcomes: ["Typed I/O", "Hard bounds", "Contradiction refusal"],
    },
    agentevals: {
      tagline: "Test the behavior, not the demo",
      description: "Task benchmarks, pass^k statistics, red-teaming for jailbreaks and goal drift. Evals are the only honest measure of an agent — build the harness before you need the postmortem.",
      outcomes: ["Task benchmarks", "Red-teaming", "pass^k reporting"],
    },
    handoffwatch: {
      tagline: "Watch the seams, not just the ends",
      description: "Silent failures live between steps: empty 200s, plausible-but-wrong intermediates, confidence below the floor. Seam evals and watchdog checks catch what end-to-end tests walk straight past.",
      outcomes: ["Intermediate evals", "Confidence floors", "Watchdog checks"],
    },
    verifiedpipes: {
      tagline: "Policy as code beats review theater",
      description: "Verified pipelines with executable checks versus human review that rubber-stamps. Encode invariants, verify every run, and reserve human attention for the judgments only humans can make.",
      outcomes: ["Executable invariants", "Verify every run", "Reserve human judgment"],
    },
    codingevals: {
      tagline: "Evaluate the work, not the chat",
      description: "Six-layer executable contracts for coding agents: hidden tests, trial statistics, and outcome checks from SWE-bench to terminal-bench. If the tests can't fail it, the eval can't trust it.",
      outcomes: ["Hidden tests", "Trial statistics", "Outcome contracts"],
    },
    agentdebugging: {
      tagline: "Read the trace like a flight recorder",
      description: "Tool-error taxonomies, trace inspection, and reproduction discipline. Debugging agents means debugging decisions — learn to replay runs, isolate the bad step, and fix the cause instead of the symptom.",
      outcomes: ["Trace replay", "Error taxonomy", "Fix causes"],
    },
  },
  metrics: [
    { label: "Escaped failures", value: "−82%", trend: "gates + sandboxes", description: "Agent-caused incidents reaching users after planning bounds, HITL gates, and sandboxed tool execution are enforced together." },
    { label: "Needless approvals", value: "−70%", trend: "risk-scored gating", description: "Human review load removed by gating only irreversible, high-risk actions instead of every agent step." },
    { label: "Red-team findings fixed pre-ship", value: "9 in 10", trend: "eval harness", description: "Jailbreak, injection, and drift findings caught by evals and seam checks before deployment rather than by users after it." },
    { label: "Mean time to root cause", value: "−65%", trend: "trace discipline", description: "Debugging time cut by replayable traces and error taxonomies that point at the deciding step, not the final symptom." },
  ],
  faqBlurb: "The questions every team asks before letting agents act.",
  faqs: [
    {
      q: "Won't safety gates make the agent uselessly slow?",
      a: "Only badly placed ones. Gates belong at irreversible actions — sends, payments, deletions — which are a tiny fraction of steps. Risk-scored gating keeps the fast path fast: low-risk actions flow, high-risk actions pause. The topic teaches placement so oversight scales instead of bottlenecking.",
    },
    {
      q: "Sandbox or prompt instructions — which stops prompt injection?",
      a: "Sandboxing. Instructions help against accidents; only deny-by-default execution, secret brokering, and idempotent tools contain a malicious or confused tool call. Treat every retrieved string as untrusted input and every tool as a loaded one — then contain accordingly.",
    },
    {
      q: "How is this hub different from Agent Foundations?",
      a: "Foundations teaches what to build — assets, tools, archetypes. This hub teaches how to keep it safe once it acts: planners with bounds, gates, sandboxes, evals, and debugging. Foundations earns capability; this hub earns deployment permission.",
    },
    {
      q: "Evals feel endless. Where do I stop?",
      a: "At three layers: task benchmarks proving it works, red-teaming proving it resists abuse, and seam evals proving the intermediates are sound. When all three are green and gated in CI, ship — and let production traces feed the next round of eval cases.",
    },
    {
      q: "What is a seam eval, concretely?",
      a: "A check on intermediate state between agent steps: is the tool result non-empty and well-formed, does the plan still match the goal, is confidence above the floor? Handoff Watchdogs exist because end-to-end tests pass while intermediates silently rot — seam evals watch the joints.",
    },
    {
      q: "How do I know my agent is safe enough to ship?",
      a: "Four gates: bounded planning with verifiers, HITL on irreversible actions, sandboxed tool execution with audit trails, and green task + red-team + seam evals. Miss any one and you have a demo with users, not a product.",
    },
  ],
  cta: {
    title: "Capability without containment is a liability.",
    sub: "Start with Agent Planning Patterns — bounds first, autonomy second.",
  },
};

export default function AgtSafetyHubTab({ onSelectTab }) {
  return <HubContentPage childId="agt_safety" content={CONTENT} onSelectTab={onSelectTab} />;
}
