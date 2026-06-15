import React, { useState, useEffect } from 'react';

export default function InsightsForecast({ decisions }) {
  const [tickerIdx, setTickerIdx] = useState(0);
  const [animate, setAnimate] = useState(false);

  const isDc1Resolved = decisions?.dc1?.status === 'authorized';
  const isDc2Resolved = decisions?.dc2?.status === 'authorized';
  const isDc3Resolved = decisions?.dc3?.status === 'authorized';
  const allResolved = isDc1Resolved && isDc2Resolved && isDc3Resolved;

  const tickerTexts = [
    isDc1Resolved 
      ? 'Revenue clearance APPROVED for MP Nagar corridor. PWD paving crew mobilized to site.' 
      : 'Revenue clearance queue: 42 pending cases — up from 36 last month. This is the primary bottleneck across 11 active projects.',
    isDc3Resolved
      ? 'Kolar Road utility relocation: 15 electrical transmission poles relocated. Emergency ambulance access restored.'
      : 'MPEB pole relocation delay: 19 days elapsed. Contractor penalty warning activates in 3 days.',
    isDc2Resolved
      ? 'AIIMS water main conflict: Rescheduling to night window (23:00 - 05:00) resolved with zero patient disruption forecast.'
      : 'AIIMS water main conflict: Pipeline scheduling conflict active. High risk of patient service disruption if rescheduled during peak hours.'
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % tickerTexts.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tickerTexts]);

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
                <span className={`it-dot ${allResolved ? 'it-dot-nominal' : 'it-dot-critical'}`}></span>
                <span className="it-text" id="insightsTickerText" style={{ transition: 'opacity 0.5s ease' }}>
                  {tickerTexts[tickerIdx]}
                </span>
              </div>
            </div>
            <div className="insights-grid" id="insightsGrid">
              
              <div className={`insight-card ${isDc1Resolved ? 'insight-positive' : 'insight-warning'}`}>
                <div className={`insight-card-bar ${isDc1Resolved ? 'insight-bar-positive' : ''}`}></div>
                <div className="insight-card-content">
                  <div className="insight-icon">{isDc1Resolved ? '✓' : '↑'}</div>
                  <div className="insight-body">
                    <div className="insight-headline">
                      {isDc1Resolved 
                        ? 'MP Nagar land compensation clearance approved by Revenue Dept.' 
                        : 'Revenue clearance backlog has grown — 42 pending cases, up from 36 last month.'}
                    </div>
                    <div className="insight-sub">
                      {isDc1Resolved
                        ? 'Dist. Collector authorized Plot 47-B file. Backlog cleared for critical road expansion segment.'
                        : '42 pending cases — up from 36 last month. Primary blocker across 11 dependent projects.'}
                    </div>
                  </div>
                  <div className="insight-timestamp">TODAY</div>
                </div>
              </div>

              <div className={`insight-card ${allResolved ? 'insight-positive' : 'insight-critical'}`}>
                <div className={`insight-card-bar ${allResolved ? 'insight-bar-positive' : 'insight-bar-critical'}`}></div>
                <div className="insight-card-content">
                  <div className={`insight-icon ${allResolved ? 'insight-icon-positive' : 'insight-icon-critical'}`}>{allResolved ? '✓' : '⚠'}</div>
                  <div className="insight-body">
                    <div className="insight-headline">
                      {allResolved 
                        ? 'Three high-risk coordination conflicts successfully stabilized.'
                        : 'Three projects entered high-risk status this week.'}
                    </div>
                    <div className="insight-sub">
                      {allResolved
                        ? 'MP Nagar, AIIMS pipeline, and Kolar corridor cleared of bottlenecks. Financial liability reduced to zero.'
                        : 'MP Nagar, AIIMS pipeline, and Kolar corridor crossed risk threshold. Intervention window is narrowing.'}
                    </div>
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
                    <div className="insight-headline">
                      {isDc2Resolved 
                        ? 'AIIMS healthcare corridor water supply access secured.' 
                        : 'No healthcare disruptions predicted in the next 7 days.'}
                    </div>
                    <div className="insight-sub">
                      {isDc2Resolved
                        ? 'Water Supply SE rescheduled pipeline bypass to night shift. Zero patient load conflict.'
                        : 'AIIMS conflict is manageable with rescheduling. Health & Sanitation coordination response within the 5-day standard.'}
                    </div>
                  </div>
                  <div className="insight-timestamp">FORECAST</div>
                </div>
              </div>

              <div className={`insight-card ${isDc1Resolved && isDc3Resolved ? 'insight-positive' : 'insight-warning'}`}>
                <div className={`insight-card-bar ${isDc1Resolved && isDc3Resolved ? 'insight-bar-positive' : ''}`}></div>
                <div className="insight-card-content">
                  <div className="insight-icon">≡</div>
                  <div className="insight-body">
                    <div className="insight-headline">
                      {isDc1Resolved && isDc3Resolved
                        ? 'Escalation response time stabilized across Revenue and Energy departments.'
                        : 'Revenue and Energy departments show response lag exceeding 8 working days — above acceptable standard.'}
                    </div>
                    <div className="insight-sub">
                      {isDc1Resolved && isDc3Resolved
                        ? 'Direct Collector executive intervention has cleared the pending files and relocated stalled poles.'
                        : 'Revenue: 12-day average response lag. Energy: 19-day unresolved pole relocation. Both require direct administrative escalation.'}
                    </div>
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
                <div className="fop-risk-level" style={allResolved ? { color: 'var(--nominal-light)' } : {}}>
                  {allResolved ? 'NOMINAL / LOW RISK' : 'MODERATE RISK'}
                </div>
                <div className="fop-risk-sub">
                  {allResolved
                    ? 'All critical clearances authorized. City infrastructure corridors stable.'
                    : 'Conditions manageable with immediate action on pending decisions.'}
                </div>
              </div>
              <div className="fop-confidence">
                <span className="fop-conf-label">CONFIDENCE LEVEL</span>
                <div className="fop-conf-bar">
                  <div 
                    className="fop-conf-fill" 
                    style={{ 
                      width: animate ? '82%' : '0%',
                      background: allResolved ? 'var(--nominal-light)' : 'var(--accent-gold)',
                      transition: 'width 1.2s ease-out'
                    }}
                  ></div>
                </div>
                <span className="fop-conf-val" style={allResolved ? { color: 'var(--nominal-light)' } : {}}>82% confidence</span>
              </div>
              <div className="fop-domains">
                <div className="fop-domain">
                  <span className="fop-domain-name">Infrastructure</span>
                  <span className={`fop-domain-badge ${isDc3Resolved ? 'fop-badge-nominal' : 'fop-badge-watch'}`}>
                    {isDc3Resolved ? 'NOMINAL' : 'WATCH'}
                  </span>
                </div>
                <div className="fop-domain">
                  <span className="fop-domain-name">Healthcare</span>
                  <span className={`fop-domain-badge ${isDc2Resolved ? 'fop-badge-nominal' : 'fop-badge-watch'}`}>
                    {isDc2Resolved ? 'NOMINAL' : 'WATCH'}
                  </span>
                </div>
                <div className="fop-domain">
                  <span className="fop-domain-name">Revenue Operations</span>
                  <span className={`fop-domain-badge ${isDc1Resolved ? 'fop-badge-nominal' : 'fop-badge-critical'}`}>
                    {isDc1Resolved ? 'NOMINAL' : 'ELEVATED'}
                  </span>
                </div>
                <div className="fop-domain">
                  <span className="fop-domain-name">Citizen Services</span>
                  <span className={`fop-domain-badge ${allResolved ? 'fop-badge-nominal' : 'fop-badge-nominal'}`}>NOMINAL</span>
                </div>
              </div>
            </div>
            <div className="forecast-cards-grid">
              
              {/* Card 1 */}
              <div className={`forecast-card ${isDc1Resolved ? 'fc-nominal' : 'fc-watch'}`}>
                <div className="fc-day-range">DAYS 1 – 3</div>
                <div className={`fc-risk-badge ${isDc1Resolved ? 'fc-risk-nominal' : 'fc-risk-watch'}`}>
                  {isDc1Resolved ? 'LOW RISK' : 'MODERATE RISK'}
                </div>
                <div className="fc-desc">
                  {isDc1Resolved
                    ? 'MP Nagar land transfer finalized. Road widening excavation cleared. Contractor idle penalty averted.'
                    : 'Revenue Commissioner decision deadline (Friday). If unsigned, MP Nagar contractor penalty clause triggers. Risk exposure escalates.'}
                </div>
              </div>

              {/* Card 2 */}
              <div className={`forecast-card ${isDc2Resolved ? 'fc-nominal' : 'fc-watch'}`}>
                <div className="fc-day-range">DAYS 4 – 5</div>
                <div className={`fc-risk-badge ${isDc2Resolved ? 'fc-risk-nominal' : 'fc-risk-watch'}`}>
                  {isDc2Resolved ? 'LOW RISK' : 'MODERATE RISK'}
                </div>
                <div className="fc-desc">
                  {isDc2Resolved
                    ? 'AIIMS water main maintenance completed. Rescheduled night window yields zero patient disruption. Public service metrics nominal.'
                    : 'AIIMS water main pipeline scheduling conflict unresolved. High risk of intensive care unit backup water disruptions.'}
                </div>
              </div>

              {/* Card 3 */}
              <div className={`forecast-card ${isDc3Resolved ? 'fc-nominal' : 'fc-watch'}`}>
                <div className="fc-day-range">DAYS 6 – 7</div>
                <div className={`fc-risk-badge ${isDc3Resolved ? 'fc-risk-nominal' : 'fc-risk-watch'}`}>
                  {isDc3Resolved ? 'LOW RISK' : 'MODERATE RISK'}
                </div>
                <div className="fc-desc">
                  {isDc3Resolved
                    ? 'Kolar road electrical pole relocation completed. Road widening resumed. Traffic cell diversion signs cleared.'
                    : 'Kolar road electrical pole relocation SLA breached. Idle contractor charges continue at ₹80,000/day. Compliance notice required.'}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
