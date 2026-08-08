import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

export default function PdfOverlayViewer({ file, lineDf, candidates, threshold }) {
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [hoveredCandidate, setHoveredCandidate] = useState(null);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    let isSubscribed = true;
    file.arrayBuffer().then(buffer => {
      pdfjsLib.getDocument({ data: buffer }).promise.then(pdf => {
        if (isSubscribed) {
          setPdfDoc(pdf);
          setNumPages(pdf.numPages);
          setPageNum(1);
        }
      }).catch(console.error);
    });

    return () => { isSubscribed = false; };
  }, [file]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask = null;
    pdfDoc.getPage(pageNum).then(page => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      renderTask = page.render({ canvasContext: context, viewport });
      renderTask.promise.catch(() => {});
    });

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, pageNum, scale]);

  const pageLines = lineDf.filter(l => l.page_num === pageNum);
  const candidateMap = new Map();
  candidates.filter(c => c.page_num === pageNum).forEach(c => candidateMap.set(`${c.page_num}-${c.line_num}`, c));

  const viewportHeight = canvasRef.current ? canvasRef.current.height / scale : 800;
  const viewportWidth = canvasRef.current ? canvasRef.current.width / scale : 600;

  return (
    <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e0dcd4', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          PDF Visual Bounding-Box Overlay Scorer
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => setPageNum(p => Math.max(1, p - 1))}
              disabled={pageNum <= 1}
              style={btnStyle(pageNum <= 1)}
            >
              Prev Page
            </button>
            <span style={{ fontSize: '0.72rem', fontFamily: 'DM Mono, monospace', color: '#4a4a5a' }}>
              Page {pageNum} of {numPages}
            </span>
            <button
              onClick={() => setPageNum(p => Math.min(numPages, p + 1))}
              disabled={pageNum >= numPages}
              style={btnStyle(pageNum >= numPages)}
            >
              Next Page
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <button onClick={() => setScale(s => Math.max(0.8, s - 0.2))} style={btnStyle(false)}>-</button>
            <span style={{ fontSize: '0.72rem', fontFamily: 'DM Mono, monospace' }}>{(scale * 100).toFixed(0)}%</span>
            <button onClick={() => setScale(s => Math.min(2.0, s + 0.2))} style={btnStyle(false)}>+</button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.65rem', fontFamily: 'DM Mono, monospace' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <div style={{ width: 12, height: 12, border: '2px solid #16a34a', background: 'rgba(22, 163, 74, 0.15)', borderRadius: 2 }} />
          <span>Candidate ($\ge {threshold.toFixed(1)}$)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <div style={{ width: 12, height: 12, border: '1px stroke #9ca3af', background: 'rgba(156, 163, 175, 0.1)', borderRadius: 2 }} />
          <span>Rejected Line ($&lt; {threshold.toFixed(1)}$)</span>
        </div>
      </div>

      <div ref={containerRef} style={{ position: 'relative', overflow: 'auto', maxHeight: 600, border: '1px solid #e2e8f0', borderRadius: 6, background: '#f8fafc' }}>
        <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />

        {canvasRef.current && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: canvasRef.current.width, height: canvasRef.current.height, pointerEvents: 'none' }}>
            {pageLines.map((line) => {
              const candidate = candidateMap.get(`${line.page_num}-${line.line_num}`);
              const isCandidate = !!candidate;
              const isHovered = hoveredCandidate?.line_num === line.line_num;

              const left = line.x0 * scale;
              const top = line.y0 * scale;
              const width = Math.max(line.width * scale, 120);
              const height = Math.max((line.font_size || 12) * scale, 16);

              return (
                <div
                  key={`${line.page_num}-${line.line_num}`}
                  onMouseEnter={() => setHoveredCandidate(line)}
                  onMouseLeave={() => setHoveredCandidate(null)}
                  style={{
                    position: 'absolute',
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    border: isCandidate ? '2px solid #16a34a' : '1px dashed rgba(156, 163, 175, 0.5)',
                    background: isCandidate
                      ? (isHovered ? 'rgba(22, 163, 74, 0.35)' : 'rgba(22, 163, 74, 0.18)')
                      : (isHovered ? 'rgba(156, 163, 175, 0.25)' : 'transparent'),
                    borderRadius: 3,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isCandidate && (
                    <div style={{
                      position: 'absolute',
                      right: -110,
                      top: -2,
                      background: '#1e293b',
                      color: '#38bdf8',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 4,
                      fontSize: '0.55rem',
                      fontFamily: 'DM Mono, monospace',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    }}>
                      L{candidate.candidate_level || 1} | B:{candidate.is_bold ? 'Y' : 'N'} | {candidate.font_size?.toFixed(1)}pt | S:{candidate.heading_score?.toFixed(2)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {hoveredCandidate && (
        <div style={{ marginTop: '0.75rem', background: '#0f172a', color: '#f8fafc', padding: '0.75rem', borderRadius: 6, fontSize: '0.68rem', fontFamily: 'DM Mono, monospace' }}>
          <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '0.3rem' }}>Line Inspector Telemetry</div>
          <div>Text: "{hoveredCandidate.text}"</div>
          <div>Heading Score: {hoveredCandidate.heading_score?.toFixed(2) || '0.00'} | Font Size: {hoveredCandidate.font_size?.toFixed(1)}pt | Bold Ratio: {((hoveredCandidate.bold_ratio || 0) * 100).toFixed(0)}%</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', fontSize: '0.6rem', color: '#94a3b8' }}>
            <span>Font: {hoveredCandidate.signal_font_size_ratio?.toFixed(2)}</span>
            <span>Bold: {hoveredCandidate.signal_is_bold?.toFixed(2)}</span>
            <span>Prefix: {hoveredCandidate.signal_has_numeric_prefix?.toFixed(2)}</span>
            <span>Short: {hoveredCandidate.signal_is_short?.toFixed(2)}</span>
            <span>Align: {hoveredCandidate.signal_is_left_aligned?.toFixed(2)}</span>
            <span>Blank: {hoveredCandidate.signal_has_blank_before?.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function btnStyle(disabled) {
  return {
    padding: '0.35rem 0.7rem',
    borderRadius: 4,
    border: '1px solid #d0ccc4',
    background: disabled ? '#f3f4f6' : '#ffffff',
    color: disabled ? '#9ca3af' : '#1e293b',
    fontSize: '0.65rem',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
