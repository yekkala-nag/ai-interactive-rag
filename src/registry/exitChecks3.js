/**
 * Exit-check bank C — Phase P3. Agents remainder + Data + Frontiers.
 * Same shape as exitChecks.js.
 */
export const EXIT_CHECKS_C = {
  compare: [
    { q: 'Framework comparison axes…', o: ['State, control, ecosystem, ops burden', 'Logo design', 'Founder fame', 'Tweet count'], a: 0, e: 'Compare on engineering dimensions, not hype.' },
    { q: 'LangChain vs LangGraph choice…', o: ['Chains for flows, graphs for stateful loops', 'Always Graph', 'Always Chain', 'Neither ever'], a: 0, e: 'Match the abstraction to the control you need.' },
    { q: 'Migration cost driver…', o: ['State + handoff contracts', 'Import names', 'Docs length', 'Colors'], a: 0, e: 'Semantics migrate harder than syntax.' }
  ],
  agentdebugging: [
    { q: 'First artifact in agent debugging…', o: ['Full trace: thoughts, calls, observations', 'The bill', 'The UI', 'Guesses'], a: 0, e: 'No trace, no diagnosis.' },
    { q: 'Tool-error loops signal…', o: ['Missing guardrails or bad schemas', 'Success', 'Fast models', 'Good prompts'], a: 0, e: 'Repeated identical errors = contract failure.' },
    { q: 'Repro needs…', o: ['Pinned versions + frozen inputs', 'Luck', 'Bigger models', 'More logs only'], a: 0, e: 'Deterministic replay starts with pins.' }
  ],
  agentscale: [
    { q: 'Million-request scale bottlenecks first at…', o: ['State store / leader / rate limits', 'Prompt length', 'UI', 'Docs'], a: 0, e: 'Coordination costs dominate before model costs.' },
    { q: 'Idempotency at scale…', o: ['Prevents double-apply on retries', 'Slows systems', 'Optional luxury', 'Only for billing'], a: 0, e: 'Retries are certain; double-effects must be impossible.' },
    { q: 'Backpressure…', o: ['Queues + sheds load gracefully', 'Crashes fast', 'Ignores spikes', 'Scales infinitely'], a: 0, e: 'Graceful degradation beats cascading failure.' }
  ],
  aiproductbuilder: [
    { q: 'PRD before agents because…', o: ['Scope + acceptance criteria bound autonomy', 'Paperwork tradition', 'Slows shipping', 'Unneeded'], a: 0, e: 'Agents need written done-ness.' },
    { q: 'Cursorrules/architecture specs…', o: ['Encode repo conventions for agents', 'Slow developers', 'Replace tests', 'Decorate repos'], a: 0, e: 'Conventions as code, enforced per task.' },
    { q: 'Build gate…', o: ['Eval + review before merge', 'Auto-merge all', 'No gates', 'Weekly merges'], a: 0, e: 'Agent velocity needs proportional verification.' }
  ],
  mcpclient: [
    { q: 'MCP transports…', o: ['stdio for local, SSE/HTTP for remote', 'Only websockets', 'Only files', 'Pigeons'], a: 0, e: 'Match transport to trust boundary.' },
    { q: 'JSON-RPC 2.0 gives…', o: ['Typed tool contracts over the wire', 'Free inference', 'Bigger context', 'No versioning'], a: 0, e: 'Standard envelopes, predictable errors.' },
    { q: 'Remote MCP risk…', o: ['Third-party tool trust + scope', 'No risk', 'Latency only', 'Cost only'], a: 0, e: 'Scope, pin, and audit remote tools.' }
  ],
  loopengineering: [
    { q: 'Goal loop vs step loop…', o: ['Outcome-driven vs fixed-sequence iteration', 'Same thing', 'Bigger vs smaller', 'Old vs new'], a: 0, e: 'Terminate on goal state, not step count.' },
    { q: 'Loop library value…', o: ['Proven patterns instead of bespoke loops', 'More code', 'Slower shipping', 'Vendor lock'], a: 0, e: '69+ loops exist — adopt, don’t invent.' },
    { q: 'Cross-model review…', o: ['Second model audits the first', 'Doubles cost pointlessly', 'Halves quality', 'Unneeded'], a: 0, e: 'Independent verification catches self-blindness.' }
  ],
  threelayers: [
    { q: 'Three layers…', o: ['Prompt, context, loop engineering', 'Train, eval, deploy', 'Read, write, delete', 'Dev, stage, prod'], a: 0, e: 'Each layer owns distinct failure modes.' },
    { q: 'Layer order of fixes…', o: ['Loop → context → prompt (outside-in)', 'Prompt first always', 'Random', 'Loop last'], a: 0, e: 'Structure beats wording; fix outward-in.' },
    { q: 'Anthropic naming (2025)…', o: ['Named the practice teams already did', 'Invented prompts', 'Killed RAG', 'Sold GPUs'], a: 0, e: 'Names coordinate; practice predates them.' }
  ],
  docstruct: [
    { q: 'TOC from body typography…', o: ['Recovers structure when no contents page ships', 'Always perfect', 'Never works', 'Needs manual TOC'], a: 0, e: 'Six signals + bounded loop rebuild outlines.' },
    { q: 'Loop engineering here…', o: ['Small bounded loops per signal', 'One giant loop', 'No loops', 'Infinite loops'], a: 0, e: 'Bounded, auditable recovery steps.' },
    { q: 'Structure enables…', o: ['Hierarchical retrieval + citation', 'Slower parsing', 'Bigger files', 'Nothing'], a: 0, e: 'Outline is retrieval infrastructure.' }
  ],
  agenticparsing: [
    { q: 'Parsing dispatcher picks…', o: ['Cheapest parser that suffices per page', 'Strongest always', 'Random parser', 'One parser forever'], a: 0, e: 'Fit tool to page nature; escalate hard pages.' },
    { q: '“Pick richer” means…', o: ['Upgrade parse depth where diagnostic flags need', 'Bigger fonts', 'More colors', 'Slower disks'], a: 0, e: 'Spend extraction budget on hard pages.' },
    { q: 'Parser cascade meets…', o: ['Table ops at the hard-page boundary', 'Never meets', 'Only speed', 'Only cost'], a: 0, e: 'Decide.py pattern shared across bricks.' }
  ],
  knowledgebase: [
    { q: 'Top-10-questions KB…', o: ['Covers most volume with curated answers', 'Replaces all RAG', 'Needs no updates', 'Hides docs'], a: 0, e: 'Head queries deserve head answers.' },
    { q: 'Cleansing + dedup…', o: ['Prevent contradictory retrievals', 'Waste time', 'Slow search', 'Hide content'], a: 0, e: 'One question, one truth.' },
    { q: 'Freshness TTL…', o: ['Expires stale answers automatically', 'Never expires', 'Deletes everything', 'Manual only'], a: 0, e: 'Every curated fact carries an expiry.' }
  ],
  aidataplat: [
    { q: 'AI-native platform differs by…', o: ['Embeddings + governance as primitives', 'Bigger disks', 'Faster CPUs', 'Prettier UI'], a: 0, e: 'Vectors, lineage, and evals are platform-level.' },
    { q: 'BigQuery role…', o: ['Analytics over structured + ML in SQL', 'Vector search only', 'Model training only', 'UI hosting'], a: 0, e: 'Warehouse analytics beside retrieval systems.' },
    { q: 'Platform vs pipeline…', o: ['Reusable services vs one-off flows', 'Same thing', 'Bigger vs smaller', 'Old vs new'], a: 0, e: 'Platforms compound; pipelines deliver.' }
  ],
  medallionarch: [
    { q: 'Bronze holds…', o: ['Raw ingested bytes, immutable', 'Clean data', 'Gold aggregates', 'Nothing'], a: 0, e: 'Immutable landing preserves truth.' },
    { q: 'Silver adds…', o: ['Cleaning, conformance, schema', 'More rawness', 'Deletion', 'Random sampling'], a: 0, e: 'Query-ready without gold opinions.' },
    { q: 'Gold serves…', o: ['Aggregated, purpose-built marts', 'Raw dumps', 'Logs', 'Backups'], a: 0, e: 'Serving layer shaped for consumers.' }
  ],
  aitestdatabottleneck: [
    { q: 'Test-data bottleneck…', o: ['Labels lag behind model iteration', 'GPUs too slow', 'Data too big', 'Models too small'], a: 0, e: 'Unevaluated iteration is blind iteration.' },
    { q: 'Synthetic relief…', o: ['Generated cases with human spot-checks', 'No evals', 'Guessing', 'Deleting tests'], a: 0, e: 'Scale cases, verify samples.' },
    { q: 'Unblocks via…', o: ['Golden sets + sampling discipline', 'Bigger teams only', 'No process', 'Hope'], a: 0, e: 'Process beats headcount.' }
  ],
  frauddetectionml: [
    { q: 'Six-model lineup…', o: ['LightGBM/XGB/CatBoost compared on latency + cost', 'One model always', 'Deep nets only', 'No comparison'], a: 0, e: 'Production picks on SLA + cost matrix, not AUC alone.' },
    { q: 'Cost matrix…', o: ['False negatives priced vs false positives', 'Cloud bills', 'Salaries', 'Nothing'], a: 0, e: 'Fraud math is asymmetric by definition.' },
    { q: 'TreeSHAP gives…', o: ['Per-decision explanations for audit', 'Faster training', 'Bigger models', 'No value'], a: 0, e: 'Regulated decisions need reasons.' }
  ],
  pythonprofiling: [
    { q: 'cProfile tottime vs cumtime…', o: ['Own cost vs subtree-inclusive cost', 'Same thing', 'Disk vs RAM', 'Nothing'], a: 0, e: 'Optimize tottime hotspots, not cumtime illusions.' },
    { q: 'line_profiler / Scalene…', o: ['Per-line truth incl. Python vs native split', 'Guesses', 'Only totals', 'No use'], a: 0, e: 'Line-level data beats function-level hunches.' },
    { q: 'First fix is usually…', o: ['Vectorization, not micro-tuning', 'More servers', 'Rewrites in Rust', 'Hope'], a: 0, e: 'Algorithmic wins dwarf constant factors.' }
  ],
  pythonengineering: [
    { q: 'solve_ivp picks…', o: ['Integrator matched to stiffness', 'Random solver', 'Euler always', 'No solver'], a: 0, e: 'Stiff systems need implicit methods.' },
    { q: 'PID controller…', o: ['Proportional+integral+derivative feedback', 'A Python IDE', 'A database', 'A model'], a: 0, e: 'Feedback trio kills error, windup, oscillation.' },
    { q: 'Validate sims via…', o: ['Analytical limits + conservation checks', 'Vibes', 'Bigger grids', 'No checks'], a: 0, e: 'Physics audits numerics.' }
  ],
  vaes: [
    { q: 'ELBO trades…', o: ['Reconstruction vs KL regularization', 'Speed vs cost', 'Nothing', 'Size vs color'], a: 0, e: 'Fit data while staying near the prior.' },
    { q: 'Reparameterization trick…', o: ['Backprop through sampling via noise shift', 'Removes randomness', 'Speeds disks', 'Adds layers'], a: 0, e: 'Differentiable sampling unlocks training.' },
    { q: 'KL collapse…', o: ['Decoder ignores latent — anneal/fix decoder', 'Success', 'Faster training', 'Good generations'], a: 0, e: 'Dead latents need capacity pressure.' }
  ],
  keras3: [
    { q: 'Keras 3 multi-backend…', o: ['Same code on JAX/TF/PyTorch', 'TF only', 'No backends', 'CPU only'], a: 0, e: 'Write once, run on any substrate.' },
    { q: 'NMT encoder-decoder…', o: ['Reads source, generates target sequence', 'Classifies images', 'Clusters data', 'Sorts arrays'], a: 0, e: 'Seq2seq with attention over encodings.' },
    { q: 'Backend switch helps…', o: ['Benchmark + deploy flexibility', 'Nothing', 'Slower runs', 'Bigger code'], a: 0, e: 'Pick substrate per workload.' }
  ],
  byol: [
    { q: 'BYOL needs no…', o: ['Negative pairs (online+target+predictor)', 'Data', 'Augmentation', 'Training'], a: 0, e: 'Bootstrap latents from augmented views alone.' },
    { q: 'EMA target…', o: ['Slow-moving stable reference', 'Fast learner', 'Random net', 'No net'], a: 0, e: 'Stability prevents collapse without negatives.' },
    { q: 'Collapse avoided via…', o: ['Asymmetry + stop-grad, not negatives', 'Huge batches only', 'Labels', 'Luck'], a: 0, e: 'Architecture, not contrast, holds it up.' }
  ],
  xlstm: [
    { q: 'xLSTM upgrades LSTM with…', o: ['Exponential gating + matrix memory', 'More layers only', 'Attention removal', 'Nothing'], a: 0, e: 'sLSTM/mLSTM scale recurrence to LLM era.' },
    { q: 'Matrix memory…', o: ['Richer storage than scalar cells', 'Slower always', 'No benefit', 'Removes recurrence'], a: 0, e: 'Covariance-style updates hold more.' },
    { q: 'Hand calculation teaches…', o: ['Gate mechanics concretely', 'Nothing', 'Speed', 'APIs'], a: 0, e: 'Trace numbers, own the recurrence.' }
  ],
  timeseriesanomaly: [
    { q: 'Autoencoder flags…', o: ['High reconstruction-error windows', 'All data', 'Nothing', 'Random points'], a: 0, e: 'Normal compresses; anomalies do not.' },
    { q: 'Threshold via…', o: ['Percentile of validation error', 'Guessing', 'Fixed zero', 'Mean only'], a: 0, e: 'Calibrate on clean data quantiles.' },
    { q: '1D-CNN captures…', o: ['Local temporal motifs', 'Global meaning', 'Nothing', 'Future data'], a: 0, e: 'Convolutions learn shapelets.' }
  ],
  llmfinetuning: [
    { q: 'QLoRA combines…', o: ['4-bit NF4 + LoRA adapters + paged optimizers', 'Full fine-tune', 'No training', 'Bigger GPUs'], a: 0, e: 'Single-GPU tuning via frozen base + adapters.' },
    { q: 'Instruction backtranslation…', o: ['Generates instructions from raw text', 'Deletes data', 'Translates languages', 'Compresses models'], a: 0, e: 'Self-made SFT pairs at scale.' },
    { q: 'Merge-and-unload…', o: ['Folds adapters for deployment', 'Deletes adapters', 'Retrains base', 'Nothing'], a: 0, e: 'Ship one weight set, no adapter tax.' }
  ],
  visionlanguage: [
    { q: 'ViT patches…', o: ['Split images into tokens for transformers', 'Resize only', 'Crop faces', 'Nothing'], a: 0, e: 'Patches are visual words.' },
    { q: 'Connector (Q-Former/MLP)…', o: ['Maps vision tokens into LLM space', 'Trains vision only', 'Deletes images', 'Renders UI'], a: 0, e: 'Bridge modality gap explicitly.' },
    { q: 'VQA eval needs…', o: ['Grounded answers, not caption BLEU', 'BLEU only', 'No eval', 'Speed only'], a: 0, e: 'Answer correctness over fluency.' }
  ],
  diffusionmodels: [
    { q: 'Forward process…', o: ['Adds noise on schedule to data', 'Removes noise', 'Trains classifiers', 'Sorts pixels'], a: 0, e: 'Destruction schedule teaches reversal.' },
    { q: 'CFG (guidance)…', o: ['Steers with conditional−unconditional mix', 'Speeds disks', 'Cuts cost', 'Adds data'], a: 0, e: 'Guidance scale trades fidelity for diversity.' },
    { q: 'DiT replaces…', o: ['UNet with transformers at scale', 'All sampling', 'Text encoders', 'VAEs'], a: 0, e: 'Scale laws apply to denoising too.' }
  ],
  speechvoice: [
    { q: 'Whisper excels via…', o: ['Weakly-supervised multilingual audio-text', 'Tiny size', 'Text only', 'No training'], a: 0, e: 'Scale + diversity → robust ASR.' },
    { q: 'VAD (Silero)…', o: ['Detects speech segments, cuts silence', 'Transcribes', 'Translates', 'Synthesizes'], a: 0, e: 'Gate audio work on actual speech.' },
    { q: 'Voice-agent latency killers…', o: ['Cascaded ASR→LLM→TTS hops', 'Model size only', 'UI theme', 'Docs'], a: 0, e: 'Each hop adds hundreds of ms; S2S collapses them.' }
  ],
  llmevals: [
    { q: 'PM-eval layer…', o: ['Product checks before model metrics', 'Replaces all evals', 'Ignores users', 'Only latency'], a: 0, e: 'Serve/retry/block decisions need product thresholds.' },
    { q: 'GSM-Symbolic exposed…', o: ['Contamination + template memorization', 'True reasoning gains', 'Faster models', 'Cheaper models'], a: 0, e: 'Mutated benchmarks revealed memorization.' },
    { q: 'Eval-to-launch gate…', o: ['Blocks ship on quality regression', 'Slows everything pointlessly', 'Optional', 'Annual'], a: 0, e: 'Quality gates are deploy gates.' }
  ],
  reasoningbench: [
    { q: 'GSM-NoOp collapse…', o: ['Irrelevant clauses distracted models', 'Harder math', 'Longer inputs', 'New symbols'], a: 0, e: 'Noise sensitivity ≠ reasoning.' },
    { q: 'Symbolic mutation tests…', o: ['True reasoning vs memorized templates', 'Speed', 'Cost', 'UI'], a: 0, e: 'Change surface, keep structure — watch scores.' },
    { q: 'Benchmark hygiene…', o: ['Decontaminate + mutate before trusting', 'Trust published numbers', 'Single run', 'No validation'], a: 0, e: 'Contaminated benchmarks measure recall.' }
  ],
  ragbeyond: [
    { q: 'Beyond-RAG futures…', o: ['Agents, memory, structured access over raw retrieval', 'Bigger chunks', 'No retrieval ever', 'Chatbots only'], a: 0, e: 'Retrieval becomes one tool among many.' },
    { q: 'When retrieval shrinks…', o: ['Long memory + tools cover it', 'Quality drops always', 'Costs rise always', 'Never happens'], a: 0, e: 'Architectures shift; grounding stays.' },
    { q: 'Safe bet…', o: ['Eval + grounding invariants outlive architectures', 'Any single stack', 'Vendor lock', 'Hype cycles'], a: 0, e: 'Principles port; pipelines rot.' }
  ],
  frontiers: [
    { q: 'Frontier tracking…', o: ['Papers → reproductions → eval deltas', 'Headlines only', 'Vendor blogs only', 'Ignoring research'], a: 0, e: 'Reproduce, measure, then adopt.' },
    { q: 'State-of-art expires…', o: ['Quarterly — re-eval routing often', 'Never', 'Yearly only', 'Daily'], a: 0, e: 'Model churn demands routing agility.' },
    { q: 'Adoption rule…', o: ['Eval lift on YOUR workload', 'Hype', 'Parameter count', 'Release date'], a: 0, e: 'Your evals arbitrate every upgrade.' }
  ],
  guardrails: [
    { q: 'PII redaction point…', o: ['Ingestion, before storage/scoring', 'UI only', 'After answer', 'Never'], a: 0, e: 'Upstream redaction protects every downstream.' },
    { q: 'Prompt-injection defense…', o: ['Hierarchy + output quarantine + evals', 'Longer prompts', 'Hope', 'Bigger models'], a: 0, e: 'Layered, tested, monitored.' },
    { q: 'Llama Guard / NeMo…', o: ['Classifier + programmable rails', 'Model replacements', 'UI themes', 'Billing tools'], a: 0, e: 'Policy as executable checks.' }
  ],
  llmreliability: [
    { q: 'XML/markup tags…', o: ['Structure model output for validation', 'Decorate UI', 'Slow models', 'Waste tokens'], a: 0, e: 'Parseable structure enables checks.' },
    { q: 'Exponential backoff…', o: ['Retry storms prevention', 'Faster failures', 'Higher cost', 'No benefit'], a: 0, e: 'Jittered backoff protects shared infra.' },
    { q: 'Multi-provider fallback…', o: ['Survives outages + price spikes', 'Doubles cost always', 'Halves quality', 'Unneeded'], a: 0, e: 'Reliability is a portfolio.' }
  ],
  enterpriseaiops: [
    { q: 'AI gateway centralizes…', o: ['Routing, cache, limits, audit', 'UI hosting', 'Training', 'Hiring'], a: 0, e: 'One control plane for all model traffic.' },
    { q: 'Semantic cache TTL…', o: ['Balances savings vs staleness', 'Infinite always', 'Zero always', 'Irrelevant'], a: 0, e: 'Stale hits are incidents.' },
    { q: 'Token governance…', o: ['Budgets + attribution per team/use', 'Unlimited spend', 'Annual review', 'No tracking'], a: 0, e: 'Meter, attribute, govern.' }
  ],
  productionragops: [
    { q: 'Earned complexity…', o: ['Add RAG machinery only past FAQ scale', 'Always maximize', 'Never build', 'Buy everything'], a: 0, e: 'FAQ-as-RAG first; complexity on evidence.' },
    { q: 'Noisy text (OCR/typos)…', o: ['SymSpell/Levenshtein normalization', 'Ignore it', 'Bigger models fix all', 'Delete docs'], a: 0, e: 'Clean before you embed.' },
    { q: 'pass^k + tau-bench…', o: ['Consistency + task success under repetition', 'Speed records', 'Cost minimums', 'Vanity metrics'], a: 0, e: 'Flaky agents fail repeated trials.' }
  ],
  tokenorchestrationplaybook: [
    { q: 'Asyncio abatch/ainvoke…', o: ['Concurrent model calls safely', 'Sequential only', 'No concurrency', 'Blocking UI'], a: 0, e: 'Throughput via bounded concurrency.' },
    { q: 'Redis + Qdrant stack…', o: ['Cache + vector store behind orchestration', 'Replaces models', 'UI layer', 'Billing'], a: 0, e: 'Standard production pairing.' },
    { q: 'Ragas + pytest…', o: ['Regression-gated deploys', 'Manual QA only', 'No tests', 'Vibes'], a: 0, e: 'Eval suites run in CI, not notebooks.' }
  ],
  enterpriseadvancedplaybook: [
    { q: 'Supervisor agent…', o: ['Decomposes + merges multi-agent work', 'Writes docs', 'Trains models', 'Bills hours'], a: 0, e: 'Ownership of seams between workers.' },
    { q: 'OTel/Prometheus/Grafana…', o: ['Observe agent fleets in prod', 'Develop locally only', 'Replace evals', 'Decorate dashboards'], a: 0, e: 'Fleets need telemetry, not hope.' },
    { q: 'Rate limiting + Redis cluster…', o: ['Survive burst + scale state', 'Slow systems', 'Optional luxury', 'Dev-only'], a: 0, e: 'Backpressure and shared state at scale.' }
  ]
};
