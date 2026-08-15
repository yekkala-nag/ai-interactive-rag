import { useState } from 'react';
import { CodeBlock } from './Content.jsx';
import { Container, Section, Grid, Flex, Stack } from '../layout/Primitives.jsx';
import { Card, Badge, Button, Callout } from './Core.jsx';
import { getModuleColors } from '../../design-system/tokens.js';

export function LangChainVsLangGraphComparison() {
  const [activeDiff, setActiveDiff] = useState(0);
  const [activeCodeTab, setActiveCodeTab] = useState('langchain');

  const differences = [
    {
      id: 0,
      title: 'Pipeline vs Loops',
      tagline: 'Linear Chaining vs Cyclic Graph State Machines',
      langchainDesc: 'LangChain follows a pipeline abstraction: data moves in one direction through chained components. While you can branch and run steps in parallel, the default is forward-only data flow.',
      langgraphDesc: 'LangGraph treats loops as first-class citizens in the workflow. Nodes can route back to earlier nodes using conditional edges, enabling cyclic flows without external loop management.',
      whenToUseLc: 'Use LangChain for linear, predictable workflows like standard RAG, summarization, or simple extraction.',
      whenToUseLg: 'Use LangGraph for workflows requiring feedback loops, iterative refinement, or complex decision cycles like coding agents or planning systems.',
      diagram: (
        <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%', minHeight: '160px' }}>
          {/* LangChain Pipeline */}
          <rect x="10" y="8" width="30" height="18" rx="4" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="1.2"/>
          <text x="25" y="19" textAnchor="middle" fill="#4a9a4a" fontSize="7" fontWeight="bold">Prompt</text>
          <line x1="40" y1="17" x2="50" y2="17" stroke="#4a9a4a" strokeWidth="1.2" markerEnd="url(#arrow-0-1)"/>
          <rect x="50" y="8" width="30" height="18" rx="4" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="1.2"/>
          <text x="65" y="19" textAnchor="middle" fill="#4a9a4a" fontSize="7" fontWeight="bold">Model</text>
          <line x1="80" y1="17" x2="90" y2="17" stroke="#4a9a4a" strokeWidth="1.2" markerEnd="url(#arrow-0-2)"/>
          
          {/* LangGraph Cyclic */}
          <rect x="10" y="34" width="25" height="18" rx="4" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="1.2"/>
          <text x="22.5" y="45" textAnchor="middle" fill="#2a7a9c" fontSize="7" fontWeight="bold">Agent Node</text>
          <line x1="35" y1="43" x2="65" y2="43" stroke="#2a7a9c" strokeWidth="1.2" markerEnd="url(#arrow-0-3)"/>
          <rect x="65" y="34" width="25" height="18" rx="4" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="1.2"/>
          <text x="77.5" y="45" textAnchor="middle" fill="#2a7a9c" fontSize="7" fontWeight="bold">Tools Node</text>
          <path d="M 77.5 34 C 77.5 24, 22.5 24, 22.5 34" fill="none" stroke="#2a7a9c" strokeWidth="1.2" strokeDasharray="3,2" markerEnd="url(#arrow-0-4)"/>
          
          <defs>
            <marker id="arrow-0-1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
            </marker>
            <marker id="arrow-0-2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
            </marker>
            <marker id="arrow-0-3" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
            </marker>
            <marker id="arrow-0-4" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
            </marker>
          </defs>
        </svg>
      )
    },
    {
      id: 1,
      title: 'Stateless vs Stateful',
      tagline: 'Isolated Runnables vs Managed Graph State Schemas',
      langchainDesc: 'Each LangChain runnable is stateless — it receives an input dict and returns an output dict. Cross-turn state must be manually managed and passed between components.',
      langgraphDesc: 'LangGraph creates stateful agents where state is part of the graph itself. You define a state schema (TypedDict) and nodes perform partial updates that are automatically reduced and merged.',
      whenToUseLc: 'Use LangChain when each step only needs the previous step\'s result and you don\'t need to maintain complex state across iterations.',
      whenToUseLg: 'Use LangGraph when you need to track conversation history, validation errors, retry counts, or other state that evolves throughout the workflow.',
      diagram: (
        <svg viewBox="0 0 100 70" style={{ width: '100%', height: '100%', minHeight: '160px' }}>
          {/* Stateless - LangChain */}
          <text x="25" y="10" textAnchor="middle" fill="#4a9a4a" fontSize="6.5" fontWeight="bold">LangChain (Stateless)</text>
          <rect x="5" y="14" width="40" height="10" rx="2" fill="#4a9a4a15" stroke="#4a9a4a" strokeWidth="1"/>
          <text x="25" y="21" textAnchor="middle" fill="#4a9a4a" fontSize="5.5">Runnable 1: in → out</text>
          <line x1="25" y1="24" x2="25" y2="28" stroke="#4a9a4a" strokeWidth="1" markerEnd="url(#arrow-1-1)"/>
          <rect x="5" y="28" width="40" height="10" rx="2" fill="#4a9a4a15" stroke="#4a9a4a" strokeWidth="1"/>
          <text x="25" y="35" textAnchor="middle" fill="#4a9a4a" fontSize="5.5">Runnable 2: in → out</text>
          <line x1="25" y1="38" x2="25" y2="42" stroke="#4a9a4a" strokeWidth="1" markerEnd="url(#arrow-1-2)"/>
          <rect x="5" y="42" width="40" height="10" rx="2" fill="#4a9a4a15" stroke="#4a9a4a" strokeWidth="1"/>
          <text x="25" y="49" textAnchor="middle" fill="#4a9a4a" fontSize="5.5">Runnable 3: in → out</text>
          
          {/* Stateful - LangGraph */}
          <text x="75" y="10" textAnchor="middle" fill="#2a7a9c" fontSize="6.5" fontWeight="bold">LangGraph (Stateful)</text>
          <rect x="53" y="14" width="44" height="48" rx="4" fill="#2a7a9c10" stroke="#2a7a9c" strokeWidth="1.2"/>
          <text x="75" y="22" textAnchor="middle" fill="#2a7a9c" fontSize="6" fontWeight="bold">AgentState (Schema)</text>
          <text x="56" y="30" fontSize="4.5" fill="#64748b">• messages: [Human, AI]</text>
          <text x="56" y="37" fontSize="4.5" fill="#64748b">• iterations: 3</text>
          <text x="56" y="44" fontSize="4.5" fill="#64748b">• tool_calls: [...]</text>
          <rect x="56" y="48" width="38" height="11" rx="2" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="0.8"/>
          <text x="75" y="55" textAnchor="middle" fill="#2a7a9c" fontSize="4.5" fontWeight="bold">Auto-Merged State Reducer</text>
          
          <defs>
            <marker id="arrow-1-1" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#4a9a4a" />
            </marker>
            <marker id="arrow-1-2" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#4a9a4a" />
            </marker>
          </defs>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Human-in-the-Loop (HITL)',
      tagline: 'Custom App Pause/Resume vs Built-in Graph Interrupts',
      langchainDesc: 'With LangChain, implementing human-in-the-loop requires building custom pause/resume mechanics into the surrounding web application — saving proposals to a DB, waiting for approval, then reconstructing prompt context.',
      langgraphDesc: 'LangGraph provides native interrupt() primitives inside nodes that automatically pause graph execution, snapshot state to disk/Postgres, and resume effortlessly when the human reviews and submits.',
      whenToUseLc: 'Use LangChain when you don\'t need human approval checkpoints or can implement simple manual approval flows outside the chain.',
      whenToUseLg: 'Use LangGraph for workflows requiring formal human approval steps like database migrations, financial transactions, or production deployments.',
      diagram: (
        <svg viewBox="0 0 100 65" style={{ width: '100%', height: '100%', minHeight: '160px' }}>
          {/* LangChain Manual HITL */}
          <text x="25" y="10" textAnchor="middle" fill="#4a9a4a" fontSize="6.5" fontWeight="bold">LangChain (Manual)</text>
          <rect x="5" y="15" width="40" height="10" rx="2" fill="#4a9a4a15" stroke="#4a9a4a" strokeWidth="1"/>
          <text x="25" y="22" textAnchor="middle" fill="#4a9a4a" fontSize="5">Run until proposal</text>
          <line x1="25" y1="25" x2="25" y2="30" stroke="#4a9a4a" strokeWidth="1" markerEnd="url(#arrow-2-1)"/>
          <rect x="5" y="30" width="40" height="12" rx="2" fill="#fef3c7" stroke="#d97706" strokeWidth="1" strokeDasharray="2,2"/>
          <text x="25" y="38" textAnchor="middle" fill="#d97706" fontSize="4.5">[External App DB Pause]</text>
          <line x1="25" y1="42" x2="25" y2="47" stroke="#4a9a4a" strokeWidth="1" markerEnd="url(#arrow-2-2)"/>
          <rect x="5" y="47" width="40" height="10" rx="2" fill="#4a9a4a15" stroke="#4a9a4a" strokeWidth="1"/>
          <text x="25" y="54" textAnchor="middle" fill="#4a9a4a" fontSize="5">Reconstruct context</text>
          
          {/* LangGraph Built-in HITL */}
          <text x="75" y="10" textAnchor="middle" fill="#2a7a9c" fontSize="6.5" fontWeight="bold">LangGraph (Built-in)</text>
          <rect x="55" y="15" width="40" height="10" rx="2" fill="#2a7a9c15" stroke="#2a7a9c" strokeWidth="1.2"/>
          <text x="75" y="22" textAnchor="middle" fill="#2a7a9c" fontSize="5">Execute Graph</text>
          <line x1="75" y1="25" x2="75" y2="30" stroke="#2a7a9c" strokeWidth="1.2" markerEnd="url(#arrow-2-3)"/>
          <rect x="55" y="30" width="40" height="12" rx="2" fill="#7c3aed15" stroke="#7c3aed" strokeWidth="1.2"/>
          <text x="75" y="38" textAnchor="middle" fill="#7c3aed" fontSize="5" fontWeight="bold">interrupt(&#123;action: "Run?"&#125;)</text>
          <line x1="75" y1="42" x2="75" y2="47" stroke="#2a7a9c" strokeWidth="1.2" markerEnd="url(#arrow-2-4)"/>
          <rect x="55" y="47" width="40" height="10" rx="2" fill="#2a7a9c15" stroke="#2a7a9c" strokeWidth="1.2"/>
          <text x="75" y="54" textAnchor="middle" fill="#2a7a9c" fontSize="5">Auto-Resume Node</text>
          
          <defs>
            <marker id="arrow-2-1" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#4a9a4a" />
            </marker>
            <marker id="arrow-2-2" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#4a9a4a" />
            </marker>
            <marker id="arrow-2-3" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#2a7a9c" />
            </marker>
            <marker id="arrow-2-4" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#2a7a9c" />
            </marker>
          </defs>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Restarts vs Checkpointed Resume',
      tagline: 'Re-running Entire Chains vs Checkpointed Node Recovery',
      langchainDesc: 'When a step fails in LangChain, the standard recovery is to re-run the entire chain from the beginning, repeating all previous successful steps and incurring their token costs again.',
      langgraphDesc: 'LangGraph includes persistent checkpointers (MemorySaver, PostgresSaver) that snapshot the graph state after each step. On failure, you resume from the latest checkpoint rather than restarting from scratch.',
      whenToUseLc: 'Use LangChain for short, inexpensive workflows where restarting from failure is acceptable.',
      whenToUseLg: 'Use LangGraph for long-running, expensive workflows where re-executing successful steps would be wasteful (e.g., multi-step research, complex agent tasks).',
      diagram: (
        <svg viewBox="0 0 100 60" style={{ width: '100%', height: '100%', minHeight: '160px' }}>
          {/* Restart - LangChain */}
          <text x="25" y="10" textAnchor="middle" fill="#4a9a4a" fontSize="6.5" fontWeight="bold">LangChain: Restart on Fail</text>
          <rect x="5" y="14" width="9" height="10" rx="1" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="0.8"/>
          <text x="9.5" y="21" textAnchor="middle" fill="#4a9a4a" fontSize="4.5">S1</text>
          <rect x="16" y="14" width="9" height="10" rx="1" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="0.8"/>
          <text x="20.5" y="21" textAnchor="middle" fill="#4a9a4a" fontSize="4.5">S2</text>
          <rect x="27" y="14" width="9" height="10" rx="1" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="0.8"/>
          <text x="31.5" y="21" textAnchor="middle" fill="#4a9a4a" fontSize="4.5">S3</text>
          <rect x="38" y="14" width="9" height="10" rx="1" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8"/>
          <text x="42.5" y="21" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">FAIL</text>
          <path d="M 42.5 24 C 42.5 32, 9.5 32, 9.5 24" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" markerEnd="url(#arrow-3-1)"/>
          <text x="25" y="36" textAnchor="middle" fill="#ef4444" fontSize="4.5">Restart All from 0</text>
          
          {/* Resume - LangGraph */}
          <text x="75" y="10" textAnchor="middle" fill="#2a7a9c" fontSize="6.5" fontWeight="bold">LangGraph: Checkpointed Resume</text>
          <rect x="55" y="14" width="9" height="10" rx="1" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="0.8"/>
          <text x="59.5" y="21" textAnchor="middle" fill="#2a7a9c" fontSize="4.5">S1</text>
          <rect x="66" y="14" width="9" height="10" rx="1" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="0.8"/>
          <text x="70.5" y="21" textAnchor="middle" fill="#2a7a9c" fontSize="4.5">S2</text>
          <rect x="77" y="14" width="9" height="10" rx="1" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="0.8"/>
          <text x="81.5" y="21" textAnchor="middle" fill="#2a7a9c" fontSize="4.5">S3</text>
          <rect x="88" y="14" width="9" height="10" rx="1" fill="#ef4444" stroke="#dc2626" strokeWidth="0.8"/>
          <text x="92.5" y="21" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">FAIL</text>
          <path d="M 92.5 24 C 92.5 30, 81.5 30, 81.5 24" fill="none" stroke="#2a7a9c" strokeWidth="1.2" markerEnd="url(#arrow-3-2)"/>
          <text x="75" y="36" textAnchor="middle" fill="#2a7a9c" fontSize="4.5" fontWeight="bold">Resume from Checkpoint 3</text>
          
          <defs>
            <marker id="arrow-3-1" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-3-2" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
              <path d="M0,0 L0,5 L5,2.5 z" fill="#2a7a9c" />
            </marker>
          </defs>
        </svg>
      )
    }
  ];

  const currentDiff = differences.find(d => d.id === activeDiff) || differences[0];

  return (
    <Container size="normal" style={{ paddingTop: 'var(--ds-space-4)', paddingBottom: 'var(--ds-space-8)' }}>
      {/* Header Banner */}
      <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(74, 154, 74, 0.08) 0%, rgba(42, 122, 156, 0.08) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Badge variant="primary" size="sm">Framework Comparison</Badge>
          <span style={{ fontSize: '0.8rem', color: 'var(--ds-color-text-tertiary)' }}>LangChain Ecosystem vs LangGraph Stateful Graphs</span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '4px 0 8px 0', color: 'var(--ds-color-text-primary)' }}>
          LangChain vs LangGraph: Architectural Deep Dive
        </h1>
        <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.95rem', maxWidth: '850px', lineHeight: 1.5, margin: 0 }}>
          A practical engineering comparison between linear composable chains (LCEL) and stateful, cyclic multi-agent graph state machines.
        </p>
      </Section>

      {/* 4 Key Differences Interactive Explorer */}
      <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)' }}>
        <Section.Header>
          <h2 style={{ fontSize: 'var(--ds-font-size-h3)', marginBottom: 'var(--ds-space-1)' }}>
            4 Key Architectural Differences
          </h2>
          <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem' }}>
            Click an architectural dimension below to inspect execution flows and diagrams.
          </p>
        </Section.Header>

        <Section.Body>
          {/* Sub-Tabs Selector */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--ds-space-4)' }}>
            {differences.map(d => (
              <button
                key={d.id}
                onClick={() => setActiveDiff(d.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--ds-radius-md)',
                  border: activeDiff === d.id ? '2px solid #2563eb' : '1px solid var(--ds-color-border-default)',
                  background: activeDiff === d.id ? 'rgba(37, 99, 235, 0.1)' : 'var(--ds-color-bg-surface)',
                  color: activeDiff === d.id ? '#2563eb' : 'var(--ds-color-text-primary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{d.id === 0 ? '🔄' : d.id === 1 ? '🧠' : d.id === 2 ? '👤' : '💾'}</span>
                <span>{d.title}</span>
              </button>
            ))}
          </div>

          {/* Active Difference Content Grid */}
          <Grid columns={{ base: '1fr', lg: '1.1fr 0.9fr' }} gap="var(--ds-space-6)" align="start">
            <div>
              <div style={{ marginBottom: 'var(--ds-space-4)' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#2563eb', letterSpacing: '0.05em' }}>
                  {currentDiff.tagline}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 12px 0' }}>
                  {currentDiff.title}
                </h3>
              </div>

              {/* LangChain Block */}
              <div style={{
                background: 'var(--ds-color-bg-surface)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderLeft: '4px solid #4a9a4a',
                borderRadius: 'var(--ds-radius-md)',
                padding: 'var(--ds-space-4)',
                marginBottom: 'var(--ds-space-4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🦜</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4a9a4a', margin: 0 }}>
                    LangChain Pipeline Approach
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  {currentDiff.langchainDesc}
                </p>
                <div style={{ background: 'rgba(74, 154, 74, 0.08)', borderRadius: 'var(--ds-radius-sm)', padding: '8px 12px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#4a9a4a' }}>When to pick: </strong>
                  <span style={{ color: 'var(--ds-color-text-primary)' }}>{currentDiff.whenToUseLc}</span>
                </div>
              </div>

              {/* LangGraph Block */}
              <div style={{
                background: 'var(--ds-color-bg-surface)',
                border: '1px solid var(--ds-color-border-subtle)',
                borderLeft: '4px solid #2a7a9c',
                borderRadius: 'var(--ds-radius-md)',
                padding: 'var(--ds-space-4)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🕸️</span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2a7a9c', margin: 0 }}>
                    LangGraph Stateful Graph Approach
                  </h4>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                  {currentDiff.langgraphDesc}
                </p>
                <div style={{ background: 'rgba(42, 122, 156, 0.08)', borderRadius: 'var(--ds-radius-sm)', padding: '8px 12px', fontSize: '0.8rem' }}>
                  <strong style={{ color: '#2a7a9c' }}>When to pick: </strong>
                  <span style={{ color: 'var(--ds-color-text-primary)' }}>{currentDiff.whenToUseLg}</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Diagram Card */}
            <div style={{
              background: '#0f172a',
              border: '1px solid var(--ds-color-border-default)',
              borderRadius: 'var(--ds-radius-lg)',
              padding: 'var(--ds-space-4)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Execution Flow Architecture
                </span>
                <Badge variant="primary" size="sm">Interactive</Badge>
              </div>
              <div style={{ width: '100%', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentDiff.diagram}
              </div>
            </div>
          </Grid>
        </Section.Body>
      </Section>

      {/* When to Choose Which Framework Grid */}
      <Section variant="bordered" style={{ marginBottom: 'var(--ds-space-6)' }}>
        <Section.Header>
          <h2 style={{ fontSize: 'var(--ds-font-size-h3)', marginBottom: 'var(--ds-space-1)' }}>
            Decision Criteria: When to Pick Which Framework
          </h2>
          <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem' }}>
            Practical rule of thumb for engineering teams.
          </p>
        </Section.Header>

        <Section.Body>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <Callout type="success" title="Choose LangChain When:">
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '0.82rem', lineHeight: 1.6 }}>
                <li>Building linear, unidirectional pipelines (e.g. standard Retrieve → Generate)</li>
                <li>Rapid prototyping and early exploration of prompt templates and retrievers</li>
                <li>Workflows have minimal branching or cyclic feedback loops</li>
                <li>Stateless microservices where request/response lifecycle is short</li>
                <li>Zero need for persistent checkpointing or mid-execution human approvals</li>
              </ul>
            </Callout>

            <Callout type="info" title="Choose LangGraph When:">
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '18px', fontSize: '0.82rem', lineHeight: 1.6 }}>
                <li>Workflows require cyclic execution loops (Evaluator-Optimizer, ReAct, Self-Correction)</li>
                <li>Multi-agent orchestration where independent agents communicate via shared state</li>
                <li>Human-in-the-loop approval checkpoints (`interrupt()` & resume) are mandatory</li>
                <li>Stateful persistence and checkpoint recovery (MemorySaver / PostgresSaver) on failure</li>
                <li>Complex business workflows (e.g., Code Generation, PR Review, Financial Compliance)</li>
              </ul>
            </Callout>
          </Grid>
        </Section.Body>
      </Section>

      {/* Code Examples Side-by-Side */}
      <Section variant="bordered">
        <Section.Header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: 'var(--ds-font-size-h3)', margin: 0 }}>
                Code Implementation Examples
              </h2>
              <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Compare syntax: Composable pipe operator `|` vs StateGraph nodes and conditional edges.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setActiveCodeTab('langchain')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: activeCodeTab === 'langchain' ? '2px solid #4a9a4a' : '1px solid var(--ds-color-border-default)',
                  background: activeCodeTab === 'langchain' ? 'rgba(74, 154, 74, 0.1)' : 'transparent',
                  color: activeCodeTab === 'langchain' ? '#4a9a4a' : 'inherit',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                🦜 LangChain (LCEL)
              </button>
              <button
                onClick={() => setActiveCodeTab('langgraph')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: activeCodeTab === 'langgraph' ? '2px solid #2a7a9c' : '1px solid var(--ds-color-border-default)',
                  background: activeCodeTab === 'langgraph' ? 'rgba(42, 122, 156, 0.1)' : 'transparent',
                  color: activeCodeTab === 'langgraph' ? '#2a7a9c' : 'inherit',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                🕸️ LangGraph (StateGraph)
              </button>
            </div>
          </div>
        </Section.Header>

        <Section.Body>
          {activeCodeTab === 'langchain' ? (
            <CodeBlock
              language="python"
              code={`from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_anthropic import ChatAnthropic

# 1. Linear Composable LCEL Pipeline
prompt = PromptTemplate.from_template("What is the capital of {country}?")
model = ChatAnthropic(model="claude-sonnet-4-20250514")
parser = StrOutputParser()

# 2. Pipe operator composition (Prompt -> Model -> Parser)
chain = prompt | model | parser

# 3. Direct invoke
result = chain.invoke({"country": "France"})
print(result) # "Paris"`}
            />
          ) : (
            <CodeBlock
              language="python"
              code={`from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool

# 1. Define Typed State Schema
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    iterations: int

# 2. Define Tools & Nodes
@tool
def search_docs(query: str) -> str:
    return "Relevant context snippet"

llm = ChatAnthropic(model="claude-sonnet-4-20250514").bind_tools([search_docs])

def agent_node(state: AgentState):
    response = llm.invoke(state["messages"])
    return {"messages": [response], "iterations": state["iterations"] + 1}

# 3. Build Cyclic StateGraph
workflow = StateGraph(AgentState)
workflow.add_node("agent", agent_node)
workflow.set_entry_point("agent")

# Add conditional feedback edge
def should_continue(state: AgentState):
    if state["iterations"] > 3 or not state["messages"][-1].tool_calls:
        return END
    return "agent"

workflow.add_conditional_edges("agent", should_continue)

# 4. Compile with Checkpointer
checkpointer = MemorySaver()
app = workflow.compile(checkpointer=checkpointer)

# 5. Execute with Session Threading
config = {"configurable": {"thread_id": "session-123"}}
result = app.invoke({"messages": [("user", "Analyze Q3 numbers")], "iterations": 0}, config)`}
            />
          )}
        </Section.Body>
      </Section>
    </Container>
  );
}

export default LangChainVsLangGraphComparison;