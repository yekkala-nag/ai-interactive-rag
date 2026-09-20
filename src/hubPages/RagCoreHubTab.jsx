import React, { useState, useEffect, useMemo } from "react";
import { HubHero } from "./components/index.js";
import { getChildById, getChildSequence, getTopicMeta } from "../registry/curriculum.js";
import { getTabById } from "../registry/tabsRegistry.js";

const C = {
  bg: "#F5F5F7", surface: "#FFFFFF", s2: "#EDEDF0", s3: "#EDEDF0",
  border: "#E8E8EC", text: "#2D2D3A", muted: "#4A4A5A",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

const LEVEL_BADGE = {
  1: { label: "L1 · Core", color: "#5EC4C8", ink: "#1F6B6E" },
  2: { label: "L2 · Practitioner", color: "#9B89C4", ink: "#6B5E94" },
  3: { label: "L3 · Advanced", color: "#F0A89A", ink: "#C47A6A" },
};

// Realistic per-topic positioning copy for the seven RAG Core topics.
const TOPIC_COPY = {
  rag: {
    tagline: "Nine architectures, one mental map",
    description:
      "Naive, advanced, hybrid, self, corrective, graph, agentic, multimodal, RAPTOR — learn what each architecture adds, what it costs, and which one matches your query load. The orientation every later RAG topic assumes.",
    outcomes: ["Compare 9 architectures", "Pick a starting point", "Know when to upgrade"],
  },
  pipeline: {
    tagline: "Watch a query travel the pipeline",
    description:
      "An interactive seven-stage simulation: query, rewrite, hybrid search, re-rank, compress, agent, answer. Build the end-to-end intuition for how a question becomes a cited response before you touch any single stage.",
    outcomes: ["Trace query → answer", "Name every stage", "Spot failure points"],
  },
  completepipeline: {
    tagline: "All twelve steps, live",
    description:
      "The full production pipeline with toggles on every step: ingestion, indexing, retrieval, and generation wired together in one simulation. See how each stage's output becomes the next stage's input — and its failure mode.",
    outcomes: ["Run 12 steps live", "Toggle stages on/off", "Link stages to failures"],
  },
  ragchunking: {
    tagline: "Chunking is a retrieval decision",
    description:
      "Fixed-size, recursive, semantic, late chunking, parent-child hierarchies — chunk boundaries decide what the retriever can ever find. Learn to choose strategy and overlap from document structure, not defaults.",
    outcomes: ["Pick a strategy", "Size & overlap correctly", "Late & parent-child patterns"],
  },
  qparseloop: {
    tagline: "Answer the question behind the question",
    description:
      "Real queries are vague, multi-part, and underspecified. Rewrite, decompose, and expand the user's question in a bounded loop before retrieving — and know when to stop instead of looping forever.",
    outcomes: ["Rewrite & decompose", "HyDE & expansion", "Bounded iteration"],
  },
  filtering: {
    tagline: "Retrieval is filtering, not magic",
    description:
      "Anchor detection, BM25 keyword paths, and metadata pre-filters do the heavy lifting before vectors ever get involved. Learn why the cheapest precision wins in RAG come from ruling documents out, not ranking them in.",
    outcomes: ["Anchor detection", "BM25 + metadata filters", "Precision before rank"],
  },
  ragcorpusshapes: {
    tagline: "Not all corpora are created equal",
    description:
      "Flat piles, homogeneous collections, and case-file bundles fail in different ways and demand different pipelines. Diagnose your corpus shape first — then select, index, and baseline accordingly instead of fighting the wrong battle.",
    outcomes: ["Diagnose corpus shape", "Select the right pipeline", "Baseline without waste"],
  },
};

const PIPELINE_STAGES = [
  { icon: "💬", title: "Query", desc: "Raw user input — vague, multi-part, underspecified." },
  { icon: "✏️", title: "Rewrite", desc: "Parse, decompose, and expand the question in a bounded loop." },
  { icon: "🔀", title: "Retrieve", desc: "Hybrid dense + keyword search, filtered before it is ranked." },
  { icon: "📐", title: "Refine", desc: "Re-rank, compress, and verify chunks before generation." },
];

const KEY_METRICS = [
  { label: "Hybrid vs dense-only recall", value: "+12%", trend: "RRF fusion", description: "Typical recall gain from adding a BM25 keyword path with reciprocal-rank fusion — the cheapest precision win in most pipelines." },
  { label: "Re-rank precision lift", value: "+15%", trend: "cross-encoder top-20 → 5", description: "Accuracy gained by re-ranking twenty candidates down to five with a cross-encoder before injecting context." },
  { label: "Context waste removed", value: "−40%", trend: "compression stage", description: "Token waste eliminated by stripping irrelevant sentences from retrieved chunks before generation." },
  { label: "Unnecessary retrievals skipped", value: "−40%", trend: "self-routing queries", description: "Retrieval calls avoided when the model judges it can answer directly — the core idea behind self-routing architectures." },
];

const FAQS = [
  {
    q: "Where do I start with RAG?",
    a: "Start with 9 RAG Architectures for the map, then run the 7-Stage Pipeline Sim to build intuition. Those two topics give you the vocabulary — chunk, embed, retrieve, re-rank, generate — that everything else in this hub (and the whole RAG track) assumes.",
  },
  {
    q: "Should I build naive RAG first?",
    a: "Yes, as a baseline — never as the destination. Naive RAG (fixed chunks, dense-only retrieval, no re-ranking) takes an afternoon and gives you something to measure against. The chunking, filtering, and corpus topics then show you exactly which upgrades buy the most quality per unit of effort.",
  },
  {
    q: "Chunking, parsing, or retrieval — which matters most?",
    a: "In that order of debugging priority. If parsing destroyed the tables, no chunking recovers them; if chunking split mid-fact, no retriever reassembles it. Work upstream to downstream: structure first (Document Intelligence hub), then chunking, then retrieval precision.",
  },
  {
    q: "What is a corpus shape, and why does it get its own topic?",
    a: "Because the same pipeline behaves completely differently on a flat pile of unrelated PDFs versus a homogeneous typed collection versus bundled case files. Corpus shape determines indexing strategy, metadata design, and what your baseline should even be — get it wrong and you optimize the wrong thing.",
  },
  {
    q: "How does this hub relate to Retrieval Precision and Advanced RAG?",
    a: "RAG Core is the foundation: architectures, pipeline intuition, chunking, and query handling. Retrieval Precision goes deeper on re-ranking, evals, and tables; Advanced RAG covers production hardening, agents, graphs, and SQL. Complete this hub first — the later hubs assume it.",
  },
  {
    q: "How do I know my core pipeline works?",
    a: "Three checks: (1) a golden question set with measured recall@5, (2) citations on every answer that actually support the claims, and (3) graceful behavior on out-of-corpus questions — abstain or flag, never hallucinate. If any check fails, the topic sequence tells you which stage to fix.",
  },
];

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: C.surface, border: `1px solid ${open ? C.tealDark : C.border}`, borderRadius: 10, overflow: "hidden", transition: "border 0.2s" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: C.text }}>{faq.q}</span>
        <span style={{ fontSize: 14, color: open ? C.tealDark : C.muted, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: "0 18px 16px", fontSize: 13.5, color: C.muted, lineHeight: 1.7 }}>
          {faq.a}
        </div>
      )}
    </div>
  );
}

export default function RagCoreHubTab({ onSelectTab }) {
  const child = getChildById("rag_core");
  const seq = useMemo(() => getChildSequence("rag_core"), []);

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("hub_progress_rag_core");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hub_progress_rag_core", JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const completed = progress?.completed || [];
  const pct = seq.length ? Math.round((completed.length / seq.length) * 100) : 0;
  const nextUp = seq.find(id => !completed.includes(id)) || seq[0];

  const toggleDone = (id) => {
    setProgress(p => ({
      completed: (p?.completed || []).includes(id)
        ? (p.completed || []).filter(t => t !== id)
        : [...(p?.completed || []), id],
    }));
  };

  if (!child) return <div style={{ padding: 24, color: C.muted }}>Child umbrella not found</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <HubHero
        title="RAG Core"
        subtitle="The foundation of grounded AI: architectures, pipelines, chunking, and queries."
        description="Before re-rankers, agents, and graphs, there is the core loop: take a question, find the right chunks, and generate a cited answer. This hub builds that loop from the ground up — nine architectures to orient you, live pipeline simulations for intuition, then the three skills that decide quality: chunking, question parsing, and filtering. Six core topics plus one practitioner bridge into corpus strategy."
        estimatedHours={8}
        totalTopics={seq.length}
        levels={{ 1: seq.filter(id => (getTopicMeta(id).l || 1) === 1).length, 2: seq.filter(id => (getTopicMeta(id).l || 1) === 2).length }}
        icon="🔧"
        accentColor={C.teal}
      />

      {/* Pipeline strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.tealInk, letterSpacing: "0.08em", marginBottom: 8 }}>
              STAGE {i + 1}
            </div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{s.title}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Progress + CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
            <span>Your progress in this hub</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 700, color: C.tealInk }}>{completed.length}/{seq.length} · {pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: C.s2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: C.tealDark, transition: "width 0.3s" }} />
          </div>
        </div>
        <button
          onClick={() => nextUp && onSelectTab(nextUp)}
          style={{ padding: "12px 24px", background: C.tealDark, color: "#FFFFFF", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          {completed.length === 0 ? "Start the hub →" : `Continue: ${(getTabById(nextUp) || {}).label || nextUp} →`}
        </button>
      </div>

      {/* Topic cards */}
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: C.text }}>The seven topics</h3>
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Follow the sequence, or jump to any topic. Tick topics off as you finish them.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: 24 }}>
        {seq.map((id, i) => {
          const tab = getTabById(id) || { label: id, icon: "📝" };
          const meta = getTopicMeta(id);
          const level = meta?.l || 1;
          const badge = LEVEL_BADGE[level];
          const copy = TOPIC_COPY[id] || { tagline: "", description: "", outcomes: [] };
          const done = completed.includes(id);
          return (
            <div key={id} style={{ background: done ? "rgba(94,196,200,0.10)" : C.surface, border: `1px solid ${done ? C.tealDark : C.border}`, borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 28, height: 28, borderRadius: 7, background: C.s2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: C.tealInk, flexShrink: 0 }}>
                  {done ? "✓" : i + 1}
                </span>
                <span style={{ fontSize: 20 }}>{tab.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${badge.color}20`, color: badge.ink, border: `1px solid ${badge.color}40`, flexShrink: 0 }}>
                  {badge.label}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 }}>{tab.label}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.tealInk, marginBottom: 6 }}>{copy.tagline}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{copy.description}</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {copy.outcomes.map(o => (
                  <span key={o} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 9999, background: C.s2, border: `1px solid ${C.border}`, color: C.muted }}>
                    {o}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 4 }}>
                <button
                  onClick={() => onSelectTab(id)}
                  style={{ flex: 1, padding: "9px 12px", background: "transparent", color: C.tealInk, border: `1px solid ${C.tealDark}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  Open topic →
                </button>
                <button
                  onClick={() => toggleDone(id)}
                  title={done ? "Mark as not done" : "Mark as done"}
                  style={{ padding: "9px 12px", background: done ? C.tealDark : "transparent", color: done ? "#FFFFFF" : C.muted, border: `1px solid ${done ? C.tealDark : C.border}`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  {done ? "✓ Done" : "Mark done"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key metrics */}
      <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: C.text }}>Why this hub pays off</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        {KEY_METRICS.map(m => (
          <div key={m.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: C.text }}>{m.value}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.tealDark }}>{m.trend}</span>
            </div>
            <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{m.description}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: C.text }}>Frequently asked questions</h3>
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>The questions every team asks before building their first RAG system.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {FAQS.map(f => <FaqItem key={f.q} faq={f} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: 24, background: "linear-gradient(135deg, rgba(94,196,200,0.16) 0%, rgba(240,168,154,0.12) 55%, rgba(201,184,232,0.16) 100%)", border: `1px solid ${C.border}`, borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.coral}, ${C.lav}, ${C.teal})`, pointerEvents: "none" }} />
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: C.text }}>Cite your sources — starting today.</h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Start with 9 RAG Architectures, then watch a query travel the pipeline.</p>
        <button
          onClick={() => onSelectTab(seq[0])}
          style={{ padding: "12px 28px", background: C.tealDark, color: "#FFFFFF", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          Start with {(getTabById(seq[0]) || {}).label || "topic 1"} →
        </button>
      </div>
    </div>
  );
}
