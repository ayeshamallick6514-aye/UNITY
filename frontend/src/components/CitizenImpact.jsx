import React from 'react';

export default function CitizenImpact() {
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
              <span className="impact-prefix">Coordination Failure Consequence —</span>
              <span className="impact-consequence">Revenue + Energy delays are creating these real-world impacts right now:</span>
            </div>
          </div>
        </div>

        {/* Failure → Impact links */}
        <div className="failure-impact-links">
          <div className="fil-row">
            <div className="fil-failure">
              <span className="fil-failure-label">COORDINATION FAILURE</span>
              <span className="fil-failure-text">Revenue ↛ PWD (12 days)</span>
            </div>
            <div className="fil-arrow">→</div>
            <div className="fil-impacts">
              <span className="fil-impact-chip">MP Nagar Road Stalled</span>
              <span className="fil-impact-chip">2,400 students disrupted</span>
              <span className="fil-impact-chip">350 traders affected</span>
            </div>
          </div>
          <div className="fil-row">
            <div className="fil-failure">
              <span className="fil-failure-label">COORDINATION FAILURE</span>
              <span className="fil-failure-text">Water Supply ↛ Health (8 days)</span>
            </div>
            <div className="fil-arrow">→</div>
            <div className="fil-impacts">
              <span className="fil-impact-chip">AIIMS water supply risk</span>
              <span className="fil-impact-chip">400+ patients at risk</span>
            </div>
          </div>
          <div className="fil-row">
            <div className="fil-failure">
              <span className="fil-failure-label">COORDINATION FAILURE</span>
              <span className="fil-failure-text">Energy ↛ PWD (19 days)</span>
            </div>
            <div className="fil-arrow">→</div>
            <div className="fil-impacts">
              <span className="fil-impact-chip">Emergency route narrowed</span>
              <span className="fil-impact-chip">₹80K/day idle cost</span>
              <span className="fil-impact-chip">Ambulance delay risk</span>
            </div>
          </div>
        </div>

        <div className="impact-grid">
          <div className="impact-card ic-hospital">
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="4" width="32" height="40" rx="2" stroke="#e8e0d0" strokeWidth="2"/>
                <line x1="24" y1="14" x2="24" y2="26" stroke="#e8e0d0" strokeWidth="2.5"/>
                <line x1="18" y1="20" x2="30" y2="20" stroke="#e8e0d0" strokeWidth="2.5"/>
                <rect x="16" y="32" width="6" height="12" rx="1" fill="#e8e0d0"/>
                <rect x="26" y="32" width="6" height="12" rx="1" fill="#e8e0d0"/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count">2 Hospitals</div>
              <div className="impact-card-desc">AIIMS Bhopal and JP Hospital water supply corridors overlap with unresolved maintenance conflicts.</div>
              <div className="impact-affected">Affects <strong>800+ daily patients</strong></div>
            </div>
          </div>

          <div className="impact-card ic-school">
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <polygon points="24,4 44,16 44,44 4,44 4,16" stroke="#e8e0d0" strokeWidth="2" fill="none"/>
                <rect x="18" y="28" width="12" height="16" rx="1" fill="#e8e0d0"/>
                <rect x="14" y="22" width="8" height="6" rx="1" stroke="#e8e0d0" strokeWidth="1.5" fill="none"/>
                <rect x="26" y="22" width="8" height="6" rx="1" stroke="#e8e0d0" strokeWidth="1.5" fill="none"/>
                <line x1="24" y1="4" x2="24" y2="14" stroke="#e8e0d0" strokeWidth="2"/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count">3 Schools</div>
              <div className="impact-card-desc">MP Nagar corridor road widening delay affects school transport routes for 3 government schools.</div>
              <div className="impact-affected">Affects <strong>2,400+ students</strong></div>
            </div>
          </div>

          <div className="impact-card ic-route">
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="18" stroke="#e8e0d0" strokeWidth="2"/>
                <line x1="24" y1="6" x2="24" y2="16" stroke="#e8e0d0" strokeWidth="2"/>
                <line x1="24" y1="32" x2="24" y2="42" stroke="#e8e0d0" strokeWidth="2"/>
                <line x1="6" y1="24" x2="16" y2="24" stroke="#e8e0d0" strokeWidth="2"/>
                <line x1="32" y1="24" x2="42" y2="24" stroke="#e8e0d0" strokeWidth="2"/>
                <circle cx="24" cy="24" r="5" fill="#b5451b"/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count">1 Emergency Route</div>
              <div className="impact-card-desc">Kolar Road arterial — primary emergency vehicle corridor — is functionally narrowed due to pole relocation failure.</div>
              <div className="impact-affected">Affects <strong>ambulance response time</strong></div>
            </div>
          </div>

          <div className="impact-card ic-market">
            <div className="impact-icon-large">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="20" width="36" height="24" rx="2" stroke="#e8e0d0" strokeWidth="2"/>
                <polyline points="2,20 24,6 46,20" stroke="#e8e0d0" strokeWidth="2" fill="none"/>
                <rect x="18" y="30" width="12" height="14" rx="1" fill="#e8e0d0"/>
                <rect x="10" y="26" width="8" height="8" rx="1" stroke="#e8e0d0" strokeWidth="1.5" fill="none"/>
                <rect x="30" y="26" width="8" height="8" rx="1" stroke="#e8e0d0" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="impact-card-content">
              <div className="impact-count">4 Market Zones</div>
              <div className="impact-card-desc">Commercial activity in MP Nagar and Arera Colony disrupted by prolonged construction without resolution timeline.</div>
              <div className="impact-affected">Affects <strong>350+ traders</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
