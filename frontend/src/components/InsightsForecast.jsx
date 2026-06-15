import React, { useState, useEffect } from 'react';

const tickerTexts = [
  'Revenue clearance queue: 42 pending cases — up from 36 last month. This is the primary bottleneck across 11 active projects.',
  'MPEB pole relocation delay: 19 days elapsed. Contractor penalty warning activates in 3 days.',
  'AIIMS water main conflict: Rescheduling to night window (23:00 - 05:00) resolved with zero patient disruption forecast.'
];

export default function InsightsForecast() {
  const [tickerIdx, setTickerIdx] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % tickerTexts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* SECTION 5: ADMINISTRATIVE INSIGHTS */}
      <section className="section l2-section insights-section" id="s-insights">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">LAYER II — 05 / 06</div>
            <h2 className="section-title">Administrative Insights</h2>
            <p className="section-desc">Operational observations derived from active coordination data — for District Collector and Commissioner review.</p>
          </div>
          <div className="insights-layout">
            <div className="insights-ticker-wrap">
              <div className="insights-ticker-label">COORDINATION INTELLIGENCE</div>
              <div className="insights-ticker" id="insightsTicker">
                <span className="it-dot it-dot-critical"></span>
                <span className="it-text" id="insightsTickerText" style={{ transition: 'opacity 0.5s ease' }}>
                  {tickerTexts[tickerIdx]}
                </span>
              </div>
            </div>
            <div className="insights-grid" id="insightsGrid">
              
              <div className="insight-card insight-warning">
                <div className="insight-card-bar"></div>
                <div className="insight-card-content">
                  <div className="insight-icon">↑</div>
                  <div className="insight-body">
                    <div className="insight-headline">Revenue clearance backlog has grown — 42 pending cases, up from 36 last month.</div>
                    <div className="insight-sub">42 pending cases — up from 36 last month. Primary blocker across 11 dependent projects.</div>
                  </div>
                  <div className="insight-timestamp">TODAY</div>
                </div>
              </div>

              <div className="insight-card insight-critical">
                <div className="insight-card-bar insight-bar-critical"></div>
                <div className="insight-card-content">
                  <div className="insight-icon insight-icon-critical">⚠</div>
                  <div className="insight-body">
                    <div className="insight-headline">Three projects entered high-risk status this week.</div>
                    <div className="insight-sub">MP Nagar, AIIMS pipeline, and Kolar corridor crossed risk threshold. Intervention window is narrowing.</div>
                  </div>
                  <div className="insight-timestamp">THIS WEEK</div>
                </div>
              </div>

              <div className="insight-card insight-positive">
                <div className="insight-card-bar insight-bar-positive"></div>
                <div className="insight-card-content">
                  <div className="insight-icon insight-icon-positive">↓</div>
                  <div className="insight-body">
                    <div className="insight-headline">Coordination failures in Arera Colony zone reduced by 5 active conflicts this month.</div>
                    <div className="insight-sub">Active conflicts reduced from 23 to 18 in Arera Colony after Transport-Municipal coordination directive issued last month.</div>
                  </div>
                  <div className="insight-timestamp">THIS MONTH</div>
                </div>
              </div>

              <div className="insight-card insight-positive">
                <div className="insight-card-bar insight-bar-positive"></div>
                <div className="insight-card-content">
                  <div className="insight-icon insight-icon-positive">✓</div>
                  <div className="insight-body">
                    <div className="insight-headline">No healthcare disruptions predicted in the next 7 days.</div>
                    <div className="insight-sub">AIIMS conflict is manageable with rescheduling. Health &amp; Sanitation coordination response within the 5-day standard.</div>
                  </div>
                  <div className="insight-timestamp">FORECAST</div>
                </div>
              </div>

              <div className="insight-card insight-warning">
                <div className="insight-card-bar"></div>
                <div className="insight-card-content">
                  <div className="insight-icon">≡</div>
                  <div className="insight-body">
                    <div className="insight-headline">Revenue and Energy departments show response lag exceeding 8 working days — above acceptable standard.</div>
                    <div className="insight-sub">Revenue: 12-day average response lag. Energy: 19-day unresolved pole relocation. Both require direct administrative escalation.</div>
                  </div>
                  <div className="insight-timestamp">THIS MONTH</div>
                </div>
              </div>

              <div className="insight-card insight-neutral">
                <div className="insight-card-bar insight-bar-neutral"></div>
                <div className="insight-card-content">
                  <div className="insight-icon insight-icon-neutral">○</div>
                  <div className="insight-body">
                    <div className="insight-headline">Pending coordination clearances resolved at a higher rate this week.</div>
                    <div className="insight-sub">32 inter-department clearances completed this week. Coordination backlog reduced from 46 to 14 pending items.</div>
                  </div>
                  <div className="insight-timestamp">THIS WEEK</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: GOVERNANCE FORECAST */}
      <section className="section l2-section forecast-section" id="s-forecast">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">LAYER II — 06 / 06</div>
            <h2 className="section-title">Governance Forecast</h2>
            <p className="section-desc">7-day administrative risk forecast based on pending clearances, contractor deadlines, and coordination dependencies currently active.</p>
          </div>
          <div className="forecast-layout">
            <div className="forecast-overview-panel">
              <div className="fop-label">OVERALL OUTLOOK — NEXT 7 DAYS</div>
              <div className="fop-risk-display">
                <div className="fop-risk-level">MODERATE RISK</div>
                <div className="fop-risk-sub">Conditions manageable with immediate action on pending decisions.</div>
              </div>
              <div className="fop-confidence">
                <span className="fop-conf-label">CONFIDENCE LEVEL</span>
                <div className="fop-conf-bar">
                  <div 
                    className="fop-conf-fill" 
                    style={{ 
                      width: animate ? '82%' : '0%',
                      transition: 'width 1.2s ease-out'
                    }}
                  ></div>
                </div>
                <span className="fop-conf-val">82% confidence</span>
              </div>
              <div className="fop-domains">
                <div className="fop-domain">
                  <span className="fop-domain-name">Infrastructure</span>
                  <span className="fop-domain-badge fop-badge-watch">WATCH</span>
                </div>
                <div className="fop-domain">
                  <span className="fop-domain-name">Healthcare</span>
                  <span className="fop-domain-badge fop-badge-nominal">NOMINAL</span>
                </div>
                <div className="fop-domain">
                  <span className="fop-domain-name">Revenue Operations</span>
                  <span className="fop-domain-badge fop-badge-critical">ELEVATED</span>
                </div>
                <div className="fop-domain">
                  <span className="fop-domain-name">Citizen Services</span>
                  <span className="fop-domain-badge fop-badge-nominal">NOMINAL</span>
                </div>
              </div>
            </div>
            <div className="forecast-cards-grid">
              <div className="forecast-card fc-watch">
                <div className="fc-day-range">DAYS 1 – 3</div>
                <div className="fc-risk-badge fc-risk-watch">MODERATE RISK</div>
                <div className="fc-desc">Revenue Commissioner decision deadline (Friday). If unsigned, MP Nagar contractor penalty clause triggers. Risk exposure escalates.</div>
              </div>
              <div className="forecast-card fc-nominal">
                <div className="fc-day-range">DAYS 4 – 5</div>
                <div className="fc-risk-badge fc-risk-nominal">LOW RISK</div>
                <div className="fc-desc">AIIMS water main maintenance completed. Rescheduled night window yields zero patient disruption. Public service metrics nominal.</div>
              </div>
              <div className="forecast-card fc-watch">
                <div className="fc-day-range">DAYS 6 – 7</div>
                <div className="fc-risk-badge fc-risk-watch">MODERATE RISK</div>
                <div className="fc-desc">Kolar road electrical pole relocation SLA breached. Idle contractor charges continue at ₹80,000/day. Compliance notice required.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
