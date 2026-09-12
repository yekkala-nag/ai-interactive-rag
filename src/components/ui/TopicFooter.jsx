/**
 * TopicFooter — universal end-of-topic block rendered by TabLoader.
 * War story ("Graveyard") + anti-pattern where authored, plus a
 * prove-mastery shortcut. Skipped on hub/tracker pages.
 */
import React, { useState } from 'react';
import { Card, Button } from './Core.jsx';
import { ExitCheck } from './ExitCheck.jsx';
import { getWarStory } from '../../registry/warStories.js';
import { getAntiPattern } from '../../registry/antiPatterns.js';
import { hasExitCheck } from '../../registry/exitChecks.js';
import { getTabById } from '../../registry/tabsRegistry.js';

const SKIP = new Set(['overview', 'progress', 'airoadmap']);

export function TopicFooter({ tabId, onSelectTab }) {
  const [exitOpen, setExitOpen] = useState(false);
  if (!tabId || SKIP.has(tabId)) return null;
  const story = getWarStory(tabId);
  const anti = getAntiPattern(tabId);
  const checkable = hasExitCheck(tabId);
  if (!story && !anti && !checkable) return null;
  const tab = getTabById(tabId) || { label: tabId };

  return (
    <div style={{
      marginTop: 'var(--ds-space-10)',
      paddingTop: 'var(--ds-space-6)',
      borderTop: '1px solid var(--ds-color-border-subtle)',
      display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      {story && (
        <Card style={{ padding: '14px 16px', background: 'rgba(239,68,68,0.06)', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', marginBottom: '4px' }}>
            🪦 Production War Story — {story.title}
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)', lineHeight: 1.55 }}>{story.body}</div>
        </Card>
      )}
      {anti && (
        <Card style={{ padding: '14px 16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #F5A623' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F5A623', marginBottom: '4px' }}>🚫 Anti-Pattern</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--ds-color-text-secondary)' }}>✕ {anti.no}</div>
          <div style={{ fontSize: '0.82rem', color: '#10b981', marginTop: '4px' }}>✓ {anti.yes}</div>
        </Card>
      )}
      {checkable && (
        <div>
          <Button variant="secondary" size="sm" onClick={() => setExitOpen(true)}>
            ✅ Prove “{tab.label}” — 3-question exit check
          </Button>
          <ExitCheck open={exitOpen} tabId={tabId} onClose={() => setExitOpen(false)} onSelectTab={onSelectTab} />
        </div>
      )}
    </div>
  );
}
