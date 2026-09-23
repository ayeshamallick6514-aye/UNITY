import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

// CRI-colored project icon
const createProjectIcon = (statusLevel, cri) => {
  const color =
    statusLevel === 'critical' ? '#DC2626' :
    statusLevel === 'moderate' ? '#F59E0B' :
    '#10B981';

  const pulse =
    statusLevel === 'critical' ? '#FCA5A5' :
    statusLevel === 'moderate' ? '#FCD34D' :
    '#6EE7B7';

  return L.divIcon({
    html: `
      <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <span style="
          position:absolute;width:28px;height:28px;border-radius:50%;
          background:${pulse};opacity:0.5;
          animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
        "></span>
        <span style="
          position:relative;width:20px;height:20px;border-radius:50%;
          background:${color};border:2.5px solid white;
          box-shadow:0 0 0 2px ${color}40;
          display:flex;align-items:center;justify-content:center;
          font-size:9px;font-weight:800;color:white;font-family:monospace;
        ">${cri}</span>
      </div>
      <style>
        @keyframes ping {
          75%,100%{transform:scale(2);opacity:0}
        }
      </style>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Conflict zone circle config
const CONFLICT_ZONES = [
  {
    id: 'cz1',
    center: [23.2324, 77.4294],
    radius: 320,
    color: '#DC2626',
    project: 'MP Nagar Road Widening',
    status: 'critical',
  },
  {
    id: 'cz2',
    center: [23.2038, 77.4475],
    radius: 240,
    color: '#DC2626',
    project: 'AIIMS Pipeline Upgrade',
    status: 'critical',
  },
  {
    id: 'cz3',
    center: [23.1812, 77.4087],
    radius: 280,
    color: '#DC2626',
    project: 'Kolar Road Utility Relocation',
    status: 'critical',
  },
  {
    id: 'cz4',
    center: [23.2650, 77.4120],
    radius: 350,
    color: '#F59E0B',
    project: 'Bhopal Metro Orange Line',
    status: 'moderate',
  },
  {
    id: 'cz5',
    center: [23.2185, 77.3892],
    radius: 300,
    color: '#DC2626',
    project: 'Bhadbhada Junction Flyover',
    status: 'critical',
  },
  {
    id: 'cz6',
    center: [23.1890, 77.4480],
    radius: 320,
    color: '#F59E0B',
    project: 'Hoshangabad Road Corridor',
    status: 'moderate',
  },
  {
    id: 'cz7',
    center: [23.2510, 77.3750],
    radius: 380,
    color: '#DC2626',
    project: 'Upper Lake 50 MLD STP Project',
    status: 'critical',
  },
  {
    id: 'cz8',
    center: [23.2625, 77.3980],
    radius: 250,
    color: '#DC2626',
    project: 'Hamidia Hospital Smart Corridor',
    status: 'critical',
  },
];

const PROJECT_LOCATIONS = [
  {
    id: 'proj_mp_nagar',
    name: 'MP Nagar Road Widening',
    coords: [23.2324, 77.4294],
    statusLevel: 'critical',
    cri: 28,
    status: 'blocked',
    blockingDept: 'Revenue Dept',
    daysStalled: 12,
    budget: '₹14.5 Cr',
    financialRisk: '₹2.3 Cr penalty in 3 days',
    citizens: 2400,
  },
  {
    id: 'proj_aiims',
    name: 'AIIMS Pipeline Upgrade',
    coords: [23.2038, 77.4475],
    statusLevel: 'moderate',
    cri: 58,
    status: 'blocked',
    blockingDept: 'Water Supply Dept',
    daysStalled: 8,
    budget: '₹3.5 Cr',
    financialRisk: 'No penalty yet — 10 days window',
    citizens: 800,
  },
  {
    id: 'proj_kolar',
    name: 'Kolar Road Utility Relocation',
    coords: [23.1812, 77.4087],
    statusLevel: 'critical',
    cri: 35,
    status: 'blocked',
    blockingDept: 'Energy Dept (MPEB)',
    daysStalled: 19,
    budget: '₹5.2 Cr',
    financialRisk: '⚠ Penalty activated — ₹8L',
    citizens: 1200,
  },
  {
    id: 'proj_bhopal_metro',
    name: 'Bhopal Metro Orange Line (Subhash Nagar to Karond)',
    coords: [23.2650, 77.4120],
    statusLevel: 'moderate',
    cri: 54,
    status: 'blocked',
    blockingDept: 'Energy Dept (MPEB)',
    daysStalled: 18,
    budget: '₹215.0 Cr',
    financialRisk: '₹4.5 Cr penalty in 5 days',
    citizens: 4500,
  },
  {
    id: 'proj_bhadbhada_flyover',
    name: 'Bhadbhada Junction 4-Lane Flyover',
    coords: [23.2185, 77.3892],
    statusLevel: 'critical',
    cri: 38,
    status: 'blocked',
    blockingDept: 'Revenue Dept',
    daysStalled: 22,
    budget: '₹85.0 Cr',
    financialRisk: '₹1.2 Cr penalty in 8 days',
    citizens: 3200,
  },
  {
    id: 'proj_hoshangabad_brts',
    name: 'Hoshangabad Road Corridor Redesign & Drain Network',
    coords: [23.1890, 77.4480],
    statusLevel: 'moderate',
    cri: 62,
    status: 'blocked',
    blockingDept: 'Energy Dept (MPEB)',
    daysStalled: 15,
    budget: '₹120.0 Cr',
    financialRisk: '₹1.8 Cr penalty in 12 days',
    citizens: 2800,
  },
  {
    id: 'proj_upper_lake_stp',
    name: 'Upper Lake Catchment 50 MLD STP Project',
    coords: [23.2510, 77.3750],
    statusLevel: 'critical',
    cri: 30,
    status: 'blocked',
    blockingDept: 'Water Supply Dept',
    daysStalled: 26,
    budget: '₹165.0 Cr',
    financialRisk: '⚠ Critical penalty in 2 days — ₹2.8 Cr',
    citizens: 18000,
  },
  {
    id: 'proj_hamidia_smart_corridor',
    name: 'Hamidia Hospital Smart Transit Access Corridor',
    coords: [23.2625, 77.3980],
    statusLevel: 'critical',
    cri: 32,
    status: 'blocked',
    blockingDept: 'Revenue Dept',
    daysStalled: 31,
    budget: '₹48.0 Cr',
    financialRisk: '⚠ Penalty activated — ₹75L',
    citizens: 1500,
  },
];

// Road closure corridor
const CLOSURE_CORRIDOR = [
  [23.2350, 77.4260],
  [23.2310, 77.4320],
];

export default function UnityMap({ activeLayers = [] }) {
  const navigate = useNavigate();

  const showProjects = activeLayers.includes('road_projects') || activeLayers.length === 0;
  const showClosures = activeLayers.includes('road_closures');
  const showConflicts = activeLayers.includes('conflict_zones') || activeLayers.length === 0;

  return (
    <div className="w-full h-full relative bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Conflict zone circles */}
        {showConflicts && CONFLICT_ZONES.map(zone => (
          <Circle
            key={zone.id}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '6 4',
            }}
          />
        ))}

        {/* Road closure corridor */}
        {showClosures && (
          <Polyline
            positions={CLOSURE_CORRIDOR}
            pathOptions={{ color: '#F59E0B', weight: 5, opacity: 0.8, dashArray: '8 6' }}
          />
        )}

        {/* Project markers with CRI score */}
        {showProjects && PROJECT_LOCATIONS.map(p => (
          <Marker
            key={p.id}
            position={p.coords}
            icon={createProjectIcon(p.statusLevel, p.cri)}
          >
            <Popup minWidth={240} maxWidth={280}>
              <div className="font-sans py-1">
                {/* Status header */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                  <span className="text-[11px] font-bold text-gray-900 max-w-[160px] leading-tight">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-red-600 uppercase tracking-wider">
                    Blocked
                  </span>
                </div>

                {/* CRI Score */}
                <div className="flex items-center gap-2.5 mb-2 p-2 bg-red-50/50 rounded-md border border-red-200">
                  <div className="text-center">
                    <div className="text-xl font-black text-red-600 leading-none">{p.cri}</div>
                    <div className="text-[9px] text-gray-400 font-mono">CRI</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-red-600">Critical</div>
                    <div className="text-[9px] text-gray-500">Exec action required</div>
                  </div>
                </div>

                {/* Details */}
                <table className="w-full text-[10px] border-collapse">
                  <tbody>
                    <tr>
                      <td className="text-gray-500 pb-1">Blocking Dept</td>
                      <td className="font-semibold text-red-600 text-right pb-1">{p.blockingDept}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 pb-1">Days Stalled</td>
                      <td className="font-semibold text-gray-900 text-right pb-1">{p.daysStalled}d</td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 pb-1">Budget</td>
                      <td className="font-semibold text-gray-900 text-right pb-1">{p.budget}</td>
                    </tr>
                    <tr>
                      <td className="text-gray-500 pb-1">Citizens</td>
                      <td className="font-semibold text-gray-900 text-right pb-1">{p.citizens.toLocaleString()} affected</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="pt-1 text-amber-600 text-[9px] font-semibold">
                        {p.financialRisk}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Action button */}
                <button
                  onClick={() => navigate(`/authority/projects/${p.id}`)}
                  className="w-full mt-2.5 py-1.5 bg-blue-600 text-white border-0 rounded-md text-[11px] font-semibold hover:bg-blue-700 transition-colors cursor-pointer text-center"
                >
                  Open Project Workspace →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend overlay */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white border border-gray-200 rounded-lg p-2.5 shadow-md text-[10px] font-sans">
        <div className="font-bold text-gray-700 mb-1.5 text-[9px] uppercase tracking-wider">
          CRI Legend
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shrink-0 bg-red-600" />
            <span className="text-gray-500">Critical (CRI &lt; 50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shrink-0 bg-amber-500" />
            <span className="text-gray-500">Moderate (50–79)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full shrink-0 bg-emerald-500" />
            <span className="text-gray-500">Ready (80+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
