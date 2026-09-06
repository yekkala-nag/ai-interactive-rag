/**
 * Adaptive Workflow Bar — Bottom Progress & Topic Progression Bar
 * 
 * Sits directly above the footer across all tabs.
 * Provides seamless:
 *  - ← Previous Topic
 *  - Mark as Mastered toggle with celebration feedback
 *  - Active track progress visualizer
 *  - Next Topic → adaptive progression
 */

import React, { useState, useEffect } from 'react';
import {
  getCurrentTrackId,
  getTrackById,
  getTrackProgress,
  subscribeToAdaptiveProgress
} from '../../services/adaptiveLearning.js';
import { getTabById } from '../../registry/tabsRegistry.js';
import { getPrereqIds } from '../../registry/curriculum.js';
import { getMasteryScore, isMastered, isProven, isClaimed } from '../../services/mastery.js';
import { hasExitCheck } from '../../registry/exitChecks.js';
import { ExitCheck } from './ExitCheck.jsx';

export function AdaptiveWorkflowBar({ activeTab, onSelectTab }) {
  const [trackId, setTrackId] = useState(() => getCurrentTrackId());
  const [progress, setProgress] = useState(() => getTrackProgress(trackId));
  const [mastery, setMastery] = useState(() => getMasteryScore(activeTab));
  const [showCelebration, setShowCelebration] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const currentTrack = getCurrentTrackId();
      setTrackId(currentTrack);
      setProgress(getTrackProgress(currentTrack));
      setMastery(getMasteryScore(activeTab));
    };

    update();
    const unsubscribe = subscribeToAdaptiveProgress(update);
    return unsubscribe;
  }, [activeTab]);

  const activeTrack = getTrackById(trackId);
  // Prerequisites live on the page now (not in nav tooltips): unmet ones
  // render as navigable chips below. In-child prev/next moved to the TopBar.
  const unmetPrereqs = getPrereqIds(activeTab)
    .map(id => getTabById(id))
    .filter(t => t && !isMastered(t.id));
  const proven = isMastered(activeTab);
  const earned = isProven(activeTab);
  const claimed = isClaimed(activeTab);
  const checkAvailable = hasExitCheck(activeTab);
  // Claimed (migrated toggle, never proven) renders amber + hollow:
  // asserted progress must never look identical to earned progress.
  const masteryTone = earned ? '#10b981' : claimed ? '#F5A623' : 'var(--ds-color-text-secondary)';
  const masteryLabel = earned
    ? `Mastered · ${mastery}`
    : claimed
      ? 'Claimed · prove it'
      : checkAvailable ? `Prove it · ${mastery}` : `Visited · ${mastery}`;

  const isOverview = activeTab === 'overview';

  return (
    <div
      className="adaptive-workflow-bar"
      style={{
        marginTop: 'var(--ds-space-10)',
        marginBottom: 'var(--ds-space-6)',
        background: 'var(--ds-color-bg-surface)',
        border: '1px solid var(--ds-color-border-subtle)',
        borderRadius: 'var(--ds-radius-xl)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(16px)',
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style jsx>{`
        .adaptive-workflow-bar {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .adaptive-bar-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .adaptive-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          padding: 8px 16px;
          border-radius: var(--ds-radius-lg);
          font-size: var(--ds-font-size-bodySm);
          font-weight: var(--ds-font-weight-medium);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--ds-color-border-default);
          background: var(--ds-color-bg-canvas);
          color: var(--ds-color-text-primary);
          text-decoration: none;
        }
        .adaptive-nav-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          border-color: var(--ds-color-border-strong);
          background: var(--ds-color-bg-surfaceHover);
        }
        .adaptive-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .adaptive-center-panel {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          justify-content: center;
          min-width: 240px;
        }
        @media (max-width: 768px) {
          .adaptive-bar-main {
            flex-direction: column;
            align-items: stretch;
          }
          .adaptive-nav-btn {
            width: 100%;
            justify-content: center;
          }
          .adaptive-center-panel {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>

      {/* Progress Track Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        paddingBottom: '10px',
        borderBottom: '1px solid var(--ds-color-border-subtle)',
        fontSize: 'var(--ds-font-size-caption)',
        color: 'var(--ds-color-text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>{activeTrack.icon}</span>
          <span style={{ fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>
            Track: {activeTrack.title}
          </span>
          <span style={{
            fontSize: '11px',
            padding: '2px 6px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--ds-color-border-subtle)'
          }}>
            {activeTrack.level}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>
            {progress.completed} of {progress.total} topics mastered ({progress.percent}%)
            {(() => {
              const claimedCount = (activeTrack.tabs || []).filter(isClaimed).length;
              return claimedCount > 0 ? (
                <span title="Migrated checklist claims — pass exit checks to convert to proven" style={{ color: '#F5A623' }}>
                  {' '}· {claimedCount} claimed
                </span>
              ) : null;
            })()}
          </span>
          <div style={{
            width: '80px',
            height: '6px',
            borderRadius: '4px',
            background: 'var(--ds-color-bg-canvas)',
            overflow: 'hidden',
            border: '1px solid var(--ds-color-border-subtle)'
          }}>
            <div style={{
              width: `${progress.percent}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${activeTrack.color || '#2563eb'}, #10b981)`,
              borderRadius: '4px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Prerequisites strip — on-page, only when something is unmet */}
      {!isOverview && unmetPrereqs.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
          padding: '8px 2px 0 2px',
          fontSize: 'var(--ds-font-size-caption)',
          color: 'var(--ds-color-text-secondary)'
        }}>
          <span style={{ fontWeight: 600, color: '#F5A623' }}>Needs first:</span>
          {unmetPrereqs.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTab(t.id)}
              title={`Study prerequisite: ${t.label}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '3px 10px', borderRadius: '16px',
                background: 'rgba(245, 166, 35, 0.1)',
                border: '1px solid rgba(245, 166, 35, 0.4)',
                color: 'var(--ds-color-text-primary)',
                fontSize: '0.74rem', cursor: 'pointer'
              }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Row: prove + hub (prev/next live in the TopBar position bar) */}
      <div className="adaptive-bar-main" style={{ justifyContent: 'center' }}>
        {/* Center: evidence-based mastery (visit + prove) */}
        <div className="adaptive-center-panel">
          {!isOverview && (
            <button
              type="button"
              onClick={() => checkAvailable && setExitOpen(true)}
              className="adaptive-nav-btn"
              title={claimed
                ? 'Migrated from your old checklist — pass the 3-question check to convert this claim into proven mastery'
                : checkAvailable ? 'Prove mastery: 3 questions (best score keeps)' : 'Exit check landing soon — visits still count'}
              style={{
                background: earned ? 'rgba(16, 185, 129, 0.15)' : claimed ? 'rgba(245, 166, 35, 0.12)' : 'var(--ds-color-bg-canvas)',
                borderColor: earned ? '#10b981' : claimed ? '#F5A623' : 'var(--ds-color-border-default)',
                color: masteryTone,
                fontWeight: proven ? 600 : 500,
                position: 'relative',
                cursor: checkAvailable ? 'pointer' : 'default',
                opacity: checkAvailable ? 1 : 0.75
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{earned ? '✓' : claimed ? '◇' : '○'}</span>
              <span>{masteryLabel}</span>
              {showCelebration && (
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  background: '#10b981',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(16,185,129,0.4)',
                  animation: 'bounce 0.4s ease'
                }}>
                  🎉 Mastered!
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectTab('overview')}
            className="adaptive-nav-btn"
            style={{
              padding: '8px 12px',
              fontSize: '12px',
              color: 'var(--ds-color-text-tertiary)'
            }}
            title="Return to Adaptive Learning Hub"
          >
            🎯 Learning Hub
          </button>
          <ExitCheck
            open={exitOpen}
            tabId={activeTab}
            onSelectTab={onSelectTab}
            onClose={() => {
              const wasProven = proven;
              setExitOpen(false);
              const now = getMasteryScore(activeTab);
              setMastery(now);
              if (!wasProven && isMastered(activeTab)) {
                setShowCelebration(true);
                setTimeout(() => setShowCelebration(false), 2000);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
