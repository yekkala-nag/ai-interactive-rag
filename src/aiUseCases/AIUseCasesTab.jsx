import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import {
  THREE_USE_CASES_MATRIX,
  SAMPLE_RESUME_PROFILES,
  CALCULATE_COSINE_SIMILARITY,
  PREDICT_LEAD_SCORE,
  PYTHON_AI_USECASES_CODE
} from './aiUseCasesEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

export default function AIUseCasesTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'features' | 'embeddings' | 'scoring'
  const [selectedLeadId, setSelectedLeadId] = useState(1);

  // Lead scoring interactive sliders
  const [yearsExp, setYearsExp] = useState(14);
  const [isITLeader, setIsITLeader] = useState(true);
  const [icpSim, setIcpSim] = useState(0.92);

  const activeLead = SAMPLE_RESUME_PROFILES.find(p => p.id === selectedLeadId) || SAMPLE_RESUME_PROFILES[0];
  const predictedScore = PREDICT_LEAD_SCORE(yearsExp, isITLeader, icpSim);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Enterprise AI Strategy]"
        title="3 AI Use Cases (That Are Not a Chatbot)"
        description="Shaw Talebi's framework for driving tangible business value beyond unpredictable AI chatbots: LLM Feature Engineering, Structuring Unstructured Data via Embeddings, and Predictive Lead Scoring Models."
        metrics={[
          { label: 'Use Case 1', value: 'LLM Feature Extraction' },
          { label: 'Use Case 2', value: 'Vector Embeddings' },
          { label: 'Use Case 3', value: 'Predictive Lead Scoring' },
          { label: 'Cost Savings', value: '100× vs Data Brokers' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <DiagramImage
            src="/assets/ai_use_cases_sales_arch.png"
            alt="3 Enterprise AI Use Cases Beyond Chatbots Diagram"
            title="3 Enterprise AI Sales Architecture Pipeline"
            caption="Overview: 1) LLM Feature Engineering (Text ➔ LLM Extraction ➔ Structured Variables). 2) Structuring Unstructured Data (Text ➔ Embeddings ➔ ICP Cosine Similarity). 3) Predictive Lead Scoring (ML Model ➔ Lead Grades A/B/C/D Priority Queue)."
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
            { id: 'overview', icon: '💡', label: '1. Why Chatbots Aren\'t Enough', desc: 'Predictability & Business ROI' },
            { id: 'features', icon: '⚙️', label: '2. LLM Feature Engineering', desc: 'Extracting variables from text' },
            { id: 'embeddings', icon: '📐', label: '3. Embeddings & ICP Matching', desc: 'Structuring unstructured data' },
            { id: 'scoring', icon: '🎯', label: '4. Predictive Lead Scoring', desc: 'Grading A/B/C/D priority queue' }
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

        {/* ─── SUBTAB 1: OVERVIEW ─── */}
        {activeSubTab === 'overview' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>💡 Moving Beyond the Chatbot Hype</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    While custom AI chatbots are popular, they are inherently unpredictable and prone to hallucinations. Enterprise value is generated by <strong>solving the right business problems</strong> (e.g. automating lead qualification, structuring raw resumes, and scoring opportunities) rather than deploying conversational UIs.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {THREE_USE_CASES_MATRIX.map((uc, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-primary)' }}>
                        {uc.useCase}
                      </strong>
                      <p style={{ fontSize: '11px', color: '#ef4444', margin: '6px 0 4px 0' }}>
                        <strong>Problem:</strong> {uc.problem}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '0 0 4px 0' }}>
                        <strong>AI Solution:</strong> {uc.solution}
                      </p>
                      <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold', marginTop: '4px' }}>
                        Value: {uc.businessValue}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: FEATURE ENGINEERING ─── */}
        {activeSubTab === 'features' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚙️ Use Case 1: LLM Feature Engineering</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Instead of paying $0.10/lead to 3rd-party data brokers or manually reading 100,000 resumes, LLMs extract structured numerical features (Years of Exp, Title, Industry, IT Leader flag) at $0.001/lead.
                  </p>
                </div>

                <Flex gap={2} align="center">
                  <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>Select Lead:</span>
                  {SAMPLE_RESUME_PROFILES.map(lead => (
                    <Button
                      key={lead.id}
                      variant={selectedLeadId === lead.id ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      {lead.name}
                    </Button>
                  ))}
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #3b82f6' }}>
                    <strong style={{ fontSize: '11px', color: '#3b82f6' }}>UNSTRUCTURED RAW RESUME TEXT:</strong>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', marginTop: '6px', color: 'var(--ds-color-text-secondary)', fontStyle: 'italic' }}>
                      "{activeLead.rawResume}"
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ fontSize: '11px', color: '#10b981' }}>LLM EXTRACTED STRUCTURED VARIABLES:</strong>
                    <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: 'var(--ds-radius-sm)', marginTop: '8px', fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                      <div>job_title: "{activeLead.llmExtracted.jobTitle}"</div>
                      <div>years_experience: {activeLead.llmExtracted.yearsExp}</div>
                      <div>industry: "{activeLead.llmExtracted.industry}"</div>
                      <div>is_it_leader: {activeLead.llmExtracted.isITLeader ? 'True (1)' : 'False (0)'}</div>
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: EMBEDDINGS ─── */}
        {activeSubTab === 'embeddings' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📐 Use Case 2: Structuring Unstructured Data via Text Embeddings</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Text embeddings convert raw text into 1536-dimensional vectors. We can mathematically compute Cosine Similarity to compare lead resumes against an Ideal Customer Profile (ICP).
                  </p>
                </div>

                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #8b5cf6' }}>
                  <strong style={{ fontSize: '11px', color: '#8b5cf6' }}>IDEAL CUSTOMER PROFILE (ICP) EMBEDDING REFERENCE:</strong>
                  <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                    "Decision maker VP/Director of IT looking for enterprise cybersecurity & cloud infrastructure SaaS."
                  </div>
                </Card>

                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  {SAMPLE_RESUME_PROFILES.map(lead => (
                    <Card key={lead.id} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{lead.name}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '4px 0' }}>
                        {lead.llmExtracted.jobTitle} ({lead.llmExtracted.industry})
                      </div>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px', borderRadius: 'var(--ds-radius-sm)', marginTop: '6px', fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                        ICP Similarity: <strong style={{ color: lead.icpSimilarity > 0.8 ? '#10b981' : '#ef4444' }}>{lead.icpSimilarity}</strong>
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PREDICTIVE LEAD SCORING ─── */}
        {activeSubTab === 'scoring' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎯 Use Case 3: Predictive Lead Scoring & Grade Priority</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Combine LLM features + Text Embedding similarities in an ML Classifier to predict conversion probability and assign Lead Grades (A, B, C, D) to prioritize sales outreach.
                  </p>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Interactive Lead Parameter Simulator:</strong>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Years Experience ({yearsExp} yrs):</label>
                        <input type="range" min="1" max="25" value={yearsExp} onChange={e => setYearsExp(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>ICP Cosine Similarity ({icpSim}):</label>
                        <input type="range" min="0.1" max="0.99" step="0.01" value={icpSim} onChange={e => setIcpSim(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Is IT Leader?</label>
                        <Button
                          variant={isITLeader ? 'primary' : 'subtle'}
                          size="sm"
                          onClick={() => setIsITLeader(!isITLeader)}
                        >
                          {isITLeader ? '✅ Yes (IT Leader)' : '❌ No (Non-IT)'}
                        </Button>
                      </div>
                    </Grid>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #3b82f6' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>PREDICTED CONVERSION PROBABILITY:</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                          {(predictedScore.score * 100).toFixed(0)}%
                        </div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${predictedScore.color}` }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>ASSIGNED LEAD GRADE:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: predictedScore.color }}>
                          {predictedScore.grade}
                        </div>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>

                <CodeBlock language="python" code={PYTHON_AI_USECASES_CODE} />

                <Callout type="success">
                  <strong>AI Strategy Takeaway:</strong> High-performing AI applications focus on high-leverage workflows like feature extraction, semantic structuring, and predictive scoring rather than just wrapping LLMs in simple chat interfaces.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
