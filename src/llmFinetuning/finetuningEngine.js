// ============================================================================
// MODEL FINE-TUNING & QLORA/DPO END-TO-END ENGINE
// Comprehensive, production-grade logic for PEFT, LoRA, QLoRA, DPO, RLHF,
// Hardware & VRAM Estimation, Dataset Preparation, and Inference Comparisons
// ============================================================================

export const FINE_TUNE_VS_RAG_MATRIX = [
  {
    criterion: "Rigid & Complex Formatting Requirements",
    ragApproach: "Poor (Missed/added fields, hallucinations in legacy/synoptic schemas).",
    fineTuneApproach: "Superior (~98% accuracy by internalizing structural constraints in weights).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune with LoRA/QLoRA when deterministic schema compliance is required."
  },
  {
    criterion: "System Prompt Token Costs at Scale",
    ragApproach: "High ($30k context tokens per call; $320k/yr API bill at scale with 50+ few-shot examples).",
    fineTuneApproach: "Zero System Prompt Overhead (Internalized into model parameters).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune to eliminate huge prompt prefixes and reduce latency by up to 60%."
  },
  {
    criterion: "Combinatorial Logic & 50+ Branching Rules",
    ragApproach: "Degrades (Context window overload on overlapping multi-condition branching).",
    fineTuneApproach: "Robust (Low-rank adapters learn non-linear decision boundaries).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune when complex domain logic cannot fit cleanly into a prompt."
  },
  {
    criterion: "Frequently Changing Dynamic Knowledge",
    ragApproach: "Superior (Real-time index updates in vector DB without model retraining).",
    fineTuneApproach: "Expensive & Slow (Requires continuous periodic fine-tuning loops).",
    winner: "RAG",
    recommendation: "Use RAG for rapidly changing facts, live inventory, news, and policies."
  },
  {
    criterion: "Tone, Style, Persona & Brand Voice",
    ragApproach: "Fragile (Drifts easily across long multi-turn conversations).",
    fineTuneApproach: "Flawless (Consistent persona and brand voice encoded in weight activations).",
    winner: "Fine-Tuning",
    recommendation: "Fine-tune when brand voice or specialized conversational tone is a core requirement."
  },
  {
    criterion: "Latency & Time-To-First-Token (TTFT)",
    ragApproach: "High (Retrieval overhead + prompt processing of 4,000+ context tokens).",
    fineTuneApproach: "Ultra-Low (Compact prompts + small dedicated fine-tuned model like 7B/8B).",
    winner: "Fine-Tuning",
    recommendation: "Deploy fine-tuned 7B/8B model locally with vLLM for <30ms TTFT."
  }
];

export const FINE_TUNING_PARADIGMS = [
  {
    id: "full_sft",
    name: "Full Fine-Tuning (Full SFT)",
    type: "Supervised",
    paramsUpdated: "100% of weights",
    memoryMultiplier: "16x - 20x model weight size",
    pros: "Maximum expressiveness and domain adaptation capacity.",
    cons: "High VRAM requirements; catastrophic forgetting risk; requires multi-GPU clusters.",
    idealFor: "Training foundational domain models from scratch or huge dataset updates."
  },
  {
    id: "lora",
    name: "LoRA (Low-Rank Adaptation)",
    type: "PEFT (Parameter-Efficient)",
    paramsUpdated: "0.1% - 1.0% of weights",
    memoryMultiplier: "4x - 6x model weight size",
    pros: "Freezes base weights; trains low-rank decomposition matrices (B × A); swappable adapters.",
    cons: "Requires 16-bit base model in VRAM during training unless combined with quantization.",
    idealFor: "Task specialization, multilingual adaptation, fast task switching."
  },
  {
    id: "qlora",
    name: "QLoRA (Quantized LoRA)",
    type: "PEFT + 4-bit NF4",
    paramsUpdated: "0.1% - 0.5% of weights",
    memoryMultiplier: "1.2x - 1.5x model weight size",
    pros: "4-bit NormalFloat base weights + FP8 Double Quantization + Paged Optimizers; fits on single consumer GPU (24GB VRAM).",
    cons: "Slightly slower gradient calculation compared to unquantized FP16 LoRA.",
    idealFor: "Fine-tuning 7B to 70B models on a single GPU (RTX 3090/4090 or single A100)."
  },
  {
    id: "dpo",
    name: "DPO (Direct Preference Optimization)",
    type: "Preference Alignment",
    paramsUpdated: "0.1% - 1.0% (with LoRA/QLoRA)",
    memoryMultiplier: "2x model size (requires reference policy model)",
    pros: "Eliminates separate reward model training and complex RL actor-critic loops (PPO). Directly optimizes log ratio of chosen vs rejected responses.",
    cons: "Requires high-quality paired preference datasets (Prompt, Chosen, Rejected).",
    idealFor: "Safety alignment, removing refusal bugs, formatting enforcement, preference ranking."
  }
];

export const LORA_MATHEMATICAL_CONCEPTS = [
  {
    concept: "Low-Rank Decomposition (LoRA)",
    formula: "h = W_0 x + \\frac{\\alpha}{r} (B \\times A) x",
    description: "Decomposes the weight update matrix ΔW (d × k) into two low-rank matrices B (d × r) and A (r × k) where r ≪ min(d, k). B is initialized to 0 and A to Gaussian noise, ensuring ΔW = 0 at step 0.",
    vramImpact: "Reduces trainable parameters by 99.8% and optimizer state memory by >95%."
  },
  {
    concept: "4-bit NormalFloat (NF4)",
    formula: "q_i = Q_{\\text{NF4}}(w_i)",
    description: "Information-theoretically optimal quantile quantization designed specifically for normally distributed neural network weights, yielding equal probability mass per quant bin.",
    vramImpact: "Compresses 16-bit FP weights to 4 bits (4x reduction in base weight footprint)."
  },
  {
    concept: "Double Quantization (DQ)",
    formula: "c_{\\text{FP32}} \\rightarrow c_{\\text{FP8}} + c_{\\text{group}}",
    description: "Quantizes the quantization constants themselves. Instead of storing 32-bit floats for block scales, stores 8-bit floats with a second stage scale factor across blocks of 256.",
    vramImpact: "Saves ~0.373 bits per parameter (~3 GB VRAM saved on a 70B parameter model)."
  },
  {
    concept: "Paged Optimizers",
    formula: "\\text{VRAM} \\rightleftharpoons \\text{CPU RAM (CUDA Unified Memory)}",
    description: "Leverages CUDA Unified Memory to automatically page optimizer state tensors to CPU system RAM during memory spikes (e.g. processing long context outliers).",
    vramImpact: "Completely prevents training crashes due to CUDA Out-Of-Memory (OOM) errors."
  },
  {
    concept: "DPO Objective Loss",
    formula: "\\mathcal{L}_{\\text{DPO}}(\\pi_\\theta; \\pi_{\\text{ref}}) = -\\mathbb{E}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right]",
    description: "Calculates the implicit reward difference between preferred response (y_w) and rejected response (y_l) directly via the policy model π_θ and frozen reference model π_ref.",
    vramImpact: "Avoids allocating a 3rd distinct reward model network in VRAM."
  }
];

export const HYPERPARAMETER_DEFAULTS = [
  { name: "Learning Rate", defaultVal: "2e-4", sweep: "[5e-5, 1e-4, 2e-4, 4e-4]", note: "Primary step size for adapter update. Use Cosine LR scheduler with 5% warmup." },
  { name: "LoRA Rank (r)", defaultVal: "16", sweep: "[8, 16, 32, 64, 128]", note: "Adapter capacity. r=16 is optimal for most tasks; r=64 for complex math/coding." },
  { name: "LoRA Alpha (α)", defaultVal: "32 (2 × r)", sweep: "2 × r", note: "Scaling factor. Setting α = 2*r ensures stable gradient magnitudes during sweeps." },
  { name: "Target Modules", defaultVal: "All Linear Layers", sweep: "q, k, v, o, gate, up, down", note: "Applying LoRA to ALL projection layers yields significantly higher performance (Schulman rule)." },
  { name: "Effective Batch Size", defaultVal: "16", sweep: "per_device (4) × grad_accum (4)", note: "Accumulating gradients enables large effective batch sizes with small per-device VRAM." },
  { name: "Weight Decay", defaultVal: "0.01", sweep: "[0.0, 0.01, 0.1]", note: "Regularization preventing adapter overfitting on small domain datasets." }
];

export const HARDWARE_PRESETS = [
  { id: "1b", name: "1B - 3B Small Models (Llama 3.2 1B/3B, SmolLM)", baseParamsB: 3, vramBase16: 6, vramBase4: 1.8 },
  { id: "7b", name: "7B - 8B Standard Models (Mistral 7B, Llama 3.1 8B, Qwen 2.5 7B)", baseParamsB: 8, vramBase16: 16, vramBase4: 4.8 },
  { id: "14b", name: "14B Mid-Tier Models (Qwen 2.5 14B, Gemma 2 9B/27B)", baseParamsB: 14, vramBase16: 28, vramBase4: 8.5 },
  { id: "32b", name: "32B DeepSeek / Qwen Models (Qwen 2.5 32B)", baseParamsB: 32, vramBase16: 64, vramBase4: 19.5 },
  { id: "70b", name: "70B Enterprise Models (Llama 3.3 70B, Qwen 2.5 72B)", baseParamsB: 70, vramBase16: 140, vramBase4: 42.0 }
];

export const CALCULATE_HARDWARE_ESTIMATE = (modelSizeB, method, seqLength, rank, batchSize) => {
  let baseWeightGb = 0;
  let adapterWeightGb = 0;
  let optimizerGb = 0;
  let activationGb = 0;

  const trainableParamsM = method === 'full' ? modelSizeB * 1000 : (rank * 4 * (modelSizeB / 8) * 7);

  if (method === 'full') {
    baseWeightGb = modelSizeB * 2.0; // 16-bit weights
    optimizerGb = (trainableParamsM / 1000) * 12.0; // FP32 master weights + Adam states (m, v)
    activationGb = (batchSize * seqLength * modelSizeB * 0.00015);
  } else if (method === 'lora') {
    baseWeightGb = modelSizeB * 2.0; // FP16 base weights
    adapterWeightGb = (trainableParamsM / 1000) * 0.002;
    optimizerGb = (trainableParamsM / 1000) * 0.016; // Adam on adapter only
    activationGb = (batchSize * seqLength * 0.0008);
  } else if (method === 'qlora') {
    baseWeightGb = modelSizeB * 0.55; // 4-bit NF4 + Double Quant
    adapterWeightGb = (trainableParamsM / 1000) * 0.002;
    optimizerGb = (trainableParamsM / 1000) * 0.012; // Paged AdamW 8-bit on adapter
    activationGb = (batchSize * seqLength * 0.0006);
  } else if (method === 'unsloth') {
    baseWeightGb = modelSizeB * 0.52;
    adapterWeightGb = (trainableParamsM / 1000) * 0.002;
    optimizerGb = (trainableParamsM / 1000) * 0.008; // Cut Cross-Entropy + manual backprop
    activationGb = (batchSize * seqLength * 0.00025); // 80% activation memory reduction
  }

  const totalVramGb = parseFloat((baseWeightGb + adapterWeightGb + optimizerGb + activationGb + 1.2).toFixed(1));

  let recommendedGpu = "1x RTX 3090 / 4090 (24 GB VRAM)";
  let isFeasibleSingleGpu = true;

  if (totalVramGb <= 16) {
    recommendedGpu = "1x RTX 4080 (16 GB) or RTX 3090/4090 (24 GB)";
  } else if (totalVramGb <= 24) {
    recommendedGpu = "1x RTX 3090 / 4090 (24 GB) or 1x A10G (24 GB)";
  } else if (totalVramGb <= 48) {
    recommendedGpu = "1x A40 (48 GB) or 1x A6000 (48 GB)";
  } else if (totalVramGb <= 80) {
    recommendedGpu = "1x NVIDIA A100 / H100 (80 GB VRAM)";
  } else {
    const numGpus = Math.ceil(totalVramGb / 80);
    recommendedGpu = `${numGpus}x NVIDIA A100 / H100 80GB (FSDP / DeepSpeed ZeRO-3)`;
    isFeasibleSingleGpu = false;
  }

  return {
    trainableParamsM: Math.round(trainableParamsM),
    baseWeightGb: parseFloat(baseWeightGb.toFixed(1)),
    optimizerGb: parseFloat(optimizerGb.toFixed(2)),
    activationGb: parseFloat(activationGb.toFixed(2)),
    totalVramGb,
    recommendedGpu,
    isFeasibleSingleGpu
  };
};

export const DATASET_FORMATS = [
  {
    formatName: "Alpaca Instruction Format",
    desc: "Single-turn instruction-input-output triple. Ideal for simple question answering, summarization, and single-turn task execution.",
    example: JSON.stringify({
      instruction: "Convert the following raw clinical finding into synoptic standard format.",
      input: "Left upper lobe needle biopsy showing invasive ductal carcinoma, Nottingham grade 2.",
      output: "SPECIMEN: Left Upper Lobe Needle Biopsy\\nHISTOLOGIC TYPE: Invasive Ductal Carcinoma\\nHISTOLOGIC GRADE: Nottingham Grade 2 (Tubule: 2, Nuclear: 2, Mitotic: 1, Total: 5/9)"
    }, null, 2)
  },
  {
    formatName: "ShareGPT / Multi-Turn ChatML Format",
    desc: "Multi-turn conversations with system, user, and assistant roles. Used for chatbots, tool calling agents, and iterative debugging.",
    example: JSON.stringify({
      messages: [
        { role: "system", content: "You are an enterprise SQL specialist. Respond strictly in valid PostgreSQL JSON." },
        { role: "user", content: "Find top 5 customers with recurring failed payments in Q3 2024." },
        { role: "assistant", content: "SELECT c.id, c.name, COUNT(p.id) AS failed_count, SUM(p.amount) AS total_failed_usd FROM customers c JOIN payments p ON c.id = p.customer_id WHERE p.status = 'failed' AND p.created_at BETWEEN '2024-07-01' AND '2024-09-30' GROUP BY c.id, c.name ORDER BY failed_count DESC LIMIT 5;" }
      ]
    }, null, 2)
  },
  {
    formatName: "DPO Preference Format (Chosen vs Rejected)",
    desc: "Pairs a prompt with an ideal winning response and a flawed rejected response to steer model alignment without a reward model.",
    example: JSON.stringify({
      prompt: "Extract the net profit and EBITDA margin from this earnings report excerpt: 'Revenue was $4.2B with net income of $840M and EBITDA of $1.1B.'",
      chosen: "{\\n  \\\"net_profit_usd\\\": 840000000,\\n  \\\"ebitda_usd\\\": 1100000000,\\n  \\\"ebitda_margin_pct\\\": 26.19\\n}",
      rejected: "The net profit is 840M and the EBITDA is 1.1B. Revenue is 4.2B so EBITDA margin is around 26%."
    }, null, 2)
  }
];

export const INFERENCE_BENCHMARK_CASES = [
  {
    domain: "Synoptic Clinical / Medical Pathology",
    inputPrompt: "Process pathology finding: 'Biopsy right thyroid nodule, papillary thyroid carcinoma, classic type, measuring 1.4 cm. Margins uninvolved. 2 benign lymph nodes identified.'",
    baseModelOutput: "The patient has papillary thyroid carcinoma of classic type in the right thyroid nodule measuring 1.4 cm with negative margins and 2 benign lymph nodes.",
    baseFailureReason: "Failed to follow synoptic CAP structure; missing required fields (TNM stage, lymphovascular invasion tag); unusable in automated EHR pipelines.",
    fineTunedOutput: "{\n  \"specimen\": \"Right Thyroid Nodule, Biopsy\",\n  \"histologic_type\": \"Papillary Thyroid Carcinoma (Classic Variant)\",\n  \"tumor_size_max_cm\": 1.4,\n  \"margins\": \"Uninvolved\",\n  \"lymphovascular_invasion\": \"Not identified\",\n  \"regional_lymph_nodes\": {\n    \"examined\": 2,\n    \"involved\": 0\n  },\n  \"pathologic_stage_pTNM\": \"pT1b N0\"\n}",
    fineTunedAccuracy: "99.4% Valid JSON / 100% CAP Compliant"
  },
  {
    domain: "Enterprise Complex SQL with Row-Level Security",
    inputPrompt: "Write SQL query to fetch quarterly revenue grouped by department for tenant 'org_alpha_921' ensuring soft-deleted records (is_deleted = true) are excluded.",
    baseModelOutput: "SELECT department, SUM(revenue) FROM sales GROUP BY department;",
    baseFailureReason: "Critical security violation: Omitted tenant_id filter ('org_alpha_921') and failed to filter soft-deleted rows.",
    fineTunedOutput: "SELECT \n  department_id,\n  DATE_TRUNC('quarter', transaction_date) AS fiscal_quarter,\n  SUM(amount_cents) / 100.0 AS quarterly_revenue_usd\nFROM tenant_sales_ledger\nWHERE tenant_id = 'org_alpha_921'\n  AND is_deleted = FALSE\n  AND payment_status = 'settled'\nGROUP BY department_id, DATE_TRUNC('quarter', transaction_date)\nORDER BY fiscal_quarter DESC, quarterly_revenue_usd DESC;",
    fineTunedAccuracy: "100% Tenant Isolation Verified"
  },
  {
    domain: "Pydantic Schema Tool Calling Output",
    inputPrompt: "Format flight booking tool invocation for NYC to LHR on 2026-11-12 in business class with seat preference window.",
    baseModelOutput: "Booking flight from NYC to LHR on November 12th 2026 in Business class, window seat.",
    baseFailureReason: "Produced natural language instead of required strict JSON tool call structure; crashed tool execution agent.",
    fineTunedOutput: "{\n  \"name\": \"book_flight\",\n  \"arguments\": {\n    \"origin_airport_code\": \"JFK\",\n    \"destination_airport_code\": \"LHR\",\n    \"departure_date\": \"2026-11-12\",\n    \"cabin_class\": \"business\",\n    \"passenger_preferences\": {\n      \"seat_type\": \"window\",\n      \"meal\": \"standard\"\n    }\n  }\n}",
    fineTunedAccuracy: "100% Schema Validation Pass"
  }
];

export const RUN_QLORA_SIMULATOR = (rank = 16, learningRate = 0.0002, epochCount = 3, lrScheduler = 'cosine') => {
  const steps = [];
  let currentLoss = 2.48;
  let accuracy = 35.0;
  const totalSteps = epochCount * 10;

  for (let epoch = 1; epoch <= epochCount; epoch++) {
    const epochSteps = 10;
    for (let s = 1; s <= epochSteps; s++) {
      const globalStep = (epoch - 1) * epochSteps + s;
      const progress = globalStep / totalSteps;

      // LR Decay factor
      let lrFactor = 1.0;
      if (lrScheduler === 'cosine') {
        lrFactor = 0.5 * (1 + Math.cos(Math.PI * progress));
      } else {
        lrFactor = 1.0 - progress * 0.8;
      }

      const effectiveStepRate = learningRate * lrFactor * 1400 / Math.max(8, rank * 0.6);
      currentLoss = Math.max(0.045, currentLoss * (1 - effectiveStepRate));
      accuracy = Math.min(98.8, accuracy + ((98.8 - accuracy) * 0.16 * (1 + (rank / 64))));

      const gradNorm = parseFloat((0.85 * Math.exp(-progress * 2) + Math.random() * 0.1).toFixed(3));

      steps.push({
        globalStep,
        epoch,
        trainLoss: parseFloat(currentLoss.toFixed(4)),
        evalLoss: parseFloat((currentLoss * (1.05 + Math.sin(globalStep) * 0.02)).toFixed(4)),
        accuracyPct: parseFloat(accuracy.toFixed(1)),
        currentLr: (learningRate * lrFactor).toExponential(2),
        gradNorm
      });
    }
  }

  const finalAccuracy = steps[steps.length - 1].accuracyPct;
  const finalLoss = steps[steps.length - 1].evalLoss;

  return {
    rank,
    learningRate,
    epochCount,
    lrScheduler,
    steps,
    finalAccuracy,
    finalLoss,
    vramSavingsGb: 19.2,
    estimatedCost: `$${(epochCount * 12.5).toFixed(2)}`
  };
};

export const PYTHON_QLORA_TRAINING_SCRIPT = `# ============================================================================
# PRODUCTION QLORA FINE-TUNING PIPELINE (PYTORCH + TRL + PEFT)
# Single GPU 24GB VRAM Execution with 4-bit NF4 Quantization
# ============================================================================

import os
import torch
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig
)
from peft import LoraConfig, PeftModel, prepare_model_for_kbit_training
from trl import SFTTrainer, SFTConfig, DataCollatorForCompletionOnlyLM
from datasets import load_dataset

BASE_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"
DATA_FILE = "./dataset_synoptic_reports.json"
RESPONSE_TEMPLATE = "[/INST]"
OUTPUT_DIR = "./mistral-qlora-adapter"

# ── 1. Configure 4-bit NF4 Quantization (BitsAndBytes) ───────────────────────
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True
)

# Load Quantized Base Model
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL,
    quantization_config=bnb_config,
    device_map="auto"
)
model = prepare_model_for_kbit_training(model)

# ── 2. Configure LoRA (Targeting All Projection Matrices) ───────────────────
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=[
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# ── 3. Configure Tokenizer & Trainer ────────────────────────────────────────
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
tokenizer.pad_token = tokenizer.eos_token

sft_config = SFTConfig(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,  # Effective Batch Size = 16
    num_train_epochs=3,
    learning_rate=2e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.05,
    bf16=True,
    gradient_checkpointing=True,
    logging_steps=10,
    eval_strategy="epoch",
    save_strategy="epoch"
)

# Mask Prompt Loss: Only calculate cross-entropy loss on target tokens
collator = DataCollatorForCompletionOnlyLM(
    response_template=RESPONSE_TEMPLATE,
    tokenizer=tokenizer
)

trainer = SFTTrainer(
    model=model,
    args=sft_config,
    peft_config=lora_config,
    train_dataset=load_dataset("json", data_files=DATA_FILE, split="train"),
    data_collator=collator
)

# Execute Fine-Tuning
trainer.train()
trainer.save_model(os.path.join(OUTPUT_DIR, "final"))

# ── 4. Merge Adapter Weights for High-Throughput vLLM Serving ────────────────
def merge_and_save():
    base = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=torch.bfloat16,
        device_map="auto"
    )
    merged = PeftModel.from_pretrained(base, os.path.join(OUTPUT_DIR, "final"))
    merged = merged.merge_and_unload()
    merged.save_pretrained("./mistral-7b-synoptic-merged", safe_serialization=True)
    tokenizer.save_pretrained("./mistral-7b-synoptic-merged")
    print("Merged weights saved to ./mistral-7b-synoptic-merged")

merge_and_save()
`;

export const PYTHON_DPO_TRAINING_SCRIPT = `# ============================================================================
# PRODUCTION DPO (DIRECT PREFERENCE OPTIMIZATION) PIPELINE
# Aligns model behavior using (prompt, chosen, rejected) pairs without RLHF
# ============================================================================

import os
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import LoraConfig
from trl import DPOTrainer, DPOConfig
from datasets import load_dataset

SFT_MODEL = "./mistral-7b-synoptic-merged"
PREFERENCE_DATA = "./dpo_preferences.json"
OUTPUT_DIR = "./mistral-dpo-aligned"

tokenizer = AutoTokenizer.from_pretrained(SFT_MODEL)
tokenizer.pad_token = tokenizer.eos_token

# Load Base Policy Model and Frozen Reference Model
model = AutoModelForCausalLM.from_pretrained(
    SFT_MODEL,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)
ref_model = AutoModelForCausalLM.from_pretrained(
    SFT_MODEL,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    bias="none",
    task_type="CAUSAL_LM"
)

dpo_config = DPOConfig(
    output_dir=OUTPUT_DIR,
    beta=0.1,  # Temperature hyperparameter for implicit reward scaling
    learning_rate=5e-7,
    num_train_epochs=2,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    bf16=True,
    logging_steps=5
)

dpo_trainer = DPOTrainer(
    model=model,
    ref_model=ref_model,
    args=dpo_config,
    peft_config=lora_config,
    train_dataset=load_dataset("json", data_files=PREFERENCE_DATA, split="train"),
    tokenizer=tokenizer
)

dpo_trainer.train()
dpo_trainer.save_model(OUTPUT_DIR)
print("DPO Alignment Complete!")
`;

export const VLLM_SERVING_COMMAND = `# ============================================================================
# HIGH-THROUGHPUT vLLM DEPLOYMENT (OPENAI-COMPATIBLE API ENDPOINT)
# Serves the merged fine-tuned model with PagedAttention and continuous batching
# ============================================================================

python3 -m vllm.entrypoints.openai.api_server \\
    --model ./mistral-7b-synoptic-merged \\
    --port 8000 \\
    --tensor-parallel-size 1 \\
    --gpu-memory-utilization 0.90 \\
    --max-model-len 8192 \\
    --dtype bfloat16 \\
    --enforce-eager
`;
