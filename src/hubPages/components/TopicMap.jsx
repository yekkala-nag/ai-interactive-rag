import React, { useState, useMemo } from "react";

const C = {
  bg: "#F5F5F7", surface: "#FFFFFF", s2: "#EDEDF0", s3: "#EDEDF0",
  border: "#E8E8EC", text: "#2D2D3A", muted: "#4A4A5A",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

const LEVEL_COLORS = {
  1: C.teal,
  2: C.lav,
  3: C.coral
};

const LEVEL_LABELS = {
  1: "L1 Core",
  2: "L2 Practitioner", 
  3: "L3 Advanced"
};

export function TopicMap({ nodes, edges, completedTopics = [], unlockedTopics = [], onNodeClick, selectedNodeId }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const nodeLookup = useMemo(() => {
    const map = {};
    nodes.forEach(n => map[n.id] = n);
    return map;
  }, [nodes]);

  const edgePaths = useMemo(() => {
    return edges.map(edge => {
      const from = nodeLookup[edge.from];
      const to = nodeLookup[edge.to];
      if (!from || !to) return null;
      
      const x1 = from.x + pan.x;
      const y1 = from.y + pan.y;
      const x2 = to.x + pan.x;
      const y2 = to.y + pan.y;
      
      const cx = (x1 + x2) / 2;
      const cy = (y1 + y2) / 2;
      
      return { from, to, x1, y1, x2, y2, cx, cy };
    }).filter(Boolean);
  }, [edges, nodeLookup, pan]);

  const isCompleted = (id) => completedTopics.includes(id);
  const isUnlocked = (id) => unlockedTopics.includes(id) || !unlockedTopics.length;
  const isSelected = (id) => selectedNodeId === id;

  const handleWheel = (e) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(2, prev - e.deltaY * 0.001)));
  };

  const handleMouseDown = (e) => {
    if (e.target === e.currentTarget) {
      const startX = e.clientX - pan.x;
      const startY = e.clientY - pan.y;
      const move = (me) => setPan({ x: me.clientX - startX, y: me.clientY - startY });
      const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
  };

  return (
    <div style={{ 
      position: "relative", 
      borderRadius: 12, 
      overflow: "hidden",
      background: C.surface,
      border: `1px solid ${C.border}`,
      minHeight: 400
    }} onWheel={handleWheel} onMouseDown={handleMouseDown}>
      
      <svg 
        width="100%" 
        height="400" 
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          transition: "transform 0.1s ease-out"
        }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,7 L10,3.5 Z" fill={C.border} />
          </marker>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect 
          width="2000" 
          height="2000" 
          x="-1000" 
          y="-1000" 
          fill="url(#grid)" 
        />
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={C.border} strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>

        {edgePaths.map((edge, i) => {
          const fromCompleted = isCompleted(edge.from.id);
          const toCompleted = isCompleted(edge.to.id);
          const fromUnlocked = isUnlocked(edge.from.id);
          const toUnlocked = isUnlocked(edge.to.id);
          const active = fromCompleted && toUnlocked;
          const hoverActive = hoveredNode && (hoveredNode === edge.from.id || hoveredNode === edge.to.id);
          
          return (
            <path
              key={i}
              d={`M${edge.x1},${edge.y1} Q${edge.cx},${edge.cy} ${edge.x2},${edge.y2}`}
              stroke={active ? C.teal : hoverActive ? C.teal : C.border}
              strokeWidth={active || hoverActive ? 2.5 : 1.5}
              strokeDasharray={fromCompleted && toUnlocked ? "8,4" : "none"}
              fill="none"
              markerEnd="url(#arrowhead)"
              style={{
                filter: hoverActive ? "url(#glow)" : "none",
                transition: "all 0.2s",
                opacity: fromUnlocked && toUnlocked ? 1 : 0.3
              }}
            />
          );
        })}

        {nodes.map(node => {
          const completed = isCompleted(node.id);
          const unlocked = isUnlocked(node.id);
          const selected = isSelected(node.id);
          const level = node.level || 1;
          const color = LEVEL_COLORS[level];
          
          const nodeStyle = {
            cursor: unlocked ? "pointer" : "not-allowed",
            opacity: unlocked ? 1 : 0.4,
            transition: "all 0.2s",
            filter: selected || hoveredNode === node.id ? "url(#glow)" : "none"
          };

          return (
            <g 
              key={node.id}
              onMouseEnter={() => { if (unlocked) setHoveredNode(node.id); }}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => { if (unlocked) onNodeClick?.(node.id); }}
              style={nodeStyle}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={selected ? 32 : 28}
                fill={completed ? `${color}20` : C.s2}
                stroke={completed ? color : selected ? color : unlocked ? color : C.border}
                strokeWidth={completed ? 3 : selected ? 3 : 2}
                style={{ transition: "all 0.2s" }}
              />
              
              {completed && (
                <circle
                  cx={node.x + 18}
                  cy={node.y - 18}
                  r={10}
                  fill={C.teal}
                  stroke={C.surface}
                  strokeWidth={2}
                >
                  <text x={node.x + 18} y={node.y - 14} textAnchor="middle" fontSize={10} fontWeight="bold" fill={C.surface}>✓</text>
                </circle>
              )}
              
              <text 
                x={node.x} 
                y={node.y - 36} 
                textAnchor="middle" 
                fontSize={10} 
                fontWeight={600}
                fill={unlocked ? C.text : C.muted}
                style={{ 
                  fontFamily: "JetBrains Mono, monospace",
                  pointerEvents: "none"
                }}
              >
                {LEVEL_LABELS[level]}
              </text>
              
              <text 
                x={node.x} 
                y={node.y + 4} 
                textAnchor="middle" 
                fontSize={11} 
                fontWeight={700}
                fill={unlocked ? C.text : C.muted}
                style={{ 
                  fontFamily: "Inter, system-ui",
                  pointerEvents: "none"
                }}
              >
                {node.label || node.id}
              </text>
              
              {selected && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={34}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray="6,4"
                  style={{ animation: "dash 1s linear infinite" }}
                />
              )}
            </g>
          );
        })}
      </svg>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
      `}</style>

      <div style={{ 
        position: "absolute", 
        bottom: 16, 
        right: 16, 
        display: "flex", 
        gap: 8,
        opacity: 0.7
      }}>
        <button onClick={() => setZoom(z => Math.min(2, z * 1.2))} style={controlBtn}>+</button>
        <button onClick={() => setZoom(z => Math.max(0.5, z / 1.2))} style={controlBtn}>−</button>
        <button onClick={() => { setPan({ x: 0, y: 0 }); setZoom(1); }} style={controlBtn}>⌂</button>
      </div>

      <div style={{ 
        position: "absolute", 
        bottom: 16, 
        left: 16, 
        display: "flex", 
        gap: 12,
        fontSize: 11,
        color: C.muted
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.teal }}></div>
          <span>L1 Core</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.lav }}></div>
          <span>L2 Practitioner</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.coral }}></div>
          <span>L3 Advanced</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.teal}`, background: "transparent" }}></div>
          <span>Completed</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "transparent", border: `2px dashed ${C.teal}` }}></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}

const controlBtn = {
  width: 28,
  height: 28,
  borderRadius: 6,
  background: C.s2,
  border: `1px solid ${C.border}`,
  color: C.text,
  cursor: "pointer",
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

export default TopicMap;