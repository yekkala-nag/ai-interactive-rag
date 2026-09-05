// ============================================================================
// QUANTIZATION & SERVING ENGINE — GGUF/AWQ/GPTQ + vLLM/TensorRT/TGI
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const QUANT_TABLE = [
  { fmt: "FP16 / BF16", bits: 16, quality: "baseline", vram70B: "~140 GB", use: "Train / eval reference" },
  { fmt: "INT8 (LLM.int8)", bits: 8, quality: "≈ lossless", vram70B: "~70 GB", use: "1-GPU 70B, safe default" },
  { fmt: "INT4 AWQ / GPTQ", bits: 4, quality: "−1–3% bench", vram70B: "~35 GB", use: "Single-GPU serving sweet spot" },
  { fmt: "GGUF Q4_K_M", bits: "~4.5", quality: "−2–4%", vram70B: "~40 GB", use: "CPU + edge (llama.cpp)" },
  { fmt: "INT2 / Q2", bits: 2, quality: "visible loss", vram70B: "~18 GB", use: "Desperation tier — eval first" }
];

export const SERVE_TABLE = [
  { stack: "vLLM (PagedAttention)", best: "Throughput king, OpenAI API", needs: "NVIDIA GPU, CUDA" },
  { stack: "TensorRT-LLM", best: "Lowest latency, fused kernels", needs: "Build per-GPU arch" },
  { stack: "TGI / TEI", best: "HF-native, embeds + generate", needs: "Simple Docker ops" },
  { stack: "llama.cpp / Ollama", best: "CPU + Mac + edge GGUF", needs: "Lower QPS acceptance" }
];

// ── Simulator: VRAM + serving fit ───────────────────────────────────────────
export const SIZE_MODEL = (paramsB = 70, bits = 4, ctxK = 32, gpus = 1, gpuGB = 80) => {
  const weights = paramsB * 1e9 * bits / 8 / 1e9;
  const kv = paramsB * 0.15 * (ctxK / 32);           // rough KV-cache heuristic
  const total = weights + kv;
  const fits = total <= gpus * gpuGB;
  return {
    weightsGB: +weights.toFixed(1), kvGB: +kv.toFixed(1), totalGB: +total.toFixed(1),
    fits, stack: !fits ? "Shard (tensor-parallel) or drop a quant tier." : bits <= 4 && paramsB >= 30 ? "vLLM INT4 — throughput sweet spot." : bits >= 16 ? "FP16 single-need eval only — quantize to serve." : "vLLM / TGI per ops comfort."
  };
};

export const PYTHON_QUANT_CODE = `# ============================================================================
# SERVING MATH: weights + KV cache vs GPU budget -> quant/stack pick
# ============================================================================
def vram_gb(params_b: float, bits: int = 4, ctx_k: int = 32) -> dict:
    weights = params_b * 1e9 * bits / 8 / 1e9
    kv = params_b * 0.15 * (ctx_k / 32)
    return {"weights": round(weights, 1), "kv": round(kv, 1),
            "total": round(weights + kv, 1)}

def pick_stack(total: float, budget_gb: float, edge: bool = False) -> str:
    if edge: return "llama.cpp GGUF Q4_K_M"
    if total > budget_gb: return "shard or drop a quant tier"
    return "vLLM (PagedAttention) default; TensorRT-LLM for p99 latency"

if __name__ == "__main__":
    print(vram_gb(70, 4), pick_stack(40, 80))
`;
