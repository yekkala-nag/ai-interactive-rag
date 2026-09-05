// ============================================================================
// MULTIMODAL RAG ENGINE — CLIP/SigLIP, layout, chart QA, modality router
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const MODALITY_TABLE = [
  { mod: "Scanned pages / OCR", embed: "Text + layout (DocLayNet) + OCR conf", cite: "page bbox", trap: "OCR order ≠ reading order" },
  { mod: "Charts / plots", embed: "Deplot-style table extraction + caption", cite: "figure + recovered table", trap: "Hue/size encodings need vision LLM" },
  { mod: "Photos / figures", embed: "CLIP/SigLIP + VQA caption", cite: "image region", trap: "Caption hallucinates detail" },
  { mod: "Tables (visual)", embed: "Table Transformer grid → table_df", cite: "row/cell rect", trap: "Merged cells break grids" }
];

export const VLM_TABLE = [
  { model: "CLIP / SigLIP", role: "Retrieval embeddings", note: "Bi-encoder for image↔text; rerank with VQA" },
  { model: "LLaVA / PaLI-GEMMA", role: "VQA + captioning", note: "Answer + cite region; verify numbers" },
  { model: "DePlot / ChartQA", role: "Chart → table", note: "Plot to data, then SQL/text path" }
];

// ── Simulator: modality router ──────────────────────────────────────────────
export const ROUTE_MODALITY = (mix = { scan: 30, chart: 20, photo: 10, table: 40 }) => {
  const total = Object.values(mix).reduce((a, b) => a + b, 0) || 1;
  const steps = [];
  if (mix.scan) steps.push(`OCR+layout (${mix.scan}%)`);
  if (mix.table) steps.push(`Table-Transformer→table_df (${mix.table}%)`);
  if (mix.chart) steps.push(`DePlot→table (${mix.chart}%)`);
  if (mix.photo) steps.push(`SigLIP+VQA caption (${mix.photo}%)`);
  const visionShare = (mix.chart + mix.photo) / total;
  return {
    pipeline: steps.join(" + ") || "text-only",
    visionLLM: visionShare > 0.3 ? "REQUIRED (vision share >30%) — budget O5-style fallback" : "fallback only",
    cite: "Every modality cites geometry: bbox / rect / figure — no naked claims."
  };
};

export const PYTHON_MMRAG_CODE = `# ============================================================================
# MULTIMODAL RAG ROUTER: per-page modality -> extraction -> typed store
# ============================================================================
def route_page(modality: str) -> str:
    return {"scan": "ocr+layout", "table": "table-transformer",
            "chart": "deplot->table", "photo": "siglip+vqa"}.get(modality, "text")

def ingest(pages: list[dict]):
    for p in pages:
        kind = route_page(p["modality"])
        if kind == "deplot->table":
            p["table"] = deplot(p["image"])      # chart -> data, then SQL/text
        elif kind == "siglip+vqa":
            p["caption"], p["region"] = vqa(p["image"])  # cite region!
    return pages
`;
