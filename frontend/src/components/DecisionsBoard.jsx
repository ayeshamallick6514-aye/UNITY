import React from 'react';

export default function DecisionsBoard({ decisions, onIssueDirection, onEscalate, onDefer }) {
  return (
    <section className="section decisions-section" id="s-decisions">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 01 / 07 — ACTIVE DECISIONS</div>
          <h2 className="section-title">Today's Decisions</h2>
          <p className="section-desc">These items cannot move forward without your direction. Each card shows the situation, departments affected, projected impact, and the recommended administrative action.</p>
        </div>

        <div className="decision-cards">
          {/* Card 1 */}
          <article className="decision-card priority-critical" id="dc1">
            <div className="dc-header">
              <div className="dc-badge badge-critical">
                <span className="dc-badge-dot"></span>
                ACTION REQUIRED
              </div>
              <div className="dc-meta">
                <span className="dc-dept">REVENUE DEPT</span>
                <span className="dc-age">12 days pending</span>
              </div>
            </div>
            <h3 className="dc-title">MP Nagar Road Widening</h3>
            <p className="dc-situation">Revenue clearance has not been issued for 12 days. Land acquisition documentation is stalled at the Revenue Commissioner's office pending counter-signature.</p>
            <div className="dc-impacts">
              <div className="dc-impact-label">POTENTIAL IMPACT</div>
              <div className="dc-impact-items">
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  45-day project delay if unresolved by Friday
                </div>
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  ₹2.3 Cr contractor penalty clause activated
                </div>
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  3 downstream utility projects blocked
                </div>
              </div>
            </div>
            <div className="dc-recommendation">
              <span className="dc-rec-label">RECOMMENDED ACTION</span>
              <span className="dc-rec-text">Schedule Revenue review meeting — direct intervention required.</span>
            </div>
            <div className="dc-footer">
              <button 
                className="dc-primary-btn" 
                onClick={() => onIssueDirection('dc1')}
                disabled={decisions.dc1.status === 'authorized'}
              >
                {decisions.dc1.status === 'authorized' ? 'STATUS: AUTHORIZED' : 'Issue Direction'}
              </button>
              <button 
                className="dc-secondary-btn" 
                onClick={() => onEscalate('dc1', 'MP Nagar Road Widening', 'REVENUE DEPT')}
                disabled={decisions.dc1.status !== 'idle'}
                style={decisions.dc1.status === 'escalated' ? { borderColor: 'var(--critical-light)', color: 'var(--critical-light)' } : {}}
              >
                {decisions.dc1.status === 'escalated' ? 'STATUS: ESCALATED' : 'Escalate to Secretary'}
              </button>
              <button 
                className="dc-ghost-btn"
                onClick={() => onDefer('dc1')}
                disabled={decisions.dc1.status !== 'idle'}
                style={decisions.dc1.status === 'deferred' ? { color: 'var(--text-dim)' } : {}}
              >
                {decisions.dc1.status === 'deferred' ? 'STATUS: DEFERRED' : 'Schedule Review'}
              </button>
            </div>
          </article>

          {/* Card 2 */}
          <article className="decision-card priority-critical" id="dc2">
            <div className="dc-header">
              <div className="dc-badge badge-critical">
                <span className="dc-badge-dot"></span>
                ACTION REQUIRED
              </div>
              <div className="dc-meta">
                <span className="dc-dept">HEALTH + WATER</span>
                <span className="dc-age">8 days pending</span>
              </div>
            </div>
            <h3 className="dc-title">AIIMS Pipeline Upgrade</h3>
            <p className="dc-situation">Scheduled water main maintenance overlaps with AIIMS hospital's operational water supply corridor. Maintenance window conflicts with peak hospital operating hours (6AM–10PM daily).</p>
            <div className="dc-impacts">
              <div className="dc-impact-label">POTENTIAL IMPACT</div>
              <div className="dc-impact-items">
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  Hospital service disruption — 400+ daily patients
                </div>
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  OT and ICU water supply risk
                </div>
              </div>
            </div>
            <div className="dc-recommendation">
              <span className="dc-rec-label">RECOMMENDED ACTION</span>
              <span className="dc-rec-text">Reschedule maintenance window to 11PM–4AM. Coordinate with AIIMS administration.</span>
            </div>
            <div className="dc-footer">
              <button 
                className="dc-primary-btn" 
                onClick={() => onIssueDirection('dc2')}
                disabled={decisions.dc2.status === 'authorized'}
              >
                {decisions.dc2.status === 'authorized' ? 'STATUS: AUTHORIZED' : 'Issue Direction'}
              </button>
              <button 
                className="dc-secondary-btn" 
                onClick={() => onEscalate('dc2', 'AIIMS Pipeline Upgrade', 'HEALTH + WATER')}
                disabled={decisions.dc2.status !== 'idle'}
                style={decisions.dc2.status === 'escalated' ? { borderColor: 'var(--critical-light)', color: 'var(--critical-light)' } : {}}
              >
                {decisions.dc2.status === 'escalated' ? 'STATUS: ESCALATED' : 'Escalate to Secretary'}
              </button>
              <button 
                className="dc-ghost-btn"
                onClick={() => onDefer('dc2')}
                disabled={decisions.dc2.status !== 'idle'}
                style={decisions.dc2.status === 'deferred' ? { color: 'var(--text-dim)' } : {}}
              >
                {decisions.dc2.status === 'deferred' ? 'STATUS: DEFERRED' : 'Schedule Review'}
              </button>
            </div>
          </article>

          {/* Card 3 */}
          <article className="decision-card priority-high" id="dc3">
            <div className="dc-header">
              <div className="dc-badge badge-high">
                <span className="dc-badge-dot"></span>
                ACTION REQUIRED
              </div>
              <div className="dc-meta">
                <span className="dc-dept">ENERGY DEPT</span>
                <span className="dc-age">19 days pending</span>
              </div>
            </div>
            <h3 className="dc-title">Energy Utility Relocation</h3>
            <p className="dc-situation">15 electrical poles remain unshifted in the Kolar Road corridor. Energy Department has acknowledged the relocation request but has not dispatched field teams. This is blocking the road widening foundation work.</p>
            <div className="dc-impacts">
              <div className="dc-impact-label">POTENTIAL IMPACT</div>
              <div className="dc-impact-items">
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  Road widening project completely blocked
                </div>
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  Contractor idle time costing ₹80K/day
                </div>
                <div className="dc-impact-item">
                  <span className="dc-impact-bullet">•</span>
                  Traffic signal infrastructure delayed
                </div>
              </div>
            </div>
            <div className="dc-recommendation">
              <span className="dc-rec-label">RECOMMENDED ACTION</span>
              <span className="dc-rec-text">Escalate to Energy Department Principal Secretary. Issue 48-hour compliance notice.</span>
            </div>
            <div className="dc-footer">
              <button 
                className="dc-primary-btn priority-high-btn" 
                onClick={() => onIssueDirection('dc3')}
                disabled={decisions.dc3.status === 'authorized'}
              >
                {decisions.dc3.status === 'authorized' ? 'STATUS: AUTHORIZED' : 'Issue Direction'}
              </button>
              <button 
                className="dc-secondary-btn" 
                onClick={() => onEscalate('dc3', 'Energy Utility Relocation', 'ENERGY DEPT')}
                disabled={decisions.dc3.status !== 'idle'}
                style={decisions.dc3.status === 'escalated' ? { borderColor: 'var(--critical-light)', color: 'var(--critical-light)' } : {}}
              >
                {decisions.dc3.status === 'escalated' ? 'STATUS: ESCALATED' : 'Escalate to Secretary'}
              </button>
              <button 
                className="dc-ghost-btn"
                onClick={() => onDefer('dc3')}
                disabled={decisions.dc3.status !== 'idle'}
                style={decisions.dc3.status === 'deferred' ? { color: 'var(--text-dim)' } : {}}
              >
                {decisions.dc3.status === 'deferred' ? 'STATUS: DEFERRED' : 'Schedule Review'}
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
