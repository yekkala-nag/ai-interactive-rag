import React, { useState, useEffect } from "react";
import { getTabById, getChildrenForUmbrella, getChildById } from "../registry/tabsRegistry.js";
import { getChildrenForUmbrella as getChildren, getChildById as getChild } from "../registry/curriculum.js";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

const LEVEL_BADGES = {
  1: { label: "L1", color: "#5EC4C8" },
  2: { label: "L2", color: "#9B89C4" },
  3: { label: "L3", color: "#F0A89A" },
};

function isTabUnlocked(tabId, topicMeta, progress) {
  const meta = topicMeta[tabId];
  if (!meta || !meta.p?.length) return true;
  return meta.p.every(p => progress?.completed?.includes(p));
}

export function HubPage({ childId, onSelectTab }) {
  const child = getChild(childId);
  if (!child) return <div style={{ padding: 24, color: C.muted }}>Child umbrella not found: {childId}</div>;

  const tabs = getChildren(child.umbrellaId).find(c => c.id === childId)?.tabs || [];
  const topicMeta = {};
  tabs.forEach(t => {
    const meta = getTabById(t.id);
    if (meta) topicMeta[t.id] = meta;
  });

  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(`hub_progress_${childId}`);
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  useEffect(() => {
    try {
      localStorage.setItem(`hub_progress_${childId}`, JSON.stringify(progress));
    } catch {}
  }, [progress, childId]);

  const completedCount = progress?.completed?.length || 0;
  const totalCount = tabs.length;
  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const children = getChildren(child.umbrellaId);
  const currentIndex = children.findIndex(c => c.id === childId);
  const nextChild = children[currentIndex + 1];
  const prevChild = children[currentIndex - 1];

  function handleTabClick(tabId) {
    if (isTabUnlocked(tabId, topicMeta, progress)) {
      onSelectTab(tabId);
    }
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: C.teal + "22", color: C.teal, border: `1px solid ${C.teal}` }}>
            {child.umbrellaId}
          </span>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>{child.title}</h1>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: 0 }}>{child.blurb}</p>
      </div>

      {/* Progress Ring + Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 24, marginBottom: 24, alignItems: "center" }}>
        <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
          <circle cx="40" cy="40" r={37} fill="none" stroke={C.border} strokeWidth={6} />
          <circle
            cx="40" cy="40" r={37}
            fill="none" stroke={C.teal} strokeWidth={6}
            strokeDasharray={2 * Math.PI * 37} strokeDashoffset={2 * Math.PI * 37 * (1 - pct / 100)}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.3s" }}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
            fontSize={17} fontWeight={700} fontFamily="JetBrains Mono, monospace" fill={C.teal}>
            {pct}%
          </text>
        </svg>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: C.muted }}>Progress</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: C.teal }}>
              {progress?.completed?.length || 0} / {totalCount} topics
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 12, color: C.muted }}>
            <span>L1: {tabs.filter(t => topicMeta[t.id]?.l === 1).length}</span>
            <span>L2: {tabs.filter(t => topicMeta[t.id]?.l === 2).length}</span>
            <span>L3: {tabs.filter(t => topicMeta[t.id]?.l === 3).length}</span>
          </div>
        </div>
      </div>

      {/* Topic Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginBottom: 24 }}>
        {tabs.map(tabId => {
          const meta = topicMeta[tabId];
          const unlocked = !meta?.p?.length || meta.p?.every(p => progress?.completed?.includes(p));
          const completed = progress?.completed?.includes(tabId);
          const level = meta?.l || 1;

          return (
            <div
              key={tabId}
              onClick={() => {
                if (unlocked) onSelectTab(tabId);
              }}
              style={{
                cursor: unlocked ? "pointer" : "not-allowed",
                opacity: unlocked ? 1 : 0.5,
                borderColor: completed ? C.teal : unlocked ? C.border : C.border,
                background: completed ? `${C.teal}08` : C.surface,
                transition: "all 0.2s",
                padding: 16,
                border: `1px solid ${completed ? C.teal : unlocked ? C.border : C.border}`,
                borderRadius: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                  background: completed ? C.teal + "22" : "transparent",
                  color: completed ? C.teal : C.muted,
                  border: `1px solid ${completed ? C.teal : C.border}`,
                }}>
                  {LEVEL_BADGES[meta?.l || 1].label}
                </span>
                {completed && <span style={{ color: C.teal, fontSize: 16 }}>✓</span>}
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: unlocked ? C.text : C.muted }}>
                {tabId}
              </h3>
              <p style={{ margin: 0, fontSize: 11, color: C.muted, lineHeight: 1.4 }}>
                {meta?.keywords?.slice(0, 3).join(", ") || "No description"}
              </p>
              {meta?.p?.length && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.muted }}>
                  Requires: {meta.p.filter(p => !progress?.completed?.includes(p)).join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
        {prevChild && (
          <button
            onClick={() => onSelectTab(prevChild.tabs[0]?.id || prevChild.id)}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: "transparent", color: C.teal, border: `1px solid ${C.teal}`,
            }}
          >
            ← {prevChild.title}
          </button>
        )}
        <div style={{ flex: 1, textAlign: "center" }}>
          <button
            onClick={() => onSelectTab(child.umbrellaId)}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              margin: "0 8px", background: "transparent", color: C.teal, border: `1px solid ${C.teal}`,
            }}
          >
            Back to {child.umbrellaId.replace("_", " ")}
          </button>
        </div>
        {nextChild && (
          <button
            onClick={() => onSelectTab(nextChild.tabs[0]?.id || nextChild.id)}
            style={{
              padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: C.teal, color: "#000", border: "none",
            }}
          >
            {nextChild.title} →
          </button>
        )}
      </div>
    </>
  );
}

export default HubPage;