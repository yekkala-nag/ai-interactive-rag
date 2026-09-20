# TASK: Restructure sidebar navigation from a flat tab list into parent-hub + sequential sub-pages

## Context
GenAI learning site with 187 existing content tabs (repo: `ai-interactive-rag`, live: https://ai-interactive-rag.vercel.app/).
A prior color-consistency pass (Batch 1 implemented) standardized the palette to design-system tokens (`var(--ds-*)`): Teal/Cyan `#5EC4C8`, Coral/Peach `#F0A89A`, Lavender `#C9B8E8`, off-white `#F5F5F7`, code-dark `#0F1219`. That work is separate — do not regress it (see Constraints).

## Current state
Content is organized into hub topics, but subtopics render as individual entries in the main sidebar — e.g. prompt-related tabs (Prompt Engineering & Cognitive Patterns, Prompt Management, Structured Outputs, Claude Workflows, Prompt Learning & English Feedback, Prompt Dependency Graph, Unhobbling Claude 5, Prompt Contracts & Version Gates, Prompt Regression Detection, Prompt Framework & Methodology, …) each appear as their own sidebar row. Some carry level tags (L1/L2/L3) and colored status dots. Across 187 tabs, the sidebar is a long flat list.
Note: the repo's `Navigation.jsx` sidebar already groups by umbrella when collapsed; reconcile screenshot vs. repo state during inventory rather than assuming either is canonical.

## Decided (do not re-ask)
- **Hub = one of the 6 umbrella topics** (not hub pages, not curriculum children). Current sizes: `foundations` Foundations & Architecture (38 tabs) · `data_platform` Data & Platform Layers (36) · `rag_architecture` RAG Architectures & Pipelines (36) · `context_memory` Context & Memory Engineering (14) · `agents_frameworks` Agent Systems & Frameworks (40) · `frontiers_production` Production & Frontiers (23).
- **Hub click lands on the hub overview page** (existing `HubPage` kept as page 0), which carries a clear "Start →" into subtopic 1.
- **Route scheme: agent proposes** per hub in the batch report (flat `?tab=<id>` retained vs. nested `?hub=X&topic=Y`); optimize for minimal routing risk unless nested params clearly pay off.
- **Last subtopic shows BOTH**: primary next-hub link + secondary back-to-overview.
- **Batching**: with 6 hubs total, Phase 1 runs as a SINGLE batch covering all 6 (no 10-per-batch split needed).

## Target state
1. Sidebar shows ONE entry per parent hub (6 entries), not one per subtopic.
2. Clicking a hub opens its overview page (page 0), with a "Start →" leading into subtopic 1 (level order L1 → L2 → L3 unless told otherwise).
3. Subtopics become PAGES nested inside their hub, no longer listed individually in the main sidebar.
4. Each subtopic page has "Previous topic" / "Next topic" controls (bottom; top optional) moving sequentially through the hub in order. Last subtopic: primary link to next hub + secondary back-to-overview.
5. Each hub shows position/progress (pick ONE pattern — stepper, breadcrumb, or "X of Y" counter — and apply consistently across all 6 hubs). Never strand the learner in a context-free next-only flow.
6. L1/L2/L3 tags and colored status dots must remain visible on each subtopic page or in the in-hub stepper. No metadata loss.

## Method

### Phase 0 — Inventory (once, before planning)
- Enumerate all 6 hubs and, per hub, list current subtopics in existing order with level tag (L1/L2/L3) and status-dot color where shown.
- Output one master table: Hub name | # subtopics | subtopic list (in order) | ambiguous "next" orders (same level, no explicit sequence).
- Flag any hub whose order can't be inferred from level tags alone as OPEN QUESTION. Do not silently guess orderings.

### Phase 1 — Single-batch plan (all 6 hubs)
a. Confirm intended subtopic order per hub (level tags primarily; surface Phase 0 open questions for approval).
b. Propose the new sidebar entry per hub + full subpage route list (per Decided route-scheme rule above).
c. Specify the prev/next component: appearance, placement, last-subtopic behavior (next-hub primary + overview secondary).
d. Specify the single position/progress pattern applied consistently.
e. Note subtopic titles needing shortening for collapsed display (truncation with "…" already occurs).
f. Output a BATCH REPORT: hub → old tab count → new sidebar entry → subpage route list → nav component notes → open questions.
g. Do NOT write/implement code until the batch report is explicitly approved.

### Phase 2 — After approval
- Master implementation plan: routing changes, sidebar component changes, new prev/next component spec, consolidated unresolved ordering questions.
- Flag any hub that doesn't fit cleanly (e.g. single-subtopic hub — should it collapse?) rather than forcing the pattern.

## Constraints
- INFORMATION ARCHITECTURE only — do not rewrite or edit subtopic content.
- Preserve all subtopic content, level tags, and status indicators; change navigation only.
- No code until the batch report is explicitly approved.
- Ambiguous order / tag meaning / single-subtopic handling → OPEN QUESTION, never an assumption.
- Search/⌘K must keep finding all subtopics (sidebar collapse must not hide content from search).
- Any NEW components (prev/next, stepper, progress) must use existing `var(--ds-*)` design tokens only — no new hex values (protects the completed color pass).
- If a batch's plan is approved with the phrase "implement batch", implement that batch only.
