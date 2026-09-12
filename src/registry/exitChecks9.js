/**
 * Exit-check bank I — Agents SDK, human-centric manifesto, pandas memory.
 * Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_I = {
  agentsdk: [
    { q: 'Handoff vs agents-as-tools…', o: ['Transfer control vs consult-and-merge', 'Same thing', 'Tools are faster always', 'Handoffs never clarify'], a: 0, e: 'Triage routes and releases; orchestrator retains and combines.' },
    { q: 'Custom handoff input_type (Pydantic) fixes…', o: ['Coordinate drift across agents', 'Latency', 'Cost', 'Model choice'], a: 0, e: 'Explicit lat/lon beats shared “Jakarta”.' },
    { q: 'Ambiguous queries should…', o: ['Clarify, never force-route', 'Guess fastest', 'Ask both agents', 'Retry silently'], a: 0, e: 'No fit, no force — ask.' }
  ],
  humancentric: [
    { q: 'Smoker/filter-bubble lesson…', o: ['Satisfaction ≠ good for them', 'Users always right', 'Metrics suffice', 'Speed matters most'], a: 0, e: 'Pleased users can still be harmed.' },
    { q: 'Compliance fails since…', o: ['Law trails harm; burdens citizens', 'Laws are perfect', 'Fines deter all', 'No gaps exist'], a: 0, e: 'GDPR-after-Cambridge; cookie consent burden.' },
    { q: 'Concentric rollout…', o: ['Support→auto, internal→customer', 'Automate day one', 'Customers first', 'No staging'], a: 0, e: 'Earn automation; affect yourselves first.' }
  ],
  pandasmem: [
    { q: 'Biggest single cut (137→15MB)…', o: ['usecols subset at read', 'inplace only', 'Chunks only', 'Renaming'], a: 0, e: '9x memory, 4x load — interests first.' },
    { q: 'object→category wins when…', o: ['nunique ≪ nrows (~75% saved)', 'Always', 'High cardinality', 'Never'], a: 0, e: 'Repeats compress; unique values punish.' },
    { q: 'chunksize cannot do…', o: ['Global ops (groupby splits chunks)', 'Filtering', 'Aggregation per chunk', 'Saving'], a: 0, e: 'Fits anything, but groups may span chunks.' }
  ]
};
