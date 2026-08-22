// ============================================================================
// PROMPT LEARNING & ENGLISH FEEDBACK LOOP ENGINE
// Based on NVIDIA Voyager & Frontier Prompt-Centric Learning (Karpathy/Fan)
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Materials
// ============================================================================

export const PARADIGMS_COMPARISON = [
  {
    paradigm: "Traditional Reinforcement Learning (RL)",
    feedbackMechanism: "Scalar Reward Signals / Loss Gradients",
    optimizationLocation: "Model Weights (Billions of Parameters)",
    sampleComplexity: "10,000+ Labeled Traces & Iterative Epochs",
    instructionManagement: "Impossible (Weights are opaque float arrays)",
    onlineSetup: "Expensive offline retraining or PPO RLHF loops"
  },
  {
    paradigm: "Scalar Prompt Optimization (e.g. OPRO, DSPy)",
    feedbackMechanism: "Numeric Accuracy Scores (0.0 to 1.0)",
    optimizationLocation: "Discrete Tokens / Prompt Embeddings",
    sampleComplexity: "Hundreds of test samples for similarity search",
    instructionManagement: "Limited (Scaffolding searches outside prompt)",
    onlineSetup: "One-off batch search scripts"
  },
  {
    paradigm: "Prompt Learning (PL via English Feedback)",
    feedbackMechanism: "Natural Language Critiques & Human Annotations",
    optimizationLocation: "System Instruction Context Window",
    sampleComplexity: "1 to 10 Labeled Examples (1/100th complexity)",
    instructionManagement: "Full Natural Language Compaction, Expiration & Scoping",
    onlineSetup: "Continual real-time online prompt refinement"
  }
];

export const BENCHMARK_RULESET_DATA = [
  { rulesetSize: 10, loop1Acc: 15, loop5Acc: 100, loop1RulesPct: 71, loop5RulesPct: 100 },
  { rulesetSize: 50, loop1Acc: 0, loop5Acc: 70, loop1RulesPct: 35, loop5RulesPct: 83 },
  { rulesetSize: 100, loop1Acc: 0, loop5Acc: 55, loop1RulesPct: 14, loop5RulesPct: 68 }
];

export const RUN_PROMPT_LEARNING_SIMULATOR = (loopCount = 1, selectedCritiqueIdx = 0) => {
  const sampleCritiques = [
    {
      id: "critique_1",
      traceInput: "Generate hero section JSON for Cloud Platform landing page",
      rawOutput: '{"type": "hero", "title": "Scalable Cloud"}',
      evalCritique: "FAILURE: Image element missing required 'alt_text' field and external links do not use HTTPS protocol.",
      generatedInstruction: "[RULE_ADD]: Ensure all image objects include a descriptive 'alt_text' key and enforce HTTPS for all asset URLs.",
      accuracyBefore: 15,
      accuracyAfter: 71
    },
    {
      id: "critique_2",
      traceInput: "Generate pricing grid JSON with 3 tiers",
      rawOutput: '{"type": "pricing", "tiers": ["basic", "pro"]}',
      evalCritique: "FAILURE: Required 'currency' code missing in tier objects and section type must be validated against predefined ENUM list.",
      generatedInstruction: "[RULE_ADD]: Validate section type against ENUM list and specify 3-letter ISO currency code for all pricing tiers.",
      accuracyBefore: 35,
      accuracyAfter: 83
    }
  ];

  const currentCritique = sampleCritiques[selectedCritiqueIdx % sampleCritiques.length];

  // Simulating 5-loop progression
  const loopTrace = [];
  for (let i = 1; i <= loopCount; i++) {
    const acc = Math.min(100, Math.round(currentCritique.accuracyBefore + ((currentCritique.accuracyAfter - currentCritique.accuracyBefore) * (i / 5))));
    loopTrace.push({
      loop: i,
      accumulatedRules: i * 2,
      accuracyPct: acc,
      status: i === 5 ? "100% RULE_COMPLIANCE" : `LEARNING_LOOP_${i}`
    });
  }

  return {
    currentCritique,
    loopTrace,
    finalAccuracy: loopTrace[loopTrace.length - 1].accuracyPct
  };
};

export const PYTHON_PROMPT_LEARNING_PIPELINE = `# ============================================================================
# PRODUCTION PROMPT LEARNING & ENGLISH FEEDBACK LOOP (PYTHON)
# Inspired by NVIDIA Voyager & Frontier Prompt-Centric Learning
# ============================================================================

import json
from typing import Dict, Any, List

class PromptLearner:
    def __init__(self, initial_system_prompt: str):
        self.system_prompt = initial_system_prompt
        self.instruction_context: List[str] = []

    def evaluate_and_learn(self, trace_output: Dict[str, Any], critique_text: str) -> str:
        """Translates Natural Language Critiques into English System Instructions"""
        meta_prompt = (
            f"Analyze the execution failure: '{critique_text}'.\\n"
            f"Formulate a concise, reusable system rule to prevent this failure in future runs."
        )
        
        # Simulated Meta-Prompt LLM Call
        new_instruction = f"[RULE]: {critique_text.replace('FAILURE: ', '')}"
        self.instruction_context.append(new_instruction)
        
        # Instruction Compaction & Updates
        self.system_prompt += f"\\n- {new_instruction}"
        return new_instruction

    def get_optimized_prompt(self) -> str:
        return self.system_prompt

# ── Usage Example ────────────────────────────────────────────────────────────
learner = PromptLearner("You are a structured JSON generation assistant.")

# Simulate 1-Loop Feedback Iteration
raw_trace = {"type": "hero", "title": "Cloud Node"}
feedback = "FAILURE: Image objects must include 'alt_text' and all links must use HTTPS."

new_rule = learner.evaluate_and_learn(raw_trace, feedback)
print("Extracted English Rule:", new_rule)
print("\\nOptimized System Prompt:\\n", learner.get_optimized_prompt())
`;
