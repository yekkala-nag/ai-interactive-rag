import React, { useState } from "react";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

function ClusteringPipeline() {
  const [step, setStep] = useState(0);
  const [minCluster, setMinCluster] = useState(8);
  const [minSamples, setMinSamples] = useState(3);

  const steps = [
    { name: "Raw Text", desc: "150 newsgroup documents (sci.space, sci.med, rec.autos)", color: C.teal, icon: "📄" },
    { name: "SentenceTransformer", desc: "all-MiniLM-L6-v2 → 384-dim embeddings", color: C.coral, icon: "🧠" },
    { name: "UMAP", desc: "Dimensionality reduction: 384 → 5 dimensions", color: C.lav, icon: "📉" },
    { name: "HDBSCAN", desc: `Density-based clustering (min_cluster=${minCluster})`, color: C.tealDark, icon: "🔬" },
    { name: "Topics", desc: "Auto-discovered clusters with sample documents", color: C.coralDeep, icon: "🎯" },
  ];

  const clusters = [
    {
      id: 0, label: "Space & Medicine", count: 101, color: C.teal,
      samples: [
        "I was at an interesting seminar at work (UK's R.A.L. Space Science Dept.)...",
        "This is the second post which seems to be blurring the distinction between real disease...",
        "The latest findings from the Mars rover suggest potential microbial life...",
      ],
    },
    {
      id: 1, label: "Automotive", count: 49, color: C.coral,
      samples: [
        "It's great that all these other cars can out-handle, out-corner, and out-accelerate an Integra...",
        "Diamond star cars (Talon/Eclipse/Laser) put out 190 hp in the turbo models...",
        "The new BMW M3 has incredible handling but the price is steep...",
      ],
    },
  ];

  return (
    <Card>
      <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        TEXT CLUSTERING PIPELINE
      </div>

      {/* Pipeline steps */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              padding: "8px 4px", borderRadius: 6,
              background: i <= step ? s.color + "22" : C.surface,
              border: `1px solid ${i <= step ? s.color : C.border}`,
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
              <div style={{ color: i <= step ? s.color : C.muted, fontSize: 9, fontWeight: 600 }}>{s.name}</div>
              {i <= step && <div style={{ color: C.muted, fontSize: 7, marginTop: 2 }}>{s.desc}</div>}
            </div>
            {i < steps.length - 1 && (
              <div style={{ color: i < step ? s.color : C.border, fontSize: 10, marginTop: 4 }}>→</div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => setStep(step < 4 ? step + 1 : 0)} style={{
        padding: "8px 20px", borderRadius: 6, background: C.teal, color: "#000", border: "none",
        fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16,
      }}>{step < 4 ? "▶ Next Step" : "↻ Reset"}</button>

      {/* HDBSCAN params */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>min_cluster_size</div>
          <input type="range" min={3} max={20} value={minCluster} onChange={e => setMinCluster(Number(e.target.value))} style={{ width: "100%", accentColor: C.teal }} />
          <div style={{ color: C.teal, fontSize: 14, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>{minCluster}</div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>min_samples</div>
          <input type="range" min={1} max={10} value={minSamples} onChange={e => setMinSamples(Number(e.target.value))} style={{ width: "100%", accentColor: C.coral }} />
          <div style={{ color: C.coral, fontSize: 14, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>{minSamples}</div>
        </div>
      </div>

      {/* Cluster visualization */}
      {step >= 4 && (
        <div>
          <div style={{ background: "#0A0E14", borderRadius: 8, padding: 16, marginBottom: 12, position: "relative", height: 220 }}>
            <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
              {/* Grid */}
              {[20, 40, 60, 80].map(v => (
                <g key={v}>
                  <line x1={v} y1="0" x2={v} y2="100" stroke={C.border} strokeWidth="0.3" strokeDasharray="1,2" />
                  <line x1="0" y1={v} x2="100" y2={v} stroke={C.border} strokeWidth="0.3" strokeDasharray="1,2" />
                </g>
              ))}
              {/* Cluster 0 - scattered upper area */}
              {Array.from({ length: 30 }, (_, i) => {
                const x = 15 + Math.sin(i * 0.7) * 20 + (i % 5) * 4;
                const y = 20 + Math.cos(i * 0.5) * 15 + (i % 4) * 3;
                return <circle key={`c0-${i}`} cx={x} cy={y} r="1.2" fill={C.teal} opacity="0.6" />;
              })}
              {/* Cluster 1 - scattered lower area */}
              {Array.from({ length: 20 }, (_, i) => {
                const x = 55 + Math.sin(i * 0.9) * 18 + (i % 4) * 4;
                const y = 55 + Math.cos(i * 0.6) * 18 + (i % 5) * 3;
                return <circle key={`c1-${i}`} cx={x} cy={y} r="1.2" fill={C.coral} opacity="0.6" />;
              })}
              {/* Cluster labels */}
              <text x="25" y="12" textAnchor="middle" fill={C.teal} fontSize="4" fontFamily="JetBrains Mono, monospace" fontWeight="700">Cluster 0 (101 docs)</text>
              <text x="70" y="50" textAnchor="middle" fill={C.coral} fontSize="4" fontFamily="JetBrains Mono, monospace" fontWeight="700">Cluster 1 (49 docs)</text>
            </svg>
          </div>

          {/* Cluster details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {clusters.map(c => (
              <div key={c.id} style={{ padding: "12px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${c.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: c.color, fontWeight: 700, fontSize: 12 }}>Topic #{c.id}: {c.label}</span>
                  <span style={{ color: C.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{c.count} docs</span>
                </div>
                {c.samples.map((s, i) => (
                  <div key={i} style={{ color: C.muted, fontSize: 10, marginBottom: 2, paddingLeft: 8, borderLeft: `2px solid ${c.color}33` }}>
                    {s}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function ComparisonTable() {
  const methods = [
    { name: "K-Means", requiresK: "Yes", noise: "No", density: "No", autoK: "No", color: C.muted },
    { name: "DBSCAN", requiresK: "No", noise: "Yes", density: "Yes", autoK: "Partial", color: C.muted },
    { name: "HDBSCAN", requiresK: "No", noise: "Yes", density: "Yes", autoK: "Yes", color: C.teal },
    { name: "GMM", requiresK: "Yes", noise: "No", density: "Soft", autoK: "No", color: C.muted },
  ];

  return (
    <Card>
      <div style={{ color: C.coral, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        WHY HDBSCAN FOR TEXT?
      </div>

      <div style={{ background: "#0A0E14", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 1, background: C.border }}>
          {["ALGORITHM", "REQUIRES K?", "HANDLES NOISE", "DENSITY-BASED", "AUTO K"].map(h => (
            <div key={h} style={{ padding: "6px 10px", background: C.s3, color: C.muted, fontSize: 9, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{h}</div>
          ))}
        </div>
        {methods.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 1, background: m.color === C.teal ? C.teal + "11" : C.bg }}>
            <div style={{ padding: "6px 10px", color: m.color === C.teal ? C.teal : C.text, fontSize: 10, fontWeight: m.color === C.teal ? 700 : 400, fontFamily: "JetBrains Mono, monospace" }}>{m.name}</div>
            <div style={{ padding: "6px 10px", color: m.requiresK === "Yes" ? C.coral : C.teal, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{m.requiresK}</div>
            <div style={{ padding: "6px 10px", color: m.noise === "Yes" ? C.teal : C.coral, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{m.noise}</div>
            <div style={{ padding: "6px 10px", color: m.density !== "No" ? C.teal : C.coral, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{m.density}</div>
            <div style={{ padding: "6px 10px", color: m.autoK === "Yes" ? C.teal : C.autoK === "Partial" ? C.lav : C.coral, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{m.autoK}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, padding: "10px 14px", background: C.s3, borderRadius: 8, borderLeft: `3px solid ${C.teal}` }}>
        <div style={{ color: C.teal, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>HDBSCAN Advantages for Text Clustering</div>
        <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6 }}>
          No need to pre-specify the number of clusters. Automatically detects noise/outliers that would distort group statistics. Density-based approach handles irregularly shaped clusters common in embedding space.
        </div>
      </div>
    </Card>
  );
}

function PipelineCode() {
  const [activeTab, setActiveTab] = useState(0);
  const codes = [
    { name: "Embeddings", lang: "Python", code: `from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(df['text'].tolist(),
                          show_progress_bar=True)
# Shape: (150, 384)` },
    { name: "UMAP", lang: "Python", code: `import umap

reducer = umap.UMAP(
    n_neighbors=15,
    n_components=5,
    min_dist=0.0,
    random_state=42
)
reduced = reducer.fit_transform(embeddings)
# Shape: (150, 5)` },
    { name: "HDBSCAN", lang: "Python", code: `from sklearn.cluster import HDBSCAN

clusterer = HDBSCAN(
    min_cluster_size=8,
    min_samples=3,
    store_centers='centroid'
)
labels = clusterer.fit_predict(reduced)
# Labels: [0, 0, 1, 0, -1, ...]` },
    { name: "Pipeline", lang: "Python", code: `from sklearn.pipeline import Pipeline

pipeline = Pipeline([
    ("embedder", SentenceTransformerEmbedder()),
    ("reducer", UMAPReducer(n_components=5)),
    ("clusterer", HDBSCAN(min_cluster_size=8))
])

labels = pipeline.fit_predict(texts)` },
  ];

  const c = codes[activeTab];

  return (
    <Card>
      <div style={{ color: C.lav, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        IMPLEMENTATION CODE
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {codes.map((code, i) => (
          <button key={i} onClick={() => setActiveTab(i)} style={{
            padding: "6px 12px", borderRadius: 6,
            background: activeTab === i ? C.lav + "22" : C.surface,
            border: `1px solid ${activeTab === i ? C.lav : C.border}`,
            color: activeTab === i ? C.lav : C.muted, fontSize: 11, cursor: "pointer",
          }}>{code.name}</button>
        ))}
      </div>

      <div style={{ background: "#0A0E14", borderRadius: 8, padding: 14 }}>
        <pre style={{ margin: 0, color: C.teal, fontSize: 11, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{c.code}</pre>
      </div>
    </Card>
  );
}

export default function TextClusteringHDBSCANTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>MACHINE LEARNING MASTERY · JUNE 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>Clustering Unstructured Text with LLM Embeddings and HDBSCAN</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          Discover hidden topics in unlabeled text by combining sentence-transformers embeddings with UMAP dimensionality reduction and HDBSCAN density-based clustering.
        </div>
      </div>

      <Card>
        <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>STACK</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[
            { name: "sentence-transformers", desc: "all-MiniLM-L6-v2 embeddings", icon: "🧠", color: C.teal },
            { name: "UMAP", desc: "384 → 5 dim reduction", icon: "📉", color: C.coral },
            { name: "HDBSCAN", desc: "Density-based clustering", icon: "🔬", color: C.lav },
            { name: "20newsgroups", desc: "sci.space, sci.med, rec.autos", icon: "📰", color: C.tealDark },
          ].map((t, i) => (
            <div key={i} style={{ padding: "10px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${t.color}`, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ color: t.color, fontWeight: 700, fontSize: 10, marginBottom: 2 }}>{t.name}</div>
              <div style={{ color: C.muted, fontSize: 9 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <ClusteringPipeline />
      <ComparisonTable />
      <PipelineCode />

      <Card style={{ border: `1px solid ${C.teal}33` }}>
        <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          LLM embeddings capture semantic meaning that traditional TF-IDF misses. HDBSCAN auto-discovers the number of clusters and handles noise points gracefully. The pipeline (embed → reduce → cluster) is a powerful pattern for any unlabeled text data — no labels needed, no K to pre-specify.
        </div>
      </Card>
    </div>
  );
}