/**
 * Exit-check bank H — adaptive routing, amplify-expert, VRAM conductor, geo viz.
 * Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_H = {
  modelrouting: [
    { q: 'Static flagship-everywhere wastes most on…', o: ['Easy work (retrieval, formatting)', 'Dense critique', 'Tradeoff analysis', 'Synthesis'], a: 0, e: 'Up to 94% savable where work is light.' },
    { q: 'JIT planning beats global planners since…', o: ['Scoped mandates avoid context-blindness', 'Bigger prompts', 'More models', 'Longer plans'], a: 0, e: 'Plan per agent, at runtime, cheaply.' },
    { q: 'Context dimension matters because…', o: ['Accumulation pushes late agents up tiers', 'Tokens are free', 'Context never grows', 'Only difficulty counts'], a: 0, e: 'Researcher small → Reporter 7–8k.' }
  ],
  amplifyexpert: [
    { q: 'Thesis in one line…', o: ['Amplify experts, never replace them', 'Replace experts fast', 'Vectors everywhere', 'Agents decide all'], a: 0, e: 'Scale judgment that already exists.' },
    { q: 'Vector store role…', o: ['Fallback for dictionary misses', 'Foundation always', 'Banned entirely', 'Only embeddings'], a: 0, e: 'Expert keywords first; cosine only on exceptions.' },
    { q: 'Applies iff…', o: ['Known docs + experts + amplify + audit', 'Any chatbot', 'Web QA', 'No experts'], a: 0, e: 'Strong because it admits its boundary.' }
  ],
  vramconductor: [
    { q: 'Agents 2–3 die because…', o: ['KV reserved up front, no shared accounting', 'Bad models', 'Slow disks', 'Wrong CUDA'], a: 0, e: '6.5GB first means coin-flip malloc after.' },
    { q: 'Ledger rule…', o: ['Book before build, 90% cap, mutex', 'Load then check', 'No cap', 'Shared contexts'], a: 0, e: 'Refuse before touching GPU; unwind cleanly.' },
    { q: 'Layer streaming overlaps…', o: ['Compute N with transfer N+1 (+22–32%)', 'Two decodes at once', 'Nothing', 'Disk and net'], a: 0, e: 'One layer resident; prefetch behind compute.' }
  ],
  geopopviz: [
    { q: 'WorldPop vs Facebook…', o: ['100m raster RF vs 30m building points', 'Same method', 'Both vectors', 'Both censuses'], a: 0, e: '97.34M vs 98.16M — agree nationally.' },
    { q: 'Levels diverge at…', o: ['L2 districts (HCMC, Binh Duong)', 'National totals', 'Never', 'L0 only'], a: 0, e: 'Identical only where it doesn’t matter.' },
    { q: 'GADM gives…', o: ['Polygons to mask and aggregate into', 'Population counts', 'Satellite images', 'APIs'], a: 0, e: '63/686/7658 units L1–L3.' }
  ]
};
