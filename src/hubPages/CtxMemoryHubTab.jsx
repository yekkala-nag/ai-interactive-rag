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

// Realistic per-topic positioning copy for the five Memory Systems topics.
const TOPIC_COPY = {
  memeng: {
    tagline: "Give your agent a past",
    description:
      "Stateless models forget everything between calls. Learn the memory primitives — working, episodic, semantic stores, recall policies, and write paths — that turn a chatbot into a system that remembers the user, the task, and what already failed.",
    outcomes: ["Memory primitives", "Recall policies", "Write paths"],
  },
  memhierarchy: {
    tagline: "Hot, warm, cold — like every storage system",
    description:
      "Not all memories deserve the same budget. Tier memory by salience and recency across working, episodic, semantic, and archival layers, with promotion, demotion, and forgetting rules that keep recall fast and costs flat.",
    outcomes: ["Tier by salience", "Promotion rules", "Forgetting on purpose"],
  },
  contextgraph: {
    tagline: "Memory as a graph, not a pile",
    description:
      "Entities, relations, and state that evolve across turns. Model conversation memory as a traversable graph so the agent resolves references, tracks commitments, and updates beliefs instead of re-reading flat transcripts.",
    outcomes: ["Entity tracking", "State evolution", "Reference resolution"],
  },
  validitylayer: {
    tagline: "Remember what is still true",
    description:
      "Memories rot. Tag every stored fact with a validity state — active, stale, superseded, unknown — and check it before acting, so the agent stops confidently executing on last quarter's policy or yesterday's superseded decision.",
    outcomes: ["Validity states", "Pre-action checks", "Supersede handling"],
  },
  companybrain: {
    tagline: "One memory for the whole organization",
    description:
      "Scale personal memory into shared organizational memory: team knowledge graphs, governed write access, and scoped recall. The company brain is how thirty agents stop re-learning what one of them already knew.",
    outcomes: ["Shared knowledge graphs", "Governed writes", "Scoped recall"],
  },
};

const MEMORY_STAGES = [
  { icon: "⚡", title: "Remember", desc: "Add memory primitives — working, episodic, semantic — to a stateless agent." },
  { icon: "🗂️", title: "Tier", desc: "Organize memory into hot, warm, and cold layers with lifecycle rules." },
  { icon: "⬡", title: "Connect", desc: "Link memories into an evolving graph of entities and commitments." },
  { icon: "🧭", title: "Validate", desc: "Track what is still true, and scale memory to the whole company." },
];

const KEY_METRICS = [
  { label: "Repeat questions", value: "−71%", trend: "episodic recall", description: "User repetitions avoided when the agent recalls prior turns, preferences, and settled decisions instead of asking again." },
  { label: "Stale-action incidents", value: "−83%", trend: "validity checks", description: "Actions executed on superseded information, eliminated by pre-action validity checks against tagged memory states." },
  { label: "Memory retrieval p95", value: "180ms", trend: "tiered hot/warm/cold", description: "Recall latency held flat as memory grows, by serving hot tiers first and paging cold archives only on demand." },
  { label: "Duplicated learnings", value: "−64%", trend: "shared company brain", description: "Repeated mistakes across agents avoided once team knowledge — runbooks, policies, past incidents — lives in governed shared memory." },
];

const FAQS = [
  {
    q: "Do I need memory if I already have RAG?",
    a: "RAG retrieves external knowledge; memory retains interaction state — who the user is, what was decided, what already failed. They solve different problems and compose well: RAG answers 'what does the corpus say', memory answers 'what do we already know about this user and task'. Most production agents need both.",
  },
  {
    q: "Why tier memory instead of dumping everything in context?",
    a: "Three reasons: cost (long contexts are expensive every turn), quality (lost-in-the-middle degrades recall as windows fill), and latency. Tiering keeps hot facts instant, warm history one hop away, and cold archives out of the way until explicitly needed.",
  },
  {
    q: "What actually goes stale in agent memory?",
    a: "Almost everything with a timestamp: policies, prices, ownership, decisions, user preferences, tool outputs. The Validity Layer topic exists because teams discover this the hard way — an agent confidently acting on a superseded refund policy is a production incident, not a curiosity.",
  },
  {
    q: "Graph memory sounds heavy. When is it worth it?",
    a: "When references span turns: 'cancel it', 'use the same approach as last time', 'what did we commit to?'. Flat transcript search degrades fast on these; a lightweight entity graph resolves them directly. Start with episodic + semantic stores, add graph structure when reference failures dominate your error log.",
  },
  {
    q: "How does this hub relate to Long Context?",
    a: "Long Context is about fitting more into one window; Memory Systems is about never needing to — by storing, tiering, and recalling across sessions. Bigger windows reduce memory pressure but don't replace lifecycle, validity, or sharing. Do this hub first; long context becomes an optimization, not a crutch.",
  },
  {
    q: "How do I know my agent's memory works?",
    a: "Four checks: (1) it stops asking for information it was already given, (2) recall latency stays flat as history grows, (3) superseded facts are flagged before action, and (4) one agent's learned lesson is visible to the others. Each check maps to a topic in this hub.",
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

export default function CtxMemoryHubTab({ onSelectTab }) {
  const child = getChildById("ctx_memory");
  const seq = useMemo(() => getChildSequence("ctx_memory"), []);

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("hub_progress_ctx_memory");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hub_progress_ctx_memory", JSON.stringify(progress));
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
        title="Memory Systems"
        subtitle="Stateless models forget. Systems remember — if you engineer the memory."
        description="Five topics from first memory primitive to organization-wide brain: give the agent a past, tier it like storage, connect it into a graph, validate what is still true, and share it across the company. Memory is what turns a demo that impresses once into a system that compounds over every interaction."
        estimatedHours={7}
        totalTopics={seq.length}
        levels={{ 1: seq.filter(id => (getTopicMeta(id).l || 1) === 1).length, 2: seq.filter(id => (getTopicMeta(id).l || 1) === 2).length }}
        icon="🧠"
        accentColor={C.teal}
      />

      {/* Memory strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        {MEMORY_STAGES.map((s, i) => (
          <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.tealInk, letterSpacing: "0.08em", marginBottom: 8 }}>
              LAYER {i + 1}
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
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: C.text }}>The five topics</h3>
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
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>The questions every team asks before giving agents a memory.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {FAQS.map(f => <FaqItem key={f.q} faq={f} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: 24, background: "linear-gradient(135deg, rgba(94,196,200,0.16) 0%, rgba(240,168,154,0.12) 55%, rgba(201,184,232,0.16) 100%)", border: `1px solid ${C.border}`, borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.coral}, ${C.lav}, ${C.teal})`, pointerEvents: "none" }} />
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: C.text }}>Demos impress once. Memory compounds.</h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Start with Memory Engineering — the primitives everything else layers on.</p>
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
