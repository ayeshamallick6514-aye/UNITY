import React, { useState, useEffect } from 'react';

function AnimatedNumber({ value, duration = 1200 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = null;
    const end = parseInt(value, 10);
    if (isNaN(end)) {
      setCurrent(value);
      return;
    }

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const pct = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setCurrent(Math.floor(ease * end));
      if (progress < duration) {
        window.requestAnimationFrame(step);
      } else {
        setCurrent(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const displayVal = typeof current === 'number' 
    ? (current >= 1000 ? current.toLocaleString('en-IN') : current)
    : current;

  return <span>{displayVal}</span>;
}

export default function PublicServiceImpact() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section l2-section citizen-impact-section" id="s-citizen">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">LAYER II — 02 / 06</div>
          <h2 className="section-title">Critical Public Service Impact</h2>
          <p className="section-desc">Named public services and infrastructure at risk from unresolved inter-department conflicts. Healthcare access, emergency routes, school transport, and commercial zones are directly affected by today's administrative decisions.</p>
        </div>
        <div className="citizen-layout">
          <div className="citizen-summary-block">
            <div className="csb-label">EXECUTIVE SUMMARY</div>
            <p className="csb-text">Current unresolved conflicts may affect healthcare access, traffic movement, and public services across multiple city zones. Immediate resolution of the three pending decisions will protect these citizens from operational disruption.</p>
            <div className="csb-urgency-bar">
              <span className="csb-urgency-label">RESOLUTION URGENCY</span>
              <div className="csb-urgency-track">
                <div 
                  className="csb-urgency-fill" 
                  style={{ 
                    width: animate ? '78%' : '0%',
                    transition: 'width 1.2s ease-out'
                  }}
                ></div>
              </div>
              <span className="csb-urgency-value">HIGH</span>
            </div>
          </div>
          <div className="citizen-metrics-grid">
            <div className="cm-card cm-card-primary">
              <div className="cm-icon">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="8" r="5" stroke="#e8e0d0" strokeWidth="1.5"/>
                  <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#e8e0d0" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="cm-number">
                <AnimatedNumber value={3750} />
              </div>
              <div className="cm-label">Potentially Affected Citizens</div>
            </div>
            <div className="cm-card">
              <div className="cm-icon cm-icon-red">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="3" width="20" height="22" rx="2" stroke="#d4521f" strokeWidth="1.5"/>
                  <line x1="14" y1="8" x2="14" y2="15" stroke="#d4521f" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="10" y1="11.5" x2="18" y2="11.5" stroke="#d4521f" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="cm-number cm-number-critical">
                <AnimatedNumber value={2} />
              </div>
              <div className="cm-label">Hospitals at Risk</div>
              <div className="cm-sublabel">AIIMS + JP Hospital corridors</div>
            </div>
            <div className="cm-card">
              <div className="cm-icon cm-icon-amber">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <polygon points="14,2 26,22 2,22" stroke="#c8a84b" strokeWidth="1.5" fill="none"/>
                  <line x1="14" y1="10" x2="14" y2="17" stroke="#c8a84b" strokeWidth="2"/>
                  <circle cx="14" cy="20" r="1" fill="#c8a84b"/>
                </svg>
              </div>
              <div className="cm-number cm-number-amber">
                <AnimatedNumber value={4} />
              </div>
              <div className="cm-label">Schools Disrupted</div>
              <div className="cm-sublabel">2,400+ students affected</div>
            </div>
            <div className="cm-card">
              <div className="cm-icon cm-icon-red">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" stroke="#d4521f" strokeWidth="1.5"/>
                  <line x1="14" y1="4" x2="14" y2="24" stroke="#d4521f" strokeWidth="1"/>
                  <line x1="4" y1="14" x2="24" y2="14" stroke="#d4521f" strokeWidth="1"/>
                  <circle cx="14" cy="14" r="3" fill="#d4521f"/>
                </svg>
              </div>
              <div className="cm-number cm-number-critical">
                <AnimatedNumber value={1} />
              </div>
              <div className="cm-label">Emergency Route Affected</div>
              <div className="cm-sublabel">Ambulance response at risk</div>
            </div>
          </div>
        </div>

        {/* Critical Public Service Impact */}
        <div className="cps-impact-section">
          <div className="cps-header">CRITICAL PUBLIC SERVICE IMPACT -- BY LOCATION</div>
          <div className="cps-grid">
            <div className="cps-card cps-hospital">
              <div className="cps-card-spine"></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">AIIMS BHOPAL CORRIDOR</div>
                <div className="cps-card-title">Hospital Water Supply at Risk</div>
                <div className="cps-card-desc">Scheduled pipeline maintenance overlaps with peak OT and ICU operating hours. 400+ daily patients depend on uninterrupted water supply. Emergency surgery schedules are at risk during any maintenance window before 22:00.</div>
                <div className="cps-responsible">Blocking Dept: Water Supply Dept (schedule not rescheduled)</div>
                <div className="cps-action-needed">Action Required: Convene Health-Water coordination call today. Reschedule to 23:00.</div>
              </div>
            </div>

            <div className="cps-card cps-route">
              <div className="cps-card-spine cps-spine-amber"></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">KOLAR ROAD -- EMERGENCY ROUTE</div>
                <div className="cps-card-title">Ambulance Corridor Narrowed</div>
                <div className="cps-card-desc">15 MPEB poles remain unshifted on Kolar Road. The arterial emergency vehicle corridor is functionally narrowed. Ambulance response times for eastern Bhopal zones are elevated. AIIMS ambulance access is at degraded capacity.</div>
                <div className="cps-responsible">Blocking Dept: Energy Dept (field teams not deployed -- 19 days)</div>
                <div className="cps-action-needed">Action Required: Issue 48-hour compliance notice to Energy Principal Secretary.</div>
              </div>
            </div>

            <div className="cps-card cps-schools">
              <div className="cps-card-spine cps-spine-amber"></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">MP Nagar -- SCHOOL ZONE IMPACT</div>
                <div className="cps-card-title">3 School Transport Routes Disrupted</div>
                <div className="cps-card-desc">Ongoing construction without a resolution timeline is disrupting 3 school bus and auto-rickshaw routes serving Carmel Convent, Campion, and St. Joseph schools. 2,400+ students face daily commute disruption and safety risks near active unresolved construction.</div>
                <div className="cps-responsible">Root Cause: Revenue clearance delay -- PWD cannot resume works</div>
                <div className="cps-action-needed">Action Required: Revenue clearance to PWD -- same as Project Priority 1.</div>
              </div>
            </div>

            <div className="cps-card cps-market">
              <div className="cps-card-spine cps-spine-dim"></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">ARERA COLONY -- COMMERCIAL IMPACT</div>
                <div className="cps-card-title">Market Zone Access Disrupted</div>
                <div className="cps-card-desc">4 commercial market zones in MP Nagar and Arera Colony face ongoing footfall reduction from prolonged construction with no published completion timeline. 350+ registered traders have submitted formal complaints to the District Collector's office.</div>
                <div className="cps-responsible">Blocking Dept: BMC Traffic Cell (diversion sign-off not issued)</div>
                <div className="cps-action-needed">Action Required: BMC Traffic Cell sign-off within 48 hours.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
