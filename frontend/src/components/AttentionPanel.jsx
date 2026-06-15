import React, { useState, useEffect } from 'react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function AttentionPanel() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    setDateStr(`${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`);
  }, []);

  return (
    <section className="section attention-section" id="s-attention">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">COORDINATION BRIEF</div>
          <h2 className="section-title">Today's Administrative Attention</h2>
          <p className="section-desc">Priority-ranked items requiring the Collector's personal attention — time-sensitive, department-specific, actionable.</p>
        </div>

        <div className="attention-layout">
          {/* Banner */}
          <div className="attention-brief-banner">
            <div className="abb-left">
              <div className="abb-icon">⬛</div>
              <div>
                <div className="abb-title">Morning Briefing Note</div>
                <div className="abb-sub">Generated at 06:00 hrs — {dateStr} — 5 items require attention today</div>
              </div>
            </div>
            <div className="abb-right">
              <div className="abb-stat"><span className="abb-stat-n abb-critical">2</span><span className="abb-stat-l">Critical</span></div>
              <div className="abb-stat"><span className="abb-stat-n abb-high">2</span><span className="abb-stat-l">High</span></div>
              <div className="abb-stat"><span className="abb-stat-n abb-watch">1</span><span className="abb-stat-l">Watch</span></div>
            </div>
          </div>

          {/* Item list */}
          <div className="attention-items">
            <div className="ai-row ai-critical">
              <div className="ai-number">01</div>
              <div className="ai-priority-stripe ai-stripe-critical"></div>
              <div className="ai-body">
                <div className="ai-top">
                  <span className="ai-badge ai-badge-critical">CRITICAL</span>
                  <span className="ai-dept">Revenue Department</span>
                  <span className="ai-window">⏱ Act before 15:00 hrs today</span>
                </div>
                <div className="ai-headline">Revenue backlog is blocking 11 active projects — clearance overdue by 12 days.</div>
                <div className="ai-detail">Land acquisition counter-signatures are pending at the Revenue Commissioner's office for the MP Nagar Road Widening project. Contractor penalty clause (₹2.3 Cr) activates this Friday. Three downstream utility projects — Energy, Water Supply, and Traffic — are all waiting on this single clearance chain.</div>
                <div className="ai-action-row">
                  <span className="ai-action-label">Recommended Action</span>
                  <span className="ai-action-text">Direct Revenue Commissioner to convene an emergency clearance session today. Assign a nodal officer for daily status tracking until resolution. Responsible: Revenue Commissioner's Office — Resolution Window: 24 hours.</span>
                </div>
              </div>
            </div>

            <div className="ai-row ai-critical">
              <div className="ai-number">02</div>
              <div className="ai-priority-stripe ai-stripe-critical"></div>
              <div className="ai-body">
                <div className="ai-top">
                  <span className="ai-badge ai-badge-critical">CRITICAL</span>
                  <span className="ai-dept">Health Dept + Water Supply</span>
                  <span className="ai-window">⏱ Act before 11:00 hrs today</span>
                </div>
                <div className="ai-headline">Utility conflict near AIIMS — 400+ patients at risk of water supply disruption.</div>
                <div className="ai-detail">Scheduled water main maintenance (08:00–14:00) directly overlaps with AIIMS Bhopal's peak operating hours. OT and ICU supply corridor is at risk. AIIMS administration has formally requested rescheduling to a night window. The Water Supply SE confirms a 23:00–05:00 window is technically feasible but requires hospital backup coordination.</div>
                <div className="ai-action-row">
                  <span className="ai-action-label">Recommended Action</span>
                  <span className="ai-action-text">Reschedule maintenance to 23:00–05:00 window immediately. Water Supply SE to confirm and coordinate with AIIMS backup systems. Responsible: Water Supply Department SE — Resolution Window: 6 hours.</span>
                </div>
              </div>
            </div>

            <div className="ai-row ai-high">
              <div className="ai-number">03</div>
              <div className="ai-priority-stripe ai-stripe-high"></div>
              <div className="ai-body">
                <div className="ai-top">
                  <span className="ai-badge ai-badge-high">HIGH</span>
                  <span className="ai-dept">Energy Department (MPEB)</span>
                  <span className="ai-window">⏱ Issue notice by 12:00 hrs</span>
                </div>
                <div className="ai-headline">Energy utility relocation stalled for 19 days — ₹80,000/day in idle contractor costs.</div>
                <div className="ai-detail">15 MPEB electrical poles in the Kolar Road corridor remain unshifted despite a formal relocation request filed 19 days ago. Field teams have not been deployed. The PWD contractor (M/s Sharma Constructions) has completely halted foundation work. The MPEB Division Engineer cited resource reallocation — this is unacceptable given the delay duration.</div>
                <div className="ai-action-row">
                  <span className="ai-action-label">Recommended Action</span>
                  <span className="ai-action-text">Issue a 48-hour compliance notice to Energy Department Principal Secretary. Schedule site meeting with MPEB Division Engineer within 24 hours. Responsible: Energy Department — Resolution Window: 48 hours.</span>
                </div>
              </div>
            </div>

            <div className="ai-row ai-high">
              <div className="ai-number">04</div>
              <div className="ai-priority-stripe ai-stripe-high"></div>
              <div className="ai-body">
                <div className="ai-top">
                  <span className="ai-badge ai-badge-high">HIGH</span>
                  <span className="ai-dept">Revenue Department</span>
                  <span className="ai-window">⏱ Follow up by 14:00 hrs</span>
                </div>
                <div className="ai-headline">Land compensation pending — MP Nagar Plot 47-B acquisition unsigned for 6 days.</div>
                <div className="ai-detail">Revenue department has not processed compensation documentation for the affected landowner at Plot 47-B in the MP Nagar extension zone. Construction cannot proceed until title transfer is complete. Risk of legal challenge is increasing. Sub-Divisional Officer has not submitted a status update since last Friday.</div>
                <div className="ai-action-row">
                  <span className="ai-action-label">Recommended Action</span>
                  <span className="ai-action-text">Direct SDO to expedite title verification. Revenue SDO to submit status report by 17:00 hrs. Responsible: Sub-Divisional Officer, Revenue — Resolution Window: 72 hours.</span>
                </div>
              </div>
            </div>

            <div className="ai-row ai-watch">
              <div className="ai-number">05</div>
              <div className="ai-priority-stripe ai-stripe-watch"></div>
              <div className="ai-body">
                <div className="ai-top">
                  <span className="ai-badge ai-badge-watch">WATCH</span>
                  <span className="ai-dept">Traffic + Municipal Corporation</span>
                  <span className="ai-window">⏱ Review by 17:00 hrs</span>
                </div>
                <div className="ai-headline">Traffic diversion approval delayed — two active contractor sites cannot proceed.</div>
                <div className="ai-detail">Road diversion sign-off applications from two active contractors have been in queue at the BMC Traffic Cell for 6 working days without response. Transport Department is waiting on Municipal Corporation sign-off to issue diversion orders. This is not yet critical but will become one within 3 days if unresolved.</div>
                <div className="ai-action-row">
                  <span className="ai-action-label">Recommended Action</span>
                  <span className="ai-action-text">BMC Traffic Cell to process pending diversion applications by EOD. Report status to command center. Responsible: BMC Traffic Cell — Resolution Window: 5 days.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
