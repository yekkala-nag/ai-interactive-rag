import { useState } from "react";

// Renders a self-contained SVG diagram (in /assets/*.svg) inside a clean,
// themeable figure card with an optional caption. Click opens it in the
// fullscreen ZoomableFigure-style lightbox (reusing the same zoom/pan pattern).
const DiagramImage = ({
  src,
  alt = "Diagram",
  caption,
  title,
  maxWidth = 1100,
  background = "#ffffff",
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(1);

  const open = () => { setScale(1); setZoomed(true); };
  const close = () => setZoomed(false);
  const zoomIn = (e) => { if (e) e.stopPropagation(); setScale((s) => Math.min(+(s + 0.25).toFixed(2), 3)); };
  const zoomOut = (e) => { if (e) e.stopPropagation(); setScale((s) => Math.max(+(s - 0.25).toFixed(2), 0.5)); };
  const reset = (e) => { if (e) e.stopPropagation(); setScale(1); };

  return (
    <>
      <figure
        onClick={open}
        title="Click to view fullscreen"
        style={{
          margin: 0,
          background,
          border: "1px solid #e0dcd4",
          borderRadius: 8,
          overflow: "hidden",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
          transition: "box-shadow 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.03)"; }}
      >
        {(title || caption) && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.55rem 0.9rem", background: "#f7f5f0", borderBottom: "1px solid #e0dcd4",
            fontFamily: "Syne, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: "#1a1a2e",
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ color: "#2a8a84" }}>🖼️</span>
              {title || "Figure"}
            </span>
            <span style={{ color: "#9b7fd4", fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>⤢ Fullscreen</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.25rem" }}>
          <img
            src={src}
            alt={alt}
            style={{ width: "100%", maxWidth, height: "auto", display: "block" }}
          />
        </div>
        {caption && (
          <figcaption style={{
            padding: "0.5rem 0.9rem", borderTop: "1px solid #e0dcd4", background: "#f7f5f0",
            fontSize: "0.62rem", color: "#334155", fontStyle: "italic", lineHeight: 1.5,
          }}>
            {caption}
          </figcaption>
        )}
      </figure>

      {zoomed && (
        <div
          onClick={close}
          style={{
            position: "fixed", inset: 0, zIndex: 99999,
            background: "rgba(10,12,18,0.94)", backdropFilter: "blur(12px)",
            display: "flex", flexDirection: "column", animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "0.75rem 1.5rem", background: "#14161f", borderBottom: "1px solid #2a2d3d",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <span style={{ fontFamily: "Syne, sans-serif", fontSize: "0.95rem", fontWeight: 800, color: "#fff", letterSpacing: "0.03em" }}>
              {title || alt}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={zoomOut} title="Zoom Out" style={lb(36)}>➖</button>
              <button onClick={reset} title="Reset" style={{ ...lb(64), fontFamily: "DM Mono, monospace", fontSize: "0.8rem", color: scale !== 1 ? "#c9a84c" : "#a0a5ba" }}>{Math.round(scale * 100)}%</button>
              <button onClick={zoomIn} title="Zoom In" style={lb(36)}>➕</button>
              <div style={{ width: 1, height: 24, background: "#3a3e54", margin: "0 6px" }} />
              <button onClick={close} title="Close" style={{ ...lb(80), background: "#c4572a", border: "none", color: "#fff", fontWeight: 800 }}>✕ Close</button>
            </div>
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ flex: 1, overflow: "auto", background: "#0d0f17", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
          >
            <div style={{ background: "#fff", borderRadius: 8, padding: "1.5rem", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", zoom: scale, width: "100%", maxWidth: 1600, display: "flex", justifyContent: "center" }}>
              <img src={src} alt={alt} style={{ width: "100%", maxWidth, height: "auto", display: "block" }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const lb = (w) => ({
  width: w, height: 36, borderRadius: 6, background: "#222533", border: "1px solid #3a3e54",
  color: "#fff", cursor: "pointer", fontWeight: 800, fontSize: "1rem", display: "flex",
  alignItems: "center", justifyContent: "center",
});

export default DiagramImage;
