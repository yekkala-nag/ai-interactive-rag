import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import {
  PIPELINE_STEPS,
  SAMPLE_TASKS_DATABASE,
  GENERATE_HTML_TRIAGE_REPORT_PREVIEW,
  BASH_WORKTREE_ORCHESTRATION_SCRIPT
} from './claudeCode100Engine.js';

const { Container, Grid, Flex, Stack } = Primitives;

export default function ClaudeCode100Tab() {
  const [activeSubTab, setActiveSubTab] = useState('pipeline'); 
  // 'pipeline' | 'triage' | 'worktree' | 'reports' | 'scripts'

  // Task selection for verification testing
  const [selectedTaskId, setSelectedTaskId] = useState('LIN-101');
  const activeTask = SAMPLE_TASKS_DATABASE.find(t => t.id === selectedTaskId) || SAMPLE_TASKS_DATABASE[0];

  const htmlReport = GENERATE_HTML_TRIAGE_REPORT_PREVIEW(SAMPLE_TASKS_DATABASE);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agent Systems & Frameworks [High-Velocity Agentic Engineering]"
        title="Solving 100+ Tasks with Claude Code & Sub-Agents"
        description="Industrialize your coding agent workflow to solve dozens of micro-tasks per day. Master daily time-boxed sessions, Upfront Task Bifurcation (Micro vs Mega tasks), Git Worktree sub-agent isolation to eliminate merge collisions, and automated HTML pre-flight and 30-second verification reports."
        metrics={[
          { label: 'Daily Throughput', value: '50-100+ Micro-Tasks' },
          { label: 'Isolation Method', value: 'git worktree sub-agents' },
          { label: 'Bifurcation Rule', value: 'Quick-fix vs Upfront Handoff' },
          { label: 'Human Verification', value: '30-second HTML checklist' }
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
            { id: 'pipeline', icon: '🚀', label: '1. The 6-Stage Daily Pipeline', desc: 'Ingestion to 30-sec verification' },
            { id: 'triage', icon: '⚖️', label: '2. Triage & Task Bifurcation', desc: 'Autonomous fixes vs upfront handoff' },
            { id: 'worktree', icon: '🌲', label: '3. Git Worktree Sub-Agents', desc: 'Zero collision parallel isolation' },
            { id: 'reports', icon: '📋', label: '4. HTML Verification Reports', desc: 'Pre-flight & post-flight checklists' },
            { id: 'scripts', icon: '🛠️', label: '5. CLI & Automation Scripts', desc: 'Production bash worktree orchestration' }
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

        {/* ─── SUBTAB 1: 6-STAGE DAILY PIPELINE ─── */}
        {activeSubTab === 'pipeline' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🚀 The 6-Stage Daily High-Volume Coding Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Why top engineers use time-boxed daily sessions and sub-agent orchestration instead of firing 50 chaotic, uncoordinated coding windows.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {PIPELINE_STEPS.map((st) => (
                    <Card key={st.step} style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderTop: '3px solid #38BDF8' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: '13px', color: '#38BDF8' }}>{st.title}</strong>
                        <span style={{ fontSize: '16px' }}>{st.icon}</span>
                      </Flex>

                      <div style={{ background: '#090d16', padding: '6px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace', color: '#10b981', marginBottom: '8px' }}>
                        {st.channel}
                      </div>

                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                        {st.description}
                      </p>
                    </Card>
                  ))}
                </Grid>

                <Callout type="info">
                  <strong>The Velocity Paradox:</strong> When coding effort drops toward zero, product feedback multiplies 10x. Managing 100 small tasks daily requires a systematic pipeline — without structure, context window pollution and merge conflicts will bottleneck your team.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: TRIAGE & TASK BIFURCATION ─── */}
        {activeSubTab === 'triage' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ Pre-Flight Triage & The Bifurcation Rule</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Never let large, ambiguous architectural refactors contaminate your main daily fast-fix session. Bifurcate immediately via Upfront Handoff.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#10b981' }}>TYPE A: AUTONOMOUS SUB-AGENT TASKS</strong>
                      <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.2)' }}>Direct to Dev</Badge>
                    </Flex>
                    <Stack gap={2} style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                      <div>• CSS layout fixes, mobile responsive tweaks, color adjustments.</div>
                      <div>• Adding export buttons, CSV downloaders, table column re-ordering.</div>
                      <div>• Fixing localized bug exceptions with clear Sentry stack traces.</div>
                      <div>• Straightforward API endpoint updates with clear Pydantic schemas.</div>
                      <div style={{ color: '#10b981', fontWeight: 'bold', marginTop: '6px' }}>➔ Spawns a parallel git worktree sub-agent and commits to dev.</div>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '16px', background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#F5A623' }}>TYPE B: UPFRONT HANDOFF (MEGA TASKS)</strong>
                      <Badge variant="subtle" style={{ color: '#F5A623', background: 'rgba(245,166,35,0.2)' }}>Dedicated Thread</Badge>
                    </Flex>
                    <Stack gap={2} style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                      <div>• Multi-tenant database migrations or schema alterations.</div>
                      <div>• Core Auth/SSO overhauls requiring credential setup.</div>
                      <div>• Ambiguous user stories requiring product manager design interviews.</div>
                      <div>• Deep multi-repo or multi-service architectural refactorings.</div>
                      <div style={{ color: '#F5A623', fontWeight: 'bold', marginTop: '6px' }}>➔ Agent creates a structured handoff document; worked on in a dedicated interactive session.</div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: GIT WORKTREE ISOLATION ─── */}
        {activeSubTab === 'worktree' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🌲 Git Worktree Sub-Agent Isolation Architecture</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    How <code>git worktree</code> enables 10+ sub-agents to check out different branches simultaneously from a single local git repository with zero file locking or merge thrashing.
                  </p>
                </div>

                <Card style={{ padding: '18px', background: '#090d16', border: '1px solid #38BDF8' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#38BDF8', lineHeight: '1.8' }}>
                    [MAIN REPOSITORY ROOT]  (Branch: dev / main)<br/>
                    &nbsp;&nbsp;│<br/>
                    &nbsp;&nbsp;├── 📁 ../worktrees/LIN-101 ➔ [Sub-Agent A] (Fix mobile pricing toggle)<br/>
                    &nbsp;&nbsp;├── 📁 ../worktrees/LIN-103 ➔ [Sub-Agent B] (Add CSV export button)<br/>
                    &nbsp;&nbsp;├── 📁 ../worktrees/LIN-104 ➔ [Sub-Agent C] (Fix DB pool leak)<br/>
                    &nbsp;&nbsp;└── 📁 ../worktrees/LIN-107 ➔ [Sub-Agent D] (Update auth webhook)<br/>
                  </div>
                </Card>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981', display: 'block', marginBottom: '6px' }}>
                      WHY GIT WORKTREES WIN OVER CLONES:
                    </strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Unlike creating 10 full <code>git clone</code> directories (which wastes gigabytes of disk and duplicate .git history), worktrees share the same underlying object database. Creating a new worktree takes under <strong>100 milliseconds</strong>!
                    </p>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #38BDF8' }}>
                    <strong style={{ fontSize: '13px', color: '#38BDF8', display: 'block', marginBottom: '6px' }}>
                      AUTOMATIC CLEANUP ON MERGE:
                    </strong>
                    <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                      Once the sub-agent tests its code and pushes to <code>dev</code>, the worktree directory is automatically removed via <code>git worktree remove</code>, keeping your development machine pristine.
                    </p>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: HTML VERIFICATION REPORTS ─── */}
        {activeSubTab === 'reports' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📋 The 30-Second Verification HTML Report</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Instead of navigating the web app manually to verify fixes, the agent generates an interactive HTML report containing verbatim user feedback and direct deep-links to the exact test screens.
                  </p>
                </div>

                {/* TASK SELECTOR */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SAMPLE_TASKS_DATABASE.map((t) => (
                    <Button
                      key={t.id}
                      variant={selectedTaskId === t.id ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedTaskId(t.id)}
                    >
                      {t.id}: {t.title.slice(0, 30)}...
                    </Button>
                  ))}
                </div>

                {/* VERIFICATION CARD */}
                <Card style={{ padding: '16px', background: '#090d16', border: '1px solid #10b981' }}>
                  <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                    <strong style={{ fontSize: '13px', color: '#10b981' }}>
                      VERIFICATION CHECKLIST FOR [{activeTask.id}]
                    </strong>
                    <Badge variant="subtle" style={{ color: '#10b981', background: 'rgba(16,185,129,0.15)' }}>
                      Status: {activeTask.status}
                    </Badge>
                  </Flex>

                  <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                    Task: {activeTask.title}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>VERBATIM SOURCE ISSUE:</div>
                  <div style={{ background: '#161e2e', padding: '8px 12px', borderRadius: '4px', color: '#38BDF8', fontSize: '12px', fontFamily: 'monospace', marginBottom: '10px' }}>
                    "{activeTask.notes}"
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>DEEP-LINK TEST URL (ONE CLICK):</div>
                  <div style={{ background: '#161e2e', padding: '8px 12px', borderRadius: '4px', color: '#10b981', fontSize: '12px', fontFamily: 'monospace', marginBottom: '10px' }}>
                    <a href={activeTask.testUrl} target="_blank" rel="noreferrer" style={{ color: '#10b981', textDecoration: 'underline' }}>
                      {activeTask.testUrl}
                    </a>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="primary" size="sm">
                      ✅ Mark Verified & Deploy to Prod
                    </Button>
                    <Button variant="secondary" size="sm">
                      🔄 Request Revision / Add Feedback
                    </Button>
                  </div>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: CLI & AUTOMATION SCRIPTS ─── */}
        {activeSubTab === 'scripts' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Bash Worktree Orchestration Script</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Copy-pasteable bash script to automate worktree provisioning, Claude Code sub-agent execution, test validation, and automatic worktree cleanup.
                  </p>
                </div>

                <CodeBlock language="bash" code={BASH_WORKTREE_ORCHESTRATION_SCRIPT} />

                <Callout type="success">
                  <strong>Production Best Practice:</strong> Combine this bash script with Linear webhooks to spin up isolated worktrees automatically whenever a ticket is tagged <code>agent:ready</code>!
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
