import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function CitizenImpact({ refreshKey }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCitizenImpact = async () => {
    try {
      setLoading(true);
      const res = await api.getCitizenImpact();
      setData(res);
      setError(null);
    } catch (err) {
      console.error('Error fetching citizen impact:', err);
      setError('Citizen impact sync offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizenImpact();
  }, [refreshKey]);

  if (loading) {
    return (
      <section className="section impact-section" id="s-impact">
        <div className="section-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div className="live-dot"></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>SYNCING CITIZEN IMPACT METRICS...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section impact-section" id="s-impact">
        <div className="section-container">
          <div style={{ border: '1px solid var(--critical-border)', background: 'var(--critical-bg)', padding: '20px', color: 'var(--critical-light)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            ⚠ CITIZEN IMPACT ENGINE ERROR: {error}
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

  const healthcareCount = healthcareList.reduce((sum, i) => sum + i.citizensAffected, 0);
  const educationCount = educationList.reduce((sum, i) => sum + i.citizensAffected, 0);
  const emergencyCount = emergencyList.reduce((sum, i) => sum + i.citizensAffected, 0);
  const commercialCount = commercialList.reduce((sum, i) => sum + i.citizensAffected, 0);

  return (
    <section className="section impact-section" id="s-impact">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 05 / 07 — CITIZEN IMPACT</div>
          <h2 className="section-title">Coordination Failure — Citizen Impact</h2>
          <p className="section-desc">Every inter-department coordination failure has a real-world consequence. These citizens are affected by decisions that departments have not resolved between themselves.</p>
        </div>

        <div className="impact-statement">
          <div className="impact-headline-block">
            <div className="impact-warning-bar"></div>
            <div className="impact-headline-text">
              <span className="impact-prefix">Coordination Failure Consequence — </span>
              <span className="impact-consequence">
                {totalAffected > 0 
                  ? `Active delays are creating real-world impacts for ${totalAffected.toLocaleString('en-IN')} citizens today:`
                  : 'All primary coordination channels are nominal — zero citizen impact logged.'}
              </span>
            </div>
          </div>
        </div>

        {/* Failure → Impact links */}
        <div className="failure-impact-links">
          {impacts.length === 0 ? (
            <div style={{ border: '1px dashed var(--nominal-border)', padding: '24px', textAlign: 'center', color: 'var(--nominal-light)', fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'var(--nominal-bg)' }}>
              ✓ ALL RESOLVED — CITIZEN INFRASTRUCTURE SECURED
            </div>
          ) : (
            impacts.map((item) => (
              <div key={item.id} className="fil-row">
                <div className="fil-failure">
                  <span className="fil-failure-label">COORDINATION IMPACT</span>
                  <span className="fil-failure-text">{item.project}</span>
                </div>
                <div className="fil-arrow">→</div>
                <div className="fil-impacts">
                  <span className="fil-impact-chip">{item.name}</span>
                  <span className="fil-impact-chip">{item.citizensAffected} affected</span>
                  <span className="fil-impact-chip" style={{ color: 'var(--accent-gold)' }}>{item.impactType.toUpperCase()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="impact-grid">
          {/* Healthcare Card */}
          <div className={`impact-card ic-hospital ${healthcareList.length === 0 ? 'ic-resolved-card' : ''}`} style={healthcareList.length === 0 ? { opacity: 0.4 } : {}}>
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="4" width="32" height="40" rx="2" stroke={healthcareList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
                <line x1="24" y1="14" x2="24" y2="26" stroke={healthcareList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2.5"/>
                <line x1="18" y1="20" x2="30" y2="20" stroke={healthcareList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2.5"/>
                <rect x="16" y="32" width="6" height="12" rx="1" fill={healthcareList.length === 0 ? '#3a8c66' : '#e8e0d0'}/>
                <rect x="26" y="32" width="6" height="12" rx="1" fill={healthcareList.length === 0 ? '#3a8c66' : '#e8e0d0'}/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count" style={healthcareList.length === 0 ? { color: 'var(--nominal-light)' } : {}}>{healthcareList.length} Hospitals at Risk</div>
              <div className="impact-card-desc">AIIMS Bhopal and JP Hospital water supply corridors overlap with unresolved maintenance conflicts.</div>
              <div className="impact-affected">
                {healthcareList.length === 0 ? (
                  <span style={{ color: 'var(--nominal-light)' }}><strong>RESOLVED</strong></span>
                ) : (
                  <span>Affects <strong>{healthcareCount}+ daily patients</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* School Card */}
          <div className={`impact-card ic-school ${educationList.length === 0 ? 'ic-resolved-card' : ''}`} style={educationList.length === 0 ? { opacity: 0.4 } : {}}>
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <polygon points="24,4 44,16 44,44 4,44 4,16" stroke={educationList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2" fill="none"/>
                <rect x="18" y="28" width="12" height="16" rx="1" fill={educationList.length === 0 ? '#3a8c66' : '#e8e0d0'}/>
                <rect x="14" y="22" width="8" height="6" rx="1" stroke={educationList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="1.5" fill="none"/>
                <rect x="26" y="22" width="8" height="6" rx="1" stroke={educationList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="1.5" fill="none"/>
                <line x1="24" y1="4" x2="24" y2="14" stroke={educationList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count" style={educationList.length === 0 ? { color: 'var(--nominal-light)' } : {}}>{educationList.length} Schools Disrupted</div>
              <div className="impact-card-desc">MP Nagar corridor road widening delay affects school transport routes for government schools.</div>
              <div className="impact-affected">
                {educationList.length === 0 ? (
                  <span style={{ color: 'var(--nominal-light)' }}><strong>RESOLVED</strong></span>
                ) : (
                  <span>Affects <strong>{educationCount.toLocaleString('en-IN')}+ students</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* Route Card */}
          <div className={`impact-card ic-route ${emergencyList.length === 0 ? 'ic-resolved-card' : ''}`} style={emergencyList.length === 0 ? { opacity: 0.4 } : {}}>
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke={emergencyList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
                <line x1="24" y1="6" x2="24" y2="16" stroke={emergencyList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
                <line x1="24" y1="32" x2="24" y2="42" stroke={emergencyList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
                <line x1="6" y1="24" x2="16" y2="24" stroke={emergencyList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
                <line x1="32" y1="24" x2="42" y2="24" stroke={emergencyList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
                <circle cx="24" cy="24" r="5" fill={emergencyList.length === 0 ? '#3a8c66' : '#b5451b'}/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count" style={emergencyList.length === 0 ? { color: 'var(--nominal-light)' } : {}}>{emergencyList.length} Emergency Routes Affected</div>
              <div className="impact-card-desc">Kolar Road arterial — primary emergency vehicle corridor — is functionally narrowed due to pole relocation failure.</div>
              <div className="impact-affected">
                {emergencyList.length === 0 ? (
                  <span style={{ color: 'var(--nominal-light)' }}><strong>RESOLVED</strong></span>
                ) : (
                  <span>Affects <strong>ambulance response times</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* Market Card */}
          <div className={`impact-card ic-market ${commercialList.length === 0 ? 'ic-resolved-card' : ''}`} style={commercialList.length === 0 ? { opacity: 0.4 } : {}}>
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="20" width="36" height="24" rx="2" stroke={commercialList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2"/>
                <polyline points="2,20 24,6 46,20" stroke={commercialList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="2" fill="none"/>
                <rect x="18" y="30" width="12" height="14" rx="1" fill={commercialList.length === 0 ? '#3a8c66' : '#e8e0d0'}/>
                <rect x="10" y="26" width="8" height="8" rx="1" stroke={commercialList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="1.5" fill="none"/>
                <rect x="30" y="26" width="8" height="8" rx="1" stroke={commercialList.length === 0 ? '#3a8c66' : '#e8e0d0'} strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count" style={commercialList.length === 0 ? { color: 'var(--nominal-light)' } : {}}>{commercialList.length} Market Zones Disrupted</div>
              <div className="impact-card-desc">Commercial activity in MP Nagar and Arera Colony disrupted by prolonged construction without resolution timeline.</div>
              <div className="impact-affected">
                {commercialList.length === 0 ? (
                  <span style={{ color: 'var(--nominal-light)' }}><strong>RESOLVED</strong></span>
                ) : (
                  <span>Affects <strong>{commercialCount}+ traders</strong></span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
