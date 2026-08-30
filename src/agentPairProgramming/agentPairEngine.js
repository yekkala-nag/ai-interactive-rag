// ============================================================================
// WORKING WITH AI CODING AGENTS ENGINE
// Based on Sara A. Metwalli's methodology: Context Bounding, Test-Driven Verification,
// Problem Decomposition, and Keeping the Human-in-the-Loop
// ============================================================================

export const AGENT_PAIRING_PILLARS = [
  {
    pillar: "1. Provide Deep Local Context",
    mistake: "Asking 'Fix this bug' with zero repo context.",
    bestPractice: "Provide file paths, relevant schemas, database models, and error stack traces verbatim.",
    impact: "Reduces hallucinated API methods by 85%."
  },
  {
    pillar: "2. Decompose Into Atomic Milestones",
    mistake: "Prompting 'Build an entire real-time collaborative whiteboard app'.",
    bestPractice: "Break down into: (1) Data Schema, (2) Canvas State Engine, (3) WebSocket Sync, (4) UI Controls.",
    impact: "Prevents token degradation and incomplete code snippets."
  },
  {
    pillar: "3. Enforce Test-Driven Verification",
    mistake: "Assuming generated code works without running it.",
    bestPractice: "Instruct the agent to write a failing test first, implement the change, and run the test suite to verify.",
    impact: "Eliminates subtle logical regressions and edge-case bugs."
  },
  {
    pillar: "4. Maintain Human Architectural Control",
    mistake: "Letting agents make unvetted database migrations or dependency upgrades.",
    bestPractice: "Agent acts as the high-speed pair programmer; human retains final review on architecture and security.",
    impact: "Guarantees production standards and security compliance."
  }
];

export const WORKFLOW_COMPARISON_MODES = [
  {
    mode: "Vibe Coding (Generate & Pray)",
    failureRate: "64% in multi-file systems",
    speed: "Fast initially, slow debugging later",
    contextPreservation: "Poor",
    characteristics: [
      "Large vague prompts without constraints",
      "Blind copy-pasting into codebase",
      "No automated unit tests executed",
      "Accumulates technical debt and ghost bugs"
    ]
  },
  {
    mode: "Engineered Agent Pairing",
    failureRate: "< 8% across releases",
    speed: "Consistent 4x-10x throughput multiplier",
    contextPreservation: "High (Scoped context + explicit schemas)",
    characteristics: [
      "Explicit system rules (GEMINI.md / AGENTS.md / rules)",
      "Strict step-by-step milestone execution",
      "Continuous test execution and lint validation",
      "Human-in-the-loop review on diffs and architectural gates"
    ]
  }
];

export const PYTHON_AGENT_TEST_DRIVEN_SCRIPT = `# ============================================================================
# PRODUCTION AGENT PAIR PROGRAMMING WORKFLOW (TEST-DRIVEN AGENT PROMPT)
# Demonstrates how to structure instructions for reliable, self-verifying agents
# ============================================================================

"""
SYSTEM INSTRUCTION FOR CODING AGENT:
You are an expert pair-programming agent collaborating on an enterprise codebase.

STRICT OPERATIONAL RULES:
1. NEVER modify production database schemas without an explicit migration script.
2. For any feature or bugfix, FIRST write a reproduction unit test in \`tests/\`.
3. Implement the minimal necessary change in \`src/\` to make tests pass.
4. Run \`pytest tests/test_feature.py\` and confirm 100% green before returning.
5. If tests fail, inspect the stack trace, self-correct, and re-run up to 3 times.
6. Present a concise markdown diff and summary of files modified.
"""

def test_driven_agent_loop():
    # 1. Agent creates reproduction test
    test_code = """
def test_user_discount_calculation():
    from src.pricing import calculate_discount
    assert calculate_discount(amount=100.0, tier='VIP') == 20.0
    assert calculate_discount(amount=50.0, tier='STANDARD') == 0.0
"""
    # 2. Agent executes implementation and verifies
    print("Writing test -> Running PyTest -> Implementing logic -> Verifying build clean!")

if __name__ == '__main__':
    test_driven_agent_loop()
`;
