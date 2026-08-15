import { useState } from "react";

export default function CodeBlock({ code, lang = "python" }) {
  const [copied, setCopied] = useState(false);
  
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: "relative", background: "#0d0d1a", borderRadius: 4, border: "1px solid #e0dcd4", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1rem", borderBottom: "1px solid #2a2a3a", background: "#0d0d1a" }}>
        <span style={{ fontFamily: "DM Mono, monospace", fontSize: "0.6rem", color: "#4a9a4a", letterSpacing: "0.1em", textTransform: "uppercase" }}>{lang}</span>
        <button 
          onClick={copy} 
          style={{ 
            background: copied ? "rgba(74,154,74,0.2)" : "rgba(255,255,255,0.05)", 
            border: "1px solid rgba(255,255,255,0.1)", 
            borderRadius: 3, 
            padding: "0.2rem 0.6rem", 
            color: copied ? "#4a9a4a" : "#334155", 
            fontSize: "0.6rem", 
            cursor: "pointer", 
            fontFamily: "DM Mono, monospace", 
            transition: "all 0.2s" 
          }}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ padding: "1rem", margin: 0, fontSize: "0.68rem", lineHeight: 1.8, color: "#a8d8a8", overflowX: "auto", whiteSpace: "pre" }}>{code}</pre>
    </div>
  );
}
