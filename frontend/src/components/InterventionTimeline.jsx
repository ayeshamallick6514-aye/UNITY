import React from 'react';

export default function InterventionTimeline() {
  return (
    <section className="section l2-section timeline-section" id="s-timeline">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">LAYER II — TIMELINE</div>
          <h2 className="section-title">Administrative Intervention Timeline</h2>
          <p className="section-desc">Projected consequence chain -- what happens day-by-day if no administrative action is taken from today.</p>
        </div>
        <div className="timeline-layout">
          <div className="timeline-scenario-label">PROJECTED CONSEQUENCE CHAIN -- IF NO ACTION IS TAKEN FROM TODAY</div>
          <div className="timeline-track">
            
            <div className="tl-event tl-past">
              <div className="tl-marker tl-marker-origin"></div>
              <div className="tl-content">
                <div className="tl-day">Day 1</div>
                <div className="tl-event-title">Revenue Clearance Delay -- MP Nagar</div>
                <div className="tl-event-desc">Land acquisition counter-signature not issued. MP Nagar Road Widening project formally enters coordination failure status. PWD contractor notified of potential hold.</div>
                <div className="tl-dept-tag">Revenue Department</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-past"></div>
            
            <div className="tl-event tl-past">
              <div className="tl-marker tl-marker-past"></div>
              <div className="tl-content">
                <div className="tl-day">Day 3</div>
                <div className="tl-event-title">PWD Foundation Work Halted</div>
                <div className="tl-event-desc">Contractor M/s Patel Infrastructure formally halts work pending Revenue clearance. Idle charges begin at Rs 40,000/day. Workers demobilized from corridor.</div>
                <div className="tl-dept-tag">Public Works Department</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-past"></div>
            
            <div className="tl-event tl-past">
              <div className="tl-marker tl-marker-past"></div>
              <div className="tl-content">
                <div className="tl-day">Day 5</div>
                <div className="tl-event-title">Energy Department Deployment Stalled</div>
                <div className="tl-event-desc">15 MPEB poles cannot be relocated -- field teams not deployed. Kolar Road corridor narrows. Emergency vehicle access begins to degrade.</div>
                <div className="tl-dept-tag">Energy Department (MPEB)</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-past"></div>
            
            <div className="tl-event tl-past">
              <div className="tl-marker tl-marker-high"></div>
              <div className="tl-content">
                <div className="tl-day">Day 8</div>
                <div className="tl-event-title">Water Supply -- AIIMS Conflict Escalates</div>
                <div className="tl-event-desc">Pipeline maintenance conflict escalated by Health Department. Water Supply SE acknowledges but cannot reschedule without executive authorization. AIIMS issues formal written objection.</div>
                <div className="tl-dept-tag">Water Supply + Health Department</div>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-now"></div>
            
            <div className="tl-event tl-now">
              <div className="tl-marker tl-marker-now"></div>
              <div className="tl-content">
                <div className="tl-day-now">TODAY -- Day 12 -- Intervention Mandatory</div>
                <div className="tl-event-title">Hospital Access at Risk -- Citizen Impact Begins</div>
                <div className="tl-event-desc">Emergency route narrowed. AIIMS water supply at risk -- 400+ daily patients. 2,400+ students face disruption on school transport routes. Revenue contractor penalty clause activates Friday. Administrative intervention is now mandatory.</div>
                <span className="tl-dept-tag tl-tag-critical">INTERVENTION REQUIRED NOW -- Window closes in 3 days</span>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-projected"></div>
            
            <div className="tl-event tl-projected">
              <div className="tl-marker tl-marker-projected"></div>
              <div className="tl-content">
                <div className="tl-day-projected">Projected -- Day 15</div>
                <div className="tl-event-title">Contractor Penalty Clause Activated</div>
                <div className="tl-event-desc">MP Nagar contractor penalty clause (Clause 14.3) formally activates. Government incurs Rs 2.3 Cr avoidable liability. Extension agreements must be renegotiated with 3 contractors.</div>
                <span className="tl-dept-tag tl-tag-projected">Rs 2.3 Cr Avoidable Liability</span>
              </div>
            </div>
            
            <div className="tl-connector tl-conn-projected"></div>
            
            <div className="tl-event tl-projected">
              <div className="tl-marker tl-marker-projected"></div>
              <div className="tl-content">
                <div className="tl-day-projected">Projected -- Day 20</div>
                <div className="tl-event-title">Full System Failure -- 5 Departments Non-Functional</div>
                <div className="tl-event-desc">Hospital water supply disruption during peak hours. Energy stall triggers Traffic and Transport delays. PHE and Urban Planning enter failure state. Estimated additional Rs 1.4 Cr in penalty exposure.</div>
                <span className="tl-dept-tag tl-tag-projected">5 Departments Failing -- Citizen Services Disrupted</span>
              </div>
            </div>
          </div>
          
          <div className="timeline-action-banner">
            <div className="tab-icon">⚡</div>
            <div>
              <div className="tab-headline">Window for action: Today -- before 17:00 hrs</div>
              <div className="tab-sub">All three critical interventions can be resolved today. After Friday, contractor penalty clauses activate and citizen impact becomes unavoidable. The cost of action now is zero. The cost of inaction is Rs 3.7 Cr and irreversible public disruption.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
