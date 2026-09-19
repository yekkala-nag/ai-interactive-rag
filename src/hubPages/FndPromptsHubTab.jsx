import React, { useState, useEffect, useMemo } from "react";
import { HubPage } from "./HubPage.jsx";
import { getChildrenForUmbrella, getChildById, getTopicMeta } from "../registry/curriculum.js";
import {
  HubHero,
  TopicMap,
  JourneyStepper,
  BridgeCard,
  WarStoryCard,
  InteractiveEmbed
} from "./components/index.js";
import { PROMPT_LIFECYCLE_CONTENT, LEVEL_DEFINITIONS, TOPIC_DETAILS } from "./data/promptLifecycleContent.js";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

export default function FndPromptsHubTab({ onSelectTab }) {
  const child = getChildById("fnd_prompts");
  if (!child) return <div style={{ padding: 24, color: C.muted }}>Child umbrella not found</div>;

  const tabs = getChildrenForUmbrella("foundations").find(c => c.id === "fnd_prompts")?.tabs || [];
  
  const [progress, setProgress] = useState(() => {
    try {
      const stored = localStorage.getItem(`hub_progress_${child.id}`);
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch { return { completed: [] }; }
  });

  const [launchedEmbeds, setLaunchedEmbeds] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeView, setActiveView] = useState("hero");

  useEffect(() => {
    try {
      localStorage.setItem(`hub_progress_${child.id}`, JSON.stringify(progress));
    } catch {}
  }, [progress, child.id]);

  const completedTopics = progress?.completed || [];
  const unlockedTopics = useMemo(() => {
    const unlocked = new Set();
    tabs.forEach(tabId => {
      const meta = getTopicMeta(tabId);
      const prereqs = meta?.p || [];
      if (prereqs.every(p => completedTopics.includes(p))) {
        unlocked.add(tabId);
      }
    });
    return Array.from(unlocked);
  }, [tabs, completedTopics]);

  const handleTabClick = (tabId) => {
    if (unlockedTopics.includes(tabId)) {
      setSelectedTopic(tabId);
      setActiveView("topic");
      onSelectTab(tabId);
    }
  };

  const handleStartPath = (pathId, topicId) => {
    setSelectedTopic(topicId);
    setActiveView("topic");
    onSelectTab(topicId);
  };

  const handleLaunchEmbed = (embed) => {
    setLaunchedEmbeds(prev => [...new Set([...prev, embed.id])]);
  };

  const handleBackToHub = () => {
    setActiveView("hero");
    setSelectedTopic(null);
  };

  const content = PROMPT_LIFECYCLE_CONTENT;
  const visualMap = content.visualMap;

  if (activeView === "topic" && selectedTopic) {
    return (
      <div style={{ padding: 24 }}>
        <button 
          onClick={handleBackToHub}
          style={{
            marginBottom: 16,
            padding: "8px 16px",
            background: "transparent",
            color: C.teal,
            border: `1px solid ${C.teal}`,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6
          }}
        >
          ← Back to Prompt Lifecycle Hub
        </button>
        <HubPage childId="fnd_prompts" onSelectTab={onSelectTab} />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <HubHero
        title={content.hero.title}
        subtitle={content.hero.subtitle}
        description={content.hero.description}
        estimatedHours={content.hero.estimatedHours}
        totalTopics={content.hero.totalTopics}
        levels={content.hero.levels}
        icon="📝"
        accentColor={C.teal}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <TopicMap
            nodes={visualMap.nodes}
            edges={visualMap.edges}
            completedTopics={completedTopics}
            unlockedTopics={unlockedTopics}
            onNodeClick={handleTabClick}
            selectedNodeId={selectedTopic}
          />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <JourneyStepper
          paths={content.quickStartPaths}
          completedTopics={completedTopics}
          onStartPath={handleStartPath}
          onTopicClick={handleTabClick}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: C.text }}>
          Key Metrics
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {content.keyMetrics.map(metric => (
            <div key={metric.label} style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 20
            }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {metric.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: C.text }}>
                  {metric.value}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>
                  {metric.trend}
                </span>
              </div>
              <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>
                {metric.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>
            War Stories from Production
          </h3>
          <span style={{ fontSize: 12, color: C.muted }}>
            {content.warStories.length} incidents documented
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {content.warStories.map(story => (
            <WarStoryCard
              key={story.id}
              story={story}
              onViewDetails={(s) => console.log("View details:", s)}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: C.text }}>
          Cross-Domain Bridges
        </h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>
          Connect Prompt Lifecycle with ML & Society and Multimodal Models
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {content.crossBridges.map(bridge => (
            <BridgeCard
              key={bridge.id}
              bridge={bridge}
              onExplore={(b) => console.log("Explore bridge:", b)}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: C.text }}>
          Interactive Demos
        </h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>
          Launch live sandboxes powered by the underlying topic engines
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {content.interactiveEmbeds.map(embed => (
            <InteractiveEmbed
              key={embed.id}
              embed={embed}
              onLaunch={handleLaunchEmbed}
              launchedEmbeds={launchedEmbeds}
            />
          ))}
        </div>
      </div>

      <div style={{ 
        padding: 24, 
        background: `linear-gradient(135deg, ${C.teal}08 0%, ${C.surface} 100%)`,
        border: `1px solid ${C.teal}33`,
        borderRadius: 16,
        textAlign: "center"
      }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: C.text }}>
          Ready to start?
        </h3>
        <p style={{ margin: "0 0 16px", color: C.muted, fontSize: 14 }}>
          Pick a learning path above or jump directly to any unlocked topic
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          {content.quickStartPaths.map(path => (
            <button
              key={path.id}
              onClick={() => {
                const firstTopic = path.topics.find(t => unlockedTopics.includes(t));
                if (firstTopic) handleTabClick(firstTopic);
              }}
              disabled={!path.topics.some(t => unlockedTopics.includes(t))}
              style={{
                padding: "12px 24px",
                background: path.id === "l1-foundations" ? C.teal : "transparent",
                color: path.id === "l1-foundations" ? "#000" : C.teal,
                border: `1px solid ${C.teal}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: path.topics.some(t => unlockedTopics.includes(t)) ? "pointer" : "not-allowed",
                opacity: path.topics.some(t => unlockedTopics.includes(t)) ? 1 : 0.5
              }}
            >
              Start {path.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}