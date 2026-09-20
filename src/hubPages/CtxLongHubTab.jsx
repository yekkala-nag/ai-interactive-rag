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

// Realistic per-topic positioning copy for the two Long Context topics.
const TOPIC_COPY = {
  contextlimits: {
    tagline: "A million tokens is not infinite understanding",
    description:
      "What 1M-token windows actually buy you — and what breaks inside them. Lost-in-the-middle, attention dilution, and working-memory limits: learn where big windows help, where they silently degrade, and how to test the difference on your own workload.",
    outcomes: ["Lost-in-the-middle", "Window vs working memory", "Needle testing"],
  },
  longcontext: {
    tagline: "Fit more signal in every window",
    description:
      "The practitioner playbook for long inputs: retrieve-then-read, compaction and summarization, anchor placement, structured extraction, and context compression. Tactics that hold quality flat as inputs grow from pages to books.",
    outcomes: ["Retrieve-then-read", "Compaction & anchors", "Compression tactics"],
  },
};

const WINDOW_STAGES = [
  { icon: "🧠", title: "Know the limits", desc: "A 1M window holds everything and attends to little — learn exactly where." },
  { icon: "📍", title: "Place anchors", desc: "Position critical facts where attention actually lands: edges, repeats, summaries." },
  { icon: "🗜️", title: "Compress", desc: "Summarize, compact, and distill before the window fills with noise." },
  { icon: "🔍", title: "Retrieve first", desc: "Shrink the haystack before searching it — long context is the last resort." },
];

const KEY_METRICS = [
  { label: "Mid-window recall drop", value: "−38%", trend: "lost in the middle", description: "Typical accuracy loss for facts buried mid-window versus window edges — the effect every long-context design must route around." },
  { label: "Needle retrieval @ 1M", value: "92%", trend: "single fact, clean haystack", description: "What frontier models score finding one planted fact — versus far lower on multi-hop reasoning over the same window. Retrieval is not comprehension." },
  { label: "Compaction savings", value: "−70%", trend: "summary chains", description: "Tokens saved by compacting history into rolling summaries instead of carrying full transcripts across long sessions." },
  { label: "Retrieve-then-read lift", value: "+31%", trend: "vs full-window dump", description: "Quality gained by retrieving the relevant slice first instead of stuffing the entire corpus into the window and hoping." },
];

const FAQS = [
  {
    q: "If models accept 1M tokens, why not just paste everything in?",
    a: "Because acceptance is not comprehension. Accuracy degrades toward the middle of long windows, costs scale linearly with every token on every turn, and latency climbs. The first topic measures these limits; the second teaches you to need the big window as rarely as possible.",
  },
  {
    q: "Does long context replace RAG?",
    a: "No — it changes RAG's job. Retrieval narrows a corpus to the relevant slice; the long window then reasons over that slice comfortably. Teams that delete retrieval and dump everything into context typically see worse quality at higher cost. Retrieve first, reason over the result.",
  },
  {
    q: "What is lost-in-the-middle, practically?",
    a: "Models recall facts at the start and end of long inputs far better than facts in the middle. Practically: put instructions and critical evidence at the edges, repeat key constraints, and verify mid-window facts with targeted re-reads. Anchor placement is a first-class skill in the tactics topic.",
  },
  {
    q: "How does this hub relate to Memory Systems?",
    a: "Memory Systems stores knowledge across sessions so you never need giant windows; Long Context handles the single session that genuinely is huge. Do Memory Systems first — many 'we need bigger context' problems are actually 'we have no memory' problems.",
  },
  {
    q: "When is compaction better than a bigger window?",
    a: "In long multi-turn sessions: rolling summaries of settled work preserve decisions at a fraction of the token cost, keep attention dense, and create an auditable trail. Compaction wins whenever history grows but its details stop mattering — which is most sessions past the first dozen turns.",
  },
  {
    q: "How do I know my long-context handling works?",
    a: "Stress it like the research does: plant needles at multiple depths, require multi-hop connections across distant sections, and measure quality as input length grows 10×. Flat scores across lengths mean your tactics work; a mid-window sag means anchors and retrieval need attention.",
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

export default function CtxLongHubTab({ onSelectTab }) {
  const child = getChildById("ctx_long");
  const seq = useMemo(() => getChildSequence("ctx_long"), []);

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("hub_progress_ctx_long");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hub_progress_ctx_long", JSON.stringify(progress));
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
        title="Long Context"
        subtitle="Big windows are powerful — and silently lossy in the middle."
        description="The smallest hub and the only one with an unambiguous order: first learn what million-token windows can and cannot do, then learn the tactics that keep quality flat as inputs grow. Two topics, one arc — from measuring the limits to routing around them with retrieval, anchors, and compression."
        estimatedHours={3}
        totalTopics={seq.length}
        levels={{ 1: seq.filter(id => (getTopicMeta(id).l || 1) === 1).length, 2: seq.filter(id => (getTopicMeta(id).l || 1) === 2).length }}
        icon="📏"
        accentColor={C.teal}
      />

      {/* Window strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        {WINDOW_STAGES.map((s, i) => (
          <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.tealInk, letterSpacing: "0.08em", marginBottom: 8 }}>
              RULE {i + 1}
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
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: C.text }}>The two topics</h3>
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Take them in order — limits first, tactics second. Tick topics off as you finish them.</p>
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
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>The questions every team asks before stuffing the window.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {FAQS.map(f => <FaqItem key={f.q} faq={f} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: 24, background: "linear-gradient(135deg, rgba(94,196,200,0.16) 0%, rgba(240,168,154,0.12) 55%, rgba(201,184,232,0.16) 100%)", border: `1px solid ${C.border}`, borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.coral}, ${C.lav}, ${C.teal})`, pointerEvents: "none" }} />
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: C.text }}>Measure the window before you fill it.</h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Start with 1M Context Limits — then earn the tactics.</p>
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
