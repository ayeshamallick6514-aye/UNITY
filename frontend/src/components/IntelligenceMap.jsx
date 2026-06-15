import React from 'react';

export default function IntelligenceMap() {
  const handleOpenMap = () => {
    alert('Full Governance Map — integration with GIS layer pending. This would open the city-wide spatial command interface.');
  };

  return (
    <section className="section map-section" id="s-map">
      <div className="section-container">
        <div className="section-header">
          <div className="section-label">SECTION 07 / 07 — SPATIAL INTELLIGENCE</div>
          <h2 className="section-title">UNITY Intelligence Map</h2>
          <p className="section-desc">Conflict locations, dependency hotspots, and affected public infrastructure — each marker represents an active coordination failure with a specific administrative decision attached to it.</p>
        </div>

        <div className="map-layout">
          <div className="map-canvas-wrap">
            <div className="map-canvas" id="mapCanvas">
              <svg id="mapSVG" width="100%" height="100%" viewBox="0 0 700 480" preserveAspectRatio="xMidYMid meet">
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2228" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="700" height="480" fill="#12151a"/>
                <rect width="700" height="480" fill="url(#grid)"/>

                {/* Simulated road network */}
                {/* Major roads */}
                <line x1="0" y1="240" x2="700" y2="240" stroke="#1e2a3a" strokeWidth="8"/>
                <line x1="350" y1="0" x2="350" y2="480" stroke="#1e2a3a" strokeWidth="8"/>
                <line x1="0" y1="120" x2="700" y2="180" stroke="#1e2a3a" strokeWidth="5"/>
                <line x1="0" y1="360" x2="700" y2="320" stroke="#1e2a3a" strokeWidth="5"/>
                <line x1="120" y1="0" x2="80" y2="480" stroke="#1e2a3a" strokeWidth="4"/>
                <line x1="580" y1="0" x2="620" y2="480" stroke="#1e2a3a" strokeWidth="4"/>
                {/* Ring road */}
                <ellipse cx="350" cy="240" rx="250" ry="170" fill="none" stroke="#1e2a3a" strokeWidth="3" strokeDasharray="12 6"/>
                {/* Diagonal roads */}
                <line x1="80" y1="60" x2="620" y2="420" stroke="#1a2030" strokeWidth="3"/>
                <line x1="620" y1="60" x2="80" y2="420" stroke="#1a2030" strokeWidth="3"/>

                {/* Water body (lake Bhopal style) */}
                <ellipse cx="170" cy="160" rx="95" ry="60" fill="#0d1f35" stroke="#1a3050" strokeWidth="1.5"/>
                <text x="170" y="165" textAnchor="middle" fill="#2a4060" fontSize="9" fontFamily="IBM Plex Mono">UPPER LAKE</text>

                {/* Zone areas */}
                <rect x="300" y="90" width="180" height="130" rx="4" fill="#b5451b" fillOpacity="0.08" stroke="#b5451b" strokeWidth="1" strokeDasharray="4 3"/>
                <rect x="180" y="250" width="140" height="110" rx="4" fill="#c8a84b" fillOpacity="0.08" stroke="#c8a84b" strokeWidth="1" strokeDasharray="4 3"/>
                <rect x="450" y="280" width="160" height="140" rx="4" fill="#2d6a4f" fillOpacity="0.08" stroke="#2d6a4f" strokeWidth="1" strokeDasharray="4 3"/>

                {/* Zone labels */}
                <text x="390" y="115" textAnchor="middle" fill="#c8a84b" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">MP NAGAR</text>
                <text x="250" y="275" textAnchor="middle" fill="#c8a84b" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">ARERA COLONY</text>
                <text x="530" y="305" textAnchor="middle" fill="#c8a84b" fontSize="10" fontFamily="IBM Plex Mono" fontWeight="500">KOLAR</text>

                {/* MP Nagar critical marker */}
                <circle cx="390" cy="155" r="14" fill="#b5451b" fillOpacity="0.2" stroke="#b5451b" strokeWidth="2"/>
                <circle cx="390" cy="155" r="6" fill="#b5451b"/>
                <circle cx="390" cy="155" r="20" fill="none" stroke="#b5451b" strokeWidth="1" strokeDasharray="3 3" opacity="0.5">
                  <animate attributeName="r" from="14" to="30" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite"/>
                </circle>

                {/* Arera Colony moderate marker */}
                <circle cx="250" cy="305" r="10" fill="#c8a84b" fillOpacity="0.2" stroke="#c8a84b" strokeWidth="2"/>
                <circle cx="250" cy="305" r="5" fill="#c8a84b"/>

                {/* Kolar moderate marker */}
                <circle cx="530" cy="340" r="10" fill="#c8a84b" fillOpacity="0.2" stroke="#c8a84b" strokeWidth="2"/>
                <circle cx="530" cy="340" r="5" fill="#c8a84b"/>

                {/* AIIMS Bhopal marker (critical - Health/Water conflict) */}
                <circle cx="200" cy="330" r="16" fill="#d4521f" fillOpacity="0.15" stroke="#d4521f" strokeWidth="2"/>
                <circle cx="200" cy="330" r="7" fill="#d4521f"/>
                <circle cx="200" cy="330" r="22" fill="none" stroke="#d4521f" strokeWidth="1" strokeDasharray="3 3" opacity="0.6">
                  <animate attributeName="r" from="16" to="32" dur="1.8s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite"/>
                </circle>
                <text x="200" y="356" textAnchor="middle" fill="#d4521f" fontSize="9" fontFamily="IBM Plex Mono" fontWeight="600">AIIMS BHOPAL</text>

                {/* Emergency Route overlay (Kolar Road narrowed) */}
                <line x1="390" y1="155" x2="530" y2="340" stroke="#d4521f" strokeWidth="2.5" strokeDasharray="8,4" opacity="0.5"/>
                <text x="485" y="255" textAnchor="middle" fill="#c8a84b" fontSize="8" fontFamily="IBM Plex Mono" transform="rotate(-42 485 255)">EMERGENCY ROUTE RISK</text>
                {/* Road label overlays */}
                <text x="390" y="240" fill="#2a3850" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle">KOLAR ROAD</text>
                <text x="200" y="240" fill="#2a3850" fontSize="8" fontFamily="IBM Plex Mono" textAnchor="middle">DB CITY</text>

                {/* Scale and compass */}
                <line x1="30" y1="450" x2="110" y2="450" stroke="#2a3040" strokeWidth="2"/>
                <line x1="30" y1="446" x2="30" y2="454" stroke="#2a3040" strokeWidth="2"/>
                <line x1="110" y1="446" x2="110" y2="454" stroke="#2a3040" strokeWidth="2"/>
                <text x="70" y="444" textAnchor="middle" fill="#2a3040" fontSize="8" fontFamily="IBM Plex Mono">5 KM</text>

                {/* Compass */}
                <text x="668" y="25" textAnchor="middle" fill="#2a3040" fontSize="11" fontFamily="IBM Plex Mono" fontWeight="500">N</text>
                <line x1="668" y1="28" x2="668" y2="44" stroke="#2a3040" strokeWidth="1.5"/>
                <polygon points="668,28 665,38 668,36 671,38" fill="#2a3040"/>
              </svg>

              {/* Map overlay legend */}
              <div className="map-legend">
                <div className="map-legend-item">
                  <span className="ml-dot ml-critical"></span>
                  <span>Conflict Location</span>
                </div>
                <div className="map-legend-item">
                  <span className="ml-dot ml-watch"></span>
                  <span>Dependency Hotspot</span>
                </div>
                <div className="map-legend-item">
                  <span className="ml-dot ml-nominal"></span>
                  <span>Affected Zone</span>
                </div>
                <div className="map-legend-item">
                  <span className="ml-line-risk"></span>
                  <span>Emergency Route Risk</span>
                </div>
              </div>
            </div>

            <div className="map-zones-panel">
              <div className="mzp-title">COORDINATION CONFLICT ZONES</div>
              <div className="mzp-zone mzp-critical">
                <div className="mzp-zone-header">
                  <span className="mzp-dot mzp-dot-critical"></span>
                  <span className="mzp-zone-name">MP Nagar</span>
                  <span className="mzp-zone-badge">CONFLICT</span>
                </div>
                <div className="mzp-zone-desc">Revenue to PWD -- 12-day land clearance stall</div>
                <div className="mzp-zone-count">2 dept conflicts -- 3 projects blocked</div>
                <div className="mzp-zone-action">Action: Revenue Commissioner clearance today</div>
              </div>
              <div className="mzp-zone mzp-critical">
                <div className="mzp-zone-header">
                  <span className="mzp-dot mzp-dot-critical"></span>
                  <span className="mzp-zone-name">AIIMS Bhopal</span>
                  <span className="mzp-zone-badge">HOSPITAL RISK</span>
                </div>
                <div className="mzp-zone-desc">Water Supply to Health -- pipeline schedule conflict</div>
                <div className="mzp-zone-count">400+ patients at risk -- OT/ICU water supply overlap</div>
                <div className="mzp-zone-action">Action: Reschedule maintenance to 23:00-04:00</div>
              </div>
              <div className="mzp-zone mzp-watch">
                <div className="mzp-zone-header">
                  <span className="mzp-dot mzp-dot-watch"></span>
                  <span className="mzp-zone-name">Kolar Corridor</span>
                  <span className="mzp-zone-badge mzp-badge-watch">ROUTE RISK</span>
                </div>
                <div className="mzp-zone-desc">Energy to PWD -- 19-day pole relocation stall</div>
                <div className="mzp-zone-count">Emergency route narrowed -- Rs 80K/day idle cost</div>
                <div className="mzp-zone-action">Action: 48-hr compliance notice to Energy Dept</div>
              </div>
              <div className="mzp-zone mzp-watch">
                <div className="mzp-zone-header">
                  <span className="mzp-dot mzp-dot-watch"></span>
                  <span className="mzp-zone-name">Arera Colony</span>
                  <span className="mzp-zone-badge mzp-badge-watch">HOTSPOT</span>
                </div>
                <div className="mzp-zone-desc">BMC Traffic to Transport -- diversion sign-off delayed</div>
                <div className="mzp-zone-count">2 projects blocked -- 12,000 vehicles/day affected</div>
                <div className="mzp-zone-action">Action: BMC Traffic Cell sign-off within 48 hrs</div>
              </div>
              <button className="map-full-btn" onClick={handleOpenMap}>Open UNITY Intelligence Map</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
