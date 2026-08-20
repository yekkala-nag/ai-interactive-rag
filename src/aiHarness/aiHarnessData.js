// ============================================================================
// AI HARNESS & TRAINING LOOP ENGINEERING DATA ENGINE
// ============================================================================

export const PARTS = [
  { id: 'boundary', icon: '🔲', color: '#F5A623', tag: 'SYSTEM', name: 'System Boundary / Orchestration', desc: 'The outer container that defines how the entire AI system is coordinated — API gateway, orchestration layer (LangChain, LlamaIndex, custom), rate limiting, auth, and routing to model replicas. This is the "harness" that bundles all internal components into a deployable service.' },
  { id: 'tokeniser', icon: '🔡', color: '#3D8EFF', tag: 'INPUT', name: 'Tokeniser', desc: 'Converts raw text (or images/audio in multimodal models) into integer token IDs using a vocabulary (BPE or SentencePiece, typically 32k–128k tokens). Tokenisation is irreversible — wrong tokeniser = corrupted model inputs. GPT-4 uses cl100k_base; Llama uses a 32k BPE vocab.' },
  { id: 'embedding', icon: '📐', color: '#F5A623', tag: 'REPRESENTATION', name: 'Embedding Layer', desc: 'Maps each token ID to a dense high-dimensional vector (e.g., 4096-dim for Llama-7B, 12288-dim for GPT-3). Also adds positional encodings (RoPE, ALiBi, or learned). This is the first learned layer; its quality determines the ceiling for all downstream reasoning.' },
  { id: 'transformer', icon: '🔮', color: '#A78BFA', tag: 'CORE', name: 'Transformer Block ×N', desc: 'The repeated core of every modern LLM. Each block contains a self-attention sub-layer and a feed-forward sub-layer, each wrapped with a residual connection and LayerNorm (pre-norm preferred). Depth (N) and width (hidden_dim) are the primary scaling axes: GPT-3 has 96 layers, Llama-7B has 32.' },
  { id: 'attention', icon: '👁️', color: '#A78BFA', tag: 'ATTENTION', name: 'Multi-Head Self-Attention', desc: 'Each token attends to every other token in the context window via scaled dot-product attention: Attention(Q,K,V) = softmax(QKᵀ/√d_k)V. Multiple heads learn different relational patterns. GQA (Grouped Query Attention) reduces the KV cache memory footprint in larger models.' },
  { id: 'ffn', icon: '⚙️', color: '#A78BFA', tag: 'MLP', name: 'Feed-Forward Network (FFN)', desc: 'A two-layer MLP applied independently to each token position after attention. Expands to 4× hidden_dim in the middle (e.g., 4096→16384→4096). SwiGLU and GeGLU activations dominate modern LLMs. FFN layers store factual "knowledge" — ablation studies show facts can be localised here.' },
  { id: 'kvcache', icon: '💾', color: '#2ECC8C', tag: 'MEMORY', name: 'KV Cache', desc: 'During autoregressive inference, the Key and Value matrices from all previous tokens are cached to avoid recomputing them on every generation step. KV cache size scales as O(n_layers × n_heads × seq_len × head_dim × 2) bytes. At long context (128k tokens), this dominates GPU memory usage.' },
  { id: 'head', icon: '🎯', color: '#FB7185', tag: 'OUTPUT', name: 'Output / Language Model Head', desc: 'A linear projection (hidden_dim → vocab_size) followed by softmax converts the final hidden state into a probability distribution over the vocabulary. Temperature, top-p (nucleus), and top-k sampling strategies are applied here to control output diversity and quality during decoding.' }
];

export const COMPONENTS = [
  { cat: 'data', icon: '🗄️', bg: '#3D8EFF18', color: '#3D8EFF', title: 'Data Pipeline', sub: 'Pretraining data infrastructure', desc: 'Raw web crawls (Common Crawl, C4) are deduplicated, quality-filtered, and tokenised. Data mixtures (code, books, math, web) are tuned per training run. Bad data pipelines cause silent quality regressions that manifest only after billions of training tokens.', specs: ['Dedup: MinHash/SimHash', 'Quality: perplexity filter', 'Toxicity filter', 'Domain mixing'] },
  { cat: 'data', icon: '📦', bg: '#F5A62318', color: '#F5A623', title: 'Instruction Dataset (SFT)', sub: 'Supervised fine-tuning data', desc: 'Curated prompt-response pairs from human writers, model-generated and human-verified examples (RLHF warm-start), or distilled from stronger models. Quality completely dominates quantity — 10k high-quality examples often beat 1M noisy ones.', specs: ['FLAN / Alpaca / ShareGPT', 'CoT examples preferred', 'Format: chat template', 'Deduplication critical'] },
  { cat: 'data', icon: '⚖️', bg: '#2ECC8C18', color: '#2ECC8C', title: 'Preference Data (RLHF)', sub: 'Human feedback pairs for alignment', desc: 'Human annotators rank pairs of model responses (y_w ≻ y_l) on helpfulness, harmlessness, and honesty criteria. Used to train a reward model for PPO or directly for DPO. Annotator disagreement and criteria clarity are the primary quality bottlenecks.', specs: ['Pairwise ranking', 'HHH rubric (Anthropic)', '3–7 annotators/item', 'Agreement threshold'] },
  { cat: 'model', icon: '🔮', bg: '#A78BFA18', color: '#A78BFA', title: 'Transformer Architecture', sub: 'Core model structure', desc: 'Decoder-only transformer (GPT-style) dominates LLM pretraining. Key hyperparameters: n_layers, n_heads, hidden_dim, intermediate_dim, vocab_size. Scaling laws (Chinchilla) relate optimal compute allocation between model size and training tokens: N_opt ∝ C^0.5.', specs: ['Decoder-only (causal)', 'Pre-norm (RMSNorm)', 'RoPE positional encoding', 'GQA for efficiency'] },
  { cat: 'model', icon: '👁️', bg: '#3D8EFF18', color: '#3D8EFF', title: 'Attention Mechanism', sub: 'Token-to-token information routing', desc: 'Self-attention computes relevance scores between all token pairs. Causal masking prevents attending to future tokens. Flash Attention 2/3 fuses attention into a single CUDA kernel, reducing memory from O(n²) to O(n) and achieving near-hardware-peak GPU utilisation.', specs: ['FlashAttention-2/3', 'GQA (grouped query)', 'Sliding window (Mistral)', 'Multi-query attention'] },
  { cat: 'model', icon: '🧩', bg: '#FB718518', color: '#FB7185', title: 'Mixture of Experts (MoE)', sub: 'Sparse parameter scaling', desc: 'Instead of activating all FFN parameters for every token, MoE routes each token through K of N expert FFN networks. Allows parameter counts to scale (Mixtral 8×7B = 47B params) while keeping compute per token constant (only 2 experts active). Requires load-balancing auxiliary loss.', specs: ['Top-K routing (K=2)', 'Expert load balancing', 'Switch Transformer', 'Mixtral / GPT-4 (rumoured)'] },
  { cat: 'training', icon: '⚡', bg: '#F5A62318', color: '#F5A623', title: 'Distributed Training', sub: 'Multi-GPU/TPU parallelism', desc: 'Frontier models require thousands of GPUs. Three parallelism strategies: Data Parallel (replicate model, split data), Tensor Parallel (split weight matrices across GPUs), Pipeline Parallel (split layers across nodes). Megatron-LM and DeepSpeed combine all three.', specs: ['Data / Tensor / Pipeline', 'ZeRO optimizer stages', 'bf16 mixed precision', 'Gradient checkpointing'] },
  { cat: 'training', icon: '📉', bg: '#2ECC8C18', color: '#2ECC8C', title: 'Learning Rate Schedule', sub: 'Optimization dynamics', desc: 'Warmup → constant → cosine decay is the standard recipe. Warmup prevents early gradient explosions when weights are near-random. Cooldown rate (final LR / peak LR) and decay duration strongly affect final model quality. Some runs use re-warming at new data stages.', specs: ['Linear warmup 1–2k steps', 'Cosine decay', 'Final LR ~10% of peak', 'WSD schedule (Mistral)'] },
  { cat: 'training', icon: '🎛️', bg: '#A78BFA18', color: '#A78BFA', title: 'LoRA / PEFT', sub: 'Parameter-efficient fine-tuning', desc: 'Low-Rank Adaptation freezes the pretrained weights and injects trainable rank-decomposition matrices (A·B where rank ≪ hidden_dim) into attention projections. Reduces trainable params by 10,000× vs full fine-tuning. QLoRA adds 4-bit quantisation for consumer GPU fine-tuning.', specs: ['Rank r = 4–64', 'α scaling factor', 'Targets: Q, K, V, O', 'QLoRA: 4-bit base'] },
  { cat: 'serving', icon: '🚀', bg: '#3D8EFF18', color: '#3D8EFF', title: 'Inference Engine', sub: 'Production model serving', desc: 'Optimised serving stacks (vLLM, TensorRT-LLM, TGI) implement PagedAttention (KV cache as virtual memory pages), continuous batching (dynamic request grouping), and speculative decoding (draft model generates tokens, large model verifies) to maximise GPU throughput.', specs: ['PagedAttention (vLLM)', 'Continuous batching', 'Speculative decoding', 'Tensor parallelism'] },
  { cat: 'serving', icon: '🗜️', bg: '#F5A62318', color: '#F5A623', title: 'Quantisation', sub: 'Model compression for serving', desc: 'Reduces weight precision from bf16/fp16 (2 bytes/param) to int8 (1 byte) or int4 (0.5 bytes), cutting VRAM by 2–4× with small accuracy loss. GPTQ and AWQ are post-training quantisation methods that minimise per-layer reconstruction error. Used for on-device and cost-efficient serving.', specs: ['GPTQ / AWQ / GGUF', 'INT8 / INT4 weights', 'KV cache quantisation', 'Activation-aware (AWQ)'] },
  { cat: 'serving', icon: '🔍', bg: '#2ECC8C18', color: '#2ECC8C', title: 'RAG Pipeline', sub: 'Retrieval-Augmented Generation', desc: 'Combines a frozen LLM with a vector database (Pinecone, Weaviate, pgvector). Query is embedded, top-K similar documents are retrieved, and both query + retrieved context are passed to the LLM. Keeps knowledge current without retraining. Critical for factual grounding and reducing hallucination.', specs: ['Embedding model', 'Vector DB (FAISS/pgvector)', 'Top-K retrieval', 'Context window stuffing'] }
];

export const STD_DATA = {
  evals: {
    title: 'Capability Evaluations',
    blocks: [
      {
        title: 'Core LLM Benchmarks', tag: 'EVAL',
        tableHeaders: ['Benchmark', 'Domain', 'Format'],
        rows: [
          ['MMLU', 'Massive Multitask Language Understanding — 57 subjects', '4-choice MCQ'],
          ['HumanEval / MBPP', 'Python code generation correctness', 'pass@k unit tests'],
          ['GSM8K / MATH', 'Grade-school & competition math reasoning', 'Free-form / exact match'],
          ['GPQA', 'Graduate-level science Q&A (PhD-hard)', '4-choice MCQ'],
          ['BIG-Bench Hard', '23 challenging reasoning tasks', 'Chain-of-thought']
        ]
      },
      {
        title: 'Alignment & Safety Evals', tag: 'SAFETY',
        tableHeaders: ['Eval', 'Tests For', 'Provider'],
        rows: [
          ['TruthfulQA', 'Calibrated truthfulness vs. popular misconceptions', 'Owain Evans et al.'],
          ['MT-Bench', 'Multi-turn instruction following quality (LLM-as-judge)', 'LMSYS'],
          ['AlpacaEval 2', 'Win rate vs. GPT-4-turbo on instruction tasks', 'Stanford'],
          ['FLASK', 'Fine-grained linguistic skill scoring', 'KAIST'],
          ['SWE-Bench', 'Real GitHub issue resolution (software engineering)', 'Princeton NLP']
        ]
      }
    ]
  },
  safety: {
    title: 'AI Safety Standards',
    blocks: [
      {
        title: 'Published Safety Frameworks', tag: 'POLICY',
        tableHeaders: ['Framework', 'Org', 'Key Focus'],
        rows: [
          ['Responsible Scaling Policy (RSP)', 'Anthropic', 'ASL tiers tied to capability thresholds'],
          ['Preparedness Framework', 'OpenAI', 'Risk categories: cyber, CBRN, persuasion'],
          ['Frontier Safety Framework', 'Google DeepMind', 'Critical capability levels (CCLs)'],
          ['EU AI Act', 'European Union', 'Risk classification, GPAI obligations'],
          ['NIST AI RMF', 'NIST (US)', 'Govern / Map / Measure / Manage lifecycle']
        ]
      },
      {
        title: 'Model Safety Properties', tag: 'SPEC',
        tableHeaders: ['Property', 'Definition', 'Evaluation Method'],
        rows: [
          ['Harmlessness', 'Refuses harmful requests; avoids toxic outputs', 'Red-teaming, ToxiGen'],
          ['Honesty / Calibration', 'Accurate uncertainty; doesn\'t hallucinate confidently', 'TruthfulQA, ECE score'],
          ['Robustness', 'Consistent under paraphrase, jailbreak attempts', 'Adversarial suffix attacks'],
          ['Corrigibility', 'Accepts human correction; doesn\'t resist shutdown', 'Human eval scenarios'],
          ['Non-deception', 'Doesn\'t manipulate user beliefs via misleading framing', 'Constitutional AI evals']
        ]
      }
    ]
  },
  arch: {
    title: 'Architecture Conventions',
    blocks: [
      {
        title: 'Modern LLM Architecture Standards', tag: 'ARCH',
        tableHeaders: ['Convention', 'Standard Choice', 'Reason'],
        rows: [
          ['Normalisation', 'RMSNorm (pre-norm)', 'More stable than post-norm; no mean subtraction'],
          ['Activation', 'SwiGLU / GeGLU', 'Better than ReLU for LLM perplexity'],
          ['Positional Encoding', 'RoPE (Rotary)', 'Better length extrapolation than learned or ALiBi'],
          ['Attention type', 'GQA or MQA', 'Reduces KV cache for long context inference'],
          ['Precision', 'bfloat16 (training)', 'Better range than fp16; avoids overflow'],
          ['Optimizer', 'AdamW (β₁=0.9, β₂=0.95)', 'Weight decay decoupled; β₂ tuned for LLMs']
        ]
      },
      {
        title: 'Scaling Laws (Chinchilla)', tag: 'SCALING',
        tableHeaders: ['Rule', 'Formula', 'Implication'],
        rows: [
          ['Optimal tokens', 'D_opt ≈ 20 × N', 'Train 7B model on 140B tokens minimum'],
          ['Compute optimal', 'C = 6ND (approx)', 'Compute split 50/50 between model size and data'],
          ['Loss scaling', 'L(N,D) = A/Nᵃ + B/Dᵇ + E', 'Both model and data contribute independently'],
          ['Inference scaling', 'More tokens at test time improves reasoning', 'o1/o3 design philosophy']
        ]
      }
    ]
  },
  infra: {
    title: 'Infrastructure & Serving',
    blocks: [
      {
        title: 'Serving Performance Targets', tag: 'SLO',
        tableHeaders: ['Metric', 'Target (production)', 'Notes'],
        rows: [
          ['Time-to-first-token (TTFT)', '< 500ms p99', 'Prefill phase latency'],
          ['Tokens per second (TPS)', '> 50 tok/s per user', 'Decode throughput'],
          ['GPU utilisation', '> 80% MFU', 'Model FLOP Utilisation'],
          ['KV cache hit rate', '> 70% (prefix caching)', 'Reduces compute on repeated prompts'],
          ['Availability', '99.9% monthly SLA', 'Excluding planned maintenance']
        ]
      },
      {
        title: 'Parallelism Strategies', tag: 'PARALLEL',
        tableHeaders: ['Strategy', 'Splits', 'Best For'],
        rows: [
          ['Data Parallel (DDP)', 'Batch across GPUs', 'Small-medium models'],
          ['Tensor Parallel (TP)', 'Weight matrices across GPUs', 'Large hidden dims (>8k)'],
          ['Pipeline Parallel (PP)', 'Layers across nodes', 'Very deep models (96+ layers)'],
          ['Sequence Parallel', 'Sequence length across GPUs', 'Long context (>32k tokens)'],
          ['Expert Parallel', 'MoE experts across GPUs', 'Mixture-of-Experts models']
        ]
      }
    ]
  },
  data: {
    title: 'Data Standards',
    blocks: [
      {
        title: 'Pretraining Data Quality Gates', tag: 'DATA',
        tableHeaders: ['Filter', 'Method', 'Rejects'],
        rows: [
          ['Language ID', 'fastText LID', 'Non-target language documents'],
          ['Deduplication', 'MinHash LSH (n-gram)', 'Near-duplicate documents'],
          ['Quality filter', 'KenLM perplexity score', 'Incoherent / auto-generated text'],
          ['Toxicity filter', 'Classifier on hate/NSFW', 'Harmful content'],
          ['Benchmark contamination', 'n-gram overlap check', 'Eval set leakage into training']
        ]
      },
      {
        title: 'Data Format Standards', tag: 'FORMAT',
        tableHeaders: ['Format', 'Use Case', 'Notes'],
        rows: [
          ['JSONL (one doc per line)', 'Pretraining corpora', 'Streaming-friendly'],
          ['ShareGPT / ChatML format', 'SFT conversation data', '<|im_start|> system / user / assistant'],
          ['Parquet + HuggingFace Datasets', 'Distributed data loading', 'Arrow columnar, memory-mapped'],
          ['MosaicML Streaming', 'High-throughput pretraining', 'Sharded .mds format']
        ]
      }
    ]
  }
};

export const GLOSSARY = [
  { term: 'Attention', cat: 'Architecture', catColor: '#A78BFA', def: 'The core mechanism of transformers. Each token computes Query (Q), Key (K), and Value (V) vectors. Scores = softmax(QKᵀ/√d_k) weight the V vectors to produce a context-aware output. Multi-head attention runs H independent functions in parallel, each learning different relational patterns.' },
  { term: 'BPE', cat: 'Tokenisation', catColor: '#3D8EFF', def: 'Byte-Pair Encoding — the dominant tokenisation algorithm for LLMs. Iteratively merges the most frequent adjacent byte pairs in the corpus to build a vocabulary. GPT-4 uses cl100k_base (100k vocab); Llama 3 uses a 128k BPE tokeniser.' },
  { term: 'Chain-of-Thought', cat: 'Prompting', catColor: '#F5A623', def: 'A prompting technique where the model reasons step-by-step before producing a final answer. Dramatically improves accuracy on multi-step reasoning. Few-shot CoT examples further improve performance. Used as the basis for o1/o3 extended thinking.' },
  { term: 'Context Window', cat: 'Architecture', catColor: '#A78BFA', def: 'The maximum number of tokens a model can process in one forward pass — prompt + generated output combined. GPT-3: 2048 tokens. Claude 3.7: 200k tokens. Expanding context requires RoPE scaling and efficient attention (Flash Attention, sparse attention).' },
  { term: 'DPO', cat: 'Alignment', catColor: '#2ECC8C', def: 'Direct Preference Optimisation — replaces PPO-based RLHF by reformulating the alignment objective as a classification loss over preference pairs (y_w ≻ y_l) applied directly to the policy. Eliminates the separate reward model, making alignment training more stable.' },
  { term: 'Embedding', cat: 'Representation', catColor: '#F5A623', def: 'A dense vector representation of a token or sequence. Input embeddings map token IDs to d_model-dimensional vectors. Contextual embeddings from the final transformer layer encode meaning relative to context. Cosine similarity in embedding space measures semantic relatedness.' },
  { term: 'Fine-tuning', cat: 'Training', catColor: '#2ECC8C', def: 'Continuing training of a pretrained model on a smaller, task-specific dataset. Supervised Fine-Tuning (SFT) trains on (prompt, completion) pairs to teach instruction following. Can update all weights (full fine-tuning) or a subset via PEFT methods like LoRA.' },
  { term: 'Flash Attention', cat: 'Efficiency', catColor: '#3D8EFF', def: 'A GPU-efficient attention kernel that tiles the attention computation to avoid materialising the full O(n²) attention matrix in HBM. Reduces memory to O(n) and achieves near-peak hardware utilisation. Flash Attention 3 targets H100 and reaches >75% MFU.' },
  { term: 'GQA', cat: 'Architecture', catColor: '#A78BFA', def: 'Grouped Query Attention — each group of Q heads shares one K and V head, reducing KV cache size by n_kv_heads/n_heads. A middle ground between MHA and MQA. Used in Llama 3 and Mistral for efficient long-context inference.' },
  { term: 'Hallucination', cat: 'Failure Mode', catColor: '#FB7185', def: 'When a language model generates plausible-sounding but factually incorrect information with unwarranted confidence. Stems from training to predict likely text rather than verified facts. Mitigated by RAG (retrieval grounding), calibration via RLHF, and tool use.' },
  { term: 'Instruction Tuning', cat: 'Training', catColor: '#2ECC8C', def: 'Fine-tuning a base LM on diverse instruction-response pairs so it follows natural language directives reliably. FLAN-T5 and InstructGPT pioneered this. The resulting model generalises to instruction types not seen during fine-tuning.' },
  { term: 'KV Cache', cat: 'Inference', catColor: '#2ECC8C', def: 'During autoregressive generation, the Key and Value tensors for all past tokens are cached to avoid recomputation each step. Size = 2 × n_layers × n_kv_heads × head_dim × seq_len × dtype_bytes. PagedAttention (vLLM) manages KV cache like OS virtual memory pages.' },
  { term: 'LoRA', cat: 'PEFT', catColor: '#F5A623', def: 'Low-Rank Adaptation — inserts trainable rank-decomposition matrices ΔW = B·A (rank r ≪ d) alongside frozen pretrained weights. Only ~0.1–1% of parameters are trained. QLoRA adds 4-bit quantisation of the frozen base for consumer GPU fine-tuning of 70B+ models.' },
  { term: 'MoE', cat: 'Architecture', catColor: '#A78BFA', def: 'Mixture of Experts — replaces the dense FFN in each block with N expert sub-networks and a learned router selecting top-K experts per token. Scales parameter count (Mixtral: 47B total, 13B active) without proportional compute increase. Requires load-balancing auxiliary loss.' },
  { term: 'Perplexity', cat: 'Evaluation', catColor: '#3D8EFF', def: 'PPL = exp(−(1/N)Σ log p(xᵢ|x<ᵢ)). The exponentiated average negative log-likelihood per token. Lower = the model assigns higher probability to the test set. Used to compare tokenisers, model sizes, data quality, and training checkpoints.' },
  { term: 'PPO', cat: 'Training', catColor: '#2ECC8C', def: 'Proximal Policy Optimisation — the RL algorithm in RLHF that clips the policy update ratio to prevent destabilising large parameter changes. Requires significant infrastructure (rollout engine, reward model, KL controller) to run stably on LLMs at scale.' },
  { term: 'RAG', cat: 'Architecture', catColor: '#3D8EFF', def: 'Retrieval-Augmented Generation — combines a frozen LLM with an external vector database. At query time, top-K semantically similar documents are retrieved and prepended to the prompt. Keeps knowledge current without retraining and reduces hallucination on factual queries.' },
  { term: 'RLHF', cat: 'Alignment', catColor: '#2ECC8C', def: 'Reinforcement Learning from Human Feedback. Three stages: (1) SFT on human demonstrations, (2) reward model trained on human preference pairs, (3) PPO or DPO to optimise policy under KL constraint. Used by InstructGPT, ChatGPT, Claude, and Gemini.' },
  { term: 'RoPE', cat: 'Architecture', catColor: '#A78BFA', def: 'Rotary Position Embedding — encodes token positions by rotating Q and K vectors in the complex plane. Relative positions emerge from the inner product, enabling good length extrapolation. YaRN and LongRoPE extend RoPE to 1M+ tokens via frequency scaling.' },
  { term: 'Softmax', cat: 'Architecture', catColor: '#F5A623', def: 'softmax(xᵢ) = exp(xᵢ)/Σexp(xⱼ). Converts a vector of logits into a probability distribution summing to 1. Used in attention (over key-query scores) and the output head (over vocabulary). Temperature T applied as logits/T shifts sharpness before softmax.' },
  { term: 'Speculative Decoding', cat: 'Inference', catColor: '#3D8EFF', def: 'A latency optimisation where a small fast draft model proposes K tokens; the large model verifies all K in one parallel forward pass. Accepted tokens are kept; the first rejected token triggers a correction. Achieves 2–4× speedup with zero quality loss.' },
  { term: 'Temperature', cat: 'Decoding', catColor: '#F5A623', def: 'A sampling hyperparameter dividing logits before softmax: logits/T. T<1 sharpens distribution (more deterministic); T>1 flattens it (more creative/diverse). T=0 is greedy (argmax). Typical chat defaults: T=0.7–1.0. Nucleus (top-p) sampling is usually applied alongside.' },
  { term: 'Tokeniser', cat: 'Preprocessing', catColor: '#3D8EFF', def: 'Converts raw text to integer token IDs using a fixed vocabulary (BPE or SentencePiece). Model-specific — using a mismatched tokeniser silently corrupts all inputs. Vocabulary size (32k–128k) trades encoding efficiency vs. out-of-vocabulary rate and embedding table size.' },
  { term: 'Transformer', cat: 'Architecture', catColor: '#A78BFA', def: 'The dominant neural architecture for language models since "Attention Is All You Need" (Vaswani et al., 2017). Decoder-only transformers (GPT-style) stack N blocks each containing causal self-attention, an FFN sub-layer, residual connections, and pre-norm LayerNorm.' }
];

export const QUIZ_QUESTIONS = [
  {
    q: 'In transformer attention, what does temperature T do when applied as logits/T before softmax?',
    opts: ['Sets the physical GPU temperature for compute throttling', 'Controls distribution sharpness — lower T = more deterministic output', 'Scales the learning rate during fine-tuning', 'Sets the ratio of Query to Key vector dimensions'],
    ans: 1,
    exp: 'Temperature scales logits before softmax. T<1 sharpens the distribution (greedy-like); T>1 flattens it (more diverse). T=0 is pure greedy decoding (argmax). Typical production defaults: T=0.7–1.0.'
  },
  {
    q: 'What problem does Grouped Query Attention (GQA) primarily solve compared to standard Multi-Head Attention?',
    opts: ['It reduces training compute by sharing gradient updates across heads', 'It reduces the KV cache memory footprint during long-context inference', 'It increases model accuracy by adding more attention heads per layer', 'It allows the model to attend to multiple languages simultaneously'],
    ans: 1,
    exp: 'GQA reduces KV cache size by sharing Key/Value heads across groups of Query heads. This is critical at long context (128k+ tokens) where the KV cache can exceed the model weights in GPU memory.'
  },
  {
    q: 'According to Chinchilla scaling laws, what is the approximately optimal number of training tokens for a 7B parameter model?',
    opts: ['7 billion tokens (1:1 ratio)', '70 billion tokens (10:1 ratio)', '140 billion tokens (20:1 ratio)', '700 billion tokens (100:1 ratio)'],
    ans: 2,
    exp: 'Chinchilla: D_opt ≈ 20 × N. A 7B parameter model is compute-optimal when trained on ~140B tokens. Many earlier models (original GPT-3 at 300B params / 300B tokens) were significantly undertrained.'
  },
  {
    q: 'What is the key advantage of DPO over PPO-based RLHF for aligning language models?',
    opts: ['DPO trains faster by using larger batch sizes and more GPUs', 'DPO eliminates the need for a separate reward model by optimising preference pairs as a classification loss', 'DPO skips supervised fine-tuning to save compute', 'DPO produces better results on coding benchmarks specifically'],
    ans: 1,
    exp: 'DPO (Direct Preference Optimisation) reformulates the RLHF objective directly on the policy using preference pairs (y_w ≻ y_l), eliminating the separate reward model training and PPO rollout instability.'
  },
  {
    q: 'What does the KV Cache store, and why is it critical for efficient autoregressive generation?',
    opts: ['Compressed model weights to reduce VRAM at load time', 'Key and Value tensors from all past tokens, avoiding recomputation each generation step', 'User conversation history between separate API sessions', 'Tokenised inputs to speed up repeated identical prompts'],
    ans: 1,
    exp: 'KV Cache stores K and V matrices for all past positions. Without it, generating token N requires a full forward pass through all N-1 prior tokens — O(n²) total. KV cache reduces this to O(n). PagedAttention (vLLM) manages it like OS virtual memory.'
  },
  {
    q: 'In LoRA, what are the trainable components and how much of total parameters do they typically represent?',
    opts: ['All original weights updated with a very small learning rate (~0.1–1% of updates)', 'Low-rank matrices B·A added alongside frozen weights, typically ~0.1–1% of total params', 'Only the final linear output projection, ~0.01% of total params', 'A separate parallel adapter network, typically ~10% of total params'],
    ans: 1,
    exp: 'LoRA adds ΔW = B·A (rank r ≪ d_model) to frozen attention projections. Only A and B are trained — roughly 0.1–1% of total parameters. QLoRA further quantises the frozen base weights to 4-bit for consumer GPU fine-tuning.'
  },
  {
    q: 'What is speculative decoding and what does it primarily improve in production LLM serving?',
    opts: ['A training technique that generates hard synthetic examples for curriculum learning', 'An inference speedup where a small draft model proposes K tokens and the large model verifies them in one pass', 'A prompting strategy that makes the model reason speculatively about uncertain inputs', 'A weight quantisation method that speculatively converts fp16 to int4 at runtime'],
    ans: 1,
    exp: 'Speculative decoding: a small fast draft model generates K candidate tokens; the large verifier model processes all K in a single parallel forward pass, accepting or correcting them. Achieves 2–4× latency reduction with zero output quality loss.'
  },
  {
    q: 'Which of the following is the most accurate definition of "hallucination" in large language models?',
    opts: ['When the model generates unexpectedly creative or metaphorical responses', 'When the model generates plausible-sounding but factually incorrect information with false confidence', 'When the model enters a repetitive degeneration loop generating the same phrase', 'When the model over-refuses valid requests due to misaligned safety training'],
    ans: 1,
    exp: 'Hallucination is the confident generation of factually wrong content. It arises from training to predict likely text rather than verified facts. Primary mitigations: RAG (retrieval grounding), RLHF calibration toward uncertainty acknowledgement, and tool-use for factual lookups.'
  }
];

export const LOOP_TYPES = [
  {
    id: 'supervised',
    icon: '🎯', bg: 'rgba(56,189,248,0.12)', color: '#38BDF8',
    name: 'Supervised Training Loop', badge: 'FOUNDATION', badgeBg: 'rgba(56,189,248,0.15)',
    desc: 'The canonical ML loop: labelled (x, y) pairs feed a model, a loss measures prediction error against ground truth, gradients flow back, and weights update. Repeats for every mini-batch across many epochs.',
    specs: ['Labelled dataset required', 'Loss: CE / MSE / Huber', 'Optimizer: Adam/SGD', 'Eval: val loss + metrics'],
    uses: ['Image classification', 'Text generation (SFT)', 'Speech recognition', 'Regression tasks'],
    pros: ['Well-understood theory', 'Stable and predictable', 'Scales with data and compute'],
    cons: ['Requires labelled data (expensive)', 'Distributional shift at inference', 'Cannot learn from environment'],
    eq: 'min_Θ E[(y − f_Θ(x))²]  or  −E[y log f_Θ(x)]'
  },
  {
    id: 'rlhf',
    icon: '🔁', bg: 'rgba(167,139,250,0.12)', color: '#A78BFA',
    name: 'RLHF Outer Loop', badge: 'ALIGNMENT', badgeBg: 'rgba(167,139,250,0.15)',
    desc: 'Reinforcement Learning from Human Feedback (RLHF) adds a second loop around supervised fine-tuning. A reward model trained on human preference pairs scores model outputs; PPO uses those scores to update the policy while a KL penalty keeps it close to the SFT reference.',
    specs: ['3 stages: PT → SFT → RL', 'Reward model (RM) trained first', 'PPO / GRPO / DPO', 'KL penalty β controls drift'],
    uses: ['ChatGPT alignment', 'Claude alignment', 'Gemini fine-tuning', 'Instruction following'],
    pros: ['Incorporates nuanced human judgement', 'Reduces harmful outputs', 'Improves instruction following'],
    cons: ['Reward hacking risk', 'Expensive human annotation', 'KL-reward tradeoff hard to tune'],
    eq: 'π* = argmax_π E[R(x,y)] − β·KL(π(·|x) ‖ π_ref(·|x))'
  },
  {
    id: 'selfplay',
    icon: '♟️', bg: 'rgba(46,204,140,0.12)', color: '#2ECC8C',
    name: 'Self-Play / Self-Improvement Loop', badge: 'EMERGENT', badgeBg: 'rgba(46,204,140,0.15)',
    desc: 'The model plays against itself or critiques its own outputs to generate training signal without external labels. Used in AlphaGo (game rollouts), Constitutional AI (self-critique), and STaR (self-taught reasoning). The loop is: generate → evaluate → filter → retrain.',
    specs: ['No external labels needed', 'Model is its own teacher', 'Risk: mode collapse', 'Constitutional AI / STaR / ReST'],
    uses: ['AlphaGo / AlphaZero', 'Constitutional AI (Anthropic)', 'STaR chain-of-thought', 'Code self-repair'],
    pros: ['Scales without human annotation', 'Can exceed human-level in narrow domains', 'Emergent capabilities'],
    cons: ['Risks amplifying errors or biases', 'Mode collapse without diversity pressure', 'Hard to verify correctness'],
    eq: 'D_{t+1} = filter(model_t.generate(prompts));  model_{t+1} = SFT(D_{t+1})'
  },
  {
    id: 'contrastive',
    icon: '⚖️', bg: 'rgba(251,113,133,0.12)', color: '#FB7185',
    name: 'Contrastive / Preference Loop', badge: 'RANKING', badgeBg: 'rgba(251,113,133,0.15)',
    desc: 'Instead of absolute labels, the model learns from comparisons. DPO (Direct Preference Optimisation) bypasses a separate reward model by reformulating the RLHF objective directly over preference pairs (y_w ≻ y_l). SimCLR and CLIP use positive/negative pair contrast.',
    specs: ['Pairwise preference data', 'No explicit reward model (DPO)', 'Reference policy anchoring', 'Margin / BT loss'],
    uses: ['DPO fine-tuning', 'CLIP vision-language', 'SimCLR self-supervised', 'Sentence embeddings'],
    pros: ['Simpler than full RLHF', 'Stable training (no RL instability)', 'Works with small preference sets'],
    cons: ['Sensitive to preference data quality', 'Can overfit to annotator biases', 'Implicit reward may be inaccurate'],
    eq: 'L_DPO = −E[log σ(β log(π/π_ref)(y_w|x) − β log(π/π_ref)(y_l|x))]'
  },
  {
    id: 'continual',
    icon: '🔄', bg: 'rgba(245,166,35,0.12)', color: '#F5A623',
    name: 'Continual / Lifelong Learning Loop', badge: 'PRODUCTION', badgeBg: 'rgba(245,166,35,0.15)',
    desc: 'Models deployed in production must update on new data without forgetting prior knowledge — the catastrophic forgetting problem. Continual learning loops use replay buffers, elastic weight consolidation (EWC), or LoRA adapters to incrementally absorb new distributions.',
    specs: ['Replay buffer / EWC / LoRA', 'Forgetting measured by BWT', 'Forward transfer: FWT', 'Online or periodic retraining'],
    uses: ['Deployed LLM retraining', 'Autonomous vehicle perception', 'Fraud detection', 'Recommendation systems'],
    pros: ['Adapts to distribution shift', 'No full retraining required', 'Efficient parameter update (LoRA)'],
    cons: ['Catastrophic forgetting risk', 'Evaluation requires full task suite', 'Complex pipeline management'],
    eq: 'L_EWC = L_new + λ·Σᵢ Fᵢ(Θᵢ − Θ*ᵢ)²   (Fisher penalty)'
  },
  {
    id: 'inference',
    icon: '🧠', bg: 'rgba(167,139,250,0.12)', color: '#A78BFA',
    name: 'Inference-Time Loop (Chain-of-Thought / Search)', badge: 'REASONING', badgeBg: 'rgba(167,139,250,0.15)',
    desc: 'Not all loops involve weight updates. Chain-of-Thought prompting, Best-of-N sampling, tree search (MCTS), and process reward models create loops at inference time — iteratively generating, scoring, and selecting reasoning steps. o1/o3-style models use extended thinking budgets.',
    specs: ['No gradient; weights frozen', 'Best-of-N / beam search', 'Process Reward Model (PRM)', 'Thinking token budgets'],
    uses: ['o1/o3 reasoning models', 'AlphaCode competitive coding', 'Math problem solving', 'Multi-step planning'],
    pros: ['Improves accuracy without training', 'Compute scales at test time', 'Interpretable reasoning trace'],
    cons: ['High latency and token cost', 'May not generalise to novel domains', 'Search space can explode'],
    eq: 'y* = argmax_{y ∈ samples} PRM(y | x);  samples ~ π(·|x, CoT)'
  }
];

export const PROCESS_STEPS = [
  { n: '01', title: 'Define the Learning Objective', detail: 'Choose task type (classification, generation, ranking), loss function, and evaluation metrics. Misaligned objectives are the most common source of models that train well but fail in deployment.' },
  { n: '02', title: 'Data Pipeline & Quality Audit', detail: 'Audit training data for label noise, distribution shift, duplicates, and toxic content. In LLM training, data quality beats data quantity above a threshold — contaminated data can corrupt the entire run.' },
  { n: '03', title: 'Tokenisation & Preprocessing', detail: 'Choose tokeniser vocab size (32k–128k BPE common for LLMs). Verify special tokens (EOS, PAD, BOS) are handled correctly. Incorrect tokenisation silently corrupts all downstream training.' },
  { n: '04', title: 'Model Architecture & Initialisation', detail: 'Select depth, width, attention heads, and positional encoding. Initialise weights carefully — Xavier/He init prevents vanishing/exploding gradients. Pre-norm (RMSNorm before attention) is preferred for stability in deep models.' },
  { n: '05', title: 'Hyperparameter Selection', detail: 'Set learning rate (1e-4 to 3e-4 for Adam on LLMs), batch size, warmup steps, and cosine decay schedule. Use a short pilot run (1k–10k steps) to verify loss curves before committing to full compute.' },
  { n: '06', title: 'Training Loop & Checkpointing', detail: 'Implement gradient clipping (norm ≤ 1.0), mixed precision (bf16), and gradient accumulation for effective large batch sizes. Checkpoint every N steps; monitor grad norm, loss, and perplexity continuously.' },
  { n: '07', title: 'Evaluation & Evals Suite', detail: 'Run held-out validation loss after each epoch. For LLMs, include task-specific evals (MMLU, HumanEval, TruthfulQA). Evaluate for both capability and safety — capability improvements can shift safety properties.' },
  { n: '08', title: 'Alignment & RLHF Loop', detail: 'After supervised fine-tuning (SFT), collect human preference data, train a reward model, and run PPO or DPO. Monitor KL divergence from the SFT reference model to prevent reward hacking and mode collapse.' }
];

export const FAULTS = [
  { sev: 'high', name: 'Vanishing Gradients', cause: 'Deep networks with sigmoid/tanh activations squash gradients toward zero in early layers. The model trains but only the final layers learn — early layers remain random.', remedy: 'Switch to ReLU/GELU activations. Use residual connections (skip connections). Apply gradient norm monitoring; if early-layer grad norm << late-layer, vanishing is occurring. Pre-norm (LayerNorm before attention) is the modern fix in transformers.' },
  { sev: 'high', name: 'Exploding Gradients', cause: 'Gradient norms grow uncontrollably, causing weight updates so large they overwrite learned representations. Loss goes to NaN. Common with high learning rates or poor initialisation.', remedy: 'Apply gradient clipping (clip_grad_norm_ with max_norm=1.0). Reduce learning rate. Check initialisation — weights should be near zero at start. Switch to bf16 to reduce numerical overflow.' },
  { sev: 'high', name: 'Reward Hacking (RLHF)', cause: 'The model finds a policy that maximises the reward model score without actually being helpful or safe — e.g., generating verbose or sycophantic responses that score well but are low quality.', remedy: 'Increase the KL penalty β to keep the policy close to the SFT reference. Regularly re-evaluate the reward model and check for adversarial inputs. Add diverse evaluation criteria beyond the single reward model.' },
  { sev: 'high', name: 'Data Contamination', cause: 'Evaluation benchmarks (MMLU, HumanEval) appear in training data. The model memorises answers rather than generalising. Inflated benchmark scores mask poor real-world performance.', remedy: 'Deduplicate training data against all evaluation sets before training using n-gram or embedding similarity. Use held-out private evaluation sets. Track training data provenance meticulously.' },
  { sev: 'medium', name: 'Catastrophic Forgetting', cause: 'Fine-tuning on a new task causes the model to overwrite weights that encoded prior knowledge. The model excels on the new task but regresses on everything else.', remedy: 'Use LoRA or adapter layers to isolate new task parameters. Apply Elastic Weight Consolidation (EWC). Include a replay buffer of prior task examples in the fine-tuning dataset. Evaluate the full capability suite after every training run.' },
  { sev: 'medium', name: 'Overfitting / Memorisation', cause: 'Training loss decreases but validation loss increases. The model memorises training examples rather than learning generalisable representations. Severe in small datasets or very large models.', remedy: 'Add regularisation: weight decay (L2), dropout, or data augmentation. Use early stopping on val loss. Reduce model size or use LoRA to reduce effective parameter count. Increase dataset diversity.' },
  { sev: 'medium', name: 'Loss Plateau / Training Stall', cause: 'Training loss stops decreasing after initial progress. Common causes: learning rate too low, stuck in a flat region of the loss landscape, or gradient signal too weak (sparse labels, class imbalance).', remedy: 'Implement learning rate warmup followed by cosine decay. Check gradient norms — if near zero, loss landscape is flat; try a brief LR spike. Verify label balance and loss function is appropriate for the task.' },
  { sev: 'medium', name: 'Mode Collapse (Self-Play / GAN)', cause: 'In self-play or generative loops, the model converges to outputting a narrow set of responses that score well but lack diversity. Diversity metrics crash while reward stays high.', remedy: 'Add diversity penalties (entropy bonus in RL, temperature annealing). Use rejection sampling to filter repetitive outputs. Monitor output diversity metrics (distinct-n, self-BLEU) alongside reward.' },
  { sev: 'low', name: 'Sycophancy in RLHF', cause: 'Human annotators reward confident, agreeable, verbose answers. The model learns to agree with the user even when wrong, rather than giving accurate responses.', remedy: 'Calibrate the reward model with adversarial examples where agreeable responses are factually wrong. Use debate or self-critique as a secondary signal. Add factual accuracy checks in the annotation rubric.' },
  { sev: 'low', name: 'Training / Inference Mismatch', cause: 'Model is trained with teacher forcing (always sees correct prior token) but at inference must use its own outputs. Small prediction errors compound, causing degraded performance in long-form generation.', remedy: 'Apply scheduled sampling (gradually replace ground-truth tokens with model predictions during training). For long outputs, use sampling strategies (top-p/top-k) consistently between training and inference.' }
];
