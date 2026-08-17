import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  HOUSE_PRICE_DATASET,
  TARGET_MARK_HOUSE_SIZE,
  CALCULATE_LINE_FIT,
  GENERATE_LOSS_CURVE_DATA,
  GRADIENT_DESCENT_STEP,
  PYTHON_LINEAR_REGRESSION_CODE
} from './linearRegressionEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

export default function LinearRegressionTab() {
  const [activeSubTab, setActiveSubTab] = useState('fitting'); // 'fitting' | 'cost' | 'gradient' | 'code'

  // Line fitting sliders
  const [slopeW, setSlopeW] = useState(130);
  const [interceptB, setInterceptB] = useState(30);

  // Gradient descent stepper state
  const [gdW, setGdW] = useState(0);
  const [gdB, setGdB] = useState(0);
  const [learningRate, setLearningRate] = useState(0.05);
  const [gdStepCount, setGdStepCount] = useState(0);

  const fitResult = CALCULATE_LINE_FIT(slopeW, interceptB);
  const lossCurveData = GENERATE_LOSS_CURVE_DATA(slopeW);
  const gdFitResult = CALCULATE_LINE_FIT(gdW, gdB);

  const handleStepGD = () => {
    const next = GRADIENT_DESCENT_STEP(gdW, gdB, learningRate);
    setGdW(next.nextW);
    setGdB(next.nextB);
    setGdStepCount(prev => prev + 1);
  };

  const handleResetGD = () => {
    setGdW(0);
    setGdB(0);
    setGdStepCount(0);
  };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Machine Learning Foundations]"
        title="Back to Basics: Linear Regression, Cost Function, and Gradient Descent"
        description="Shreya Rao's foundational deep-dive into machine learning optimization: solving Mark's 2,400 sq ft house pricing problem using linear line fitting y_hat = w*x + b, Mean Squared Error (MSE) cost functions, and Gradient Descent optimization."
        metrics={[
          { label: 'Model Type', value: 'Linear Regression' },
          { label: 'Line Equation', value: 'y_hat = w*x + b' },
          { label: 'Cost Metric', value: 'MSE & MAE Loss' },
          { label: 'Optimization', value: 'Gradient Descent' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage
            src="/assets/linear_regression_gradient_descent_arch.png"
            alt="Linear Regression and Gradient Descent Architecture Diagram"
            title="Linear Regression & Cost Function Optimization Pipeline"
            caption="Overview: Left: Scatter plot of house sizes vs prices with linear regression line and residual errors. Middle: Convex loss surface J(w,b) showing Gradient Descent ball descending to global minimum. Right: Equation breakdown for MSE/MAE and weight update rules."
            background="#090d16"
            maxWidth={1050}
          />
        </div>

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
            { id: 'fitting', icon: '🏡', label: '1. House Pricing Line Fitter', desc: 'Slope & intercept line fitting' },
            { id: 'cost', icon: '🧮', label: '2. Cost Function Lab (MSE vs MAE)', desc: 'Parabolic error loss curves' },
            { id: 'gradient', icon: '📉', label: '3. Step-by-Step Gradient Descent', desc: 'Iterative weight update stepper' },
            { id: 'code', icon: '🐍', label: '4. Python & NumPy Engine', desc: 'Production Python code from scratch' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '210px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: LINE FITTING ─── */}
        {activeSubTab === 'fitting' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏡 Mark's 2,400 sq ft House Pricing Problem</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Mark wants to sell his 2,400 sq ft house. Using comparable nearby sales (1,000 sq ft = $170k, 1,500 sq ft = $210k, 2,000 sq ft = $300k), we fit a linear regression line $\hat{y} = w \cdot x + b$ to predict Mark's listing price!
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Slope / Weight w ({slopeW}):</label>
                    <input type="range" min="50" max="200" step="1" value={slopeW} onChange={e => setSlopeW(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Intercept / Bias b ({interceptB}):</label>
                    <input type="range" min="-50" max="150" step="1" value={interceptB} onChange={e => setInterceptB(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </Grid>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #3b82f6' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>MEAN SQUARED ERROR (MSE):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3b82f6' }}>{fitResult.mse}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #8b5cf6' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>MEAN ABSOLUTE ERROR (MAE):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#8b5cf6' }}>{fitResult.mae}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>MARK'S 2,400 SQ FT PREDICTED PRICE:</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>${fitResult.markPredPrice}k</div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: COST FUNCTION ─── */}
        {activeSubTab === 'cost' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Cost Functions: Mean Squared Error (MSE) vs Mean Absolute Error (MAE)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    A Cost Function quantifies how "bad" a line fits the dataset. <strong>MAE</strong> computes (1/N) * sum(|y - y_hat|), while <strong>MSE</strong> squares residuals (1/N) * sum((y - y_hat)^2), penalizing large errors much more aggressively.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #3b82f6' }}>
                    <strong style={{ fontSize: '13px', color: '#3b82f6' }}>Mean Absolute Error (MAE):</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0 0 0' }}>
                      Calculates the average magnitude of absolute residuals. Provides linear penalties without heavily skewing for single extreme outliers.
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>Mean Squared Error (MSE):</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0 0 0' }}>
                      Calculates average squared residuals. Produces a smooth convex parabola $J(w, b)$, making mathematical derivative gradient descent updates clean and tractable.
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: GRADIENT DESCENT ─── */}
        {activeSubTab === 'gradient' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📉 Step-by-Step Gradient Descent Optimizer</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Instead of guessing weights via brute force, Gradient Descent takes partial derivative steps along the loss gradient nabla J(w, b) with learning rate alpha: w_(t+1) = w_t - alpha * (dJ/dw).
                  </p>
                </div>

                <Flex gap={3} align="center">
                  <Button variant="primary" size="sm" onClick={handleStepGD}>
                    ▶️ Step Gradient Descent (+1 Iteration)
                  </Button>
                  <Button variant="subtle" size="sm" onClick={handleResetGD}>
                    🔄 Reset Weights to (0, 0)
                  </Button>
                  <Badge variant="subtle">Total Steps: {gdStepCount}</Badge>
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CURRENT WEIGHT w (SLOPE):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3b82f6' }}>{gdW}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CURRENT BIAS b (INTERCEPT):</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#8b5cf6' }}>{gdB}</div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CURRENT MSE LOSS:</strong>
                    <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>{gdFitResult.mse}</div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PYTHON CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 Production Python & NumPy Implementation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete Python implementation of Linear Regression, Mean Squared Error (MSE), Mean Absolute Error (MAE), and Gradient Descent optimization from scratch.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_LINEAR_REGRESSION_CODE} />

                <Callout type="success">
                  <strong>Key Takeaway:</strong> Linear Regression and Gradient Descent form the foundation for all modern Machine Learning and Deep Learning optimization algorithms, including backpropagation in modern Deep Neural Networks.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
