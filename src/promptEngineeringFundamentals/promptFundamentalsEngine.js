// ============================================================================
// PROMPT ENGINEERING FUNDAMENTALS & COGNITIVE PATTERNS ENGINE
// Complete taxonomy of Zero-shot, Few-shot, Chain-of-Thought (CoT),
// Tree-of-Thoughts (ToT), Directional Stimulus, and Delimiter Architectures
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
# ============================================================================

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
