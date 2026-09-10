/**
 * Exit-check bank D — 5 newest tabs (handoff watchdog, validity, vibe-code,
 * agent fan-out, verified pipelines). Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_D = {
  handoffwatch: [
    { q: 'Empty-200 payloads are dangerous because…', o: ['Valid shape hides zero records downstream', 'They crash loudly', 'They are slow', 'They cost more'], a: 0, e: 'Success-shaped failure passes every output check.' },
    { q: 'Watchdog confidence floor 0.35 means…', o: ['Below it, plausible counts as implausible', 'Above it blocks all', 'It disables grading', 'It speeds inference'], a: 0, e: 'Tuned by staging false-halt rate, not theory.' },
    { q: 'Unparseable grader output should…', o: ['Block the handoff (fail closed)', 'Pass through silently', 'Retry forever', 'Skip grading'], a: 0, e: 'Shrugging through defeats the entire pattern.' }
  ],
  validitylayer: [
    { q: 'STALE vs SUPERSEDED…', o: ['Verify (1 step) vs replan immediately', 'Same action', 'Ignore both', 'Act on both'], a: 0, e: 'Uncertainty gets verification; replacement gets replanning.' },
    { q: 'Operational invalidity example…', o: ['True record count, offline DB — useless', 'False price', 'Missing log', 'Slow query'], a: 0, e: 'Truth and usability differ; check dependencies.' },
    { q: '96-config sweep showed…', o: ['Size drives waste, shape never mattered', 'Shape drives waste', 'Depth always wins', 'Random results'], a: 0, e: 'PFW = closure − 1 in all 96 runs.' }
  ],
  vibecode: [
    { q: 'Ukuflow’s $52 day proves…', o: ['Run cost compounds; build cost was $0', 'Building is expensive', 'Users never came', 'Ads pay well'], a: 0, e: 'Free to build, −$48/day to run.' },
    { q: 'Minimum viable offer…', o: ['One page testing the critical assumption', 'Full agent suite', 'Ten features', 'A rebrand'], a: 0, e: 'Validate desire before scaling machinery.' },
    { q: 'Static-first correction…', o: ['Precompute stable content, same users served', 'Delete the app', 'Raise prices', 'Add more AI'], a: 0, e: 'Costly whistles off genuinely helpful trees.' }
  ],
  agentfanout: [
    { q: 'Agent load multiplies because…', o: ['Retrieve→reason→reformulate→retrieve loops', 'Bigger prompts', 'More users only', 'Slower GPUs'], a: 0, e: '3–8x retrievals per task, not 1:1.' },
    { q: 'More caching fails when…', o: ['Hits serve stale facts fast (fast-wrong)', 'Cache is small', 'Cache is slow', 'Never fails'], a: 0, e: 'Freshness, not capacity, is the bottleneck.' },
    { q: 'Watch p95 per hop because…', o: ['Averages hide stacking explosions', 'p50 is wrong', 'Latency irrelevant', 'Hops are free'], a: 0, e: '4 hops × 400ms compounds while means look calm.' }
  ],
  verifiedpipes: [
    { q: 'AI-reviewing-AI fails since…', o: ['Shared training data = shared blind spots', 'Too slow', 'Too costly', 'Too strict'], a: 0, e: 'Correlated misses are theater with GPUs.' },
    { q: 'Policy-as-code gates verify…', o: ['Every deployment, author-agnostic', 'Only human code', 'Only style', 'Nothing'], a: 0, e: 'Tests, types, provenance, budgets — then ship.' },
    { q: 'Human review earns keep on…', o: ['Intent, product judgment, novel shapes', 'Volume triage', 'Line-by-line 40k PRs', 'Formatting'], a: 0, e: 'Judgment where rules end — nowhere else.' }
  ]
};
