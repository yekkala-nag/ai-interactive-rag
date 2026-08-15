/**
 * Navigation Components — Sidebar, TopBar, CommandPalette, ModuleSwitcher
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { UMBRELLA_TOPICS, getTabsForUmbrella, getUmbrellaForTab, getTabById } from '../../registry/tabsRegistry.js';
import { getModuleColors } from '../../design-system/tokens.js';
import { Button, Badge, Input } from './Core.jsx';
import { Flex, Stack } from '../layout/Primitives.jsx';

// ============================================
// Sidebar — Collapsible, accordion navigation
// ============================================
// ============================================
// Sidebar — Collapsible, accordion navigation
// ============================================
export function Sidebar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  collapsed,
  onToggleCollapse,
}) {
  const [expandedModules, setExpandedModules] = useState({
    foundations: false,
    rag_architecture: true,
    context_memory: false,
    agents_frameworks: false,
    data_platform: false,
    frontiers_production: false,
  });

  // Auto-focus the module containing the currently active tab (single-accordion focus)
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
        // Single open accordion mode for clean, uncluttered navigation
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

  let totalVisibleTabs = 0;

  return (
    <aside
      style={{
        width: '100%',
        height: '100vh',
        background: 'var(--ds-color-bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      aria-label="Main navigation"
    >
      {/* BRAND HEADER */}
      <div style={{
        padding: collapsed ? '12px 6px' : '14px 16px',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '60px',
        background: 'var(--ds-color-bg-surface)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1 }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '1.05rem', color: 'white', flexShrink: 0,
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
          }}>
            ⚡
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: 'var(--ds-font-family-display)',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: 'var(--ds-color-text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                AI Systems
              </span>
              <span style={{
                fontSize: '0.65rem',
                color: 'var(--ds-color-text-tertiary)',
                fontFamily: 'var(--ds-font-family-mono)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}>
                Knowledge Base
              </span>
            </div>
          )}
        </div>

        {!collapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            title="Collapse sidebar"
            style={{
              background: 'transparent',
              border: '1px solid var(--ds-color-border-subtle)',
              borderRadius: '6px',
              color: 'var(--ds-color-text-secondary)',
              cursor: 'pointer',
              padding: '4px 7px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--ds-color-bg-surfaceHover)'; e.currentTarget.style.color = 'var(--ds-color-text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ds-color-text-secondary)'; }}
            aria-label="Collapse sidebar"
          >
            ◂
          </button>
        )}
      </div>

      {/* SEARCH INPUT */}
      {!collapsed && (
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-surface)', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '10px', color: 'var(--ds-color-text-tertiary)', fontSize: '0.9rem', pointerEvents: 'none' }}>⌕</span>
            <input
              type="text"
              placeholder="Search topics (⌘K)..."
              value={typeof searchQuery === 'string' ? searchQuery : (searchQuery?.target?.value || '')}
              onChange={(e) => onSearchChange?.(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 28px 7px 30px',
                borderRadius: '6px',
                border: '1px solid var(--ds-color-border-default)',
                background: 'var(--ds-color-bg-canvas)',
                color: 'var(--ds-color-text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: 'var(--ds-font-family-sans)',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--ds-color-border-focus)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--ds-color-border-default)'}
            />
            {queryStr.length > 0 && (
              <button
                onClick={() => onSearchChange?.('')}
                style={{
                  position: 'absolute', right: '8px', background: 'none', border: 'none',
                  color: 'var(--ds-color-text-tertiary)', cursor: 'pointer', fontSize: '0.8rem', padding: '2px'
                }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODULE ACCORDIONS NAV */}
      <nav style={{
        flex: 1,
        overflowY: 'auto',
        padding: collapsed ? '8px 4px' : '8px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        scrollbarWidth: 'thin'
      }}>
        {moduleOrder.map(moduleId => {
          const module = UMBRELLA_TOPICS.find(m => m.id === moduleId);
          if (!module) return null;
          const rawTabs = getTabsForUmbrella(moduleId);
          const tabs = queryStr
            ? rawTabs.filter(t =>
                t.label.toLowerCase().includes(queryStr) ||
                t.id.toLowerCase().includes(queryStr) ||
                (t.keywords && t.keywords.some(k => k.toLowerCase().includes(queryStr)))
              )
            : rawTabs;

          if (queryStr && tabs.length === 0) return null;

          totalVisibleTabs += tabs.length;
          const isExpanded = queryStr.length > 0 ? true : (expandedModules[moduleId] ?? false);
          const hasActiveTab = rawTabs.some(t => t.id === activeTab);
          const moduleColors = getModuleColors(moduleId);

          return (
            <div key={moduleId} style={{
              borderRadius: '8px',
              background: hasActiveTab ? 'rgba(0,0,0,0.02)' : 'transparent',
              border: `1px solid ${hasActiveTab ? `${moduleColors.primary}30` : 'transparent'}`,
              marginBottom: '2px',
              transition: 'all 0.15s ease'
            }}>
              {/* MODULE HEADER */}
              <button
                onClick={() => collapsed ? onToggleCollapse?.() : toggleModule(moduleId)}
                title={module.title}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: collapsed ? '8px' : '8px 10px',
                  background: hasActiveTab ? `${moduleColors.light}40` : 'none',
                  border: 'none',
                  color: hasActiveTab ? moduleColors.primary : 'var(--ds-color-text-primary)',
                  cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.84rem', fontWeight: 700,
                  fontFamily: 'var(--ds-font-family-sans)',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (!hasActiveTab) e.currentTarget.style.background = 'var(--ds-color-bg-surfaceHover)'; }}
                onMouseLeave={e => { if (!hasActiveTab) e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{module.icon}</span>
                  {!collapsed && (
                    <span style={{
                      fontWeight: 700,
                      color: hasActiveTab ? moduleColors.primary : 'inherit',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      fontSize: '0.83rem',
                    }}>
                      {module.title}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '6px' }}>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      background: hasActiveTab ? `${moduleColors.primary}20` : 'var(--ds-color-bg-surfaceHover)',
                      color: hasActiveTab ? moduleColors.primary : 'var(--ds-color-text-tertiary)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                    }}>
                      {tabs.length}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--ds-color-text-tertiary)' }}>
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  </div>
                )}
              </button>

              {/* SUB-TABS */}
              {!collapsed && isExpanded && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  padding: '4px 6px 6px 10px',
                  borderLeft: `2px solid ${moduleColors.primary}40`,
                  marginLeft: '14px',
                  marginTop: '2px',
                  marginBottom: '4px'
                }}>
                  {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onSelectTab(tab.id)}
                        title={tab.label}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          background: isActive ? moduleColors.primary : 'transparent',
                          color: isActive ? '#ffffff' : 'var(--ds-color-text-secondary)',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          fontSize: '0.78rem',
                          fontWeight: isActive ? 700 : 500,
                          fontFamily: 'var(--ds-font-family-sans)',
                          transition: 'all 0.12s ease',
                          width: '100%',
                          position: 'relative'
                        }}
                        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--ds-color-bg-surfaceHover)'; e.currentTarget.style.color = 'var(--ds-color-text-primary)'; } }}
                        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--ds-color-text-secondary)'; } }}
                      >
                        <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>{tab.icon}</span>
                        <span style={{
                          lineHeight: 1.3,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          flex: 1
                        }}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {queryStr && totalVisibleTabs === 0 && (
          <div style={{ padding: 'var(--ds-space-6)', textAlign: 'center', color: 'var(--ds-color-text-tertiary)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔍</div>
            <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>No tabs match "{queryStr}"</div>
            <button
              onClick={() => onSearchChange?.('')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid var(--ds-color-border-default)',
                background: 'var(--ds-color-bg-surface)',
                color: 'var(--ds-color-text-secondary)',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </nav>

      {/* COLLAPSED EXPAND BUTTON */}
      {collapsed && (
        <div style={{ padding: '10px', borderTop: '1px solid var(--ds-color-border-subtle)', textAlign: 'center' }}>
          <button
            onClick={onToggleCollapse}
            title="Expand sidebar"
            style={{
              background: 'var(--ds-color-bg-surfaceHover)',
              border: '1px solid var(--ds-color-border-subtle)',
              borderRadius: '6px',
              color: 'var(--ds-color-text-primary)',
              cursor: 'pointer',
              padding: '6px',
              fontSize: '0.85rem',
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
// TopBar — Clean contextual header (Desktop + Mobile)
// ============================================
export function TopBar({ activeTab, onSelectTab, onSearchOpen, onToggleSidebar, sidebarCollapsed }) {
  const currentModule = getUmbrellaForTab(activeTab);
  const currentTab = getTabById(activeTab);
  const siblingTabs = getTabsForUmbrella(currentModule.id);
  const activeIndex = siblingTabs.findIndex(t => t.id === activeTab);
  const moduleColors = getModuleColors(currentModule.id);

  const scrollRef = useRef(null);

  useEffect(() => {
    const btn = scrollRef.current?.querySelector(`[data-tab-id="${activeTab}"]`);
    if (btn) {
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeTab]);

  return (
    <header style={{
      background: 'var(--ds-color-bg-surface)',
      borderBottom: '1px solid var(--ds-color-border-subtle)',
      position: 'sticky', top: 0, zIndex: 'var(--ds-zIndex-sticky)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
        padding: '10px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '12px', flexWrap: 'wrap',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}>
        {/* Left: Mobile Toggle + Breadcrumb Path */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flexWrap: 'wrap' }}>
          {/* Mobile hamburger button — ONLY on screen width <= 768px */}
          {onToggleSidebar && (
            <button
              className="topbar-mobile-menu-btn"
              onClick={onToggleSidebar}
              aria-label="Toggle mobile navigation menu"
              style={{
                alignItems: 'center', gap: '4px',
                padding: '5px 10px',
                background: 'var(--ds-color-bg-canvas)',
                border: '1px solid var(--ds-color-border-default)',
                borderRadius: '6px',
                color: 'var(--ds-color-text-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <span>☰</span>
              <span>Menu</span>
            </button>
          )}

          {/* Module Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '3px 8px', borderRadius: '6px',
            background: `${moduleColors.light}60`,
            color: moduleColors.dark || moduleColors.primary,
            fontSize: '0.8rem', fontWeight: 600,
            border: `1px solid ${moduleColors.primary}30`
          }}>
            <span>{currentModule.icon}</span>
            <span>{currentModule.title}</span>
          </div>

          <span style={{ color: 'var(--ds-color-text-tertiary)', fontSize: '0.85rem' }}>/</span>

          {/* Active Tab Name */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.1rem' }}>{currentTab.icon}</span>
            <span style={{
              fontFamily: 'var(--ds-font-family-sans)',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: 'var(--ds-color-text-primary)',
            }}>
              {currentTab.label}
            </span>
          </div>
        </div>

        {/* Right: Counter & Search Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--ds-color-text-tertiary)',
            fontFamily: 'var(--ds-font-family-mono)',
            fontWeight: 600,
          }}>
            {activeIndex + 1} of {siblingTabs.length}
          </span>
          <button
            onClick={onSearchOpen}
            title="Search knowledge base (⌘K)"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '4px 8px',
              background: 'var(--ds-color-bg-canvas)',
              border: '1px solid var(--ds-color-border-default)',
              borderRadius: '6px',
              color: 'var(--ds-color-text-secondary)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            <span>⌕ Search</span>
            <kbd style={{ fontSize: '0.7rem', padding: '1px 4px', background: 'var(--ds-color-bg-surface)', borderRadius: '3px', border: '1px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-tertiary)' }}>⌘K</kbd>
          </button>
        </div>
      </div>

      {/* SIBLING TABS — Horizontal quick switcher */}
      <div
        ref={scrollRef}
        style={{
          padding: '6px 14px',
          display: 'flex', gap: '6px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          background: 'var(--ds-color-bg-canvas)',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {siblingTabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => onSelectTab(tab.id)}
              title={tab.label}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px',
                borderRadius: '16px',
                background: isActive ? moduleColors.primary : 'var(--ds-color-bg-surface)',
                color: isActive ? '#ffffff' : 'var(--ds-color-text-secondary)',
                border: `1px solid ${isActive ? moduleColors.primary : 'var(--ds-color-border-subtle)'}`,
                fontFamily: 'var(--ds-font-family-sans)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer', whiteSpace: 'nowrap',
                scrollSnapAlign: 'center',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? `0 2px 6px ${moduleColors.primary}35` : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = moduleColors.primary;
                  e.currentTarget.style.color = moduleColors.primary;
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--ds-color-border-subtle)';
                  e.currentTarget.style.color = 'var(--ds-color-text-secondary)';
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

// ============================================
// CommandPalette — Global search (⌘K)
// ============================================
export function CommandPalette({ isOpen, onClose, tabs, onSelectTab }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

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
      style={{
        position: 'fixed', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(640px, 90vw)', zIndex: 'var(--ds-zIndex-modal)',
        background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-default)',
        borderRadius: 'var(--ds-radius-xl)', boxShadow: 'var(--ds-shadow-xl)',
        animation: 'slideDown var(--ds-motion-duration-base) var(--ds-motion-easing-spring)',
      }}
      role="dialog" aria-modal="true" aria-label="Command palette"
    >
      <style jsx>{`
        @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
      <div style={{ padding: 'var(--ds-space-4)', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)', background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-default)', borderRadius: 'var(--ds-radius-lg)', padding: 'var(--ds-space-2) var(--ds-space-3)' }}>
          <span style={{ color: 'var(--ds-color-text-tertiary)', fontSize: '1.1rem' }}>⌕</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tabs (e.g., langchain, langgraph, prompt, rag)..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-text-primary)', width: '100%', fontFamily: 'var(--ds-font-family-sans)' }}
          />
          <kbd style={{ fontSize: 'var(--ds-font-size-caption)', padding: '2px 6px', background: 'var(--ds-color-bg-surface)', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-tertiary)' }}>⌘K</kbd>
        </div>
      </div>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {filteredTabs.length === 0 ? (
          <div style={{ padding: 'var(--ds-space-10)', textAlign: 'center', color: 'var(--ds-color-text-tertiary)' }}>
            No results for "{query}"
          </div>
        ) : (
          filteredTabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => { onSelectTab(tab.id); onClose(); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)',
                padding: 'var(--ds-space-3) var(--ds-space-4)', background: i === selectedIndex ? 'var(--ds-color-module-foundations-light)' : 'transparent',
                border: 'none', textAlign: 'left', cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '1.25rem', width: '28px', textAlign: 'center' }}>{tab.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'var(--ds-font-weight-medium)', color: 'var(--ds-color-text-primary)' }}>{tab.label}</div>
                <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>{tab.umbrellaId ? UMBRELLA_TOPICS.find(u => u.id === tab.umbrellaId)?.title : ''}</div>
              </div>
              {i === selectedIndex && <span style={{ color: 'var(--ds-color-module-foundations-primary)' }}>→</span>}
            </button>
          ))
        )}
      </div>
      <div style={{ padding: 'var(--ds-space-3) var(--ds-space-4)', borderTop: '1px solid var(--ds-color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
          {filteredTabs.length} matching tab{filteredTabs.length === 1 ? '' : 's'}
        </span>
        <Button variant="ghost" size="sm" onClick={onClose}>Close (Esc)</Button>
      </div>
    </div>
  );
}

// ============================================
// ModuleSwitcher — Quick module jump
// ============================================
export function ModuleSwitcher({ activeModuleId, onSelectModule }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--ds-space-2)', flexWrap: 'wrap' }}>
      {UMBRELLA_TOPICS.map(module => {
        const isActive = module.id === activeModuleId;
        const colors = getModuleColors(module.id);
        return (
          <button
            key={module.id}
            onClick={() => onSelectModule(module.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)',
              padding: 'var(--ds-space-2) var(--ds-space-3)',
              borderRadius: 'var(--ds-radius-md)',
              background: isActive ? colors.primary : 'var(--ds-color-bg-surface)',
              color: isActive ? 'white' : 'var(--ds-color-text-secondary)',
              border: `1px solid ${isActive ? colors.primary : 'var(--ds-color-border-subtle)'}`,
              fontSize: 'var(--ds-font-size-bodySm)',
              fontWeight: 'var(--ds-font-weight-medium)',
              cursor: 'pointer',
              transition: 'all var(--ds-motion-duration-fast)',
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