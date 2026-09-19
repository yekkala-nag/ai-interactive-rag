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

function EmbeddingSpaceVisualizer() {
  const [language, setLanguage] = useState("en");
  const [hoveredPair, setHoveredPair] = useState(null);

  const phrases = {
    en: [
      { text: "This product is fantastic!", sentiment: "positive", x: 75, y: 25 },
      { text: "Great quality and fast shipping", sentiment: "positive", x: 80, y: 30 },
      { text: "Terrible experience, never again", sentiment: "negative", x: 20, y: 70 },
      { text: "Worst purchase I've ever made", sentiment: "negative", x: 25, y: 75 },
      { text: "It's okay, nothing special", sentiment: "neutral", x: 50, y: 50 },
      { text: "Average product for the price", sentiment: "neutral", x: 45, y: 45 },
    ],
    es: [
      { text: "¡Este producto es fantástico!", sentiment: "positive", x: 76, y: 24 },
      { text: "Gran calidad y envío rápido", sentiment: "positive", x: 78, y: 28 },
      { text: "Experiencia terrible, nunca más", sentiment: "negative", x: 22, y: 68 },
      { text: "La peor compra que he hecho", sentiment: "negative", x: 23, y: 73 },
      { text: "Está bien, nada especial", sentiment: "neutral", x: 48, y: 52 },
      { text: "Producto promedio por el precio", sentiment: "neutral", x: 47, y: 48 },
    ],
  };

  const sentimentColors = { positive: C.teal, negative: C.coral, neutral: C.lav };

  return (
    <Card>
      <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        INTERACTIVE: MULTILINGUAL EMBEDDING SPACE
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["en", "es"].map(lang => (
          <button key={lang} onClick={() => setLanguage(lang)} style={{
            padding: "6px 16px", borderRadius: 6,
            background: language === lang ? C.teal + "22" : C.surface,
            border: `1px solid ${language === lang ? C.teal : C.border}`,
            color: language === lang ? C.teal : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600,
          }}>{lang === "en" ? "🇺🇸 English" : "🇪🇸 Spanish"}</button>
        ))}
        <button onClick={() => setLanguage("both")} style={{
          padding: "6px 16px", borderRadius: 6,
          background: language === "both" ? C.coral + "22" : C.surface,
          border: `1px solid ${language === "both" ? C.coral : C.border}`,
          color: language === "both" ? C.coral : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600,
        }}>Both (Overlap)</button>
      </div>

      <div style={{ background: "#0A0E14", borderRadius: 8, padding: 16, position: "relative", height: 280, marginBottom: 12 }}>
        {/* Grid */}
        <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
          {[20, 40, 60, 80].map(v => (
            <g key={v}>
              <line x1={v} y1="0" x2={v} y2="100" stroke={C.border} strokeWidth="0.3" strokeDasharray="1,2" />
              <line x1="0" y1={v} x2="100" y2={v} stroke={C.border} strokeWidth="0.3" strokeDasharray="1,2" />
            </g>
          ))}
          {/* Axis labels */}
          <text x="50" y="98" textAnchor="middle" fill={C.muted} fontSize="3" fontFamily="JetBrains Mono, monospace">Semantic Dimension 1</text>
          <text x="2" y="50" textAnchor="middle" fill={C.muted} fontSize="3" fontFamily="JetBrains Mono, monospace" transform="rotate(-90, 2, 50)">Semantic Dimension 2</text>
        </svg>

        {/* Data points */}
        {(language === "both" ? [...phrases.en, ...phrases.es] : phrases[language] || []).map((p, i) => (
          <div key={i} style={{
            position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
            transform: "translate(-50%, -50%)", cursor: "pointer",
          }}
          onMouseEnter={() => setHoveredPair(i)}
          onMouseLeave={() => setHoveredPair(null)}>
            <div style={{
              width: hoveredPair === i ? 14 : 10, height: hoveredPair === i ? 14 : 10,
              borderRadius: "50%", background: sentimentColors[p.sentiment],
              boxShadow: `0 0 8px ${sentimentColors[p.sentiment]}66`,
              transition: "all 0.2s",
            }} />
            {hoveredPair === i && (
              <div style={{
                position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                background: C.s3, border: `1px solid ${C.border}`, borderRadius: 4,
                padding: "4px 8px", whiteSpace: "nowrap", fontSize: 9, color: C.text,
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {p.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        {Object.entries(sentimentColors).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v }} />
            <span style={{ color: C.muted, fontSize: 10, textTransform: "capitalize" }}>{k}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, padding: "10px 14px", background: C.s3, borderRadius: 8, borderLeft: `3px solid ${C.teal}` }}>
        <div style={{ color: C.teal, fontWeight: 600, fontSize: 12 }}>BGE-M3 maps "fantastic!" and "¡fantástico!" to nearly identical vectors</div>
        <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Language barriers disappear — the classifier sees meaning, not vocabulary.</div>
      </div>
    </Card>
  );
}

function PipelineSimulator() {
  const [step, setStep] = useState(0);
  const [sampleText, setSampleText] = useState("This product is amazing, I love it!");
  const [predicted, setPredicted] = useState(null);

  const steps = [
    { name: "Input", desc: "Raw text in any language", color: C.teal },
    { name: "BGE-M3", desc: "Generate 1024-dim multilingual embedding", color: C.coral },
    { name: "LogisticRegression", desc: "Classify into 5-star rating (0-4)", color: C.lav },
    { name: "Output", desc: "Predicted star rating with confidence", color: C.tealDark },
  ];

  const sampleTexts = [
    { text: "This product is amazing, I love it!", lang: "EN", rating: 4 },
    { text: "¡Este producto es fantástico!", lang: "ES", rating: 4 },
    { text: "Terrible quality, broke after one day", lang: "EN", rating: 0 },
    { text: "Es horrible, no lo recomiendo", lang: "ES", rating: 0 },
    { text: "It's okay, nothing special", lang: "EN", rating: 2 },
    { text: "Está bien, nada especial", lang: "ES", rating: 2 },
  ];

  const runPipeline = () => {
    setStep(0);
    setPredicted(null);
    let i = 0;
    const timer = setInterval(() => {
      setStep(i + 1);
      i++;
      if (i >= steps.length) {
        clearInterval(timer);
        const match = sampleTexts.find(s => s.text === sampleText);
        setPredicted(match ? match.rating : 2);
      }
    }, 600);
  };

  return (
    <Card>
      <div style={{ color: C.coral, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        SCIKIT-LLM CLASSIFICATION PIPELINE
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {sampleTexts.map((s, i) => (
          <button key={i} onClick={() => setSampleText(s.text)} style={{
            padding: "4px 10px", borderRadius: 4, fontSize: 10, cursor: "pointer",
            background: sampleText === s.text ? C.coral + "22" : C.surface,
            border: `1px solid ${sampleText === s.text ? C.coral : C.border}`,
            color: sampleText === s.text ? C.coral : C.muted,
          }}>{s.lang === "EN" ? "🇺🇸" : "🇪🇸"} {s.text.slice(0, 25)}...</button>
        ))}
      </div>

      <div style={{ background: "#0A0E14", borderRadius: 8, padding: 14, marginBottom: 12 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>INPUT TEXT</div>
        <div style={{ color: C.text, fontSize: 13, fontStyle: "italic" }}>"{sampleText}"</div>
      </div>

      {/* Pipeline steps */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            <div style={{
              padding: "8px 4px", borderRadius: 6,
              background: i < step ? s.color + "22" : C.surface,
              border: `1px solid ${i < step ? s.color : C.border}`,
              transition: "all 0.3s",
            }}>
              <div style={{ color: i < step ? s.color : C.muted, fontSize: 10, fontWeight: 600 }}>{s.name}</div>
              {i < step && <div style={{ color: C.muted, fontSize: 8, marginTop: 2 }}>{s.desc}</div>}
            </div>
            {i < steps.length - 1 && (
              <div style={{ color: i < step ? s.color : C.border, fontSize: 12, marginTop: 4 }}>→</div>
            )}
          </div>
        ))}
      </div>

      <button onClick={runPipeline} style={{
        padding: "8px 20px", borderRadius: 6, background: C.coral, color: "#000", border: "none",
        fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 16,
      }}>▶ Run Pipeline</button>

      {predicted !== null && (
        <div style={{ padding: "12px", background: C.s3, borderRadius: 8, borderLeft: `3px solid ${C.teal}`, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>PREDICTED RATING</div>
          <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 8 }}>
            {[0, 1, 2, 3, 4].map(r => (
              <div key={r} style={{
                width: 32, height: 32, borderRadius: 6,
                background: r === predicted ? C.teal : C.surface,
                border: `1px solid ${r === predicted ? C.teal : C.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: r === predicted ? "#000" : C.muted, fontSize: 12, fontWeight: 700,
              }}>{r + 1}⭐</div>
            ))}
          </div>
          <div style={{ color: C.teal, fontSize: 11 }}>Class {predicted} ({predicted + 1}-star review) — same prediction for EN and ES</div>
        </div>
      )}
    </Card>
  );
}

function ResultsTable() {
  const results = [
    { cls: "1-star (0)", precision: 0.66, recall: 0.78, f1: 0.72, support: 82 },
    { cls: "2-star (1)", precision: 0.40, recall: 0.30, f1: 0.34, support: 64 },
    { cls: "3-star (2)", precision: 0.46, recall: 0.46, f1: 0.46, support: 91 },
    { cls: "4-star (3)", precision: 0.56, recall: 0.54, f1: 0.55, support: 84 },
    { cls: "5-star (4)", precision: 0.71, recall: 0.73, f1: 0.72, support: 79 },
  ];

  return (
    <Card>
      <div style={{ color: C.lav, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        CLASSIFICATION RESULTS (2000 BILINGUAL SAMPLES)
      </div>

      <div style={{ background: "#0A0E14", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 1, background: C.border }}>
          {["CLASS", "PRECISION", "RECALL", "F1-SCORE", "SUPPORT"].map(h => (
            <div key={h} style={{ padding: "6px 10px", background: C.s3, color: C.muted, fontSize: 9, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>{h}</div>
          ))}
        </div>
        {results.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 1, background: C.bg }}>
            <div style={{ padding: "6px 10px", color: C.text, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{r.cls}</div>
            <div style={{ padding: "6px 10px", color: r.precision > 0.6 ? C.teal : C.coral, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{r.precision.toFixed(2)}</div>
            <div style={{ padding: "6px 10px", color: r.recall > 0.6 ? C.teal : C.coral, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{r.recall.toFixed(2)}</div>
            <div style={{ padding: "6px 10px", color: r.f1 > 0.6 ? C.teal : C.coral, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{r.f1.toFixed(2)}</div>
            <div style={{ padding: "6px 10px", color: C.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{r.support}</div>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: 1, borderTop: `1px solid ${C.border}` }}>
          <div style={{ padding: "6px 10px", color: C.teal, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>ACCURACY</div>
          <div style={{ padding: "6px 10px", color: C.muted, fontSize: 10 }}></div>
          <div style={{ padding: "6px 10px", color: C.muted, fontSize: 10 }}></div>
          <div style={{ padding: "6px 10px", color: C.teal, fontSize: 10, fontWeight: 700, fontFamily: "JetBrains Mono, monospace" }}>0.57</div>
          <div style={{ padding: "6px 10px", color: C.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>400</div>
        </div>
      </div>

      <div style={{ marginTop: 12, padding: "10px 14px", background: C.s3, borderRadius: 8, borderLeft: `3px solid ${C.coral}` }}>
        <div style={{ color: C.coral, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Why Extreme Ratings Score Higher</div>
        <div style={{ color: C.muted, fontSize: 11 }}>
          1-star and 5-star reviews have strong sentiment signals. Distinguishing 3-star from 4-star is inherently harder. With only 2000 samples and 1024-dim embeddings, overfitting on intermediate classes is expected. More data (5000+) would improve mid-range accuracy significantly.
        </div>
      </div>
    </Card>
  );
}

export default function MultilingualClassificationTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>MACHINE LEARNING MASTERY · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>Multilingual Text Classification with Scikit-LLM and Multilingual Embeddings</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          Build a multilingual text classifier that works across 100+ languages using BGE-M3 embeddings + Ollama (free, local) + scikit-learn. No API costs, no language-specific models.
        </div>
      </div>

      <Card>
        <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>PIPELINE STACK</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {[
            { name: "Ollama", desc: "Local LLM server", icon: "🦙", color: C.teal },
            { name: "BGE-M3", desc: "1024-dim multilingual embeddings", icon: "🌐", color: C.coral },
            { name: "Scikit-LLM", desc: "GPTVectorizer wrapper", icon: "🔬", color: C.lav },
            { name: "LogisticRegression", desc: "5-class star rating classifier", icon: "📊", color: C.tealDark },
          ].map((t, i) => (
            <div key={i} style={{ padding: "10px", background: C.surface, borderRadius: 6, borderLeft: `3px solid ${t.color}`, textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ color: t.color, fontWeight: 700, fontSize: 11, marginBottom: 2 }}>{t.name}</div>
              <div style={{ color: C.muted, fontSize: 9 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      <EmbeddingSpaceVisualizer />
      <PipelineSimulator />
      <ResultsTable />

      <Card style={{ border: `1px solid ${C.teal}33` }}>
        <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          Multilingual LLM embeddings eliminate the need for language-specific models. BGE-M3 maps text from 100+ languages into a shared vector space — "This product is fantastic!" and "¡Este producto es fantástico!" produce nearly identical embeddings. Train one lightweight classifier on top, and it works across all languages.
        </div>
      </Card>
    </div>
  );
}