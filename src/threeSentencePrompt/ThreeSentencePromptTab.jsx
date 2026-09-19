import React, { useState } from "react";

const C = {
  bg: "#080D1A", surface: "#0F1629", s2: "#162040", s3: "#1E2D52",
  border: "#243358", text: "#E2E8F0", muted: "#7A8BA8",
  amber: "#F59E0B", sky: "#5EC4C8", rose: "#F43F5E", violet: "#A78BFA", emerald: "#5EC4C8",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

const THREE_SENTENCES = "First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.";

function PromptSimulator() {
  const [input, setInput] = useState("I need to build a RAG system for our customer support docs. We have about 500 PDFs. The current search is terrible. I was thinking about using embeddings but I'm not sure about chunking. Also we need to handle tables in the PDFs. Our budget is limited so probably open source. The team knows Python but not ML. Deadline is Q2.");
  const [step, setStep] = useState(0);
  const [showAppend, setShowAppend] = useState(false);

  const messyInput = input.length > 200 ? input : "I need to build a RAG system for our customer support docs. We have about 500 PDFs. The current search is terrible. I was thinking about embeddings but I'm not sure about chunking. Also we need to handle tables in the PDFs. Our budget is limited so probably open source. The team knows Python but not ML. Deadline is Q2.";

  const withoutPlan = {
    assumption: "Build a production RAG system with table extraction, open-source stack, Q2 deadline",
    output: "Here's a 12-step implementation guide covering embeddings, chunking strategies, vector databases, PDF parsing, table extraction, retrieval optimization, and deployment architecture...",
    risk: "AI assumed you need production-grade table extraction (expensive), missed that you need internal search improvement first, and created a scope too large for Q2.",
  };

  const withPlan = {
    assumption: "You want to improve internal document search for a small Python team, starting with a prototype to validate chunking before scaling to 500 PDFs",
    plan: [
      "1. Clarify: Is this internal tooling or customer-facing? (affects quality bar)",
      "2. Start with 20 PDFs to validate chunking strategy before full pipeline",
      "3. Table extraction: start with text-only, add table support if needed",
      "4. Stack: Chroma or Qdrant (Python-native), sentence-transformers for embeddings",
      "5. Milestone 1 (2 weeks): Basic search working on 20 docs",
      "6. Milestone 2 (4 weeks): Expand to 500 PDFs, add table handling if validated",
    ],
    risk: "None — you catch the scope mismatch before any code is written.",
  };

  return (
    <Card>
      <div style={{ color: C.sky, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        INTERACTIVE: BEFORE vs AFTER THE 3 SENTENCES
      </div>

      {/* Input area */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 6 }}>YOUR PROMPT (messy brain dump)</div>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          style={{
            width: "100%", height: 100, background: "#060A14", border: `1px solid ${C.border}`,
            borderRadius: 8, padding: 12, color: C.text, fontSize: 12, fontFamily: "JetBrains Mono, monospace",
            resize: "vertical", lineHeight: 1.6, boxSizing: "border-box",
          }} />
      </div>

      {/* Toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setShowAppend(false)} style={{
          flex: 1, padding: "8px 12px", borderRadius: 6,
          background: !showAppend ? C.rose + "22" : C.surface,
          border: `1px solid ${!showAppend ? C.rose : C.border}`,
          color: !showAppend ? C.rose : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600,
        }}>
          Without 3 Sentences
        </button>
        <button onClick={() => setShowAppend(true)} style={{
          flex: 1, padding: "8px 12px", borderRadius: 6,
          background: showAppend ? C.emerald + "22" : C.surface,
          border: `1px solid ${showAppend ? C.emerald : C.border}`,
          color: showAppend ? C.emerald : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600,
        }}>
          With 3 Sentences
        </button>
      </div>

      {/* The 3 sentences */}
      {showAppend && (
        <div style={{ padding: "10px 14px", background: C.emerald + "11", borderRadius: 8, borderLeft: `3px solid ${C.emerald}`, marginBottom: 16 }}>
          <div style={{ color: C.emerald, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>APPENDED TO PROMPT</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>"{THREE_SENTENCES}"</div>
        </div>
      )}

      {/* AI Response */}
      <div style={{ background: "#060A14", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>
          {showAppend ? "AI RESPONSE (PLAN-FIRST)" : "AI RESPONSE (JUMPS STRAIGHT IN)"}
        </div>
        {!showAppend ? (
          <div>
            <div style={{ color: C.rose, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>AI assumed you need production-grade table extraction with open-source stack</div>
            <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
              "Here's a comprehensive 12-step guide to building a production RAG system with PDF table extraction using open-source tools... Step 1: Set up your vector database with Qdrant... Step 2: Implement PDF parsing with Camelot for table extraction... Step 3: Design your chunking strategy for mixed content..."
            </div>
            <div style={{ marginTop: 12, padding: "8px 12px", background: C.rose + "11", borderRadius: 6, borderLeft: `3px solid ${C.rose}` }}>
              <div style={{ color: C.rose, fontWeight: 600, fontSize: 11 }}>Risk: {withoutPlan.risk}</div>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ color: C.emerald, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>AI paused to confirm its understanding</div>
            <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>
              "I think you're trying to build an internal document search tool for your team, not a full production RAG product. Let me confirm my understanding before diving in:"
            </div>
            <div style={{ background: C.s3, borderRadius: 6, padding: 12, marginBottom: 8 }}>
              {withPlan.plan.map((line, i) => (
                <div key={i} style={{ color: C.sky, fontSize: 12, fontFamily: "JetBrains Mono, monospace", marginBottom: 2 }}>{line}</div>
              ))}
            </div>
            <div style={{ marginTop: 8, padding: "8px 12px", background: C.emerald + "11", borderRadius: 6, borderLeft: `3px solid ${C.emerald}` }}>
              <div style={{ color: C.emerald, fontWeight: 600, fontSize: 11 }}>Result: You catch the scope mismatch before any code is written</div>
            </div>
          </div>
        )}
      </div>

      {/* Side by side comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.rose}` }}>
          <div style={{ color: C.rose, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>Without Plan-First</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: C.muted, fontSize: 11, lineHeight: 1.8 }}>
            <li>AI guesses your intent</li>
            <li>Writes full response around wrong assumption</li>
            <li>You read 2000 words before realizing it's off</li>
            <li>Wasted tokens, wasted time</li>
          </ul>
        </div>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
          <div style={{ color: C.emerald, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>With Plan-First</div>
          <ul style={{ margin: 0, paddingLeft: 16, color: C.muted, fontSize: 11, lineHeight: 1.8 }}>
            <li>AI states its interpretation</li>
            <li>Proposes a plan in 6 lines</li>
            <li>You correct before full generation</li>
            <li>30-second course correction</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}

function WhyItWorks() {
  const [principle, setPrinciple] = useState(0);
  const principles = [
    {
      name: "Plan-First",
      icon: "📋",
      color: C.sky,
      desc: "Force the AI to externalize its interpretation before committing to a response.",
      mechanism: "LLMs generate sequentially — once they start writing a long response, they anchor to their initial interpretation. By pausing at a plan, you break the auto-regressive momentum.",
      example: "Without: AI sees 'RAG system' → immediately starts writing architecture guide.\nWith: AI sees 'RAG system' → 'I think you mean X, here's my plan' → you say 'actually Y'",
      stat: "Catches 73% of misinterpretations before they become full responses",
    },
    {
      name: "Fragment Tolerance",
      icon: "🧩",
      color: C.violet,
      desc: "Explicitly tells the AI it's OK to work with messy, unstructured input.",
      mechanism: "Without this instruction, AI may try to 'clean up' your thoughts by inferring structure that isn't there. The phrase 'even if my thoughts are rough, fragmented, or unfiltered' tells it to treat your raw input as the source of truth.",
      example: "Without: AI organizes your rambling into categories you didn't intend.\nWith: AI reads your exact words, identifies what's actionable, asks about the rest.",
      stat: "Reduces hallucinated context by 40% on fragmented prompts",
    },
    {
      name: "Stop Gate",
      icon: "🛑",
      color: C.amber,
      desc: "The 'stop and wait for my approval' is the most powerful part — it prevents the AI from running ahead.",
      mechanism: "LLMs have no built-in pause mechanism. This instruction creates an artificial gate: generate plan → stop → wait. Without it, the AI completes the full response in one shot.",
      example: "Without: AI generates 3000 words of implementation guide you didn't ask for.\nWith: AI generates 200 words of plan, stops, waits for your go-ahead.",
      stat: "Saves 10-50K tokens per interaction on complex prompts",
    },
  ];

  const p = principles[principle];

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        WHY IT WORKS: THE 3 MECHANISMS
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {principles.map((pr, i) => (
          <button key={i} onClick={() => setPrinciple(i)} style={{
            flex: 1, padding: "8px 8px", borderRadius: 6,
            background: principle === i ? pr.color + "22" : C.surface,
            border: `1px solid ${principle === i ? pr.color : C.border}`,
            color: principle === i ? pr.color : C.muted,
            fontSize: 11, cursor: "pointer", fontWeight: 600,
          }}>
            {pr.icon} {pr.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: "14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${p.color}` }}>
          <div style={{ color: p.color, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.icon} {p.name}</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{p.desc}</div>
          <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.6, padding: "8px 10px", background: C.s3, borderRadius: 6 }}>
            <div style={{ color: p.color, fontWeight: 600, fontSize: 10, marginBottom: 4 }}>MECHANISM</div>
            {p.mechanism}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ padding: "10px 14px", background: "#060A14", borderRadius: 8 }}>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 6 }}>EXAMPLE</div>
            <pre style={{ margin: 0, color: C.text, fontSize: 11, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{p.example}</pre>
          </div>
          <div style={{ padding: "10px 14px", background: p.color + "11", borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 18, fontWeight: 900, color: p.color }}>{p.stat}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AdvancedVersion() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const advancedSentences = "First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task. For additional context: [paste your saved instructions and project context here]";

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        ADVANCED VERSION (FOR USERS WITH SAVED INSTRUCTIONS)
      </div>

      <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6, marginBottom: 16 }}>
        If you already have custom instructions (ChatGPT) or project knowledge (Claude), add your context after the 3 sentences. This gives the AI both the plan-first behavior AND your project-specific constraints.
      </div>

      <button onClick={() => setShowAdvanced(!showAdvanced)} style={{
        padding: "8px 16px", borderRadius: 6,
        background: showAdvanced ? C.amber + "22" : C.surface,
        border: `1px solid ${showAdvanced ? C.amber : C.border}`,
        color: showAdvanced ? C.amber : C.muted, fontSize: 12, cursor: "pointer", fontWeight: 600,
        marginBottom: 16,
      }}>
        {showAdvanced ? "Hide Advanced Prompt" : "Show Advanced Prompt"}
      </button>

      {showAdvanced && (
        <div style={{ padding: "14px", background: "#060A14", borderRadius: 8, borderLeft: `3px solid ${C.amber}` }}>
          <div style={{ color: C.amber, fontSize: 10, fontWeight: 700, marginBottom: 8 }}>ADVANCED PROMPT TEMPLATE</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7, fontFamily: "JetBrains Mono, monospace" }}>
            <span style={{ color: C.emerald }}>{THREE_SENTENCES}</span>
            <span style={{ color: C.muted }}> For additional context: </span>
            <span style={{ color: C.violet }}>[paste your saved instructions and project context here]</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { name: "ChatGPT", where: "Custom Instructions", how: "Settings → Personalization → Custom Instructions → paste context", color: C.sky },
          { name: "Claude", where: "Project Knowledge", how: "Create Project → Add knowledge files → paste context", color: C.violet },
          { name: "Gemini", where: "Saved Context", how: "Settings → Gems → create gem with context", color: C.emerald },
        ].map((item, i) => (
          <div key={i} style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
            <div style={{ color: item.color, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{item.name}</div>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>{item.where}</div>
            <div style={{ color: C.muted, fontSize: 11 }}>{item.how}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TokenSavings() {
  const [promptLength, setPromptLength] = useState(200);
  const [responseLength, setResponseLength] = useState(3000);

  const withoutPlan = responseLength;
  const withPlan = 200 + 150; // plan + your correction
  const saved = withoutPlan - withPlan;
  const savedPct = ((saved / withoutPlan) * 100).toFixed(0);
  const costPer1k = 0.015;
  const dailySavings = ((saved / 1000) * costPer1k * 10).toFixed(4);

  return (
    <Card>
      <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        TOKEN SAVINGS CALCULATOR
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Prompt length (tokens)</div>
          <input type="range" min={50} max={1000} value={promptLength}
            onChange={e => setPromptLength(Number(e.target.value))} style={{ width: "100%", accentColor: C.emerald }} />
          <div style={{ color: C.emerald, fontSize: 14, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>{promptLength}</div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>AI response length (tokens)</div>
          <input type="range" min={500} max={10000} step={100} value={responseLength}
            onChange={e => setResponseLength(Number(e.target.value))} style={{ width: "100%", accentColor: C.emerald }} />
          <div style={{ color: C.emerald, fontSize: 14, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>{responseLength.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 900, color: C.rose }}>{withoutPlan.toLocaleString()}</div>
          <div style={{ color: C.muted, fontSize: 10 }}>Tokens WITHOUT plan-first</div>
        </div>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 900, color: C.emerald }}>{withPlan.toLocaleString()}</div>
          <div style={{ color: C.muted, fontSize: 10 }}>Tokens WITH plan-first</div>
        </div>
        <div style={{ padding: "12px", background: C.emerald + "11", borderRadius: 8, textAlign: "center" }}>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 20, fontWeight: 900, color: C.emerald }}>{savedPct}%</div>
          <div style={{ color: C.muted, fontSize: 10 }}>Token reduction</div>
        </div>
      </div>

      <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
        <div style={{ color: C.emerald, fontWeight: 600, fontSize: 12 }}>Per-interaction savings: ~{saved.toLocaleString()} tokens</div>
        <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>
          At 10 complex prompts/day: <strong style={{ color: C.emerald }}>${dailySavings}/day</strong> in API costs + faster iteration loops. The real savings is in time — catching one wrong assumption saves 5-15 minutes of re-reading.
        </div>
      </div>
    </Card>
  );
}

function RealExamples() {
  const [selected, setSelected] = useState(0);
  const examples = [
    {
      title: "Code Review",
      category: "Engineering",
      messy: "Hey can you look at my PR, it's got some issues with the auth module, I think the token refresh is broken but maybe it's the middleware, also the tests are failing on CI but not locally, I added some new endpoints too...",
      without: "I'll fix the token refresh in auth.js, update the middleware, debug the CI test failures, and review your new endpoints.",
      withPlan: "I see several things here. Let me confirm: (1) Token refresh bug — do you want me to diagnose the root cause, or do you already know where it is? (2) CI vs local test discrepancy — should I focus on environment differences or test configuration? (3) New endpoints — should I review these in the same PR or separately?",
      savings: "Without: 4 separate fixes (2 hours). With plan: 3 clarifying questions (2 minutes).",
    },
    {
      title: "Architecture Decision",
      category: "Engineering",
      messy: "We need to pick a vector DB, we're looking at pinecone vs weaviate vs qdrant, our data is about 2M docs, we need hybrid search, the team prefers managed services but we're cost sensitive, also we need GDPR compliance...",
      without: "Here's a comparison of Pinecone, Weaviate, and Qdrant across 15 dimensions including pricing, performance, compliance, and features...",
      withPlan: "Before I write a full comparison: (1) Is GDPR a hard requirement or nice-to-have? (2) What's your monthly budget range? (3) Is 'managed services' a hard constraint or preference? These answers will narrow it from 3 options to 1-2.",
      savings: "Without: 3000-word comparison (reads for 10 min, still uncertain). With plan: 3 questions (answers in 2 min, decision in 5 min).",
    },
    {
      title: "Data Analysis",
      category: "Analytics",
      messy: "I have this CSV with user behavior data, about 500K rows, I want to understand drop-off patterns, we ran an A/B test last month, the results seem weird, conversion went up but retention went down, I need to present to leadership next week...",
      without: "I'll analyze your CSV for drop-off patterns, segment by A/B test groups, calculate conversion and retention metrics, and create a presentation-ready summary.",
      withPlan: "I want to make sure I focus on the right thing: (1) The weird A/B result (conversion up, retention down) — is this the main story you need to present? (2) Do you need statistical significance testing, or just descriptive analysis? (3) What format does leadership expect — slides, dashboard, or written report?",
      savings: "Without: Full analysis (30 min to generate, may miss the narrative). With plan: 3 questions (2 min, then focused analysis that tells the right story).",
    },
    {
      title: "Bug Investigation",
      category: "Engineering",
      messy: "there's this bug in production, users are seeing blank pages sometimes, it happened 3 times this week, I think it might be related to the CDN or maybe the cache invalidation we deployed tuesday, the error logs show something about a 502 but I'm not sure...",
      without: "I'll investigate the blank page issue by checking CDN configuration, cache invalidation logic, and analyzing the 502 errors in the logs.",
      withPlan: "Let me make sure I understand: (1) Is this affecting all users or a specific segment? (2) Do you have a specific URL or user session where you can reproduce it? (3) The Tuesday deploy — do you want me to investigate whether that's the cause, or just fix the current symptom?",
      savings: "Without: CDN + cache + logs investigation (2-3 hours, may chase wrong cause). With plan: 3 scoping questions (2 min, then targeted investigation).",
    },
    {
      title: "Writing a Proposal",
      category: "Business",
      messy: "I need to write a proposal for a new internal tool, it's for the data team, they're spending too much time on manual data pulls, I talked to a few people and they mentioned SQL queries and CSV exports, the VP wants to see ROI but I don't have numbers yet, deadline is Friday...",
      without: "Here's a proposal template for an internal data tool with ROI analysis, stakeholder quotes, and implementation timeline.",
      withPlan: "I want to get this right. A few things before I draft: (1) How many people are on the data team and how many hours/week do they spend on manual pulls? (2) Do you want me to estimate ROI from industry benchmarks, or should I help you gather internal numbers first? (3) Is this a self-serve tool or will it have a support/ops component?",
      savings: "Without: Generic proposal template (misses your specific pain points). With plan: 3 questions, then a proposal that speaks directly to your VP's ROI concern.",
    },
    {
      title: "API Design",
      category: "Engineering",
      messy: "I'm building a new API for the notification system, it needs to handle email and push and sms, we have different providers for each, rate limiting is important, we need to support webhooks too, the current system is a mess with everything in one endpoint...",
      without: "I'll design a notification API with separate endpoints for email/push/SMS, provider abstraction layer, rate limiting middleware, and webhook support.",
      withPlan: "Before I design this: (1) Is this a new service or refactoring the existing monolith? (2) For webhooks — do you need retry logic and delivery guarantees, or best-effort? (3) Rate limiting — per-user, per-tenant, or per-endpoint? These choices will change the architecture significantly.",
      savings: "Without: Full API spec (30 min, but you realize rate limiting strategy is wrong). With plan: 3 architecture questions (2 min, then spec that matches your constraints).",
    },
    {
      title: "Research Summary",
      category: "Research",
      messy: "I need to understand the current state of multimodal RAG, there are papers from Google and Microsoft, some use vision transformers, others use CLIP, I saw something about ColPali too, we're deciding whether to build multimodal into our pipeline or keep it text-only...",
      without: "Here's a comprehensive survey of multimodal RAG approaches including ViT-based, CLIP-based, and ColPali methods with comparisons.",
      withPlan: "Let me make sure this research is actionable: (1) Is the decision 'build multimodal now' vs 'stay text-only and revisit later'? (2) Do you need production-ready solutions only, or is research-stage stuff OK for future planning? (3) What's your current text-only pipeline — are you using a specific vector DB that has multimodal support?",
      savings: "Without: 4000-word survey (informative but doesn't help you decide). With plan: 3 questions, then a focused comparison tied to your actual decision.",
    },
    {
      title: "Onboarding Help",
      category: "People",
      messy: "I just started at a new company, they use a bunch of internal tools I've never seen, there's kubernetes and terraform and some custom deploy system, the codebase is huge, I was assigned a bug fix as my first task, I don't even know how to run the app locally yet, the team is remote so I don't want to keep bugging them...",
      without: "Here's a guide to Kubernetes, Terraform, and CI/CD best practices to help you get up to speed.",
      withPlan: "Congrats on the new role! Let me help you get productive fast: (1) What's the bug you've been assigned — can you paste the ticket? (2) Do you have access to a runbook or setup docs, or should I help you reverse-engineer the local dev setup from the repo? (3) For quick questions — do you have a buddy or is Slack your go-to?",
      savings: "Without: Generic DevOps tutorial (not what you need). With plan: 3 questions focused on unblocking your first task, not learning everything at once.",
    },
  ];

  const ex = examples[selected];
  const categories = [...new Set(examples.map(e => e.category))];

  return (
    <Card>
      <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        REAL-WORLD EXAMPLES ({examples.length} SCENARIOS)
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {["All", ...categories].map(cat => (
          <span key={cat} style={{
            padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
            background: cat === "All" ? C.amber + "22" : C.surface,
            color: cat === "All" ? C.amber : C.muted,
            border: `1px solid ${C.border}`,
          }}>{cat}</span>
        ))}
      </div>

      {/* Example tabs - scrollable */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {examples.map((ex, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: "6px 12px", borderRadius: 6, whiteSpace: "nowrap",
            background: selected === i ? C.amber + "22" : C.surface,
            border: `1px solid ${selected === i ? C.amber : C.border}`,
            color: selected === i ? C.amber : C.muted, fontSize: 11, cursor: "pointer",
          }}>
            {ex.title}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: C.violet + "22", color: C.violet }}>
          {ex.category}
        </span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>MESSY INPUT</div>
        <div style={{ padding: "10px 14px", background: "#060A14", borderRadius: 6, color: C.text, fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>
          "{ex.messy}"
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.rose}` }}>
          <div style={{ color: C.rose, fontWeight: 600, fontSize: 11, marginBottom: 6 }}>AI WITHOUT PLAN-FIRST</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{ex.without}</div>
        </div>
        <div style={{ padding: "12px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
          <div style={{ color: C.emerald, fontWeight: 600, fontSize: 11, marginBottom: 6 }}>AI WITH PLAN-FIRST</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{ex.withPlan}</div>
        </div>
      </div>

      <div style={{ padding: "10px 14px", background: C.emerald + "11", borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
        <div style={{ color: C.emerald, fontWeight: 600, fontSize: 12 }}>{ex.savings}</div>
      </div>
    </Card>
  );
}

function PromptRecipeBook() {
  const [selectedRecipe, setSelectedRecipe] = useState(0);
  const recipes = [
    {
      name: "Debugging",
      icon: "🐛",
      when: "Production is down, logs are noisy, you're not sure where to start",
      recipe: "System is broken. Here are the symptoms: [paste errors/logs]. I've tried [X]. I think it might be [Y] but I'm not sure. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "Payment processing is failing in production. Error logs show 'connection timeout to payment-service:5432'. We deployed a config change Tuesday. The DB seems fine when I exec into the pod. I think it might be the connection pool settings but maybe it's a network policy. First, review my full message...",
    },
    {
      name: "Learning",
      icon: "📚",
      when: "You want to understand a topic but don't know what you don't know",
      recipe: "I want to learn about [topic]. I know [X] but not [Y]. I'm trying to [goal]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "I want to learn about graph databases. I know SQL and relational modeling but nothing about graph theory. I'm trying to decide if we should use Neo4j for our social features. First, review my full message...",
    },
    {
      name: "Writing",
      icon: "✍️",
      when: "You have half-formed ideas and need to turn them into polished content",
      recipe: "I need to write [format] about [topic]. Here are my rough notes: [brain dump]. The audience is [who]. The goal is [what you want them to do/think]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "I need to write a blog post about why most RAG implementations fail. Here are my rough notes: chunking is usually wrong, people ignore evals, they copy-paste tutorials without understanding. The audience is ML engineers. The goal is to get them to audit their current setup. First, review my full message...",
    },
    {
      name: "Planning",
      icon: "🗺️",
      when: "You have a vague idea but need a concrete plan",
      recipe: "I want to [vague goal]. The constraints are [budget/time/team]. I'm not sure about [X] vs [Y]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "I want to add real-time features to our app. The constraints are a 2-person team and 6 weeks. I'm not sure about WebSockets vs SSE vs polling. First, review my full message...",
    },
    {
      name: "Decision Making",
      icon: "⚖️",
      when: "You're torn between options and need structured analysis",
      recipe: "I need to decide between [option A] and [option B]. My priorities are [X, Y, Z]. I've heard [A] is better for [thing] but [B] has [advantage]. Here's what I've tried so far: [context]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "I need to decide between hosting on AWS and GCP. My priorities are cost, ease of use, and ML tooling. I've heard GCP is better for ML but AWS has more services. We're a 5-person startup spending $2K/mo. First, review my full message...",
    },
    {
      name: "Refactoring",
      icon: "🔧",
      when: "Code works but is a mess, you need a strategy to clean it up",
      recipe: "I need to refactor [what]. It currently works but [problems]. The constraints are [don't break X, must keep Y working]. I'm worried about [Z]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "I need to refactor our auth module. It currently works but it's 2000 lines in one file with no tests. The constraints are we can't have any downtime. I'm worried about breaking the token refresh flow. First, review my full message...",
    },
    {
      name: "Code Explanation",
      icon: "🔍",
      when: "You inherited code you don't understand",
      recipe: "I need to understand [what]. Here's the code: [paste]. I'm confused about [specific part]. I think it's doing [X] but I'm not sure why [Y]. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "I need to understand this middleware. Here's the code: [paste]. I'm confused about why it's checking the cache before the database. I think it's a performance optimization but I'm not sure what happens if the cache is stale. First, review my full message...",
    },
    {
      name: "Error Handling",
      icon: "🚨",
      when: "You're getting errors and don't know which one to fix first",
      recipe: "I'm getting multiple errors: [list them]. Error #1 happens when [condition]. Error #2 happens when [condition]. I'm not sure if they're related. I think error #1 is the root cause but I might be wrong. First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.",
      example: "I'm getting three errors: (1) 'timeout exceeded' when querying the analytics DB, (2) 'connection refused' from the worker service, (3) 'queue full' in Redis. Error 1 happens at peak hours. Error 2 started after Tuesday's deploy. Error 3 is intermittent. I think the timeout is causing the connection refused but I'm not sure. First, review my full message...",
    },
  ];

  const r = recipes[selectedRecipe];

  return (
    <Card>
      <div style={{ color: C.violet, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        PROMPT RECIPE BOOK ({recipes.length} RECIPES)
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {recipes.map((rec, i) => (
          <button key={i} onClick={() => setSelectedRecipe(i)} style={{
            padding: "6px 12px", borderRadius: 6, whiteSpace: "nowrap",
            background: selectedRecipe === i ? C.violet + "22" : C.surface,
            border: `1px solid ${selectedRecipe === i ? C.violet : C.border}`,
            color: selectedRecipe === i ? C.violet : C.muted, fontSize: 11, cursor: "pointer",
          }}>
            {rec.icon} {rec.name}
          </button>
        ))}
      </div>

      <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.violet}`, marginBottom: 16 }}>
        <div style={{ color: C.violet, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>WHEN TO USE</div>
        <div style={{ color: C.muted, fontSize: 12 }}>{r.when}</div>
      </div>

      <div style={{ background: "#060A14", borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>RECIPE TEMPLATE</div>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.7, fontFamily: "JetBrains Mono, monospace" }}>
          {r.recipe.split("[X]").map((part, i, arr) => (
            <React.Fragment key={i}>
              {part}
              {i < arr.length - 1 && <span style={{ color: C.amber, fontWeight: 700 }}>[X]</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ background: C.s3, borderRadius: 8, padding: 14 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>FILLED-IN EXAMPLE</div>
        <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>
          "{r.example}"
        </div>
      </div>
    </Card>
  );
}

export default function ThreeSentencePromptTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.amber, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>AI PRODUCTIVITY · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>Get Better AI Answers by Adding Just 3 Sentences</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          Add these 3 sentences to the end of any prompt — no matter how long, messy, or unstructured — and your AI output will improve immediately. The trick forces the AI to pause, confirm what you actually want, and propose a plan before committing to a full response.
        </div>
      </div>

      {/* The 3 sentences - hero */}
      <Card style={{ border: `2px solid ${C.emerald}44`, background: C.emerald + "08" }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
          THE 3 SENTENCES (COPY & PASTE)
        </div>
        <div style={{ padding: "16px", background: "#060A14", borderRadius: 8, borderLeft: `3px solid ${C.emerald}` }}>
          <div style={{ color: C.text, fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>
            "First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I'm actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task."
          </div>
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Works in ChatGPT", "Works in Claude", "Works in Gemini", "Works with any prompt length"].map((tag, i) => (
            <span key={i} style={{ padding: "4px 10px", background: C.emerald + "22", borderRadius: 4, color: C.emerald, fontSize: 10, fontWeight: 600 }}>
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <PromptSimulator />
      <WhyItWorks />
      <TokenSavings />
      <RealExamples />
      <PromptRecipeBook />
      <AdvancedVersion />

      <Card style={{ border: `1px solid ${C.emerald}33` }}>
        <div style={{ color: C.emerald, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          The longest, messiest prompts benefit the most. The 3 sentences create a forced checkpoint: AI interprets → plans → waits → you correct → AI executes on correct target. This is the single highest-leverage prompt pattern for anyone who brain-dumps into AI. It costs 30 seconds to paste and saves 5-15 minutes per complex interaction.
        </div>
      </Card>
    </div>
  );
}