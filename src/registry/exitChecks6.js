/**
 * Exit-check bank F — GenAI validation playbook + coding-agent evals.
 * Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_F = {
  modelvalidation: [
    { q: 'SR 11-7 three pillars…', o: ['Conceptual soundness, outcomes analysis, ongoing monitoring', 'Train, eval, deploy', 'Speed, cost, latency', 'Build, ship, bill'], a: 0, e: 'Same questions as 2011; all-new evidence.' },
    { q: 'Unit of GenAI validation…', o: ['System × use case, not the base model', 'The base model once', 'The prompt only', 'Vendor benchmarks'], a: 0, e: 'Same model, two use cases = two validations.' },
    { q: 'Unvalidated judge models…', o: ['Move risk rather than reduce it', 'Are always fine', 'Replace humans', 'Need no checks'], a: 0, e: 'Agreement, bias, drift — validate the scorer.' }
  ],
  codingevals: [
    { q: 'Agent ≠ model means scores measure…', o: ['The whole combo under token/time budgets', 'The base model alone', 'Prompt quality only', 'Hardware speed'], a: 0, e: 'Harness, tools, context, env join the grade.' },
    { q: 'Executable contracts beat reference diffs since…', o: ['Many valid patches pass behavior checks', 'Diffs are shorter', 'Tests are slow', 'Reviews vanish'], a: 0, e: 'Behavior over resemblance; harder to bluff.' },
    { q: 'Non-determinism demands…', o: ['Distributions, CIs, fixed budgets', 'Single best demo', 'Ignoring variance', 'Bigger models'], a: 0, e: '“How often, within budget, without unacceptable failure?”' }
  ]
};
