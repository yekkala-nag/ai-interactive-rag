import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Workflow — animated, step-through process visualization.
 *
 * Props:
 *  - steps: [{ title, description, icon?, detail?, code? }]
 *  - orientation: "horizontal" | "vertical"
 *  - accent: module color (hex or key)
 *  - autoPlay: boolean — advance automatically on mount (respects reduced motion)
 *  - accentLabel: small kicker shown above the title
 */

let wfKeyframesInjected = false;
function ensureWfKeyframes() {
  if (wfKeyframesInjected || typeof document === "undefined") return;
  wfKeyframesInjected = true;
  const style = document.createElement("style");
  style.id = "wf-keyframes";
  style.textContent = `
    @keyframes wfDash { to { stroke-dashoffset: 0; } }
    @keyframes wfNodePop { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes wfCardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes wfPulse { 0%,100% { box-shadow: 0 0 0 0 var(--wf-pulse, rgba(13,148,136,0.5)); } 50% { box-shadow: 0 0 0 8px var(--wf-pulse, rgba(13,148,136,0)); } }
    @media (prefers-reduced-motion: reduce) {
      .wf-reduce * { animation: none !important; transition: none !important; }
    }
  `;
  document.head.appendChild(style);
}

const ACCENTS = {
  rag: "#CA8A04",
  foundations: "#0D9488",
  context: "#9333EA",
  agents: "#DC2626",
  platform: "#2563EB",
  frontiers: "#10B981",
};

export default function Workflow({
  steps = [],
  orientation = "horizontal",
  accent = "#0D9488",
  autoPlay = false,
  accentLabel,
  title,
  description,
  reduceMotion = false,
}) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef(null);

  useEffect(() => ensureWfKeyframes(), []);

  const accentColor = ACCENTS[accent] || accent;
  const total = steps.length;

  const go = useCallback((i) => {
    setCurrent((prev) => {
      const next = ((i % total) + total) % total;
      return next;
    });
  }, [total]);

  useEffect(() => {
    if (playing) {
      timer.current = setInterval(() => {
        setCurrent((c) => (c + 1) % total);
      }, 1600);
    }
    return () => clearInterval(timer.current);
  }, [playing, total]);

  useEffect(() => {
    if (autoPlay && !playing && !reduceMotion) setPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = steps[current];

  const horizontal = orientation === "horizontal";

  const Node = ({ i }) => {
    const isDone = i < current;
    const isActive = i === current;
    return (
      <button
        onClick={() => go(i)}
        aria-label={`Step ${i + 1}: ${steps[i].title}`}
        style={{
          position: "relative",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer", padding: 0, flex: 1, minWidth: 92,
        }}
      >
        <span
          style={{
            width: 38, height: 38, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.95rem", fontWeight: 800, color: isActive || isDone ? "#fff" : accentColor,
            background: isActive ? accentColor : isDone ? `${accentColor}cc` : "var(--ds-color-bg-surface)",
            border: `2px solid ${isActive || isDone ? accentColor : "var(--ds-color-border-default)"}`,
            animation: isActive && !reduceMotion ? "wfNodePop 0.3s ease" : "none",
            boxShadow: isActive ? `0 0 0 4px ${accentColor}22` : "none",
            transition: "all 0.2s",
          }}
        >
          {steps[i].icon || (isDone ? "✓" : i + 1)}
        </span>
        <span style={{
          fontSize: "0.72rem", fontWeight: isActive ? 700 : 500,
          color: isActive ? "var(--ds-color-text-primary)" : "var(--ds-color-text-secondary)",
          textAlign: "center", lineHeight: 1.2, maxWidth: 130,
        }}>
          {steps[i].title}
        </span>
      </button>
    );
  };

  const Connector = (i) =>
    horizontal ? (
      <div key={`c${i}`} style={{
        flex: 1, height: 3, minWidth: 18, marginTop: 18,
        background: "var(--ds-color-border-subtle)", borderRadius: 2, overflow: "hidden", position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, width: i < current ? "100%" : "0%", background: accentColor, transition: "width 0.4s ease" }} />
      </div>
    ) : (
      <div key={`c${i}`} style={{ width: 3, height: 26, background: i < current ? accentColor : "var(--ds-color-border-subtle)", transition: "background 0.3s", borderRadius: 2 }} />
    );

  return (
    <div className={reduceMotion ? "wf-reduce" : undefined} style={{
      background: "var(--ds-color-bg-surface)", border: "1px solid var(--ds-color-border-subtle)",
      borderRadius: "var(--ds-radius-lg)", padding: "var(--ds-space-5)",
    }}>
      {(title || accentLabel) && (
        <div style={{ marginBottom: "var(--ds-space-4)" }}>
          {accentLabel && (
            <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: accentColor, marginBottom: 4 }}>
              {accentLabel}
            </div>
          )}
          {title && <h3 style={{ margin: 0, fontSize: "var(--ds-font-size-h3)" }}>{title}</h3>}
          {description && <p style={{ margin: "4px 0 0 0", color: "var(--ds-color-text-secondary)", fontSize: "var(--ds-font-size-bodySm)" }}>{description}</p>}
        </div>
      )}

      <div style={{
        display: "flex",
        flexDirection: horizontal ? "row" : "column",
        alignItems: horizontal ? "flex-start" : "stretch",
        gap: horizontal ? 0 : "var(--ds-space-2)",
        marginBottom: "var(--ds-space-5)",
      }}>
        {horizontal
          ? steps.map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: 1 }}>
                <Node i={i} />
                {i < total - 1 && <Connector i={i} />}
              </div>
            ))
          : steps.map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "stretch", gap: "var(--ds-space-3)" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Node i={i} />
                  {i < total - 1 && <Connector i={i} />}
                </div>
              </div>
            ))
        }
      </div>

      {/* Active step detail */}
      <div style={{
        border: `1px solid ${accentColor}55`, borderLeft: `4px solid ${accentColor}`,
        borderRadius: "var(--ds-radius-md)", padding: "var(--ds-space-4)",
        background: "var(--ds-color-bg-canvas)", minHeight: 80,
        animation: reduceMotion ? "none" : "wfCardIn 0.3s ease",
        transition: "opacity 0.2s",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <strong style={{ color: accentColor, fontSize: "0.95rem" }}>
            Step {current + 1} / {total} — {active?.title}
          </strong>
          <span style={{ fontSize: "0.7rem", color: "var(--ds-color-text-tertiary)", fontFamily: "var(--ds-font-family-mono)" }}>
            {Math.round(((current + 1) / total) * 100)}%
          </span>
        </div>
        <div style={{ fontSize: "0.88rem", color: "var(--ds-color-text-secondary)", lineHeight: 1.55 }}>
          {active?.description}
        </div>
        {active?.detail && (
          <div style={{ marginTop: "var(--ds-space-3)", fontSize: "0.82rem", color: "var(--ds-color-text-primary)" }}>{active.detail}</div>
        )}
        {active?.code && (
          <pre style={{
            marginTop: "var(--ds-space-3)", background: "#0d0f17", color: "#cde", padding: "var(--ds-space-3)",
            borderRadius: "var(--ds-radius-sm)", fontSize: "0.78rem", overflowX: "auto", fontFamily: "var(--ds-font-family-mono)",
          }}>{active.code}</pre>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "var(--ds-space-2)", marginTop: "var(--ds-space-4)", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => { setPlaying(false); go(current - 1); }} style={ctrl(accentColor)}>◀ Prev</button>
        <button
          onClick={() => setPlaying((p) => !p)}
          style={{ ...ctrl(accentColor), background: playing ? "var(--ds-color-bg-surfaceHover)" : accentColor, color: playing ? "var(--ds-color-text-primary)" : "#fff" }}
        >
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>
        <button onClick={() => { setPlaying(false); go(current + 1); }} style={ctrl(accentColor)}>Next ▶</button>
        <div style={{ flex: 1, height: 6, background: "var(--ds-color-border-subtle)", borderRadius: 999, overflow: "hidden", minWidth: 80 }}>
          <div style={{ height: "100%", width: `${((current + 1) / total) * 100}%`, background: accentColor, transition: "width 0.4s ease" }} />
        </div>
      </div>
    </div>
  );
}

function ctrl(color) {
  return {
    padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
    border: `1px solid ${color}`, background: "var(--ds-color-bg-surface)", color,
    fontFamily: "var(--ds-font-family-sans)", transition: "all 0.15s",
  };
}
