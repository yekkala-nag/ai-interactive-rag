import React, { useState } from "react";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#E8837A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

const EMBED_ICONS = {
  "prompt-playground": "🧪",
  "contract-validator": "📜",
  "regression-simulator": "📊",
  "structured-output-builder": "🏗️"
};

function PromptPlaygroundDemo() {
  const [prompt, setPrompt] = useState("Summarize the key findings from this report in 3 bullet points.");
  const [output, setOutput] = useState(null);

  const runDemo = () => {
    setOutput({
      tokens: prompt.split(" ").length * 2,
      cost: ((prompt.split(" ").length * 2 * 0.00003).toFixed(6)),
      quality: Math.floor(Math.random() * 20) + 80,
    });
  };

  return (
    <div style={{ padding: 16, background: C.s2, borderRadius: 8, marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginBottom: 8 }}>Prompt Playground</div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          width: "100%", minHeight: 60, padding: 10, borderRadius: 6,
          background: C.bg, color: C.text, border: `1px solid ${C.border}`,
          fontSize: 12, fontFamily: "JetBrains Mono, monospace", resize: "vertical", marginBottom: 8
        }}
      />
      <button onClick={runDemo} style={{
        padding: "6px 14px", background: C.teal, color: C.bg, border: "none",
        borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 8
      }}>Run Prompt</button>
      {output && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { label: "Tokens", value: output.tokens, color: C.teal },
            { label: "Cost", value: `$${output.cost}`, color: C.coral },
            { label: "Quality", value: `${output.quality}%`, color: C.lav },
          ].map(m => (
            <div key={m.label} style={{ background: C.bg, borderRadius: 6, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: m.color, fontFamily: "JetBrains Mono, monospace" }}>{m.value}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContractValidatorDemo() {
  const [contract, setContract] = useState("Output must be valid JSON. No PII allowed. Max 500 tokens.");
  const [results, setResults] = useState(null);

  const validate = () => {
    const rules = contract.split(".").filter(r => r.trim());
    setResults(rules.map(r => ({
      rule: r.trim(),
      status: Math.random() > 0.3 ? "pass" : "warn",
    })));
  };

  return (
    <div style={{ padding: 16, background: C.s2, borderRadius: 8, marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginBottom: 8 }}>Contract Validator</div>
      <textarea
        value={contract}
        onChange={(e) => setContract(e.target.value)}
        style={{
          width: "100%", minHeight: 50, padding: 10, borderRadius: 6,
          background: C.bg, color: C.text, border: `1px solid ${C.border}`,
          fontSize: 12, fontFamily: "JetBrains Mono, monospace", resize: "vertical", marginBottom: 8
        }}
      />
      <button onClick={validate} style={{
        padding: "6px 14px", background: C.teal, color: C.bg, border: "none",
        borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 8
      }}>Validate Contract</button>
      {results && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {results.map((r, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "6px 10px",
              background: C.bg, borderRadius: 6, borderLeft: `3px solid ${r.status === "pass" ? C.teal : C.coral}`
            }}>
              <span style={{ color: r.status === "pass" ? C.teal : C.coral, fontSize: 12 }}>{r.status === "pass" ? "✓" : "⚠"}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{r.rule}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RegressionSimulatorDemo() {
  const [deps] = useState([
    { name: "promptfundamentals", risk: "low" },
    { name: "promptcontracts", risk: "high" },
    { name: "structuredoutputs", risk: "medium" },
    { name: "workflows", risk: "high" },
  ]);
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: 16, background: C.s2, borderRadius: 8, marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginBottom: 8 }}>Regression Simulator</div>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Click a node to see blast radius:</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {deps.map(d => (
          <button key={d.name} onClick={() => setSelected(d.name === selected ? null : d.name)} style={{
            padding: "6px 12px", borderRadius: 6, fontSize: 10, fontWeight: 600,
            background: selected === d.name ? (d.risk === "high" ? C.coral : d.risk === "medium" ? C.lav : C.teal) + "22" : C.bg,
            color: selected === d.name ? (d.risk === "high" ? C.coral : d.risk === "medium" ? C.lav : C.teal) : C.muted,
            border: `1px solid ${selected === d.name ? (d.risk === "high" ? C.coral : d.risk === "medium" ? C.lav : C.teal) : C.border}`,
            cursor: "pointer"
          }}>{d.name}</button>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: 10, padding: 10, background: C.bg, borderRadius: 6, fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
          Changing <strong style={{ color: C.text }}>{selected}</strong> would affect{" "}
          <span style={{ color: deps.find(d => d.name === selected)?.risk === "high" ? C.coral : C.teal }}>
            {Math.floor(Math.random() * 5) + 2} downstream agents
          </span>. Risk: <span style={{ fontWeight: 700, color: deps.find(d => d.name === selected)?.risk === "high" ? C.coral : C.teal }}>{deps.find(d => d.name === selected)?.risk}</span>
        </div>
      )}
    </div>
  );
}

function SchemaPromptDemo() {
  const [schema, setSchema] = useState('{ "name": "string", "amount": "number", "date": "string" }');
  const [generated, setGenerated] = useState(null);

  const generate = () => {
    try {
      const parsed = JSON.parse(schema);
      const fields = Object.keys(parsed);
      setGenerated({
        prompt: `Extract the following fields from the document: ${fields.join(", ")}. Return as valid JSON.`,
        fields: fields.length,
        validation: "Pass"
      });
    } catch {
      setGenerated({ prompt: "Invalid JSON schema", fields: 0, validation: "Fail" });
    }
  };

  return (
    <div style={{ padding: 16, background: C.s2, borderRadius: 8, marginTop: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, marginBottom: 8 }}>Schema → Prompt Generator</div>
      <textarea
        value={schema}
        onChange={(e) => setSchema(e.target.value)}
        style={{
          width: "100%", minHeight: 50, padding: 10, borderRadius: 6,
          background: C.bg, color: C.text, border: `1px solid ${C.border}`,
          fontSize: 12, fontFamily: "JetBrains Mono, monospace", resize: "vertical", marginBottom: 8
        }}
      />
      <button onClick={generate} style={{
        padding: "6px 14px", background: C.teal, color: C.bg, border: "none",
        borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 8
      }}>Generate Prompt</button>
      {generated && (
        <div style={{ background: C.bg, borderRadius: 6, padding: 12, borderLeft: `3px solid ${generated.validation === "Pass" ? C.teal : C.coral}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: generated.validation === "Pass" ? C.teal : C.coral, marginBottom: 6 }}>
            {generated.validation} · {generated.fields} fields detected
          </div>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5 }}>
            {generated.prompt}
          </div>
        </div>
      )}
    </div>
  );
}

const DEMO_COMPONENTS = {
  "prompt-playground": PromptPlaygroundDemo,
  "contract-validator": ContractValidatorDemo,
  "regression-simulator": RegressionSimulatorDemo,
  "structured-output-builder": SchemaPromptDemo,
};

export function InteractiveEmbed({ embed, onLaunch, launchedEmbeds = [] }) {
  const isAlreadyLaunched = launchedEmbeds.includes(embed.id);
  const DemoComponent = DEMO_COMPONENTS[embed.id];

  const handleClick = () => {
    if (!isAlreadyLaunched) {
      onLaunch?.(embed);
    }
  };

  return (
    <div style={{
      background: C.surface,
      border: `1px solid ${isAlreadyLaunched ? C.teal + "60" : C.border}`,
      borderRadius: 12,
      padding: 20,
      transition: "all 0.2s"
    }}>
      {isAlreadyLaunched && (
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, ${C.teal}, ${C.lav}, ${C.coral})`,
          borderRadius: "12px 12px 0 0",
          marginBottom: 16
        }} />
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${C.teal}20, ${C.teal}08)`,
          border: `1px solid ${C.teal}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          flexShrink: 0
        }}>
          {EMBED_ICONS[embed.id] || "🔧"}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>
              {embed.title}
            </h4>
            {isAlreadyLaunched && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 4,
                background: `${C.teal}20`,
                color: C.teal,
                border: `1px solid ${C.teal}40`
              }}>
                Active
              </span>
            )}
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: C.muted, lineHeight: 1.5 }}>
            {embed.description}
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {embed.props && Object.entries(embed.props).map(([key, value]) => (
              <span key={key} style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 4,
                background: `${C.lav}15`,
                color: C.lav,
                border: `1px solid ${C.lav}30`
              }}>
                {key}: {String(value)}
              </span>
            ))}
          </div>
          
          {!isAlreadyLaunched ? (
            <button
              onClick={handleClick}
              style={{
                padding: "10px 18px",
                background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`,
                color: C.bg,
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              Launch Interactive Demo →
            </button>
          ) : DemoComponent ? (
            <DemoComponent />
          ) : (
            <div style={{
              padding: 16, background: C.s2, borderRadius: 8, marginTop: 8,
              textAlign: "center", color: C.muted, fontSize: 12
            }}>
              Demo launched — navigate to the topic tab for the full experience
            </div>
          )}
          
          {embed.engine && (
            <div style={{ 
              marginTop: 10,
              padding: "6px 10px", 
              background: C.s2, 
              border: `1px solid ${C.border}`, 
              borderRadius: 6,
              fontSize: 10,
              color: C.muted,
              fontFamily: "JetBrains Mono, monospace",
              display: "inline-block"
            }}>
              Engine: {embed.engine}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InteractiveEmbed;
