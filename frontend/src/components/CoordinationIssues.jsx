import React from 'react';

export default function CoordinationIssues({ decisions, onIssueDirection, onEscalate, onDefer }) {
  return (
    <section className="section coord-issues-section" id="s-pulse">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 02 / 07 — COORDINATION PULSE</div>
          <h2 className="section-title">Active Coordination Issues</h2>
          <p className="section-desc">Projects currently stalled due to inter-department failures. Each card identifies the blocking department, the waiting chain, and the specific administrative action that resolves the stall.</p>
        </div>

        {/* Coordination Issue Cards */}
        <div className="coord-issues-grid">

          {/* Issue 1: MP Nagar */}
          <article className="coord-issue-card cic-critical" id="cic1">
            <div className="cic-header">
              <div className="cic-badge badge-critical">
                <span className="dc-badge-dot"></span>
                BLOCKED
              </div>
              <div className="cic-delay-counter">
                <span className="cic-delay-num">12</span>
                <span className="cic-delay-label">DAYS DELAYED</span>
              </div>
            </div>
            <h3 className="cic-project-name">MP Nagar Road Widening</h3>

            {/* Dependency Flow */}
            <div className="cic-dep-chain">
              <div className="cic-dep-label">DEPENDENCY FLOW</div>
              <div className="cic-dep-flow">
                <div className="cic-dep-node cic-node-active">PWD</div>
                <div className="cic-dep-arrow cic-arrow-blocked">→</div>
                <div className="cic-dep-node cic-node-blocked" title="Currently blocking">
                  Revenue
                  <span className="cic-blocking-indicator">BLOCKING</span>
                </div>
                <div className="cic-dep-arrow cic-arrow-waiting">→</div>
                <div className="cic-dep-node cic-node-waiting">Energy</div>
                <div className="cic-dep-arrow cic-arrow-waiting">→</div>
                <div className="cic-dep-node cic-node-waiting">Water</div>
              </div>
            </div>

            <div className="cic-body">
              <div className="cic-row">
                <span className="cic-meta-label">BLOCKED BY</span>
                <span className="cic-meta-value cic-val-critical">Revenue Department</span>
              </div>
              <div className="cic-row">
                <span className="cic-meta-label">WAITING ON</span>
                <span className="cic-meta-value">12 Days · Land acquisition counter-signature</span>
              </div>
              <div className="cic-row">
                <span className="cic-meta-label">IMPACT</span>
                <span className="cic-meta-value">Energy utility relocation cannot begin</span>
              </div>
            </div>
            <div className="cic-action">
              <span className="cic-action-label">RECOMMENDED ACTION</span>
              <span className="cic-action-text">Schedule Revenue-PWD review meeting — direct intervention required.</span>
            </div>
            <div className="cic-footer">
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

          {/* Issue 2: AIIMS Pipeline */}
          <article className="coord-issue-card cic-critical" id="cic2">
            <div className="cic-header">
              <div className="cic-badge badge-critical">
                <span className="dc-badge-dot"></span>
                BLOCKED
              </div>
              <div className="cic-delay-counter">
                <span className="cic-delay-num">8</span>
                <span className="cic-delay-label">DAYS DELAYED</span>
              </div>
            </div>
            <h3 className="cic-project-name">AIIMS Pipeline Upgrade</h3>

            <div className="cic-dep-chain">
              <div className="cic-dep-label">DEPENDENCY FLOW</div>
              <div className="cic-dep-flow">
                <div className="cic-dep-node cic-node-active">Health</div>
                <div className="cic-dep-arrow cic-arrow-blocked">→</div>
                <div className="cic-dep-node cic-node-blocked" title="Currently blocking">
                  Water Supply
                  <span className="cic-blocking-indicator">BLOCKING</span>
                </div>
                <div className="cic-dep-arrow cic-arrow-waiting">→</div>
                <div className="cic-dep-node cic-node-waiting">AIIMS Admin</div>
              </div>
            </div>

            <div className="cic-body">
              <div className="cic-row">
                <span className="cic-meta-label">BLOCKED BY</span>
                <span className="cic-meta-value cic-val-critical">Water Supply Department</span>
              </div>
              <div className="cic-row">
                <span className="cic-meta-label">WAITING ON</span>
                <span className="cic-meta-value">8 Days · Maintenance window reschedule</span>
              </div>
              <div className="cic-row">
                <span className="cic-meta-label">IMPACT</span>
                <span className="cic-meta-value">400+ patients at daily risk — OT/ICU supply overlap</span>
              </div>
            </div>
            <div className="cic-action">
              <span className="cic-action-label">RECOMMENDED ACTION</span>
              <span className="cic-action-text">Reschedule maintenance to 11PM–4AM. Coordinate directly with AIIMS administration.</span>
            </div>
            <div className="cic-footer">
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

          {/* Issue 3: Kolar Road Energy */}
          <article className="coord-issue-card cic-high" id="cic3">
            <div className="cic-header">
              <div className="cic-badge badge-high">
                <span className="dc-badge-dot"></span>
                STALLED
              </div>
              <div className="cic-delay-counter">
                <span className="cic-delay-num">19</span>
                <span className="cic-delay-label">DAYS DELAYED</span>
              </div>
            </div>
            <h3 className="cic-project-name">Kolar Road Utility Relocation</h3>

            <div className="cic-dep-chain">
              <div className="cic-dep-label">DEPENDENCY FLOW</div>
              <div className="cic-dep-flow">
                <div className="cic-dep-node cic-node-active">PWD</div>
                <div className="cic-dep-arrow cic-arrow-blocked">→</div>
                <div className="cic-dep-node cic-node-blocked" title="Currently blocking">
                  Energy
                  <span className="cic-blocking-indicator">BLOCKING</span>
                </div>
                <div className="cic-dep-arrow cic-arrow-waiting">→</div>
                <div className="cic-dep-node cic-node-waiting">Traffic</div>
                <div className="cic-dep-arrow cic-arrow-waiting">→</div>
                <div className="cic-dep-node cic-node-waiting">Urban Plan</div>
              </div>
            </div>

            <div className="cic-body">
              <div className="cic-row">
                <span className="cic-meta-label">BLOCKED BY</span>
                <span className="cic-meta-value cic-val-high">Energy Department (MPEB)</span>
              </div>
              <div className="cic-row">
                <span className="cic-meta-label">WAITING ON</span>
                <span className="cic-meta-value">19 Days · 15 poles unshifted — field teams not deployed</span>
              </div>
              <div className="cic-row">
                <span className="cic-meta-label">IMPACT</span>
                <span className="cic-meta-value">₹80K/day idle cost · Emergency route narrowed</span>
              </div>
            </div>
            <div className="cic-action">
              <span className="cic-action-label">RECOMMENDED ACTION</span>
              <span className="cic-action-text">Issue 48-hour compliance notice to Energy Department Principal Secretary.</span>
            </div>
            <div className="cic-footer">
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

        {/* Visual Dependency Chain Breakdown */}
        <div className="dep-chain-visual" id="depChainVisual">
          <div className="dcv-header">
            <span className="dcv-label">VISUAL DEPENDENCY CHAIN — MP NAGAR CORRIDOR</span>
            <span className="dcv-subtitle">Chain breaks at Revenue Department · All downstream departments waiting</span>
          </div>
          <div className="dcv-chain">
            <div className="dcv-node dcv-node-origin">
              <div className="dcv-node-dept">PWD</div>
              <div className="dcv-node-status dcv-status-active">INITIATOR</div>
              <div className="dcv-node-desc">Road widening request submitted</div>
            </div>
            <div className="dcv-connector">
              <div className="dcv-arrow-line"></div>
              <div className="dcv-arrow-head">↓</div>
            </div>
            <div className="dcv-node dcv-node-blocked">
              <div className="dcv-node-dept">Revenue</div>
              <div className="dcv-node-status dcv-status-blocked">BLOCKING</div>
              <div className="dcv-node-desc">Land acquisition clearance overdue 12 days</div>
              <div className="dcv-break-indicator">CHAIN BREAKS HERE</div>
            </div>
            <div className="dcv-connector dcv-connector-broken">
              <div className="dcv-arrow-line dcv-line-broken"></div>
              <div className="dcv-arrow-head dcv-head-broken">↓</div>
            </div>
            <div className="dcv-node dcv-node-waiting">
              <div className="dcv-node-dept">Energy</div>
              <div className="dcv-node-status dcv-status-waiting">WAITING</div>
              <div className="dcv-node-desc">Utility relocation cannot begin</div>
            </div>
            <div className="dcv-connector dcv-connector-broken">
              <div className="dcv-arrow-line dcv-line-broken"></div>
              <div className="dcv-arrow-head dcv-head-broken">↓</div>
            </div>
            <div className="dcv-node dcv-node-waiting">
              <div className="dcv-node-dept">Water</div>
              <div className="dcv-node-status dcv-status-waiting">WAITING</div>
              <div className="dcv-node-desc">Pipe diversion blocked by Energy delay</div>
            </div>
            <div className="dcv-connector dcv-connector-broken">
              <div className="dcv-arrow-line dcv-line-broken"></div>
              <div className="dcv-arrow-head dcv-head-broken">↓</div>
            </div>
            <div className="dcv-node dcv-node-terminal">
              <div className="dcv-node-dept">Citizens</div>
              <div className="dcv-node-status dcv-status-impact">IMPACTED</div>
              <div className="dcv-node-desc">800+ residents · Emergency route narrowed</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
