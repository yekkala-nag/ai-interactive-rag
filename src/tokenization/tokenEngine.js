// ============================================================================
// TOKENIZATION ENGINE — BPE/Unigram/WordPiece, fertility, multilingual cost
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const ALGO_TABLE = [
  { algo: "BPE (GPT, Llama)", how: "Merge frequent byte pairs bottom-up", vocab: "32k–200k", trait: "Fast, greedy; splits rare words hard" },
  { algo: "Unigram (T5, mT5)", how: "Prune largest-LM-loss tokens top-down", vocab: "32k–250k", trait: "Probabilistic; better morphology" },
  { algo: "WordPiece (BERT)", how: "Merge max-likelihood pairs, ##continuations", vocab: "~30k", trait: "Retrieval/encoder classic" }
];

// Fertility ≈ tokens per word vs English (illustrative, literature-aligned)
export const FERTILITY = [
  { lang: "English", mult: 1.0, note: "tokenizer-native" },
  { lang: "Spanish / French", mult: 1.2, note: "mild inflation" },
  { lang: "Hindi / Arabic", mult: 1.8, note: "2x bill for same meaning" },
  { lang: "Chinese (chars)", mult: 0.7, note: "dense per char, weak per word" },
  { lang: "Code / JSON", mult: 1.4, note: "whitespace + symbols fragment" }
];

// ── Simulator: token + cost estimate ────────────────────────────────────────
export const ESTIMATE_TOKENS = (words = 1000, langMult = 1.0, pricePerM = 5) => {
  const tokens = Math.round(words * 1.3 * langMult);
  return {
    tokens, fertility: +(1.3 * langMult).toFixed(2),
    costPer1kDocs: +((tokens / 1e6) * pricePerM * 1000).toFixed(2),
    note: langMult >= 1.5 ? "Non-English tax: same semantics, ~2x tokens. Mitigate: native multilingual models, cache, compress."
      : "Near-native fertility. Watch code/JSON spans — they fragment worst."
  };
};

export const PYTHON_TOKEN_CODE = `# ============================================================================
# TOKENIZATION: fertility estimate + per-language cost + chunk guard
# ============================================================================
FERTILITY = {"en": 1.0, "es": 1.2, "fr": 1.2, "hi": 1.8, "ar": 1.8,
             "zh": 0.7, "code": 1.4}

def estimate(words: int, lang: str = "en", price_per_m: float = 5.0) -> dict:
    toks = int(words * 1.3 * FERTILITY.get(lang, 1.3))
    return {"tokens": toks, "fertility": round(1.3 * FERTILITY.get(lang, 1.3), 2),
            "usd_per_1k_docs": round(toks / 1e6 * price_per_m * 1000, 2)}

def chunk_guard(text: str, max_tokens: int = 1000) -> list[str]:
    # NEVER split inside a token: pre-split on whitespace, budget by estimate
    words, chunks, cur = text.split(), [], []
    for w in words:
        if len(" ".join(cur + [w]).split()) * 1.6 > max_tokens:
            chunks.append(" ".join(cur)); cur = [w]
        else:
            cur.append(w)
    if cur: chunks.append(" ".join(cur))
    return chunks
`;
