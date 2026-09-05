// ============================================================================
// VECTOR-DB OPS ENGINE — Flat/IVF/HNSW/PQ + Qdrant vs Milvus + sizing
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const INDEX_TABLE = [
  { index: "Flat (brute force)", recall: "1.00", qps: "low", ram: "vectors only", use: "≤100k vectors, ground truth" },
  { index: "IVF (inverted file)", recall: "0.90–0.98", qps: "mid", ram: "vectors + lists", use: "1M–10M, tunable nprobe" },
  { index: "HNSW (graph)", recall: "0.95–0.99", qps: "high", ram: "vectors + graph (~1.3x)", use: "Default <50M, low latency" },
  { index: "PQ (compressed)", recall: "0.80–0.92", qps: "high", ram: "~1/8th", use: "100M+ / RAM-bound; pair with IVF/HNSW" }
];

export const STORE_TABLE = [
  { dim: "Qdrant", strength: "Filters + payloads, easy ops", watch: "shard tuning at scale" },
  { dim: "Milvus", strength: "Huge-scale partitions, GPU index", watch: "heavier to operate" },
  { dim: "pgvector", strength: "Zero new infra, SQL joins", watch: "≤2M vectors sweet spot" }
];

// ── Simulator: RAM + guidance ───────────────────────────────────────────────
export const SIZE_INDEX = (vectorsM = 5, dim = 768, kind = "hnsw") => {
  const bytes = vectorsM * 1e6 * dim * 4;
  const gb = bytes / 1e9;
  const mult = kind === "hnsw" ? 1.35 : kind === "ivf" ? 1.1 : kind === "pq" ? 0.15 : 1.0;
  const total = gb * mult;
  const guidance = vectorsM <= 0.1 ? "Flat — exact, simplest."
    : kind === "pq" || total > 64 ? "IVF-PQ or sharded HNSW — RAM-bound, compress or shard."
      : kind === "hnsw" ? "HNSW — default; M≈16, efSearch 64–200 tunes recall/latency."
        : "IVF — set nlist≈√N, nprobe 8–64 for recall/latency trade.";
  return { rawGB: +gb.toFixed(1), estGB: +total.toFixed(1), guidance, recallNote: "Measure recall@k on YOUR queries — defaults lie." };
};

export const PYTHON_VDB_CODE = `# ============================================================================
# VECTOR-DB SIZING: RAM math + recall harness (measure, don't assume)
# ============================================================================
def ram_gb(vectors_m: float, dim: int = 768, kind: str = "hnsw") -> float:
    raw = vectors_m * 1e6 * dim * 4 / 1e9
    return raw * {"flat": 1.0, "ivf": 1.1, "hnsw": 1.35, "pq": 0.15}[kind]

def recall_at_k(retrieved: list[list[str]], gold: list[set], k: int = 10) -> float:
    hits = sum(1 for r, g in zip(retrieved, gold) if g & set(r[:k]))
    return round(hits / max(1, len(gold)), 3)

if __name__ == "__main__":
    print("5M×768 HNSW ≈", ram_gb(5), "GB")
`;
