import React from "react";

const C = {
  bg: "#F5F5F7", surface: "#FFFFFF", s2: "#EDEDF0", s3: "#EDEDF0",
  border: "#E8E8EC", text: "#2D2D3A", muted: "#4A4A5A",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

export function BridgeCard({ bridge, onExplore }) {
  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 20,
      transition: "all 0.2s"
    }}>
      {/* Row 1: Icon + Title + Description + Tags + Button */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${C.teal}20, ${C.teal}08)`,
          border: `1px solid ${C.teal}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0
        }}>
          ↔
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: C.text }}>
            {bridge.title}
          </h4>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            {bridge.description}
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.teal }}>From:</span>
              {bridge.fromTopics.map(t => (
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
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.lav }}>To:</span>
              {bridge.toTopics.map(t => (
                <span key={t} style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: `${C.lav}15`,
                  color: C.lav,
                  border: `1px solid ${C.lav}30`
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => onExplore?.(bridge)}
            style={{
              padding: "8px 16px",
              background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
              color: C.bg,
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            Explore Bridge →
          </button>
        </div>
      </div>
      
      {/* Row 2: Demo Idea (full width, no overlap) */}
      {bridge.demoIdea && (
        <div style={{ 
          marginTop: 16,
          padding: "12px 16px", 
          background: `linear-gradient(135deg, ${C.coral}12, ${C.coral}06)`, 
          border: `1px solid ${C.coral}25`, 
          borderRadius: 8,
          borderLeft: `3px solid ${C.coral}`
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.coral, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Demo Idea
          </div>
          <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>
            {bridge.demoIdea}
          </div>
        </div>
      )}
    </div>
  );
}

export default BridgeCard;
