/**
 * Legacy Styles — Shared styles object for legacy App.jsx tab components
 */

export const s = {
  main: { padding: "2rem 2.5rem", maxWidth: 1380, width: "100%", margin: "0 auto" },
  section: { marginBottom: "2rem" },
  sectionLabel: (color = "#c9a84c") => ({ fontFamily: "Syne, sans-serif", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color, borderLeft: `3px solid ${color}`, paddingLeft: "0.7rem", marginBottom: "1rem" }),
  card: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.2rem" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1.2rem" },
};