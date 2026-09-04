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
  isTabMastered,
  toggleTabMastery,
  getPreviousTopic,
  getNextTopic,
  subscribeToAdaptiveProgress
} from '../../services/adaptiveLearning.js';

export function AdaptiveWorkflowBar({ activeTab, onSelectTab }) {
  const [trackId, setTrackId] = useState(() => getCurrentTrackId());
  const [progress, setProgress] = useState(() => getTrackProgress(trackId));
  const [isMastered, setIsMastered] = useState(() => isTabMastered(activeTab));
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const update = () => {
      const currentTrack = getCurrentTrackId();
      setTrackId(currentTrack);
      setProgress(getTrackProgress(currentTrack));
      setIsMastered(isTabMastered(activeTab));
    };

    update();
    const unsubscribe = subscribeToAdaptiveProgress(update);
    return unsubscribe;
  }, [activeTab]);

  const activeTrack = getTrackById(trackId);
  const prevTopicInfo = getPreviousTopic(activeTab, trackId);
  const nextTopicInfo = getNextTopic(activeTab, trackId);

  const handleToggleMastery = () => {
    const newlyMastered = toggleTabMastery(activeTab);
    setIsMastered(newlyMastered);
    if (newlyMastered) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

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
        .adaptive-nav-next {
          background: linear-gradient(135deg, ${activeTrack.color || '#2563eb'}, #4f46e5);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 14px ${activeTrack.color ? activeTrack.color + '40' : 'rgba(37, 99, 235, 0.3)'};
        }
        .adaptive-nav-next:hover:not(:disabled) {
          background: linear-gradient(135deg, ${activeTrack.color || '#2563eb'}, #4338ca);
          box-shadow: 0 6px 20px ${activeTrack.color ? activeTrack.color + '60' : 'rgba(37, 99, 235, 0.45)'};
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

      {/* Main Navigation Row */}
      <div className="adaptive-bar-main">
        {/* Previous Topic Button */}
        <button
          type="button"
          className="adaptive-nav-btn"
          disabled={!prevTopicInfo}
          onClick={() => prevTopicInfo && onSelectTab(prevTopicInfo.tabId)}
          title={prevTopicInfo ? `Go to ${prevTopicInfo.tab?.label || prevTopicInfo.tabId}` : 'At start of track'}
        >
          <span>←</span>
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
            {prevTopicInfo ? (prevTopicInfo.tab?.label || 'Previous Topic') : 'Beginning'}
          </span>
        </button>

        {/* Center: Mark as Mastered Toggle */}
        <div className="adaptive-center-panel">
          {!isOverview && (
            <button
              type="button"
              onClick={handleToggleMastery}
              className="adaptive-nav-btn"
              style={{
                background: isMastered ? 'rgba(16, 185, 129, 0.15)' : 'var(--ds-color-bg-canvas)',
                borderColor: isMastered ? '#10b981' : 'var(--ds-color-border-default)',
                color: isMastered ? '#10b981' : 'var(--ds-color-text-secondary)',
                fontWeight: isMastered ? 600 : 500,
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{isMastered ? '✓' : '○'}</span>
              <span>{isMastered ? 'Topic Mastered' : 'Mark as Mastered'}</span>
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
        </div>

        {/* Next Topic Button */}
        <button
          type="button"
          className="adaptive-nav-btn adaptive-nav-next"
          disabled={!nextTopicInfo}
          onClick={() => nextTopicInfo && onSelectTab(nextTopicInfo.tabId)}
          title={nextTopicInfo ? `Next: ${nextTopicInfo.tab?.label || nextTopicInfo.tabId}` : 'All caught up!'}
        >
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
            {nextTopicInfo?.isCompleted ? '🏆 Track Completed!' : `Next: ${nextTopicInfo?.tab?.label || 'Next Topic'}`}
          </span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
