import React from "react";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#E8837A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

const SEVERITY_STYLES = {
  P0: { color: C.coral, bg: `${C.coral}15`, border: C.coral, label: "P0 Critical" },
  P1: { color: C.lav, bg: `${C.lav}15`, border: C.lav, label: "P1 High" },
  P2: { color: C.teal, bg: `${C.teal}15`, border: C.teal, label: "P2 Medium" }
};

export function WarStoryCard({ story, onViewDetails }) {
  const severity = SEVERITY_STYLES[story.severity] || SEVERITY_STYLES.P2;

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 20,
      transition: "all 0.2s"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text, flex: 1, paddingRight: 16 }}>
          {story.title}
        </h4>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          padding: "3px 8px",
          borderRadius: 4,
          background: severity.bg,
          color: severity.color,
          border: `1px solid ${severity.border}`,
          flexShrink: 0
        }}>
          {severity.label}
        </span>
      </div>
      
      <p style={{ margin: "0 0 12px", fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        {story.summary}
      </p>
      
      <div style={{ 
        padding: "12px 16px", 
        background: `${C.teal}08`, 
        border: `1px solid ${C.teal}20`, 
        borderRadius: 8,
        marginBottom: 12,
        borderLeft: `3px solid ${C.teal}`
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Key Lesson
        </div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>
          {story.lesson}
        </div>
      </div>
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {story.topics.map(t => (
          <span key={t} style={{
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: 4,
            background: `${C.teal}15`,
            color: C.teal,
            border: `1px solid ${C.teal}30`
          }}>
            {t}
          </span>
        ))}
      </div>
      
      <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.muted, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <span>⏱ {story.timeLost}</span>
        <span>💰 {story.revenueImpact}</span>
        <button
          onClick={() => onViewDetails?.(story)}
          style={{
            marginLeft: "auto",
            padding: "6px 12px",
            background: "transparent",
            color: C.teal,
            border: `1px solid ${C.teal}`,
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default WarStoryCard;