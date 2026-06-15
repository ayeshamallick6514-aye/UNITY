import React, { useState, useEffect } from 'react';

const RIPPLE_ORDER = ['revenue', 'land', 'road', 'utility', 'traffic', 'hospital'];

const rippleData = {
  revenue: {
    badge: 'ORIGIN — REVENUE DEPT',
    title: 'Revenue Clearance Delay',
    origin: 'Land acquisition counter-signature not issued by Revenue Commissioner — 12 days overdue',
    depts: 'PWD, Energy, Water Supply, Transport, Urban Planning (5 departments cascading)',
    projects: '11 projects blocked — MP Nagar Road Widening, Kolar Corridor, 9 downstream projects',
    delay: '45+ days if unresolved by Friday',
    citizen: '3,750+ citizens — 800 hospital patients, 2,400 students, 350 traders',
    financial: '₹2.3 Cr penalty clause activates Friday — ₹80,000/day idle contractor costs',
    decisionKey: 'dc1'
  },
  land: {
    badge: 'CASCADE 1 — LAND ACQUISITION',
    title: 'Land Acquisition Pending',
    origin: 'Revenue clearance not issued — title transfer blocked for MP Nagar Plot 47-B',
    depts: 'Revenue Department, Public Works Department',
    projects: 'MP Nagar Road Widening, Plot 47-B compensation case',
    delay: '12–20 days depending on Revenue response speed',
    citizen: '2,400 students on disrupted school transport routes',
    financial: '₹40,000/day contractor idle cost — penalty clause approaching activation',
    decisionKey: 'dc1'
  },
  road: {
    badge: 'CASCADE 2 — PWD',
    title: 'Road Widening Delayed',
    origin: 'Foundation work halted — contractor M/s Patel Infrastructure demobilized',
    depts: 'Public Works Department',
    projects: 'MP Nagar Road Widening Phase 2 — 3 downstream utility projects also held',
    delay: '45 days projected total delay from contract start',
    citizen: '800+ residents — emergency vehicle route narrowed',
    financial: '₹2.3 Cr contract penalty + ₹80,000/day idle costs accumulating',
    decisionKey: 'dc1'
  },
  utility: {
    badge: 'CASCADE 3 — ENERGY DEPT',
    title: 'Utility Relocation Delayed',
    origin: '15 MPEB poles unshifted — Energy field teams not deployed for 19 days',
    depts: 'Energy Department (MPEB), Public Works Department',
    projects: 'Kolar Road Utility Relocation, Traffic Signal Infrastructure, Emergency Route Widening',
    delay: '19 days elapsed — 30+ days projected if compliance notice not issued today',
    citizen: 'Emergency route effectively narrowed — ambulance response time at risk',
    financial: '₹80,000/day idle contractor cost — total exposure Rs 15.2 Lakh so far',
    decisionKey: 'dc3'
  },
  traffic: {
    badge: 'CASCADE 4 — TRAFFIC + URBAN',
    title: 'Traffic Diversion Delayed',
    origin: 'BMC Traffic Cell has not processed diversion sign-off — 6 days in queue',
    depts: 'Transport Department, Municipal Corporation, Urban Planning',
    projects: '2 active contractor sites blocked — Kolar signal infrastructure, Arera Colony diversion',
    delay: '6 days elapsed — escalates to critical within 3 days',
    citizen: 'Daily commuters on 2 major corridors affected — estimated 12,000 vehicles/day',
    financial: 'Contractor extensions required — ₹18 Lakh in avoidable rescheduling costs',
    decisionKey: 'dc3'
  },
  hospital: {
    badge: 'TERMINAL IMPACT — CITIZENS',
    title: 'Hospital Access Risk Increased',
    origin: 'Cascading failures from Revenue, Energy, and Water Supply unresolved decisions',
    depts: 'All 5 blocked departments — Revenue, PWD, Energy, Water Supply, Health',
    projects: 'AIIMS Pipeline, Kolar Road Widening, MP Nagar Road Widening, Water Main Maintenance',
    delay: 'Immediate — ongoing right now',
    citizen: 'AIIMS Bhopal: 400+ daily patients. 3 schools: 2,400 students. Emergency route: ambulance risk. 4 market zones: 350 traders.',
    financial: 'Total projected liability: ₹3.7 Cr — avoidable with decisions taken today',
    decisionKey: 'dc2'
  },
};

export default function RippleEffect({ onIssueDirection }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeCascade, setActiveCascade] = useState({});
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    // Clean up timers on unmount
    return () => timers.forEach(clearTimeout);
  }, [timers]);

  // Auto-trigger revenue node on first load to match the vanilla behavior
  useEffect(() => {
    const autoTriggerTimer = setTimeout(() => {
      handleNodeClick('revenue');
    }, 800);
    return () => clearTimeout(autoTriggerTimer);
  }, []);

  const handleNodeClick = (key) => {
    setSelectedNode(key);
    setActiveCascade({});

    const clickedIdx = RIPPLE_ORDER.indexOf(key);
    if (clickedIdx === -1) return;

    // Clear previous timers
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
  };

  const selectedData = rippleData[selectedNode];

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
            {!selectedNode ? (
              <div className="rdp-empty" id="rdpEmpty">
                <div className="rdp-empty-icon">⬡</div>
                <div className="rdp-empty-label">Select any node in the chain to view its impact analysis</div>
              </div>
            ) : (
              <div className="rdp-content" id="rdpContent">
                <div className="rdp-badge" id="rdpBadge">{selectedData.badge}</div>
                <h3 className="rdp-title" id="rdpTitle">{selectedData.title}</h3>
                <div className="rdp-grid">
                  <div className="rdp-item">
                    <span className="rdp-item-label">ORIGIN PROBLEM</span>
                    <span className="rdp-item-value" id="rdpOrigin">{selectedData.origin}</span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">AFFECTED DEPARTMENTS</span>
                    <span className="rdp-item-value" id="rdpDepts">{selectedData.depts}</span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">AFFECTED PROJECTS</span>
                    <span className="rdp-item-value" id="rdpProjects">{selectedData.projects}</span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">ESTIMATED DELAY</span>
                    <span className="rdp-item-value rdp-critical" id="rdpDelay">{selectedData.delay}</span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">CITIZEN IMPACT</span>
                    <span className="rdp-item-value" id="rdpCitizen">{selectedData.citizen}</span>
                  </div>
                  <div className="rdp-item">
                    <span className="rdp-item-label">FINANCIAL IMPACT</span>
                    <span className="rdp-item-value rdp-critical" id="rdpFinancial">{selectedData.financial}</span>
                  </div>
                </div>
                <button 
                  className="rdp-action-btn" 
                  id="rdpAction"
                  onClick={() => onIssueDirection(selectedData.decisionKey)}
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
