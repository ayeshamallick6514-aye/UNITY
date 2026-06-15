import React from 'react';

const ICON_MAP = { completed: '✓', flagged: '⚠', critical: '●', info: '○' };
const CLASS_MAP = { completed: 'fi-completed', flagged: 'fi-flagged', critical: 'fi-critical', info: 'fi-info' };

export default function EventLog({ events, activeFilter, setActiveFilter }) {
  // Compute summary counts
  const counts = events.reduce(
    (acc, item) => {
      if (item.type === 'completed') acc.completed++;
      else if (item.type === 'flagged') acc.flagged++;
      else if (item.type === 'critical') acc.critical++;
      else if (item.type === 'info') acc.info++;
      return acc;
    },
    { completed: 0, flagged: 0, critical: 0, info: 0 }
  );

  const filteredEvents = events.filter(
    (item) => activeFilter === 'all' || item.type === activeFilter
  );

  return (
    <section className="section feed-section" id="s-feed">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 06 / 07 — EVENT LOG</div>
          <h2 className="section-title">Coordination Event Log</h2>
          <p className="section-desc">Real-time log of inter-department coordination events — clearances issued, escalations raised, delays flagged, and dependencies resolved. Each entry indicates a decision point.</p>
        </div>

        <div className="feed-layout">
          <div className="feed-stream" id="feedStream">
            {filteredEvents.map((item, index) => (
              <div key={index} className={`feed-item ${CLASS_MAP[item.type] || ''}`}>
                <span className="feed-item-icon">{ICON_MAP[item.type]}</span>
                <div>
                  <div className="feed-item-text">{item.text}</div>
                  <div className="feed-item-dept">{item.dept}</div>
                </div>
                <span className="feed-item-time">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="feed-sidebar">
            <div className="feed-summary-title">LOG SUMMARY</div>
            <div className="feed-summary-item">
              <span className="fsi-dot fsi-green"></span>
              <span className="fsi-label">Resolved</span>
              <span className="fsi-count" id="feedCountGreen">{counts.completed}</span>
            </div>
            <div className="feed-summary-item">
              <span className="fsi-dot fsi-amber"></span>
              <span className="fsi-label">Escalated</span>
              <span className="fsi-count" id="feedCountAmber">{counts.flagged}</span>
            </div>
            <div className="feed-summary-item">
              <span className="fsi-dot fsi-red"></span>
              <span className="fsi-label">Critical</span>
              <span className="fsi-count" id="feedCountRed">{counts.critical}</span>
            </div>
            <div className="feed-summary-item">
              <span className="fsi-dot fsi-grey"></span>
              <span className="fsi-label">Updates</span>
              <span className="fsi-count" id="feedCountGrey">{counts.info}</span>
            </div>

            <div className="feed-filter-title">FILTER LOG</div>
            <button 
              className={`feed-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Entries
            </button>
            <button 
              className={`feed-filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              Resolved
            </button>
            <button 
              className={`feed-filter-btn ${activeFilter === 'flagged' ? 'active' : ''}`}
              onClick={() => setActiveFilter('flagged')}
            >
              Escalated
            </button>
            <button 
              className={`feed-filter-btn ${activeFilter === 'critical' ? 'active' : ''}`}
              onClick={() => setActiveFilter('critical')}
            >
              Critical Blocks
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
