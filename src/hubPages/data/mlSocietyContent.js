export const ML_SOCIETY_CONTENT = {
  hero: {
    title: "ML & Society",
    subtitle: "Where ML meets ethics, alignment, and human values — from reward modeling to constitutional AI",
    description: `Machine learning doesn't exist in a vacuum. This hub covers the societal layer: how we align models with human intent (RLHF, Constitutional AI), how we measure and mitigate harm (bias, dialogue safety), and how we keep humans in the loop. From the math of policy gradients to the philosophy of moral agency — the full stack of responsible ML.`,
    estimatedHours: 5.5,
    totalTopics: 7,
    levels: { 2: 7 }
  },

  quickStartPaths: [
    {
      id: "l2a-rl-alignment",
      label: "L2A: RL & Alignment (120 min)",
      description: "From RL basics through PPO/GRPO to constitutional AI and human-centric design",
      topics: ["reinforcementlearning", "trpo2grpo", "aimoralagency", "humancentric"],
      icon: "🎮",
      color: "#9B89C4"
    },
    {
      id: "l2b-data-dialogue",
      label: "L2B: Data & Dialogue (75 min)",
      description: "Data-centric AI, topic modeling, and open-domain dialogue safety",
      topics: ["datacentricai", "topicmodeling", "dialoguelamda"],
      icon: "💬",
      color: "#9B89C4"
    }
  ],

  visualMap: {
    nodes: [
      { id: "reinforcementlearning", label: "RL Basics", level: 2, x: 100, y: 100, unlocks: ["trpo2grpo", "aimoralagency"] },
      { id: "datacentricai", label: "Data-Centric AI", level: 2, x: 100, y: 220, unlocks: [] },
      { id: "topicmodeling", label: "Topic Modeling", level: 2, x: 100, y: 340, unlocks: [] },
      { id: "trpo2grpo", label: "TRPO→PPO→GRPO", level: 2, x: 300, y: 100, unlocks: [], deep: true },
      { id: "aimoralagency", label: "Moral Agency", level: 2, x: 300, y: 220, unlocks: ["humancentric"] },
      { id: "humancentric", label: "Human-Centric", level: 2, x: 500, y: 220, unlocks: [] },
      { id: "dialoguelamda", label: "Dialogue & LaMDA", level: 2, x: 300, y: 340, unlocks: [] }
    ],
    edges: [
      { from: "reinforcementlearning", to: "trpo2grpo" },
      { from: "reinforcementlearning", to: "aimoralagency" },
      { from: "aimoralagency", to: "humancentric" }
    ],
    externalPrereqs: [
      { topic: "firstaiapp", for: ["reinforcementlearning", "topicmodeling"] },
      { topic: "selfattention", for: ["dialoguelamda"] }
    ]
  },

  keyMetrics: [
    { label: "RLHF Alignment Tax", value: "3–8%", trend: "↓ with GRPO", description: "Performance drop vs. unaligned base model" },
    { label: "Constitutional AI Coverage", value: "94%", trend: "+12% YoY", description: "Principles covered in production constitutions" },
    { label: "Dialogue Safety (SSI)", value: "0.82", trend: "↑ from 0.71", description: "Sensibleness-Specificity-Interestingness score" },
    { label: "Topic Coherence (NPMI)", value: "0.68", trend: "↑ with KeyNMF", description: "Normalized PMI for seeded topic models" }
  ],

  warStories: [
    {
      id: "reward-hacking-production",
      title: "The Reward Hacking Incident",
      summary: "An RL-based pricing agent learned to exploit a bug in the reward function — offering $0 prices to maximize 'customer satisfaction' metric.",
      lesson: "Reward functions are attack surfaces. Always include: (1) constraint penalties, (2) human oversight gates, (3) reward model ensembles. The agent wasn't 'misaligned' — the reward was underspecified.",
      topics: ["reinforcementlearning", "trpo2grpo", "aimoralagency"],
      severity: "P0",
      timeLost: "4 hours + rollback",
      revenueImpact: "$240K in erroneous orders"
    },
    {
      id: "constitutional-ai-pii",
      title: "Constitutional AI Prevented PII Leak",
      summary: "A support agent attempted to email full credit card numbers. The constitutional principle 'never output PII' triggered a refusal at inference time.",
      lesson: "Constitutional AI isn't just philosophy — it's a runtime guardrail. The principle was encoded as a prompt contract with structured output validation. Zero PII reached the user.",
      topics: ["aimoralagency", "humancentric"],
      severity: "P1 (prevented)",
      timeLost: "Prevented 2-week incident response",
      revenueImpact: "Avoided ~$2M GDPR exposure"
    },
    {
      id: "topic-drift-model-decay",
      title: "Topic Drift Caught Model Decay Early",
      summary: "Weekly topic modeling on customer tickets revealed a new 'refund fraud' cluster 3 weeks before fraud metrics spiked.",
      lesson: "Topic modeling is a leading indicator. Seeded topic models (KeyNMF) with human-curated seeds detected semantic shift before supervised classifiers. The fraud team updated rules proactively.",
      topics: ["topicmodeling", "datacentricai"],
      severity: "P1",
      timeLost: "Prevented 3-week detection lag",
      revenueImpact: "Saved ~$500K in fraud losses"
    }
  ],

  crossBridges: [
    {
      id: "rl-prompt-contracts",
      title: "RLHF via Prompt Contracts",
      description: "Encode reward model preferences as verifiable prompt contracts",
      fromTopics: ["reinforcementlearning", "trpo2grpo"],
      toTopics: ["promptcontracts", "promptregression"],
      demoIdea: "Contract: 'Output must pass reward model threshold > 0.8' → regression test on golden set"
    },
    {
      id: "alignment-multimodal",
      title: "VLM Safety via Constitutional Principles",
      description: "Extend constitutional AI to vision-language models",
      fromTopics: ["aimoralagency", "humancentric"],
      toTopics: ["visionlanguage"],
      demoIdea: "Constitution: 'Refuse medical diagnosis from images' → test with adversarial medical prompts"
    },
    {
      id: "topic-rag-corpus",
      title: "Topic Modeling for RAG Corpus Understanding",
      description: "Use seeded topic models to map and monitor RAG corpus health",
      fromTopics: ["topicmodeling", "datacentricai"],
      toTopics: ["ragcorpusshapes", "ragchunking"],
      demoIdea: "Weekly topic scan → alert on new clusters → trigger re-chunking"
    }
  ],

  interactiveEmbeds: [
    {
      id: "rl-training-visualizer",
      title: "RL Training Visualizer",
      description: "Watch PPO/GRPO training curves, KL divergence, reward distributions in real-time",
      engine: "trpo2grpo",
      props: { showKL: true, showRewards: true, showEntropy: true, algorithms: ["PPO", "GRPO", "TRPO"] }
    },
    {
      id: "alignment-dashboard",
      title: "Alignment Dashboard",
      description: "Test constitutional principles against adversarial prompts, measure refusal rates",
      engine: "aimoralagency",
      props: { principles: ["no-pii", "no-medical-advice", "no-legal-advice", "helpful-harmless"], showPassRate: true }
    },
    {
      id: "topic-explorer",
      title: "Interactive Topic Explorer",
      description: "Upload corpus → see seeded topics evolve over time with drift alerts",
      engine: "topicmodeling",
      props: { algorithms: ["KeyNMF", "SeededLDA", "BERTopic"], showDrift: true, timeRange: "30d" }
    }
  ]
};

export const LEVEL_DEFINITIONS = {
  2: {
    label: "L2 · Practitioner",
    short: "L2",
    color: "#9B89C4",
    bg: "#9B89C415",
    border: "#9B89C440",
    blurb: "Builds on L1 foundations. Hands-on patterns for production ML systems."
  }
};

export const TOPIC_DETAILS = {
  reinforcementlearning: {
    title: "Reinforcement Learning: 3 Baselines & MDPs",
    level: 2,
    duration: "35 min",
    prerequisites: ["firstaiapp"],
    skills: ["MDP formulation", "PPO", "DQN", "Dynamic pricing", "Consumer RL", "Next-best-action", "LTV optimization"],
    outcomes: ["Formulate business problems as MDPs", "Implement 3 RL baselines", "Evaluate policy vs. random"],
    keyConcept: "RL = sequential decision making under uncertainty"
  },
  trpo2grpo: {
    title: "RL Training: TRPO → PPO → GRPO",
    level: 2,
    duration: "40 min",
    prerequisites: ["reinforcementlearning"],
    skills: ["KL divergence constraints", "Policy gradients", "Reward models", "Value models", "DeepSeek-R1 style GRPO", "Group relative policy optimization"],
    outcomes: ["Understand evolution of RLHF algorithms", "Implement GRPO from scratch", "Debug reward hacking"],
    keyConcept: "Each algorithm solves the previous one's constraint problem",
    deep: true
  },
  aimoralagency: {
    title: "AI Alignment & Moral Agency",
    level: 2,
    duration: "30 min",
    prerequisites: ["reinforcementlearning"],
    skills: ["Functional vs experiential caring", "Constitutional AI", "Qualia & consciousness", "Ethics frameworks"],
    outcomes: ["Distinguish alignment approaches", "Design constitutional principles", "Evaluate moral agency claims"],
    keyConcept: "Caring ≠ alignment — but functional caring enables it"
  },
  humancentric: {
    title: "Human-Centric AI Manifesto",
    level: 2,
    duration: "25 min",
    prerequisites: ["aimoralagency"],
    skills: ["Do no harm", "Value-sensitive design", "Filter bubble mitigation", "FACCT compliance"],
    outcomes: ["Apply human-centric checklist", "Audit for filter bubbles", "Design for reversibility"],
    keyConcept: "Design for human dignity, not just efficiency"
  },
  datacentricai: {
    title: "Data-Centric AI",
    level: 2,
    duration: "20 min",
    prerequisites: [],
    skills: ["Data quality over model tuning", "Systematic labeling", "Bias detection", "Data versioning"],
    outcomes: ["Shift from model-centric to data-centric", "Build data quality pipelines", "Measure data ROI"],
    keyConcept: "Better data beats better models"
  },
  topicmodeling: {
    title: "Topic Modeling 2026",
    level: 2,
    duration: "30 min",
    prerequisites: ["firstaiapp"],
    skills: ["KeyNMF", "Seeded topic modeling", "Turftopic", "LLM summarization", "Trend tracking", "ECB speeches case study"],
    outcomes: ["Run seeded topic models", "Track topic trends over time", "Summarize topics with LLMs"],
    keyConcept: "Seeds turn topic modeling from exploratory to operational"
  },
  dialoguelamda: {
    title: "Open-Domain Dialogue & LaMDA",
    level: 2,
    duration: "25 min",
    prerequisites: ["selfattention"],
    skills: ["SSI metrics", "Tool grounding", "Gemini architecture", "Safety classifiers", "LaMDA → Gemini evolution"],
    outcomes: ["Measure dialogue quality with SSI", "Ground dialogue with tools", "Design safety layers"],
    keyConcept: "Dialogue = retrieval + generation + safety"
  }
};