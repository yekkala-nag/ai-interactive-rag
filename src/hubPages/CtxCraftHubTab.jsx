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

// Realistic per-topic positioning copy for the four Context Craft topics.
const TOPIC_COPY = {
  ctxeng: {
    tagline: "Write, select, compress, isolate",
    description:
      "The core discipline: compose the model's working set deliberately. Learn the four operations — writing context, selecting what to include, compressing what survives, and isolating untrusted content — that separate reliable systems from prompt-and-pray.",
    outcomes: ["Four operations", "Context budgets", "Untrusted isolation"],
  },
  vague: {
    tagline: "Clarify before you answer",
    description:
      "Vague questions are the default, not the exception. Detect ambiguity, ask the one question that resolves it, and know when to proceed with stated assumptions instead of interrogating the user into frustration.",
    outcomes: ["Ambiguity detection", "Targeted clarification", "Assumption logging"],
  },
  hallucination: {
    tagline: "Catch the confident lie",
    description:
      "Silent hallucinations — fluent, plausible, wrong — are the failure mode that ships to users. Learn detection loops: self-consistency checks, citation grounding, and verification bricks that turn quiet failures into loud, catchable ones.",
    outcomes: ["Grounding checks", "Citation enforcement", "Verification loops"],
  },
  ctxmeasure: {
    tagline: "Score the context, not the vibes",
    description:
      "Recall, precision, faithfulness, answer relevance — define quality metrics for your context pipeline and measure them on golden sets. What gets measured gets fixed; everything else is an anecdote.",
    outcomes: ["Recall & precision", "Faithfulness scoring", "Golden-set evals"],
  },
};

const CRAFT_STAGES = [
  { icon: "✶", title: "Compose", desc: "Write and select the model's working set — deliberately, within budget." },
  { icon: "◉", title: "Clarify", desc: "Resolve vagueness up front instead of guessing through it." },
  { icon: "🚨", title: "Verify", desc: "Ground every claim; turn silent failures into loud ones." },
  { icon: "📐", title: "Measure", desc: "Score context quality on golden sets and fix what the numbers show." },
];

const KEY_METRICS = [
  { label: "Contextual retrieval failures", value: "−49%", trend: "proven pattern", description: "Reduction in retrieval failures reported when each chunk carries LLM-generated context — the flagship result motivating deliberate context composition." },
  { label: "Unnecessary clarifications", value: "−60%", trend: "assumption logging", description: "Back-and-forth turns avoided by proceeding with stated assumptions on low-stakes ambiguity instead of interrogating the user." },
  { label: "Caught hallucinations", value: "3×", trend: "verification loops", description: "More silent failures surfaced before users when citation grounding and consistency checks run as a loop, not a hope." },
  { label: "Eval coverage", value: "100%", trend: "golden-set gating", description: "Share of context-pipeline changes gated by measured recall, precision, and faithfulness — zero ship-on-vibes." },
];

const FAQS = [
  {
    q: "What is context engineering, exactly?",
    a: "The discipline of composing what the model sees: writing instructions, selecting documents, compressing history, and isolating untrusted content — all within a token budget. Prompt engineering is one operation inside it. This hub teaches the full craft: compose, clarify, verify, measure.",
  },
  {
    q: "Should I always ask clarifying questions?",
    a: "No — clarification has a cost in user patience. Ask when the ambiguity changes the answer and the stakes justify one round trip. Otherwise proceed with explicitly stated assumptions the user can correct. The Vague Questions topic teaches exactly where that line sits.",
  },
  {
    q: "How is this hub different from RAG Core?",
    a: "RAG Core covers the retrieval pipeline — finding chunks. Context Craft covers what happens around retrieval: handling vague input, composing the final context window, verifying the output, and measuring quality. They meet at the context window; this hub owns everything the pipeline doesn't guarantee.",
  },
  {
    q: "Do I need this before Memory Systems and Long Context?",
    a: "Yes. Memory Systems assumes you can already compose and verify a single context window; Long Context assumes you can measure one. The four operations taught here — write, select, compress, isolate — are the vocabulary both later hubs build on.",
  },
  {
    q: "What does 'silent' mean in Silent Hallucination Loop?",
    a: "Failures nobody notices: fluent answers with no errors, no exceptions, no alerts — just wrong content delivered confidently. The topic teaches loops that make these failures loud: grounding checks, citation requirements, and consistency probes that catch what monitoring misses.",
  },
  {
    q: "How do I know my context pipeline is good enough?",
    a: "When three things hold on a golden set: recall and precision meet your targets, every factual claim traces to cited context, and regressions are caught by evals before users see them. The Measuring Quality topic sets up exactly this gate.",
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

export default function CtxCraftHubTab({ onSelectTab }) {
  const child = getChildById("ctx_craft");
  const seq = useMemo(() => getChildSequence("ctx_craft"), []);

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("hub_progress_ctx_craft");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem("hub_progress_ctx_craft", JSON.stringify(progress));
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
        title="Context Craft"
        subtitle="The model is only as good as the context you give it — craft it deliberately."
        description="Four topics, one craft: compose the working set, clarify vague input, verify every claim, and measure the whole pipeline. Context Craft is the smallest hub with the highest leverage — every other hub in Context & Memory assumes these four operations. Master them here and everything downstream gets easier."
        estimatedHours={5}
        totalTopics={seq.length}
        levels={{ 1: seq.filter(id => (getTopicMeta(id).l || 1) === 1).length, 2: seq.filter(id => (getTopicMeta(id).l || 1) === 2).length }}
        icon="✂️"
        accentColor={C.teal}
      />

      {/* Craft strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 24 }}>
        {CRAFT_STAGES.map((s, i) => (
          <div key={s.title} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.tealInk, letterSpacing: "0.08em", marginBottom: 8 }}>
              STEP {i + 1}
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
      <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: C.text }}>The four topics</h3>
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
      <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>The questions every team asks before trusting model output.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {FAQS.map(f => <FaqItem key={f.q} faq={f} />)}
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: 24, background: "linear-gradient(135deg, rgba(94,196,200,0.16) 0%, rgba(240,168,154,0.12) 55%, rgba(201,184,232,0.16) 100%)", border: `1px solid ${C.border}`, borderRadius: 16, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.teal}, ${C.coral}, ${C.lav}, ${C.teal})`, pointerEvents: "none" }} />
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: C.text }}>Smallest hub, highest leverage.</h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>Start with Context Engineering — the four operations everything else assumes.</p>
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
