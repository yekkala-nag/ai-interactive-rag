import React, { useState } from "react";

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

const PATH_COLORS = {
  "l1-foundations": C.teal,
  "l2-practitioner": C.lav,
  "l3-advanced": C.coral
};

// Solid fills for buttons on light backgrounds (dark variant + white text).
const PATH_FILL = {
  "l1-foundations": C.tealDark,
  "l2-practitioner": "#6B5E94",
  "l3-advanced": C.coralDeep
};

export function JourneyStepper({ paths, completedTopics = [], onStartPath, onTopicClick, expandedPathId }) {
  const [activePath, setActivePath] = useState(expandedPathId || null);

  const getPathProgress = (path) => {
    const completed = path.topics.filter(t => completedTopics.includes(t)).length;
    const total = path.topics.length;
    return { completed, total, pct: total ? Math.round((completed / total) * 100) : 0 };
  };

  const getTopicStatus = (topicId, pathTopics, index) => {
    if (completedTopics.includes(topicId)) return "completed";
    const prevCompleted = pathTopics.slice(0, index).every(t => completedTopics.includes(t));
    return prevCompleted ? "available" : "locked";
  };

  const STATUS_STYLES = {
    completed: { bg: C.tealDark, color: "#FFFFFF", border: C.tealDark, icon: "✓" },
    available: { bg: "transparent", color: C.text, border: C.tealDark, icon: null },
    locked: { bg: "transparent", color: C.muted, border: C.border, icon: "🔒" }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: C.text }}>
        Choose Your Learning Path
      </h3>
      <p style={{ margin: 0, color: C.muted, fontSize: 14 }}>
        Three progressive journeys — each builds on the last. Complete L1 to unlock L2, L2 to unlock L3.
      </p>

      {paths.map(path => {
        const color = PATH_COLORS[path.id] || C.teal;
        const progress = getPathProgress(path);
        const isExpanded = activePath === path.id;
        const pathCompleted = progress.completed === progress.total;
        const pathAvailable = path.id === "l1-foundations" || 
          paths.find(p => p.id === "l1-foundations")?.topics.every(t => completedTopics.includes(t));
        
        const canExpand = pathAvailable || path.id === "l1-foundations";

        return (
          <div 
            key={path.id}
            style={{
              background: C.surface,
              border: `1px solid ${isExpanded ? color : C.border}`,
              borderRadius: 12,
              overflow: "hidden",
              transition: "all 0.2s"
            }}
          >
            <button
              onClick={() => setActivePath(isExpanded ? null : path.id)}
              disabled={!canExpand}
              style={{
                width: "100%",
                padding: "16 20",
                background: isExpanded ? `${color}10` : "transparent",
                border: "none",
                borderBottom: isExpanded ? `1px solid ${color}30` : "none",
                cursor: canExpand ? "pointer" : "not-allowed",
                opacity: canExpand ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                gap: 16,
                textAlign: "left"
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: pathCompleted ? `${color}20` : `${color}10`,
                border: `2px solid ${pathCompleted ? color : color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20
              }}>
                {path.icon}
              </div>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: canExpand ? C.text : C.muted }}>
                    {path.label}
                  </h4>
                  {pathCompleted && (
                    <span style={{ 
                      fontSize: 10, 
                      fontWeight: 700, 
                      padding: "2px 8px", 
                      borderRadius: 4, 
                      background: `${C.teal}20`, 
                      color: C.tealInk,
                      border: `1px solid ${C.tealDark}40`
                    }}>
                      Complete
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
                  {path.description}
                </p>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ 
                  width: 80, 
                  height: 6, 
                  background: C.s2, 
                  borderRadius: 3, 
                  overflow: "hidden" 
                }}>
                  <div style={{
                    width: `${progress.pct}%`,
                    height: "100%",
                    background: pathCompleted ? C.teal : color,
                    borderRadius: 3,
                    transition: "width 0.3s"
                  }} />
                </div>
                <span style={{ 
                  fontSize: 13, 
                  fontWeight: 600, 
                  fontFamily: "JetBrains Mono, monospace",
                  color: pathCompleted ? C.tealInk : inkFor(color)
                }}>
                  {progress.completed}/{progress.total}
                </span>
                <span style={{
                  fontSize: 18,
                  color: isExpanded ? color : C.muted,
                  transition: "transform 0.2s",
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                }}>
                  ▼
                </span>
              </div>
            </button>

            {isExpanded && canExpand && (
              <div style={{ padding: "0 20 20", animation: "slideDown 0.2s ease" }}>
                <style>{`
                  @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {path.topics.map((topicId, index) => {
                    const status = getTopicStatus(topicId, path.topics, index);
                    const styles = STATUS_STYLES[status];
                    const isFirst = index === 0;
                    
                    return (
                      <button
                        key={topicId}
                        onClick={() => status !== "locked" && onTopicClick?.(topicId)}
                        disabled={status === "locked"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "12 16",
                          background: status === "completed" ? `rgba(94,196,200,0.12)` : C.s2,
                          border: `1px solid ${styles.border}`,
                          borderRadius: 8,
                          cursor: status === "locked" ? "not-allowed" : "pointer",
                          textAlign: "left",
                          transition: "all 0.2s",
                          opacity: status === "locked" ? 0.5 : 1
                        }}
                      >
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          background: styles.bg,
                          border: `2px solid ${styles.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: status === "completed" ? 12 : 14,
                          color: styles.color,
                          flexShrink: 0
                        }}>
                          {styles.icon || (index + 1)}
                        </div>
                        <div style={{ 
                          flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: 13, 
                            fontWeight: 600, 
                            color: status === "completed" ? C.tealInk : styles.color,
                            marginBottom: 2
                          }}>
                            {topicId}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted }}>
                            {status === "completed" ? "Completed" : status === "available" ? "Ready to start" : "Complete previous topics"}
                          </div>
                        </div>
                        
                        {status === "available" && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: `${color}20`,
                            color: inkFor(color),
                            border: `1px solid ${color}40`
                          }}>
                            Start
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {progress.completed < progress.total && path.topics.some(t => !completedTopics.includes(t)) && (
                  <button
                    onClick={() => {
                      const nextTopic = path.topics.find(t => !completedTopics.includes(t));
                      onStartPath?.(path.id, nextTopic);
                    }}
                    style={{
                      marginTop: 12,
                      padding: "10 16",
                      background: PATH_FILL[path.id] || C.tealDark,
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8
                    }}
                  >
                    Continue: {path.topics.find(t => !completedTopics.includes(t)) || "Complete"}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default JourneyStepper;