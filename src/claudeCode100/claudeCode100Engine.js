// ============================================================================
// SOLVING 100+ TASKS WITH CLAUDE CODE & SUB-AGENT ORCHESTRATION ENGINE
// Pure logic for Task Triaging, Bifurcation (Micro vs Mega), Git Worktree Isolation,
// Pre-Flight HTML Reports, and 30-Second Verification Checklists
// ============================================================================

export const PIPELINE_STEPS = [
  {
    step: 1,
    title: "1. Centralized Ingestion",
    icon: "💬",
    channel: "Slack / Linear / GitHub Issues",
    description: "All bug reports, micro-feature requests, and design tweaks land in a centralized intake channel. Automated bots turn messages into tracked Linear tickets."
  },
  {
    step: 2,
    title: "2. Daily Time-Boxed Session",
    icon: "📅",
    channel: "Claude Code CLI (e.g. session-2026-08-30)",
    description: "Launch a single master Claude Code session per working day rather than 100 disparate ad-hoc terminal windows."
  },
  {
    step: 3,
    title: "3. Pre-Flight Triage & Bifurcation",
    icon: "⚖️",
    channel: "HTML Triage Report & Clarification",
    description: "Agent maps out all daily tickets into an HTML report. Small autonomous fixes proceed; complex architectural issues are bifurcated via Upfront Handoff to dedicated threads."
  },
  {
    step: 4,
    title: "4. Git Worktree Sub-Agent Isolation",
    icon: "🌲",
    channel: "git worktree add ../task-xxx",
    description: "Claude Code spins up isolated sub-agents in independent git worktrees so parallel tasks never collide on file locks or git branch states."
  },
  {
    step: 5,
    title: "5. Autonomous Dev & Self-Review",
    icon: "⚡",
    channel: "Test Runner & Localhost Server",
    description: "Each sub-agent implements changes, runs unit tests / localhost previews, conducts an automated self-review, and commits directly to dev."
  },
  {
    step: 6,
    title: "6. 30-Second Verification HTML Report",
    icon: "📋",
    channel: "Interactive Testing Checklist",
    description: "Agent delivers a final HTML testing report with verbatim user quotes, deep-links to the exact test screens, and validation checkboxes for rapid 30s signoff."
  }
];

export const SAMPLE_TASKS_DATABASE = [
  {
    id: "LIN-101",
    title: "Fix broken pricing table tier toggle on mobile viewport",
    source: "Slack #product-feedback",
    category: "Design / CSS",
    estimatedTime: "5 mins",
    decision: "Autonomous Sub-Agent",
    worktree: "worktree-lin-101-pricing-toggle",
    status: "Verified",
    testUrl: "http://localhost:3000/pricing?preview=mobile",
    notes: "CSS flex-wrap overflow on screens < 400px resolved with clamp()."
  },
  {
    id: "LIN-102",
    title: "Refactor core authentication service to support Multi-Tenant Okta SSO",
    source: "Linear Ticket #102",
    category: "Major Architecture",
    estimatedTime: "4 hours",
    decision: "Upfront Handoff to Dedicated Thread",
    worktree: "N/A (Bifurcated)",
    status: "Handoff Created",
    testUrl: "N/A",
    notes: "High ambiguity and security impact. Requires interactive human session with custom identity provider credentials."
  },
  {
    id: "LIN-103",
    title: "Add export to CSV button on customer churn analytics table",
    source: "Slack #growth-ops",
    category: "Micro-Feature",
    estimatedTime: "10 mins",
    decision: "Autonomous Sub-Agent",
    worktree: "worktree-lin-103-churn-csv",
    status: "Verified",
    testUrl: "http://localhost:3000/analytics/churn",
    notes: "Client-side blob generation with sanitized RFC-4180 CSV escaping."
  },
  {
    id: "LIN-104",
    title: "Fix PostgreSQL connection pool exhaustion during daily backup cron",
    source: "Sentry Alert #892",
    category: "Bug / DevOps",
    estimatedTime: "15 mins",
    decision: "Autonomous Sub-Agent",
    worktree: "worktree-lin-104-pg-pool",
    status: "In Dev",
    testUrl: "http://localhost:3000/admin/db-health",
    notes: "Scoped connection context using with-block pool disposal."
  }
];

export const GENERATE_HTML_TRIAGE_REPORT_PREVIEW = (tasks) => {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #e2e8f0; padding: 20px; }
    .card { background: #161e2e; border: 1px solid #2d3748; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
    .badge-auto { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .badge-handoff { background: rgba(245, 166, 35, 0.2); color: #f5a623; }
    .code { font-family: monospace; background: #090d16; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }
  </style>
</head>
<body>
  <h2>🚀 Daily Claude Code Triage Report (${tasks.length} Tasks)</h2>
  <p>Pre-flight analysis for automated sub-agent worktrees and task bifurcation.</p>
  ${tasks.map(t => `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <strong>[${t.id}] ${t.title}</strong>
        <span class="badge ${t.decision.includes('Handoff') ? 'badge-handoff' : 'badge-auto'}">${t.decision}</span>
      </div>
      <div style="font-size: 12px; color: #94a3b8;">Source: ${t.source} | Est. Time: ${t.estimatedTime}</div>
      <div style="margin-top: 6px; font-size: 12px;">Target Worktree: <span class="code">${t.worktree}</span></div>
    </div>
  `).join('')}
</body>
</html>`;
};

export const BASH_WORKTREE_ORCHESTRATION_SCRIPT = `#!/usr/bin/env bash
# ============================================================================
# CLAUDE CODE 100-TASK WORKTREE ORCHESTRATION SCRIPT
# Automates git worktree creation, sub-agent spawning, and clean teardown
# ============================================================================

set -euo pipefail

TASK_ID="\$1"
TASK_BRANCH="task/\$TASK_ID"
WORKTREE_DIR="../worktrees/\$TASK_ID"

echo "🌲 Provisioning isolated git worktree for \$TASK_ID..."
git fetch origin dev
git worktree add -b "\$TASK_BRANCH" "\$WORKTREE_DIR" origin/dev

cd "\$WORKTREE_DIR"
echo "📦 Installing workspace dependencies in isolated worktree..."
npm ci --silent

echo "🤖 Spawning Claude Code autonomous sub-agent in \$WORKTREE_DIR..."
# Claude Code executes task in total isolation without interfering with main repo
claude --print "Implement task \$TASK_ID according to Linear spec. Run unit tests and verify build."

echo "🚀 Pushing changes to dev and cleaning up worktree..."
git push origin "\$TASK_BRANCH"
cd -
git worktree remove "\$WORKTREE_DIR"
echo "✅ Task \$TASK_ID completed and worktree removed!"
`;
