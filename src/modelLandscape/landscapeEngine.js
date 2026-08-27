// ============================================================================
// FOUNDATION MODEL LANDSCAPE & SELECTION DECISION ENGINE
// Comprehensive taxonomies of Open-Weights, Closed APIs, SLMs, Reasoning Models,
// and an Interactive Decision Engine mapping enterprise constraints to optimal models
// ============================================================================

export const MODEL_FAMILIES_TAXONOMY = [
  {
    family: "Closed Proprietary APIs",
    description: "Frontier hosted models accessible solely via authenticated REST/gRPC API endpoints.",
    models: [
      { name: "Claude 3.5 Sonnet (Anthropic)", context: "200K", strengths: "Coding, complex workflow orchestration, nuanced instruction following, artifact synthesis.", inputCostPerM: "$3.00", outputCostPerM: "$15.00" },
      { name: "GPT-4o (OpenAI)", context: "128K", strengths: "High-throughput multimodal understanding, broad world knowledge, function calling ecosystem.", inputCostPerM: "$2.50", outputCostPerM: "$10.00" },
      { name: "Gemini 2.0 Flash (Google)", context: "1M+", strengths: "Massive context retrieval, native multimodal processing, low cost, sub-second TTFT.", inputCostPerM: "$0.10", outputCostPerM: "$0.40" }
    ]
  },
  {
    family: "Open-Weights Frontier Models",
    description: "Self-hostable open-weights models enabling complete on-premise data privacy and zero API leakage.",
    models: [
      { name: "DeepSeek-V3 (671B MoE / 37B Active)", context: "128K", strengths: "State-of-the-art open coding, math, MLA KV-cache efficiency, ultra-low serving cost.", inputCostPerM: "$0.14 (Self-host)", outputCostPerM: "$0.28 (Self-host)" },
      { name: "Llama 3.3 70B (Meta)", context: "128K", strengths: "Enterprise workhorse, excels at fine-tuning, robust tool calling, Apache 2.0-like license.", inputCostPerM: "$0.40 (Self-host)", outputCostPerM: "$0.80 (Self-host)" },
      { name: "Qwen 2.5 72B (Alibaba)", context: "128K", strengths: "Multilingual fluency, rigorous mathematical reasoning, comprehensive synthetic benchmark lead.", inputCostPerM: "$0.35 (Self-host)", outputCostPerM: "$0.70 (Self-host)" }
    ]
  },
  {
    family: "Small Language Models (SLMs) & Edge AI",
    description: "Ultra-compact 1B–8B parameter models optimized for local consumer hardware, laptops, and mobile devices.",
    models: [
      { name: "Phi-4 14B (Microsoft)", context: "16K", strengths: "Pound-for-pound synthetic reasoning king, high STEM benchmark scores at small footprint.", inputCostPerM: "Local GPU", outputCostPerM: "Local GPU" },
      { name: "Llama 3.2 3B (Meta)", context: "128K", strengths: "Runs smoothly on Apple Silicon (M1/M2/M3) via Ollama/MLX at >60 tokens/sec.", inputCostPerM: "Local Edge", outputCostPerM: "Local Edge" },
      { name: "SmolLM2 1.7B (Hugging Face)", context: "8K", strengths: "On-device mobile classification, local privacy filters, zero battery drain.", inputCostPerM: "Local Edge", outputCostPerM: "Local Edge" }
    ]
  },
  {
    family: "Reasoning & Thinking Models (Test-Time Compute)",
    description: "Models that spend dynamic reasoning tokens in hidden scratchpads before producing final answers.",
    models: [
      { name: "DeepSeek-R1 (671B MoE)", context: "128K", strengths: "Open reasoning weights trained via pure RL with verifiable rewards; competitive with OpenAI o1.", inputCostPerM: "$0.55", outputCostPerM: "$2.19" },
      { name: "OpenAI o3-mini / o1", context: "200K", strengths: "Deep multi-step math proofs, competitive programming, formal logic verification.", inputCostPerM: "$1.10", outputCostPerM: "$4.40" }
    ]
  }
];

export const EVALUATE_MODEL_SELECTION = ({
  privacyRequirement, // 'strict_onprem' | 'standard_cloud' | 'hipaa_compliance'
  budgetTier,         // 'ultra_low' | 'balanced' | 'flagship'
  reasoningTask,      // 'simple_extraction' | 'standard_rag' | 'complex_coding' | 'math_proof'
  targetLatency       // 'realtime_sub300ms' | 'standard_1s' | 'batch'
}) => {
  let recommendedModel = "Llama 3.3 70B (vLLM Self-Hosted)";
  let hostingTopology = "Self-Hosted on RunPod/AWS EC2 (2x A100 80GB)";
  let estimatedCostPer10kCalls = "$4.50";
  let rationale = "Balanced enterprise workhorse providing full data privacy and robust schema adherence.";

  if (privacyRequirement === 'strict_onprem') {
    if (budgetTier === 'ultra_low' || targetLatency === 'realtime_sub300ms') {
      recommendedModel = "Llama 3.2 3B / Qwen 2.5 7B (Ollama / vLLM)";
      hostingTopology = "Local Workstation / On-Prem Edge Server (Single RTX 4090)";
      estimatedCostPer10kCalls = "$0.00 (Fixed Hardware)";
      rationale = "Zero data leaves physical perimeter; sub-50ms TTFT latency on local GPU.";
    } else {
      recommendedModel = "DeepSeek-V3 671B MoE / Llama 3.3 70B";
      hostingTopology = "Air-Gapped Private VPC (FSDP / vLLM Cluster)";
      estimatedCostPer10kCalls = "$8.00 (Server compute amortized)";
      rationale = "Frontier-level reasoning with absolute isolation from public clouds.";
    }
  } else {
    if (reasoningTask === 'math_proof' || reasoningTask === 'complex_coding') {
      recommendedModel = "Claude 3.5 Sonnet / DeepSeek-R1";
      hostingTopology = "Managed Cloud API with Anthropic / DeepSeek Endpoint";
      estimatedCostPer10kCalls = "$45.00";
      rationale = "Deep thinking & reasoning models dominate complex code generation and mathematical deductions.";
    } else if (budgetTier === 'ultra_low') {
      recommendedModel = "Gemini 2.0 Flash / DeepSeek-V3 API";
      hostingTopology = "Serverless Cloud Endpoint with Prompt Caching";
      estimatedCostPer10kCalls = "$0.80";
      rationale = "Industry-leading cost-to-performance ratio ($0.10/M tokens) with 1M context support.";
    } else {
      recommendedModel = "GPT-4o / Claude 3.5 Sonnet";
      hostingTopology = "Direct REST API with Semantic Gateway (LiteLLM)";
      estimatedCostPer10kCalls = "$28.00";
      rationale = "Maximum instruction fidelity, rich tool calling ecosystem, and enterprise SLA.";
    }
  }

  return {
    recommendedModel,
    hostingTopology,
    estimatedCostPer10kCalls,
    rationale
  };
};

export const PYTHON_LITELLM_ROUTING_SCRIPT = `# ============================================================================
# PRODUCTION MULTI-PROVIDER MODEL ROUTER (LITELLM GATEWAY)
# Demonstrates unified OpenAI-compatible routing across Claude, GPT-4o, and Llama
# ============================================================================

import os
from litellm import completion, Router

# 1. Configure Model Fallback Router & Cost Optimizer
model_list = [
    {
        "model_name": "enterprise-fast",
        "litellm_params": {
            "model": "gemini/gemini-2.0-flash",
            "api_key": os.getenv("GEMINI_API_KEY")
        }
    },
    {
        "model_name": "enterprise-reasoning",
        "litellm_params": {
            "model": "anthropic/claude-3-5-sonnet-20241022",
            "api_key": os.getenv("ANTHROPIC_API_KEY")
        }
    },
    {
        "model_name": "enterprise-fallback",
        "litellm_params": {
            "model": "openai/gpt-4o",
            "api_key": os.getenv("OPENAI_API_KEY")
        }
    }
]

router = Router(
    model_list=model_list,
    routing_strategy="latency-based-routing",
    fallbacks=[{"enterprise-reasoning": ["enterprise-fallback"]}]
)

# 2. Execute High-Availability Request with Automatic Fallback
response = router.completion(
    model="enterprise-reasoning",
    messages=[
        {"role": "system", "content": "You are an enterprise architectural assistant."},
        {"role": "user", "content": "Design an automated document verification loop."}
    ],
    temperature=0.2
)

print("Generated Response:", response.choices[0].message.content)
print("Model Used:", response.model)
`;
