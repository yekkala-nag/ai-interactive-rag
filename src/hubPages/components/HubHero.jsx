import React from "react";

const C = {
  bg: "#F5F5F7", surface: "#FFFFFF", s2: "#EDEDF0", s3: "#EDEDF0",
  border: "#E8E8EC", text: "#2D2D3A", muted: "#4A4A5A",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

// Readable text variant of a bright accent (accents are fills/graphics only).
const inkFor = (accent) => ({
  "#5EC4C8": "#1F6B6E",
  "#C9B8E8": "#6B5E94",
  "#F0A89A": "#C47A6A",
}[accent] || "#1F6B6E");

export function HubHero({ title, subtitle, description, estimatedHours, totalTopics, levels, icon = "📝", accentColor = C.teal }) {
  return (
    <div style={{
      padding: 32,
      background: "linear-gradient(135deg, rgba(94,196,200,0.16) 0%, rgba(240,168,154,0.12) 55%, rgba(201,184,232,0.16) 100%)",
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      marginBottom: 24,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Top accent hairline: teal → coral → lavender */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, ${C.teal}, ${C.coral}, ${C.lav}, ${C.teal})`,
        pointerEvents: "none"
      }} />
      {/* Soft accent glow */}
      <div style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 240,
        height: 240,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header row: icon + title block */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`,
            border: `1px solid ${accentColor}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            flexShrink: 0
          }}>
            {icon}
          </div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            {title}
          </h1>
        </div>

        <p style={{ margin: "0 0 12px", fontSize: 16, color: inkFor(accentColor), fontWeight: 500, lineHeight: 1.5 }}>
          {subtitle}
        </p>

        <p style={{ margin: "0 0 4px", color: C.muted, fontSize: 15, lineHeight: 1.7, maxWidth: 800 }}>
          {description}
        </p>

        <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: inkFor(accentColor) }}>
              {estimatedHours}h
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>Total Learning Time</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: C.text }}>
              {totalTopics}
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>Topics</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <span style={{ fontSize: 12, color: C.muted }}>Levels:</span>
            {Object.entries(levels).map(([level, count]) => {
              const color = level === "1" ? C.teal : level === "2" ? C.lav : C.coral;
              const ink = level === "1" ? C.tealInk : level === "2" ? "#6B5E94" : C.coralDeep;
              return (
                <span key={level} style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: `${color}20`,
                  color: ink,
                  border: `1px solid ${color}40`
                }}>
                  L{level}×{count}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HubHero;
