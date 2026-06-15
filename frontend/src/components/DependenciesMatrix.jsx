import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const DEPT_MAP = {
  'Public Works Dept': { tag: 'PWD', cls: 'wm-dept-pwd' },
  'Revenue Dept': { tag: 'REV', cls: 'wm-dept-rev' },
  'Energy Dept (MPEB)': { tag: 'ENG', cls: 'wm-dept-energy' },
  'Water Supply Dept': { tag: 'WSP', cls: 'wm-dept-water' },
  'Urban Transport/Traffic Cell': { tag: 'TRP', cls: 'wm-dept-transport' }
};

export default function DependenciesMatrix({ refreshKey }) {
  const [animate, setAnimate] = useState(false);
  const [matrixData, setMatrixData] = useState(null);
  const [activeDeps, setActiveDeps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [grid, deps] = await Promise.all([
        api.getMatrixGrid(),
        api.getActiveDecisions()
      ]);
      setMatrixData(grid);
      setActiveDeps(deps);
      setError(null);
    } catch (err) {
      console.error('Error fetching matrix data:', err);
      setError('Matrix data sync offline.');
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

  const getDeptInfo = (name) => {
    return DEPT_MAP[name] || { tag: 'BMC', cls: 'wm-dept-muni' };
  };

  // Compute bottleneck counts dynamically from the active dependencies
  const blockCounts = {};
  activeDeps.forEach(d => {
    const blocking = d.blockingDept;
    blockCounts[blocking] = (blockCounts[blocking] || 0) + 1;
  });

  const sortedBottlenecks = Object.keys(blockCounts)
    .map(dept => ({ dept, count: blockCounts[dept] }))
    .sort((a, b) => b.count - a.count);

  const maxBlockCount = sortedBottlenecks.length > 0 ? sortedBottlenecks[0].count : 1;

  if (loading) {
    return (
      <section className="section risk-section" id="s-risk">
        <div className="section-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
          <div className="live-dot"></div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>SYNCING COORD MATRIX...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section risk-section" id="s-risk">
        <div className="section-container">
          <div style={{ border: '1px solid var(--critical-border)', background: 'var(--critical-bg)', padding: '20px', color: 'var(--critical-light)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            ⚠ MATRIX PROTOCOL: {error}
          </div>
        </div>
      </section>
    );
  }

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

          {activeDeps.length === 0 ? (
            <div style={{ border: '1px dashed var(--border-accent)', padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
              ⬡ NO COORDINATION FAILURES RECORDED — NETWORK NOMINAL
            </div>
          ) : (
            activeDeps.map((item, idx) => {
              const waiter = getDeptInfo(item.waitingDept);
              const blocker = getDeptInfo(item.blockingDept);
              const isCritical = item.daysPending > 10;
              const severityClass = isCritical ? 'wm-critical' : 'wm-high';
              const dotClass = isCritical ? 'wm-dot-critical' : 'wm-dot-high';

              return (
                <div key={item.id || idx} className={`wm-row ${severityClass}`} style={{ '--row-urgency': isCritical ? 1 : 2 }}>
                  <div className="wm-col-waiter">
                    <span className={`wm-dept-tag ${waiter.cls}`}>{waiter.tag}</span>
                    <span className="wm-dept-full">{item.waitingDept}</span>
                  </div>
                  <div className="wm-col-arrow"><span className="wm-wait-arrow">←waiting</span></div>
                  <div className="wm-col-blocker">
                    <span className={`wm-dept-tag ${blocker.cls}`}>{blocker.tag}</span>
                    <span className="wm-dept-full">{item.blockingDept}</span>
                  </div>
                  <div className="wm-col-days">
                    <span className={`wm-days-badge ${isCritical ? 'wm-days-critical' : 'wm-days-high'}`}>{item.daysPending}d</span>
                  </div>
                  <div className="wm-col-projects">{item.project}</div>
                  <div className="wm-col-status">
                    <span className={`wm-status-dot ${dotClass}`}></span>
                    {item.escalationStatus.toUpperCase()}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottleneck Summary Bar */}
        {sortedBottlenecks.length > 0 && (
          <div className="bottleneck-summary">
            <div className="bs-label">COORDINATION BOTTLENECK ORIGIN</div>
            <div className="bs-bars">
              {sortedBottlenecks.slice(0, 4).map((item, idx) => {
                const fillPct = (item.count / maxBlockCount) * 100;
                let fillClass = 'bs-fill-moderate';
                if (fillPct > 75) fillClass = 'bs-fill-critical';
                else if (fillPct > 45) fillClass = 'bs-fill-high';

                return (
                  <div key={idx} className="bs-bar-row">
                    <span className="bs-dept">{item.dept}</span>
                    <div className="bs-track">
                      <div 
                        className={`bs-fill ${fillClass}`} 
                        style={{ 
                          width: animate ? `${fillPct}%` : '0%',
                          transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      ></div>
                    </div>
                    <span className="bs-count">{item.count} {item.count === 1 ? 'dependency' : 'dependencies'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
