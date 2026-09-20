import React, { useState, useEffect } from "react";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#E8837A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
  purple: "#8b5cf6", amber: "#f59e0b", green: "#14b8a6",
};

const LEVEL_BADGES = {
  1: { label: "L1", color: "#5EC4C8" },
  2: { label: "L2", color: "#9B89C4" },
  3: { label: "L3", color: "#E8837A" },
};

const TOPIC_GROUPS = [
  {
    key: "classical",
    title: "Classical ML Foundation",
    icon: "📊",
    color: "#3A9B9F",
    topics: [
      { id: "linearregression", title: "Linear Regression & Gradient Descent", level: 1, desc: "Cost functions, MSE/MAE, weight update rules" },
      { id: "classicalml", title: "Classical ML for Agents", level: 1, desc: "6 reasons classical ML beats LLM guesses, integration patterns" },
      { id: "frauddetectionml", title: "Fraud Detection ML", level: 2, desc: "6 models benchmark, cost-sensitive optimization, production pillars" },
      { id: "timeseriesanomaly", title: "Time-Series Anomaly", level: 2, desc: "Detection tactics, lost-in-the-middle, needle-in-haystack" },
    ]
  },
  {
    key: "selfsupervised",
    title: "Self-Supervised / Generative",
    icon: "🎲",
    color: "#8b5cf6",
    topics: [
      { id: "vaes", title: "Variational Autoencoders", level: 2, desc: "ELBO, reparameterization trick, latent space & generative modeling" },
      { id: "byol", title: "BYOL (Bootstrap Your Own Latent)", level: 2, desc: "Self-supervised learning, contrastive loss, representation collapse" },
    ]
  },
  {
    key: "modern",
    title: "Modern Architectures",
    icon: "🏛️",
    color: "#f59e0b",
    topics: [
      { id: "keras3", title: "Keras 3", level: 2, desc: "Multi-backend NMT architecture, ONNX, unified acceleration" },
      { id: "xlstm", title: "xLSTM", level: 2, desc: "Extended LSTM with long-range dependencies, convolution hybrid" },
    ]
  },
  {
    key: "appliednlp",
    title: "Applied NLP",
    icon: "🌍",
    color: "#14b8a6",
    topics: [
      { id: "multilingualclassification", title: "Multilingual Classification", level: 2, desc: "Cross-lingual routing, MTE5, BGE-M3, entity drift" },
      { id: "textclusteringhdbscan", title: "Text Clustering (HDBSCAN)", level: 2, desc: "Density-based clustering, topic discovery, pipeline stepper" },
    ]
  }
];

const TOPIC_META_MAP = {
  linearregression: { l: 1, p: [] },
  classicalml: { l: 1, p: [] },
  frauddetectionml: { l: 2, p: ["classicalml"] },
  timeseriesanomaly: { l: 2, p: ["classicalml"] },
  vaes: { l: 2, p: ["linearregression"] },
  byol: { l: 2, p: ["vaes"], deep: true },
  keras3: { l: 2, p: ["classicalml"] },
  xlstm: { l: 2, p: ["classicalml"], deep: true },
  multilingualclassification: { l: 2, p: ["classicalml"] },
  textclusteringhdbscan: { l: 2, p: ["classicalml"] },
};

function ProgressRing({ pct }) {
  const r = 37;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
      <circle cx="40" cy="40" r={r} fill="none" stroke={C.border} strokeWidth={6} />
      <circle cx="40" cy="40" r={r} fill="none" stroke={C.teal} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.3s" }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fontSize={17} fontWeight={700} fontFamily="JetBrains Mono, monospace" fill={C.teal}>
        {pct}%
      </text>
    </svg>
  );
}

export default function DataMlHubTab({ onSelectTab }) {
  const allTopics = TOPIC_GROUPS.flatMap(g => g.topics.map(t => t.id));

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem("hub_progress_data_ml");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try { localStorage.setItem("hub_progress_data_ml", JSON.stringify(progress)); } catch {}
  }, [progress]);

  const toggleDone = (id) => {
    setProgress(p => ({
      completed: (p?.completed || []).includes(id)
        ? (p.completed || []).filter(t => t !== id)
        : [...(p?.completed || []), id],
    }));
  };

  const completedCount = (progress.completed || []).filter(id => allTopics.includes(id)).length;
  const totalCount = allTopics.length;
  const pct = totalCount ? Math.min(100, Math.round((completedCount / totalCount) * 100)) : 0;

  return (
    <div style={{ paddingBottom: 64 }}>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg,#0b1a1f,#12182a,#1a1028)", border: "1px solid #2A3548", borderRadius: 10, padding: "2rem", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#5EC4C8,#F0A89A,#C9B8E8,#5EC4C8)" }} />
        <div style={{ position: "absolute", right: "1.5rem", top: "0.5rem", fontFamily: "Playfair Display, serif", fontSize: "5rem", fontWeight: 900, color: "rgba(94,196,200,0.06)", lineHeight: 1, pointerEvents: "none" }}>📈</div>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: C.teal, marginBottom: 12 }}>Data & Platform Layers · Machine Learning Foundations</div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.8rem", fontWeight: 900, lineHeight: 1.1, marginBottom: 12, color: C.text }}>
          Classical + Self-Supervised <span style={{ color: C.teal }}>Machine Learning</span>
        </h1>
        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, maxWidth: 680, marginBottom: 16 }}>
          From classical discriminative models to modern self-supervised representation learning. Explore classical ML frameworks, fraud detection systems, VAE generative modeling, and multilingual NLP pipelines.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { val: "10", label: "Topics", sub: "L1 & L2 curated", color: C.teal },
            { val: "4", label: "Groups", sub: "Classical → NLP", color: C.coral },
            { val: "6", label: "Interactive", sub: "Labs & Simulators", color: C.lav },
            { val: "0", label: "Prompt Eng.", sub: "All real models", color: C.coral },
          ].map((m, i) => (
            <div key={i} style={{ background: C.s2, border: "1px solid #2A3548", borderRadius: 6, padding: "0.9rem", textAlign: "center" }}>
              <div style={{ fontFamily: "Playfair Display, serif", fontSize: "1.5rem", fontWeight: 900, color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.val}</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROGRESS */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, marginBottom: 24, alignItems: "center" }}>
        <ProgressRing pct={pct} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: C.muted }}>Progress</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: C.teal }}>
              {completedCount} / {totalCount} topics
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 12, color: C.muted }}>
            <span>L1: {TOPIC_GROUPS.reduce((n, g) => n + g.topics.filter(t => t.level === 1).length, 0)}</span>
            <span>L2: {TOPIC_GROUPS.reduce((n, g) => n + g.topics.filter(t => t.level === 2).length, 0)}</span>
          </div>
        </div>
      </div>

      {/* CATEGORY GROUPS */}
      {TOPIC_GROUPS.map(group => (
        <div key={group.key} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ padding: "3px 10px", borderRadius: 6, fontSize: 14, background: group.color + "22", color: group.color, border: "1px solid " + group.color + "44" }}>
              {group.icon}
            </span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>{group.title}</h2>
            <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, background: group.color + "15", color: group.color }}>
              {group.topics.length} topics
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {group.topics.map(topic => {
              const meta = TOPIC_META_MAP[topic.id] || { l: 1, p: [] };
              const completed = (progress.completed || []).includes(topic.id);
              const badge = LEVEL_BADGES[meta.l] || LEVEL_BADGES[1];
              const pending = (meta.p || []).filter(p => !(progress.completed || []).includes(p));

              return (
                <div key={topic.id} onClick={() => onSelectTab(topic.id)}
                  style={{
                    background: completed ? group.color + "08" : C.s2,
                    border: "1px solid " + (completed ? group.color : C.border),
                    borderRadius: 10,
                    padding: 16,
                    cursor: "pointer",
                    opacity: 1,
                    transition: "all 0.2s",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                      background: completed ? group.color + "22" : "transparent",
                      color: completed ? group.color : C.muted,
                      border: "1px solid " + (completed ? group.color : C.border),
                    }}>
                      {badge.label}
                    </span>
                    {completed && <span style={{ color: group.color, fontSize: 16 }}>✓</span>}
                  </div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: C.text }}>
                    {topic.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                    {topic.desc}
                  </p>
                  {topic.level === 2 && meta.p && meta.p.length > 0 && (
                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid " + C.border, fontSize: 10, color: C.muted }}>
                      {pending.length ? `Suggested after: ${pending.join(", ")}` : "Prerequisites complete ✓"}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSelectTab(topic.id); }}
                      style={{ flex: 1, padding: "9px 12px", background: "transparent", color: C.teal, border: "1px solid " + C.teal, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      Open topic →
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleDone(topic.id); }}
                      title={completed ? "Mark as not done" : "Mark as done"}
                      style={{ padding: "9px 12px", background: completed ? C.teal : "transparent", color: completed ? "#000" : C.muted, border: "1px solid " + (completed ? C.teal : C.border), borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      {completed ? "✓ Done" : "Mark done"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* NAVIGATION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid " + C.border }}>
        <button onClick={() => onSelectTab("data_docs_hub")}
          style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: "transparent", color: C.teal, border: "1px solid " + C.teal }}>
          ← Document Intelligence
        </button>
        <button onClick={() => onSelectTab("data_found_hub")}
          title="Back to Data Foundations (start of Data & Platform Layers)"
          style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: "transparent", color: C.teal, border: "1px solid " + C.teal, margin: "0 8px" }}>
          Back to Data Foundations
        </button>
        <button onClick={() => onSelectTab("data_scale_hub")}
          style={{ padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: C.teal, color: "#000", border: "none" }}>
          Platform & Scale →
        </button>
      </div>
    </div>
  );
}
