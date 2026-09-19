export const PROMPT_LIFECYCLE_CONTENT = {
  hero: {
    title: "Prompt Lifecycle",
    subtitle: "From first prompt to production contracts — the full prompt engineering lifecycle",
    description: `Prompt engineering isn't a one-time activity. It's a lifecycle: write → version → test → contract → monitor → iterate. This hub maps every stage from zero-shot basics to regression gates that catch silent failures in production.`,
    estimatedHours: 6.5,
    totalTopics: 10,
    levels: { 1: 3, 2: 4, 3: 3 }
  },

  quickStartPaths: [
    {
      id: "l1-foundations",
      label: "L1 Foundations (30 min)",
      description: "Write better prompts, manage versions, master the 3-sentence pattern",
      topics: ["promptfundamentals", "promptmgmt", "threesentenceprompt"],
      icon: "📝",
      color: "#5EC4C8"
    },
    {
      id: "l2-practitioner",
      label: "L2 Practitioner (60 min)",
      description: "Structured outputs, learning from feedback, dependency graphs",
      topics: ["structuredoutputs", "promptlearning", "promptdependencygraph", "workflows"],
      icon: "🔗",
      color: "#9B89C4"
    },
    {
      id: "l3-advanced",
      label: "L3 Advanced (90 min)",
      description: "Contracts that prevent breaking changes, regression detection, chained workflows",
      topics: ["promptcontracts", "promptregression", "unhobbling"],
      icon: "🛡️",
      color: "#F0A89A"
    }
  ],

  visualMap: {
    nodes: [
      { id: "promptfundamentals", label: "Fundamentals", level: 1, x: 100, y: 100, unlocks: ["promptmgmt", "structuredoutputs", "threesentenceprompt", "workflows", "unhobbling"] },
      { id: "promptmgmt", label: "Management", level: 1, x: 100, y: 220, unlocks: ["promptlearning", "promptdependencygraph"] },
      { id: "threesentenceprompt", label: "3-Sentence", level: 1, x: 100, y: 340, unlocks: [] },
      { id: "structuredoutputs", label: "Structured Out", level: 2, x: 300, y: 100, unlocks: [] },
      { id: "workflows", label: "Workflows", level: 2, x: 300, y: 220, unlocks: [] },
      { id: "unhobbling", label: "Unhobbling", level: 2, x: 300, y: 340, unlocks: [] },
      { id: "promptlearning", label: "Learning", level: 2, x: 500, y: 160, unlocks: [] },
      { id: "promptdependencygraph", label: "Dep Graph", level: 2, x: 500, y: 280, unlocks: ["promptcontracts", "promptregression"] },
      { id: "promptcontracts", label: "Contracts", level: 3, x: 700, y: 160, unlocks: [] },
      { id: "promptregression", label: "Regression", level: 3, x: 700, y: 280, unlocks: [] }
    ],
    edges: [
      { from: "promptfundamentals", to: "promptmgmt" },
      { from: "promptfundamentals", to: "structuredoutputs" },
      { from: "promptfundamentals", to: "threesentenceprompt" },
      { from: "promptfundamentals", to: "workflows" },
      { from: "promptfundamentals", to: "unhobbling" },
      { from: "promptmgmt", to: "promptlearning" },
      { from: "promptmgmt", to: "promptdependencygraph" },
      { from: "promptdependencygraph", to: "promptcontracts" },
      { from: "promptdependencygraph", to: "promptregression" }
    ]
  },

  keyMetrics: [
    { label: "Prompt Versioning Adoption", value: "67%", trend: "+12% YoY", description: "Teams using git-like versioning for prompts" },
    { label: "Regression Catch Rate", value: "89%", trend: "+23% with contracts", description: "Silent failures caught before production" },
    { label: "Structured Output Compliance", value: "94%", trend: "+31% vs free-form", description: "JSON schema adherence in production" },
    { label: "Avg Prompt Iteration Cycle", value: "4.2 hrs", trend: "-38% with tooling", description: "Time from draft to deployed prompt" }
  ],

  warStories: [
    {
      id: "silent-failure-checkout",
      title: "The Silent Checkout Failure",
      summary: "A single-word prompt change ('concise' → 'brief') broke checkout flow for 3 hours. No tests caught it.",
      lesson: "Prompt contracts with golden sets would have caught this in CI. The word 'brief' triggered a different tokenization path that truncated currency values.",
      topics: ["promptcontracts", "promptregression", "promptdependencygraph"],
      severity: "P0",
      timeLost: "3 hours",
      revenueImpact: "$180K"
    },
    {
      id: "structured-output-migration",
      title: "JSON Schema Migration Saved Black Friday",
      summary: "Migrating from free-form to structured outputs 2 weeks before Black Friday caught 47 edge cases in product extraction.",
      lesson: "Structured outputs aren't just type safety — they're executable documentation. The schema became the contract between prompt engineers and downstream consumers.",
      topics: ["structuredoutputs", "promptcontracts"],
      severity: "P1",
      timeLost: "Prevented 2-day outage",
      revenueImpact: "Protected $2.3M"
    },
    {
      id: "dependency-graph-blast-radius",
      title: "Dependency Graph Revealed 12 Downstream Agents",
      summary: "Changing a shared 'refund policy' prompt section affected 12 agents across support, sales, and operations.",
      lesson: "Prompt dependency graphs turn tribal knowledge into visible blast radius. The change required coordinated rollout across 3 teams.",
      topics: ["promptdependencygraph", "promptcontracts"],
      severity: "P1",
      timeLost: "6 hours coordination",
      revenueImpact: "Avoided 4-agent cascade"
    }
  ],

  crossBridges: [
    {
      id: "prompt-vision",
      title: "Prompting Vision-Language Models",
      description: "Structured outputs + VLM = reliable image understanding",
      fromTopics: ["structuredoutputs", "promptcontracts"],
      toTopics: ["visionlanguage"],
      demoIdea: "Upload invoice → extract line items as JSON schema"
    },
    {
      id: "prompt-ethics",
      title: "Constitutional AI via Prompt Contracts",
      description: "Encode alignment principles as verifiable prompt contracts",
      fromTopics: ["promptcontracts", "promptregression"],
      toTopics: ["aimoralagency", "humancentric"],
      demoIdea: "Contract that refuses PII extraction + regression test for jailbreak attempts"
    },
    {
      id: "prompt-multimodal-extraction",
      title: "Multimodal Structured Extraction",
      description: "Chain vision + text prompts with shared contract",
      fromTopics: ["structuredoutputs", "workflows"],
      toTopics: ["visionlanguage", "diffusionmodels"],
      demoIdea: "Chart image → structured data → diffusion prompt for report visualization"
    }
  ],

  interactiveEmbeds: [
    {
      id: "prompt-playground",
      title: "Live Prompt Playground",
      description: "Compare prompt versions side-by-side with diff view",
      engine: "promptfundamentals",
      props: { showDiff: true, showTokens: true, showCost: true }
    },
    {
      id: "contract-validator",
      title: "Contract Validator",
      description: "Paste a prompt contract → validate against golden set",
      engine: "promptcontracts",
      props: { allowUpload: true, showCoverage: true }
    },
    {
      id: "regression-simulator",
      title: "Regression Simulator",
      description: "Simulate prompt changes → see blast radius in dependency graph",
      engine: "promptdependencygraph",
      props: { showBlastRadius: true, showAffectedAgents: true }
    },
    {
      id: "structured-output-builder",
      title: "Schema → Prompt Generator",
      description: "Drop JSON schema → get optimized prompt + validation harness",
      engine: "structuredoutputs",
      props: { schemas: ["invoice", "medical-record", "legal-clause", "code-review"] }
    }
  ]
};

export const LEVEL_DEFINITIONS = {
  1: {
    label: "L1 · Core",
    short: "L1",
    color: "#5EC4C8",
    bg: "#5EC4C815",
    border: "#5EC4C840",
    blurb: "Entry points. No prerequisites. Start here if new to prompt engineering."
  },
  2: {
    label: "L2 · Practitioner",
    short: "L2",
    color: "#9B89C4",
    bg: "#9B89C415",
    border: "#9B89C440",
    blurb: "Builds on L1. Hands-on patterns for production prompt workflows."
  },
  3: {
    label: "L3 · Advanced",
    short: "L3",
    color: "#F0A89A",
    bg: "#F0A89A15",
    border: "#F0A89A40",
    blurb: "Deep / high-stakes. Needs L2 mastery. Governance, safety, scale."
  }
};

export const TOPIC_DETAILS = {
  promptfundamentals: {
    title: "Prompt Engineering & Cognitive Patterns",
    level: 1,
    duration: "25 min",
    prerequisites: [],
    skills: ["Zero-shot/few-shot", "Chain-of-thought", "Delimiters", "System prompts", "DSPy basics"],
    outcomes: ["Write prompts that work reliably", "Choose right technique for task", "Debug failed prompts systematically"],
    keyConcept: "Prompts are programs — treat them like code"
  },
  promptmgmt: {
    title: "Prompt Management",
    level: 1,
    duration: "20 min",
    prerequisites: ["promptfundamentals"],
    skills: ["Versioning", "Templating", "Environment promotion", "Rollback"],
    outcomes: ["Git-like workflow for prompts", "Safe promotion dev→staging→prod", "Audit trail for compliance"],
    keyConcept: "Prompts evolve — version them like code"
  },
  threesentenceprompt: {
    title: "Three-Sentence Prompt Pattern",
    level: 1,
    duration: "15 min",
    prerequisites: ["promptfundamentals"],
    skills: ["Constraint specification", "Output formatting", "Edge case handling"],
    outcomes: ["Consistent outputs with minimal tokens", "Self-documenting prompt structure", "Easy to review and modify"],
    keyConcept: "Role + Task + Constraints = reliable output"
  },
  structuredoutputs: {
    title: "Structured Outputs",
    level: 2,
    duration: "35 min",
    prerequisites: ["promptfundamentals"],
    skills: ["JSON Schema", "Constrained decoding", "Outlines/Instructor", "Grammar-based generation"],
    outcomes: ["Guaranteed valid JSON", "Type-safe LLM outputs", "Schema as contract"],
    keyConcept: "Don't parse — constrain"
  },
  workflows: {
    title: "Claude Workflows",
    level: 2,
    duration: "30 min",
    prerequisites: ["promptfundamentals"],
    skills: ["Prompt chaining", "Intermediate validation", "Error recovery", "Human checkpoints"],
    outcomes: ["Multi-step reasoning pipelines", "Observable intermediate states", "Graceful degradation"],
    keyConcept: "Chain simple prompts, don't write complex ones"
  },
  unhobbling: {
    title: "Unhobbling Claude 5",
    level: 2,
    duration: "25 min",
    prerequisites: ["promptfundamentals"],
    skills: ["Extended thinking", "Tool use patterns", "Computer use", "Parallel execution"],
    outcomes: ["Unlock model capabilities", "Design for model strengths", "Benchmark capability gains"],
    keyConcept: "Models can do more — if you ask correctly"
  },
  promptlearning: {
    title: "Prompt Learning & English Feedback",
    level: 2,
    duration: "30 min",
    prerequisites: ["promptmgmt"],
    skills: ["Meta-prompts", "Critique loops", "Online optimization", "Voyager-style self-improvement"],
    outcomes: ["Prompts that improve themselves", "Automated prompt optimization", "Human-in-the-loop refinement"],
    keyConcept: "Prompts can write better prompts"
  },
  promptdependencygraph: {
    title: "Prompt Dependency Graph",
    level: 2,
    duration: "35 min",
    prerequisites: ["promptmgmt"],
    skills: ["Blast radius analysis", "Section-level deps", "Reachable vs candidate", "Retesting strategies"],
    outcomes: ["Know what breaks before you change", "Coordinated multi-team rollouts", "Minimal retest sets"],
    keyConcept: "Change impact = f(dependency graph)"
  },
  promptcontracts: {
    title: "Prompt Contracts & Version Gates",
    level: 3,
    duration: "45 min",
    prerequisites: ["promptdependencygraph"],
    skills: ["Contract validation", "Version pinning", "Breaking change detection", "Capability flags"],
    outcomes: ["Safe prompt upgrades", "Consumer-driven contracts", "Automatic rollback on violation"],
    keyConcept: "Contracts make prompts composable"
  },
  promptregression: {
    title: "Prompt Regression Detection",
    level: 3,
    duration: "40 min",
    prerequisites: ["promptdependencygraph"],
    skills: ["Golden sets", "Behavioral diffs", "Canary deployment", "Silent failure detection"],
    outcomes: ["Catch regressions in CI", "Quantify behavior drift", "Automated rollback"],
    keyConcept: "Test behavior, not outputs"
  }
};