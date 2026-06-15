import React, { useState, useEffect } from 'react';

const modalData = {
  dc1: {
    title: 'MP Nagar Road Widening — Revenue Clearance',
    body: `
      <p style="margin-bottom:14px">The Revenue Commissioner's office has not processed the land acquisition counter-signature for 12 days. The contractor (M/s Patel Infrastructure) has flagged this as a blocking issue and has formally requested extension approval.</p>
      <p style="margin-bottom:14px">Under the contract terms (Clause 14.3), delays beyond 15 working days trigger a penalty waiver provision. <strong style="color:#e8e0d0">Friday is the deadline.</strong></p>
      <p style="margin-bottom:14px">Recommended course of action: Direct the Revenue Commissioner to convene an emergency clearance session today. Assign a nodal officer to track daily until resolution.</p>
      <div style="background:#0e1016;border:1px solid #242a38;padding:14px;margin-top:16px">
        <div style="font-family:IBM Plex Mono;font-size:9px;letter-spacing:0.18em;color:#55637a;margin-bottom:8px">FILE REFERENCE</div>
        <div style="font-family:IBM Plex Mono;font-size:11px;color:#8a9bb5">BMC/INFRA/2026/0341 — MP Nagar Road Widening Phase 2</div>
      </div>
    `,
    actions: ['Initiate Review Meeting', 'Escalate to Commissioner', 'Request Status Report'],
  },
  dc2: {
    title: 'AIIMS Pipeline Upgrade — Maintenance Conflict',
    body: `
      <p style="margin-bottom:14px">The Water Supply Department has scheduled a 6-hour water main maintenance window (08:00–14:00) that directly overlaps with AIIMS Bhopal's operational peak hours. The hospital has flagged this as a potential patient safety risk.</p>
      <p style="margin-bottom:14px">AIIMS administration has formally requested either a night window (23:00–05:00) or a reduced-flow maintenance approach using parallel pipelines.</p>
      <p style="margin-bottom:14px">The Water Supply SE has indicated that a night window is technically feasible but requires coordination with hospital backup systems.</p>
    `,
    actions: ['Reschedule to Night Window', 'Request Technical Assessment', 'Coordinate with AIIMS Admin'],
  },
  dc3: {
    title: 'Energy Utility Relocation — Kolar Corridor',
    body: `
      <p style="margin-bottom:14px">15 MPEB electrical poles in the Kolar Road corridor remain unshifted despite a formal relocation request filed 19 days ago. The Energy Department's field team has not been deployed.</p>
      <p style="margin-bottom:14px">The PWD contractor (M/s Sharma Constructions) has halted foundation work in the affected segment. Idle costs are accumulating at approximately ₹80,000 per day.</p>
      <p style="margin-bottom:14px">The MPEB Division Engineer has cited "resource reallocation" as the delay reason. A 48-hour compliance notice is recommended.</p>
    `,
    actions: ['Issue 48-Hour Notice', 'Escalate to Energy Secretary', 'Schedule Site Meeting'],
  },
};

export default function DecisionModal({ activeKey, onClose, onAuthorize, onLogAction }) {
  const [clickedActions, setClickedActions] = useState({});

  useEffect(() => {
    // Reset clicked actions when active key changes
    setClickedActions({});
  }, [activeKey]);

  useEffect(() => {
    // Escape key press handler
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activeKey || !modalData[activeKey]) return null;

  const data = modalData[activeKey];

  const handleActionClick = (actionLabel, index) => {
    setClickedActions(prev => ({ ...prev, [index]: true }));

    if (index === 0) {
      // Primary action represents authorizing direction
      onAuthorize(activeKey, actionLabel);
    } else {
      // Secondary action represents custom action logged
      onLogAction(activeKey, actionLabel);
    }
  };

  return (
    <div 
      className="modal-overlay active" 
      id="modalOverlay"
      onClick={(e) => {
        if (e.target.id === 'modalOverlay') onClose();
      }}
    >
      <div className="modal-container">
        <button className="modal-close" id="modalClose" onClick={onClose}>×</button>
        <div className="modal-header">
          <h2 className="modal-title" id="modalTitle">{data.title}</h2>
        </div>
        <div 
          className="modal-body" 
          id="modalBody" 
          dangerouslySetInnerHTML={{ __html: data.body }}
        ></div>
        <div className="modal-actions" id="modalActions">
          {data.actions.map((action, index) => (
            <button
              key={index}
              className={index === 0 ? 'modal-action-primary' : 'modal-action-secondary'}
              disabled={clickedActions[index]}
              onClick={() => handleActionClick(action, index)}
            >
              {clickedActions[index] ? '✓ Logged' : action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
