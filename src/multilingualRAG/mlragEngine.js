// ============================================================================
// MULTILINGUAL RAG ENGINE — translate-query vs native embed vs translate-corpus
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const STRATEGY_TABLE = [
  { route: "Translate query → English", quality: "Good (EN-centric KB)", cost: "$ (+MT call)", best: "EN-dominant corpus, rare query langs" },
  { route: "Multilingual embed (mE5/BGE-M3)", quality: "Good, no MT", cost: "$$ (bigger model)", best: "Mixed corpus, latency-sensitive" },
  { route: "Translate corpus once", quality: "Best retrieval, stale risk", cost: "$$$ upfront", best: "Stable corpus, high query volume" }
];

export const FAILURE_TABLE = [
  { fail: "Fertility blow-up", detail: "hi/ar ≈1.8x tokens → 2x bill + context squeeze", fix: "Native models + cache + compress" },
  { fail: "Entity drift in MT", detail: "Names/dates morph across translation", fix: "Carry source spans + cite source language" },
  { fail: "Mixed-language chunks", detail: "One chunk, two languages → weak embedding", fix: "Language-tag chunks; filter by lang first" }
];

// ── Simulator: route picker ─────────────────────────────────────────────────
export const PICK_ROUTE = (corpusEN = 80, queryLang = "hi", volume = "high", latency = false) => {
  const enDom = corpusEN >= 70;
  if (enDom && volume !== "high") return { route: "Translate query → English", why: `${corpusEN}% EN corpus + modest volume — MT per query is cheapest.` };
  if (latency) return { route: "Multilingual embed (mE5/BGE-M3)", why: "Latency-sensitive — no MT hop; single embed path." };
  if (volume === "high") return { route: "Translate corpus once", why: "High volume amortises upfront MT; best retrieval, watch staleness." };
  return { route: "Multilingual embed (mE5/BGE-M3)", why: "Balanced default for mixed corpora." };
};

export const PYTHON_MLRAG_CODE = `# ============================================================================
# MULTILINGUAL RAG ROUTER: corpus mix + latency + volume -> route
# ============================================================================
def pick_route(corpus_en_pct: int, query_lang: str, volume: str, latency: bool) -> str:
    if corpus_en_pct >= 70 and volume != "high":
        return "translate-query"
    if latency:
        return "multilingual-embed"
    if volume == "high":
        return "translate-corpus"
    return "multilingual-embed"

def retrieve(query: str, lang: str, route: str, k: int = 8):
    if route == "translate-query":
        q = mt_translate(query, lang, "en")      # + carry source spans
    else:
        q = query                                # native multilingual embed
    cands = vector_search(embed(q, multilingual=(route != "translate-query")), k=k)
    return lang_filter(cands, lang)              # tag-aware re-rank
`;
