import React from 'react';

export default function NetworkGraph() {
  return (
    <section className="section l2-section network-section" id="s-network">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">LAYER II — NETWORK</div>
          <h2 className="section-title">Dependency Network Graph</h2>
          <p className="section-desc">Live inter-department dependency map — red dashed edges indicate blocked coordination chains. Green edges are resolved.</p>
        </div>
        <div className="network-layout">
          <div className="network-legend">
            <div className="nl-item"><span className="nl-edge nl-edge-broken"></span><span>Blocked / Stalled Link</span></div>
            <div className="nl-item"><span className="nl-edge nl-edge-resolved"></span><span>Resolved Link</span></div>
            <div className="nl-item"><span className="nl-edge nl-edge-partial"></span><span>At Risk / Partial Delay</span></div>
          </div>
          <div className="network-canvas-wrap">
            <svg className="network-svg" viewBox="0 0 960 380" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arr-blocked" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                  <path d="M0,0 L9,3.5 L0,7 Z" fill="#d4521f"/>
                </marker>
                <marker id="arr-resolved" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                  <path d="M0,0 L9,3.5 L0,7 Z" fill="#3a8c66"/>
                </marker>
                <marker id="arr-partial" markerWidth="9" markerHeight="9" refX="7" refY="3.5" orient="auto">
                  <path d="M0,0 L9,3.5 L0,7 Z" fill="#c8a84b"/>
                </marker>
              </defs>
              <rect width="960" height="380" fill="#0b0e14"/>
              <line x1="0" y1="190" x2="960" y2="190" stroke="#1a1f2a" strokeWidth="1"/>
              
              <line x1="178" y1="110" x2="294" y2="110" stroke="#d4521f" strokeWidth="2.5" strokeDasharray="9,5" markerEnd="url(#arr-blocked)"/>
              <text x="236" y="102" textAnchor="middle" fill="#b5451b" fontSize="9" fontFamily="IBM Plex Mono">12d BLOCKED</text>
              
              <line x1="398" y1="110" x2="514" y2="110" stroke="#d4521f" strokeWidth="2.5" strokeDasharray="9,5" markerEnd="url(#arr-blocked)"/>
              <text x="456" y="102" textAnchor="middle" fill="#b5451b" fontSize="9" fontFamily="IBM Plex Mono">19d STALLED</text>
              
              <line x1="618" y1="110" x2="734" y2="110" stroke="#c8a84b" strokeWidth="2" strokeDasharray="7,4" markerEnd="url(#arr-partial)"/>
              <text x="676" y="102" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="IBM Plex Mono">AT RISK</text>
              
              <line x1="838" y1="110" x2="895" y2="110" stroke="#c8a84b" strokeWidth="1.5" strokeDasharray="7,4" markerEnd="url(#arr-partial)"/>
              
              <g className="network-node" data-node="revenue">
                <rect x="20" y="76" width="158" height="68" rx="3" fill="#140a08" stroke="#b5451b" strokeWidth="2"/>
                <rect x="20" y="76" width="158" height="4" rx="1" fill="#b5451b"/>
                <text x="99" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Revenue Dept</text>
                <text x="99" y="122" textAnchor="middle" fill="#d4521f" fontSize="9" fontFamily="IBM Plex Mono">BLOCKING -- 7 deps</text>
                <text x="99" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">Rank #1 Bottleneck</text>
              </g>
              <g className="network-node" data-node="pwd">
                <rect x="298" y="76" width="100" height="68" rx="3" fill="#0e1219" stroke="#c8a84b" strokeWidth="1.5"/>
                <rect x="298" y="76" width="100" height="4" rx="1" fill="#c8a84b"/>
                <text x="348" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">PWD</text>
                <text x="348" y="122" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="IBM Plex Mono">WAITING</text>
                <text x="348" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">12 days</text>
              </g>
              <g className="network-node" data-node="energy">
                <rect x="518" y="76" width="100" height="68" rx="3" fill="#140a08" stroke="#b5451b" strokeWidth="1.5"/>
                <rect x="518" y="76" width="100" height="4" rx="1" fill="#b5451b"/>
                <text x="568" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Energy</text>
                <text x="568" y="122" textAnchor="middle" fill="#d4521f" fontSize="9" fontFamily="IBM Plex Mono">STALLED</text>
                <text x="568" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">19 days</text>
              </g>
              <g className="network-node" data-node="water">
                <rect x="738" y="76" width="100" height="68" rx="3" fill="#0e1219" stroke="#c8a84b" strokeWidth="1.5"/>
                <rect x="738" y="76" width="100" height="4" rx="1" fill="#c8a84b"/>
                <text x="788" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Water Supply</text>
                <text x="788" y="122" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="IBM Plex Mono">AT RISK</text>
                <text x="788" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">8 days</text>
              </g>
              <line x1="99" y1="228" x2="788" y2="144" stroke="#d4521f" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-blocked)" opacity="0.6"/>
              <g className="network-node" data-node="health">
                <rect x="20" y="194" width="158" height="68" rx="3" fill="#0e1219" stroke="#3a8c66" strokeWidth="1.5"/>
                <rect x="20" y="194" width="158" height="4" rx="1" fill="#3a8c66"/>
                <text x="99" y="223" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Health Dept</text>
                <text x="99" y="240" textAnchor="middle" fill="#3a8c66" fontSize="9" fontFamily="IBM Plex Mono">REQUESTING</text>
                <text x="99" y="254" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">Awaiting schedule fix</text>
              </g>
              <line x1="178" y1="140" x2="514" y2="254" stroke="#d4521f" strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arr-blocked)" opacity="0.5"/>
              <g className="network-node" data-node="urban">
                <rect x="518" y="220" width="100" height="68" rx="3" fill="#0e1219" stroke="#c8a84b" strokeWidth="1.5"/>
                <rect x="518" y="220" width="100" height="4" rx="1" fill="#c8a84b"/>
                <text x="568" y="249" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Urban Plan</text>
                <text x="568" y="266" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="IBM Plex Mono">WAITING</text>
                <text x="568" y="280" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">5 days</text>
              </g>
              <g className="network-node" data-node="transport">
                <rect x="738" y="194" width="100" height="68" rx="3" fill="#0e1219" stroke="#c8a84b" strokeWidth="1.5"/>
                <rect x="738" y="194" width="100" height="4" rx="1" fill="#c8a84b"/>
                <text x="788" y="223" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Transport</text>
                <text x="788" y="240" textAnchor="middle" fill="#c8a84b" fontSize="9" fontFamily="IBM Plex Mono">PENDING</text>
                <text x="788" y="254" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">6 days</text>
              </g>
              <line x1="568" y1="288" x2="480" y2="315" stroke="#b5451b" strokeWidth="1" opacity="0.35"/>
              <line x1="788" y1="262" x2="480" y2="315" stroke="#b5451b" strokeWidth="1" opacity="0.35"/>
              <line x1="348" y1="144" x2="480" y2="315" stroke="#b5451b" strokeWidth="1" opacity="0.2"/>
              <g className="network-node" data-node="citizens">
                <rect x="380" y="315" width="200" height="52" rx="3" fill="#1a0808" stroke="#b5451b" strokeWidth="2"/>
                <rect x="380" y="315" width="200" height="4" rx="1" fill="#b5451b"/>
                <text x="480" y="341" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Citizens of Bhopal</text>
                <text x="480" y="357" textAnchor="middle" fill="#d4521f" fontSize="9" fontFamily="IBM Plex Mono">3,750+ IMPACTED</text>
              </g>
              <g className="network-node" data-node="phe">
                <rect x="298" y="220" width="100" height="52" rx="3" fill="#0e1219" stroke="#3a8c66" strokeWidth="1.5"/>
                <rect x="298" y="220" width="100" height="4" rx="1" fill="#3a8c66"/>
                <text x="348" y="246" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">PHE Dept</text>
                <text x="348" y="262" textAnchor="middle" fill="#3a8c66" fontSize="9" fontFamily="IBM Plex Mono">MONITORING</text>
              </g>
            </svg>
          </div>
          <div className="network-status-bar">
            <div className="nsb-item"><span className="nsb-dot nsb-critical"></span><span className="nsb-label">4 Blocked Links</span></div>
            <div className="nsb-item"><span className="nsb-dot nsb-resolved"></span><span className="nsb-label">2 Resolved Links</span></div>
            <div className="nsb-item"><span className="nsb-dot nsb-partial"></span><span className="nsb-label">3 At-Risk Links</span></div>
            <div className="nsb-alert">5 departments blocked until Revenue and Energy clear their queues</div>
          </div>
        </div>
      </div>
    </section>
  );
}
