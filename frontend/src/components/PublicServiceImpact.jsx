import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

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

export default function PublicServiceImpact({ refreshKey }) {
  const [animate, setAnimate] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.getCitizenImpact();
      setData(res);
      setError(null);
    } catch (err) {
      console.error('Error fetching public service impact:', err);
      setError('Public service impact sync offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <section className="section l2-section citizen-impact-section" id="s-citizen">
        <div className="section-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div className="live-dot"></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>SYNCING PUBLIC SERVICE METRICS...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section l2-section citizen-impact-section" id="s-citizen">
        <div className="section-container">
          <div style={{ border: '1px solid var(--critical-border)', background: 'var(--critical-bg)', padding: '20px', color: 'var(--critical-light)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            ⚠ SERVICE IMPACT MONITOR: {error}
          </div>
        </div>
      </section>
    );
  }

  const impacts = data?.impacts || [];
  const totalAffected = data?.totalAffectedCitizens || 0;

  const healthcareList = impacts.filter(i => i.impactType === 'healthcare');
  const educationList = impacts.filter(i => i.impactType === 'education');
  const emergencyList = impacts.filter(i => i.impactType === 'emergency_route');
  const commercialList = impacts.filter(i => i.impactType === 'commercial');

  const healthcareCount = healthcareList.length;
  const educationCount = educationList.length > 0 ? 3 : 0; // matching school zone mapping count
  const emergencyCount = emergencyList.length;
  const commercialCount = commercialList.length > 0 ? 4 : 0; // matching market mapping count

  const isHospitalResolved = healthcareCount === 0;
  const isRouteResolved = emergencyCount === 0;
  const isSchoolResolved = educationCount === 0;
  const isMarketResolved = commercialCount === 0;

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
            <p className="csb-text">
              {totalAffected > 0 
                ? `Current unresolved conflicts may affect healthcare access, traffic movement, and public services for ${totalAffected.toLocaleString('en-IN')} citizens. Immediate resolution is advised.`
                : 'All primary public service sectors are nominal. No active citizen coordination threats.'}
            </p>
            <div className="csb-urgency-bar">
              <span className="csb-urgency-label">RESOLUTION URGENCY</span>
              <div className="csb-urgency-track">
                <div 
                  className="csb-urgency-fill" 
                  style={{ 
                    width: totalAffected > 0 ? (animate ? '78%' : '0%') : '0%',
                    background: totalAffected > 0 ? 'var(--critical)' : 'var(--nominal-light)',
                    transition: 'width 1.2s ease-out'
                  }}
                ></div>
              </div>
              <span className="csb-urgency-value" style={totalAffected === 0 ? { color: 'var(--nominal-light)' } : {}}>
                {totalAffected > 0 ? 'HIGH' : 'NOMINAL'}
              </span>
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
                <AnimatedNumber value={totalAffected} />
              </div>
              <div className="cm-label">Potentially Affected Citizens</div>
            </div>
            <div className="cm-card">
              <div className={`cm-icon ${isHospitalResolved ? 'cm-icon-nominal' : 'cm-icon-red'}`}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="3" width="20" height="22" rx="2" stroke={isHospitalResolved ? '#3a8c66' : '#d4521f'} strokeWidth="1.5"/>
                  <line x1="14" y1="8" x2="14" y2="15" stroke={isHospitalResolved ? '#3a8c66' : '#d4521f'} strokeWidth="2" strokeLinecap="round"/>
                  <line x1="10" y1="11.5" x2="18" y2="11.5" stroke={isHospitalResolved ? '#3a8c66' : '#d4521f'} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className={`cm-number ${isHospitalResolved ? 'cm-number-nominal' : 'cm-number-critical'}`}>
                <AnimatedNumber value={healthcareCount} />
              </div>
              <div className="cm-label">Hospitals at Risk</div>
              <div className="cm-sublabel">{isHospitalResolved ? 'Access secured' : 'AIIMS corridor water main'}</div>
            </div>
            <div className="cm-card">
              <div className={`cm-icon ${isSchoolResolved ? 'cm-icon-nominal' : 'cm-icon-amber'}`}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <polygon points="14,2 26,22 2,22" stroke={isSchoolResolved ? '#3a8c66' : '#c8a84b'} strokeWidth="1.5" fill="none"/>
                  <line x1="14" y1="10" x2="14" y2="17" stroke={isSchoolResolved ? '#3a8c66' : '#c8a84b'} strokeWidth="2"/>
                  <circle cx="14" cy="20" r="1" fill={isSchoolResolved ? '#3a8c66' : '#c8a84b'}/>
                </svg>
              </div>
              <div className={`cm-number ${isSchoolResolved ? 'cm-number-nominal' : 'cm-number-amber'}`}>
                <AnimatedNumber value={educationCount} />
              </div>
              <div className="cm-label">Schools Disrupted</div>
              <div className="cm-sublabel">{isSchoolResolved ? 'All routes clear' : '2,400+ students affected'}</div>
            </div>
            <div className="cm-card">
              <div className={`cm-icon ${isRouteResolved ? 'cm-icon-nominal' : 'cm-icon-red'}`}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" stroke={isRouteResolved ? '#3a8c66' : '#d4521f'} strokeWidth="1.5"/>
                  <line x1="14" y1="4" x2="14" y2="24" stroke={isRouteResolved ? '#3a8c66' : '#d4521f'} strokeWidth="1"/>
                  <line x1="4" y1="14" x2="24" y2="14" stroke={isRouteResolved ? '#3a8c66' : '#d4521f'} strokeWidth="1"/>
                  <circle cx="14" cy="14" r="3" fill={isRouteResolved ? '#3a8c66' : '#d4521f'}/>
                </svg>
              </div>
              <div className={`cm-number ${isRouteResolved ? 'cm-number-nominal' : 'cm-number-critical'}`}>
                <AnimatedNumber value={emergencyCount} />
              </div>
              <div className="cm-label">Emergency Routes Affected</div>
              <div className="cm-sublabel">{isRouteResolved ? 'Arterial flow normal' : 'Ambulance response at risk'}</div>
            </div>
          </div>
        </div>

        {/* Critical Public Service Impact */}
        <div className="cps-impact-section">
          <div className="cps-header">CRITICAL PUBLIC SERVICE IMPACT -- BY LOCATION</div>
          <div className="cps-grid">
            <div className="cps-card cps-hospital" style={isHospitalResolved ? { opacity: 0.45, borderLeft: '4px solid var(--nominal-light)' } : {}}>
              <div className="cps-card-spine" style={isHospitalResolved ? { background: 'var(--nominal-light)' } : {}}></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">AIIMS BHOPAL CORRIDOR</div>
                <div className="cps-card-title">Hospital Water Supply {isHospitalResolved ? 'Secured' : 'at Risk'}</div>
                <div className="cps-card-desc">
                  {isHospitalResolved 
                    ? 'The water main maintenance schedule conflict has been resolved. Shifted to night window to secure operating theatre and intensive care unit water supply with zero patient risk.'
                    : 'Scheduled pipeline maintenance overlaps with peak OT and ICU operating hours. 400+ daily patients depend on uninterrupted water supply. Emergency surgery schedules are at risk during any maintenance window.'}
                </div>
                <div className="cps-responsible">
                  {isHospitalResolved ? 'Status: Directives implemented successfully' : 'Blocking Dept: Water Supply Dept (schedule not rescheduled)'}
                </div>
                <div className="cps-action-needed" style={isHospitalResolved ? { color: 'var(--nominal-light)', border: '1px solid var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>
                  {isHospitalResolved ? '✓ Resolved' : 'Action Required: Convene Health-Water coordination call today. Reschedule to 23:00.'}
                </div>
              </div>
            </div>

            <div className="cps-card cps-route" style={isRouteResolved ? { opacity: 0.45, borderLeft: '4px solid var(--nominal-light)' } : {}}>
              <div className="cps-card-spine" style={isRouteResolved ? { background: 'var(--nominal-light)' } : {}}></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">KOLAR ROAD -- EMERGENCY ROUTE</div>
                <div className="cps-card-title">Ambulance Corridor {isRouteResolved ? 'Secured' : 'Narrowed'}</div>
                <div className="cps-card-desc">
                  {isRouteResolved 
                    ? '15 electrical poles relocated from the primary corridor alignment. Road widening foundations cleared and emergency ambulance routes restored to full operational capacity.'
                    : '15 MPEB poles remain unshifted on Kolar Road. The arterial emergency vehicle corridor is functionally narrowed. Ambulance response times for eastern Bhopal zones are elevated. AIIMS ambulance access is at degraded capacity.'}
                </div>
                <div className="cps-responsible">
                  {isRouteResolved ? 'Status: Infrastructure clearance complete' : 'Blocking Dept: Energy Dept (field teams not deployed -- 19 days)'}
                </div>
                <div className="cps-action-needed" style={isRouteResolved ? { color: 'var(--nominal-light)', border: '1px solid var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>
                  {isRouteResolved ? '✓ Resolved' : 'Action Required: Issue 48-hour compliance notice to Energy Principal Secretary.'}
                </div>
              </div>
            </div>

            <div className="cps-card cps-schools" style={isSchoolResolved ? { opacity: 0.45, borderLeft: '4px solid var(--nominal-light)' } : {}}>
              <div className="cps-card-spine" style={isSchoolResolved ? { background: 'var(--nominal-light)' } : {}}></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">MP Nagar -- SCHOOL ZONE IMPACT</div>
                <div className="cps-card-title">School Transport Routes {isSchoolResolved ? 'Cleared' : 'Disrupted'}</div>
                <div className="cps-card-desc">
                  {isSchoolResolved 
                    ? 'Land acquisition documentation signed off. PWD widening works have resumed, school transport routes cleared for Carmel Convent, Campion, and St. Joseph school vehicles.'
                    : 'Ongoing construction without a resolution timeline is disrupting 3 school bus and auto-rickshaw routes serving Carmel Convent, Campion, and St. Joseph schools. 2,400+ students face daily commute disruption and safety risks near active unresolved construction.'}
                </div>
                <div className="cps-responsible">
                  {isSchoolResolved ? 'Status: Revenue title transfer complete' : 'Root Cause: Revenue clearance delay -- PWD cannot resume works'}
                </div>
                <div className="cps-action-needed" style={isSchoolResolved ? { color: 'var(--nominal-light)', border: '1px solid var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>
                  {isSchoolResolved ? '✓ Resolved' : 'Action Required: Revenue clearance to PWD -- same as Project Priority 1.'}
                </div>
              </div>
            </div>

            <div className="cps-card cps-market" style={isMarketResolved ? { opacity: 0.45 } : {}}>
              <div className="cps-card-spine" style={isMarketResolved ? { background: 'var(--nominal-light)' } : {}}></div>
              <div className="cps-card-body">
                <div className="cps-zone-tag">ARERA COLONY -- COMMERCIAL IMPACT</div>
                <div className="cps-card-title">Market Zone Access {isMarketResolved ? 'Restored' : 'Disrupted'}</div>
                <div className="cps-card-desc">
                  {isMarketResolved 
                    ? 'Diversion sign-offs cleared by BMC Traffic cell. Market access restored. Retailers and local trade zones report standard footfalls and commercial clearance.'
                    : '4 commercial market zones in MP Nagar and Arera Colony face ongoing footfall reduction from prolonged construction with no published completion timeline. 350+ registered traders have submitted formal complaints.'}
                </div>
                <div className="cps-responsible">
                  {isMarketResolved ? 'Status: Diversion permits dispatched' : 'Blocking Dept: BMC Traffic Cell (diversion sign-off not issued)'}
                </div>
                <div className="cps-action-needed" style={isMarketResolved ? { color: 'var(--nominal-light)', border: '1px solid var(--nominal-border)', background: 'var(--nominal-bg)' } : {}}>
                  {isMarketResolved ? '✓ Resolved' : 'Action Required: BMC Traffic Cell sign-off within 48 hours.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
