import React, { useState } from "react";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

const EMBED_ICONS = {
  "prompt-playground": "🧪",
  "contract-validator": "📜",
  "regression-simulator": "📊",
  "structured-output-builder": "🏗️"
};

export function InteractiveEmbed({ embed, onLaunch, launchedEmbeds = [] }) {
  const [isLaunched, setIsLaunched] = useState(false);
  const isAlreadyLaunched = launchedEmbeds.includes(embed.id);

  const handleClick = () => {
    if (!isAlreadyLaunched) {
      setIsLaunched(true);
      onLaunch?.(embed);
    }
  };

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${isAlreadyLaunched ? C.teal : C.border}`,
      borderRadius: 12,
      padding: 20,
      transition: "all 0.2s",
      position: "relative",
      overflow: "hidden"
    }}>
      {isAlreadyLaunched && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${C.teal}, ${C.lav}, ${C.coral})`,
          animation: "shimmer 2s infinite"
        }} />
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: `${C.teal}15`,
          border: `1px solid ${isAlreadyLaunched ? C.teal : C.teal}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0
        }}>
          {EMBED_ICONS[embed.id] || "🔧"}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>
              {embed.title}
            </h4>
            {isAlreadyLaunched && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                background: `${C.teal}20`,
                color: C.teal,
                border: `1px solid ${C.teal}40`
              }}>
                Active
              </span>
            )}
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            {embed.description}
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {embed.props && Object.entries(embed.props).map(([key, value]) => (
              <span key={key} style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 4,
                background: `${C.lav}15`,
                color: C.lav,
                border: `1px solid ${C.lav}30`
              }}>
                {key}: {String(value)}
              </span>
            ))}
          </div>
          
          <button
            onClick={handleClick}
            disabled={isAlreadyLaunched}
            style={{
              padding: "10px 18px",
              background: isAlreadyLaunched ? C.teal : "transparent",
              color: isAlreadyLaunched ? "#000" : C.teal,
              border: `1px solid ${C.teal}`,
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: isAlreadyLaunched ? "default" : "pointer",
              opacity: isAlreadyLaunched ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            {isAlreadyLaunched ? (
              <>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#0003", border: "2px solid #000", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
                Running...
              </>
            ) : (
              "Launch Interactive Demo"
            )}
          </button>
          
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
        
        {embed.engine && (
          <div style={{ 
            padding: "8px 12px", 
            background: C.s2, 
            border: `1px solid ${C.border}`, 
            borderRadius: 8,
            fontSize: 11,
            color: C.muted,
            fontFamily: "JetBrains Mono, monospace"
          }}>
            Engine: {embed.engine}
          </div>
        )}
      </div>
    </div>
  );
}

export default InteractiveEmbed;