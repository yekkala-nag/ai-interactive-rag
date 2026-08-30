import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  IO_FORMATS_BENCHMARK,
  CALCULATE_IO_SAVINGS,
  PYTHON_MODERN_IO_SCRIPT
} from './ioFormatEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function ModernIOTab() {
  const [activeSubTab, setActiveSubTab] = useState('benchmark'); 
  // 'benchmark' | 'calculator' | 'pushdown' | 'code'

  // Calculator State
  const [datasetSizeGb, setDatasetSizeGb] = useState(50);
  const [dailyQueries, setDailyQueries] = useState(300);

  const savings = CALCULATE_IO_SAVINGS(datasetSizeGb, dailyQueries);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Modern Data Engineering & I/O]"
        title="Fast Data I/O: Goodbye CSV, Hello Parquet, Arrow & DuckDB"
        description="Stop wasting compute and hours waiting on single-threaded `pd.read_csv()` and `pd.to_csv()`. Explore why serialized text CSVs bottleneck modern data pipelines, how columnar Apache Parquet and Arrow achieve 30x faster reads with 8x compression, and how DuckDB queries disk files directly with zero RAM explosion."
        metrics={[
          { label: 'Speedup Factor', value: '25x - 30x Faster Reads' },
          { label: 'Storage Savings', value: '85%+ Compression (Snappy/ZSTD)' },
          { label: 'Predicate Pushdown', value: 'Scan Only Required Row Groups' },
          { label: 'Engine Stack', value: 'Parquet + Polars + DuckDB' }
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
            { id: 'benchmark', icon: '⚡', label: '1. Benchmark Comparison', desc: 'CSV vs Parquet vs Arrow vs DuckDB' },
            { id: 'calculator', icon: '💰', label: '2. I/O Savings Calculator', desc: 'Hours saved & disk compression' },
            { id: 'pushdown', icon: '🔍', label: '3. Predicate Pushdown Lab', desc: 'Columnar disk filtering mechanics' },
            { id: 'code', icon: '🛠️', label: '4. Polars & DuckDB Code', desc: 'Production lazy evaluation scripts' }
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

        {/* ─── SUBTAB 1: BENCHMARK COMPARISON ─── */}
        {activeSubTab === 'benchmark' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Comprehensive 10-Million Row I/O Benchmark Matrix</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Comparing reading speed, write throughput, disk storage footprint, and RAM utilization on a 10M-row financial transactions dataset.
                  </p>
                </div>

                <div style={{ overflowX: 'auto', background: '#090d16', padding: '14px', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'monospace' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th style={{ textAlign: 'left', padding: '8px', color: 'var(--ds-color-text-tertiary)' }}>Storage & Format Engine</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#38BDF8' }}>Read Time</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#38BDF8' }}>Write Time</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#10b981' }}>File Size</th>
                        <th style={{ textAlign: 'center', padding: '8px', color: '#a78bfa' }}>RAM Footprint</th>
                        <th style={{ textAlign: 'left', padding: '8px', color: '#F5A623' }}>Predicate Pushdown</th>
                      </tr>
                    </thead>
                    <tbody>
                      {IO_FORMATS_BENCHMARK.map((b, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', background: b.format.includes('DuckDB') || b.format.includes('Parquet') ? 'rgba(16,185,129,0.06)' : 'transparent' }}>
                          <td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{b.format}</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: b.readTimeSec > 5 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                            {b.readTimeSec}s
                          </td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#38BDF8' }}>{b.writeTimeSec}s</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#10b981' }}>{b.fileSizeMb} MB</td>
                          <td style={{ padding: '8px', textAlign: 'center', color: '#a78bfa' }}>{b.memoryUsageMb} MB</td>
                          <td style={{ padding: '8px', color: b.predicatePushdown.includes('Yes') ? '#10b981' : '#ef4444' }}>
                            {b.predicatePushdown.split(' ')[0]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Callout type="info">
                  <strong>Why is CSV so slow?</strong> CSV is an unindexed text stream. Pandas must inspect every comma, escape quotes, and run type-inference heuristics for every cell. Parquet stores data in binary typed column chunks, skipping unneeded columns completely!
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: I/O SAVINGS CALCULATOR ─── */}
        {activeSubTab === 'calculator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💰 Enterprise Storage & Engineering Hours Saved Calculator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Estimate how much cloud S3 storage costs and data engineering compute time you save by migrating from CSV to Parquet/Arrow.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Raw CSV Dataset Size (GB):
                    </label>
                    <input
                      type="number"
                      value={datasetSizeGb}
                      onChange={e => setDatasetSizeGb(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Daily Pipeline Queries / Reads:
                    </label>
                    <input
                      type="number"
                      value={dailyQueries}
                      onChange={e => setDailyQueries(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '8px', fontSize: '12px' }}
                    />
                  </div>
                </Grid>

                {/* SAVINGS STATS */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <Card style={{ padding: '16px', background: '#090d16', borderTop: '3px solid #10b981' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>DEVELOPER WAIT TIME SAVED</div>
                    <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>
                      {savings.hoursSavedPerDay} Hours / day
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: '#090d16', borderTop: '3px solid #38BDF8' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CLOUD DISK STORAGE SAVED</div>
                    <div style={{ fontSize: '20px', color: '#38BDF8', fontWeight: 'bold', marginTop: '4px' }}>
                      {savings.storageSavedGb} GB (-88%)
                    </div>
                  </Card>

                  <Card style={{ padding: '16px', background: '#090d16', borderTop: '3px solid #F5A623' }}>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>THROUGHPUT MULTIPLIER</div>
                    <div style={{ fontSize: '20px', color: '#F5A623', fontWeight: 'bold', marginTop: '4px' }}>
                      {savings.speedupFactor}x Faster
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: PREDICATE PUSHDOWN LAB ─── */}
        {activeSubTab === 'pushdown' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔍 How Columnar Storage & Predicate Pushdown Works</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why Parquet skips 95% of disk reads before data ever touches CPU cache or Python memory.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
                    <strong style={{ fontSize: '13px', color: '#ef4444', display: 'block', marginBottom: '6px' }}>
                      ROW-ORIENTED CSV SCAN:
                    </strong>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#f87171', marginBottom: '8px' }}>
                      Row 1: [ID: 1, User: "Alice", Amount: 20, Date: "2026-01-01", ...]<br/>
                      Row 2: [ID: 2, User: "Bob", &nbsp;&nbsp;Amount: 95, Date: "2026-01-02", ...]
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Even if you only want <code>sum(Amount)</code> for VIPs, the CPU must parse every column (User, Date, Notes) on every single line across gigabytes of text.
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981', display: 'block', marginBottom: '6px' }}>
                      PARQUET COLUMNAR CHUNK SCAN:
                    </strong>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#34d399', marginBottom: '8px' }}>
                      Metadata Header: [RowGroup 1: Amount Min: 10, Max: 100]<br/>
                      Chunk Amount: [20, 95, 120, 50, ...] (Snappy Compressed)
                    </div>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Parquet reads the metadata header, checks min/max stats, skips entire row groups that don't match the filter, and reads <em>only</em> the target column!
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
                  <h3 style={{ margin: 0 }}>🛠️ Production Polars, Parquet & DuckDB Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable data engineering pipeline replacing legacy pandas CSV calls with high-performance lazy scanning and zero-copy SQL.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTHON_MODERN_IO_SCRIPT} />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
