import React, { useState, useEffect } from "react";

const C = {
  bg: "#0F1219", surface: "#161B26", s2: "#1C2433", s3: "#243044",
  border: "#2A3548", text: "#E2E8F0", muted: "#B8B8C4",
  teal: "#5EC4C8", tealDark: "#3A9B9F", tealInk: "#1F6B6E",
  coral: "#F0A89A", coralDeep: "#C47A6A",
  lav: "#C9B8E8", lavDeep: "#9B89C4",
};

function Card({ children, style = {} }) {
  return <div style={{ background: C.s2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, ...style }}>{children}</div>;
}

function HardwareSimulator() {
  const [ram, setRam] = useState(16);
  const [vram, setVram] = useState(2);
  const [quant, setQuant] = useState("Q4");

  const models = [
    { name: "Phi-3 Mini (3.8B)", q4: 2.4, q3: 1.8, q8: 5.1, fits_q4: true, fits_q3: true },
    { name: "Llama 3.1 8B", q4: 4.7, q3: 3.5, q8: 8.5, fits_q4: true, fits_q3: true },
    { name: "Mistral 7B", q4: 4.1, q3: 3.1, q8: 7.5, fits_q4: true, fits_q3: true },
    { name: "Qwen2 7B", q4: 4.5, q3: 3.4, q8: 8.2, fits_q4: true, fits_q3: true },
    { name: "CodeLlama 13B", q4: 7.4, q3: 5.6, q8: 14.2, fits_q4: true, fits_q3: true },
    { name: "Llama 3.1 70B", q4: 38.0, q3: 28.5, q8: 72.0, fits_q4: false, fits_q3: false },
  ];

  const quantKey = quant.toLowerCase();
  const availableRam = ram - 4; // OS overhead

  return (
    <Card>
      <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        INTERACTIVE: HARDWARE CONSTRAINT SIMULATOR
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>System RAM (GB)</div>
          <input type="range" min={8} max={64} value={ram} onChange={e => setRam(Number(e.target.value))} style={{ width: "100%", accentColor: C.teal }} />
          <div style={{ color: C.teal, fontSize: 16, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>{ram} GB</div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>GPU VRAM (GB)</div>
          <input type="range" min={0} max={24} value={vram} onChange={e => setVram(Number(e.target.value))} style={{ width: "100%", accentColor: C.coral }} />
          <div style={{ color: C.coral, fontSize: 16, fontWeight: 900, fontFamily: "JetBrains Mono, monospace", textAlign: "center" }}>{vram} GB</div>
        </div>
        <div>
          <div style={{ color: C.muted, fontSize: 11, marginBottom: 4 }}>Quantization Level</div>
          <div style={{ display: "flex", gap: 4 }}>
            {["Q3", "Q4", "Q8"].map(q => (
              <button key={q} onClick={() => setQuant(q)} style={{
                flex: 1, padding: "6px", borderRadius: 4,
                background: quant === q ? C.teal + "22" : C.s3,
                border: `1px solid ${quant === q ? C.teal : C.border}`,
                color: quant === q ? C.teal : C.muted, fontSize: 11, cursor: "pointer", fontWeight: 600,
              }}>{q}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: "#0A0E14", borderRadius: 8, padding: 14, marginBottom: 12 }}>
        <div style={{ color: C.muted, fontSize: 10, marginBottom: 8 }}>MODEL VRAM REQUIREMENTS ({quant})</div>
        {models.map((m, i) => {
          const needed = m[quantKey];
          const fits = needed <= vram;
          const ramFits = needed <= availableRam;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <div style={{ width: 120, color: C.muted, fontSize: 10, fontFamily: "JetBrains Mono, monospace" }}>{m.name}</div>
              <div style={{ flex: 1, height: 14, background: C.s3, borderRadius: 3, overflow: "hidden", position: "relative" }}>
                <div style={{ width: `${(needed / 72) * 100}%`, height: "100%", borderRadius: 3, background: fits ? C.teal : C.coral, transition: "width 0.3s" }} />
                <div style={{ position: "absolute", right: 4, top: 1, fontSize: 9, color: fits ? C.teal : C.coral, fontFamily: "JetBrains Mono, monospace" }}>
                  {needed} GB
                </div>
              </div>
              <div style={{ width: 60, textAlign: "right" }}>
                <span style={{ padding: "2px 6px", borderRadius: 3, fontSize: 9, fontWeight: 600, background: fits ? C.teal + "22" : C.coral + "22", color: fits ? C.teal : C.coral }}>
                  {fits ? "GPU ✓" : ramFits ? "CPU ✓" : "✗"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "10px 14px", background: C.s3, borderRadius: 8, borderLeft: `3px solid ${C.teal}` }}>
        <div style={{ color: C.teal, fontWeight: 600, fontSize: 12, marginBottom: 4 }}>SwarmForge Strategy</div>
        <div style={{ color: C.muted, fontSize: 11 }}>
          With {ram}GB RAM and {vram}GB VRAM: Use GGUF {quant} models loaded into system RAM. GPU accelerates only a few layers. Lazy-load agents — instantiate only when needed, destroy after task completes. C++ daemons handle system monitoring with zero CPU overhead.
        </div>
      </div>
    </Card>
  );
}

function ArchitectureDiagram() {
  const [activeLayer, setActiveLayer] = useState(0);
  const layers = [
    { name: "User Prompt", desc: "Natural language task request", color: C.teal, icon: "💬" },
    { name: "Orchestrator", desc: "Breaks down into sub-tasks, assigns roles", color: C.coral, icon: "🎯" },
    { name: "Agent Pool", desc: "Manager → Researcher → Coder → Reviewer", color: C.lav, icon: "🤖" },
    { name: "Shared Memory", desc: "Markdown-based context pool + virtual FS", color: C.teal, icon: "🧠" },
    { name: "C++ Daemons", desc: "Win32 API hooks, process control, audio routing", color: C.coralDeep, icon: "⚙️" },
  ];

  return (
    <Card>
      <div style={{ color: C.coral, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        SWARMFORGE ARCHITECTURE
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {layers.map((l, i) => (
          <div key={i} onClick={() => setActiveLayer(i)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 8,
            background: activeLayer === i ? l.color + "15" : C.surface,
            border: `1px solid ${activeLayer === i ? l.color : C.border}`,
            cursor: "pointer", transition: "all 0.2s",
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: l.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{l.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: activeLayer === i ? l.color : C.text, fontSize: 12, fontWeight: 600 }}>{l.name}</div>
              {activeLayer === i && <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{l.desc}</div>}
            </div>
            {i < layers.length - 1 && (
              <div style={{ position: "absolute", marginLeft: 28, marginTop: 40, color: C.muted, fontSize: 14 }}>↓</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.teal}` }}>
          <div style={{ color: C.teal, fontWeight: 600, fontSize: 11 }}>Python (Brains)</div>
          <div style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>AI logic, NLP, API integrations, agent orchestration</div>
        </div>
        <div style={{ padding: "10px 14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${C.coral}` }}>
          <div style={{ color: C.coral, fontWeight: 600, fontSize: 11 }}>C++ (Muscle)</div>
          <div style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>Win32 hooks, process control, audio routing, zero-overhead monitoring</div>
        </div>
      </div>
    </Card>
  );
}

function MemoryStrategy() {
  const [strategy, setStrategy] = useState(0);
  const strategies = [
    { name: "Lazy Loading", icon: "⏳", color: C.teal, desc: "Agents instantiated only when needed, destroyed after task completes.", detail: "With 16GB RAM, swapping to disk is a death sentence. SwarmForge spins up agents on-demand and immediately destroys them after their task is logged to the Shared Context Pool.", savings: "Peak RAM: 3.2GB → 1.1GB" },
    { name: "GGUF Quantization", icon: "📦", color: C.coral, desc: "Q3/Q4 models loaded into system RAM, GPU accelerates a few layers.", detail: "GTX 1050 OC has only 2GB VRAM — standard models are out. Quantized GGUF models (Q3/Q4) run primarily in system RAM with GPU offloading for a few transformer layers.", savings: "8B model: 16GB → 4.7GB (Q4)" },
    { name: "C++ Event Hooks", icon: "⚡", color: C.lav, desc: "Win32 SetWindowsHookEx consumes zero CPU until event triggers.", detail: "A Python script polling every second consumes noticeable CPU. A C++ daemon using Win32 event hooks consumes effectively zero overhead until an event fires, saving compute for AI models.", savings: "CPU usage: 15% → 0.3%" },
    { name: "Shared Memory Pool", icon: "🧠", color: C.tealDark, desc: "Markdown-based workspace — no context window bouncing between agents.", detail: "Instead of passing massive context windows back and forth (expensive and slow), agents read/write to a centralized markdown memory pool and virtual file system.", savings: "Token usage: 80K → 12K per task" },
  ];

  const s = strategies[strategy];

  return (
    <Card>
      <div style={{ color: C.lav, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>
        RESOURCE OPTIMIZATION STRATEGIES
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {strategies.map((st, i) => (
          <button key={i} onClick={() => setStrategy(i)} style={{
            padding: "6px 12px", borderRadius: 6,
            background: strategy === i ? st.color + "22" : C.surface,
            border: `1px solid ${strategy === i ? st.color : C.border}`,
            color: strategy === i ? st.color : C.muted, fontSize: 11, cursor: "pointer",
          }}>
            {st.icon} {st.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ padding: "14px", background: C.surface, borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
          <div style={{ color: s.color, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{s.icon} {s.name}</div>
          <div style={{ color: C.text, fontSize: 12, lineHeight: 1.6, marginBottom: 8 }}>{s.desc}</div>
          <div style={{ color: C.muted, fontSize: 11, lineHeight: 1.5 }}>{s.detail}</div>
        </div>
        <div style={{ padding: "14px", background: "#0A0E14", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.muted, fontSize: 10, marginBottom: 4 }}>RESOURCE IMPACT</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 18, fontWeight: 900, color: s.color }}>{s.savings}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function ZeroCostMultiAgentTab() {
  return (
    <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 28, maxWidth: 880, margin: "0 auto" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>📰</span>
          <div>
            <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>HACKERNOON · SEPTEMBER 2026</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: C.text }}>How I Built a Zero-Cost Multi-Agent AI System on Aging Hardware</h2>
          </div>
        </div>
        <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>
          Building SwarmForge (multi-agent orchestrator) and O.D.I.N. (local assistant) using Python + C++ Win32 daemons on an i7-4790 with 16GB RAM and a GTX 1050.
        </div>
      </div>

      <HardwareSimulator />
      <ArchitectureDiagram />
      <MemoryStrategy />

      <Card>
        <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>IPC: PYTHON ↔ C++ DAEMON</div>
        <div style={{ background: "#0A0E14", borderRadius: 8, padding: 14 }}>
          <pre style={{ margin: 0, color: C.teal, fontSize: 11, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{`import win32file, win32pipe

def send_command_to_daemon(command: str):
    pipe_name = r'\\\\.\\pipe\\ODIN_Daemon_Pipe'
    handle = win32file.CreateFile(
        pipe_name,
        win32file.GENERIC_READ | win32file.GENERIC_WRITE,
        0, None, win32file.OPEN_EXISTING, 0, None
    )
    win32file.WriteFile(handle, command.encode('utf-8'))`}</pre>
        </div>
      </Card>

      <Card style={{ border: `1px solid ${C.teal}33` }}>
        <div style={{ color: C.teal, fontFamily: "JetBrains Mono, monospace", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 12 }}>THE TAKEAWAY</div>
        <div style={{ color: C.text, fontSize: 13, lineHeight: 1.7 }}>
          Zero-cost multi-agent systems are possible on aging hardware through four strategies: lazy agent loading, GGUF quantization, C++ event-driven daemons (zero CPU overhead), and shared memory pools (no context window bouncing). The hybrid Python+C++ architecture is the key — Python handles AI logic, C++ handles system-level efficiency.
        </div>
      </Card>
    </div>
  );
}