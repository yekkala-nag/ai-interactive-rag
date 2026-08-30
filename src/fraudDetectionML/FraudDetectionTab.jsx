import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  SIX_FRAUD_MODELS,
  CALCULATE_COST_MATRIX,
  PYTHON_FRAUD_COST_OPTIMIZER_SCRIPT
} from './fraudEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function FraudDetectionTab() {
  const [activeSubTab, setActiveSubTab] = useState('models'); 
  // 'models' | 'costmatrix' | 'productiongap' | 'code'

  // Threshold slider state
  const [threshold, setThreshold] = useState(0.22);
  const costFP = 50;
  const costFN = 500;

  const simResult = CALCULATE_COST_MATRIX(threshold, costFP, costFN, 100000);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Production Machine Learning]"
        title="Production ML: 6 Fraud Models & The Metrics vs Production Gap"
        description="Explore the critical gap between theoretical ML evaluation scores (AUC-ROC, F1) and real-world production deployment decisions. Understand why the #1 scoring model on paper (CatBoost) was rejected due to strict 15ms latency SLAs and why LightGBM won the production banking slot."
        metrics={[
          { label: 'Models Evaluated', value: '6 Algorithms (Logistic to NN)' },
          { label: 'Bank Gateway SLA', value: '< 15ms p99 Latency' },
          { label: 'Production Winner', value: 'LightGBM (4.8ms / 0.976 AUC)' },
          { label: 'Cost Asymmetry', value: 'False Negative is 10x Cost of FP' }
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
            { id: 'models', icon: '🤖', label: '1. 6 Models Comparison', desc: 'AUC vs Latency vs Memory matrix' },
            { id: 'costmatrix', icon: '💰', label: '2. Cost-Sensitive Optimizer', desc: 'Threshold tuning: $50 FP vs $500 FN' },
            { id: 'productiongap', icon: '🏛️', label: '3. The 4 Production Pillars', desc: 'Latency, SHAP, drift & cold start' },
            { id: 'code', icon: '🛠️', label: '4. LightGBM & SHAP Code', desc: 'Production cost matrix script' }
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

        {/* ─── SUBTAB 1: 6 MODELS COMPARISON MATRIX ─── */}
        {activeSubTab === 'models' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🤖 Benchmark Matrix: 6 Models Evaluated on Bank Transaction Stream</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Notice how CatBoost had the highest offline AUROC (0.984), but its 22ms latency caused it to be rejected in favor of LightGBM (4.8ms).
                  </p>
                </div>

                <div style={{ overflowX: 'auto', background: '#090d16', padding: '14px', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ textAlign: 'left', padding: '8px', color: 'var(--ds-color-text-tertiary)' }}>Model Name</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#38BDF8' }}>AUROC</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#38BDF8' }}>F1 Score</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#F5A623' }}>p99 Latency</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#a78bfa' }}>Memory</th>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#10b981' }}>Production Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SIX_FRAUD_MODELS.map((m, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: m.productionStatus.includes('SELECTED') ? 'rgba(16,185,129,0.08)' : 'transparent' }}>
                          <td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{m.name}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#38BDF8' }}>{m.offlineAuroc.toFixed(3)}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#38BDF8' }}>{m.f1Score.toFixed(3)}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: m.latencyMs > 15 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                            {m.latencyMs} ms {m.latencyMs > 15 ? '⚠️' : '✓'}
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#a78bfa' }}>{m.memoryMb} MB</td>
                          <td style={{ padding: '8px', color: m.productionStatus.includes('SELECTED') ? '#10b981' : m.productionStatus.includes('Rejected') ? '#ef4444' : '#F5A623' }}>
                            {m.productionStatus}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Callout type="info">
                  <strong>The Engineering Insight:</strong> In high-frequency payment gateways, every extra millisecond of latency increases payment drop-off rates by 0.1%. A 0.008 AUROC gain is worthless if it breaches the gateway SLA!
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: COST-SENSITIVE OPTIMIZER ─── */}
        {activeSubTab === 'costmatrix' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💰 Interactive Cost-Sensitive Decision Threshold Tuner</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Standard ML courses use an arbitrary 0.5 probability threshold. In finance, False Negatives (Stolen Funds = $500 loss) are 10x more expensive than False Positives (Blocked Card Support = $50). Drag the slider to find the cost-optimal operating point.
                  </p>
                </div>

                {/* THRESHOLD SLIDER */}
                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8' }}>
                      Decision Threshold (P_thresh): {threshold.toFixed(2)}
                    </strong>
                    <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)' }}>
                      Total Financial Loss: ${simResult.totalCost.toLocaleString()}
                    </Badge>
                  </Flex>

                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.01"
                    value={threshold}
                    onChange={e => setThreshold(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />

                  <Flex justify="space-between" style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                    <span>0.05 (Aggressive: Catch all fraud, many false alarms)</span>
                    <span>0.22 (Optimal Sweet Spot: Minimized Total Cost)</span>
                    <span>0.95 (Conservative: High fraud slippage)</span>
                  </Flex>
                </Card>

                {/* SIMULATED METRICS */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #10b981' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>TRUE POSITIVES (BLOCKED FRAUD)</div>
                    <div style={{ fontSize: '16px', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>{simResult.tp} cases</div>
                  </Card>

                  <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #ef4444' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>FALSE NEGATIVES (MISSED FRAUD)</div>
                    <div style={{ fontSize: '16px', color: '#ef4444', fontWeight: 'bold', marginTop: '4px' }}>
                      {simResult.fn} (${simResult.costFN.toLocaleString()})
                    </div>
                  </Card>

                  <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #F5A623' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>FALSE POSITIVES (ANNOYED USERS)</div>
                    <div style={{ fontSize: '16px', color: '#F5A623', fontWeight: 'bold', marginTop: '4px' }}>
                      {simResult.fp} (${simResult.costFP.toLocaleString()})
                    </div>
                  </Card>

                  <Card style={{ padding: '12px', background: '#090d16', borderTop: '3px solid #38BDF8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>FRAUD RECALL RATE</div>
                    <div style={{ fontSize: '16px', color: '#38BDF8', fontWeight: 'bold', marginTop: '4px' }}>
                      {(simResult.recall * 100).toFixed(1)}%
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: THE 4 PRODUCTION PILLARS ─── */}
        {activeSubTab === 'productiongap' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🏛️ The 4 Non-Metric Pillars of Production ML</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why enterprise ML pipelines reject high-scoring kaggle models in favor of governed, low-latency microservices.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8' }}>1. Strict Latency SLA (&lt; 15ms)</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      Payment gateways like Stripe, Visa, and Flutterwave have hard timeout budgets. Models requiring heavy deep learning or large tree ensembles cause timeout spikes.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>2. Regulatory Explainability (SHAP)</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      Central banks and compliance auditors mandate exact reason codes when a transaction or loan is denied. TreeSHAP provides mathematically guaranteed attribution.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
                    <strong style={{ fontSize: '13px', color: '#F5A623' }}>3. Memory Footprint Under Load</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      Random Forest models with thousands of deep trees consume hundreds of megabytes per worker process, crashing Kubernetes pods during traffic spikes.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #a78bfa' }}>
                    <strong style={{ fontSize: '13px', color: '#a78bfa' }}>4. Concept Drift & Adversarial Adaptation</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      Fraud syndicates adapt tactics weekly. LightGBM allows rapid retraining on daily transaction increments in minutes without expensive GPU clusters.
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production LightGBM & TreeSHAP Code</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Production script for cost-matrix threshold optimization and real-time decline reason code generation.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_FRAUD_COST_OPTIMIZER_SCRIPT} />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
