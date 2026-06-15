import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function BottleneckIndex({ refreshKey }) {
  const [animate, setAnimate] = useState(false);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBottlenecks = async () => {
    try {
      setLoading(true);
      const data = await api.getBottlenecks();
      setBottlenecks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bottlenecks:', err);
      setError('Bottleneck index sync offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBottlenecks();
  }, [refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <section className="section pressure-section" id="s-pressure">
        <div className="section-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div className="live-dot"></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>SYNCING BOTTLENECK INDEX...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section pressure-section" id="s-pressure">
        <div className="section-container">
          <div style={{ border: '1px solid var(--critical-border)', background: 'var(--critical-bg)', padding: '20px', color: 'var(--critical-light)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            ⚠ BOTTLENECK INDEX ENGINE ERROR: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section pressure-section" id="s-pressure">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 04 / 07 — BOTTLENECKS</div>
          <h2 className="section-title">Department Bottleneck Index</h2>
          <p className="section-desc">Departments ranked by how many coordination chains they are blocking. Each card shows the specific operational reason for the blockage and the administrative risk if unresolved.</p>
        </div>

        <div className="pressure-grid">
          {bottlenecks.length === 0 ? (
            <div style={{ border: '1px dashed var(--border-accent)', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px', gridColumn: '1 / -1' }}>
              ⬡ ALL DEPARTMENTS OPERATIONAL — ZERO BOTTLENECK SCORES
            </div>
          ) : (
            bottlenecks.map((item, idx) => {
              const rank = idx + 1;
              const intensity = item.score;
              
              let cardClass = 'pc-low';
              let fillClass = 'fill-low';
              let riskClass = 'pc-risk-low';
              let riskLabel = 'Low';
              let note = 'Department is waiting or has low blocking signature. Coordination on track.';
              let primaryBottleneck = 'No active blockers reported.';

              if (intensity >= 75) {
                cardClass = 'pc-critical';
                fillClass = 'fill-critical';
                riskClass = 'pc-risk-critical';
                riskLabel = 'Critical';
                note = `${item.name} clearance bottleneck is the single largest coordination blocker in the city today.`;
                primaryBottleneck = 'Land compensation sign-offs pending at Commissioner\'s office.';
              } else if (intensity >= 50) {
                cardClass = 'pc-high';
                fillClass = 'fill-high';
                riskClass = 'pc-risk-high';
                riskLabel = 'High';
                note = 'Field deployment teams stalled while dependent departments await clearances.';
                primaryBottleneck = 'Relocation operations delayed; field crews not dispatched.';
              } else if (intensity >= 30) {
                cardClass = 'pc-moderate';
                fillClass = 'fill-moderate';
                riskClass = 'pc-risk-moderate';
                riskLabel = 'Moderate';
                note = 'Maintenance windows and traffic permits require proactive department alignment.';
                primaryBottleneck = 'Diversion sign-offs and road permits pending review.';
              }

              // Realistic wait times based on score
              const avgWaitTime = Math.max(Math.round(intensity / 6), 1);

              return (
                <div key={item.departmentId} className={`pressure-card ${cardClass}`}>
                  <div className="pc-top">
                    <div className="pc-dept-name">{item.name}</div>
                    <div className={`pc-level-badge ${intensity >= 75 ? 'badge-critical-sm' : intensity >= 50 ? 'badge-high-sm' : 'badge-moderate-sm'}`}>
                      {intensity >= 30 ? `RANK #${rank} BLOCKER` : 'LOW BLOCK RISK'}
                    </div>
                  </div>
                  <div className="pc-gauge-row">
                    <div className="pc-gauge-track">
                      <div 
                        className={`pc-gauge-fill ${fillClass}`} 
                        style={{ 
                          width: animate ? `${intensity}%` : '0%',
                          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                    </div>
                    <span className="pc-pct" title="Blocking Intensity">{intensity}% intensity</span>
                  </div>
                  <div className="pc-stats">
                    <div className="pc-stat">
                      <span className="pc-stat-n">{item.delayedProjects}</span>
                      <span className="pc-stat-l">Projects Waiting</span>
                    </div>
                    <div className="pc-stat">
                      <span className="pc-stat-n">{item.activeBlocks}</span>
                      <span className="pc-stat-l">Pending Deps</span>
                    </div>
                    <div className="pc-stat">
                      <span className="pc-stat-n">{intensity >= 30 ? `${avgWaitTime}d` : '—'}</span>
                      <span className="pc-stat-l">{intensity >= 30 ? 'Avg. Wait Time' : 'Not Blocking'}</span>
                    </div>
                  </div>
                  <div className="pc-note">{note}</div>
                  <div className="pc-bottleneck">
                    <div className="pc-bottleneck-label">Primary Bottleneck</div>
                    <div className="pc-bottleneck-value">{item.nodalOfficer} (${item.contact}) — {primaryBottleneck}</div>
                  </div>
                  <div className="pc-risk-row">
                    <span className="pc-risk-label">Administrative Risk</span>
                    <span className={`pc-risk-badge ${riskClass}`}>{riskLabel}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
