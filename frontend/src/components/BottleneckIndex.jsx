import React, { useState, useEffect } from 'react';

export default function BottleneckIndex() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section pressure-section" id="s-pressure">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 04 / 07 — BOTTLENECKS</div>
          <h2 className="section-title">Department Bottleneck Index</h2>
          <p className="section-desc">Departments ranked by how many coordination chains they are blocking. Each card shows the specific operational reason for the blockage and the administrative risk if unresolved.</p>
        </div>

        <div className="pressure-grid">

          <div className="pressure-card pc-critical">
            <div className="pc-top">
              <div className="pc-dept-name">Revenue Department</div>
              <div className="pc-level-badge badge-critical-sm">RANK #1 BLOCKER</div>
            </div>
            <div className="pc-gauge-row">
              <div className="pc-gauge-track">
                <div 
                  className="pc-gauge-fill fill-critical" 
                  style={{ 
                    width: animate ? '91%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="pc-pct" title="Blocking Intensity — proportion of city projects stalled by this dept">91% intensity</span>
            </div>
            <div className="pc-stats">
              <div className="pc-stat">
                <span className="pc-stat-n">11</span>
                <span className="pc-stat-l">Projects Waiting</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">23</span>
                <span className="pc-stat-l">Pending Dependencies</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">14d</span>
                <span className="pc-stat-l">Avg. Waiting Time</span>
              </div>
            </div>
            <div className="pc-note">Revenue clearance bottleneck is the single largest coordination blocker in the city today.</div>
            <div className="pc-bottleneck">
              <div className="pc-bottleneck-label">Primary Bottleneck</div>
              <div className="pc-bottleneck-value">Land Compensation Counter-Signatures — 42 cases pending, Commissioner's office</div>
            </div>
            <div className="pc-risk-row">
              <span className="pc-risk-label">Administrative Risk</span>
              <span className="pc-risk-badge pc-risk-critical">Critical</span>
            </div>
          </div>

          <div className="pressure-card pc-high">
            <div className="pc-top">
              <div className="pc-dept-name">Energy Department</div>
              <div className="pc-level-badge badge-high-sm">RANK #2 BLOCKER</div>
            </div>
            <div className="pc-gauge-row">
              <div className="pc-gauge-track">
                <div 
                  className="pc-gauge-fill fill-high" 
                  style={{ 
                    width: animate ? '74%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="pc-pct" title="Blocking Intensity">74% intensity</span>
            </div>
            <div className="pc-stats">
              <div className="pc-stat">
                <span className="pc-stat-n">3</span>
                <span className="pc-stat-l">Projects Waiting</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">8</span>
                <span className="pc-stat-l">Pending Dependencies</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">7d</span>
                <span className="pc-stat-l">Avg. Waiting Time</span>
              </div>
            </div>
            <div className="pc-note">Field deployment teams idle while PWD and Traffic await utility relocation clearance.</div>
            <div className="pc-bottleneck">
              <div className="pc-bottleneck-label">Primary Bottleneck</div>
              <div className="pc-bottleneck-value">MPEB Division Engineer — field team deployment not authorised for 19 days</div>
            </div>
            <div className="pc-risk-row">
              <span className="pc-risk-label">Administrative Risk</span>
              <span className="pc-risk-badge pc-risk-high">High</span>
            </div>
          </div>

          <div className="pressure-card pc-moderate">
            <div className="pc-top">
              <div className="pc-dept-name">Water Supply Department</div>
              <div className="pc-level-badge badge-moderate-sm">RANK #3 BLOCKER</div>
            </div>
            <div className="pc-gauge-row">
              <div className="pc-gauge-track">
                <div 
                  className="pc-gauge-fill fill-moderate" 
                  style={{ 
                    width: animate ? '52%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="pc-pct" title="Blocking Intensity">52% intensity</span>
            </div>
            <div className="pc-stats">
              <div className="pc-stat">
                <span className="pc-stat-n">1</span>
                <span className="pc-stat-l">Projects Waiting</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">4</span>
                <span className="pc-stat-l">Pending Dependencies</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">8d</span>
                <span className="pc-stat-l">Avg. Waiting Time</span>
              </div>
            </div>
            <div className="pc-note">AIIMS corridor conflict requires immediate schedule realignment with Health Department.</div>
            <div className="pc-bottleneck">
              <div className="pc-bottleneck-label">Primary Bottleneck</div>
              <div className="pc-bottleneck-value">Maintenance window scheduling conflict — AIIMS peak hours vs. pipeline access</div>
            </div>
            <div className="pc-risk-row">
              <span className="pc-risk-label">Administrative Risk</span>
              <span className="pc-risk-badge pc-risk-critical">Critical</span>
            </div>
          </div>

          <div className="pressure-card pc-moderate">
            <div className="pc-top">
              <div className="pc-dept-name">Municipal Corporation</div>
              <div className="pc-level-badge badge-moderate-sm">RANK #4 BLOCKER</div>
            </div>
            <div className="pc-gauge-row">
              <div className="pc-gauge-track">
                <div 
                  className="pc-gauge-fill fill-moderate" 
                  style={{ 
                    width: animate ? '38%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="pc-pct" title="Blocking Intensity">38% intensity</span>
            </div>
            <div className="pc-stats">
              <div className="pc-stat">
                <span className="pc-stat-n">2</span>
                <span className="pc-stat-l">Projects Waiting</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">3</span>
                <span className="pc-stat-l">Pending Dependencies</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">6d</span>
                <span className="pc-stat-l">Avg. Waiting Time</span>
              </div>
            </div>
            <div className="pc-note">Transport permits delayed — road diversion sign-offs awaited by 2 active contractors.</div>
            <div className="pc-bottleneck">
              <div className="pc-bottleneck-label">Primary Bottleneck</div>
              <div className="pc-bottleneck-value">BMC Traffic Cell — diversion sign-off applications unprocessed for 6 working days</div>
            </div>
            <div className="pc-risk-row">
              <span className="pc-risk-label">Administrative Risk</span>
              <span className="pc-risk-badge pc-risk-moderate">Moderate</span>
            </div>
          </div>

          <div className="pressure-card pc-low">
            <div className="pc-top">
              <div className="pc-dept-name">Public Works Department</div>
              <div className="pc-level-badge badge-low-sm">LOW BLOCK RISK</div>
            </div>
            <div className="pc-gauge-row">
              <div className="pc-gauge-track">
                <div 
                  className="pc-gauge-fill fill-low" 
                  style={{ 
                    width: animate ? '29%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="pc-pct" title="Blocking Intensity">29% intensity</span>
            </div>
            <div className="pc-stats">
              <div className="pc-stat">
                <span className="pc-stat-n">0</span>
                <span className="pc-stat-l">Projects Waiting</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">2</span>
                <span className="pc-stat-l">Pending Dependencies</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">—</span>
                <span className="pc-stat-l">Not Blocking</span>
              </div>
            </div>
            <div className="pc-note">PWD is waiting, not blocking. Downstream coordination on schedule once Revenue and Energy clear.</div>
            <div className="pc-bottleneck">
              <div className="pc-bottleneck-label">Primary Bottleneck</div>
              <div className="pc-bottleneck-value">Awaiting Revenue land clearance — M/s Patel Infrastructure demobilised from site</div>
            </div>
            <div className="pc-risk-row">
              <span className="pc-risk-label">Administrative Risk</span>
              <span className="pc-risk-badge pc-risk-moderate">Moderate — Waiting</span>
            </div>
          </div>

          <div className="pressure-card pc-low">
            <div className="pc-top">
              <div className="pc-dept-name">Health & Sanitation</div>
              <div className="pc-level-badge badge-low-sm">LOW</div>
            </div>
            <div className="pc-gauge-row">
              <div className="pc-gauge-track">
                <div 
                  className="pc-gauge-fill fill-low" 
                  style={{ 
                    width: animate ? '22%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="pc-pct" title="Blocking Intensity">22% intensity</span>
            </div>
            <div className="pc-stats">
              <div className="pc-stat">
                <span className="pc-stat-n">3</span>
                <span className="pc-stat-l">Open Requests</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">0</span>
                <span className="pc-stat-l">Critical Flags</span>
              </div>
              <div className="pc-stat">
                <span className="pc-stat-n">1d</span>
                <span className="pc-stat-l">Avg. Response</span>
              </div>
            </div>
            <div className="pc-note">AIIMS maintenance schedule conflict requires Health-Water coordination intervention within 24 hours.</div>
            <div className="pc-bottleneck">
              <div className="pc-bottleneck-label">Primary Bottleneck</div>
              <div className="pc-bottleneck-value">Maintenance window rescheduling requires Collector-level coordination with AIIMS admin</div>
            </div>
            <div className="pc-risk-row">
              <span className="pc-risk-label">Administrative Risk</span>
              <span className="pc-risk-badge pc-risk-high">High — Proactive</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
