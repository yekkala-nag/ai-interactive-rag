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

// Realistic per-topic positioning copy for the eight Platform & Scale topics.
const TOPIC_COPY = {
  medallionarch: {
    tagline: "Bronze in, gold out",
    description:
      "Structure your lakehouse into raw, cleaned, and curated layers so every AI feature reads from governed gold tables — never from a swamp of undocumented dumps. The foundation every other topic in this hub builds on.",
    outcomes: ["Bronze/Silver/Gold zones", "Schema enforcement", "Backfill strategy"],
  },
  aidataplat: {
    tagline: "A data platform that serves models, not just dashboards",
    description:
      "Design storage, catalogs, and access patterns around AI workloads: feature freshness, embedding columns, and audit trails. Learn what changes when the consumer of your platform is a training job or a live agent.",
    outcomes: ["AI-ready cataloging", "Feature freshness SLAs", "Audit-ready access"],
  },
  aitestdatabottleneck: {
    tagline: "Stop waiting on labeled data",
    description:
      "Evaluation stalls when test data is scarce, stale, or leaky. Build synthetic-data pipelines, guard against train-test contamination, and keep a living golden set so model iteration never blocks on annotation queues.",
    outcomes: ["Synthetic golden sets", "Contamination guards", "Living benchmarks"],
  },
  pythonprofiling: {
    tagline: "Measure first, optimize second",
    description:
      "cProfile, line_profiler, and memory traces on real workloads. Find the actual hotspot — I/O, pandas copies, or a quadratic loop — before rewriting a single line, and prove the speedup afterward.",
    outcomes: ["CPU & memory profiles", "Hotspot triage", "Before/after proof"],
  },
  pythonengineering: {
    tagline: "Python that survives production",
    description:
      "Five hands-on simulators covering the engineering patterns that separate notebook code from systems: vectorization, concurrency, caching, serialization, and failure handling — each runnable, each measurable.",
    outcomes: ["Vectorize hot loops", "Concurrency done right", "Graceful degradation"],
  },
  functools: {
    tagline: "Small decorators, large leverage",
    description:
      "lru_cache, partial, singledispatch, total_ordering — the standard-library toolkit for cleaner pipelines and free performance. Short, sharp tricks you will use in every codebase you touch.",
    outcomes: ["Cache expensive calls", "Dispatch by type", "Cleaner APIs"],
  },
  nsquaredpizza: {
    tagline: "Feel quadratic pain before it finds you",
    description:
      "Pairwise comparisons explode silently: a million records means a trillion pairs. Work through the N² pizza problem to internalize blocking, bounding, and approximate methods that keep large-scale matching tractable.",
    outcomes: ["Spot hidden O(n²)", "Blocking strategies", "Approximate matching"],
  },
  llmfinetuning: {
    tagline: "Adapt open models on a single GPU",
    description:
      "QLoRA end to end: pick a base model, prepare instruction data, configure rank and quantization, train, merge, and evaluate — without a cluster. The capstone skill that turns platform knowledge into custom model capability.",
    outcomes: ["QLoRA configuration", "Instruction datasets", "Merge & evaluate"],
  },
};

const PLATFORM_STAGES = [
  { icon: "🥉", title: "Store", desc: "Land raw data in layered, versioned lakehouse zones with enforced schemas." },
  { icon: "⏱️", title: "Profile", desc: "Measure pipelines and Python code — find hotspots before optimizing." },
  { icon: "⚙️", title: "Scale", desc: "Kill quadratic blowups, cache smartly, and engineer for throughput." },
  { icon: "🎯", title: "Adapt", desc: "Fine-tune open models on your curated data with QLoRA on one GPU." },
];

const KEY_METRICS = [
  { label: "Pipeline p95 latency", value: "−58%", trend: "after profiling pass", description: "Typical end-to-end ingestion latency reduction after a single measure-first optimization cycle on the reference pipeline." },
  { label: "Gold-table adoption", value: "100%", trend: "zero direct bronze reads", description: "Share of AI features reading from governed gold tables once the medallion layout and access policies are enforced." },
  { label: "Matching cost at 1M records", value: "−99.9%", trend: "blocking vs naive N²", description: "Pairwise comparison cost after blocking and bounding, versus the naive trillion-pair comparison the pizza problem warns about." },
  { label: "Fine-tune hardware", value: "1 GPU", trend: "QLoRA 4-bit", description: "What it takes to adapt a 7–8B open model on domain data: one workstation GPU, quantized base weights, and a clean instruction set." },
];

const FAQS = [
  {
    q: "Where do I start in this hub?",
    a: "Start with Medallion Architecture. It sets up the layered thinking — raw versus curated, governed versus ad hoc — that every later topic assumes. From there, follow the sequence: platform design, test data, profiling, engineering patterns, then the capstone fine-tuning topic.",
  },
  {
    q: "I'm an AI engineer, not a data engineer. Is this hub for me?",
    a: "Yes — that is exactly who it is for. You don't need to become a data engineer, but your models and agents inherit every flaw in the platform beneath them: stale features, slow pipelines, unversioned corpora. These eight topics teach you to demand — and build — a platform your AI can rely on.",
  },
  {
    q: "Why is LLM fine-tuning in a platform hub?",
    a: "Because fine-tuning is where platform work pays off. QLoRA on a single GPU only works when your data is curated (medallion gold), your eval set is trustworthy (test-data discipline), and your training loop is efficient (profiling). It is the capstone that consumes everything upstream.",
  },
  {
    q: "Do the Python topics assume advanced Python?",
    a: "No. The profiling and functools topics assume working Python — functions, imports, pip — and build from there. The engineering simulators are runnable and self-contained, so you learn by measuring real speedups, not by reading theory.",
  },
  {
    q: "What is the N² pizza problem, really?",
    a: "A memorable stand-in for quadratic blowups in matching and comparison workloads: pairwise record linkage, similarity search without an index, nested-loop joins. The topic walks through recognizing O(n²) hiding in innocent code and replacing it with blocking, indexing, or approximation.",
  },
  {
    q: "How do I know my platform is production-ready for AI?",
    a: "Four gates: (1) all model features read from versioned gold tables, (2) ingestion latency and freshness have measured SLAs, (3) a contamination-free golden set gates every model change, and (4) training and serving costs are profiled, not guessed. Each gate maps to topics in this hub.",
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

export default function DataScaleHubTab({ onSelectTab }) {
  const child = getChildById("data_scale");
  const seq = useMemo(() => getChildSequence("data_scale"), []);

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("hub_progress_data_scale");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hub_progress_data_scale", JSON.stringify(progress));
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
        title="Platform & Scale"
        subtitle="Models get the credit; platforms decide whether they survive contact with production."
        description="This hub builds the ground beneath your AI: lakehouse layouts that keep data governed, profiling habits that kill slow pipelines before users feel them, engineering patterns that tame quadratic blowups — and, as the capstone, fine-tuning an open model on a single GPU with QLoRA. Eight practitioner topics, one arc from raw storage to custom model."
        estimatedHours={11}
        totalTopics={seq.length}
        levels={{ 2: seq.filter(id => (getTopicMeta(id).l || 2) === 2).length, 3: seq.filter(id => (getTopicMeta(id).l || 2) === 3).length }}
        icon="⚙️"
        accentColor={C.teal}
      />

      {/* Platform strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        {PLATFORM_STAGES.map((s, i) => (
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
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: C.text }}>The eight topics</h3>
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
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>The questions every team asks before investing in platform work.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {FAQS.map(f => <FaqItem key={f.q} faq={f} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: 24, background: "linear-gradient(135deg, rgba(94,196,200,0.16) 0%, rgba(240,168,154,0.12) 55%, rgba(201,184,232,0.16) 100%)", border: `1px solid ${C.border}`, borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.coral}, ${C.lav}, ${C.teal})`, pointerEvents: "none" }} />
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: C.text }}>Scale is a design choice — make it early.</h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Start with Medallion Architecture, and end with your own fine-tuned model.</p>
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
