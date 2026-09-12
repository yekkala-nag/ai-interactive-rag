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
  ],
  toolcalling: [
    { q: 'Function calling bridges…', o: ['Data pipelines to agent execution via typed contracts', 'Prompts to prompts', 'Models to models', 'Logs to bills'], a: 0, e: 'Schemas both sides understand.' },
    { q: 'Broken args must…', o: ['Fail validation pre-execution', 'Execute anyway', 'Retry silently', 'Ask the user always'], a: 0, e: 'Never execute what the schema rejects.' },
    { q: 'Parallel calls suit…', o: ['Independent calls in one turn', 'Dependent chains', 'Single calls', 'Writes first'], a: 0, e: 'Serial latency for free work is a bug.' }
  ],
  capstone1: [
    { q: 'Capstone 1 proves Loop 1 RAG with…', o: ['Cited answers + measured retrieval + unit math', 'A demo with no numbers', 'Slides about RAG', 'A bigger model'], a: 0, e: 'Evidence: citations, precision, cost/query.' },
    { q: 'Vague questions must…', o: ['Clarify, never guess', 'Guess fast', 'Retrieve everything', 'Refuse all'], a: 0, e: 'Clarification is a feature, not friction.' },
    { q: 'Portfolio artifact…', o: ['Deployed URL + 5-line writeup', 'Adjectives', 'Certificates', 'Screenshots only'], a: 0, e: 'Reviewers hire evidence.' }
  ],
  capstone2: [
    { q: 'Critic agents earn keep by…', o: ['Rejecting weak claims with reasons', 'Approving everything', 'Writing reports', 'Cutting cost'], a: 0, e: 'Rejection with reasons is the value.' },
    { q: 'Token dashboard attributes…', o: ['Every cent to agent + step', 'Totals only', 'Nothing', 'Monthly guesses'], a: 0, e: 'Unattributed spend is ungoverned spend.' },
    { q: 'Kill-drill proves…', o: ['Graceful degradation, never hallucination', 'Uptime luck', 'Speed records', 'Low cost'], a: 0, e: 'Demo the failure handling, not just success.' }
  ],
  capstone3: [
    { q: 'Rescue starts with…', o: ['Reproducing failure with identical harness', 'Rewriting everything', 'Bigger models', 'More prompts'], a: 0, e: 'Measure first; hunches last.' },
    { q: 'Cost down requires…', o: ['Faithfulness held flat, both proven', 'Faithfulness drop accepted', 'Less eval', 'Hope'], a: 0, e: 'Cheap + wrong is not a rescue.' },
    { q: 'The artifact that matters…', o: ['Before/after metrics + runbook', 'A new architecture diagram', 'Vendor pitch', 'Apology email'], a: 0, e: 'Evidence the next on-call can use.' }
  ]
};
