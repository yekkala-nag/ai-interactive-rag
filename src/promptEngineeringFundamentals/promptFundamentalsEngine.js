// ============================================================================
// PROMPT ENGINEERING FUNDAMENTALS & COGNITIVE PATTERNS ENGINE
// Complete taxonomy of Zero-shot, Few-shot, Chain-of-Thought (CoT),
// Tree-of-Thoughts (ToT), Directional Stimulus, and Delimiter Architectures
// Extended with: CoT vs ToT Deep Dive (ML Mastery) — when to use each,
// computational trade-offs, hybrid approaches, and agentic reasoning patterns
// ============================================================================

export const COGNITIVE_PROMPTING_PATTERNS = [
  {
    id: "zero_shot",
    name: "1. Zero-Shot Prompting",
    paper: "Radford et al. (2019)",
    mechanism: "Presents the raw task instruction directly without providing prior input-output examples in context.",
    whenToUse: "Simple classifications, translations, direct knowledge lookup, formatting standard inputs.",
    samplePrompt: "Classify the sentiment of this review: 'The UI is snappy and the battery life exceeded my expectations.'\\nSentiment:"
  },
  {
    id: "few_shot",
    name: "2. Few-Shot In-Context Learning",
    paper: "Brown et al. (2020) - GPT-3",
    mechanism: "Provides 2–5 demonstration exemplars (Input -> Output) to activate transformer induction heads and lock in output formatting.",
    whenToUse: "Domain-specific schemas, custom classification labels, specialized SQL syntax, tone matching.",
    samplePrompt: "Text: 'Order cancelled due to delayed dispatch.' -> Category: LOGISTICS\\nText: 'Double billed on invoice #402.' -> Category: BILLING\\nText: 'Unable to reset SSO 2FA token.' -> Category:"
  },
  {
    id: "cot",
    name: "3. Chain-of-Thought (CoT)",
    paper: "Wei et al. (2022) / Kojima et al. ('Let\\'s think step by step')",
    mechanism: "Forces the model to generate intermediate reasoning tokens before emitting the final answer, dramatically reducing autoregressive calculation drift.",
    whenToUse: "Multi-step arithmetic, logic puzzles, symbolic deduction, code dependency tracing.",
    samplePrompt: "A company has 30 servers. 1/3 are decommissioned. 5 new servers are installed. How many active servers remain?\\nLet's think step by step:"
  },
  {
    id: "tot",
    name: "4. Tree-of-Thoughts (ToT)",
    paper: "Yao et al. (2023)",
    mechanism: "Maintains a search tree over diverse reasoning paths. Evaluates each intermediate thought branch with self-critique, backtracking via BFS/DFS when a dead end is reached.",
    whenToUse: "Game of 24, complex system architecture design, multi-file code refactoring, strategic planning.",
    samplePrompt: "Generate 3 diverse architectural strategies to handle 100k req/sec spike. For each, evaluate failure modes. Select the highest-rated branch."
  },
  {
    id: "directional_stimulus",
    name: "5. Directional Stimulus Prompting (DSP)",
    paper: "Li et al. (2023)",
    mechanism: "Uses a small auxiliary model or heuristic extractor to prepend high-salience hint keywords to guide the main LLM's attention focus.",
    whenToUse: "Long-document summarization, topic-guided synthesis, targeted entity extraction.",
    samplePrompt: "Article: [Earnings Call 5000 Words]\\nHint Keywords: [Gross Margins, APAC Expansion, Free Cash Flow]\\nSummarize focusing on the hint keywords:"
  }
];

export const PROMPT_STRUCTURE_COMPONENTS = [
  {
    section: "1. Role & Identity Framing",
    purpose: "Sets high-level persona, domain expertise, and baseline behavior.",
    example: "You are a Principal Distributed Systems Architect specialized in high-throughput Kafka streaming pipelines."
  },
  {
    section: "2. Context Bounding & Delimiters",
    purpose: "Isolates external reference data to prevent prompt injection and semantic drift.",
    example: "<context>\\n[Untrusted Document Snippets]\\n</context>"
  },
  {
    section: "3. Negative Constraints (Guardrails)",
    purpose: "Explicitly states what the model must NOT do.",
    example: "NEVER hallucinate non-existent API parameters. If information is missing from <context>, respond with 'INSUFFICIENT_DATA'."
  },
  {
    section: "4. Output Format Specification",
    purpose: "Enforces deterministic JSON schemas, XML tags, or markdown headers.",
    example: "Return STRICTLY valid JSON matching the schema: { \"status\": \"SUCCESS\" | \"FAILED\", \"items\": string[] }"
  }
];

export const PYTHON_DSPY_PROMPT_SCRIPT = `# ============================================================================
# PRODUCTION DSPY DECLARATIVE PROMPTING & COMPILATION PIPELINE
# Demonstrates automatic prompt optimization with teleprompters & assertions
// ============================================================================

import dspy

# 1. Configure Language Model
lm = dspy.LM("openai/gpt-4o-mini", api_key="sk-...")
dspy.configure(lm=lm)

# 2. Define Declarative Signature with Typed Fields
class FinancialExtractionSignature(dspy.Signature):
    """Extract quarterly metrics and compute YoY growth percentage from earnings transcripts."""
    transcript: str = dspy.InputField(desc="Raw earnings call transcript text")
    revenue_q3: float = dspy.OutputField(desc="Q3 Revenue in millions USD")
    revenue_q2: float = dspy.OutputField(desc="Q2 Revenue in millions USD")
    growth_pct: float = dspy.OutputField(desc="Computed YoY growth percentage")

# 3. Define Chain-of-Thought Module with Invariant Assertion
class FinancialExtractor(dspy.Module):
    def __init__(self):
        super().__init__()
        self.prog = dspy.ChainOfThought(FinancialExtractionSignature)

    def forward(self, transcript):
        pred = self.prog(transcript=transcript)
        
        # Runtime Constraint Assertion
        expected_growth = ((pred.revenue_q3 - pred.revenue_q2) / pred.revenue_q2) * 100
        dspy.Assert(
            abs(pred.growth_pct - expected_growth) < 0.5,
            "Mathematical inconsistency in calculated growth rate."
        )
        return pred

# 4. Execute Module
extractor = FinancialExtractor()
result = extractor(transcript="In Q2 we hit 100M and in Q3 we accelerated to 130M.")
print("Extracted Data:", result)
`;

// ============================================================================
// CHAIN-OF-THOUGHT vs TREE-OF-THOUGHTS — Deep Comparison (ML Mastery Guide)
// When to use each, computational trade-offs, hybrid approaches, agentic patterns
// ============================================================================

export const COT_VS_TOT_COMPARISON = [
  {
    dimension: "Reasoning Structure",
    cot: "Linear chain: single path of reasoning tokens → final answer",
    tot: "Tree search: multiple branches explored in parallel, scored, pruned, backtracked",
    winner: "ToT for complex branching problems; CoT for linear deduction"
  },
  {
    dimension: "Computational Cost",
    cot: "O(1) LLM calls (single generation with reasoning tokens)",
    tot: "O(k^d) LLM calls where k=branching factor, d=depth. Typically 10-100x CoT cost",
    winner: "CoT for latency/cost sensitive; ToT for high-stakes single decisions"
  },
  {
    dimension: "Error Recovery",
    cot: "None — first error propagates to final answer (no backtracking)",
    tot: "Built-in — dead ends detected via self-evaluation, backtrack to sibling branch",
    winner: "ToT dramatically superior for puzzles, planning, multi-constraint problems"
  },
  {
    dimension: "Implementation Complexity",
    cot: "Trivial — add \"Let's think step by step\" or few-shot CoT exemplars",
    tot: "Requires search infrastructure: tree state, evaluator, pruning policy, backtrack logic",
    winner: "CoT wins on simplicity; ToT needs framework (LangGraph, custom)"
  },
  {
    dimension: "Best Task Types",
    cot: "Arithmetic, logic puzzles, code tracing, math word problems, syllogisms",
    tot: "Game of 24, creative writing with constraints, architecture design, strategic games, multi-file refactoring",
    winner: "Match structure to task: linear → CoT, branching → ToT"
  },
  {
    dimension: "Scalability to Agents",
    cot: "Natural fit for ReAct loops — each step is a CoT micro-reasoning",
    tot: "Expensive in agent loops; use sparingly for critical decision nodes only",
    winner: "CoT as default agent reasoning; ToT for planner/strategic nodes"
  }
];

export const COT_TOT_HYBRID_PATTERNS = [
  {
    name: "CoT-Planned ToT",
    description: "Use CoT to generate high-level plan, then ToT only on the most uncertain/critical step",
    whenToUse: "Long-horizon tasks where only 1-2 decisions are truly branching",
    costReduction: "90%+ vs full ToT"
  },
  {
    name: "Progressive Deepening",
    description: "Start with CoT; if confidence low (self-eval) or validator fails, escalate to ToT for that subproblem",
    whenToUse: "Unknown task difficulty; adaptive compute allocation",
    costReduction: "Variable — only pays for ToT when needed"
  },
  {
    name: "ToT-for-Planning, CoT-for-Execution",
    description: "Planner agent uses ToT to generate robust plan; executor agents use CoT for each step",
    whenToUse: "Multi-agent systems with planner/executor separation",
    costReduction: "Concentrates ToT cost on single planner call"
  },
  {
    name: "Constrained ToT (Grammar-Guided)",
    description: "Restrict ToT branching with formal grammars / JSON schemas to prune invalid branches early",
    whenToUse: "Structured output tasks (code, SQL, API calls) where syntax errors dominate",
    costReduction: "50-80% via early syntactic pruning"
  }
];

export const AGENTIC_REASONING_PATTERNS = [
  {
    pattern: "ReAct + CoT",
    trace: "Thought (CoT) → Action → Observation → Thought (CoT) → ...",
    useCase: "General-purpose tool-using agents; default for most applications",
    cost: "Low-Medium"
  },
  {
    pattern: "Plan-Execute + ToT Planner",
    trace: "ToT Planner → Plan → [Parallel CoT Executors] → Replan on drift",
    useCase: "Complex multi-step tasks with clear decomposition; high-stakes outcomes",
    cost: "High (planner) + Medium (executors)"
  },
  {
    pattern: "Reflexion + CoT",
    trace: "CoT Attempt → CoT Critique → CoT Retry (bounded)",
    useCase: "Code generation, math, verifiable tasks where self-correction works",
    cost: "Medium (2-3x base CoT)"
  },
  {
    pattern: "Multi-Agent Debate (ToT-inspired)",
    trace: "Multiple agents propose → cross-critique → converge → final answer",
    useCase: "Subjective tasks, creative work, safety-critical decisions",
    cost: "High (k agents × rounds)"
  }
];

export const PYTHON_COT_TOT_HYBRID = `# ============================================================================
# HYBRID CoT/ToT: Progressive Deepening with Adaptive Compute
# ============================================================================

from dataclasses import dataclass
from typing import Callable, Optional
import json

@dataclass
class ReasoningResult:
    answer: str
    confidence: float          # 0-1 self-evaluation
    reasoning_trace: str
    method: str                # "cot" | "tot" | "hybrid"
    llm_calls: int

class HybridReasoner:
    def __init__(self, llm: Callable[[str], str], tot_branching: int = 3, tot_depth: int = 2):
        self.llm = llm
        self.tot_branching = tot_branching
        self.tot_depth = tot_depth

    def cot(self, prompt: str) -> ReasoningResult:
        response = self.llm(f"{prompt}\\nLet's think step by step:")
        confidence = self._self_eval(response)
        return ReasoningResult(response, confidence, response, "cot", 1)

    def tot(self, prompt: str) -> ReasoningResult:
        # Simplified ToT: generate k candidates at each depth, score, keep best
        candidates = [prompt]
        total_calls = 0
        for depth in range(self.tot_depth):
            new_candidates = []
            for c in candidates:
                branches = [self.llm(f"{c}\\nAlternative approach {i+1}:") for i in range(self.tot_branching)]
                total_calls += self.tot_branching
                scored = [(b, self._self_eval(b)) for b in branches]
                scored.sort(key=lambda x: x[1], reverse=True)
                new_candidates.extend([b for b, _ in scored[:2]])  # keep top 2
            candidates = new_candidates
        best = max(candidates, key=self._self_eval)
        return ReasoningResult(best, self._self_eval(best), json.dumps(candidates), "tot", total_calls)

    def hybrid(self, prompt: str, confidence_threshold: float = 0.7) -> ReasoningResult:
        # Progressive deepening: CoT first, escalate to ToT if low confidence
        cot_result = self.cot(prompt)
        if cot_result.confidence >= confidence_threshold:
            return ReasoningResult(cot_result.answer, cot_result.confidence, cot_result.reasoning_trace, "cot", 1)
        
        # Low confidence → escalate to ToT
        tot_result = self.tot(prompt)
        return ReasoningResult(
            tot_result.answer,
            tot_result.confidence,
            f"CoT (conf={cot_result.confidence:.2f}) → ToT:\\n{tot_result.reasoning_trace}",
            "hybrid",
            1 + tot_result.llm_calls
        )

    def _self_eval(self, text: str) -> float:
        # In production: use a separate critic model or structured eval
        eval_prompt = f"Rate the correctness and completeness of this reasoning 0-1:\\n{text}\\nScore:"
        try:
            return float(self.llm(eval_prompt).strip())
        except:
            return 0.5

# Usage
# reasoner = HybridReasoner(llm=my_llm_call)
# result = reasoner.hybrid("Design a rate limiter for 100k req/s with per-tenant fairness")
# print(f"Method: {result.method}, Calls: {result.llm_calls}, Confidence: {result.confidence:.2f}")
`;
