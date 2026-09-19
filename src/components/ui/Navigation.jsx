/**
 * Navigation Components — Sidebar, TopBar, CommandPalette, ModuleSwitcher
 * Apple Product Architecture & UI/UX Redesign (macOS Sequoia / Sonoma Aesthetic)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { UMBRELLA_TOPICS, getTabsForUmbrella, getUmbrellaForTab, getTabById, TABS_REGISTRY } from '../../registry/tabsRegistry.js';
import { getModuleColors } from '../../design-system/tokens.js';
import { Button, Badge } from './Core.jsx';
import {
  getCurrentTrackId,
  getTrackById,
  getTrackProgress,
  subscribeToAdaptiveProgress
} from '../../services/adaptiveLearning.js';
import {
  getGroupedTabsForUmbrella,
  getTopicMeta,
  getLevelInfo,
  getChildLevelCounts,
  getChildById,
  sortTopicsLikeJourney
} from '../../registry/curriculum.js';
import { useModalA11y } from '../../hooks/useModalA11y.js';
import { isMastered } from '../../services/mastery.js';

// Category accents — trio-mapped. primary = fills/graphics only;
// dark = any text on white (all ≥4.5); NEVER white text on primary.
const MODULE_ACCENTS = {
  foundations: { primary: '#5EC4C8', dark: '#1F6B6E', gradient: 'linear-gradient(135deg, #5EC4C8, #3A9B9F)', lightBg: 'rgba(42,181,176,0.12)', border: 'rgba(42,181,176,0.35)' },
  rag_architecture: { primary: '#F0A89A', dark: '#C47A6A', gradient: 'linear-gradient(135deg, #F0A89A, #C47A6A)', lightBg: 'rgba(255,138,107,0.14)', border: 'rgba(255,138,107,0.4)' },
  context_memory: { primary: '#9B89C4', dark: '#6B5E94', gradient: 'linear-gradient(135deg, #C9B8E8, #9B89C4)', lightBg: 'rgba(139,123,216,0.14)', border: 'rgba(139,123,216,0.4)' },
  agents_frameworks: { primary: '#F0A89A', dark: '#C47A6A', gradient: 'linear-gradient(135deg, #F0A89A, #C47A6A)', lightBg: 'rgba(255,138,107,0.14)', border: 'rgba(255,138,107,0.4)' },
  data_platform: { primary: '#5EC4C8', dark: '#1F6B6E', gradient: 'linear-gradient(135deg, #5EC4C8, #3A9B9F)', lightBg: 'rgba(42,181,176,0.12)', border: 'rgba(42,181,176,0.35)' },
  frontiers_production: { primary: '#9B89C4', dark: '#6B5E94', gradient: 'linear-gradient(135deg, #C9B8E8, #9B89C4)', lightBg: 'rgba(139,123,216,0.14)', border: 'rgba(139,123,216,0.4)' }
};

// ============================================
// Sidebar — Apple macOS Sequoia Glass Sidebar
// ============================================
export function Sidebar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  collapsed,
  onToggleCollapse,
}) {
  const [trackId, setTrackId] = useState(() => getCurrentTrackId());
  const [trackProgress, setTrackProgress] = useState(() => getTrackProgress(trackId));

  useEffect(() => {
    const refresh = () => {
      const t = getCurrentTrackId();
      setTrackId(t);
      setTrackProgress(getTrackProgress(t));
      setProgTick(x => x + 1);
    };
    refresh();
    return subscribeToAdaptiveProgress(refresh);
  }, []);

  const activeTrack = getTrackById(trackId);
  // Tick state: bumped on every progress broadcast (mastery shares the
  // event) so per-child micro-bars re-render fresh. Value unused.
  const [, setProgTick] = useState(0);

  const [expandedModules, setExpandedModules] = useState({
    foundations: true,
    rag_architecture: false,
    context_memory: false,
    agents_frameworks: false,
    data_platform: false,
    frontiers_production: false,
  });

  // Auto-focus the module containing the currently active tab
  useEffect(() => {
    const parentModule = getUmbrellaForTab(activeTab);
    if (parentModule?.id) {
      setExpandedModules({
        foundations: false,
        rag_architecture: false,
        context_memory: false,
        agents_frameworks: false,
        data_platform: false,
        frontiers_production: false,
        [parentModule.id]: true
      });
    }
  }, [activeTab]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => {
      const willOpen = !prev[moduleId];
      if (willOpen) {
        return {
          foundations: false,
          rag_architecture: false,
          context_memory: false,
          agents_frameworks: false,
          data_platform: false,
          frontiers_production: false,
          [moduleId]: true
        };
      } else {
        return { ...prev, [moduleId]: false };
      }
    });
  };

const moduleOrder = UMBRELLA_TOPICS.map(m => m.id);
          const queryStr = (typeof searchQuery === 'string' ? searchQuery : (searchQuery?.target?.value || '')).trim().toLowerCase();

          // Helper: filter tabs to only show hub pages (_hub) at top level
          const isHubTab = (tabId) => typeof tabId === 'string' && tabId.endsWith('_hub');
          const isSearchMode = queryStr.length > 0;

  let totalVisibleTabs = 0;
  const activeTabObj = getTabById(activeTab);

  return (
    <aside
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #147A76 0%, #0F6B68 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif',
        userSelect: 'none',
        borderRight: '1px solid rgba(255,255,255,0.15)'
      }}
      aria-label="Main navigation"
    >
      {/* 1. APPLE MACOS HEADER & TRAFFIC LIGHTS */}
      <div style={{
        padding: collapsed ? '12px 6px' : '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.18)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: 'transparent',
        flexShrink: 0
      }}>
        {/* macOS Traffic Lights (Desktop Decorative) */}
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', border: '1px solid rgba(0,0,0,0.1)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', border: '1px solid rgba(0,0,0,0.1)' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', border: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
        )}

        {/* Brand Icon & Title Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            {/* Apple Squircle Brand Icon */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #5EC4C8 50%, #6366f1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '0.95rem', color: 'white', flexShrink: 0,
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 3px 8px rgba(37, 99, 235, 0.35)'
            }}>
              ⚡
            </div>

            {!collapsed && (
              <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  AI Systems
                </span>
                <span style={{
                  fontSize: '0.62rem',
                  color: 'rgba(255,255,255,0.75)',
                  fontFamily: 'SF Mono, Menlo, Monaco, monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginTop: '1px'
                }}>
                  KNOWLEDGE BASE
                </span>
              </div>
            )}
          </div>

          {!collapsed && onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title="Collapse Sidebar (⌘[)"
              style={{
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '7px',
                color: '#fff',
                cursor: 'pointer',
                width: '26px', height: '26px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease',
                fontSize: '0.75rem'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'; }}
              aria-label="Collapse sidebar"
            >
              ◂
            </button>
          )}
        </div>
      </div>

      {/* 2. APPLE SPOTLIGHT SEARCH INPUT */}
      {!collapsed && (
        <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.18)', flexShrink: 0 }}>
          <style>{`.teal-search-input::placeholder { color: rgba(255,255,255,0.65); }`}</style>
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '8px',
            padding: '5px 8px 5px 30px',
            transition: 'all 0.15s ease'
          }}>
            <span style={{ position: 'absolute', left: '9px', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', pointerEvents: 'none' }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search topics..."
              className="teal-search-input"
              value={typeof searchQuery === 'string' ? searchQuery : (searchQuery?.target?.value || '')}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            {queryStr.length === 0 ? (
              <kbd style={{
                fontSize: '0.62rem',
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                fontFamily: 'SF Mono, monospace',
                fontWeight: 600,
                flexShrink: 0
              }}>
                ⌘K
              </kbd>
            ) : (
              <button
                onClick={() => onSearchChange?.('')}
                style={{
                  background: 'none', border: 'none',
                  color: '#fff', cursor: 'pointer', fontSize: '0.75rem', padding: '0 2px'
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. PINNED FAVORITES & TOPICS SUMMARY */}
      {!collapsed && !queryStr && (
        <div style={{ padding: '8px 12px 4px 12px', borderBottom: '1px solid rgba(255,255,255,0.18)', flexShrink: 0 }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            QUICK NAVIGATION
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <button
              onClick={() => onSelectTab('overview')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 8px', borderRadius: '6px',
                background: activeTab === 'overview' ? '#ffffff' : 'transparent',
                color: activeTab === 'overview' ? '#3A9B9F' : 'rgba(255,255,255,0.88)',
                border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.78rem',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={e => { if (activeTab !== 'overview') e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
              onMouseLeave={e => { if (activeTab !== 'overview') e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem' }}>🌟</span>
                <span>Overview & Roadmap</span>
              </div>
              <span style={{ fontSize: '0.65rem', opacity: 0.8, fontFamily: 'SF Mono, monospace' }}>All Topics</span>
            </button>

            {/* Adaptive Track Quick Link */}
            <button
              onClick={() => onSelectTab('overview')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 8px', borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)',
                cursor: 'pointer', textAlign: 'left', fontSize: '0.76rem',
                transition: 'all 0.12s ease',
                marginTop: '2px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'; }}
              title="Open Adaptive Learning Hub & Diagnostic"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                <span style={{ fontSize: '0.85rem' }}>{activeTrack.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                  {activeTrack.title}
                </span>
              </div>
              <span style={{
                fontSize: '0.65rem',
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {trackProgress.percent}%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 4. CATEGORY ACCORDIONS LIST */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: collapsed ? '8px 4px' : '8px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        scrollbarWidth: 'thin'
      }}>
{moduleOrder.map(moduleId => {
            const module = UMBRELLA_TOPICS.find(m => m.id === moduleId);
            if (!module) return null;
            const rawTabs = getTabsForUmbrella(moduleId);
            // Only show hub pages (_hub) at top level, unless searching
            const tabs = isSearchMode
              ? rawTabs.filter(t =>
                  t.label.toLowerCase().includes(queryStr) ||
                  t.id.toLowerCase().includes(queryStr) ||
                  (t.keywords && t.keywords.some(k => k.toLowerCase().includes(queryStr)))
                )
              : rawTabs.filter(isHubTab);

            // If active tab is in this module but not a hub, show it for backward compatibility
            const showNonHubActive = !isSearchMode && rawTabs.some(t => t.id === activeTab && !isHubTab(t.id));
            const displayTabs = isSearchMode ? tabs : (showNonHubActive ? [...tabs, rawTabs.find(t => t.id === activeTab)].filter(Boolean) : tabs);

            if (isSearchMode && tabs.length === 0) return null;

            totalVisibleTabs += displayTabs.length;
            const isExpanded = isSearchMode ? true : (expandedModules[moduleId] ?? false);
            const hasActiveTab = rawTabs.some(t => t.id === activeTab);
            const accent = MODULE_ACCENTS[moduleId] || MODULE_ACCENTS.foundations;

          return (
            <div key={moduleId} style={{
              borderRadius: '8px',
              transition: 'all 0.15s ease'
            }}>
              {/* ACCORDION HEADER CARD */}
              <button
                onClick={() => collapsed ? onToggleCollapse?.() : toggleModule(moduleId)}
                title={module.title}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: collapsed ? '8px' : '7px 8px',
                  background: hasActiveTab ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  border: `1px solid ${hasActiveTab ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
                  color: '#fff',
                  cursor: 'pointer', textAlign: 'left',
                  borderRadius: '7px',
                  transition: 'all 0.15s ease',
                  boxShadow: hasActiveTab ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={e => {
                  if (!hasActiveTab) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  }
                }}
                onMouseLeave={e => {
                  if (!hasActiveTab) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  {/* Category Squircle Icon */}
                  <div style={{
                    width: '26px', height: '26px', borderRadius: '7px',
                    background: accent.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', flexShrink: 0, color: 'white',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                  }}>
                    {module.icon}
                  </div>

                  {!collapsed && (
                    <span style={{
                      fontWeight: 600,
                      color: hasActiveTab ? '#fff' : 'rgba(255,255,255,0.88)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      fontSize: '0.81rem', letterSpacing: '-0.01em'
                    }}>
                      {module.title}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '4px' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      fontFamily: 'SF Mono, monospace',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(255,255,255,0.25)'
                    }}>
                      {tabs.length}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', transition: 'transform 0.15s ease', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                      ‣
                    </span>
                  </div>
                )}
              </button>

              {/* NESTED SUB-TABS LIST */}
              {!collapsed && isExpanded && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  padding: '4px 4px 4px 10px',
                  borderLeft: '1.5px solid rgba(255, 255, 255, 0.3)',
                  marginLeft: '18px',
                  marginTop: '3px',
                  marginBottom: '4px'
                }}>
                  {getGroupedTabsForUmbrella(moduleId, rawTabs).map(group => (
                    <div key={group.child ? group.child.id : 'ungrouped'} style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: group.child ? '6px' : 0 }}>
                      {group.child && (() => {
                        const provenCount = group.tabs.filter(t => isMastered(t.id)).length;
                        const pct = group.tabs.length ? Math.round((provenCount / group.tabs.length) * 100) : 0;
                        return (
                          <div
                            title={`${group.child.blurb} — ${provenCount}/${group.tabs.length} proven`}
                            style={{ padding: '6px 8px 4px 8px' }}
                          >
                            <div style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.75)', marginBottom: '3px'
                            }}>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {group.child.title}
                              </span>
                              <span style={{
                                fontFamily: 'SF Mono, monospace', fontWeight: 600, fontSize: '0.6rem',
                                background: 'rgba(255, 255, 255, 0.06)',
                                padding: '0px 6px', borderRadius: '9999px', flexShrink: 0, marginLeft: '6px'
                              }}>
                                {getChildLevelCounts(group.child.id, rawTabs)}
                              </span>
                            </div>
                            <div style={{ height: '3px', borderRadius: '3px', background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', width: `${pct}%`, borderRadius: '3px',
                                background: '#fff',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                          </div>
                        );
                      })()}
                      {group.tabs.map(tab => {
                    const meta = getTopicMeta(tab.id);
                    const lvl = getLevelInfo(meta.l);
                    const isActive = activeTab === tab.id;
                    const showFullBadge = isActive;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onSelectTab(tab.id)}
                        title={`${tab.label} — ${lvl.label}${meta.deep ? ' · Deep dive (optional)' : ''}`}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          background: isActive ? '#ffffff' : 'transparent',
                          color: isActive ? '#3A9B9F' : 'rgba(255,255,255,0.88)',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          fontSize: '0.78rem',
                          fontWeight: isActive ? 700 : 500,
                          transition: 'all 0.12s ease',
                          width: '100%',
                          boxShadow: isActive ? '0 3px 10px rgba(0,0,0,0.2)' : 'none'
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'rgba(255,255,255,0.88)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>{tab.icon}</span>
                        <span style={{
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          flex: 1
                        }}>
                          {tab.label}
                          {meta.deep && (
                            <span title="Deep dive — optional, skippable on the core path" style={{ color: '#C47A6A', fontSize: '0.7rem', marginLeft: '4px' }}>✦</span>
                          )}
                        </span>
                        {showFullBadge ? (
                          <span
                            title={lvl.label}
                            style={{
                              fontSize: '0.58rem', fontWeight: 700, fontFamily: 'SF Mono, monospace',
                              color: '#3A9B9F',
                              background: 'rgba(42,181,176,0.14)',
                              border: '1px solid rgba(42,181,176,0.4)',
                              padding: '0px 5px', borderRadius: '9999px', flexShrink: 0
                            }}
                          >
                            {lvl.short}
                          </span>
                        ) : (
                          <span
                            title={lvl.label}
                            aria-hidden="true"
                            style={{
                              width: '6px', height: '6px', borderRadius: '50%',
                              background: lvl.color, opacity: 0.9, flexShrink: 0,
                              border: '1px solid rgba(255,255,255,0.65)'
                            }}
                          />
                        )}
                        {isActive && (
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3A9B9F', flexShrink: 0 }} />
                        )}
                      </button>
                    );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {queryStr && totalVisibleTabs === 0 && (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.85)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🔍</div>
            <div style={{ fontSize: '0.8rem', marginBottom: '8px' }}>No topics match "{queryStr}"</div>
            <button
              onClick={() => onSearchChange?.('')}
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255, 255, 255, 0.16)',
                color: '#fff',
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </nav>

      {/* 5. COLLAPSED EXPAND BUTTON */}
      {collapsed && (
        <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.18)', textAlign: 'center' }}>
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar (⌘[)"
            style={{
              background: 'rgba(255, 255, 255, 0.16)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              padding: '6px',
              fontSize: '0.8rem',
              width: '100%'
            }}
            aria-label="Expand sidebar"
          >
            ▸
          </button>
        </div>
      )}
    </aside>
  );
}

// ============================================
// TopBar — macOS Toolbar & Breadcrumb Navigation
// ============================================
export function TopBar({ activeTab, onSelectTab, onSearchOpen, onToggleSidebar, sidebarCollapsed }) {
  const currentModule = getUmbrellaForTab(activeTab);
  const currentTab = getTabById(activeTab);
  const siblingTabs = getTabsForUmbrella(currentModule.id);
  const activeIndex = siblingTabs.findIndex(t => t.id === activeTab);
  const accent = MODULE_ACCENTS[currentModule.id] || MODULE_ACCENTS.foundations;

  const [trackId, setTrackId] = useState(() => getCurrentTrackId());
  const [trackProgress, setTrackProgress] = useState(() => getTrackProgress(trackId));

  useEffect(() => {
    const refresh = () => {
      const t = getCurrentTrackId();
      setTrackId(t);
      setTrackProgress(getTrackProgress(t));
    };
    refresh();
    return subscribeToAdaptiveProgress(refresh);
  }, []);

  const activeTrack = getTrackById(trackId);

  // Position-in-child: the single source of "where am I" (replaces sibling pills)
  const activeMeta = getTopicMeta(activeTab);
  const activeChild = activeMeta.c ? getChildById(activeMeta.c) : null;
  const childTabs = activeChild
    ? sortTopicsLikeJourney(getTabsForUmbrella(currentModule.id).filter(t => getTopicMeta(t.id).c === activeChild.id))
    : [];
  const childIndex = childTabs.findIndex(t => t.id === activeTab);
  const prevInChild = childIndex > 0 ? childTabs[childIndex - 1] : null;
  const nextInChild = childIndex >= 0 && childIndex < childTabs.length - 1 ? childTabs[childIndex + 1] : null;

  return (
    <header style={{
      background: 'var(--ds-color-bg-surface)',
      borderBottom: '1px solid var(--ds-color-border-subtle)',
      position: 'sticky', top: 0, zIndex: 'var(--ds-zIndex-sticky)',
      backdropFilter: 'blur(20px) saturate(180%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif'
    }}>
      <style jsx>{`
        .topbar-mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .topbar-mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>

      {/* BREADCRUMB ROW */}
      <div style={{
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}>
        {/* Left: Mobile Toggle + Breadcrumb Path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexWrap: 'wrap' }}>
          {onToggleSidebar && (
            <button
              className="topbar-mobile-menu-btn"
              onClick={onToggleSidebar}
              aria-label="Toggle mobile navigation menu"
              style={{
                alignItems: 'center', gap: '4px',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--ds-color-border-default)',
                borderRadius: '6px',
                color: 'var(--ds-color-text-primary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <span>☰ Menu</span>
            </button>
          )}

          {/* Module Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 8px', borderRadius: '6px',
            background: accent.lightBg,
            color: accent.dark,
            fontSize: '0.78rem', fontWeight: 600,
            border: `1px solid ${accent.border}`
          }}>
            <span>{currentModule.icon}</span>
            <span>{currentModule.title}</span>
          </div>

          <span style={{ color: 'var(--ds-color-text-tertiary)', fontSize: '0.8rem' }}>/</span>

          {/* Active Tab Name */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1rem' }}>{currentTab.icon}</span>
            <span style={{
              fontWeight: 700,
              fontSize: '0.85rem',
              color: 'var(--ds-color-text-primary)',
            }}>
              {currentTab.label}
            </span>
          </div>

          {/* Adaptive Track Badge */}
          <button
            onClick={() => onSelectTab('overview')}
            title={`Active Track: ${activeTrack.title} (${trackProgress.completed}/${trackProgress.total} mastered). Click to view track.`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '2px 8px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${activeTrack.color ? activeTrack.color + '50' : 'var(--ds-color-border-subtle)'}`,
              color: 'var(--ds-color-text-primary)',
              fontSize: '0.74rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{activeTrack.icon}</span>
            <span style={{ fontWeight: 600, maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeTrack.title}
            </span>
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 700,
              color: activeTrack.dark || activeTrack.color,
              background: (activeTrack.dark || activeTrack.color) ? (activeTrack.dark || activeTrack.color) + '20' : 'transparent',
              padding: '1px 4px',
              borderRadius: '4px'
            }}>
              {trackProgress.percent}%
            </span>
          </button>
        </div>

        {/* Right: Position & Search Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            title={activeChild ? `${activeChild.title} — ${activeChild.blurb}` : 'All topics in this module'}
            style={{
              fontSize: '0.72rem',
              color: 'var(--ds-color-text-tertiary)',
              fontFamily: 'SF Mono, monospace',
              fontWeight: 600,
            }}
          >
            {activeChild && childIndex >= 0
              ? `${childIndex + 1} of ${childTabs.length} · ${activeChild.title}`
              : `${activeIndex + 1} of ${siblingTabs.length}`}
          </span>
          <button
            onClick={onSearchOpen}
            title="Search knowledge base (⌘K)"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '3px 8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--ds-color-border-default)',
              borderRadius: '6px',
              color: 'var(--ds-color-text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <span>🔍 Search</span>
            <kbd style={{ fontSize: '0.65rem', padding: '1px 5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--ds-color-text-tertiary)' }}>⌘K</kbd>
          </button>
        </div>
      </div>

      {/* POSITION BAR — prev/next within the child umbrella (replaces sibling pills) */}
      {activeChild && childIndex >= 0 && (
        <div
          style={{
            padding: '5px 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
            flexWrap: 'wrap',
            background: 'var(--ds-color-bg-canvas)',
          }}
        >
          <button
            onClick={() => prevInChild && onSelectTab(prevInChild.id)}
            disabled={!prevInChild}
            title={prevInChild ? `Previous in ${activeChild.title}: ${prevInChild.label}` : `First in ${activeChild.title}`}
            aria-label={prevInChild ? `Previous topic: ${prevInChild.label}` : 'First topic in section'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '3px 10px', borderRadius: '16px',
              background: 'transparent',
              color: prevInChild ? 'var(--ds-color-text-secondary)' : 'var(--ds-color-text-tertiary)',
              border: '1px solid var(--ds-color-border-subtle)',
              fontSize: '0.74rem', fontWeight: 500,
              cursor: prevInChild ? 'pointer' : 'default',
              opacity: prevInChild ? 1 : 0.5,
              maxWidth: '42vw', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }}
          >
            <span aria-hidden="true">‹</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{prevInChild ? prevInChild.label : 'Start'}</span>
          </button>
          <span style={{ fontSize: '0.68rem', color: 'var(--ds-color-text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeChild.title}
          </span>
          <button
            onClick={() => nextInChild && onSelectTab(nextInChild.id)}
            disabled={!nextInChild}
            title={nextInChild ? `Next in ${activeChild.title}: ${nextInChild.label}` : `Last in ${activeChild.title} — continue in sidebar`}
            aria-label={nextInChild ? `Next topic: ${nextInChild.label}` : 'Last topic in section'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '3px 10px', borderRadius: '16px',
              background: nextInChild ? 'var(--ds-color-brand-tealDark, #3A9B9F)' : 'transparent',
              color: nextInChild ? '#ffffff' : 'var(--ds-color-text-tertiary)',
              border: `1px solid ${nextInChild ? 'var(--ds-color-brand-tealDark, #3A9B9F)' : 'var(--ds-color-border-subtle)'}`,
              fontSize: '0.74rem', fontWeight: nextInChild ? 700 : 500,
              cursor: nextInChild ? 'pointer' : 'default',
              opacity: nextInChild ? 1 : 0.5,
              maxWidth: '42vw', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              boxShadow: nextInChild ? '0 2px 8px rgba(23,131,127,0.35)' : 'none'
            }}
          >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextInChild ? nextInChild.label : 'End'}</span>
            <span aria-hidden="true">›</span>
          </button>
        </div>
      )}
    </header>
  );
}

// ============================================
// CommandPalette — Global Search Modal (⌘K)
// ============================================
export function CommandPalette({ isOpen, onClose, tabs, onSelectTab }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  // Focus trap + return-focus. Escape stays with the palette's own handler below.
  const { ref: dialogRef } = useModalA11y(isOpen, onClose, { dismissable: false, autofocus: false });

  const queryStr = (query || '').trim().toLowerCase();
  const filteredTabs = queryStr
    ? tabs.filter(t => {
        const matchLabel = t.label?.toLowerCase().includes(queryStr);
        const matchId = t.id?.toLowerCase().includes(queryStr);
        const matchKeywords = t.keywords?.some?.(k => k.toLowerCase().includes(queryStr));
        const matchCategory = t.category?.toLowerCase().includes(queryStr);
        const umbrella = t.umbrellaId ? UMBRELLA_TOPICS.find(u => u.id === t.umbrellaId) : null;
        const matchUmbrella = umbrella?.title?.toLowerCase().includes(queryStr) || umbrella?.description?.toLowerCase().includes(queryStr);
        return matchLabel || matchId || matchKeywords || matchCategory || matchUmbrella;
      }).slice(0, 16)
    : tabs.slice(0, 10);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, Math.max(0, filteredTabs.length - 1))); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filteredTabs[selectedIndex]) { onSelectTab(filteredTabs[selectedIndex].id); onClose(); } }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, filteredTabs, selectedIndex, onClose, onSelectTab]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="command-palette"
      style={{
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(640px, 90vw)', zIndex: 'var(--ds-zIndex-modal)',
        background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-default)',
        borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(30px) saturate(180%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
      role="dialog" aria-modal="true" aria-label="Command palette"
    >
      <div style={{ padding: '12px', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-default)', borderRadius: '10px', padding: '8px 12px' }}>
          <span style={{ color: 'var(--ds-color-text-tertiary)', fontSize: '1rem' }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search topics (e.g., QLoRA, Graph RAG, Row Level, LangChain)..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: '0.88rem', color: 'var(--ds-color-text-primary)', width: '100%', fontFamily: 'inherit' }}
          />
          <kbd style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--ds-color-text-tertiary)', fontFamily: 'SF Mono, monospace' }}>⌘K</kbd>
        </div>
      </div>
      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {filteredTabs.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--ds-color-text-tertiary)', fontSize: '0.85rem' }}>
            No results for "{query}"
          </div>
        ) : (
          filteredTabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => { onSelectTab(tab.id); onClose(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 16px', background: i === selectedIndex ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: 'none', textAlign: 'left', cursor: 'pointer',
                transition: 'background 0.1s ease'
              }}
            >
              <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{tab.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--ds-color-text-primary)' }}>{tab.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)' }}>{tab.umbrellaId ? UMBRELLA_TOPICS.find(u => u.id === t.umbrellaId)?.title : ''}</div>
              </div>
              {i === selectedIndex && <span style={{ color: '#3A9B9F', fontSize: '0.85rem' }}>➔</span>}
            </button>
          ))
        )}
      </div>
      <div
        className="bottom-nav"
        style={{
          padding: '8px 16px',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid var(--ds-color-border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)' }}>
          {filteredTabs.length} matching topic{filteredTabs.length === 1 ? '' : 's'}
        </span>
        <Button variant="ghost" size="sm" onClick={onClose}>Close (Esc)</Button>
      </div>
    </div>
  );
}

// ============================================
// ModuleSwitcher — Quick Module Switcher
// ============================================
export function ModuleSwitcher({ activeModuleId, onSelectModule }) {
  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {UMBRELLA_TOPICS.map(module => {
        const isActive = module.id === activeModuleId;
        const accent = MODULE_ACCENTS[module.id] || MODULE_ACCENTS.foundations;
        return (
          <button
            key={module.id}
            onClick={() => onSelectModule(module.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: isActive ? accent.dark : 'var(--ds-color-bg-surface)',
                color: isActive ? '#ffffff' : 'var(--ds-color-text-secondary)',
                border: `1px solid ${isActive ? accent.dark : 'var(--ds-color-border-subtle)'}`,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
          >
            <span>{module.icon}</span>
            <span>{module.title}</span>
          </button>
        );
      })}
    </div>
  );
}