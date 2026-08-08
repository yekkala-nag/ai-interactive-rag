import { getUmbrellaForTab, getTabsForUmbrella, getTabById } from "../../registry/tabsRegistry.js";

export default function TopBar({ activeTab, onSelectTab }) {
  const currentUmbrella = getUmbrellaForTab(activeTab);
  const currentTab = getTabById(activeTab);
  const siblingTabs = getTabsForUmbrella(currentUmbrella.id);

  return (
    <header style={{
      background: "#ffffff",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 40,
      boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
    }}>
      {/* BREADCRUMB & HEADER INFO */}
      <div style={{
        padding: "0.9rem 2rem 0.6rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f1f5f9"
      }}>
        {/* BREADCRUMB */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
          <span style={{
            background: `${currentUmbrella.color}15`,
            color: currentUmbrella.color,
            padding: "0.25rem 0.6rem",
            borderRadius: 4,
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "0.65rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}>
            <span>{currentUmbrella.icon}</span>
            <span>{currentUmbrella.title}</span>
          </span>
          <span style={{ color: "#94a3b8" }}>/</span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            color: "#0f172a",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem"
          }}>
            <span>{currentTab.icon}</span>
            <span>{currentTab.label}</span>
          </span>
        </div>

        {/* SUB-TAB COUNT INFO */}
        <div style={{
          fontSize: "0.62rem",
          color: "#64748b",
          fontFamily: "DM Mono, monospace",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span>Sub-topic {siblingTabs.findIndex(t => t.id === activeTab) + 1} of {siblingTabs.length}</span>
        </div>
      </div>

      {/* HORIZONTAL SUB-TAB PILL BUTTONS */}
      <div style={{
        padding: "0.5rem 2rem",
        display: "flex",
        gap: "0.4rem",
        overflowX: "auto",
        background: "#f8fafc"
      }}>
        {siblingTabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.8rem",
                borderRadius: 16,
                background: isActive ? currentUmbrella.color : "#ffffff",
                color: isActive ? "#ffffff" : "#475569",
                border: `1px solid ${isActive ? currentUmbrella.color : "#cbd5e1"}`,
                fontFamily: "Inter, sans-serif",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.65rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
                boxShadow: isActive ? `0 2px 6px ${currentUmbrella.color}40` : "none"
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = currentUmbrella.color;
                  e.currentTarget.style.color = currentUmbrella.color;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.color = "#475569";
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
