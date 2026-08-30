import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  PROFILING_TOOL_TIERS,
  OPTIMIZATION_BENCHMARK_CASES,
  PYTHON_PROFILING_PIPELINE_SCRIPT
} from './profilingEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function PythonProfilingTab() {
  const [activeSubTab, setActiveSubTab] = useState('benchmarks'); 
  // 'benchmarks' | 'tools' | 'flamechart' | 'code'

  // Benchmark case selector
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const activeCase = OPTIMIZATION_BENCHMARK_CASES[selectedCaseIdx];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Python Performance Engineering]"
        title="Think Your Python Code Is Slow? Stop Guessing, Start Measuring"
        description="Master systematic Python profiling and performance engineering. Avoid the trap of premature optimization by measuring deterministic execution hot paths using cProfile, visualizing interactive call stacks with SnakeViz, drilling down with line_profiler, and eliminating 300x algorithmic bottlenecks."
        metrics={[
          { label: 'Golden Rule', value: 'Stop Guessing, Start Measuring' },
          { label: 'Function Profiler', value: 'cProfile + SnakeViz' },
          { label: 'Line Profiler', value: 'line_profiler (@profile)' },
          { label: 'Vectorization Gain', value: 'Up to 2,950x Speedup' }
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
            { id: 'benchmarks', icon: '⚡', label: '1. Optimization Benchmarks', desc: 'Vectorization vs naive loops' },
            { id: 'tools', icon: '🛠️', label: '2. 4-Tier Profiler Stack', desc: 'cProfile, SnakeViz, Scalene' },
            { id: 'flamechart', icon: '🔥', label: '3. Call Tree & Flame Chart', desc: 'Visualizing tottime vs cumtime' },
            { id: 'code', icon: '💻', label: '4. Profiling Python Recipes', desc: 'cProfile & dump_stats scripts' }
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

        {/* ─── SUBTAB 1: OPTIMIZATION BENCHMARKS ─── */}
        {activeSubTab === 'benchmarks' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Measured Performance Bottlenecks & Fixes</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Select an anti-pattern to see the measured time difference between naive Python and vectorized/optimized code.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {OPTIMIZATION_BENCHMARK_CASES.map((c, idx) => (
                    <Button
                      key={c.id}
                      variant={selectedCaseIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedCaseIdx(idx)}
                    >
                      {c.title}
                    </Button>
                  ))}
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#ef4444' }}>❌ NAIVE PYTHON CODE</strong>
                      <Badge variant="subtle" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.2)' }}>
                        {activeCase.naiveTimeMs.toLocaleString()} ms
                      </Badge>
                    </Flex>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#f87171', marginBottom: '8px' }}>
                      {activeCase.naiveMethod}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      <strong>Root Cause:</strong> {activeCase.rootCause}
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#10b981' }}>✅ PROFILED & OPTIMIZED</strong>
                      <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.2)' }}>
                        {activeCase.optimizedTimeMs.toLocaleString()} ms ({activeCase.speedup})
                      </Badge>
                    </Flex>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#34d399', marginBottom: '8px' }}>
                      {activeCase.optimizedMethod}
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Leverages C-speed vector buffers and contiguous memory layouts to avoid per-element Python interpreter overhead.
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: 4-TIER PROFILER STACK ─── */}
        {activeSubTab === 'tools' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ The 4-Tier Python Performance Diagnostic Stack</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Choosing the right measuring instrument for functions, call trees, lines of code, and memory leaks.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {PROFILING_TOOL_TIERS.map((t, idx) => (
                    <Card key={idx} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: '13px', color: '#38BDF8' }}>{t.tool}</strong>
                        <Badge variant="outline">{t.overhead}</Badge>
                      </Flex>

                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '6px' }}>
                        Scope: {t.scope}
                      </div>

                      <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#10b981', marginBottom: '8px' }}>
                        Output: {t.output}
                      </div>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        🎯 <strong>Best For:</strong> {t.bestFor}
                      </p>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: FLAME CHART & METRICS ─── */}
        {activeSubTab === 'flamechart' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔥 Understanding cProfile Metrics: tottime vs cumtime</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How to interpret standard Python profiler tables without getting confused by wrapper functions.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8' }}>1. tottime (Total Internal Time)</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      The total time spent <strong>strictly inside this function itself</strong>, excluding any sub-functions or external helpers it calls. High <code>tottime</code> highlights CPU-heavy inner calculations.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>2. cumtime (Cumulative Time)</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                      The total time spent in this function <strong>plus all sub-functions called from it</strong>. High <code>cumtime</code> but low <code>tottime</code> means the function is a high-level orchestrator calling a slow helper.
                    </p>
                  </Card>
                </Grid>

                <Callout type="info">
                  <strong>SnakeViz Tip:</strong> Run <code>snakeviz my_profile.prof</code> in terminal. It renders an interactive SVG sunburst chart where slice arc width corresponds to <code>cumtime</code>, allowing instant visual discovery of the exact bottleneck function in 5 seconds!
                </Callout>
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
                  <h3 style={{ margin: 0 }}>💻 Production cProfile & SnakeViz Profiling Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable boilerplates for profiling any Python pipeline and dumping stats for browser visualization.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_PROFILING_PIPELINE_SCRIPT} />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
