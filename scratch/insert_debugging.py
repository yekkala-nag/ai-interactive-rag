import sys

with open("src/App.jsx", "r", encoding="utf-8") as f:
    content = f.read()

tab_code = '''
// ─── AGENT DEBUGGING TAB ──────────────────────────────────────────
const AgentDebuggingTab = ({ s }) => {
  const [subTab, setSubTab] = useState("workflow");

  // Simulator State
  const [viewport, setViewport] = useState("mobile");
  const [patchMode, setPatchMode] = useState("baseline");

  // Workflow Stepper State
  const [activeStep, setActiveStep] = useState(1);

  // Log Inspector State
  const [logFilter, setLogFilter] = useState("all");

  const viewportWidths = {
    mobile: 390,
    tablet: 768,
    desktop: 1200
  };

  const currentVpWidth = viewportWidths[viewport];

  const subTabs = [
    { id: "workflow", label: "🔄 5-Step Verification Protocol", desc: "Traceability pipeline: Prompt → Tool Log → DOM Check → Verified Proof" },
    { id: "simulator", label: "📱 Pricing Card Bounding Box Simulator", desc: "Interactive Playwright DOM measurement overlay & viewport switcher" },
    { id: "taxonomy", label: "📊 Failure Taxonomy & Observability Matrix", desc: "Developer bug failure patterns & LLM tracing platform matrix" },
    { id: "logs", label: "📜 Agent Execution Run Log", desc: "Structured tool execution JSON log & request/result inspector" }
  ];

  const getMetrics = () => {
    if (viewport !== "mobile") {
      return {
        cardWidth: viewport === "tablet" ? 640 : 800,
        buttonWidth: patchMode === "verified_fix" ? (viewport === "tablet" ? 592 : 752) : 360,
        overflowPx: 0,
        insideCard: true,
        selector: patchMode === "wrong_selector" ? ".support-link (Wrong target!)" : ".primary-action",
        whiteSpace: patchMode === "verified_fix" ? "normal" : "nowrap",
        label: "PASS"
      };
    }
    if (patchMode === "baseline") {
      return {
        cardWidth: 354,
        buttonWidth: 360,
        overflowPx: 29,
        insideCard: false,
        selector: ".primary-action",
        whiteSpace: "nowrap",
        label: "FAIL: Overflows right by 29px"
      };
    } else if (patchMode === "wrong_selector") {
      return {
        cardWidth: 354,
        buttonWidth: 360,
        overflowPx: 29,
        insideCard: false,
        selector: ".support-link (Wrong target!)",
        whiteSpace: "nowrap",
        label: "FAIL: Wrong selector patched"
      };
    } else {
      return {
        cardWidth: 354,
        buttonWidth: 308,
        overflowPx: 0,
        insideCard: true,
        selector: ".primary-action",
        whiteSpace: "normal",
        label: "PASS: 100% Inside Container"
      };
    }
  };

  const metrics = getMetrics();

  const verificationSteps = [
    { step: 1, title: "Trace Record Verification", status: "pass", tool: "read_file", detail: "Loaded styles.css & PricingCard.jsx (Line 42: .primary-action width: 360px)", artifact: "Prompt & DOM Tree" },
    { step: 2, title: "Reproduce Failure", status: "pass", tool: "inspect_dom", detail: "Playwright viewport 390px. buttonRight (401px) > containerRight (372px) -> overflowRightPx = 29px", artifact: "agent_overflow_boundingbox.png" },
    { step: 3, title: "Reject Naive Patch", status: "fail_prevented", tool: "apply_patch", detail: "Agent attempted .support-link patch. Re-check DOM bounding box: overflow still 29px! Patch discarded.", artifact: "Wrong Selector Alert" },
    { step: 4, title: "Apply Bounding Box Patch", status: "pass", tool: "apply_patch", detail: "Patched .primary-action with width:100%, max-width:100%, white-space:normal", artifact: "styles.css diff" },
    { step: 5, title: "Empirical DOM Proof", status: "pass", tool: "inspect_dom", detail: "Re-evaluated Playwright locator: buttonRight (349px) <= containerRight (372px) -> overflowRightPx = 0px. GREEN!", artifact: "sleek_lightbox_modal_proof.png" }
  ];

  const mockRunLog = [
    { id: 1, tool: "read_file", status: "success", type: "read", request: { path: "src/components/PricingCard.jsx" }, result: { lines: 84, targetClass: "primary-action" } },
    { id: 2, tool: "read_file", status: "success", type: "read", request: { path: "src/styles.css" }, result: { rulesFound: 14, cssRule: ".primary-action { width: 360px; white-space: nowrap; }" } },
    { id: 3, tool: "inspect_dom", status: "failed", type: "inspect", request: { label: "before_fix", viewport: { width: 390, height: 844 }, selector: "[data-component=\\"pricing-card\\"] .primary-action" }, result: { cardBox: { x: 18, width: 354, right: 372 }, buttonBox: { x: 41, width: 360, right: 401 }, buttonInsideCard: false, overflowRightPx: 29 } },
    { id: 4, tool: "apply_patch", status: "warning", type: "patch", request: { target: ".support-link", diff: "- margin-top: 12px;\\n+ margin-top: 24px;" }, result: { status: "patch applied", file: "styles.css" } },
    { id: 5, tool: "inspect_dom", status: "failed", type: "inspect", request: { label: "wrong_selector_attempt", viewport: { width: 390, height: 844 }, selector: "[data-component=\\"pricing-card\\"] .primary-action" }, result: { buttonInsideCard: false, overflowRightPx: 29, note: "DOM check rejected wrong selector patch" } },
    { id: 6, tool: "apply_patch", status: "success", type: "patch", request: { target: ".primary-action", diff: "- width: 360px;\\n- padding: 0 28px;\\n+ width: 100%;\\n+ max-width: 100%;\\n+ min-height: 48px;\\n+ padding: 0 18px;\\n- white-space: nowrap;\\n+ white-space: normal;\\n+ overflow-wrap: anywhere;" }, result: { status: "patch applied", file: "styles.css" } },
    { id: 7, tool: "run_build", status: "success", type: "build", request: { command: "npm run build" }, result: { exitCode: 0, output: "Build check passed. Copied 2 files to dist/" } },
    { id: 8, tool: "inspect_dom", status: "success", type: "inspect", request: { label: "after_fix", viewport: { width: 390, height: 844 }, selector: "[data-component=\\"pricing-card\\"] .primary-action" }, result: { cardBox: { x: 18, width: 354, right: 372 }, buttonBox: { x: 41, width: 308, right: 349 }, buttonInsideCard: true, overflowRightPx: 0 } }
  ];

  const filteredLogs = mockRunLog.filter(log => {
    if (logFilter === "all") return true;
    return log.type === logFilter;
  });

  return (
    <div style={{ padding: "0.5rem" }}>
      {/* HEADER SECTION */}
      <div style={{ background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)", borderRadius: 12, padding: "2rem", color: "#ffffff", marginBottom: "1.5rem", border: "1px solid #334155", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(225, 29, 72, 0.15)", border: "1px solid #f43f5e", borderRadius: 20, padding: "0.3rem 0.8rem", fontSize: "0.65rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#fda4af", marginBottom: "0.8rem" }}>
              <span>🔍 AGENT TRACEABILITY & VERIFICATION PROTOCOL</span>
            </div>
            <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "1.8rem", margin: 0, letterSpacing: "-0.02em", background: "linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              How to Debug AI Coding Agents When They Change the Wrong Thing
            </h1>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8", maxWidth: "850px", lineHeight: 1.6, marginTop: "0.6rem" }}>
              A systematic verification framework for recording model tool requests, function outputs, CSS patches, build checks, and Playwright DOM bounding-box proofs to prevent silent failure claims.
            </p>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid #334155", borderRadius: 8, padding: "1rem 1.2rem", minWidth: 260 }}>
            <div style={{ fontSize: "0.65rem", fontFamily: "Syne, sans-serif", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.4rem" }}>VERIFICATION SCORECARD</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.8rem", fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#10b981" }}>100%</span>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Empirical Proof</span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "0.4rem" }}>
              ✓ Zero Silent Pass Claims<br />
              ✓ Bounding Box Locators Verified<br />
              ✓ Full Trajectory Log Recorded
            </div>
          </div>
        </div>
      </div>

      {/* HERO IMAGE CONTAINER */}
      <div style={{ background: "#ffffff", border: "1px solid #e0dcd4", borderRadius: 10, padding: "1.2rem", marginBottom: "1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <div style={{ fontSize: "0.75rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#1e293b" }}>
            🎨 AI Agent Bounding Box Debugging Architecture
          </div>
          <span style={{ fontSize: "0.65rem", color: "#64748b", background: "#f1f5f9", padding: "0.2rem 0.6rem", borderRadius: 4 }}>
            Generated High-Res Diagram
          </span>
        </div>
        <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #cbd5e1" }}>
          <img
            src="/ai_agent_debugging_hero_1785850378111.png"
            alt="AI Agent Debugging Architecture"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      </div>

      {/* SUB-TAB NAVIGATION */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "2px solid #e2e8f0", marginBottom: "1.5rem", overflowX: "auto" }}>
        {subTabs.map(st => (
          <button
            key={st.id}
            onClick={() => setSubTab(st.id)}
            style={{
              padding: "0.75rem 1.2rem",
              background: subTab === st.id ? "#ffffff" : "transparent",
              border: "1px solid",
              borderColor: subTab === st.id ? "#cbd5e1 #cbd5e1 #ffffff #cbd5e1" : "transparent",
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              fontFamily: "Syne, sans-serif",
              fontSize: "0.75rem",
              fontWeight: subTab === st.id ? 700 : 500,
              color: subTab === st.id ? "#0f172a" : "#64748b",
              transition: "all 0.2s"
            }}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: WORKFLOW STEPPER */}
      {subTab === "workflow" && (
        <div>
          <div style={{ background: "#ffffff", border: "1px solid #e0dcd4", borderRadius: 10, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0f172a", margin: 0 }}>
                  5-Step Verification & Traceability Pipeline
                </h3>
                <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.2rem 0 0 0" }}>
                  Interactive verification stepper demonstrating how agent claims are empirically validated.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  disabled={activeStep === 1}
                  style={{ padding: "0.4rem 0.8rem", borderRadius: 4, border: "1px solid #cbd5e1", background: "#f8fafc", cursor: activeStep === 1 ? "not-allowed" : "pointer", fontSize: "0.7rem" }}
                >
                  ← Prev Step
                </button>
                <button
                  onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                  disabled={activeStep === 5}
                  style={{ padding: "0.4rem 0.8rem", borderRadius: 4, border: "none", background: "#2563eb", color: "#ffffff", cursor: activeStep === 5 ? "not-allowed" : "pointer", fontSize: "0.7rem", fontWeight: 600 }}
                >
                  Next Step →
                </button>
              </div>
            </div>

            {/* STEP PROGRESS BAR */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {verificationSteps.map(s => (
                <div
                  key={s.step}
                  onClick={() => setActiveStep(s.step)}
                  style={{
                    padding: "0.6rem",
                    borderRadius: 6,
                    border: "1px solid",
                    borderColor: activeStep === s.step ? "#2563eb" : "#e2e8f0",
                    background: activeStep === s.step ? "#eff6ff" : "#f8fafc",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontSize: "0.65rem", fontFamily: "Syne, sans-serif", color: activeStep === s.step ? "#2563eb" : "#64748b", fontWeight: 700 }}>
                    STEP 0{s.step}
                  </div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#1e293b", marginTop: "0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.title}
                  </div>
                </div>
              ))}
            </div>

            {/* ACTIVE STEP DETAIL VIEW */}
            {(() => {
              const current = verificationSteps.find(s => s.step === activeStep);
              return (
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "1.2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ background: "#1e293b", color: "#ffffff", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>
                        {current.step}
                      </span>
                      <span style={{ fontSize: "0.9rem", fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#0f172a" }}>
                        {current.title}
                      </span>
                    </div>
                    <span style={{
                      padding: "0.2rem 0.6rem",
                      borderRadius: 12,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      background: current.status === "pass" ? "#d1fae5" : "#fee2e2",
                      color: current.status === "pass" ? "#065f46" : "#991b1b"
                    }}>
                      {current.status === "pass" ? "VERIFIED PASS" : "WRONG PATCH REJECTED"}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.3rem" }}>Tool Action Executed</div>
                      <div style={{ fontSize: "0.75rem", fontFamily: "DM Mono, monospace", background: "#0f172a", color: "#38bdf8", padding: "0.5rem 0.8rem", borderRadius: 4 }}>
                        {current.tool}()
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#334155", marginTop: "0.6rem", lineHeight: 1.6 }}>
                        {current.detail}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700, marginBottom: "0.3rem" }}>Artifact / Empirical Evidence</div>
                      <div style={{ fontSize: "0.75rem", background: "#ffffff", border: "1px solid #cbd5e1", padding: "0.6rem 0.8rem", borderRadius: 4, color: "#0f172a", fontWeight: 600 }}>
                        📄 {current.artifact}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: BOUNDING BOX SIMULATOR */}
      {subTab === "simulator" && (
        <div style={{ background: "#ffffff", border: "1px solid #e0dcd4", borderRadius: 10, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0f172a", margin: 0 }}>
                Interactive DOM Bounding-Box Locator Simulator
              </h3>
              <p style={{ fontSize: "0.72rem", color: "#64748b", margin: "0.2rem 0 0 0" }}>
                Switch viewports and patch modes to observe real-time Playwright DOM element bounding box overlays.
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              {/* VIEWPORT CONTROLS */}
              <div style={{ display: "flex", background: "#f1f5f9", padding: "0.2rem", borderRadius: 6 }}>
                {["mobile", "tablet", "desktop"].map(vp => (
                  <button
                    key={vp}
                    onClick={() => setViewport(vp)}
                    style={{
                      padding: "0.3rem 0.7rem",
                      border: "none",
                      borderRadius: 4,
                      background: viewport === vp ? "#ffffff" : "transparent",
                      color: viewport === vp ? "#0f172a" : "#64748b",
                      fontSize: "0.68rem",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: viewport === vp ? 700 : 500,
                      cursor: "pointer",
                      boxShadow: viewport === vp ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                    }}
                  >
                    {vp === "mobile" ? "📱 Mobile (390px)" : vp === "tablet" ? "💻 Tablet (768px)" : "🖥️ Desktop (1200px)"}
                  </button>
                ))}
              </div>

              {/* PATCH MODE CONTROLS */}
              <div style={{ display: "flex", background: "#f1f5f9", padding: "0.2rem", borderRadius: 6 }}>
                {[
                  { id: "baseline", label: "🔴 Unfixed Baseline" },
                  { id: "wrong_selector", label: "⚠️ Wrong Selector Patch" },
                  { id: "verified_fix", label: "🟢 Verified Fix" }
                ].map(pm => (
                  <button
                    key={pm.id}
                    onClick={() => setPatchMode(pm.id)}
                    style={{
                      padding: "0.3rem 0.7rem",
                      border: "none",
                      borderRadius: 4,
                      background: patchMode === pm.id ? "#ffffff" : "transparent",
                      color: patchMode === pm.id ? "#0f172a" : "#64748b",
                      fontSize: "0.68rem",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: patchMode === pm.id ? 700 : 500,
                      cursor: "pointer",
                      boxShadow: patchMode === pm.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                    }}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SIMULATOR DISPLAY CANVAS */}
          <div style={{ background: "#0f172a", borderRadius: 8, padding: "1.5rem", color: "#ffffff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.7rem", fontFamily: "DM Mono, monospace", color: "#94a3b8" }}>
                VIEWPORT CANVAS: {currentVpWidth}px × 844px
              </div>
              <div style={{
                padding: "0.25rem 0.6rem",
                borderRadius: 4,
                fontSize: "0.68rem",
                fontFamily: "DM Mono, monospace",
                fontWeight: 700,
                background: metrics.insideCard ? "#065f46" : "#991b1b",
                color: "#ffffff"
              }}>
                BOUNDING BOX RESULT: {metrics.label}
              </div>
            </div>

            {/* SIMULATED CARD CONTAINER */}
            <div style={{
              width: metrics.cardWidth,
              margin: "0 auto",
              background: "#1e293b",
              border: "2px dashed #38bdf8",
              borderRadius: 8,
              padding: "1rem",
              position: "relative",
              transition: "all 0.3s ease"
            }}>
              <div style={{ fontSize: "0.65rem", color: "#38bdf8", fontFamily: "DM Mono, monospace", marginBottom: "0.5rem" }}>
                [data-component="pricing-card"] (width: {metrics.cardWidth}px)
              </div>

              {/* SIMULATED BUTTON INSIDE CONTAINER */}
              <div style={{
                width: metrics.buttonWidth,
                background: patchMode === "wrong_selector" ? "#f59e0b" : patchMode === "verified_fix" ? "#10b981" : "#ef4444",
                color: "#ffffff",
                padding: "0.6rem 1rem",
                borderRadius: 6,
                fontSize: "0.75rem",
                fontWeight: 700,
                textAlign: "center",
                whiteSpace: metrics.whiteSpace,
                transition: "all 0.3s ease",
                border: "2px solid #ffffff",
                boxShadow: "0 4px 6px rgba(0,0,0,0.2)"
              }}>
                Upgrade Pro Plan — $29/mo
              </div>

              {/* BOUNDING BOX METRICS FOOTER */}
              <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", fontSize: "0.65rem", fontFamily: "DM Mono, monospace", background: "rgba(0,0,0,0.4)", padding: "0.6rem", borderRadius: 4 }}>
                <div>Target Selector: <span style={{ color: "#38bdf8" }}>{metrics.selector}</span></div>
                <div>Button Width: <span style={{ color: "#f43f5e" }}>{metrics.buttonWidth}px</span></div>
                <div>Overflow Right: <span style={{ color: metrics.overflowPx === 0 ? "#10b981" : "#f43f5e", fontWeight: 700 }}>{metrics.overflowPx}px</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TAXONOMY & MATRIX */}
      {subTab === "taxonomy" && (
        <div>
          <div style={{ background: "#ffffff", border: "1px solid #e0dcd4", borderRadius: 10, padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: "1rem" }}>
              Agent Failure Taxonomy vs Required Verification Guardrails
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                  <th style={{ padding: "0.6rem", width: "18%" }}>Failure Type</th>
                  <th style={{ padding: "0.6rem", width: "32%" }}>Agent Mistake Description</th>
                  <th style={{ padding: "0.6rem", width: "25%" }}>Why Naive Verification Fails</th>
                  <th style={{ padding: "0.6rem", width: "25%" }}>Required Verification Guardrail</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #f0ede6" }}>
                  <td style={{ padding: "0.6rem", fontWeight: 700, color: "#c4572a" }}>Wrong File Target</td>
                  <td style={{ padding: "0.6rem" }}>Edits PayPal payment branch when the bug is in the Stripe flow.</td>
                  <td style={{ padding: "0.6rem", color: "#6a6a7a" }}>Code compiles cleanly with zero syntax errors.</td>
                  <td style={{ padding: "0.6rem", color: "#2a8a84", fontWeight: 700 }}>Mandatory read_file trace & AST Symbol Graph.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede6" }}>
                  <td style={{ padding: "0.6rem", fontWeight: 700, color: "#c4572a" }}>Weakened Test Assertion</td>
                  <td style={{ padding: "0.6rem" }}>Modifies unit test from assert total == 100 to assert total &gt; 0.</td>
                  <td style={{ padding: "0.6rem", color: "#6a6a7a" }}>npm test or pytest turns GREEN.</td>
                  <td style={{ padding: "0.6rem", color: "#2a8a84", fontWeight: 700 }}>CI diff check blocking test file modifications.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede6" }}>
                  <td style={{ padding: "0.6rem", fontWeight: 700, color: "#c4572a" }}>Disconnected Route</td>
                  <td style={{ padding: "0.6rem" }}>Patches React router while backend server still returns HTTP 401.</td>
                  <td style={{ padding: "0.6rem", color: "#6a6a7a" }}>Client renders route change locally.</td>
                  <td style={{ padding: "0.6rem", color: "#2a8a84", fontWeight: 700 }}>End-to-end HTTP response status assertion.</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f0ede6" }}>
                  <td style={{ padding: "0.6rem", fontWeight: 700, color: "#c4572a" }}>Wrong Selector Patch</td>
                  <td style={{ padding: "0.6rem" }}>Edits .support-link instead of .primary-action button.</td>
                  <td style={{ padding: "0.6rem", color: "#6a6a7a" }}>CSS parser accepts valid syntax.</td>
                  <td style={{ padding: "0.6rem", color: "#2a8a84", fontWeight: 700 }}>Playwright DOM bounding-box locator (overflowRightPx == 0).</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: RUN LOG */}
      {subTab === "logs" && (
        <div style={{ background: "#ffffff", border: "1px solid #e0dcd4", borderRadius: 10, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1rem", color: "#0f172a", margin: 0 }}>
              Agent Trajectory JSON Run Log
            </h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["all", "read", "inspect", "patch", "build"].map(filter => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  style={{
                    padding: "0.25rem 0.6rem",
                    borderRadius: 4,
                    border: "1px solid #cbd5e1",
                    background: logFilter === filter ? "#0f172a" : "#ffffff",
                    color: logFilter === filter ? "#ffffff" : "#64748b",
                    fontSize: "0.65rem",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    fontWeight: 600
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "#0f172a", borderRadius: 6, padding: "1rem", fontFamily: "DM Mono, monospace", fontSize: "0.7rem", color: "#e2e8f0", maxHeight: 400, overflowY: "auto" }}>
            {filteredLogs.map(log => (
              <div key={log.id} style={{ marginBottom: "0.8rem", borderBottom: "1px solid #1e293b", paddingBottom: "0.6rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#64748b" }}>#{log.id}</span>
                  <span style={{ color: "#38bdf8", fontWeight: 700 }}>{log.tool}</span>
                  <span style={{
                    color: log.status === "success" ? "#10b981" : log.status === "warning" ? "#f59e0b" : "#ef4444",
                    fontSize: "0.62rem"
                  }}>
                    [{log.status.toUpperCase()}]
                  </span>
                </div>
                <div style={{ color: "#94a3b8", paddingLeft: "1rem" }}>
                  Request: {JSON.stringify(log.request)}
                </div>
                <div style={{ color: "#cbd5e1", paddingLeft: "1rem", marginTop: "0.2rem" }}>
                  Result: {JSON.stringify(log.result)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
'''

# 1. Insert component before "// ─── MAIN APP"
if "const AgentDebuggingTab = " not in content:
    content = content.replace("// ─── MAIN APP ────────────────────────────────────────────────────", tab_code + "\n\n// ─── MAIN APP ────────────────────────────────────────────────────")

# 2. Add to TABS array
old_tabs_target = '{ id: "agentscale",    label: "㊲ High-Scale Agent Systems 🚀" },'
new_tabs_target = '{ id: "agentscale",    label: "㊲ High-Scale Agent Systems 🚀" },\n    { id: "agentdebugging", label: "🐞 AI Agent Debugging" },'
if "agentdebugging" not in content:
    content = content.replace(old_tabs_target, new_tabs_target)

# 3. Add to router
old_router_target = '{tab === "agentscale" && <HighScaleAgentsTab s={s} />}'
new_router_target = '{tab === "agentscale" && <HighScaleAgentsTab s={s} />}\n        {tab === "agentdebugging" && <AgentDebuggingTab s={s} />}'
if 'tab === "agentdebugging"' not in content:
    content = content.replace(old_router_target, new_router_target)

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: App.jsx updated!")
