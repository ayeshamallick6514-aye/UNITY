import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const RIPPLE_ORDER = ['revenue', 'land', 'road', 'utility', 'traffic', 'hospital'];

const DEPT_MAP = {
  revenue: 'revenue',
  land: 'revenue',
  road: 'pwd',
  utility: 'energy',
  traffic: 'transport',
  hospital: 'water_supply'
};

const DECISION_KEYS = {
  revenue: 'dc1',
  land: 'dc1',
  road: 'dc1',
  utility: 'dc3',
  traffic: 'dc3',
  hospital: 'dc2'
};

const DEPT_DISPLAY_NAMES = {
  revenue: 'Revenue Dept',
  pwd: 'Public Works Dept',
  energy: 'Energy Dept (MPEB)',
  water_supply: 'Water Supply Dept',
  transport: 'Traffic Cell/Transport'
};

export default function RippleEffect({ refreshKey, onIssueDirection }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeCascade, setActiveCascade] = useState({});
  const [timers, setTimers] = useState([]);
  const [simData, setSimData] = useState(null);
  const [simLoading, setSimLoading] = useState(false);
  const [simError, setSimError] = useState(null);

  const handleNodeClick = async (key) => {
    setSelectedNode(key);
    setActiveCascade({});
    setSimError(null);
    setSimLoading(true);

    const clickedIdx = RIPPLE_ORDER.indexOf(key);
    if (clickedIdx === -1) {
      setSimLoading(false);
      return;
    }

    // Trigger visual cascade animation
    timers.forEach(clearTimeout);
    const newTimers = [];

    RIPPLE_ORDER.forEach((nodeKey, idx) => {
      if (idx <= clickedIdx) return;
      const delay = (idx - clickedIdx) * 320;
      const timer = setTimeout(() => {
        setActiveCascade((prev) => ({
          ...prev,
          [nodeKey]: nodeKey === 'hospital' ? 'critical' : 'warning',
        }));
      }, delay);
      newTimers.push(timer);
    });
    setTimers(newTimers);

    // Run backend BFS cascade simulation
    try {
      const deptId = DEPT_MAP[key] || 'revenue';
      let delayDays = 12;
      if (key === 'utility' || key === 'traffic') delayDays = 19;
      else if (key === 'hospital') delayDays = 8;

      const result = await api.simulateRipple(deptId, delayDays);
      setSimData(result);
    } catch (err) {
      console.error('Simulation error:', err);
      setSimError('Simulation pipeline offline.');
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    return () => timers.forEach(clearTimeout);
  }, [timers]);

  // Auto-trigger revenue node on first load to match vanilla behavior
  useEffect(() => {
    const autoTriggerTimer = setTimeout(() => {
      handleNodeClick('revenue');
    }, 800);
    return () => clearTimeout(autoTriggerTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);
  const getDeptFriendlyList = (cascadePath) => {
    if (!cascadePath || cascadePath.length === 0) return 'None';
    const depts = new Set(cascadePath.flatMap(p => [
      DEPT_DISPLAY_NAMES[p.from] || p.from,
      DEPT_DISPLAY_NAMES[p.to] || p.to
    ]));
    return Array.from(depts).join(', ');
  };

  return (
    <section className="section l2-section ripple-section" id="s-ripple">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">LAYER II — 04 / 06</div>
          <h2 className="section-title">Ripple Effect Analysis</h2>
          <p className="section-desc">Governance dependency chain — click any node to see its full impact cascade.</p>
        </div>
        <div className="ripple-layout">
          <div className="ripple-chain-wrap">
            <div className="ripple-chain-header">DEPENDENCY CHAIN — MP NAGAR CORRIDOR</div>
            <div className="ripple-chain" id="rippleChain">

              {/* Node 1 */}
              <div 
                className={`ripple-node ripple-origin ${selectedNode === 'revenue' ? 'rn-active' : ''} ${activeCascade.revenue === 'warning' ? 'rn-cascade' : ''} ${activeCascade.revenue === 'critical' ? 'rn-cascade-critical' : ''}`} 
                onClick={() => handleNodeClick('revenue')}
              >
                <div className="rn-connector-top"></div>
                <div className="rn-body">
                  <span className="rn-level">ORIGIN</span>
                  <span className="rn-title">Revenue Clearance Delay</span>
                  <span className="rn-dept">Revenue Department</span>
                </div>
                <div className="rn-connector-bottom"></div>
              </div>

              <div className="ripple-arrow">↓</div>

              {/* Node 2 */}
              <div 
                className={`ripple-node ripple-affected ${selectedNode === 'land' ? 'rn-active' : ''} ${activeCascade.land === 'warning' ? 'rn-cascade' : ''} ${activeCascade.land === 'critical' ? 'rn-cascade-critical' : ''}`} 
                onClick={() => handleNodeClick('land')}
              >
                <div className="rn-connector-top"></div>
                <div className="rn-body">
                  <span className="rn-level">CASCADE 1</span>
                  <span className="rn-title">Land Acquisition Pending</span>
                  <span className="rn-dept">Revenue + PWD</span>
                </div>
                <div className="rn-connector-bottom"></div>
              </div>

              <div className="ripple-arrow">↓</div>

              {/* Node 3 */}
              <div 
                className={`ripple-node ripple-affected ${selectedNode === 'road' ? 'rn-active' : ''} ${activeCascade.road === 'warning' ? 'rn-cascade' : ''} ${activeCascade.road === 'critical' ? 'rn-cascade-critical' : ''}`} 
                onClick={() => handleNodeClick('road')}
              >
                <div className="rn-connector-top"></div>
                <div className="rn-body">
                  <span className="rn-level">CASCADE 2</span>
                  <span className="rn-title">Road Widening Delayed</span>
                  <span className="rn-dept">Public Works Department</span>
                </div>
                <div className="rn-connector-bottom"></div>
              </div>

              <div className="ripple-arrow">↓</div>

              {/* Node 4 */}
              <div 
                className={`ripple-node ripple-affected ${selectedNode === 'utility' ? 'rn-active' : ''} ${activeCascade.utility === 'warning' ? 'rn-cascade' : ''} ${activeCascade.utility === 'critical' ? 'rn-cascade-critical' : ''}`} 
                onClick={() => handleNodeClick('utility')}
              >
                <div className="rn-connector-top"></div>
                <div className="rn-body">
                  <span className="rn-level">CASCADE 3</span>
                  <span className="rn-title">Utility Relocation Delayed</span>
                  <span className="rn-dept">Energy Department</span>
                </div>
                <div className="rn-connector-bottom"></div>
              </div>

              <div className="ripple-arrow">↓</div>

              {/* Node 5 */}
              <div 
                className={`ripple-node ripple-affected ${selectedNode === 'traffic' ? 'rn-active' : ''} ${activeCascade.traffic === 'warning' ? 'rn-cascade' : ''} ${activeCascade.traffic === 'critical' ? 'rn-cascade-critical' : ''}`} 
                onClick={() => handleNodeClick('traffic')}
              >
                <div className="rn-connector-top"></div>
                <div className="rn-body">
                  <span className="rn-level">CASCADE 4</span>
                  <span className="rn-title">Traffic Diversion Delayed</span>
                  <span className="rn-dept">Traffic + Urban Planning</span>
                </div>
                <div className="rn-connector-bottom"></div>
              </div>

              <div className="ripple-arrow">↓</div>

              {/* Node 6 */}
              <div 
                className={`ripple-node ripple-terminal ${selectedNode === 'hospital' ? 'rn-active' : ''} ${activeCascade.hospital === 'warning' ? 'rn-cascade' : ''} ${activeCascade.hospital === 'critical' ? 'rn-cascade-critical' : ''}`} 
                onClick={() => handleNodeClick('hospital')}
              >
                <div className="rn-connector-top"></div>
                <div className="rn-body">
                  <span className="rn-level">TERMINAL IMPACT</span>
                  <span className="rn-title">Hospital Access Risk Increased</span>
                  <span className="rn-dept">800+ Citizens Affected</span>
                </div>
              </div>

            </div>
          </div>
          {/* Ripple Detail Panel */}
          <div className="ripple-detail-panel" id="rippleDetail">
            {simLoading ? (
              <div className="rdp-empty">
                <div className="live-dot"></div>
                <div className="rdp-empty-label">SIMULATING CASCADE PROPAGATION...</div>
              </div>
            ) : simError ? (
              <div className="rdp-empty" style={{ color: 'var(--critical-light)' }}>
                <div className="rdp-empty-icon">[ERROR]</div>
                <div className="rdp-empty-label">{simError}</div>
              </div>
            ) : !selectedNode || !simData ? (
              <div className="rdp-empty" id="rdpEmpty">
                <div className="rdp-empty-icon">[SYSTEM]</div>
                <div className="rdp-empty-label">Select any node in the chain to view its impact analysis</div>
              </div>
            ) : (
              <div className="rdp-content" id="rdpContent">
                <div className="rdp-badge" id="rdpBadge">
                  {selectedNode === 'revenue' ? 'ORIGIN — REVENUE DEPT' : selectedNode === 'hospital' ? 'TERMINAL IMPACT — CITIZENS' : `CASCADE STAGE — ${selectedNode.toUpperCase()}`}
                </div>
                <h3 className="rdp-title" id="rdpTitle">
                  {selectedNode === 'revenue' ? 'Revenue Clearance Delay' : selectedNode === 'hospital' ? 'Hospital Access Risk Increased' : `${DEPT_DISPLAY_NAMES[DEPT_MAP[selectedNode]] || 'Department'} Stalled`}
                </h3>
                <div className="rdp-grid">
                  <div className="rdp-item">
                    <span className="rdp-item-label">SIMULATED PROBLEM</span>
                    <span className="rdp-item-value" id="rdpOrigin">
                      {simData.simulated_delay_days} days delay in {DEPT_DISPLAY_NAMES[simData.root_department] || simData.root_department} propagating downstream.
                    </span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">AFFECTED SECTORS</span>
                    <span className="rdp-item-value" id="rdpDepts">
                      {getDeptFriendlyList(simData.cascade_path)}
                    </span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">AFFECTED PROJECTS</span>
                    <span className="rdp-item-value" id="rdpProjects">
                      Stalls {simData.metrics.total_projects_blocked} active municipal infrastructure works.
                    </span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">ESTIMATED DELAY</span>
                    <span className="rdp-item-value rdp-critical" id="rdpDelay">
                      +{simData.simulated_delay_days} days cascade delay projected
                    </span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">CITIZEN IMPACT</span>
                    <span className="rdp-item-value" id="rdpCitizen">
                      Disrupts services for {simData.metrics.citizens_impacted.toLocaleString('en-IN')}+ citizens.
                    </span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">FINANCIAL LOSS</span>
                    <span className="rdp-item-value rdp-critical" id="rdpFinancial">
                      Additional burn ₹{(simData.metrics.additional_idle_burn / 100000).toFixed(1)} Lac. Exposure: ₹{(simData.metrics.projected_cost_exposure / 10000000).toFixed(1)} Cr.
                    </span>
                  </div>
                </div>
                <button 
                  className="rdp-action-btn" 
                  id="rdpAction"
                  onClick={() => onIssueDirection(DECISION_KEYS[selectedNode])}
                >
                  View Related Decision
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
