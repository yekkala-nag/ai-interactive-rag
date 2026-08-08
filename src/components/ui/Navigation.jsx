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
export function Sidebar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  collapsed,
  onToggleCollapse,
}) {
  const [expandedModules, setExpandedModules] = useState({
    foundations: true,
    rag: true,
    context: false,
    agents: false,
    platform: false,
  });

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const moduleOrder = ['foundations', 'rag', 'context', 'agents', 'platform'];

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '280px',
        minWidth: collapsed ? '72px' : '280px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        background: 'var(--ds-color-bg-surface)',
        borderRight: '1px solid var(--ds-color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--ds-motion-duration-base) var(--ds-motion-easing-standard), min-width var(--ds-motion-duration-base) var(--ds-motion-easing-standard)',
        zIndex: 'var(--ds-zIndex-sidebar)',
        overflow: 'hidden',
      }}
      aria-label="Main navigation"
    >
      {/* BRAND HEADER */}
      <div style={{
        padding: collapsed ? 'var(--ds-space-4) var(--ds-space-2)' : 'var(--ds-space-5)',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '64px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)', overflow: 'hidden', flex: 1 }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--ds-radius-md)',
            background: 'linear-gradient(135deg, var(--ds-color-module-foundations-primary), var(--ds-color-module-rag-primary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'var(--ds-font-weight-bold)', fontSize: '1.1rem', color: 'white', flexShrink: 0
          }}>
            ⚡
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--ds-font-family-display)',
                fontWeight: 'var(--ds-font-weight-bold)',
                fontSize: 'var(--ds-font-size-h4)',
                color: 'var(--ds-color-text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
              }}>
                AI Systems
              </div>
              <div style={{
                fontSize: 'var(--ds-font-size-caption)',
                color: 'var(--ds-color-text-tertiary)',
                fontFamily: 'var(--ds-font-family-mono)',
                letterSpacing: 'var(--ds-font-letterSpacing-wide)',
                textTransform: 'uppercase',
              }}>
                Knowledge Base
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} aria-label="Collapse sidebar" style={{ padding: 'var(--ds-space-1)' }}>
            ◀
          </Button>
        )}
      </div>

      {/* SEARCH */}
      {!collapsed && (
        <div style={{ padding: 'var(--ds-space-4)', borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
          <Input
            placeholder="Search (⌘K)..."
            value={searchQuery}
            onChange={onSearchChange}
            leftIcon={<span style={{ color: 'var(--ds-color-text-tertiary)' }}>⌕</span>}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* MODULE ACCORDIONS */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: collapsed ? 'var(--ds-space-3) var(--ds-space-1)' : 'var(--ds-space-3) var(--ds-space-4)' }}>
        {moduleOrder.map(moduleId => {
          const module = UMBRELLA_TOPICS.find(m => m.id === moduleId);
          if (!module) return null;
          const tabs = getTabsForUmbrella(moduleId);
          const isExpanded = expandedModules[moduleId] || searchQuery.length > 0;
          const hasActiveTab = tabs.some(t => t.id === activeTab);
          const moduleColors = getModuleColors(moduleId);

          return (
            <div key={moduleId} style={{
              borderRadius: 'var(--ds-radius-lg)',
              background: hasActiveTab ? `${moduleColors.light}30` : 'transparent',
              border: `1px solid ${hasActiveTab ? `${moduleColors.primary}40` : 'transparent'}`,
              marginBottom: 'var(--ds-space-2)',
              overflow: 'hidden',
            }}>
              {/* MODULE HEADER */}
              <button
                onClick={() => collapsed ? onToggleCollapse() : toggleModule(moduleId)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'space-between',
                  padding: collapsed ? 'var(--ds-space-3)' : 'var(--ds-space-3) var(--ds-space-3)',
                  background: 'none', border: 'none', color: hasActiveTab ? moduleColors.primary : 'var(--ds-color-text-secondary)',
                  cursor: 'pointer', textAlign: 'left', transition: 'color var(--ds-motion-duration-fast)',
                  fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'var(--ds-font-weight-medium)',
                  fontFamily: 'var(--ds-font-family-sans)',
                }}
                onMouseEnter={e => e.currentTarget.style.color = hasActiveTab ? moduleColors.primary : 'var(--ds-color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = hasActiveTab ? moduleColors.primary : 'var(--ds-color-text-secondary)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)', minWidth: 0 }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{module.icon}</span>
                  {!collapsed && (
                    <span style={{
                      fontWeight: 'var(--ds-font-weight-semibold)',
                      color: hasActiveTab ? moduleColors.primary : 'inherit',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {module.title}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)', flexShrink: 0 }}>
                    <Badge variant="default" size="sm">{tabs.length}</Badge>
                    <span style={{ fontSize: '0.875rem', color: 'var(--ds-color-text-tertiary)' }}>
                      {isExpanded ? '▾' : '▸'}
                    </span>
                  </div>
                )}
              </button>

              {/* SUB-TABS */}
              {!collapsed && isExpanded && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-1)',
                  padding: 'var(--ds-space-2) var(--ds-space-2) var(--ds-space-3) calc(var(--ds-space-3) + 36px)',
                  borderLeft: `2px solid ${moduleColors.primary}30`,
                  marginLeft: 'var(--ds-space-3)',
                }}>
                  {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => onSelectTab(tab.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)',
                          padding: 'var(--ds-space-2) var(--ds-space-3)',
                          borderRadius: 'var(--ds-radius-md)',
                          background: isActive ? moduleColors.primary : 'transparent',
                          color: isActive ? 'white' : 'var(--ds-color-text-secondary)',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                          fontSize: 'var(--ds-font-size-bodySm)', fontWeight: isActive ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-normal)',
                          fontFamily: 'var(--ds-font-family-sans)', transition: 'all var(--ds-motion-duration-fast)',
                          width: '100%',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--ds-color-bg-surfaceHover)'; }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{tab.icon}</span>
                        <span style={{
                          lineHeight: 'var(--ds-font-lineHeight-snug)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
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
      </nav>

      {/* COLLAPSED FOOTER */}
      {collapsed && (
        <div style={{ padding: 'var(--ds-space-4)', borderTop: '1px solid var(--ds-color-border-subtle)' }}>
          <Button variant="secondary" size="sm" fullWidth onClick={onToggleCollapse} aria-label="Expand sidebar">
            ▶ Expand
          </Button>
        </div>
      )}
    </aside>
  );
}

// ============================================
// TopBar — Contextual header with breadcrumb + sibling tabs
// ============================================
export function TopBar({ activeTab, onSelectTab, onSearchOpen }) {
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
      boxShadow: 'var(--ds-shadow-xs)',
    }}>
      {/* BREADCRUMB ROW */}
      <div style={{
        padding: 'var(--ds-space-4) var(--ds-space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--ds-space-4)', flexWrap: 'wrap',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)', flexWrap: 'wrap' }}>
          <Badge variant="module" moduleId={currentModule.id} size="md" dot>
            <span>{currentModule.icon}</span>
            <span>{currentModule.title}</span>
          </Badge>
          <span style={{ color: 'var(--ds-color-text-tertiary)' }}>/</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-2)' }}>
            <span style={{ fontSize: '1.25rem' }}>{currentTab.icon}</span>
            <span style={{
              fontFamily: 'var(--ds-font-family-sans)',
              fontWeight: 'var(--ds-font-weight-semibold)',
              fontSize: 'var(--ds-font-size-body)',
              color: 'var(--ds-color-text-primary)',
            }}>{currentTab.label}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-space-3)' }}>
          <span style={{
            fontSize: 'var(--ds-font-size-caption)',
            color: 'var(--ds-color-text-tertiary)',
            fontFamily: 'var(--ds-font-family-mono)',
          }}>
            {activeIndex + 1} of {siblingTabs.length}
          </span>
          <Button variant="ghost" size="sm" onClick={onSearchOpen} aria-label="Open command palette (⌘K)">
            <kbd style={{ fontSize: 'var(--ds-font-size-caption)', padding: '2px 6px', background: 'var(--ds-color-bg-surfaceHover)', borderRadius: 'var(--ds-radius-sm)', border: '1px solid var(--ds-color-border-subtle)' }}>⌘K</kbd>
          </Button>
        </div>
      </div>

      {/* SIBLING TABS — Horizontal scrollable pills */}
      <div
        ref={scrollRef}
        style={{
          padding: 'var(--ds-space-3) var(--ds-space-6)',
          display: 'flex', gap: 'var(--ds-space-2)',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          background: 'var(--ds-color-bg-canvas)',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        {siblingTabs.map(tab => (
          <button
            key={tab.id}
            data-tab-id={tab.id}
            onClick={() => onSelectTab(tab.id)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 'var(--ds-space-2)',
              padding: 'var(--ds-space-2) var(--ds-space-4)',
              borderRadius: 'var(--ds-radius-full)',
              background: tab.id === activeTab ? moduleColors.primary : 'var(--ds-color-bg-surface)',
              color: tab.id === activeTab ? 'white' : 'var(--ds-color-text-secondary)',
              border: `1px solid ${tab.id === activeTab ? moduleColors.primary : 'var(--ds-color-border-subtle)'}`,
              fontFamily: 'var(--ds-font-family-sans)',
              fontWeight: tab.id === activeTab ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)',
              fontSize: 'var(--ds-font-size-bodySm)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              scrollSnapAlign: 'center',
              transition: 'all var(--ds-motion-duration-fast)',
              boxShadow: tab.id === activeTab ? `0 2px 8px ${moduleColors.primary}30` : 'none',
            }}
            onMouseEnter={e => {
              if (tab.id !== activeTab) {
                e.currentTarget.style.borderColor = moduleColors.primary;
                e.currentTarget.style.color = moduleColors.primary;
              }
            }}
            onMouseLeave={e => {
              if (tab.id !== activeTab) {
                e.currentTarget.style.borderColor = 'var(--ds-color-border-subtle)';
                e.currentTarget.style.color = 'var(--ds-color-text-secondary)';
              }
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
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

  const filteredTabs = tabs
    .filter(t => t.label.toLowerCase().includes(query.toLowerCase()) || (t.keywords?.some?.(k => k.toLowerCase().includes(query.toLowerCase()))))
    .slice(0, 8);

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
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filteredTabs.length - 1)); }
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
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
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
            placeholder="Search tabs, concepts, code..."
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
      <div style={{ padding: 'var(--ds-space-3) var(--ds-space-4)', borderTop: '1px solid var(--ds-color-border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--ds-space-2)' }}>
        <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
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