import React from 'react';

export default function NetworkGraph({ decisions }) {
  const isDc1Resolved = decisions?.dc1?.status === 'authorized';
  const isDc2Resolved = decisions?.dc2?.status === 'authorized';
  const isDc3Resolved = decisions?.dc3?.status === 'authorized';

  // Compute dynamic edge states
  const dc1EdgeColor = isDc1Resolved ? '#3a8c66' : '#d4521f';
  const dc1EdgeDash = isDc1Resolved ? 'none' : '9,5';
  const dc1Marker = isDc1Resolved ? 'url(#arr-resolved)' : 'url(#arr-blocked)';
  const dc1Text = isDc1Resolved ? 'RESOLVED' : '12d BLOCKED';
  const dc1TextColor = isDc1Resolved ? 'var(--nominal-light)' : '#b5451b';

  const dc3EdgeColor = isDc3Resolved ? '#3a8c66' : '#d4521f';
  const dc3EdgeDash = isDc3Resolved ? 'none' : '9,5';
  const dc3Marker = isDc3Resolved ? 'url(#arr-resolved)' : 'url(#arr-blocked)';
  const dc3Text = isDc3Resolved ? 'RESOLVED' : '19d STALLED';
  const dc3TextColor = isDc3Resolved ? 'var(--nominal-light)' : '#b5451b';

  const dc2EdgeColor = isDc2Resolved ? '#3a8c66' : '#c8a84b';
  const dc2EdgeDash = isDc2Resolved ? 'none' : '7,4';
  const dc2Marker = isDc2Resolved ? 'url(#arr-resolved)' : 'url(#arr-partial)';
  const dc2Text = isDc2Resolved ? 'RESOLVED' : 'AT RISK';
  const dc2TextColor = isDc2Resolved ? 'var(--nominal-light)' : '#c8a84b';

  // Dynamic status counters
  let blockedCount = 2; // MP Nagar, Kolar
  let atRiskCount = 1;  // AIIMS Pipeline
  let resolvedCount = 0;

  if (isDc1Resolved) { blockedCount--; resolvedCount++; }
  if (isDc3Resolved) { blockedCount--; resolvedCount++; }
  if (isDc2Resolved) { atRiskCount--; resolvedCount++; }

  const totalImpacted = isDc1Resolved && isDc2Resolved && isDc3Resolved ? 0 : 3750;

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
              
              {/* Edge 1: Revenue -> PWD */}
              <line x1="178" y1="110" x2="294" y2="110" stroke={dc1EdgeColor} strokeWidth="2.5" strokeDasharray={dc1EdgeDash} markerEnd={dc1Marker}/>
              <text x="236" y="102" textAnchor="middle" fill={dc1TextColor} fontSize="9" fontFamily="IBM Plex Mono">{dc1Text}</text>
              
              {/* Edge 2: Energy -> PWD */}
              <line x1="398" y1="110" x2="514" y2="110" stroke={dc3EdgeColor} strokeWidth="2.5" strokeDasharray={dc3EdgeDash} markerEnd={dc3Marker}/>
              <text x="456" y="102" textAnchor="middle" fill={dc3TextColor} fontSize="9" fontFamily="IBM Plex Mono">{dc3Text}</text>
              
              {/* Edge 3: Water Supply -> Health */}
              <line x1="618" y1="110" x2="734" y2="110" stroke={dc2EdgeColor} strokeWidth="2" strokeDasharray={dc2EdgeDash} markerEnd={dc2Marker}/>
              <text x="676" y="102" textAnchor="middle" fill={dc2TextColor} fontSize="9" fontFamily="IBM Plex Mono">{dc2Text}</text>
              
              <line x1="838" y1="110" x2="895" y2="110" stroke="#c8a84b" strokeWidth="1.5" strokeDasharray="7,4" markerEnd="url(#arr-partial)"/>
              
              {/* Node: Revenue */}
              <g className="network-node" data-node="revenue">
                <rect x="20" y="76" width="158" height="68" rx="3" fill={isDc1Resolved ? '#08140e' : '#140a08'} stroke={isDc1Resolved ? '#3a8c66' : '#b5451b'} strokeWidth="2"/>
                <rect x="20" y="76" width="158" height="4" rx="1" fill={isDc1Resolved ? '#3a8c66' : '#b5451b'}/>
                <text x="99" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Revenue Dept</text>
                <text x="99" y="122" textAnchor="middle" fill={isDc1Resolved ? '#3a8c66' : '#d4521f'} fontSize="9" fontFamily="IBM Plex Mono">
                  {isDc1Resolved ? 'CLEARANCE GRANTED' : 'BLOCKING -- 7 deps'}
                </text>
                <text x="99" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">
                  {isDc1Resolved ? 'Nominal Sector' : 'Rank #1 Bottleneck'}
                </text>
              </g>

              {/* Node: PWD */}
              <g className="network-node" data-node="pwd">
                <rect x="298" y="76" width="100" height="68" rx="3" fill="#0e1219" stroke={isDc1Resolved ? '#3a8c66' : '#c8a84b'} strokeWidth="1.5"/>
                <rect x="298" y="76" width="100" height="4" rx="1" fill={isDc1Resolved ? '#3a8c66' : '#c8a84b'}/>
                <text x="348" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">PWD</text>
                <text x="348" y="122" textAnchor="middle" fill={isDc1Resolved ? '#3a8c66' : '#c8a84b'} fontSize="9" fontFamily="IBM Plex Mono">
                  {isDc1Resolved ? 'PROCEEDING' : 'WAITING'}
                </text>
                <text x="348" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">
                  {isDc1Resolved ? 'Resumed paving' : '12 days'}
                </text>
              </g>

              {/* Node: Energy */}
              <g className="network-node" data-node="energy">
                <rect x="518" y="76" width="100" height="68" rx="3" fill={isDc3Resolved ? '#08140e' : '#140a08'} stroke={isDc3Resolved ? '#3a8c66' : '#b5451b'} strokeWidth="1.5"/>
                <rect x="518" y="76" width="100" height="4" rx="1" fill={isDc3Resolved ? '#3a8c66' : '#b5451b'}/>
                <text x="568" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Energy</text>
                <text x="568" y="122" textAnchor="middle" fill={isDc3Resolved ? '#3a8c66' : '#d4521f'} fontSize="9" fontFamily="IBM Plex Mono">
                  {isDc3Resolved ? 'RELOCATING' : 'STALLED'}
                </text>
                <text x="568" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">
                  {isDc3Resolved ? 'Poles clearance' : '19 days'}
                </text>
              </g>

              {/* Node: Water Supply */}
              <g className="network-node" data-node="water">
                <rect x="738" y="76" width="100" height="68" rx="3" fill="#0e1219" stroke={isDc2Resolved ? '#3a8c66' : '#c8a84b'} strokeWidth="1.5"/>
                <rect x="738" y="76" width="100" height="4" rx="1" fill={isDc2Resolved ? '#3a8c66' : '#c8a84b'}/>
                <text x="788" y="105" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Water Supply</text>
                <text x="788" y="122" textAnchor="middle" fill={isDc2Resolved ? '#3a8c66' : '#c8a84b'} fontSize="9" fontFamily="IBM Plex Mono">
                  {isDc2Resolved ? 'NOMINAL' : 'AT RISK'}
                </text>
                <text x="788" y="136" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">
                  {isDc2Resolved ? 'Night window' : '8 days'}
                </text>
              </g>

              <line x1="99" y1="228" x2="788" y2="144" stroke={isDc2Resolved ? '#3a8c66' : '#d4521f'} strokeWidth="1.5" strokeDasharray={isDc2Resolved ? 'none' : '6,4'} markerEnd={dc2Marker} opacity="0.6"/>
              
              {/* Node: Health */}
              <g className="network-node" data-node="health">
                <rect x="20" y="194" width="158" height="68" rx="3" fill="#0e1219" stroke="#3a8c66" strokeWidth="1.5"/>
                <rect x="20" y="194" width="158" height="4" rx="1" fill="#3a8c66"/>
                <text x="99" y="223" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Health Dept</text>
                <text x="99" y="240" textAnchor="middle" fill="#3a8c66" fontSize="9" fontFamily="IBM Plex Mono">REQUESTING</text>
                <text x="99" y="254" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">Awaiting schedule fix</text>
              </g>
              
              <line x1="178" y1="140" x2="514" y2="254" stroke={isDc1Resolved ? '#3a8c66' : '#d4521f'} strokeWidth="1.5" strokeDasharray={isDc1Resolved ? 'none' : '6,4'} markerEnd={dc1Marker} opacity="0.5"/>
              
              {/* Node: Urban Plan */}
              <g className="network-node" data-node="urban">
                <rect x="518" y="220" width="100" height="68" rx="3" fill="#0e1219" stroke={isDc1Resolved ? '#3a8c66' : '#c8a84b'} strokeWidth="1.5"/>
                <rect x="518" y="220" width="100" height="4" rx="1" fill={isDc1Resolved ? '#3a8c66' : '#c8a84b'}/>
                <text x="568" y="249" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Urban Plan</text>
                <text x="568" y="266" textAnchor="middle" fill={isDc1Resolved ? '#3a8c66' : '#c8a84b'} fontSize="9" fontFamily="IBM Plex Mono">
                  {isDc1Resolved ? 'NOMINAL' : 'WAITING'}
                </text>
                <text x="568" y="280" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">
                  {isDc1Resolved ? 'Sectors clear' : '5 days'}
                </text>
              </g>

              {/* Node: Transport */}
              <g className="network-node" data-node="transport">
                <rect x="738" y="194" width="100" height="68" rx="3" fill="#0e1219" stroke={isDc3Resolved ? '#3a8c66' : '#c8a84b'} strokeWidth="1.5"/>
                <rect x="738" y="194" width="100" height="4" rx="1" fill={isDc3Resolved ? '#3a8c66' : '#c8a84b'}/>
                <text x="788" y="223" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Transport</text>
                <text x="788" y="240" textAnchor="middle" fill={isDc3Resolved ? '#3a8c66' : '#c8a84b'} fontSize="9" fontFamily="IBM Plex Mono">
                  {isDc3Resolved ? 'NOMINAL' : 'PENDING'}
                </text>
                <text x="788" y="254" textAnchor="middle" fill="#3d4d62" fontSize="8" fontFamily="IBM Plex Mono">
                  {isDc3Resolved ? 'Permits clear' : '6 days'}
                </text>
              </g>
              
              <line x1="568" y1="288" x2="480" y2="315" stroke={isDc3Resolved ? '#3a8c66' : '#b5451b'} strokeWidth="1" opacity={isDc3Resolved ? 0.2 : 0.35}/>
              <line x1="788" y1="262" x2="480" y2="315" stroke={isDc3Resolved ? '#3a8c66' : '#b5451b'} strokeWidth="1" opacity={isDc3Resolved ? 0.2 : 0.35}/>
              <line x1="348" y1="144" x2="480" y2="315" stroke={isDc1Resolved ? '#3a8c66' : '#b5451b'} strokeWidth="1" opacity={isDc1Resolved ? 0.1 : 0.2}/>
              
              {/* Node: Citizens */}
              <g className="network-node" data-node="citizens">
                <rect x="380" y="315" width="200" height="52" rx="3" fill={totalImpacted === 0 ? '#08140e' : '#1a0808'} stroke={totalImpacted === 0 ? '#3a8c66' : '#b5451b'} strokeWidth="2"/>
                <rect x="380" y="315" width="200" height="4" rx="1" fill={totalImpacted === 0 ? '#3a8c66' : '#b5451b'}/>
                <text x="480" y="341" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">Citizens of Bhopal</text>
                <text x="480" y="357" textAnchor="middle" fill={totalImpacted === 0 ? '#3a8c66' : '#d4521f'} fontSize="9" fontFamily="IBM Plex Mono">
                  {totalImpacted === 0 ? 'SYSTEM NOMINAL — 0 IMPACTED' : `${totalImpacted.toLocaleString('en-IN')}+ IMPACTED`}
                </text>
              </g>

              {/* Node: PHE */}
              <g className="network-node" data-node="phe">
                <rect x="298" y="220" width="100" height="52" rx="3" fill="#0e1219" stroke="#3a8c66" strokeWidth="1.5"/>
                <rect x="298" y="220" width="100" height="4" rx="1" fill="#3a8c66"/>
                <text x="348" y="246" textAnchor="middle" fill="#e8e0d0" fontSize="12" fontFamily="IBM Plex Mono" fontWeight="500">PHE Dept</text>
                <text x="348" y="262" textAnchor="middle" fill="#3a8c66" fontSize="9" fontFamily="IBM Plex Mono">MONITORING</text>
              </g>
            </svg>
          </div>
          <div className="network-status-bar">
            <div className="nsb-item"><span className="nsb-dot nsb-critical" style={blockedCount === 0 ? { background: 'var(--text-dim)' } : {}}></span><span className="nsb-label">{blockedCount} Blocked Links</span></div>
            <div className="nsb-item"><span className="nsb-dot nsb-resolved"></span><span className="nsb-label">{resolvedCount} Resolved Links</span></div>
            <div className="nsb-item"><span className="nsb-dot nsb-partial" style={atRiskCount === 0 ? { background: 'var(--text-dim)' } : {}}></span><span className="nsb-label">{atRiskCount} At-Risk Links</span></div>
            <div className="nsb-alert">
              {blockedCount > 0 
                ? `${blockedCount} critical inter-department blocks active in this sector.`
                : 'All primary sector coordination links have resolved successfully.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
