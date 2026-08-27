// ============================================================================
// VISION-LANGUAGE MODELS (VLM) & MULTIMODAL GENAI ENGINE
// Pure mathematical & architectural logic for Vision Transformers (ViT),
// Patch Tokenization, Cross-Modal Connectors (LLaVA / CLIP / SigLIP), and VQA
// ============================================================================

export const VLM_EXAMPLE_TASKS = [
  {
    id: "chart_qa",
    title: "1. Financial Bar Chart & Table Reasoning",
    imageType: "Bar Chart (Quarterly SaaS Revenue)",
    visualTokens: 256,
    inputQuestion: "Which quarter experienced the highest YoY growth and what was the gross margin in Q3?",
    visualAttentionFocus: "Q3 Bar Top + Right Legend (Gross Margin 78.4%)",
    vlmResponse: "Based on the chart: Q2 2024 experienced the highest YoY revenue growth (+42% YoY to $12.4M). In Q3 2024, the gross margin was 78.4% with total revenue of $14.1M.",
    connectorUsed: "2-Layer MLP Projection (LLaVA-1.6 Architecture)"
  },
  {
    id: "document_receipt",
    title: "2. Complex Document & OCR Receipt Grounding",
    imageType: "Scanned Commercial Invoice",
    visualTokens: 576,
    inputQuestion: "Extract line items, tax rate, and verify total sum consistency.",
    visualAttentionFocus: "Table Bounding Box [y0: 0.32, x0: 0.15, y1: 0.78, x1: 0.85]",
    vlmResponse: "{\n  \"vendor\": \"Enterprise Cloud Services LLC\",\n  \"subtotal_usd\": 4850.00,\n  \"tax_rate_pct\": 8.25,\n  \"tax_amount_usd\": 400.13,\n  \"total_due_usd\": 5250.13,\n  \"math_verification\": \"PASS\"\n}",
    connectorUsed: "SigLIP Patch Encoder + Spatial Unpad"
  },
  {
    id: "spatial_grounding",
    title: "3. Spatial Object Grounding & Bounding Boxes",
    imageType: "Autonomous Vehicle Dashcam",
    visualTokens: 256,
    inputQuestion: "Detect all pedestrians and bicycles in the crosswalk.",
    visualAttentionFocus: "Pedestrian Cluster [ymin: 450, xmin: 620, ymax: 710, xmax: 680]",
    vlmResponse: "Detected 2 targets:\n1. Pedestrian at [450, 620, 710, 680] with 98% confidence.\n2. Bicycle at [480, 590, 730, 650] with 94% confidence.",
    connectorUsed: "Native Spatial Token Coordinates"
  }
];

export const VLM_CONNECTOR_ARCHITECTURES = [
  {
    id: "linear_mlp",
    name: "Linear / 2-Layer MLP Projection",
    models: "LLaVA-1.5 / LLaVA-NeXT, PaliGemma",
    mechanism: "Passes each visual token from the ViT through a 2-layer MLP to map visual hidden dimension (e.g. 1024) to LLM hidden dimension (e.g. 4096).",
    pros: "Extremely simple, preserves all spatial resolution and patch layout, trains quickly.",
    cons: "High context token cost (576–2,048 tokens per image in the LLM context window)."
  },
  {
    id: "q_former",
    name: "Q-Former / Perceiver Resampler",
    models: "BLIP-2, InstructBLIP, Flamingo",
    mechanism: "Uses a set of learnable query tokens to cross-attend over the dense ViT feature map, compressing hundreds of visual patches into a fixed number of tokens (e.g. 32 or 64).",
    pros: "Fixed low context footprint in LLM; isolates LLM from high image resolutions.",
    cons: "Information bottleneck: can lose fine-grained text, tiny chart labels, and small UI icons."
  },
  {
    id: "cross_attention",
    name: "Gated Cross-Attention Layers",
    models: "Flamingo, Llama 3.2 Vision",
    mechanism: "Freezes the LLM and inserts cross-attention layers after every N transformer blocks. Visual tokens attend directly into the intermediate layers.",
    pros: "Zero context window stuffing; keeps text context completely clean.",
    cons: "Modifies model architecture; requires training new cross-attention weights from scratch."
  },
  {
    id: "native_multimodal",
    name: "Native Multimodal Transformer",
    models: "Chameleon, Gemini 1.5/2.0, GPT-4o",
    mechanism: "Tokenizes images directly into discrete visual tokens (via VQ-VAE) or continuous embeddings in a unified vocabulary space from pretraining step 0.",
    pros: "True omni-modal reasoning; native image output generation and interleaved media.",
    cons: "Enormous pretraining compute budget; complex multi-modal loss balancing."
  }
];

export const VIT_PATCH_CALCULATION = (imageWidth = 448, imageHeight = 448, patchSize = 14) => {
  const numPatchesX = Math.floor(imageWidth / patchSize);
  const numPatchesY = Math.floor(imageHeight / patchSize);
  const totalPatches = numPatchesX * numPatchesY;
  const rawPixelDim = patchSize * patchSize * 3; // RGB channels

  return {
    imageWidth,
    imageHeight,
    patchSize,
    numPatchesX,
    numPatchesY,
    totalPatches,
    rawPixelDim,
    clsToken: 1,
    totalVisualTokens: totalPatches + 1
  };
};

export const PYTHON_VLM_PIPELINE_SCRIPT = `# ============================================================================
# PRODUCTION VISION-LANGUAGE MODEL (VLM) INFERENCE & ARCHITECTURE
# Demonstrates LLaVA-1.6 / PaliGemma Image Tokenization and VQA
# ============================================================================

import torch
from PIL import Image
from transformers import AutoProcessor, LlavaForConditionalGeneration

MODEL_ID = "llava-hf/llava-1.5-7b-hf"

# 1. Load Pretrained VLM and Multimodal Processor
processor = AutoProcessor.from_pretrained(MODEL_ID)
model = LlavaForConditionalGeneration.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

# 2. Prepare Image and Visual Prompt
image = Image.open("financial_quarterly_chart.png")
prompt = "USER: <image>\\nAnalyze this revenue chart. What is the Q3 YoY growth?\\nASSISTANT:"

# 3. Process Multimodal Inputs (Patch Extraction + Tokenization)
inputs = processor(
    text=prompt,
    images=image,
    return_tensors="pt"
).to(model.device, dtype=torch.bfloat16)

# 4. Generate Visual-Grounded Answer
with torch.inference_mode():
    output_tokens = model.generate(
        **inputs,
        max_new_tokens=256,
        temperature=0.2,
        do_sample=False
    )

response = processor.decode(output_tokens[0], skip_special_tokens=True)
print("VLM Answer:", response)
`;
