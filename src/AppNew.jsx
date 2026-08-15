/**
 * New App Shell — Apple-level redesign
 * Uses the design system for consistent, premium experience
 */

import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import { globalStyles } from './design-system/globalStyles.js';
import { Page, Container, Section } from './components/layout/Primitives.jsx';
import { Sidebar, TopBar, CommandPalette } from './components/ui/Navigation.jsx';
import { ToastProvider, useToast, Skeleton } from './components/ui/Feedback.jsx';
import { UMBRELLA_TOPICS, getUmbrellaForTab, getTabsForUmbrella, getTabById, TABS_REGISTRY } from './registry/tabsRegistry.js';
import ErrorBoundary from './ErrorBoundary.jsx';
import { s as legacyStyles } from './styles/legacyStyles.js';

// Lazy-load all tab components
const TabComponents = {
  overview: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.OverviewTabNew }))),
  glossary: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AIGlossaryTab }))),
  archconcepts: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ArchConceptsTab }))),
  workflows: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ClaudeWorkflowsTab }))),
  unhobbling: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.UnhobblingTab }))),
  promptmgmt: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PromptMgmtTab }))),

  rag: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.RAGTypesTab }))),
  pipeline: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PipelineTab }))),
  filtering: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.FilteringTab }))),
  hierrag: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HierarchicalRetrievalTab }))),
  qparseloop: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.QuestionParsingLoopTab }))),
  prodrag: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ProductionRAGTab }))),
  routercheap: lazy(() => import('./zeroModelRouter/ZeroModelRouterTab.jsx')),
  workflowloop: lazy(() => import('./workflowLoop/WorkflowLoopTab.jsx')),
  genpatterns: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.GenPatternsTab }))),
  fourpdfs: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.FourPDFsTab }))),
  hallucbricks: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HallucBricksTab }))),
  agenticrag: lazy(() => import('./agenticRAG/AgenticRAGTab.jsx')),
  ragcasestudies: lazy(() => import('./tabs/RAGCaseStudiesTab.jsx')),
  interviewprep: lazy(() => import('./tabs/InterviewPrepTab.jsx')),

  ctxeng: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ContextEngineeringTab }))),
  ctxmeasure: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ContextMeasureTab }))),
  companybrain: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.CompanyBrainTab }))),
  contextgraph: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ContextGraphTab }))),
  vague: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.VagueQuestionsTab }))),
  hallucination: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HallucinationLoopTab }))),
  memeng: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.MemoryEngineeringTab }))),

  cliagent: lazy(() => import('./cliAgents/CliAgentTab.jsx')),
  redesign: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.RedesignWorkTab }))),
  fiveassets: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.FiveAssetsTab }))),
  multiagent: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.MultiAgentTab }))),
  agentsastools: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AgentsAsToolsTab }))),
  codingagentsnonprog: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.NonProgCodingAgentsTab }))),
  langchain: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.LangChainTab }))),
  langgraph: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.LangGraphTab }))),
  compare: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.CompareTab }))),
  agentscale: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.HighScaleAgentsTab }))),
  agentdebugging: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AgentDebuggingTab }))),
  agenttasks: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AgentTasksTab }))),
  aiproductbuilder: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AIProductBuilderTab }))),

  threelayers: lazy(() => import('./engineeringLayers/ThreeLayersTab.jsx')),
  docstruct: lazy(() => import('./documentStructure/DocumentStructureTab.jsx')),
  agenticparsing: lazy(() => import('./agenticParsing/AgenticParsingTab.jsx')),
  aidataplat: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AIDataPlatformTab }))),
  medallionarch: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.MedallionArchTab }))),
  aitestdatabottleneck: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.AITestDataBottleneckTab }))),
  classicalml: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ClassicalMLTab }))),
  activelearn: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ActiveLearningTab }))),

  powerfeatures: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PowerFeaturesTab }))),
  frontiers: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ResearchFrontiersTab }))),
  ragbeyond: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.RAGBeyondTab }))),
  practices: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.PracticesTab }))),
  tokenbill: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.TokenBillTab }))),
  progress: lazy(() => import('./AppContent.jsx').then(m => ({ default: m.ProgressTab }))),
};

function TabLoader({ tabId }) {
  const Component = TabComponents[tabId];
  // #region agent log
  fetch('http://127.0.0.1:7939/ingest/11e91471-d03c-4845-97c7-dda683ded1d4',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'262cb1'},body:JSON.stringify({sessionId:'262cb1',runId:'post-fix',hypothesisId:'A',location:'AppNew.jsx:TabLoader',message:'TabLoader render props check',data:{tabId,hasComponent:!!Component,propsPassedToComponent:['s'],legacyStylesDefined:typeof legacyStyles,hasSectionLabel:typeof legacyStyles?.sectionLabel,passingS:true,componentName:Component?.displayName||Component?.name||'lazy'},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  if (!Component) return <div style={{ padding: 'var(--ds-space-10)', textAlign: 'center', color: 'var(--ds-color-text-tertiary)' }}>Tab not found: {tabId}</div>;
  return (
    <Suspense fallback={<TabSkeleton />}>
      <ErrorBoundary key={tabId} fallback={<TabError tabId={tabId} />}>
        <Component s={legacyStyles} />
      </ErrorBoundary>
    </Suspense>
  );
}

function TabSkeleton() {
  return (
    <Section variant="bordered" style={{ minHeight: '400px' }}>
      <div style={{ padding: 'var(--ds-space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ds-space-4)' }}>
          <Skeleton variant="title" width="40%" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="card" height="200px" />
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="70%" />
        </div>
      </div>
    </Section>
  );
}

function TabError({ tabId }) {
  const { error } = useToast();
  return (
    <Section variant="bordered" style={{ padding: 'var(--ds-space-10)', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--ds-space-4)' }}>⚠️</div>
      <h3 style={{ marginBottom: 'var(--ds-space-2)' }}>Failed to load tab</h3>
      <p style={{ color: 'var(--ds-color-text-secondary)', marginBottom: 'var(--ds-space-6)' }}>
        Could not load <code style={{ background: 'var(--ds-color-bg-surfaceHover)', padding: '2px 6px', borderRadius: 'var(--ds-radius-sm)' }}>{tabId}</code>
      </p>
      <button onClick={() => window.location.reload()} style={{ padding: 'var(--ds-space-2) var(--ds-space-4)', background: 'var(--ds-color-module-foundations-primary)', color: 'white', border: 'none', borderRadius: 'var(--ds-radius-md)', cursor: 'pointer' }}>
        Reload Page
      </button>
    </Section>
  );
}

// ============================================
// Main App Component
// ============================================
export default function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    return tab && TABS_REGISTRY.some(t => t.id === tab) ? tab : 'overview';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  // URL sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', activeTab);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
  }, [activeTab]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setMobileOpen(false);
      }
      if (e.key === '[' && (e.metaKey || e.ctrlKey)) {
        setSidebarCollapsed(!sidebarCollapsed);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [sidebarCollapsed]);

  const handleTabSelect = useCallback((tabId) => {
    setActiveTab(tabId);
    setCommandPaletteOpen(false);
    setMobileOpen(false);
  }, []);

  const handleSearchOpen = useCallback(() => {
    setCommandPaletteOpen(true);
  }, []);

  // Find active module for sidebar highlighting
  const activeModule = getUmbrellaForTab(activeTab)?.id || 'foundations';

  return (
    <ToastProvider>
      <Page
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        sidebar={
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleTabSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            collapsed={sidebarCollapsed}
            onToggleCollapse={setSidebarCollapsed}
          />
        }
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={setSidebarCollapsed}
      >
        <TopBar
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          onSearchOpen={handleSearchOpen}
          onToggleSidebar={() => setMobileOpen(!mobileOpen)}
          sidebarCollapsed={!mobileOpen}
        />

        <Container size="normal">
          <TabLoader tabId={activeTab} />
        </Container>

        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          tabs={TABS_REGISTRY}
          onSelectTab={handleTabSelect}
        />
      </Page>
    </ToastProvider>
  );
}

// Ensure global styles are injected
globalStyles;