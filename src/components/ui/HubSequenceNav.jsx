/**
 * HubSequenceNav — pilot in-hub sequential navigation (Batch: prompt hub).
 * Rendered at the bottom of every subtopic page in a collapsed hub:
 * position ("Topic N of 10"), level badge + mastery status (metadata
 * preserved from the collapsed sidebar), dot stepper, Prev / Next.
 * Last topic: primary next-hub link + secondary back-to-overview.
 * Chrome uses DS tokens only; dots mirror the SkillTree mastery palette.
 */
import {
  getChildSequence,
  getHubPageId,
  getTopicMeta,
  getChildById,
  getChildrenForUmbrella,
  PILOT_COLLAPSED_CHILDREN,
} from '../../registry/curriculum.js';
import { getTabById, getUmbrellaForTab, UMBRELLA_TOPICS } from '../../registry/tabsRegistry.js';
import { isProven, isClaimed } from '../../services/mastery.js';

const LEVEL_INK = { 1: '#1F6B6E', 2: '#6B5E94', 3: '#C47A6A' };
const LEVEL_TINT = { 1: '#5EC4C8', 2: '#9B89C4', 3: '#F0A89A' };

function dotStyle(id, isCurrent) {
  const base = {
    width: 26, height: 26, borderRadius: '50%', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.62rem', fontWeight: 700, padding: 0, flexShrink: 0,
    transition: 'transform 0.12s ease',
  };
  if (isCurrent) {
    return { ...base, background: '#0F1219', color: '#F5F5F7', border: '2px solid #0F1219' };
  }
  if (isProven(id)) return { ...base, background: '#5EC4C8', color: '#0F1219', border: '1px solid #3A9B9F' };
  if (isClaimed(id)) return { ...base, background: '#F0A89A', color: '#0F1219', border: '1px solid #C47A6A' };
  return { ...base, background: 'transparent', color: 'var(--ds-color-text-tertiary)', border: '1.5px solid #C9B8E8' };
}

const navBtn = (primary) => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '8px 14px', borderRadius: '8px',
  background: primary ? 'var(--ds-color-brand-tealDark, #3A9B9F)' : 'var(--ds-color-bg-canvas)',
  color: primary ? '#FFFFFF' : 'var(--ds-color-text-primary)',
  border: `1px solid ${primary ? 'var(--ds-color-brand-tealDark, #3A9B9F)' : 'var(--ds-color-border-default)'}`,
  fontSize: '0.78rem', fontWeight: primary ? 700 : 600, cursor: 'pointer',
  maxWidth: '100%',
});

export default function HubSequenceNav({ tabId, onSelectTab }) {
  const meta = getTopicMeta(tabId);
  if (!meta.c || !PILOT_COLLAPSED_CHILDREN.includes(meta.c)) return null;
  const seq = getChildSequence(meta.c);
  const index = seq.indexOf(tabId);
  if (index < 0) return null;

  const child = getChildById(meta.c);
  const hubPageId = getHubPageId(meta.c);
  const level = meta.l || 1;
  const tab = getTabById(tabId) || { label: tabId, icon: '📝' };
  const prevId = index > 0 ? seq[index - 1] : null;
  const nextId = index < seq.length - 1 ? seq[index + 1] : null;
  const prevTab = prevId ? (getTabById(prevId) || { label: prevId }) : null;
  const nextTab = nextId ? (getTabById(nextId) || { label: nextId }) : null;

  const status = isProven(tabId)
    ? { label: '✓ Proven', color: '#1F6B6E' }
    : isClaimed(tabId)
      ? { label: '◇ Claimed — prove it', color: '#C47A6A' }
      : { label: '○ Not yet proven', color: 'var(--ds-color-text-tertiary)' };

  // Next hub in the same umbrella (overview landing per hub-click rule).
  // Fallback: first hub of the next umbrella so the last topic of a final
  // child (e.g. Speech AI & Voice Agents) still has a forward path.
  let nextHub = null;
  let nextHubCrossSection = false;
  const umbrella = getUmbrellaForTab(tabId);
  if (umbrella) {
    const siblings = getChildrenForUmbrella(umbrella.id);
    const at = siblings.findIndex(c => c.id === meta.c);
    if (at >= 0 && at < siblings.length - 1) nextHub = siblings[at + 1];
    if (!nextHub) {
      const uIdx = UMBRELLA_TOPICS.findIndex(u => u.id === umbrella.id);
      const nextUmbrella = uIdx >= 0 ? UMBRELLA_TOPICS[uIdx + 1] : null;
      const firstChild = nextUmbrella ? getChildrenForUmbrella(nextUmbrella.id)[0] : null;
      if (firstChild) { nextHub = firstChild; nextHubCrossSection = true; }
    }
  }

  const go = (id) => { if (id && onSelectTab) onSelectTab(id); };

  return (
    <nav
      aria-label={`Sequence navigation for ${child ? child.title : meta.c}`}
      style={{
        marginTop: 'var(--ds-space-8)',
        background: 'var(--ds-color-bg-surface)',
        border: '1px solid var(--ds-color-border-subtle)',
        borderRadius: 'var(--ds-radius-lg)',
        padding: '16px 18px',
      }}
    >
      {/* Position + preserved metadata */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ds-color-text-primary)', whiteSpace: 'nowrap' }}>
            Topic {index + 1} of {seq.length}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--ds-color-text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            · {child ? child.title : meta.c}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{
            fontSize: '0.66rem', fontWeight: 700, fontFamily: 'SF Mono, monospace',
            color: LEVEL_INK[level], background: `${LEVEL_TINT[level]}26`,
            border: `1px solid ${LEVEL_TINT[level]}66`,
            padding: '2px 8px', borderRadius: '9999px',
          }}>
            L{level}
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: status.color }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Dot stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }} role="list">
        {seq.map((id, i) => {
          const t = getTabById(id) || { label: id, icon: '📝' };
          const current = i === index;
          return (
            <button
              key={id}
              role="listitem"
              title={`${i + 1}. ${t.label}`}
              aria-label={`Go to topic ${i + 1} of ${seq.length}: ${t.label}${current ? ' (current)' : ''}`}
              aria-current={current ? 'step' : undefined}
              onClick={() => go(id)}
              style={dotStyle(id, current)}
              onMouseEnter={e => { if (!current) e.currentTarget.style.transform = 'scale(1.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {isProven(id) && !current ? '✓' : (i + 1)}
            </button>
          );
        })}
        <span style={{ fontSize: '0.7rem', color: 'var(--ds-color-text-tertiary)', marginLeft: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {tab.icon} {tab.label}
        </span>
      </div>

      {/* Prev / Next */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        {prevId ? (
          <button onClick={() => go(prevId)} title={`Previous: ${prevTab.label}`} aria-label={`Previous topic: ${prevTab.label}`} style={navBtn(false)}>
            <span aria-hidden="true">‹</span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '32vw' }}>{prevTab.label}</span>
          </button>
        ) : (
          <button onClick={() => go(hubPageId)} title="Back to hub overview" aria-label="Back to hub overview" style={navBtn(false)}>
            <span aria-hidden="true">‹</span>
            <span>Hub overview</span>
          </button>
        )}
        {nextId ? (
          <button onClick={() => go(nextId)} title={`Next: ${nextTab.label}`} aria-label={`Next topic: ${nextTab.label}`} style={navBtn(true)}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '32vw' }}>{nextTab.label}</span>
            <span aria-hidden="true">›</span>
          </button>
        ) : nextHub ? (
          <button onClick={() => go(getHubPageId(nextHub.id))} title={nextHubCrossSection ? `Next section: ${nextHub.title}` : `Next hub: ${nextHub.title}`} aria-label={nextHubCrossSection ? `Next section: ${nextHub.title}` : `Next hub: ${nextHub.title}`} style={navBtn(true)}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '32vw' }}>{nextHubCrossSection ? `Next: ${nextHub.title}` : `Next hub: ${nextHub.title}`}</span>
            <span aria-hidden="true">›</span>
          </button>
        ) : (
          <button onClick={() => go(hubPageId)} title="Back to hub overview" aria-label="Back to hub overview" style={navBtn(false)}>
            <span>Hub overview</span>
          </button>
        )}
      </div>
    </nav>
  );
}
