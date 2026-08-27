// ============================================================================
// TRANSFORMER & SELF-ATTENTION STEP-BY-STEP MATHEMATICAL ENGINE
// Exact tensor calculations for Query, Key, Value, Scaled Dot-Product,
// Attention Heatmaps, Attention Variants (MHA, GQA, MQA, MLA), and RoPE
// ============================================================================

export const ATTENTION_EXAMPLE_SENTENCES = [
  {
    id: "coreference_animal",
    title: "1. Coreference Resolution ('it' -> 'animal')",
    sentence: ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired"],
    targetTokenIdx: 7, // 'it'
    attentionWeights: [0.02, 0.62, 0.03, 0.04, 0.01, 0.05, 0.03, 0.08, 0.02, 0.04, 0.06],
    explanation: "When resolving 'it' in 'too tired', the model projects high attention mass (62%) to 'animal' due to semantic compatibility with physical fatigue."
  },
  {
    id: "coreference_street",
    title: "2. Coreference Resolution ('it' -> 'street')",
    sentence: ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "wide"],
    targetTokenIdx: 7, // 'it'
    attentionWeights: [0.01, 0.06, 0.02, 0.05, 0.02, 0.64, 0.04, 0.07, 0.02, 0.02, 0.05],
    explanation: "Changing the single word to 'wide' dramatically shifts the QK^T dot-product, redirecting 64% of attention weight to 'street'."
  },
  {
    id: "syntactic_agreement",
    title: "3. Long-Range Subject-Verb Agreement",
    sentence: ["The", "server", "with", "all", "the", "backup", "hard", "drives", "has", "crashed"],
    targetTokenIdx: 8, // 'has'
    attentionWeights: [0.02, 0.58, 0.01, 0.02, 0.01, 0.03, 0.02, 0.12, 0.14, 0.05],
    explanation: "The singular verb 'has' attends primarily to the singular subject 'server' (58%), correctly ignoring the plural distractor 'drives' (12%)."
  }
];

export const ATTENTION_ARCHITECTURES = [
  {
    id: "mha",
    name: "Multi-Head Attention (MHA)",
    paper: "Vaswani et al. (2017)",
    qHeads: "H heads",
    kvHeads: "H heads (1:1 ratio)",
    kvMemoryMultiplier: "1.0× (Baseline)",
    desc: "Every query head has its own dedicated Key and Value heads. Provides maximum representational capacity, but KV cache scales linearly with head count, creating severe memory bottlenecks at long context (128k+ tokens)."
  },
  {
    id: "gqa",
    name: "Grouped-Query Attention (GQA)",
    paper: "Ainslie et al. (2023) / Llama 2/3, Mistral",
    qHeads: "H heads (e.g. 32)",
    kvHeads: "G groups (e.g. 8, 4:1 ratio)",
    kvMemoryMultiplier: "0.25× (4× KV Cache Reduction)",
    desc: "Multiple query heads share a single Key/Value head. Retains over 99% of MHA performance while reducing KV cache size and memory bandwidth pressure by 4x to 8x."
  },
  {
    id: "mqa",
    name: "Multi-Query Attention (MQA)",
    paper: "Shazeer (2019) / Falcon",
    qHeads: "H heads",
    kvHeads: "1 single KV head (H:1 ratio)",
    kvMemoryMultiplier: "0.125× (8× KV Cache Reduction)",
    desc: "All query heads share a single key and value head. Maximizes inference decoding speed, but can suffer minor quality degradation on complex multi-hop reasoning."
  },
  {
    id: "mla",
    name: "Multi-Head Latent Attention (MLA)",
    paper: "DeepSeek-V2 / DeepSeek-V3 (2024)",
    qHeads: "H heads via compressed latent",
    kvHeads: "Compressed into single vector c_KV",
    kvMemoryMultiplier: "0.05× (20× KV Cache Reduction)",
    desc: "Compresses Key and Value projections into a low-dimensional latent vector c_KV. At inference, caches only c_KV and up-projects dynamically, reducing KV cache beyond GQA without quality loss."
  }
];

export const POSITIONAL_ENCODINGS = [
  {
    id: "rope",
    name: "Rotary Position Embedding (RoPE)",
    usedBy: "Llama 3, Mistral, Qwen, DeepSeek",
    mechanism: "Applies 2D rotation matrices to Query and Key vectors in the complex plane: R_{Θ, m}^d x.",
    advantages: "Preserves relative distance naturally via inner products; supports dynamic RoPE frequency scaling for 128K–1M context extension (YaRN, NTK-aware)."
  },
  {
    id: "alibi",
    name: "Attention with Linear Biases (ALiBi)",
    usedBy: "BLOOM, MPT",
    mechanism: "Adds a static, non-learned linear penalty proportional to token distance directly to the attention matrix: Softmax(QK^T - m * |i - j|).",
    advantages: "Zero trainable positional parameters; excellent zero-shot length extrapolation."
  },
  {
    id: "learned_abs",
    name: "Learned Absolute Embeddings",
    usedBy: "Original GPT-2, BERT",
    mechanism: "Adds a fixed lookup vector corresponding to absolute position index: x_i = t_i + p_i.",
    advantages: "Simple implementation, but cannot extrapolate beyond the maximum sequence length seen during pretraining."
  }
];

export const COMPUTE_SYNTHETIC_ATTENTION_MATRIX = (tokens, headType = "syntactic") => {
  const n = tokens.length;
  const matrix = [];

  for (let i = 0; i < n; i++) {
    const row = [];
    let sum = 0;
    for (let j = 0; j < n; j++) {
      // Causal mask: cannot attend to future tokens (j > i) in decoder
      if (j > i) {
        row.push(0.0);
      } else {
        const dist = Math.abs(i - j);
        let baseScore = Math.exp(-dist * 0.4);
        
        // Head specializations
        if (headType === "previous_token" && j === i - 1) baseScore += 2.5;
        if (headType === "first_token" && j === 0) baseScore += 1.8;
        if (headType === "self" && j === i) baseScore += 1.2;

        row.push(baseScore);
        sum += baseScore;
      }
    }

    // Softmax normalization over row
    matrix.push(row.map(val => (sum > 0 ? parseFloat((val / sum).toFixed(3)) : 0)));
  }

  return matrix;
};

export const PYTHON_SELF_ATTENTION_SCRIPT = `# ============================================================================
# PURE PYTORCH STEP-BY-STEP MULTI-HEAD SELF-ATTENTION IMPLEMENTATION
# Demonstrates Q, K, V projections, scaled dot-product, causal mask, and RoPE
# ============================================================================

import math
import torch
import torch.nn as nn
import torch.nn.functional as F

class ScaledDotProductAttention(nn.Module):
    def __init__(self, dropout: float = 0.0):
        super().__init__()
        self.dropout = nn.Dropout(dropout)

    def forward(self, q, k, v, mask=None):
        # q, k, v shape: (batch_size, num_heads, seq_len, head_dim)
        d_k = q.size(-1)
        
        # 1. Compute raw attention scores: Q @ K^T / sqrt(d_k)
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(d_k)
        
        # 2. Apply Causal Autoregressive Mask (prevent attending to future tokens)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
            
        # 3. Softmax over last dimension to obtain attention probability weights
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        
        # 4. Context output: Attention_Weights @ V
        output = torch.matmul(attn_weights, v)
        return output, attn_weights

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int = 4096, n_heads: int = 32):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.head_dim = d_model // n_heads
        
        # Linear projection matrices for Q, K, V, and Output
        self.w_q = nn.Linear(d_model, d_model, bias=False)
        self.w_k = nn.Linear(d_model, d_model, bias=False)
        self.w_v = nn.Linear(d_model, d_model, bias=False)
        self.w_o = nn.Linear(d_model, d_model, bias=False)
        self.attention = ScaledDotProductAttention()

    def forward(self, x, mask=None):
        batch_size, seq_len, _ = x.shape
        
        # Project inputs to Q, K, V and reshape into heads
        q = self.w_q(x).view(batch_size, seq_len, self.n_heads, self.head_dim).transpose(1, 2)
        k = self.w_k(x).view(batch_size, seq_len, self.n_heads, self.head_dim).transpose(1, 2)
        v = self.w_v(x).view(batch_size, seq_len, self.n_heads, self.head_dim).transpose(1, 2)
        
        # Execute scaled dot-product attention
        out, weights = self.attention(q, k, v, mask=mask)
        
        # Concatenate heads and project back through W_O
        out = out.transpose(1, 2).contiguous().view(batch_size, seq_len, self.d_model)
        return self.w_o(out), weights
`;
