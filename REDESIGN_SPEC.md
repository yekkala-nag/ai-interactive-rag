# AI Systems Knowledge Base — Apple-Level Redesign Specification

## Design Philosophy
**"Calm technology that amplifies human cognition"** — Every pixel serves understanding. No decoration without function. Motion clarifies, never distracts. The interface disappears; the knowledge remains.

---

## 1. INFORMATION ARCHITECTURE

### 1.1 Module Structure (6 → 5, consolidated)
| Module | Tabs | Focus |
|--------|------|-------|
| **Foundations** | 5 | Core concepts, architecture, prompt engineering |
| **RAG Systems** | 10 | Retrieval architectures, pipelines, production patterns |
| **Context & Memory** | 7 | Context engineering, evaluation, memory systems |
| **Agent Systems** | 11 | ReAct, multi-agent, LangChain, LangGraph, debugging |
| **Platform & Production** | 15 | Engineering layers, document structure, data platforms, cost, frontiers |

*Total: 48 tabs (unchanged), reorganized for cognitive flow*

### 1.2 Navigation Model
- **Primary**: Collapsible sidebar (280px → 72px) with module accordions
- **Secondary**: Contextual top bar showing current module + sibling tabs as pills
- **Tertiary**: Command palette (⌘K) for instant search/jump
- **Breadcrumb**: Module > Sub-topic > Tab (clickable)

### 1.3 Content Hierarchy (per tab)
```
Tab View
├── Hero Section (context, key metrics, entry point)
├── Primary Content (interactive diagrams, simulators, structured sections)
├── Secondary Content (code, tables, deep-dives) — collapsible
├── Related Tabs (cross-references)
└── Footer Actions (copy, share, progress)
```

---

## 2. VISUAL LANGUAGE

### 2.1 Color System (Semantic, not decorative)

#### Light Mode (Primary)
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-canvas` | `#FAFAF9` | Page background |
| `--bg-surface` | `#FFFFFF` | Cards, panels |
| `--bg-surface-hover` | `#F5F5F4` | Hover states |
| `--bg-elevated` | `#FFFFFF` | Modals, dropdowns |
| `--border-subtle` | `#E7E5E4` | Dividers |
| `--border-default` | `#D6D3D1` | Input borders |
| `--border-strong` | `#A8A29E` | Focus rings |
| `--text-primary` | `#1C1917` | Headings, body |
| `--text-secondary` | `#57534E` | Meta, captions |
| `--text-tertiary` | `#A8A29E` | Disabled, placeholders |
| `--text-inverse` | `#FAFAF9` | On colored backgrounds |

#### Accent Colors (Module-coded, accessible)
| Module | Primary | Light | Dark | Usage |
|--------|---------|-------|------|-------|
| Foundations | `#0D9488` (teal-600) | `#CCFBF1` | `#064E3B` | Module 1 |
| RAG Systems | `#CA8A04` (yellow-600) | `#FEF9C3` | `#713F12` | Module 2 |
| Context & Memory | `#9333EA` (purple-600) | `#F5E6FF` | `#3B0764` | Module 3 |
| Agent Systems | `#DC2626` (red-600) | `#FEF2F2` | `#7F1D1D` | Module 4 |
| Platform & Production | `#2563EB` (blue-600) | `#DBEAFE` | `#1E3A8A` | Module 5 |

#### Semantic States
| State | Light | Dark |
|-------|-------|------|
| Success | `#16A34A` | `#22C55E` |
| Warning | `#CA8A04` | `#EAB308` |
| Error | `#DC2626` | `#EF4444` |
| Info | `#2563EB` | `#3B82F6` |

### 2.2 Typography Scale (System fonts, no external deps)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Display | SF Pro Display | 36px | 700 | 1.1 | -0.02em |
| H1 | SF Pro Display | 28px | 700 | 1.15 | -0.01em |
| H2 | SF Pro Display | 22px | 600 | 1.25 | 0 |
| H3 | SF Pro Text | 18px | 600 | 1.35 | 0 |
| H4 | SF Pro Text | 15px | 600 | 1.4 | 0 |
| Body Large | SF Pro Text | 16px | 400 | 1.6 | 0 |
| Body | SF Pro Text | 14px | 400 | 1.6 | 0 |
| Body Small | SF Pro Text | 13px | 400 | 1.5 | 0 |
| Caption | SF Pro Text | 11px | 500 | 1.4 | 0.02em |
| Code | SF Mono | 13px | 400 | 1.6 | 0 |
| Code Small | SF Mono | 12px | 400 | 1.5 | 0 |

*Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif`*

### 2.3 Spacing System (4px base unit)
| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Micro gaps |
| `--space-2` | 8px | Inline gaps |
| `--space-3` | 12px | Component padding |
| `--space-4` | 16px | Standard padding |
| `--space-5` | 20px | Section gaps |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Section margins |
| `--space-10` | 40px | Page margins |
| `--space-12` | 48px | Hero margins |
| `--space-16` | 64px | Module margins |

### 2.4 Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, badges |
| `--radius-md` | 8px | Cards, inputs |
| `--radius-lg` | 12px | Modals, panels |
| `--radius-xl` | 16px | Hero sections |
| `--radius-full` | 9999px | Pills, avatars |

### 2.5 Shadows (Layered, purposeful)
| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.03)` | Subtle lift |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.05)` | Cards default |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.06)` | Hover cards |
| `--shadow-lg` | `0 12px 28px rgba(0,0,0,0.08)` | Dropdowns, modals |
| `--shadow-xl` | `0 20px 40px rgba(0,0,0,0.10)` | Full-screen modals |

### 2.6 Motion System (Respectful, clarifying)

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--motion-instant` | 0ms | — | Color changes |
| `--motion-fast` | 120ms | `cubic-bezier(0.2, 0, 0, 1)` | Hover, focus |
| `--motion-base` | 200ms | `cubic-bezier(0.2, 0, 0, 1)` | Transitions |
| `--motion-slow` | 320ms | `cubic-bezier(0.2, 0, 0, 1)` | Panel slides |
| `--motion-spring` | — | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Entrance, expansions |

**Reduced motion**: All animations disabled when `prefers-reduced-motion: reduce`

---

## 3. COMPONENT SYSTEM

### 3.1 Layout Primitives

#### `Page` — Root container
```jsx
<Page>
  <Page.Sidebar>...</Page.Sidebar>
  <Page.Main>
    <Page.Header>...</Page.Header>
    <Page.Content>...</Page.Content>
  </Page.Main>
</Page>
```

#### `Container` — Constrained content width
- `--container-narrow`: 640px (reading)
- `--container-normal`: 960px (standard)
- `--container-wide`: 1280px (diagrams, tables)
- `--container-full`: 100% (edge-to-edge)

#### `Section` — Semantic content block
```jsx
<Section variant="default | bordered | elevated | hero">
  <Section.Header>...</Section.Header>
  <Section.Body>...</Section.Body>
  <Section.Footer>...</Section.Footer>
</Section>
```

#### `Grid` — Responsive layouts
```jsx
<Grid columns={{ base: 1, md: 2, lg: 3 }} gap="md | lg">
  <Grid.Item>...</Grid.Item>
</Grid>
```

### 3.2 Navigation Components

#### `Sidebar` — Collapsible, accessible
- **Expanded**: 280px, module accordions with tab lists
- **Collapsed**: 72px, icons only with tooltip on hover
- **Keyboard**: Arrow keys navigate, Enter selects, Escape collapses

#### `TopBar` — Contextual, sticky
- Breadcrumb: Module > Sub-topic > Tab
- Sibling tabs as horizontal scrollable pills
- Search trigger (⌘K)

#### `CommandPalette` — Global search
- Opens with ⌘K / Ctrl+K
- Fuzzy search across tabs, content, code
- Keyboard-only navigation

#### `ModuleSwitcher` — Quick module jump
- In sidebar header or top bar
- Shows all 5 modules with progress indicators

### 3.3 Content Components

#### `Hero` — Tab entry point
```jsx
<Hero module="rag" title="9 RAG Architectures" description="...">
  <Hero.Metric label="Architectures" value="9" />
  <Hero.Metric label="Patterns" value="Production-ready" />
  <Hero.Action label="Start with Hybrid" href="#hybrid" />
</Hero>
```

#### `Card` — Content container
```jsx
<Card variant="default | bordered | elevated | interactive">
  <Card.Media>...</Card.Media>  // diagram, image
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>
```

#### `Callout` — Attention patterns
```jsx
<Callout type="info | tip | warning | danger | success">
  <Callout.Icon />
  <Callout.Title>...</Callout.Title>
  <Callout.Description>...</Callout.Description>
</Callout>
```

#### `Diagram` — Interactive SVG wrapper
```jsx
<Diagram src="/assets/xyz.svg" alt="..." caption="...">
  <Diagram.Zoomable />  // built-in fullscreen zoom
</Diagram>
```

#### `CodeBlock` — Syntax highlighted, copyable
```jsx
<CodeBlock language="python" filename="rag.py" highlightLines={[3,5]}>
{code}
</CodeBlock>
```

#### `Stepper` — Animated multi-step processes
```jsx
<Stepper steps={[{label, detail, icon, color}]} activeStep={2} />
```

#### `Table` — Sortable, responsive
```jsx
<Table columns={[{key, header, render}]} data={rows} sortable />
```

#### `ProgressTracker` — Module completion
```jsx
<ProgressTracker module="rag" completed={3} total={10} />
```

### 3.4 Form & Interactive Components

#### `Button` — Variants: primary, secondary, ghost, danger
#### `Input` — With label, error, helper text
#### `Select` — Native feel, keyboard support
#### `Tabs` — Horizontal, animated indicator
#### `Accordion` — Single/multi expand
#### `Tooltip` — Hover/focus, smart positioning
#### `Popover` — Click-triggered, rich content
#### `Modal` — Focus trap, escape to close

---

## 4. INTERACTION PATTERNS

### 4.1 Navigation
- **Sidebar click**: Navigate to tab, highlight in sidebar, update URL
- **Top bar pill click**: Same, with smooth scroll to tab content
- **Command palette**: Instant filter, arrow keys, enter to go
- **Keyboard shortcuts**: `g` + `m` (module), `g` + `t` (tab), `?` (help)

### 4.2 Content Interactions
- **Diagram click**: Fullscreen zoom with pan/zoom controls
- **Code block**: Copy button, line highlight on hover, filename
- **Stepper**: Auto-play, manual step, keyboard (←/→)
- **Accordion**: Smooth height animation, ARIA expanded
- **Table**: Sort click, column resize, horizontal scroll on mobile

### 4.3 Feedback
- **Toast**: Non-blocking, auto-dismiss (4s), actionable
- **Loading**: Skeleton screens for async content
- **Empty states**: Illustration + action button
- **Error boundaries**: Graceful degradation, retry button

---

## 5. ACCESSIBILITY (WCAG 2.1 AA)

- **Color contrast**: All text ≥ 4.5:1, UI ≥ 3:1
- **Focus visible**: 2px solid accent, 2px offset
- **Keyboard**: All interactive elements reachable, logical order
- **Screen readers**: Semantic HTML, ARIA labels, live regions
- **Reduced motion**: `prefers-reduced-motion` respected
- **Zoom**: Content reflows at 200% zoom

---

## 6. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Sidebar off-canvas, top bar collapsed, single column |
| Tablet | 640–1024px | Sidebar collapsible, 2-col grids |
| Desktop | 1024–1440px | Full sidebar, 3-col grids |
| Wide | > 1440px | Max container 1280px, centered |

---

## 7. IMPLEMENTATION PHASES

### Phase 1: Design System Foundation
- [ ] CSS custom properties (tokens)
- [ ] Base typography, reset
- [ ] Layout primitives (Page, Container, Section, Grid)
- [ ] Button, Input, Card, Callout
- [ ] Color mode (light only for v1, dark later)

### Phase 2: Navigation System
- [ ] Sidebar (collapsible, accordion, keyboard)
- [ ] TopBar (breadcrumb, sibling pills, search trigger)
- [ ] CommandPalette (⌘K, fuzzy search)
- [ ] URL sync, browser history

### Phase 3: Content Components
- [ ] Hero, Diagram, CodeBlock, Stepper, Table
- [ ] Accordion, Tabs, Tooltip, Modal
- [ ] Toast, Skeleton, EmptyState

### Phase 4: Tab Migration (Module by Module)
- [ ] Foundations (5 tabs)
- [ ] RAG Systems (10 tabs)
- [ ] Context & Memory (7 tabs)
- [ ] Agent Systems (11 tabs)
- [ ] Platform & Production (15 tabs)

### Phase 5: Polish & Quality
- [ ] Micro-interactions, spring animations
- [ ] Keyboard shortcuts, command palette
- [ ] Accessibility audit
- [ ] Performance (code splitting, lazy load)
- [ ] Cross-browser testing

---

## 8. SUCCESS METRICS

| Metric | Target |
|--------|--------|
| Time to find any tab | < 3 seconds |
| Task completion (e.g., "find Hybrid RAG code") | < 30 seconds |
| Keyboard-only navigation | 100% coverage |
| Lighthouse Accessibility | 100 |
| Lighthouse Performance | > 90 |
| Bundle size (gzipped) | < 200 KB initial |

---

*This specification is the single source of truth for the redesign. All implementation decisions trace back to these principles.*