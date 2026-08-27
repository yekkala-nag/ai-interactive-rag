import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  DIFFUSION_STEPS_SIMULATION,
  DIFFUSION_ARCHITECTURAL_PARADIGMS,
  CALCULATE_CFG_PREDICTION,
  PYTHON_DIFFUSERS_SCRIPT
} from './diffusionEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function DiffusionTab() {
  const [activeSubTab, setActiveSubTab] = useState('denoising'); 
  // 'denoising' | 'paradigms' | 'cfg' | 'math' | 'code'

  // Step simulator state (0 to 1000)
  const [currentTimestep, setCurrentTimestep] = useState(500);

  // CFG state
  const [cfgScale, setCfgScale] = useState(7.5);
  const cfgResult = CALCULATE_CFG_PREDICTION(0.2, 0.8, cfgScale);

  // Find closest step data
  const stepData = DIFFUSION_STEPS_SIMULATION.reduce((prev, curr) => 
    Math.abs(curr.step - currentTimestep) < Math.abs(prev.step - currentTimestep) ? curr : prev
  );

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="frontiers_production"
        moduleLabel="Production & Frontiers [Diffusion Models & Generative Media]"
        title="How Diffusion Models Work: From Noise to High-Fidelity Media"
        description="Master the mathematics and system architecture of modern generative image and video models. Explore the Forward Markov noise process, the Reverse Score-Matching denoising loop, Classifier-Free Guidance (CFG), Latent Diffusion Models (LDM), and Diffusion Transformers (DiT)."
        metrics={[
          { label: 'Core Mechanism', value: 'Iterative Denoising Score Matching' },
          { label: 'State-of-the-Art Backbone', value: 'DiT (Diffusion Transformers)' },
          { label: 'Latent Compression', value: '8x via VAE Encoders' },
          { label: 'Sampling Trajectory', value: 'Flow Matching & ODE Solvers' }
        ]}
      />

      <Container size="wide">
        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'denoising', icon: '🎨', label: '1. Denoising Process Simulator', desc: 'Timestep t=1000 to t=0 trajectory' },
            { id: 'paradigms', icon: '⚡', label: '2. Architectures & DiT', desc: 'LDM vs DiT vs Flow Matching' },
            { id: 'cfg', icon: '🎯', label: '3. Classifier-Free Guidance', desc: 'Prompt adherence vs diversity' },
            { id: 'math', icon: '🧮', label: '4. Mathematical Formulation', desc: 'Markov chains & loss function' },
            { id: 'code', icon: '🛠️', label: '5. Diffusers PyTorch Code', desc: 'SDXL & DPM++ solver pipeline' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '180px',
                padding: 'var(--ds-space-3) var(--ds-space-3)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: '11px', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: DENOISING PROCESS SIMULATOR ─── */}
        {activeSubTab === 'denoising' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎨 Interactive Reverse Denoising Process (t = 1000 ➔ 0)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Drag the slider across the reverse diffusion timeline. See how the neural network progressively subtracts predicted Gaussian noise epsilon_theta(x_t, t) to reveal the clean image x_0.
                  </p>
                </div>

                {/* TIMESTEP SLIDER */}
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8' }}>
                      Diffusion Timestep (t): {currentTimestep} / 1000
                    </strong>
                    <Badge variant="subtle" style={{ color: currentTimestep > 500 ? '#ef4444' : '#10b981', background: currentTimestep > 500 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)' }}>
                      Noise Level: {((currentTimestep / 1000) * 100).toFixed(0)}%
                    </Badge>
                  </Flex>

                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={currentTimestep}
                    onChange={e => setCurrentTimestep(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />

                  <Flex justify="space-between" style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                    <span>t=0 (Clean Image x_0)</span>
                    <span>t=500 (Structure Emergence)</span>
                    <span>t=1000 (Pure Noise x_T)</span>
                  </Flex>
                </Card>

                {/* VISUAL STATE BOX & STAGES */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid #38BDF8', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
                      SIMULATED LATENT REPRESENTATION STATE:
                    </div>
                    <div
                      style={{
                        height: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        background: currentTimestep > 800
                          ? 'repeating-radial-gradient(circle, #334155 0, #090d16 8px)'
                          : currentTimestep > 400
                          ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                          : 'linear-gradient(135deg, #0284c7, #10b981)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        padding: '12px'
                      }}
                    >
                      <div>{stepData.visualState}</div>
                      <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px', fontWeight: 'normal' }}>
                        Alpha Cumulative Product (alpha_bar_t): {stepData.alphaBar}
                      </div>
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981', display: 'block', marginBottom: '8px' }}>
                      WHAT HAPPENS AT THIS TIMESTEP:
                    </strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '10px' }}>
                      {stepData.desc}
                    </p>
                    <div style={{ fontSize: '11px', color: '#F5A623' }}>
                      💡 <strong>Mathematical Update:</strong> The model does not generate pixels directly; it predicts the exact noise tensor <code>epsilon_theta</code> added to the clean latent, subtracting it with the noise scheduler rule.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: ARCHITECTURAL PARADIGMS & DIT ─── */}
        {activeSubTab === 'paradigms' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Architectural Evolution: Pixel ➔ LDM ➔ DiT ➔ Flow Matching</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How Generative AI media models transitioned from heavy pixel U-Nets to scalable Diffusion Transformers and linear vector fields.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {DIFFUSION_ARCHITECTURAL_PARADIGMS.map((par) => (
                    <Card key={par.id} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#38BDF8' }}>{par.name}</strong>
                      </Flex>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '6px' }}>
                        {par.paper}
                      </div>

                      <div style={{ background: '#090d16', padding: '6px 10px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#10b981', marginBottom: '8px' }}>
                        Domain: {par.space} | Cost: {par.computeCost}
                      </div>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        {par.desc}
                      </p>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: CLASSIFIER-FREE GUIDANCE (CFG) ─── */}
        {activeSubTab === 'cfg' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎯 Classifier-Free Guidance (CFG): Controlling Prompt Adherence</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    CFG runs two forward passes at every denoising step: one conditioned on the prompt and one unconditionally (empty prompt). The difference vector is scaled by guidance scale <code>s</code>.
                  </p>
                </div>

                {/* CFG SLIDER */}
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '13px', color: '#F5A623' }}>
                      Guidance Scale (s): {cfgScale.toFixed(1)}
                    </strong>
                    <Badge variant="subtle" style={{ color: '#F5A623', background: 'rgba(245,166,35,0.15)' }}>
                      Formula: eps_uncond + s * (eps_cond - eps_uncond)
                    </Badge>
                  </Flex>

                  <input
                    type="range"
                    min="1.0"
                    max="20.0"
                    step="0.5"
                    value={cfgScale}
                    onChange={e => setCfgScale(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />

                  <Flex justify="space-between" style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                    <span>s = 1.0 (No Guidance / High Diversity)</span>
                    <span>s = 7.5 (Standard Production Sweet Spot)</span>
                    <span>s = 20.0 (Oversaturated / Deep Fried)</span>
                  </Flex>
                </Card>

                {/* CFG IMPACT OUTPUT */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid #F5A623' }}>
                    <strong style={{ fontSize: '12px', color: '#F5A623', display: 'block', marginBottom: '8px' }}>
                      CALCULATED GUIDED NOISE VECTOR:
                    </strong>
                    <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'white', lineHeight: '1.8' }}>
                      Unconditioned Score (eps_null): {cfgResult.uncondScore}<br/>
                      Text-Conditioned Score (eps_prompt): {cfgResult.textCondScore}<br/>
                      Difference Direction Vector: +0.60<br/>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>Final Extrapolated Score: {cfgResult.guidedScore}</span>
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '12px', color: '#38BDF8', display: 'block', marginBottom: '8px' }}>
                      IMAGE QUALITY & SATURATION ASSESSMENT:
                    </strong>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'white', marginBottom: '6px' }}>
                      Status: <strong>{cfgResult.saturationRisk}</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                      Setting s too high forces contrast amplification, blowing out skin tones and introducing neon color halos. Modern architectures (Flux, SD3) use <em>Prompt-Weighted CFG</em> to eliminate oversaturation artifacts.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: MATHEMATICAL FORMULATIONS ─── */}
        {activeSubTab === 'math' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Mathematical Foundations of Diffusion & Score Matching</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Core stochastic differential equations governing forward noise corruption and reverse score-based denoising.
                  </p>
                </div>

                <Stack gap={3}>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8' }}>1. Forward Diffusion Markov Chain (Closed-Form Sampling)</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"q(x_t | x_0) = N(x_t; sqrt(alpha_bar_t) * x_0, (1 - alpha_bar_t) * I)"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Allows sampling any noisy state x_t directly at arbitrary timestep t in a single operation without computing all intermediate steps x_1, ..., x_{`{t-1}`}.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>2. Simplified Denoising Training Objective (L_simple)</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"L_simple(theta) = E_{t, x_0, epsilon} [ || epsilon - epsilon_theta(sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * epsilon, t) ||^2 ]"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      The training loss is simply the Mean Squared Error (MSE) between the ground truth noise vector epsilon and the neural network's predicted noise vector epsilon_theta.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
                    <strong style={{ fontSize: '13px', color: '#F5A623' }}>3. Classifier-Free Guidance Equation</strong>
                    <div style={{ padding: '8px 12px', background: '#090d16', color: '#10b981', fontFamily: 'monospace', fontSize: '12px', margin: '6px 0' }}>
                      {"tilde{epsilon}_theta(x_t, c) = epsilon_theta(x_t, null) + s * (epsilon_theta(x_t, c) - epsilon_theta(x_t, null))"}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Extrapolates in the gradient direction pointing toward the conditioned prompt c away from the unconditional empty prompt null.
                    </p>
                  </Card>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: PYTORCH DIFFUSERS CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production PyTorch Diffusers & SDXL Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable production script utilizing bfloat16 mixed precision, DPM-Solver++ fast ODE scheduler, and classifier-free guidance.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_DIFFUSERS_SCRIPT} />

                <Callout type="success">
                  <strong>Production Tip:</strong> Replace standard Euler scheduler with <code>DPMSolverMultistepScheduler(use_karras_sigmas=True)</code> to reduce required sampling steps from 50 steps down to 20–25 steps with zero perceptual quality degradation.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
