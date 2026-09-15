import React from "react";

const COLORS = {
  bg: "#080D1A",
  surface: "#0F1629",
  surface2: "#162040",
  surface3: "#1E2D52",
  border: "#243358",
  text: "#E2E8F0",
  muted: "#7A8BA8",
  amber: "#F59E0B",
  sky: "#2AB5B0",
  emerald: "#2AB5B0",
  rose: "#F43F5E",
  violet: "#A78BFA",
};

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: COLORS.surface2,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 10,
      padding: "16px",
      ...style
    }}>
      {children}
    </div>
  );
}

export default function GraphEngineeringTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>TOWARDS DATA SCIENCE · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Graph Engineering for AI Agents</h2>
            <div style={{ color: COLORS.muted, fontSize: 13, marginTop: 4 }}>From Prompts and Loops to Workflows</div>
          </div>
        </div>
        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7 }}>
          A viral debate over loops versus graphs points to a bigger shift in how we build AI systems. Here's what graph engineering actually means, how it differs from prompt, context, and loop engineering, and why it matters.
        </div>
      </div>

      {/* Evolution: Prompt → Context → Loop → Graph */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE EVOLUTION: PROMPT → CONTEXT → LOOP → GRAPH</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { name: "Prompt Engineering", desc: "Optimizes what you say to a model", scope: "Single turn", control: "You write the prompt", color: COLORS.muted },
            { name: "Context Engineering", desc: "Optimizes what the model can see when it answers", scope: "Single turn, richer context", control: "You curate what it sees", color: COLORS.sky },
            { name: "Loop Engineering", desc: "Gives the model tools, memory, and the ability to iterate", scope: "Continuous run", control: "Model decides what happens next", color: COLORS.amber },
            { name: "Graph Engineering", desc: "You define nodes, routing, and checkpoints in advance", scope: "Structured workflow", control: "Graph decides what happens next", color: COLORS.emerald },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: i < 3 ? `1px solid ${COLORS.border}` : "none", alignItems: "flex-start" }}>
              <div style={{
                minWidth: 120, padding: "6px 10px", borderRadius: 6,
                background: e.color + "18", border: `1px solid ${e.color}44`,
                color: e.color, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700,
                textAlign: "center"
              }}>{e.name}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: COLORS.text, fontSize: 13, fontWeight: 500 }}>{e.desc}</div>
                <div style={{ color: COLORS.muted, fontSize: 11, marginTop: 2 }}>Scope: {e.scope} · Control: {e.control}</div>
              </div>
              {i < 3 && <span style={{ color: COLORS.border, fontSize: 18, marginTop: 4 }}>→</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "14px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.emerald}33` }}>
          <div style={{ color: COLORS.emerald, fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
            The shift: from trusting a model to manage the entire process <strong>→ trusting a structure to manage the process</strong> — and using models only where their judgment is genuinely needed.
          </div>
        </div>
      </div>

      {/* The Problem with Single-Agent Loops */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE PROBLEM WITH SINGLE-AGENT LOOPS</div>
        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          One model decides what was worth investigating, gathers the evidence, interprets what it found, makes a recommendation, and judges its own confidence. No one checks its work along the way.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ border: `1px solid ${COLORS.rose}33` }}>
            <div style={{ color: COLORS.rose, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>SINGLE-AGENT LOOP</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 12 }}>
              <li>One model plays every role</li>
              <li>Judges its own output</li>
              <li>No external verification</li>
              <li>Gets stuck on unproductive steps</li>
              <li>Misses business rules</li>
              <li>Runs out of context mid-task</li>
            </ul>
          </Card>
          <Card style={{ border: `1px solid ${COLORS.emerald}33` }}>
            <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>GRAPH WORKFLOW</div>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 12 }}>
              <li>Each node has one clearly defined job</li>
              <li>Checker separate from doer</li>
              <li>Business rules in code, not prompts</li>
              <li>Independent work runs in parallel</li>
              <li>Human gate at irreversible decisions</li>
              <li>State carries structured data between steps</li>
            </ul>
          </Card>
        </div>
        <div style={{ marginTop: 16, padding: "12px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.amber}33` }}>
          <div style={{ color: COLORS.amber, fontSize: 13, fontWeight: 600 }}>
            Don't give the model control over the entire workflow. Give it one clearly defined step at a time.
          </div>
        </div>
      </div>

      {/* Building Blocks */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THREE CORE BUILDING BLOCKS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { name: "Nodes", icon: "◻️", desc: "One self-contained unit of work. Could be an LLM call, human approval, or deterministic code. Not every node needs a model.", color: COLORS.sky },
            { name: "Edges", icon: "→", desc: "Decide what happens next after a node finishes. Fixed, conditional, parallel, looping, error, human-controlled, or event-triggered.", color: COLORS.amber },
            { name: "State", icon: "📋", desc: "Shared record moving through the graph: original task, research, drafts, intermediate results, pass/fail verdicts. Each step reads from and writes to structured state.", color: COLORS.violet },
          ].map((b, i) => (
            <Card key={i} style={{ borderLeft: `3px solid ${b.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <div style={{ color: b.color, fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700 }}>{b.name}</div>
              </div>
              <div style={{ color: COLORS.muted, fontSize: 12 }}>{b.desc}</div>
            </Card>
          ))}
        </div>

        {/* Edge Types Table */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>7 EDGE TYPES</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}`, color: COLORS.muted }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Type</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>What it does</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Example</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { type: "Direct", desc: "One step feeds straight into the next", ex: "Skeptic → merge" },
                  { type: "Conditional", desc: "Routes based on output", ex: "Narrow question → single researcher" },
                  { type: "Parallel", desc: "Fans out to several nodes at once", ex: "Planner → three researchers" },
                  { type: "Looping", desc: "Sends failing result back with reason", ex: "Merge → skeptic → merge" },
                  { type: "Error", desc: "Catches broken node, routes to recovery", ex: "Failed search → retry" },
                  { type: "Human-controlled", desc: "Pauses until person approves", ex: "Founder's gate before action" },
                  { type: "Event-triggered", desc: "Waits on external event", ex: "New competitor listing re-triggers research" },
                ].map((e, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "8px", color: COLORS.sky, fontWeight: 600 }}>{e.type}</td>
                    <td style={{ padding: "8px", color: COLORS.muted }}>{e.desc}</td>
                    <td style={{ padding: "8px", color: COLORS.text, fontSize: 11 }}>{e.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Production Concepts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card style={{ border: `1px solid ${COLORS.amber}33` }}>
            <div style={{ color: COLORS.amber, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Reducers</div>
            <div style={{ color: COLORS.muted, fontSize: 11 }}>When parallel branches merge, a reducer defines how to combine results — merging lists, combining dicts, resolving conflicts. Without it, last-write-wins silently overwrites.</div>
          </Card>
          <Card style={{ border: `1px solid ${COLORS.violet}33` }}>
            <div style={{ color: COLORS.violet, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Checkpoints</div>
            <div style={{ color: COLORS.muted, fontSize: 11 }}>Snapshot of graph state at a moment. A 40-min workflow crashes at minute 40? Resume from last checkpoint instead of re-running everything. Pairs with interrupts for human-in-the-loop.</div>
          </Card>
        </div>
      </div>

      {/* 5 Patterns */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>FIVE PATTERNS FOR GRAPH ENGINEERING</div>
        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Most production workflows come down to a handful of recurring patterns. Each solves a different problem and has its own failure mode.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            {
              name: "1. Prompt Chaining",
              color: COLORS.sky,
              desc: "Output of one node becomes input to the next. Assembly line — each station only touches what the last one handed off.",
              when: "When each step only needs the previous step's output, not the full history.",
              danger: "If the next node genuinely needs everything the previous node saw, splitting just adds latency.",
              example: "Skeptic's verdict → merge's entire input. No upstream noise carries through."
            },
            {
              name: "2. Routing",
              color: COLORS.amber,
              desc: "Decides which path an input should take — like hospital triage. Match the amount of work to the difficulty of the question.",
              when: "Narrow questions skip the full workflow and go to one specialist.",
              danger: "Misclassification: a broad question sent down the narrow path gets a polished but under-researched answer.",
              example: "\"Add invoice sync?\" → single researcher. \"Build bookkeeping product?\" → full fan-out."
            },
            {
              name: "3. Parallelization",
              color: COLORS.emerald,
              desc: "Several independent pieces of work happen at the same time. Three researchers handling separate, predefined pieces simultaneously.",
              when: "Tasks are truly independent and don't depend on each other's output.",
              danger: "If researcher B needs researcher A's result, they shouldn't be parallel branches.",
              example: "Planner → three researchers (competitors, pain points, pricing) run at once → converge on skeptic."
            },
            {
              name: "4. Orchestrator-Workers",
              color: COLORS.violet,
              desc: "Work needs to be divided but the number of tasks isn't known in advance. The orchestrator discovers categories, then creates a worker for each.",
              when: "You don't know how many subtasks exist until the workflow starts.",
              danger: "Orchestrator discovers 40 categories, launches 40 calls → rate limits / budget blow. Cap workers + spend.",
              example: "Research all adjacent alternatives: competing apps, agencies, freelancers, templates — discovered dynamically."
            },
            {
              name: "5. Evaluator-Optimizer",
              color: COLORS.rose,
              desc: "One step produces an answer, another evaluates it, the first gets a chance to improve. Like an editor returning a draft with notes.",
              when: "Output quality matters and you can define what 'good' looks like.",
              danger: "Loop keeps running without improving — same unsupported claim with different wording. That's repetition, not iteration.",
              example: "Skeptic rejects merge's draft → merge revises → skeptic re-checks. Capped at 2 rounds."
            },
          ].map((p, i) => (
            <Card key={i} style={{ borderLeft: `3px solid ${p.color}` }}>
              <div style={{ color: p.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.name}</div>
              <div style={{ color: COLORS.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{p.desc}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div style={{ padding: "8px", background: COLORS.surface, borderRadius: 6 }}>
                  <div style={{ color: COLORS.muted, fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>When to use</div>
                  <div style={{ color: COLORS.text, fontSize: 11 }}>{p.when}</div>
                </div>
                <div style={{ padding: "8px", background: COLORS.surface, borderRadius: 6 }}>
                  <div style={{ color: COLORS.rose, fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Danger</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>{p.danger}</div>
                </div>
                <div style={{ padding: "8px", background: COLORS.surface, borderRadius: 6 }}>
                  <div style={{ color: COLORS.sky, fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 }}>Example</div>
                  <div style={{ color: COLORS.muted, fontSize: 11 }}>{p.example}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Knowledge Graph vs Agent Graph */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>KNOWLEDGE GRAPHS vs AGENT GRAPHS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Card style={{ border: `1px solid ${COLORS.sky}33` }}>
            <div style={{ color: COLORS.sky, fontWeight: 600, marginBottom: 8 }}>Knowledge Graph</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>How <strong>information</strong> connects. Customer → company → product → feature → team. Used by GraphRAG for relationship-aware retrieval.</div>
            <div style={{ marginTop: 8, padding: "6px 10px", background: COLORS.surface, borderRadius: 6, color: COLORS.sky, fontSize: 11, fontWeight: 600 }}>
              Connects information
            </div>
          </Card>
          <Card style={{ border: `1px solid ${COLORS.amber}33` }}>
            <div style={{ color: COLORS.amber, fontWeight: 600, marginBottom: 8 }}>Agent Graph</div>
            <div style={{ color: COLORS.muted, fontSize: 12, lineHeight: 1.6 }}>How <strong>work</strong> moves through a system. Planner → researchers → skeptic → synthesizer → human gate. Nodes, edges, state.</div>
            <div style={{ marginTop: 8, padding: "6px 10px", background: COLORS.surface, borderRadius: 6, color: COLORS.amber, fontSize: 11, fontWeight: 600 }}>
              Coordinates work
            </div>
          </Card>
        </div>
        <div style={{ marginTop: 12, padding: "10px 14px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
          <div style={{ color: COLORS.text, fontSize: 12, fontStyle: "italic" }}>
            Both can be used together: a knowledge graph helps an agent understand how information relates, while an agent graph determines what the system should do with that information.
          </div>
        </div>
      </div>

      {/* Prove the Shape Before Automating */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.amber}33`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>PROVE THE SHAPE BEFORE YOU AUTOMATE</div>
        <div style={{ color: COLORS.muted, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Don't reach for LangGraph or AutoGen first. Test the structure in twenty minutes and a blank page. If it isn't visibly better than a one-shot answer, don't automate it.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {[
            { n: "1", title: "Define the output in one sentence", desc: "Not 'help me research this' — 'a one-page recommendation on whether this idea is worth testing.'", color: COLORS.sky },
            { n: "2", title: "List 5-7 jobs a competent human would do", desc: "Clarify question, research pain, research competitors, research distribution, check evidence, write recommendation.", color: COLORS.amber },
            { n: "3", title: "Draw dependencies, not sequences", desc: "If two jobs don't need each other's output, put them side by side. Customer and competitor research can run in parallel.", color: COLORS.emerald },
            { n: "4", title: "Add one human gate where a mistake matters", desc: "Private memo = quick review. Customer email, refund, or public post = stop for approval before action.", color: COLORS.violet },
            { n: "5", title: "Run the graph manually first", desc: "Play every role yourself, one prompt at a time, fresh chat for each node. Deliberately slower than one long chat — testing whether structure improves result.", color: COLORS.rose },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "12px", background: COLORS.surface2, borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
              <div style={{ color: s.color, fontFamily: "JetBrains Mono, monospace", fontSize: 16, fontWeight: 700, minWidth: 28 }}>{s.n}</div>
              <div>
                <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 13 }}>{s.title}</div>
                <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tool Comparison */}
        <div>
          <div style={{ color: COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>TOOL COMPARISON</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}`, color: COLORS.muted }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Tool</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Best for</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Needs</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Watch out</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tool: "LangGraph", best: "Checkpoints, persistence, human-in-the-loop", needs: "Python/JS, checkpointer backend", watch: "More infrastructure, version churn" },
                  { tool: "AutoGen GraphFlow", best: "Branching and conditional logic", needs: "Python, AutoGen AgentChat", watch: "API surface still evolving" },
                  { tool: "n8n / Make.com", best: "Graphs touching Slack, email, CRM", needs: "No-code setup", watch: "Less control over agent reasoning" },
                ].map((t, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td style={{ padding: "8px", color: COLORS.sky, fontWeight: 600 }}>{t.tool}</td>
                    <td style={{ padding: "8px", color: COLORS.muted }}>{t.best}</td>
                    <td style={{ padding: "8px", color: COLORS.muted }}>{t.needs}</td>
                    <td style={{ padding: "8px", color: COLORS.rose, fontSize: 11 }}>{t.watch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Synthesis with Previous Articles */}
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.emerald}33`, borderRadius: 14, padding: "24px" }}>
        <div style={{ color: COLORS.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>SYNTHESIS: WHERE THIS FITS IN THE AGENTIC STACK</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { level: "Prompt Engineering", what: "Single turn, one prompt", tool: "Zero-shot / Few-shot / CoT / ToT", tab: "Prompt Fundamentals" },
            { level: "Context Engineering", what: "What the model can see", tool: "RAG, vector search, context windows", tab: "RAG tabs" },
            { level: "Loop Engineering", what: "Iterate with tools + memory", tool: "ReAct, bounded loops, verifiers", tab: "Loop Engineering" },
            { level: "Graph Engineering", what: "Structured multi-step workflow", tool: "LangGraph, nodes/edges/state", tab: "This tab" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: COLORS.surface2, borderRadius: 8, alignItems: "center" }}>
              <div style={{ color: i === 3 ? COLORS.emerald : COLORS.muted, fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700, minWidth: 130 }}>{s.level}</div>
              <div style={{ flex: 1, color: COLORS.text, fontSize: 12 }}>{s.what}</div>
              <div style={{ color: COLORS.muted, fontSize: 11 }}>{s.tool}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "14px", background: COLORS.surface2, borderRadius: 8, border: `1px solid ${COLORS.emerald}33` }}>
          <div style={{ color: COLORS.text, lineHeight: 1.7, fontSize: 13 }}>
            <strong>Key insight:</strong> Graph engineering doesn't replace loops — it <em>contains</em> them. Each node in a graph can be a loop (ReAct agent, evaluator-optimizer cycle). The graph provides the outer structure; loops handle the inner reasoning. The O'Reilly "outer loop" article describes the same idea from a different angle: the graph IS the outer loop made explicit.
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "12px", background: COLORS.surface2, borderRadius: 8 }}>
          <div style={{ color: COLORS.amber, fontWeight: 600, fontSize: 12, marginBottom: 6 }}>This week, do three things:</div>
          <ol style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.8, fontSize: 12 }}>
            <li>Write the one-sentence output your workflow should produce</li>
            <li>List the 5-7 jobs a competent human would need to do</li>
            <li>Run the workflow manually once — one prompt per node, fresh chat for each — before automating anything</li>
          </ol>
        </div>
      </div>

    </div>
  );
}