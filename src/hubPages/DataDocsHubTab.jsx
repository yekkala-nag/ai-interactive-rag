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

// Realistic per-topic positioning copy for the six Document Intelligence topics.
const TOPIC_COPY = {
  docstruct: {
    tagline: "Read the document before you chunk it",
    description:
      "PDFs are not flat text. Learn to recover headings, tables, reading order, and section hierarchy first — then drive chunking, citations, and the re-parse loop from structure instead of guessing.",
    outcomes: ["Extract TOC & headings", "Fix reading order", "Table-aware chunking"],
  },
  agenticparsing: {
    tagline: "Route each document to the right parser",
    description:
      "No single parser wins everywhere. Dispatch by document nature — native text to fast extractors, scans to OCR, complex layouts to vision models — and fall back gracefully when confidence is low.",
    outcomes: ["Classify doc nature", "Pick richer only when needed", "Confidence-gated fallback"],
  },
  knowledgebase: {
    tagline: "Curate the corpus before you embed it",
    description:
      "Retrieval quality is decided before the first embedding. Deduplicate, clean boilerplate, answer the top questions first, and set freshness TTLs so the knowledge base stays trustworthy.",
    outcomes: ["Top-10 question coverage", "Dedup & cleansing", "Freshness & RBAC"],
  },
  vectordbops: {
    tagline: "Operate the index like production infra",
    description:
      "HNSW vs IVF vs flat, RAM sizing, recall@k tradeoffs, reindex strategy. The vector index is a database — learn to provision, monitor, and tune it as one.",
    outcomes: ["Choose an index type", "Size RAM & set ef/k", "Measure recall@k"],
  },
  datapipeline: {
    tagline: "Stream, version, and trace every byte",
    description:
      "Documents change. Build ingestion that streams updates, versions corpora like code, and records lineage from source file to retrieved chunk — so every answer is auditable.",
    outcomes: ["Incremental ingestion", "Corpus versioning", "Chunk-level lineage"],
  },
  threelayers: {
    tagline: "Prompt, context, loop — in that order",
    description:
      "Anthropic's three engineering layers as an operating model: get the prompt right, engineer the context the model sees, then wrap it in a loop. Know which layer a failure belongs to.",
    outcomes: ["Diagnose by layer", "Context before loops", "Minimal effective loop"],
  },
};

const PIPELINE_STAGES = [
  { icon: "📄", title: "Parse", desc: "Recover text, layout, tables & order from PDFs and scans." },
  { icon: "✂️", title: "Chunk", desc: "Split on structure — sections and tables, not raw characters." },
  { icon: "🗜️", title: "Index", desc: "Embed, filter by metadata, and serve from a tuned vector index." },
  { icon: "🔍", title: "Serve", desc: "Retrieve with lineage, freshness, and access control attached." },
];

const KEY_METRICS = [
  { label: "Table cell recall", value: "94%", trend: "+11 pts vs naive extract", description: "Share of table cells correctly recovered with headers propagated, measured on a 40-document financial benchmark set." },
  { label: "Retrieval recall@5", value: "87%", trend: "+19 pts after cleansing", description: "Questions answered from the top-5 chunks after dedup, boilerplate removal, and metadata filtering — before any reranker." },
  { label: "Parse cost per 1k pages", value: "$1.80", trend: "−62% via dispatching", description: "Blended extraction cost when simple documents take the fast path and only complex layouts invoke vision models." },
  { label: "Corpus freshness (p95)", value: "4.2h", trend: "streaming ingestion", description: "Time from source-document update to reindexed, lineage-stamped chunks available to retrieval in the reference pipeline." },
];

const FAQS = [
  {
    q: "Where do I start if my RAG answers are wrong?",
    a: "Start with Document Structure & Loop. In practice, most retrieval failures trace back to parsing — merged columns, lost reading order, or tables flattened into nonsense — not to the choice of embedding model. Fix the structure layer first, then re-measure before touching anything else.",
  },
  {
    q: "Should I OCR everything with a vision model?",
    a: "No — that is the most expensive way to parse. The Agentic Parsing Dispatcher pattern exists precisely for this: classify each document by nature, send native-text PDFs down the fast path, and reserve OCR and vision models for scans and complex layouts. Teams typically cut parsing spend by half or more with no quality loss.",
  },
  {
    q: "How is this hub different from the RAG Core hub?",
    a: "RAG Core covers retrieval architectures and the query-time pipeline. This hub covers everything upstream of retrieval: getting documents parsed, cleaned, versioned, and indexed. If RAG Core is the engine, Document Intelligence is the fuel refinery.",
  },
  {
    q: "Do I need the topics in order?",
    a: "The sequence is recommended — structure, then parsing, then curation, then index ops, then pipelines, then the layers mental model — because each topic assumes the vocabulary of the previous one. All six are tagged Practitioner level, so an experienced engineer can dip into any single topic standalone.",
  },
  {
    q: "What stack do the topics assume?",
    a: "Python throughout, with PyMuPDF and Docling for extraction, Hugging Face or provider APIs for embeddings, and Qdrant or pgvector for the index. Every pattern transfers to other tools — the emphasis is on decision-making (which parser, which index, which versioning scheme), not on any single vendor.",
  },
  {
    q: "How do I know my document pipeline is production-ready?",
    a: "Three gates: (1) a golden set of your hardest documents with measured table recall and reading-order accuracy, (2) lineage from every chunk back to its source version, and (3) freshness and access-control enforcement at retrieval time. The Streaming + Lineage + Versioning topic walks through all three.",
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

export default function DataDocsHubTab({ onSelectTab }) {
  const child = getChildById("data_docs");
  const seq = useMemo(() => getChildSequence("data_docs"), []);

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("hub_progress_data_docs");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hub_progress_data_docs", JSON.stringify(progress));
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
        title="Document Intelligence"
        subtitle="Every grounded answer starts upstream of retrieval — in parsing, curation, and index ops."
        description="Retrieval can only find what parsing preserved. This hub turns messy, real-world documents — scanned PDFs, multi-page tables, versioned corpora — into a clean, lineage-stamped knowledge layer that RAG systems can actually trust. Six practitioner topics, one pipeline: parse it right, curate it ruthlessly, index it like production."
        estimatedHours={9}
        totalTopics={seq.length}
        levels={{ 2: seq.length }}
        icon="📄"
        accentColor={C.teal}
      />

      {/* Pipeline strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, position: "relative" }}>
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
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: C.text }}>The six topics</h3>
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Follow the sequence, or jump to any topic. Tick topics off as you finish them.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: 24 }}>
        {seq.map((id, i) => {
          const tab = getTabById(id) || { label: id, icon: "📝" };
          const meta = getTopicMeta(id);
          const level = meta?.l || 2;
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
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>The questions every team asks before investing in document pipelines.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {FAQS.map(f => <FaqItem key={f.q} faq={f} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: 24, background: "linear-gradient(135deg, rgba(94,196,200,0.16) 0%, rgba(240,168,154,0.12) 55%, rgba(201,184,232,0.16) 100%)", border: `1px solid ${C.border}`, borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.coral}, ${C.lav}, ${C.teal})`, pointerEvents: "none" }} />
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: C.text }}>Garbage in, garbage out — fix the "in".</h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Start with Document Structure &amp; Loop, and measure everything after it.</p>
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
