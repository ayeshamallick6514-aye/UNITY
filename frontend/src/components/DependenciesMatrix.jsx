import React, { useState, useEffect } from 'react';

export default function DependenciesMatrix() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Stagger slightly so animation is visible on mount
    const timer = setTimeout(() => setAnimate(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="section risk-section" id="s-risk">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 03 / 07 — DEPENDENCIES</div>
          <h2 className="section-title">Who Is Waiting for Whom?</h2>
          <p className="section-desc">Active inter-department dependencies — every row is a coordination failure in progress. These bottlenecks do not resolve themselves.</p>
        </div>

        {/* Who Waits for Whom Matrix */}
        <div className="waiting-matrix">
          <div className="wm-header-row">
            <div className="wm-col-waiter">WAITING DEPARTMENT</div>
            <div className="wm-col-arrow"></div>
            <div className="wm-col-blocker">BLOCKED BY</div>
            <div className="wm-col-days">DAYS</div>
            <div className="wm-col-projects">PROJECTS HELD</div>
            <div className="wm-col-status">STATUS</div>
          </div>

          <div className="wm-row wm-critical" style={{ '--row-urgency': 1 }}>
            <div className="wm-col-waiter">
              <span className="wm-dept-tag wm-dept-pwd">PWD</span>
              <span className="wm-dept-full">Public Works Department</span>
            </div>
            <div className="wm-col-arrow"><span className="wm-wait-arrow">←waiting</span></div>
            <div className="wm-col-blocker">
              <span className="wm-dept-tag wm-dept-rev">REV</span>
              <span className="wm-dept-full">Revenue Department</span>
            </div>
            <div className="wm-col-days"><span className="wm-days-badge wm-days-critical">12d</span></div>
            <div className="wm-col-projects">3 projects</div>
            <div className="wm-col-status"><span className="wm-status-dot wm-dot-critical"></span>CRITICAL</div>
          </div>

          <div className="wm-row wm-critical" style={{ '--row-urgency': 1 }}>
            <div className="wm-col-waiter">
              <span className="wm-dept-tag wm-dept-energy">ENG</span>
              <span className="wm-dept-full">Energy Department</span>
            </div>
            <div className="wm-col-arrow"><span className="wm-wait-arrow">←waiting</span></div>
            <div className="wm-col-blocker">
              <span className="wm-dept-tag wm-dept-rev">REV</span>
              <span className="wm-dept-full">Revenue Department</span>
            </div>
            <div className="wm-col-days"><span className="wm-days-badge wm-days-critical">12d</span></div>
            <div className="wm-col-projects">2 projects</div>
            <div className="wm-col-status"><span className="wm-status-dot wm-dot-critical"></span>CRITICAL</div>
          </div>

          <div className="wm-row wm-high">
            <div className="wm-col-waiter">
              <span className="wm-dept-tag wm-dept-health">HLT</span>
              <span className="wm-dept-full">Health &amp; Sanitation</span>
            </div>
            <div className="wm-col-arrow"><span className="wm-wait-arrow">←waiting</span></div>
            <div className="wm-col-blocker">
              <span className="wm-dept-tag wm-dept-water">WSP</span>
              <span className="wm-dept-full">Water Supply Dept</span>
            </div>
            <div className="wm-col-days"><span className="wm-days-badge wm-days-high">8d</span></div>
            <div className="wm-col-projects">1 project</div>
            <div className="wm-col-status"><span className="wm-status-dot wm-dot-high"></span>HIGH</div>
          </div>

          <div className="wm-row wm-high">
            <div className="wm-col-waiter">
              <span className="wm-dept-tag wm-dept-transport">TRP</span>
              <span className="wm-dept-full">Transport Department</span>
            </div>
            <div className="wm-col-arrow"><span className="wm-wait-arrow">←waiting</span></div>
            <div className="wm-col-blocker">
              <span className="wm-dept-tag wm-dept-muni">BMC</span>
              <span className="wm-dept-full">Municipal Corporation</span>
            </div>
            <div className="wm-col-days"><span className="wm-days-badge wm-days-high">6d</span></div>
            <div className="wm-col-projects">2 projects</div>
            <div className="wm-col-status"><span className="wm-status-dot wm-dot-high"></span>HIGH</div>
          </div>

          <div className="wm-row wm-moderate">
            <div className="wm-col-waiter">
              <span className="wm-dept-tag wm-dept-phe">PHE</span>
              <span className="wm-dept-full">PHE Department</span>
            </div>
            <div className="wm-col-arrow"><span className="wm-wait-arrow">←waiting</span></div>
            <div className="wm-col-blocker">
              <span className="wm-dept-tag wm-dept-transport">TRP</span>
              <span className="wm-dept-full">Transport Department</span>
            </div>
            <div className="wm-col-days"><span className="wm-days-badge wm-days-moderate">4d</span></div>
            <div className="wm-col-projects">1 project</div>
            <div className="wm-col-status"><span className="wm-status-dot wm-dot-moderate"></span>WATCH</div>
          </div>

          <div className="wm-row wm-moderate">
            <div className="wm-col-waiter">
              <span className="wm-dept-tag wm-dept-urban">UPL</span>
              <span className="wm-dept-full">Urban Planning</span>
            </div>
            <div className="wm-col-arrow"><span className="wm-wait-arrow">←waiting</span></div>
            <div className="wm-col-blocker">
              <span className="wm-dept-tag wm-dept-rev">REV</span>
              <span className="wm-dept-full">Revenue Department</span>
            </div>
            <div className="wm-col-days"><span className="wm-days-badge wm-days-moderate">5d</span></div>
            <div className="wm-col-projects">2 projects</div>
            <div className="wm-col-status"><span className="wm-status-dot wm-dot-moderate"></span>WATCH</div>
          </div>
        </div>

        {/* Bottleneck Summary Bar */}
        <div className="bottleneck-summary">
          <div className="bs-label">COORDINATION BOTTLENECK ORIGIN</div>
          <div className="bs-bars">
            <div className="bs-bar-row">
              <span className="bs-dept">Revenue Dept</span>
              <div className="bs-track">
                <div 
                  className="bs-fill bs-fill-critical" 
                  style={{ 
                    width: animate ? '91%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="bs-count">7 dependencies</span>
            </div>
            <div className="bs-bar-row">
              <span className="bs-dept">Water Supply</span>
              <div className="bs-track">
                <div 
                  className="bs-fill bs-fill-high" 
                  style={{ 
                    width: animate ? '52%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="bs-count">3 dependencies</span>
            </div>
            <div className="bs-bar-row">
              <span className="bs-dept">Municipal Corp</span>
              <div className="bs-track">
                <div 
                  className="bs-fill bs-fill-high" 
                  style={{ 
                    width: animate ? '40%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="bs-count">2 dependencies</span>
            </div>
            <div className="bs-bar-row">
              <span className="bs-dept">Transport Dept</span>
              <div className="bs-track">
                <div 
                  className="bs-fill bs-fill-moderate" 
                  style={{ 
                    width: animate ? '28%' : '0%',
                    transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                ></div>
              </div>
              <span className="bs-count">1 dependency</span>
            </div>
          </div>
        </div>

        {/* Administrative Action Summary */}
        <div className="wm-action-summary">
          <div className="wmas-header">ADMINISTRATIVE ACTIONS REQUIRED FROM THIS SECTION</div>
          <div className="wmas-grid">
            <div className="wmas-item wmas-critical">
              <div className="wmas-priority">Priority 1 -- Critical</div>
              <div className="wmas-action">Direct Revenue Commissioner to clear land acquisition queue. PWD and Energy cannot proceed until this is resolved.</div>
              <div className="wmas-window">Resolution Window: Today -- before Friday</div>
            </div>
            <div className="wmas-item wmas-critical">
              <div className="wmas-priority">Priority 2 -- Critical</div>
              <div className="wmas-action">Convene Health-Water Supply coordination call. Reschedule AIIMS pipeline maintenance to 23:00-04:00 window.</div>
              <div className="wmas-window">Resolution Window: Within 24 hours</div>
            </div>
            <div className="wmas-item wmas-high">
              <div className="wmas-priority">Priority 3 -- High</div>
              <div className="wmas-action">Issue Transport-Municipal Corporation coordination directive. BMC Traffic Cell to clear road diversion sign-offs for Kolar Corridor.</div>
              <div className="wmas-window">Resolution Window: Within 48 hours</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
