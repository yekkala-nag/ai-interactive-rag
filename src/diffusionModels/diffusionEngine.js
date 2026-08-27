// ============================================================================
// DIFFUSION MODELS & GENERATIVE MEDIA ARCHITECTURE ENGINE
// Forward/Reverse Markov Chains, Score Matching, Noise Schedulers (DDPM/DDIM),
// Classifier-Free Guidance (CFG), Latent Diffusion (LDM), and DiT (Transformers)
// ============================================================================

export const DIFFUSION_STEPS_SIMULATION = [
  { step: 1000, alphaBar: 0.001, noisePct: 99.9, desc: "t=1000: Pure isotropic Gaussian noise N(0, I). Zero semantic structure.", visualState: "Gaussian Noise" },
  { step: 800, alphaBar: 0.08, noisePct: 92.0, desc: "t=800: Early global composition. U-Net/DiT predicts coarse shapes and color temperature.", visualState: "Coarse Color Blobs" },
  { step: 500, alphaBar: 0.35, noisePct: 65.0, desc: "t=500: Structural boundary formation. Subject silhouette and lighting geometry emerge.", visualState: "Outlined Silhouette" },
  { step: 200, alphaBar: 0.82, noisePct: 18.0, desc: "t=200: High-frequency texture synthesis. Fine details, edges, and reflections added.", visualState: "Detailed Subject" },
  { step: 0, alphaBar: 1.0, noisePct: 0.0, desc: "t=0: Clean latent z_0 decoded by VAE Decoder into high-resolution RGB image.", visualState: "Crisp Final Image" }
];

export const DIFFUSION_ARCHITECTURAL_PARADIGMS = [
  {
    id: "pixel_diffusion",
    name: "Pixel-Space Diffusion (DDPM)",
    paper: "Ho et al. (2020) / Nichol et al. (2021)",
    space: "Direct Pixel Space (e.g. 512x512x3)",
    computeCost: "Enormous (millions of pixel operations per denoising step)",
    desc: "Applies noise directly in raw RGB pixel space. Highly compute-intensive; superseded by Latent Diffusion for high-resolution synthesis."
  },
  {
    id: "latent_diffusion",
    name: "Latent Diffusion Models (LDM / SDXL)",
    paper: "Rombach et al. (2022) / Stability AI",
    space: "Compressed Latent Space (e.g. 64x64x4 via VAE)",
    computeCost: "8x - 16x compute reduction vs pixel space",
    desc: "Uses a pre-trained VAE encoder to compress image dimensions 8x into latent space z. Denoising happens entirely in latent space before VAE decoding to RGB."
  },
  {
    id: "dit",
    name: "Diffusion Transformers (DiT)",
    paper: "Peebles & Xie (2023) / Sora, Flux.1, SD3",
    space: "Patched Latent Space with adaLN-Zero",
    computeCost: "Scales predictably with compute (following Chinchilla laws)",
    desc: "Replaces the convolutional U-Net with a Vision Transformer backbone. Patches latent representations and injects timestep/text conditioning via Adaptive LayerNorm (adaLN-Zero)."
  },
  {
    id: "flow_matching",
    name: "Flow Matching & Rectified Flow",
    paper: "Lipman et al. (2023) / SD3, Flux, Wan2.1",
    space: "Linear Vector Fields between Noise and Data",
    computeCost: "Fastest convergence (fewer sampling steps: 4–20 steps)",
    desc: "Replaces curved curved stochastic SDE trajectories with straight deterministic ODE velocity fields, enabling crisp generation in far fewer sampling steps."
  }
];

export const CALCULATE_CFG_PREDICTION = (uncondScore = 0.2, textCondScore = 0.8, guidanceScale = 7.5) => {
  // Formula: eps_final = eps_uncond + s * (eps_text - eps_uncond)
  const guidedScore = uncondScore + guidanceScale * (textCondScore - uncondScore);
  const saturationRisk = guidanceScale > 12.0 ? "HIGH (Color oversaturation / burn artifacts)" : guidanceScale >= 5.0 ? "OPTIMAL (High fidelity & prompt alignment)" : "LOW (Loose prompt adherence, high diversity)";

  return {
    guidanceScale,
    uncondScore,
    textCondScore,
    guidedScore: parseFloat(guidedScore.toFixed(2)),
    saturationRisk
  };
};

export const PYTHON_DIFFUSERS_SCRIPT = `# ============================================================================
# PRODUCTION DIFFUSION PIPELINE (HUGGING FACE DIFFUSERS)
# Demonstrates Latent Diffusion with Classifier-Free Guidance (CFG) & SDXL
# ============================================================================

import torch
from diffusers import AutoPipelineForText2Image, DPMSolverMultistepScheduler

MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"

# 1. Load SDXL Pipeline with bfloat16 Precision
pipe = AutoPipelineForText2Image.from_pretrained(
    MODEL_ID,
    torch_dtype=torch.bfloat16,
    variant="fp16",
    use_safetensors=True
).to("cuda")

# 2. Use Fast Higher-Order ODE Scheduler (DPM++ 2M Karras)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(
    pipe.scheduler.config,
    use_karras_sigmas=True
)

# 3. Generate Image with Classifier-Free Guidance (CFG = 7.5)
prompt = "Architectural rendering of an eco-futuristic data center in a lush valley, morning mist, photorealistic 8k, cinematic lighting"
negative_prompt = "blurry, low quality, distorted geometry, oversaturated, text watermark"

image = pipe(
    prompt=prompt,
    negative_prompt=negative_prompt,
    guidance_scale=7.5,        # Classifier-Free Guidance (s)
    num_inference_steps=30,    # Denoising steps from t=1000 -> t=0
    height=1024,
    width=1024
).images[0]

image.save("generated_datacenter.png")
print("Diffusion Generation Complete!")
`;
