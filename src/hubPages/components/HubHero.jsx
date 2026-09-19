import React from "react";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

export function HubHero({ title, subtitle, description, estimatedHours, totalTopics, levels, icon = "📝", accentColor = C.teal }) {
  return (
    <div style={{
      padding: 32,
      background: `linear-gradient(135deg, ${accentColor}08 0%, ${C.surface} 100%)`,
      border: `1px solid ${accentColor}33`,
      borderRadius: 16,
      marginBottom: 24,
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{
        position: "absolute",
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
        pointerEvents: "none"
      }} />
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24
          }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
                {title}
              </h1>
            </div>
            <p style={{ margin: "0 0 8px 72px", fontSize: 16, color: accentColor, fontWeight: 500 }}>
              {subtitle}
            </p>
          </div>
        </div>
        
        <p style={{ margin: "16px 0 0 72px", color: C.muted, fontSize: 15, lineHeight: 1.7, maxWidth: 800 }}>
          {description}
        </p>
        
        <div style={{ marginTop: 24, paddingLeft: 72, display: "flex", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: C.s2, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: accentColor }}>
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
              return (
                <span key={level} style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: `${color}20`,
                  color,
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