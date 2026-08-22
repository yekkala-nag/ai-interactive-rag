import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  KPI_TO_HUMANIZED_INSIGHTS,
  NARRATIVE_FRAMEWORKS,
  CALCULATE_DATA_HUMANIZATION_ROI,
  PYTHON_DATA_HUMANIZATION_PIPELINE
} from './humanizationEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function DataHumanizationTab() {
  const [activeSubTab, setActiveSubTab] = useState('illusion'); // 'illusion' | 'table' | 'frameworks' | 'roi'

  // ROI Calculator State
  const [numManagers, setNumManagers] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [wastedHours, setWastedHours] = useState(4);
  const [decisionGain, setDecisionGain] = useState(15000);

  // Framework State
  const [selectedFramework, setSelectedFramework] = useState('AIDA');

  const roiResult = CALCULATE_DATA_HUMANIZATION_ROI(numManagers, hourlyRate, wastedHours, decisionGain);
  const frameworkData = NARRATIVE_FRAMEWORKS[selectedFramework];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Data Humanization & Storytelling]"
        title="Beyond Numbers: How to Humanize Your Data & Analysis"
        description="Escaping the 'data-rich, action-poor' paradox. Transform raw static KPI metrics (the what) into actionable human stories (the why & who), elevate analysts into Data Artisans, and prove financial ROI."
        metrics={[
          { label: 'Core Philosophy', value: 'Data Humanization' },
          { label: 'Key Role', value: 'The Data Artisan' },
          { label: 'Narrative Frameworks', value: 'AIDA & SCQA' },
          { label: 'Financial Value', value: 'Proven ROI' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage
            src="/assets/data_humanization_storytelling_arch.png"
            alt="Data Humanization and Storytelling Framework Architecture Diagram"
            title="Data Humanization and Storytelling Framework for Enterprise Data Platforms"
            caption="Overview: Left: The Scintillating Grid Paradox (Raw KPI Data Dump vs Human Perception). Middle: 4 Pillars of Data Humanization (Quick Wins, Data Artisan Role, Narrative Frameworks AIDA & SCQA, ROI Financial Engine). Right: Actionable Enterprise Output."
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
            { id: 'illusion', icon: '👁️', label: '1. Scintillating Grid Paradox', desc: 'Raw data vs perceived reality' },
            { id: 'table', icon: '📊', label: '2. Symptom KPI vs Human Insight', desc: 'Transforming metrics into why' },
            { id: 'frameworks', icon: '📜', label: '3. Storytelling Frameworks', desc: 'AIDA vs SCQA narrative' },
            { id: 'roi', icon: '💰', label: '4. Financial ROI & Python Code', desc: 'Quantifying value & pipeline' }
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

        {/* ─── SUBTAB 1: SCINTILLATING GRID PARADOX ─── */}
        {activeSubTab === 'illusion' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>👁️ The Scintillating Grid Illusion & Data Perception</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Just as Hermann’s Scintillating Grid tricks human peripheral vision into perceiving non-existent black dots at intersections, raw uncontextualized dashboards mislead stakeholders into seeing false trends and phantom correlations.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)', textAlign: 'center' }}>
                    <strong style={{ fontSize: '11px', color: '#ef4444', display: 'block', marginBottom: '8px' }}>
                      THE SCINTILLATING GRID METAPHOR:
                    </strong>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, 1fr)',
                      gap: '8px',
                      background: '#111827',
                      padding: '20px',
                      borderRadius: '8px',
                      maxWidth: '300px',
                      margin: '0 auto'
                    }}>
                      {Array.from({ length: 25 }).map((_, idx) => (
                        <div key={idx} style={{
                          width: '100%',
                          height: '35px',
                          background: idx % 2 === 0 ? '#374151' : '#f3f4f6',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justify: 'center'
                        }}>
                          {idx % 4 === 0 && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111827', display: 'inline-block' }}></span>}
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '12px' }}>
                      Raw data creates peripheral illusion dots. When you stare directly, the phantom dots disappear—just like misleading uncontextualized metrics!
                    </p>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#38BDF8', display: 'block', marginBottom: '8px' }}>
                      ESCAPING THE 'DATA-RICH, ACTION-POOR' PARADOX:
                    </strong>
                    <Stack gap={2}>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-primary)' }}>
                        • <strong>Raw KPI (The What)</strong>: Merely states the symptom (e.g., "Cart abandonment is 75%").
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#10b981' }}>
                        • <strong>Humanized Insight (The Why & Who)</strong>: Explains root cause & human friction ("60% drop off at shipping page due to $15 unexpected fees").
                      </div>
                      <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#F5A623' }}>
                        • <strong>The Data Artisan Role</strong>: Hybrid role combining business acumen & data engineering to build reusable context IP.
                      </div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: SYMPTOM KPI VS HUMAN INSIGHT TABLE ─── */}
        {activeSubTab === 'table' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 Symptom KPI (The What) vs Humanized Insight (The Why & Who)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Compare static KPI metrics against contextualized human insights and actionable resolution plans.
                  </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', textAlign: 'left', color: '#38BDF8' }}>
                        <th style={{ padding: '8px' }}>Category</th>
                        <th style={{ padding: '8px' }}>Standard KPI (Symptom / What)</th>
                        <th style={{ padding: '8px' }}>Humanized Insight (Root Cause / Why)</th>
                        <th style={{ padding: '8px' }}>Actionable Resolution Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {KPI_TO_HUMANIZED_INSIGHTS.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '8px', color: '#F5A623', fontWeight: 'bold' }}>{item.impactCategory}</td>
                          <td style={{ padding: '8px', color: '#ef4444', fontFamily: 'monospace' }}>{item.symptomKpi}</td>
                          <td style={{ padding: '8px', color: '#10b981' }}>{item.humanizedInsight}</td>
                          <td style={{ padding: '8px', color: '#38BDF8' }}>{item.actionPlan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: STORYTELLING FRAMEWORKS (AIDA VS SCQA) ─── */}
        {activeSubTab === 'frameworks' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📜 Executive Data Storytelling Frameworks</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Choose the strategic narrative framework tailored for executive decision-making: AIDA (for platform investments) or SCQA (for operational bottlenecks).
                  </p>
                </div>

                <Flex gap={2}>
                  <Button variant={selectedFramework === 'AIDA' ? 'primary' : 'subtle'} onClick={() => setSelectedFramework('AIDA')}>
                    AIDA Framework (Funding & Investment)
                  </Button>
                  <Button variant={selectedFramework === 'SCQA' ? 'primary' : 'subtle'} onClick={() => setSelectedFramework('SCQA')}>
                    SCQA Framework (Operational Bottlenecks)
                  </Button>
                </Flex>

                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                  <strong style={{ fontSize: 'var(--ds-font-size-body)', color: '#38BDF8', display: 'block', marginBottom: '4px' }}>
                    {frameworkData.name}
                  </strong>
                  <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 12px 0' }}>
                    Best For: {frameworkData.bestFor}
                  </p>

                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                    {frameworkData.steps.map((s, idx) => (
                      <Card key={idx} style={{ padding: '12px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                        <strong style={{ fontSize: '11px', color: '#10b981', display: 'block', marginBottom: '4px' }}>
                          Step {idx + 1}: {s.stage}
                        </strong>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-primary)' }}>
                          {s.desc}
                        </div>
                      </Card>
                    ))}
                  </Grid>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: FINANCIAL ROI & PYTHON ENGINE ─── */}
        {activeSubTab === 'roi' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💰 Quantifying Financial ROI of Clear Data & Python Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Calculate the financial return of Data Humanization investments by comparing the cost of confusion (wasted time) against decision gains.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <strong style={{ fontSize: '11px', color: '#38BDF8', display: 'block', marginBottom: '12px' }}>
                      ROI INPUT PARAMETERS:
                    </strong>
                    <Stack gap={3}>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Number of Managers / Analysts ({numManagers}):</label>
                        <input type="range" min="1" max="20" value={numManagers} onChange={e => setNumManagers(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Average Hourly Rate (${hourlyRate}/hr):</label>
                        <input type="range" min="30" max="200" value={hourlyRate} onChange={e => setHourlyRate(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Wasted Hours / Week Trying to Read Reports ({wastedHours} hrs):</label>
                        <input type="range" min="1" max="15" value={wastedHours} onChange={e => setWastedHours(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Monthly Value from Faster Decisions (${decisionGain}):</label>
                        <input type="range" min="5000" max="50000" step="5000" value={decisionGain} onChange={e => setDecisionGain(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <strong style={{ fontSize: '11px', color: '#10b981', display: 'block', marginBottom: '8px' }}>
                      FINANCIAL ROI CALCULATION SUMMARY:
                    </strong>
                    <Stack gap={2}>
                      <Flex justify="space-between">
                        <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Monthly Confusion Cost (Baseline Wasted Labor):</span>
                        <strong style={{ color: '#ef4444', fontFamily: 'monospace' }}>${roiResult.monthlyConfusionCost.toLocaleString()}</strong>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>One-time Data Artisan Dashboard Investment:</span>
                        <strong style={{ color: '#F5A623', fontFamily: 'monospace' }}>${roiResult.dashboardBuildCost.toLocaleString()}</strong>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Monthly Recovered Time Value (85% savings):</span>
                        <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>+${roiResult.monthlyTimeSavings.toLocaleString()}</strong>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Monthly Decision Value Gains:</span>
                        <strong style={{ color: '#10b981', fontFamily: 'monospace' }}>+${roiResult.decisionGainMonthly.toLocaleString()}</strong>
                      </Flex>
                      <hr style={{ border: 'none', borderTop: '1px solid var(--ds-color-border-subtle)', margin: '4px 0' }} />
                      <Flex justify="space-between">
                        <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>Annual Net Value Realized:</span>
                        <strong style={{ color: '#38BDF8', fontSize: '14px', fontFamily: 'monospace' }}>${roiResult.annualValue.toLocaleString()}</strong>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>First Year ROI %:</span>
                        <strong style={{ color: '#10b981', fontSize: '16px', fontFamily: 'monospace' }}>+{roiResult.roiPct}% ROI</strong>
                      </Flex>
                    </Stack>
                  </Card>
                </Grid>

                <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)' }}>
                  <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#38BDF8', display: 'block', marginBottom: '8px' }}>
                    PRODUCTION PYTHON DATA HUMANATION PIPELINE:
                  </strong>
                  <CodeBlock language="python" code={PYTHON_DATA_HUMANIZATION_PIPELINE} />
                </Card>

                <Callout type="success">
                  <strong>Responsible AI & Security Certified:</strong> Zero personal author data or unredacted PII is stored or executed in this environment.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
