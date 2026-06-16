import React from 'react';

export default function ExecDecisions({ decisions, onIssueDirection, onEscalate, onDefer }) {
  return (
    <section className="section l2-section decisions-board-section" id="s-exec-decisions">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">LAYER II — SECTION 01 / 06 — INTERVENTIONS</div>
          <h2 className="section-title">Today's Decisions</h2>
          <p className="section-desc">Three interventions require your direct authorization today. No subordinate can resolve these.</p>
        </div>
        <div className="exec-decision-board">

          {/* Decision 1 */}
          <article className="exec-card exec-critical" id="ed1">
            <div className="ec-priority-spine"></div>
            <div className="ec-body">
              <div className="ec-top-row">
                <div className="ec-badge ec-badge-critical">
                  <span className="ec-badge-pulse"></span>
                  ACTION REQUIRED
                </div>
                <div className="ec-meta-cluster">
                  <span className="ec-pending-label">12 DAYS PENDING</span>
                </div>
              </div>
              <h3 className="ec-title">MP Nagar Road Widening</h3>
              <p className="ec-situation">Revenue clearance overdue. Land acquisition documentation stalled at Revenue Commissioner's office — counter-signature not issued.</p>
              <div className="ec-data-grid">
                <div className="ec-data-item">
                  <span className="ec-data-label">AFFECTED DEPARTMENTS</span>
                  <span className="ec-data-value">PWD, Revenue</span>
                </div>
                <div className="ec-data-item">
                  <span className="ec-data-label">POTENTIAL DELAY</span>
                  <span className="ec-data-value ec-value-critical">45 Days</span>
                </div>
                <div className="ec-data-item">
                  <span className="ec-data-label">PRIORITY</span>
                  <span className="ec-data-value ec-value-critical">CRITICAL</span>
                </div>
              </div>
              <div className="ec-recommended">
                <span className="ec-rec-label">RECOMMENDED ACTION</span>
                <span className="ec-rec-text">Schedule Revenue review meeting — direct intervention required.</span>
              </div>
              <div className="ec-footer">
                <button 
                  className="ec-review-btn" 
                  onClick={() => onIssueDirection('dc1')}
                  disabled={decisions.dc1.status === 'authorized'}
                >
                  {decisions.dc1.status === 'authorized' ? 'STATUS: AUTHORIZED' : 'Review & Authorize'}
                </button>
                <button 
                  className="ec-escalate-btn" 
                  onClick={() => onEscalate('dc1', 'MP Nagar Road Widening', 'REVENUE DEPT')}
                  disabled={decisions.dc1.status !== 'idle'}
                  style={decisions.dc1.status === 'escalated' ? { borderColor: 'var(--critical-light)', color: 'var(--critical-light)' } : {}}
                >
                  {decisions.dc1.status === 'escalated' ? 'STATUS: ESCALATED' : 'Escalate'}
                </button>
                <button 
                  className="ec-defer-btn"
                  onClick={() => onDefer('dc1')}
                  disabled={decisions.dc1.status !== 'idle'}
                  style={decisions.dc1.status === 'deferred' ? { color: 'var(--text-dim)' } : {}}
                >
                  {decisions.dc1.status === 'deferred' ? 'STATUS: DEFERRED' : 'Schedule Review'}
                </button>
              </div>
            </div>
          </article>

          {/* Decision 2 */}
          <article className="exec-card exec-critical" id="ed2">
            <div className="ec-priority-spine"></div>
            <div className="ec-body">
              <div className="ec-top-row">
                <div className="ec-badge ec-badge-critical">
                  <span className="ec-badge-pulse"></span>
                  ACTION REQUIRED
                </div>
                <div className="ec-meta-cluster">
                  <span className="ec-pending-label">8 DAYS PENDING</span>
                </div>
              </div>
              <h3 className="ec-title">AIIMS Pipeline Maintenance Conflict</h3>
              <p className="ec-situation">Scheduled maintenance window overlaps with AIIMS peak operating hours. Hospital water supply corridor at risk during working hours.</p>
              <div className="ec-data-grid">
                <div className="ec-data-grid">
                  <div className="ec-data-item">
                    <span className="ec-data-label">AFFECTED DEPARTMENTS</span>
                    <span className="ec-data-value">Health, Water Supply</span>
                  </div>
                  <div className="ec-data-item">
                    <span className="ec-data-label">POTENTIAL DELAY</span>
                    <span className="ec-data-value ec-value-critical">Patient Risk</span>
                  </div>
                  <div className="ec-data-item">
                    <span className="ec-data-label">PRIORITY</span>
                    <span className="ec-data-value ec-value-critical">CRITICAL</span>
                  </div>
                </div>
              </div>
              <div className="ec-recommended">
                <span className="ec-rec-label">RECOMMENDED ACTION</span>
                <span className="ec-rec-text">Reschedule maintenance to 11PM–4AM. Coordinate directly with AIIMS administration.</span>
              </div>
              <div className="ec-footer">
                <button 
                  className="ec-review-btn" 
                  onClick={() => onIssueDirection('dc2')}
                  disabled={decisions.dc2.status === 'authorized'}
                >
                  {decisions.dc2.status === 'authorized' ? 'STATUS: AUTHORIZED' : 'Review & Authorize'}
                </button>
                <button 
                  className="ec-escalate-btn" 
                  onClick={() => onEscalate('dc2', 'AIIMS Pipeline Maintenance', 'HEALTH + WATER')}
                  disabled={decisions.dc2.status !== 'idle'}
                  style={decisions.dc2.status === 'escalated' ? { borderColor: 'var(--critical-light)', color: 'var(--critical-light)' } : {}}
                >
                  {decisions.dc2.status === 'escalated' ? 'STATUS: ESCALATED' : 'Escalate'}
                </button>
                <button 
                  className="ec-defer-btn"
                  onClick={() => onDefer('dc2')}
                  disabled={decisions.dc2.status !== 'idle'}
                  style={decisions.dc2.status === 'deferred' ? { color: 'var(--text-dim)' } : {}}
                >
                  {decisions.dc2.status === 'deferred' ? 'STATUS: DEFERRED' : 'Schedule Review'}
                </button>
              </div>
            </div>
          </article>

          {/* Decision 3 */}
          <article className="exec-card exec-high" id="ed3">
            <div className="ec-priority-spine ec-spine-high"></div>
            <div className="ec-body">
              <div className="ec-top-row">
                <div className="ec-badge ec-badge-high">
                  <span className="ec-badge-pulse ec-pulse-high"></span>
                  HIGH PRIORITY
                </div>
                <div className="ec-meta-cluster">
                  <span className="ec-pending-label">19 DAYS PENDING</span>
                </div>
              </div>
              <h3 className="ec-title">Kolar Road Utility Relocation</h3>
              <p className="ec-situation">15 MPEB electrical poles unshifted despite 19-day formal request. Field teams not deployed. Road foundation work halted.</p>
              <div className="ec-data-grid">
                <div className="ec-data-item">
                  <span className="ec-data-label">AFFECTED DEPARTMENTS</span>
                  <span className="ec-data-value">PWD, Energy</span>
                </div>
                <div className="ec-data-item">
                  <span className="ec-data-label">DAILY IDLE COST</span>
                  <span className="ec-data-value ec-value-high">₹80,000/day</span>
                </div>
                <div className="ec-data-item">
                  <span className="ec-data-label">PRIORITY</span>
                  <span className="ec-data-value ec-value-high">HIGH</span>
                </div>
              </div>
              <div className="ec-recommended">
                <span className="ec-rec-label">RECOMMENDED ACTION</span>
                <span className="ec-rec-text">Issue 48-hour compliance notice to Energy Department Principal Secretary.</span>
              </div>
              <div className="ec-footer">
                <button 
                  className="ec-review-btn ec-review-high" 
                  onClick={() => onIssueDirection('dc3')}
                  disabled={decisions.dc3.status === 'authorized'}
                >
                  {decisions.dc3.status === 'authorized' ? 'STATUS: AUTHORIZED' : 'Review & Authorize'}
                </button>
                <button 
                  className="ec-escalate-btn" 
                  onClick={() => onEscalate('dc3', 'Kolar Road Utility Relocation', 'ENERGY DEPT')}
                  disabled={decisions.dc3.status !== 'idle'}
                  style={decisions.dc3.status === 'escalated' ? { borderColor: 'var(--critical-light)', color: 'var(--critical-light)' } : {}}
                >
                  {decisions.dc3.status === 'escalated' ? 'STATUS: ESCALATED' : 'Escalate'}
                </button>
                <button 
                  className="ec-defer-btn"
                  onClick={() => onDefer('dc3')}
                  disabled={decisions.dc3.status !== 'idle'}
                  style={decisions.dc3.status === 'deferred' ? { color: 'var(--text-dim)' } : {}}
                >
                  {decisions.dc3.status === 'deferred' ? 'STATUS: DEFERRED' : 'Schedule Review'}
                </button>
              </div>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
