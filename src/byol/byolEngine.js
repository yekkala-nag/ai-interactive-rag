// ============================================================================
// BOOTSTRAP YOUR OWN LATENT (BYOL) ENGINE
// Self-Supervised Learning without Negative Pairs (DeepMind, Grill et al., 2020)
// ============================================================================

export const SSL_COMPARISON_MATRIX = [
  {
    architecture: "BYOL (DeepMind, 2020)",
    negativePairs: "❌ Not Required",
    targetMechanism: "Target Network updated via Exponential Moving Average (EMA, τ ≈ 0.99)",
    asymmetry: "Online has extra Predictor MLP q_θ; Target has NO Predictor",
    collapsePrevention: "Asymmetric Predictor + Stop-Gradient on Target + Slow EMA updates",
    linearProbeAccuracy: "74.3% (Top-1 ImageNet ImageNet-1k)"
  },
  {
    architecture: "SimCLR (Google, 2020)",
    negativePairs: "✅ Mandatory (Batch Size 4096+)",
    targetMechanism: "Shared identical weights with InfoNCE loss",
    asymmetry: "Symmetric architecture across augmentations",
    collapsePrevention: "Repelled by 4000+ negative pairs per step in InfoNCE loss",
    linearProbeAccuracy: "69.3% (Top-1 ImageNet)"
  },
  {
    architecture: "MoCo v2 (FAIR, 2020)",
    negativePairs: "✅ Mandatory (Queue Size 65536)",
    targetMechanism: "Momentum Encoder with Memory Queue",
    asymmetry: "Memory Bank for negative samples",
    collapsePrevention: "Negative queue contrasts query with memory vectors",
    linearProbeAccuracy: "71.1% (Top-1 ImageNet)"
  },
  {
    architecture: "SwAV (FAIR, 2020)",
    negativePairs: "❌ Soft Cluster Prototypes",
    targetMechanism: "Online Cluster Prototypes & Sinkhorn-Knopp assignment",
    asymmetry: "Swapped prediction across prototypes",
    collapsePrevention: "Equally sized cluster constraints",
    linearProbeAccuracy: "75.3% (Top-1 ImageNet)"
  }
];

export const CALCULATE_BYOL_LOSS = (onlineVec, targetVec) => {
  // L2 normalize vectors
  const norm1 = Math.sqrt(onlineVec.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(targetVec.reduce((sum, val) => sum + val * val, 0));

  const p1 = onlineVec.map(v => v / (norm1 || 1e-8));
  const z2 = targetVec.map(v => v / (norm2 || 1e-8));

  // Cosine Similarity: <p1, z2>
  const cosineSim = p1.reduce((sum, val, i) => sum + val * z2[i], 0);

  // BYOL MSE Loss: 2 - 2 * CosineSimilarity
  const byolLoss = 2 - 2 * cosineSim;

  return {
    cosineSim: cosineSim.toFixed(4),
    byolLoss: byolLoss.toFixed(4),
    normalizedOnline: p1.map(v => v.toFixed(3)),
    normalizedTarget: z2.map(v => v.toFixed(3))
  };
};

export const CALCULATE_EMA_UPDATE = (onlineWeight, targetWeight, tau) => {
  const updatedTarget = tau * targetWeight + (1 - tau) * onlineWeight;
  return {
    tau,
    onlineWeight,
    targetWeight,
    updatedTarget: updatedTarget.toFixed(4)
  };
};

export const PYTORCH_BYOL_CODE = `# ============================================================================
# BOOTSTRAP YOUR OWN LATENT (BYOL) PYTORCH IMPLEMENTATION
# DeepMind (Grill et al., 2020) - Self-Supervised Learning without Negative Pairs
# ============================================================================

import copy
import torch
import torch.nn as nn
import torch.nn.functional as F

class MLP(nn.Module):
    """Projection & Prediction MLP Heads"""
    def __init__(self, in_dim=2048, hidden_dim=4096, out_dim=256):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden_dim),
            nn.BatchNorm1d(hidden_dim),
            nn.ReLU(inplace=True),
            nn.Linear(hidden_dim, out_dim)
        )
    def forward(self, x):
        return self.net(x)

class BYOL(nn.Module):
    def __init__(self, backbone, dim=2048, pred_dim=256, tau=0.99):
        super().__init__()
        self.tau = tau

        # ── 1. Online Network (Trained via Gradient Descent) ──────────────────
        self.online_encoder = backbone
        self.online_projector = MLP(in_dim=dim, hidden_dim=4096, out_dim=pred_dim)
        self.online_predictor = MLP(in_dim=pred_dim, hidden_dim=4096, out_dim=pred_dim)

        # ── 2. Target Network (Updated via Exponential Moving Average) ───────
        self.target_encoder = copy.deepcopy(self.online_encoder)
        self.target_projector = copy.deepcopy(self.online_projector)

        # Stop gradients for Target Network parameters
        for p in self.target_encoder.parameters():
            p.requires_grad = False
        for p in self.target_projector.parameters():
            p.requires_grad = False

    @torch.no_grad()
    def update_target_network(self):
        """EMA Update: xi <- tau * xi + (1 - tau) * theta"""
        for p_online, p_target in zip(self.online_encoder.parameters(), self.target_encoder.parameters()):
            p_target.data = self.tau * p_target.data + (1 - self.tau) * p_online.data
        for p_online, p_target in zip(self.online_projector.parameters(), self.target_projector.parameters()):
            p_target.data = self.tau * p_target.data + (1 - self.tau) * p_online.data

    def regression_loss(self, x, y):
        """L2 normalized Mean Squared Error Loss: 2 - 2 * <x, y>"""
        x = F.normalize(x, dim=-1)
        y = F.normalize(y, dim=-1)
        return 2 - 2 * (x * y).sum(dim=-1)

    def forward_one_direction(self, v1, v2):
        # Online pipeline on view 1
        h_online = self.online_encoder(v1)
        z_online = self.online_projector(h_online)
        p_online = self.online_predictor(z_online)

        # Target pipeline on view 2 (with Stop-Gradient)
        with torch.no_grad():
            h_target = self.target_encoder(v2)
            z_target = self.target_projector(h_target)

        return self.regression_loss(p_online, z_target.detach()).mean()

    def forward(self, v1, v2):
        """Symmetric Loss Evaluation across augmented views v1 and v2"""
        loss1 = self.forward_one_direction(v1, v2)
        loss2 = self.forward_one_direction(v2, v1)
        return (loss1 + loss2) / 2.0

# Example Usage
import torchvision.models as models
resnet = models.resnet50(pretrained=False)
resnet.fc = nn.Identity()  # Strip classification head (output dim 2048)

byol_model = BYOL(backbone=resnet, dim=2048, pred_dim=256, tau=0.99)
v1 = torch.randn(32, 3, 224, 224)  # Augmented View 1
v2 = torch.randn(32, 3, 224, 224)  # Augmented View 2

loss = byol_model(v1, v2)
loss.backward()  # Gradients only update Online Network theta!
byol_model.update_target_network()  # Target Network updated via EMA

print(f"BYOL Loss: {loss.item():.4f}")
`;
