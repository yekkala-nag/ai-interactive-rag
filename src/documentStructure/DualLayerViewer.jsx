import { useState, useMemo } from 'react';
import { tagParagraphsWithDualLayer } from './tocReconstructor.js';

export default function DualLayerViewer({ lineDf, tocDf }) {
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [queryFilter, setQueryFilter] = useState('garantie:collision AND exclusion:*');
  const [customQueryActive, setCustomQueryActive] = useState(false);

  const paragraphs = useMemo(() => {
    return tagParagraphsWithDualLayer(lineDf, tocDf);
  }, [lineDf, tocDf]);

  const allTags = useMemo(() => {
    const set = new Set(['ALL']);
    paragraphs.forEach(p => p.layer2_tags.forEach(t => set.add(t)));
    return Array.from(set);
  }, [paragraphs]);

  const filteredParagraphs = useMemo(() => {
    if (customQueryActive && queryFilter.trim()) {
      // Simulate Boolean Set Intersection Query e.g. "garantie:collision AND exclusion:*"
      const terms = queryFilter.split(/\s+AND\s+/i).map(t => t.trim().toLowerCase());
      return paragraphs.filter(p => {
        return terms.every(term => {
          if (term.endsWith('*')) {
            const prefix = term.slice(0, -1);
            return p.layer2_tags.some(t => t.toLowerCase().startsWith(prefix));
          }
          return p.layer2_tags.some(t => t.toLowerCase() === term);
        });
      });
    }

    if (selectedTag === 'ALL') return paragraphs;
    return paragraphs.filter(p => p.layer2_tags.includes(selectedTag));
  }, [paragraphs, selectedTag, queryFilter, customQueryActive]);

  return (
    <div style={{ background: '#ffffff', borderRadius: 8, border: '1px solid #e0dcd4', padding: '1.25rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#5c3d8f', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
          Dual-Layer Multi-Tag Document Architecture
        </div>
        <p style={{ fontSize: '0.72rem', color: '#6a6a7a', lineHeight: 1.5 }}>
          <strong>Layer 1 (Typographic Level)</strong> defines section boundaries, while <strong>Layer 2 (Business Tags)</strong> tags cross-cutting themes per paragraph.
        </p>
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e293b', fontFamily: 'Syne, sans-serif' }}>
            Interactive Layer 2 Query Simulator (Boolean Set Intersection)
          </label>
          <button
            onClick={() => setCustomQueryActive(!customQueryActive)}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: 4,
              border: 'none',
              background: customQueryActive ? '#2563eb' : '#e2e8f0',
              color: customQueryActive ? '#ffffff' : '#475569',
              fontSize: '0.62rem',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {customQueryActive ? 'Query Simulator Active' : 'Enable Query Simulator'}
          </button>
        </div>

        {customQueryActive && (
          <div>
            <input
              type="text"
              value={queryFilter}
              onChange={e => setQueryFilter(e.target.value)}
              placeholder="e.g. garantie:collision AND exclusion:*"
              style={{
                width: '100%',
                padding: '0.5rem 0.8rem',
                borderRadius: 4,
                border: '1px solid #cbd5e1',
                fontSize: '0.72rem',
                fontFamily: 'DM Mono, monospace',
                outline: 'none',
              }}
            />
            <div style={{ fontSize: '0.62rem', color: '#64748b', marginTop: '0.3rem' }}>
              Example queries: <code>garantie:collision AND exclusion:*</code> | <code>garantie AND plafond</code>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', alignSelf: 'center' }}>Filter Tag:</span>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => { setSelectedTag(tag); setCustomQueryActive(false); }}
            style={{
              padding: '0.25rem 0.6rem',
              borderRadius: 999,
              border: 'none',
              background: selectedTag === tag && !customQueryActive ? '#5c3d8f' : '#f1f5f9',
              color: selectedTag === tag && !customQueryActive ? '#ffffff' : '#475569',
              fontSize: '0.62rem',
              fontFamily: 'DM Mono, monospace',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.75rem' }}>
        Showing {filteredParagraphs.length} of {paragraphs.length} paragraphs
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 450, overflowY: 'auto' }}>
        {filteredParagraphs.map(p => (
          <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '0.85rem', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.15rem 0.5rem', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700, fontFamily: 'DM Mono, monospace' }}>
                  Layer 1: {p.layer1_section} (L{p.layer1_level})
                </span>
                <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Page {p.page}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {p.layer2_tags.map(tag => (
                  <span key={tag} style={{ background: tag.includes('exclusion') ? '#fef2f2' : tag.includes('garantie') ? '#f0fdf4' : '#f3e8ff', color: tag.includes('exclusion') ? '#991b1b' : tag.includes('garantie') ? '#166534' : '#6b21a8', padding: '0.1rem 0.4rem', borderRadius: 999, fontSize: '0.58rem', fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>
                    Layer 2: {tag}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#334155', lineHeight: 1.6, margin: 0, fontFamily: 'DM Mono, monospace' }}>
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
