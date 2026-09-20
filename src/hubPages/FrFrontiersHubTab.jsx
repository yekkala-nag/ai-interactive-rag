import HubContentPage from "./HubContentPage.jsx";

const CONTENT = {
  hero: {
    title: "Frontiers",
    subtitle: "What's next — and what's actually ready.",
    description: "Five topics on the edge: power features that punch above their weight, your progress across the whole journey, edge SLMs and distillation, life beyond RAG architectures, and the research frontiers worth watching. End the track by separating signal from hype — and knowing where to look next.",
    hours: 5,
    icon: "🔮",
  },
  stageWord: "STEP",
  stages: [
    { icon: "⚡", title: "Leverage", desc: "Power features and optimizations with outsized returns for little effort." },
    { icon: "🎯", title: "Locate", desc: "Your progress tracker — see how far the journey has carried you." },
    { icon: "📱", title: "Shrink", desc: "Edge SLMs and distillation: flagship behavior in pocket-sized models." },
    { icon: "🔮", title: "Look ahead", desc: "Beyond RAG and the research frontiers that will shape what's next." },
  ],
  topicNoun: "The five topics",
  topicBlurb: "Follow the sequence, or jump to any topic. Tick topics off as you finish them.",
  topicCopy: {
    powerfeatures: {
      tagline: "Small efforts, outsized returns",
      description: "Power features and advanced optimizations: the highest-leverage capabilities teams overlook — streaming, caching, structured outputs, and batching — each cheap to add and immediately felt by users.",
      outcomes: ["Stream everything", "Cache ruthlessly", "Structure outputs"],
    },
    progress: {
      tagline: "See how far you've come",
      description: "Your progress tracker across the full journey: completed topics, proven skills, and what remains. Learning compounds when it's visible — check in, then choose the next frontier deliberately.",
      outcomes: ["Track completion", "Prove skills", "Plan what's next"],
    },
    slmedge: {
      tagline: "Flagship behavior, pocket budget",
      description: "Edge SLMs and distillation: Phi, SmolLM, and Qwen-class models with GGUF quantization, speculative decoding, and on-device inference. When latency, privacy, or cost rule out the cloud, small models carry the mission.",
      outcomes: ["Distill & quantize", "Serve on-device", "Speculative decoding"],
    },
    ragbeyond: {
      tagline: "What replaces the pipeline",
      description: "Beyond RAG: memory-first architectures, agentic retrieval, and future patterns that dissolve the classic pipeline into systems that plan, remember, and verify. Know what comes after what you just mastered.",
      outcomes: ["Memory-first designs", "Agentic retrieval", "Post-pipeline patterns"],
    },
    frontiers: {
      tagline: "Read the horizon like a researcher",
      description: "Research frontiers and state of the art: how to track papers, judge claims, and separate durable advances from demo-driven hype. The meta-skill that keeps every other hub in this site from expiring.",
      outcomes: ["Track papers", "Judge claims", "Separate hype"],
    },
  },
  metrics: [
    { label: "SLM task coverage", value: "78%", trend: "distilled 3–8B models", description: "Share of production tasks handled on-device by distilled small models without quality regression versus flagship calls." },
    { label: "Edge inference latency", value: "−65%", trend: "quantized + speculative", description: "Response latency cut by quantized on-device serving with speculative decoding against cloud round-trips." },
    { label: "Hype survival rate", value: "1 in 8", trend: "frontier judgment", description: "Share of hyped techniques still in use a year later — the base rate that makes claim-judgment skills pay." },
    { label: "Journey completion", value: "100%", trend: "this hub, done", description: "What finishing Frontiers means: every hub visited, skills proven, and a map of where to look next." },
  ],
  faqBlurb: "The questions every learner asks at the edge.",
  faqs: [
    {
      q: "Are small models actually good enough?",
      a: "For most scoped tasks, yes — distilled 3–8B models handle classification, extraction, summarization, and tool calling within striking distance of flagships at a fraction of the cost and latency. Reserve giant models for open-ended reasoning; default small everywhere else.",
    },
    {
      q: "Is RAG dead?",
      a: "No — it's dissolving. Retrieval as a standalone pipeline is being absorbed into memory-first, agentic systems that plan and verify. The RAG skills you built still apply; they just execute inside smarter loops. Beyond RAG maps exactly where the pipeline goes.",
    },
    {
      q: "How do I keep up with research without drowning?",
      a: "Follow benchmarks over papers, replications over announcements, and problems over methods. The frontiers topic teaches a weekly routine: skim, triage by replication status, deep-read only what survives contact with your own evals.",
    },
    {
      q: "What's the single highest-leverage power feature?",
      a: "Streaming, by a mile: perceived latency drops most of the way with one flag, and users forgive slow tasks they can watch. Structured outputs come second — typed contracts eliminate entire classes of downstream parsing bugs.",
    },
    {
      q: "Where should I go after finishing everything?",
      a: "Build in public under constraints: a portfolio project with real users, real costs, and real evals. Then revisit the hubs you rushed — second passes with production scars teach what first passes can't. The progress tracker shows exactly where your gaps are.",
    },
    {
      q: "How do I know I'm done with this site?",
      a: "When you can whiteboard any hub's core loop from memory, defend its tradeoffs with numbers, and ship a system combining three or more hubs under budget. Frontiers is the last page — the rest is practice.",
    },
  ],
  cta: {
    title: "The map ends. The territory begins.",
    sub: "Start with Power Features — then go build something real.",
  },
};

export default function FrFrontiersHubTab({ onSelectTab }) {
  return <HubContentPage childId="fr_frontiers" content={CONTENT} onSelectTab={onSelectTab} />;
}
