import { useState } from 'react';
import { Diagram, CodeBlock } from './Content.jsx';
import { Container, Section, Grid, Flex, Stack } from '../layout/Primitives.jsx';
import { Card, Badge, Button, Callout } from './Core.jsx';
import { getModuleColors } from '../../design-system/tokens.js';

export function LangChainVsLangGraphComparison() {
  const [activeDiff, setActiveDiff] = useState(0);
  
  const differences = [
    {
      id: 0,
      title: 'Pipeline vs Loops',
      langchainDesc: 'LangChain follows a pipeline abstraction: data moves in one direction through chained components. While you can branch and run steps in parallel, the default is forward-only data flow.',
      langgraphDesc: 'LangGraph treats loops as first-class citizens in the workflow. Nodes can route back to earlier nodes using conditional edges, enabling cyclic flows without external loop management.',
      whenToUseLc: 'Use LangChain for linear, predictable workflows like standard RAG, summarization, or simple extraction.',
      whenToUseLg: 'Use LangGraph for workflows requiring feedback loops, iterative refinement, or complex decision cycles like coding agents or planning systems.',
      diagram: (
        <svg viewBox="0 0 100 60" style={{ width: '100%', height: 80 }}>
{/* LangChain Pipeline */}
            <rect x="10" y="10" width="30" height="20" rx="4" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="1.5"/>
            <text x="25" y="23" textAnchor="middle" fill="#4a9a4a" fontSize="10">Prompt</text>
            <line x1="40" y1="20" x2="50" y2="20" stroke="#4a9a4a" strokeWidth="1.5" markerEnd={`url(#arrow-${diff.id}-1)`}/>
            <rect x="50" y="10" width="30" height="20" rx="4" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="1.5"/>
            <text x="65" y="23" textAnchor="middle" fill="#4a9a4a" fontSize="10">Model</text>
            <line x1="80" y1="20" x2="90" y2="20" stroke="#4a9a4a" strokeWidth="1.5" markerEnd={`url(#arrow-${diff.id}-2)`}/>
            
            {/* LangGraph Cyclic */}
            <rect x="10" y="35" width="25" height="20" rx="4" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="1.5"/>
            <text x="22.5" y="48" textAnchor="middle" fill="#2a7a9c" fontSize="10">Node A</text>
            <line x1="35" y1="45" x2="65" y2="45" stroke="#2a7a9c" strokeWidth="1.5" markerEnd={`url(#arrow-${diff.id}-3)`}/>
            <rect x="65" y="35" width="25" height="20" rx="4" fill="#2a7a9c20" stroke="#2a7a9c" strokeWidth="1.5"/>
            <text x="77.5" y="48" textAnchor="middle" fill="#2a7a9c" fontSize="10">Node B</text>
            <line x1="90" y1="45" x2="40" y2="45" stroke="#2a7a9c" strokeWidth="1.5" markerEnd={`url(#arrow-${diff.id}-4)`} strokeDasharray="4,2"/>
            <line x1="40" y1="45" x2="25" y2="35" stroke="#2a7a9c" strokeWidth="1.5" markerEnd={`url(#arrow-${diff.id}-5)`}/>
            <line x1="25" y1="35" x2="10" y2="45" stroke="#2a7a9c" strokeWidth="1.5" markerEnd={`url(#arrow-${diff.id}-6)`}/>
            
            <defs>
              <marker id={`arrow-${diff.id}-1`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
              </marker>
              <marker id={`arrow-${diff.id}-2`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
              </marker>
              <marker id={`arrow-${diff.id}-3`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-4`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-5`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-6`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
            </defs>
        </svg>
      )
    },
    {
      id: 1,
      title: 'Stateless vs Stateful',
      langchainDesc: 'Each LangChain runnable is stateless - it receives input and returns output. State must be manually managed and passed between components as dictionaries or custom objects.',
      langgraphDesc: 'LangGraph creates stateful agents where state is part of the graph itself. You define a state schema (TypedDict) and nodes can perform partial updates that are automatically merged.',
      whenToUseLc: 'Use LangChain when each step only needs the previous step\'s result and you don\'t need to maintain complex state across iterations.',
      whenToUseLg: 'Use LangGraph when you need to track conversation history, validation errors, retry counts, or other state that evolves throughout the workflow.',
      diagram: (
        <svg viewBox="0 0 100 80" style={{ width: '100%', height: 100 }}>
{/* Stateless - LangChain */}
            <text x="50" y="15" textAnchor="middle" fill="#8a8a9a" fontSize="10">LangChain (Stateless)</text>
            <rect x="20" y="20" width="60" height="12" rx="2" fill="#4a9a4a10" stroke="#4a9a4a" strokeWidth="1"/>
            <text x="50" y="29" textAnchor="middle" fill="#4a9a4a" fontSize="9">Runnable 1: input → output</text>
            <line x1="50" y1="32" x2="50" y2="38" stroke="#4a9a4a" strokeWidth="1" markerEnd={`url(#arrow-${diff.id}-1)`}/>
            <rect x="20" y="38" width="60" height="12" rx="2" fill="#4a9a4a10" stroke="#4a9a4a" strokeWidth="1"/>
            <text x="50" y="47" textAnchor="middle" fill="#4a9a4a" fontSize="9">Runnable 2: input → output</text>
            <line x1="50" y1="50" x2="50" y2="56" stroke="#4a9a4a" strokeWidth="1" markerEnd={`url(#arrow-${diff.id}-2)`}/>
            <rect x="20" y="56" width="60" height="12" rx="2" fill="#4a9a4a10" stroke="#4a9a4a" strokeWidth="1"/>
            <text x="50" y="65" textAnchor="middle" fill="#4a9a4a" fontSize="9">Runnable 3: input → output</text>
            
            {/* Stateful - LangGraph */}
            <text x="50" y="75" textAnchor="middle" fill="#8a8a9a" fontSize="10">LangGraph (Stateful)</text>
            <rect x="15" y="80" width="70" height="40" rx="4" fill="#2a7a9c10" stroke="#2a7a9c" strokeWidth="1.5"/>
            <text x="50" y="95" textAnchor="middle" fill="#2a7a9c" fontSize="10">Agent State</text>
            <text x="20" y="105" fontSize="8">• messages: [Human, AI]</text>
            <text x="20" y="115" fontSize="8">• iterations: 3</text>
            <text x="20" y="125" fontSize="8">• tool_calls: [...]</text>
            <text x="50" y="105" fontSize="8">LLM Node → updates messages</text>
            <text x="50" y="115" fontSize="8">Tool Node → updates tool_calls</text>
            <text x="80" y="105" fontSize="8">Router Node → updates iterations</text>
            
            <defs>
              <marker id={`arrow-${diff.id}-1`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
              </marker>
              <marker id={`arrow-${diff.id}-2`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
              </marker>
              <marker id={`arrow-${diff.id}-3`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-4`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-5`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-6`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-7`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-8`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
            </defs>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Human-in-the-Loop',
      langchainDesc: 'With LangChain, implementing human-in-the-loop requires building pause/resume mechanics into the surrounding application - saving proposals, waiting for approval, then reconstructing context.',
      langgraphDesc: 'LangGraph provides built-in interrupt() calls inside nodes that pause graph execution, save state, and wait for external input to resume - all managed within the framework.',
      whenToUseLc: 'Use LangChain when you don\'t need human approval checkpoints or can implement simple manual approval flows outside the chain.',
      whenToUseLg: 'Use LangGraph for workflows requiring formal human approval steps like database migrations, financial transactions, or production deployments.',
      diagram: (
        <svg viewBox="0 0 100 70" style={{ width: '100%', height: 90 }}>
{/* LangChain Manual HITL */}
            <text x="25" y="15" textAnchor="middle" fill="#8a8a9a" fontSize="9">LangChain Approach</text>
            <rect x="5" y="20" width="40" height="12" rx="2" fill="#4a9a4a10" stroke="#4a9a4a" strokeWidth="1"/>
            <text x="25" y="29" textAnchor="middle" fill="#4a9a4a" fontSize="8">Run until proposal</text>
            <line x1="25" y1="32" x2="25" y2="40" stroke="#4a9a4a" strokeWidth="1" markerEnd={`url(#arrow-${diff.id}-1)`}/>
            <rect x="5" y="40" width="40" height="12" rx="2" fill="#e0dcd4" stroke="#b0b0c0" strokeWidth="1" strokeDasharray="2,2"/>
            <text x="25" y="49" textAnchor="middle" fill="#8a8a9a" fontSize="8">[External App: Save proposal]</text>
            <line x1="25" y1="52" x2="25" y2="60" stroke="#4a9a4a" strokeWeight="1" markerEnd={`url(#arrow-${diff.id}-2)`}/>
            <rect x="5" y="60" width="40" height="12" rx="2" fill="#4a9a4a10" stroke="#4a9a4a" strokeWeight="1"/>
            <text x="25" y="69" textAnchor="middle" fill="#8a8a9a" fontSize="8">Resume with context</text>
            
            {/* LangGraph Built-in HITL */}
            <text x="75" y="15" textAnchor="middle" fill="#8a8a9a" fontSize="9">LangGraph Approach</text>
            <rect x="55" y="20" width="40" height="12" rx="2" fill="#2a7a9c10" stroke="#2a7a9c" strokeWeight="1.5"/>
            <text x="75" y="29" textAnchor="middle" fill="#2a7a9c" fontSize="8">Run until interrupt</text>
            <line x1="75" y1="32" x2="75" y2="40" stroke="#2a7a9c" strokeWeight="1.5" markerEnd={`url(#arrow-${diff.id}-3)`}/>
            <rect x="55" y="40" width="40" height="12" rx="2" fill="#2a7a9c20" stroke="#2a7a9c" strokeWeight="1.5"/>
            <text x="75" y="49" textAnchor="middle" fill="#2a7a9c" fontSize="8">{'interrupt({question: "Run?"})'}</text>
            <line x1="75" y1="52" x2="75" y2="60" stroke="#2a7a9c" strokeWeight="1.5" markerEnd={`url(#arrow-${diff.id}-4)`}/>
            <rect x="55" y="60" width="40" height="12" rx="2" fill="#2a7a9c10" stroke="#2a7a9c" strokeWeight="1.5"/>
            <text x="75" y="69" textAnchor="middle" fill="#2a7a9c" fontSize="8">Resume with response</text>
            
            <defs>
              <marker id={`arrow-${diff.id}-1`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
              </marker>
              <marker id={`arrow-${diff.id}-2`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#4a9a4a" />
              </marker>
              <marker id={`arrow-${diff.id}-3`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-4`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-5`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-6`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-7`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-8`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
            </defs>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Restarts vs Resume',
      langchainDesc: 'When a step fails in LangChain, the simplest recovery is to re-run the entire chain from the beginning, repeating all previous successful steps and incurring their costs again.',
      langgraphDesc: 'LangGraph includes a checkpointer that snapshots the graph state after each step. On failure, you can resume from the latest checkpoint rather than restarting from scratch.',
      whenToUseLc: 'Use LangChain for short, inexpensive workflows where restarting from failure is acceptable.',
      whenToUseLg: 'Use LangGraph for long-running, expensive workflows where re-executing successful steps would be wasteful (e.g., multi-step research, complex agent tasks).',
      diagram: (
        <svg viewBox="0 0 100 50" style={{ width: '100%', height: 65 }}>
{/* Restart - LangChain */}
            <text x="25" y="12" textAnchor="middle" fill="#8a8a9a" fontSize="9">LangChain: Restart on Failure</text>
            <rect x="5" y="15" width="12" height="12" rx="2" fill="#4a9a4a20" stroke="#4a9a4a" strokeWidth="1"/>
            <text x="11" y="24" textAnchor="middle" fill="#4a9a4a" fontSize="8">Step 1</text>
            <rect x="23" y="15" width="12" height="12" rx="2" fill="#4a9a4a20" stroke="#4a9a4a" strokeWeight="1"/>
            <text x="29" y="24" textAnchor="middle" fill="#4a9a4a" fontSize="8">Step 2</text>
            <rect x="41" y="15" width="12" height="12" rx="2" fill="#4a9a4a20" stroke="#4a9a4a" strokeWeight="1"/>
            <text x="47" y="24" textAnchor="middle" fill="#4a9a4a" fontSize="8">Step 3</text>
            <rect x="59" y="15" width="12" height="12" rx="2" fill="#e74c3c" stroke="#c0392b" strokeWeight="1"/>
            <text x="65" y="24" textAnchor="middle" fill="#ffffff" fontSize="8">Step 4<br/>FAIL</text>
            <line x1="75" y1="21" x2="5" y2="21" stroke="#e74c3c" strokeWeight="1" strokeDasharray="4,2" markerEnd={`url(#arrow-${diff.id}-1)`}/>
            <text x="40" y="10" textAnchor="middle" fill="#e74c3c" fontSize="8">RESTART ALL</text>
            
            {/* Resume - LangGraph */}
            <text x="75" y="12" textAnchor="middle" fill="#8a8a9a" fontSize="9">LangGraph: Resume from Checkpoint</text>
            <rect x="55" y="15" width="12" height="12" rx="2" fill="#2a7a9c20" stroke="#2a7a9c" strokeWeight="1.5"/>
            <text x="61" y="24" textAnchor="middle" fill="#2a7a9c" fontSize="8">Step 1</text>
            <rect x="73" y="15" width="12" height="12" rx="2" fill="#2a7a9c20" stroke="#2a7a9c" strokeWeight="1.5"/>
            <text x="79" y="24" textAnchor="middle" fill="#2a7a9c" fontSize="8">Step 2</text>
            <rect x="91" y="15" width="12" height="12" rx="2" fill="#2a7a9c20" stroke="#2a7a9c" strokeWeight="1.5"/>
            <text x="97" y="24" textAnchor="middle" fill="#2a7a9c" fontSize="8">Step 3</text>
            <rect x="109" y="15" width="12" height="12" rx="2" fill="#e74c3c" stroke="#c0392b" strokeWeight="1.5"/>
            <text x="115" y="24" textAnchor="middle" fill="#ffffff" fontSize="8">Step 4<br/>FAIL</text>
            <line x1="125" y1="21" x2="55" y2="21" stroke="#2a7a9c" strokeWeight="1.5" strokeDasharray="4,2" markerEnd={`url(#arrow-${diff.id}-2)`}/>
            <text x="90" y="10" textAnchor="middle" fill="#2a7a9c" fontSize="8">RESUME from<br/>Checkpoint 3</text>
            
            <defs>
              <marker id={`arrow-${diff.id}-1`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#e74c3c" />
              </marker>
              <marker id={`arrow-${diff.id}-2`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-3`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-4`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-5`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-6`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-7`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
              <marker id={`arrow-${diff.id}-8`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#2a7a9c" />
              </marker>
            </defs>
        </svg>
      )
    }
  ];

  return (
    <Container size="normal" style={{ paddingTop: 'var(--ds-space-6)', paddingBottom: 'var(--ds-space-6)' }}>
      <Section>
        <Section.Header>
          <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
            LangChain vs LangGraph: 4 Key Differences
          </h2>
          <p style={{ color: 'var(--ds-color-text-secondary)' }}>
            A practical guide to choosing the right framework for your agentic workflows
          </p>
        </Section.Header>
        <Section.Body>
          <Tabs
            defaultValue={activeDiff}
            onValueChange={setActiveDiff}
            orientation="vertical"
          >
            {differences.map(diff => (
              <Tabs.Item value={diff.id} key={diff.id}>
                <Tabs.Trigger>
                  <Flex align="center" gap="var(--ds-space-3)">
                    <Badge 
                      variant="secondary" 
                      size="icon"
                      style={{
                        backgroundColor: diff.id % 2 === 0 ? getModuleColors('agents').light : getModuleColors('context').light,
                        color: diff.id % 2 === 0 ? getModuleColors('agents').primary : getModuleColors('context').primary
                      }}
                    >
                      🔁
                    </Badge>
                    <span style={{ fontWeight: 600 }}>{diff.title}</span>
                  </Flex>
                </Tabs.Trigger>
                <Tabs.Content>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-6)" align="start">
                    <div>
                      <div style={{ background: '#ffffff', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-lg)', padding: 'var(--ds-space-4)', marginBottom: 'var(--ds-space-4)' }}>
                        <h3 style={{ fontSize: 'var(--ds-font-size-h3)', marginBottom: 'var(--ds-space-2)', color: '#4a9a4a' }}>
                          LangChain Approach
                        </h3>
                        <p style={{ fontSize: 'var(--ds-font-size-body)', color: '#8a8a9a', lineHeight: 1.6, marginBottom: 'var(--ds-space-3)' }}>
                          {diff.langchainDesc}
                        </p>
                        <div style={{ background: '#f0ede6', borderRadius: 'var(--ds-radius-md)', padding: 'var(--ds-space-3)', marginBottom: 'var(--ds-space-3)' }}>
                          <strong style={{ color: '#4a9a4a' }}>When to use:</strong> <span>{diff.whenToUseLc}</span>
                        </div>
                      </div>
                      <div style={{ background: '#ffffff', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-lg)', padding: 'var(--ds-space-4)' }}>
                        <h3 style={{ fontSize: 'var(--ds-font-size-h3)', marginBottom: 'var(--ds-space-2)', color: '#2a7a9c' }}>
                          LangGraph Approach
                        </h3>
                        <p style={{ fontSize: 'var(--ds-font-size-body)', color: '#8a8a9a', lineHeight: 1.6, marginBottom: 'var(--ds-space-3)' }}>
                          {diff.langgraphDesc}
                        </p>
                        <div style={{ background: '#f0ede6', borderRadius: 'var(--ds-radius-md)', padding: 'var(--ds-space-3)' }}>
                          <strong style={{ color: '#2a7a9c' }}>When to use:</strong> <span>{diff.whenToUseLg}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
{/* Since we can't easily convert SVG to base64 in this context, let's use a different approach */}
                       <div style={{ border: '1px dashed var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-md)', padding: 'var(--ds-space-3)', background: '#fafafa', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#8a8a9a', textAlign: 'center', fontStyle: 'italic' }}>
                           [Interactive SVG Diagram - See implementation for visual]
                         </div>
                       </div>
                    </div>
                  </Grid>
                </Tabs.Content>
              </Tabs.Item>
            ))}
          </Tabs>
        </Section.Body>
      </Section>
      
      <Section variant="bordered" style={{ marginTop: 'var(--ds-space-8)' }}>
        <Section.Header>
          <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
            When to Use Which Framework
          </h2>
        </Section.Header>
        <Section.Body>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-6)">
            <Callout variant="agent" style={{ padding: 'var(--ds-space-4)' }}>
              <Callout.Icon>🦜</Callout.Icon>
              <Callout.Title>Use LangChain when:</Callout.Title>
              <Callout.Description>
                <ul style={{ marginTop: 'var(--ds-space-2)', lineHeight: 1.6, paddingLeft: 'var(--ds-space-4)' }}>
                  <li>Building simple, linear pipelines (Retrieve → Generate)</li>
                  <li>Prototyping or learning LLM application development</li>
                  <li>Your workflow has minimal branching or looping needs</li>
                  <li>You want maximum flexibility with lower-level abstractions</li>
                  <li>Boilerplate code is acceptable for your use case</li>
                </ul>
              </Callout.Description>
            </Callout>
            
            <Callout variant="context" style={{ padding: 'var(--ds-space-4)' }}>
              <Callout.Icon>🕸️</Callout.Icon>
              <Callout.Title>Use LangGraph when:</Callout.Title>
              <Callout.Description>
                <ul style={{ marginTop: 'var(--ds-space-2)', lineHeight: 1.6, paddingLeft: 'var(--ds-space-4)' }}>
                  <li>Your workflow requires cyclic execution or feedback loops</li>
                  <li>You need to maintain complex state across workflow steps</li>
                  <li>Human-in-the-loop approval checkpoints are required</li>
                  <li>Workflow resumption after failure is important</li>
                  <li>Building multi-agent systems with coordinated communication</li>
                </ul>
              </Callout.Description>
            </Callout>
          </Grid>
        </Section.Body>
      </Section>
      
      <Section variant="bordered" style={{ marginTop: 'var(--ds-space-8)' }}>
        <Section.Header>
          <h2 style={{ fontSize: 'var(--ds-font-size-h2)', marginBottom: 'var(--ds-space-2)' }}>
            Code Examples
          </h2>
        </Section.Header>
        <Section.Body>
          <Tabs
            defaultValue="langchain"
            onValueChange={setActiveDiff}
            orientation="horizontal"
          >
            <Tabs.Item value="langchain">
              <Tabs.Trigger>LangChain Example</Tabs.Trigger>
              <Tabs.Content>
                <CodeBlock 
                  language="python"
                  code={`from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_anthropic import ChatAnthropic

# Simple LangChain pipeline
prompt = PromptTemplate.from_template("What is the capital of {country}?")
model = ChatAnthropic(model="claude-sonnet-4-20250514")
parser = StrOutputParser()

chain = prompt | model | parser
result = chain.invoke({"country": "France"})`}
                />
              </Tabs.Content>
            </Tabs.Item>
            
            <Tabs.Item value="langgraph">
              <Tabs.Trigger>LangGraph Example</Tabs.Trigger>
              <Tabs.Content>
                <CodeBlock 
                  language="python"
                  code={`from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    iterations: int

@tool
def search(query: str) -> str:
    return "Search results for: " + query

llm = ChatAnthropic(model="claude-sonnet-4-20250514")
llm_with_tools = llm.bind_tools([search])

def call_llm(state: AgentState):
    msg = llm_with_tools.invoke(state["messages"])
    return {"messages": [msg], "iterations": state["iterations"] + 1}

# ... router, tools nodes, graph building`}
                />
              </Tabs.Content>
            </Tabs.Item>
          </Tabs>
        </Section.Body>
      </Section>
    </Container>
  );
}

export default LangChainVsLangGraphComparison;