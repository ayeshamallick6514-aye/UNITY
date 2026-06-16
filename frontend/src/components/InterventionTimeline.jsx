import React from 'react';

export default function InterventionTimeline({ decisions }) {
  const isDc1Resolved = decisions?.dc1?.status === 'authorized';
  const isDc2Resolved = decisions?.dc2?.status === 'authorized';
  const isDc3Resolved = decisions?.dc3?.status === 'authorized';
  const allResolved = isDc1Resolved && isDc2Resolved && isDc3Resolved;

  return (
    <section className="section l2-section timeline-section" id="s-timeline">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">LAYER II — TIMELINE</div>
          <h2 className="section-title">Administrative Intervention Timeline</h2>
          <p className="section-desc">Projected consequence chain -- what happens day-by-day if no administrative action is taken from today.</p>
        </div>
        <div className="timeline-layout">
          <div className="timeline-scenario-label" style={allResolved ? { color: 'var(--nominal-light)', borderColor: 'var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>
            {allResolved ? 'CONSEQUENCE CHAIN HALTED — ALL DIRECTIVES AUTHORIZED' : 'PROJECTED CONSEQUENCE CHAIN -- IF NO ACTION IS TAKEN FROM TODAY'}
          </div>
          <div className="timeline-track">
            
            {/* Event 1 */}
            <div className="tl-event tl-past" style={isDc1Resolved ? { opacity: 0.5 } : {}}>
              <div className="tl-marker" style={isDc1Resolved ? { background: 'var(--nominal-bg)', border: '2px solid var(--nominal-light)' } : { backgroundColor: 'var(--bg-card)', border: '2px solid var(--text-dim)' }}>
                {isDc1Resolved ? <span style={{ color: 'var(--nominal-light)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>[OK]</span> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-tertiary)' }}></div>}
              </div>
              <div className="tl-content" style={isDc1Resolved ? { borderLeft: '3px solid var(--nominal-light)' } : {}}>
                <div className="tl-day" style={isDc1Resolved ? { color: 'var(--nominal-light)' } : {}}>Day 1 {isDc1Resolved && '— RESOLVED'}</div>
                <div className="tl-event-title">{isDc1Resolved ? 'Revenue Title Transfer Completed' : 'Revenue Clearance Delay -- MP Nagar'}</div>
                <div className="tl-event-desc">
                  {isDc1Resolved 
                    ? 'Land acquisition files counter-signed. Compensation packages dispatched to Plot 47-B holders.'
                    : 'Land acquisition counter-signature not issued. MP Nagar Road Widening project formally enters coordination failure status. PWD contractor notified of potential hold.'}
                </div>
                <div className="tl-dept-tag" style={isDc1Resolved ? { color: 'var(--nominal-light)', borderColor: 'var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>Revenue Department</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-past" style={isDc1Resolved ? { background: 'var(--nominal-light)' } : {}}></div>
            
            {/* Event 2 */}
            <div className="tl-event tl-past" style={isDc1Resolved ? { opacity: 0.5 } : {}}>
              <div className="tl-marker" style={isDc1Resolved ? { background: 'var(--nominal-bg)', border: '2px solid var(--nominal-light)' } : { backgroundColor: 'var(--bg-card)', border: '2px solid var(--text-dim)' }}>
                {isDc1Resolved ? <span style={{ color: 'var(--nominal-light)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>[OK]</span> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-dim)' }}></div>}
              </div>
              <div className="tl-content" style={isDc1Resolved ? { borderLeft: '3px solid var(--nominal-light)' } : {}}>
                <div className="tl-day" style={isDc1Resolved ? { color: 'var(--nominal-light)' } : {}}>Day 3 {isDc1Resolved && '— RESOLVED'}</div>
                <div className="tl-event-title">{isDc1Resolved ? 'PWD Foundation Works Resumed' : 'PWD Foundation Work Halted'}</div>
                <div className="tl-event-desc">
                  {isDc1Resolved
                    ? 'Contractor M/s Patel Infrastructure mobilized machinery to site. Road widening paving works resumed. Idle burn stopped.'
                    : 'Contractor M/s Patel Infrastructure formally halts work pending Revenue clearance. Idle charges begin at Rs 40,000/day. Workers demobilized from corridor.'}
                </div>
                <div className="tl-dept-tag" style={isDc1Resolved ? { color: 'var(--nominal-light)', borderColor: 'var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>Public Works Department</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-past" style={isDc1Resolved && isDc3Resolved ? { background: 'var(--nominal-light)' } : {}}></div>
            
            {/* Event 3 */}
            <div className="tl-event tl-past" style={isDc3Resolved ? { opacity: 0.5 } : {}}>
              <div className="tl-marker" style={isDc3Resolved ? { background: 'var(--nominal-bg)', border: '2px solid var(--nominal-light)' } : { backgroundColor: 'var(--bg-card)', border: '2px solid var(--text-dim)' }}>
                {isDc3Resolved ? <span style={{ color: 'var(--nominal-light)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>[OK]</span> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--text-dim)' }}></div>}
              </div>
              <div className="tl-content" style={isDc3Resolved ? { borderLeft: '3px solid var(--nominal-light)' } : {}}>
                <div className="tl-day" style={isDc3Resolved ? { color: 'var(--nominal-light)' } : {}}>Day 5 {isDc3Resolved && '— RESOLVED'}</div>
                <div className="tl-event-title">{isDc3Resolved ? 'Transmission Pole Relocation Clearance Dispatched' : 'Energy Department Deployment Stalled'}</div>
                <div className="tl-event-desc">
                  {isDc3Resolved
                    ? '48-hour compliance directive issued to Energy Department. Relay poles relocated by MPEB field engineering crew.'
                    : '15 MPEB poles cannot be relocated -- field teams not deployed. Kolar Road corridor narrows. Emergency vehicle access begins to degrade.'}
                </div>
                <div className="tl-dept-tag" style={isDc3Resolved ? { color: 'var(--nominal-light)', borderColor: 'var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>Energy Department (MPEB)</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-past" style={isDc3Resolved && isDc2Resolved ? { background: 'var(--nominal-light)' } : {}}></div>
            
            {/* Event 4 */}
            <div className="tl-event tl-past" style={isDc2Resolved ? { opacity: 0.5 } : {}}>
              <div className="tl-marker" style={isDc2Resolved ? { background: 'var(--nominal-bg)', border: '2px solid var(--nominal-light)' } : { backgroundColor: 'rgba(200,115,42,0.12)', border: '2px solid var(--high)' }}>
                {isDc2Resolved ? <span style={{ color: 'var(--nominal-light)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>[OK]</span> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--high)' }}></div>}
              </div>
              <div className="tl-content" style={isDc2Resolved ? { borderLeft: '3px solid var(--nominal-light)' } : {}}>
                <div className="tl-day" style={isDc2Resolved ? { color: 'var(--nominal-light)' } : {}}>Day 8 {isDc2Resolved && '— RESOLVED'}</div>
                <div className="tl-event-title">{isDc2Resolved ? 'AIIMS Pipeline Rescheduling Finalized' : 'Water Supply -- AIIMS Conflict Escalates'}</div>
                <div className="tl-event-desc">
                  {isDc2Resolved
                    ? 'Bypass schedule rescheduled to night shift (23:00 - 05:00) with zero patient load overlap. AIIMS objections withdrawn.'
                    : 'Pipeline maintenance conflict escalated by Health Department. Water Supply SE acknowledges but cannot reschedule without executive authorization. AIIMS issues formal written objection.'}
                </div>
                <div className="tl-dept-tag" style={isDc2Resolved ? { color: 'var(--nominal-light)', borderColor: 'var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>Water Supply + Health Department</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-now" style={allResolved ? { background: 'var(--nominal-light)' } : {}}></div>
            
            {/* Event 5 (Today) */}
            <div className="tl-event tl-now" style={allResolved ? { opacity: 0.72 } : {}}>
              <div className="tl-marker" style={allResolved ? { background: 'var(--nominal-bg)', border: '2px solid var(--nominal-light)' } : { backgroundColor: 'rgba(0, 194, 255, 0.15)', border: '2px solid var(--accent-gold)' }}>
                {allResolved ? <span style={{ color: 'var(--nominal-light)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>[OK]</span> : <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'var(--accent-gold)' }}></div>}
              </div>
              <div className="tl-content" style={allResolved ? { borderLeft: '4px solid var(--nominal-light)', background: 'var(--bg-card)', borderColor: 'var(--nominal-border)' } : {}}>
                <div className="tl-day-now" style={allResolved ? { color: 'var(--nominal-light)' } : {}}>
                  {allResolved ? 'TODAY -- Day 12 -- THREAT AVERTED' : 'TODAY -- Day 12 -- Intervention Mandatory'}
                </div>
                <div className="tl-event-title">{allResolved ? 'All Critical Public Services Protected' : 'Hospital Access at Risk -- Citizen Impact Begins'}</div>
                <div className="tl-event-desc">
                  {allResolved
                    ? 'All three coordination threats resolved successfully. School routes remain clear, emergency hospital water line operates without shutdown, and Kolar corridor traffic restrictions are cleared.'
                    : 'Emergency route narrowed. AIIMS water supply at risk -- 400+ daily patients. 2,400+ students face disruption on school transport routes. Revenue contractor penalty clause activates Friday. Administrative intervention is now mandatory.'}
                </div>
                <span className={`tl-dept-tag ${allResolved ? 'badge-low-sm' : 'tl-tag-critical'}`}>
                  {allResolved ? 'NOMINAL COORDINATION FEED' : 'INTERVENTION REQUIRED NOW -- Window closes in 3 days'}
                </span>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-projected" style={allResolved ? { borderLeftStyle: 'solid', borderLeftColor: 'var(--nominal-border)' } : {}}></div>
            
            {/* Event 6 */}
            <div className="tl-event tl-projected" style={allResolved ? { opacity: 0.4 } : {}}>
              <div className="tl-marker" style={allResolved ? { background: 'var(--nominal-bg)', border: '2px solid var(--nominal-light)' } : { border: '2px dashed var(--critical-border)' }}>
                {allResolved ? <span style={{ color: 'var(--nominal-light)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>[OK]</span> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--critical-border)' }}></div>}
              </div>
              <div className="tl-content" style={allResolved ? { borderLeft: '1px solid var(--nominal-border)', borderStyle: 'solid', background: 'transparent' } : {}}>
                <div className="tl-day-projected" style={allResolved ? { color: 'var(--nominal-light)' } : {}}>Projected -- Day 15</div>
                <div className="tl-event-title">{allResolved ? 'Contractor Penalty Waiver Active' : 'Contractor Penalty Clause Activated'}</div>
                <div className="tl-event-desc">
                  {allResolved
                    ? 'District Collector directives logged before Friday threshold. Penalty waiver activated, saving ₹2.3 Cr in avoidable public overruns.'
                    : 'MP Nagar contractor penalty clause (Clause 14.3) formally activates. Government incurs Rs 2.3 Cr avoidable liability. Extension agreements must be renegotiated with 3 contractors.'}
                </div>
                <span className={`tl-dept-tag ${allResolved ? 'badge-low-sm' : 'tl-tag-projected'}`}>
                  {allResolved ? '₹0 Avoidable Penalty' : 'Rs 2.3 Cr Avoidable Liability'}
                </span>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-projected" style={allResolved ? { borderLeftStyle: 'solid', borderLeftColor: 'var(--nominal-border)' } : {}}></div>
            
            {/* Event 7 */}
            <div className="tl-event tl-projected" style={allResolved ? { opacity: 0.4 } : {}}>
              <div className="tl-marker" style={allResolved ? { background: 'var(--nominal-bg)', border: '2px solid var(--nominal-light)' } : { border: '2px dashed var(--critical-border)' }}>
                {allResolved ? <span style={{ color: 'var(--nominal-light)', fontSize: '9px', fontFamily: 'var(--font-mono)' }}>[OK]</span> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--critical-border)' }}></div>}
              </div>
              <div className="tl-content" style={allResolved ? { borderLeft: '1px solid var(--nominal-border)', borderStyle: 'solid', background: 'transparent' } : {}}>
                <div className="tl-day-projected" style={allResolved ? { color: 'var(--nominal-light)' } : {}}>Projected -- Day 20</div>
                <div className="tl-event-title">{allResolved ? 'Urban Infrastructure Stabilized' : 'Full System Failure -- 5 Departments Non-Functional'}</div>
                <div className="tl-event-desc">
                  {allResolved
                    ? 'Municipal sectors fully synchronized. Secondary departments (Traffic, Transport, PHE) operational without delay propagation.'
                    : 'Hospital water supply disruption during peak hours. Energy stall triggers Traffic and Transport delays. PHE and Urban Planning enter failure state. Estimated additional Rs 1.4 Cr in penalty exposure.'}
                </div>
                <span className={`tl-dept-tag ${allResolved ? 'badge-low-sm' : 'tl-tag-projected'}`}>
                  {allResolved ? 'All Sectors Stable' : '5 Departments Failing -- Citizen Services Disrupted'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="timeline-action-banner" style={allResolved ? { borderLeftColor: 'var(--nominal-light)', background: 'linear-gradient(135deg, var(--nominal-bg) 0%, rgba(14,16,22,0) 100%)', borderColor: 'var(--nominal-border)' } : {}}>
            <div className="tab-icon" style={allResolved ? { color: 'var(--nominal-light)' } : {}}>{allResolved ? '[RESOLVED]' : '[ACTION]'}</div>
            <div>
              <div className="tab-headline" style={allResolved ? { color: 'var(--nominal-light)' } : {}}>
                {allResolved ? 'All critical interventions completed' : 'Window for action: Today -- before 17:00 hrs'}
              </div>
              <div className="tab-sub">
                {allResolved
                  ? 'All pending executive directives have been issued. The consequence chain has been halted, protecting citizen services and eliminating ₹3.7 Cr of avoidable overruns.'
                  : 'All three critical interventions can be resolved today. After Friday, contractor penalty clauses activate and citizen impact becomes unavoidable. The cost of action now is zero. The cost of inaction is Rs 3.7 Cr and irreversible public disruption.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
