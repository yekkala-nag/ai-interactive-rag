import { useState, useRef, useCallback, useEffect } from 'react';
import {
  parsePdf,
  enrichLineDfWithStyle,
  detectBodyHeadings,
  reconstructTocFromBody,
  generateWorkflowFromToc,
  workflowToMermaid,
  generateTableFromToc,
  generateFlashcardsFromToc,
  generateImagePromptsFromToc,
  detectDocumentBoundaries,
} from '../documentStructure/index.js';

const DEFAULT_AI_CONFIG = {
  apiKey: '',
  endpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o',
};

export default function DocumentStructureTab() {
  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [progress, setProgress] = useState('');
  const [lineDf, setLineDf] = useState([]);
  const [spanDf, setSpanDf] = useState([]);
  const [tocDf, setTocDf] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [boundaries, setBoundaries] = useState([]);
  const [activeView, setActiveView] = useState('toc');
  const [aiConfig, setAiConfig] = useState(DEFAULT_AI_CONFIG);
  const [generating, setGenerating] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const [table, setTable] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [imagePrompts, setImagePrompts] = useState([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (flashcards.length > 0) {
      setCurrentFlashcard(0);
      setFlashcardFlipped(false);
    }
  }, [flashcards.length]);

  const handleFileChange = useCallback(async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }

    setFile(selected);
    setError('');
    setParsing(true);
    setProgress('Reading PDF...');

    try {
      const arrayBuffer = await selected.arrayBuffer();
      setProgress('Extracting text and typography...');
      const { line_df, span_df } = await parsePdf(arrayBuffer);
      setLineDf(line_df);
      setSpanDf(span_df);

      setProgress('Analyzing typography and detecting headings...');
      const enriched = enrichLineDfWithStyle(line_df, span_df);
      const detected = detectBodyHeadings(enriched, 3.0);
      setCandidates(detected);

      setProgress('Detecting document boundaries...');
      const docBoundaries = detectDocumentBoundaries(line_df);
      setBoundaries(docBoundaries);

      setProgress('Running loop engineering TOC reconstruction...');
      const toc = await reconstructTocFromBody(line_df, span_df, {
        mode: 'no_toc',
        threshold: 3.0,
        llmParse: aiConfig.apiKey
          ? async (system, user, schema) => callLLM(aiConfig, system, user, schema)
          : null,
      });
      setTocDf(toc);

      setProgress('Complete.');
    } catch (err) {
      console.error(err);
      setError(`Parsing failed: ${err.message}`);
    } finally {
      setParsing(false);
    }
  }, [aiConfig]);

  const callLLM = async (config, system, user, schema) => {
    const body = {
      model: config.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_schema', json_schema: { name: 'response', schema } },
    };

    const res = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`LLM API error: ${res.status}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty LLM response');
    return JSON.parse(content);
  };

  const handleGenerateAll = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const [wf, tbl, fcs, imgs] = await Promise.all([
        generateWorkflowFromToc(tocDf, aiConfig.apiKey ? aiConfig : null),
        generateTableFromToc(tocDf, lineDf, aiConfig.apiKey ? aiConfig : null),
        generateFlashcardsFromToc(tocDf, lineDf, aiConfig.apiKey ? aiConfig : null),
        generateImagePromptsFromToc(tocDf, aiConfig.apiKey ? aiConfig : null),
      ]);
      setWorkflow(wf);
      setTable(tbl);
      setFlashcards(fcs);
      setImagePrompts(imgs);
    } catch (err) {
      console.error(err);
      setError(`Generation failed: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  }, [tocDf, lineDf, aiConfig]);

  const s = {
    container: { maxWidth: 1280, margin: '0 auto', padding: '1.5rem', fontFamily: 'DM Mono, monospace', color: '#1a1a2e' },
    card: { background: '#ffffff', border: '1px solid #e0dcd4', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    sectionLabel: (color = '#c9a84c') => ({ fontFamily: 'Syne, sans-serif', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color, borderLeft: `3px solid ${color}`, paddingLeft: '0.7rem', marginBottom: '1rem' }),
    input: { width: '100%', padding: '0.55rem 0.9rem', border: '1px solid #d0ccc4', borderRadius: 4, fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', outline: 'none' },
    btn: { padding: '0.6rem 1.2rem', borderRadius: 6, border: 'none', fontSize: '0.72rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' },
    btnPrimary: { ...{}, background: '#2563eb', color: '#fff' },
    btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.67rem' },
    th: { textAlign: 'left', padding: '0.7rem 0.8rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#8a8a9a', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #e0dcd4' },
    td: { padding: '0.7rem 0.8rem', borderBottom: '1px solid rgba(42,42,56,0.05)', color: '#4a4a5a' },
    badge: { display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.5rem', borderRadius: 999, fontSize: '0.6rem', fontWeight: 600 },
  };

  const renderTocView = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Pages', value: new Set(lineDf.map(l => l.page_num)).size, color: '#2a8a84' },
          { label: 'Candidates', value: candidates.length, color: '#c9a84c' },
          { label: 'TOC Entries', value: tocDf.length, color: '#5c3d8f' },
        ].map((stat, i) => (
          <div key={i} style={{ ...s.card, padding: '1rem' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8a8a9a', marginBottom: '0.5rem' }}>{stat.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {boundaries.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>Document Boundaries Detected</div>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', fontSize: '0.72rem', color: '#a16207' }}>
            {boundaries.map((b, i) => (
              <li key={i}>{b.type} at page {b.page} (confidence: {(b.confidence * 100).toFixed(0)}%)</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
          <div style={s.sectionLabel('#2a7a9c')}>Extracted Table of Contents</div>
        </div>
        <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
          <table style={s.table}>
            <thead style={{ position: 'sticky', top: 0, background: '#f7f5f0' }}>
              <tr>
                {['Title', 'Level', 'Page', 'Source', 'Score'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tocDf.map((entry, i) => (
                <tr key={i} style={{ background: entry.level === 1 ? '#eff6ff' : 'transparent' }}>
                  <td style={{ ...s.td, paddingLeft: `${entry.level * 16 + 16}px`, fontWeight: 600, color: '#1a1a2e' }}>{entry.title}</td>
                  <td style={s.td}>{entry.level}</td>
                  <td style={s.td}>{entry.page}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: entry.source === 'native' ? '#d1fae5' : entry.source === 'body_structure' ? '#dbeafe' : '#f3f4f6', color: entry.source === 'native' ? '#065f46' : entry.source === 'body_structure' ? '#1e40af' : '#374151' }}>
                      {entry.source || 'body_structure'}
                    </span>
                  </td>
                  <td style={s.td}>{entry.heading_score?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCandidatesView = () => (
    <div style={{ ...s.card, overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
        <div style={s.sectionLabel('#c9a84c')}>Heading Candidates (Deterministic Pass)</div>
        <p style={{ fontSize: '0.65rem', color: '#6a6a7a', marginTop: '0.3rem' }}>Shows all lines that scored above the threshold before LLM validation</p>
      </div>
      <div style={{ overflowX: 'auto', maxHeight: 400, overflowY: 'auto' }}>
        <table style={s.table}>
          <thead style={{ position: 'sticky', top: 0, background: '#f7f5f0' }}>
            <tr>
              {['Text', 'Page', 'Score', 'Font Ratio', 'Bold', 'Prefix', 'Short', 'Aligned', 'Blank'].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={i}>
                <td style={{ ...s.td, fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</td>
                <td style={s.td}>{c.page_num}</td>
                <td style={s.td}>{c.heading_score.toFixed(2)}</td>
                <td style={s.td}>{(c.signal_font_size_ratio || 0).toFixed(2)}</td>
                <td style={s.td}>{(c.signal_is_bold || 0).toFixed(2)}</td>
                <td style={s.td}>{(c.signal_has_numeric_prefix || 0).toFixed(2)}</td>
                <td style={s.td}>{(c.signal_is_short || 0).toFixed(2)}</td>
                <td style={s.td}>{(c.signal_is_left_aligned || 0).toFixed(2)}</td>
                <td style={s.td}>{(c.signal_has_blank_before || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWorkflowView = () => {
    if (!workflow) {
      return <div style={{ ...s.card, padding: '2rem', textAlign: 'center', color: '#6a6a7a' }}>Generate content to see the workflow diagram.</div>;
    }

    const mermaid = workflowToMermaid(workflow);
    return (
      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
          <div style={s.sectionLabel('#2a7a9c')}>Document Workflow</div>
        </div>
        <div style={{ padding: '1rem' }}>
          <pre style={{ background: '#1a1a2e', color: '#e2e8f0', padding: '1rem', borderRadius: 8, fontSize: '0.65rem', overflowX: 'auto', fontFamily: 'DM Mono, monospace', whiteSpace: 'pre-wrap' }}>
            {mermaid}
          </pre>
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {workflow.nodes.map(node => (
              <div key={node.id} style={{ display: 'flex', alignItems: 'center', paddingLeft: `${node.level * 16}px`, fontSize: '0.72rem', color: '#4a4a5a' }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', marginRight: 8, background: node.type === 'root' ? '#2563eb' : node.type === 'section' ? '#3b82f6' : '#93c5fd' }} />
                <span>{node.label}</span>
                {node.page && <span style={{ marginLeft: 8, fontSize: '0.6rem', color: '#9ca3af' }}>p.{node.page}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTableView = () => {
    if (!table) {
      return <div style={{ ...s.card, padding: '2rem', textAlign: 'center', color: '#6a6a7a' }}>Generate content to see the summary table.</div>;
    }

    return (
      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
          <div style={s.sectionLabel('#2a8a84')}>{table.title}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {(table.headers || []).map((h, i) => (
                  <th key={i} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(table.rows || []).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={s.td}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFlashcardsView = () => {
    if (flashcards.length === 0) {
      return <div style={{ ...s.card, padding: '2rem', textAlign: 'center', color: '#6a6a7a' }}>Generate content to see flashcards.</div>;
    }

    const card = flashcards[currentFlashcard];
    if (!card) return null;

    return (
      <div style={{ ...s.card, overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={s.sectionLabel('#5c3d8f')}>Flashcards</div>
          <span style={{ fontSize: '0.65rem', color: '#8a8a9a' }}>{currentFlashcard + 1} / {flashcards.length}</span>
        </div>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            style={{ width: '100%', maxWidth: 480, aspectRatio: '3/2', cursor: 'pointer', perspective: 1000 }}
          >
            <div style={{
              position: 'relative', width: '100%', height: '100%', transition: 'transform 0.5s', transformStyle: 'preserve-3d',
              transform: flashcardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2563eb, #4f46e5)', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backfaceVisibility: 'hidden' }}>
                <p style={{ color: '#fff', textAlign: 'center', fontSize: '1.1rem', fontWeight: 600 }}>{card.front}</p>
              </div>
              <div style={{ position: 'absolute', inset: 0, background: '#ffffff', border: '2px solid #e0dcd4', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <p style={{ color: '#1a1a2e', textAlign: 'center', fontSize: '1rem', lineHeight: 1.6 }}>{card.back}</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button onClick={() => { setCurrentFlashcard(Math.max(0, currentFlashcard - 1)); setFlashcardFlipped(false); }} disabled={currentFlashcard === 0} style={{ ...s.btn, background: '#f3f4f6', color: '#374151', ...(currentFlashcard === 0 ? s.btnDisabled : {}) }}>Previous</button>
            <button onClick={() => { setCurrentFlashcard(Math.min(flashcards.length - 1, currentFlashcard + 1)); setFlashcardFlipped(false); }} disabled={currentFlashcard === flashcards.length - 1} style={{ ...s.btn, background: '#f3f4f6', color: '#374151', ...(currentFlashcard === flashcards.length - 1 ? s.btnDisabled : {}) }}>Next</button>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
            {card.tags?.map(tag => (
              <span key={tag} style={{ padding: '0.15rem 0.5rem', background: '#f3f4f6', color: '#6b7280', borderRadius: 999, fontSize: '0.6rem' }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderImagesView = () => (
    <div style={{ ...s.card, overflow: 'hidden' }}>
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e0dcd4', background: '#f7f5f0' }}>
        <div style={s.sectionLabel('#7c3aed')}>Image Generation Prompts</div>
        <p style={{ fontSize: '0.65rem', color: '#6a6a7a', marginTop: '0.3rem' }}>AI prompts to generate diagrams for each section</p>
      </div>
      <div style={{ padding: '1rem', maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {imagePrompts.length === 0 ? (
          <p style={{ color: '#6a6a7a', fontSize: '0.72rem' }}>Generate content to see image prompts.</p>
        ) : (
          imagePrompts.map((img, i) => (
            <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#374151' }}>Section: {img.section}</span>
                <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>Page {img.page}</span>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#6b7280', fontStyle: 'italic' }}>"{img.prompt}"</p>
              <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.15rem 0.5rem', background: '#f3e8ff', color: '#7c3aed', borderRadius: 999, fontSize: '0.6rem' }}>{img.style}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const navItems = [
    { id: 'toc', label: 'Table of Contents' },
    { id: 'candidates', label: `Candidates (${candidates.length})` },
    { id: 'workflow', label: 'Workflow' },
    { id: 'table', label: 'Table' },
    { id: 'flashcards', label: `Flashcards (${flashcards.length})` },
    { id: 'images', label: 'Image Prompts' },
  ];

  return (
    <div style={s.container}>
      <div style={{ ...s.card, marginBottom: '1.5rem' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e0dcd4' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 900, color: '#1a1a2e', marginBottom: '0.5rem' }}>Document Structure & Loop Engineering</div>
          <p style={{ fontSize: '0.72rem', color: '#6a6a7a', lineHeight: 1.7, maxWidth: 800 }}>
            Recover PDF outline from body typography using deterministic signals and bounded LLM validation.
            Based on "Building Document Structure with Loop Engineering" (Towards Data Science, 2026).
          </p>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ fontSize: '0.72rem', color: '#4a4a5a' }}
            />
            {parsing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: '#2563eb' }}>
                <div style={{ width: 16, height: 16, border: '2px solid #2563eb', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                {progress}
              </div>
            )}
            {file && !parsing && (
              <span style={{ fontSize: '0.72rem', color: '#6a6a7a' }}>{file.name}</span>
            )}
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.72rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>AI API Key (optional)</label>
              <input
                type="password"
                value={aiConfig.apiKey}
                onChange={e => setAiConfig(c => ({ ...c, apiKey: e.target.value }))}
                placeholder="sk-..."
                style={s.input}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>AI Endpoint</label>
              <input
                type="text"
                value={aiConfig.endpoint}
                onChange={e => setAiConfig(c => ({ ...c, endpoint: e.target.value }))}
                style={s.input}
              />
            </div>
          </div>

          {lineDf.length > 0 && (
            <div>
              <button
                onClick={handleGenerateAll}
                disabled={generating || tocDf.length === 0}
                style={{ ...s.btn, ...s.btnPrimary, ...(generating || tocDf.length === 0 ? s.btnDisabled : {}) }}
              >
                {generating ? 'Generating...' : 'Generate Workflows, Tables & Flashcards'}
              </button>
            </div>
          )}
        </div>
      </div>

      {lineDf.length > 0 && (
        <div style={{ ...s.card, overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e0dcd4', overflowX: 'auto' }}>
            {navItems.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  fontFamily: 'Syne, sans-serif',
                  cursor: 'pointer',
                  border: 'none',
                  borderBottom: activeView === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                  background: activeView === tab.id ? '#eff6ff' : 'transparent',
                  color: activeView === tab.id ? '#2563eb' : '#6b7280',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '1rem' }}>
            {activeView === 'toc' && renderTocView()}
            {activeView === 'candidates' && renderCandidatesView()}
            {activeView === 'workflow' && renderWorkflowView()}
            {activeView === 'table' && renderTableView()}
            {activeView === 'flashcards' && renderFlashcardsView()}
            {activeView === 'images' && renderImagesView()}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
