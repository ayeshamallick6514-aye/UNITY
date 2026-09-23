'use strict';

/**
 * transportTourismRuralController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Multi-Domain Controller for MPOnline PS-5:
 *  1. Transport (Public transit fleet tracking, road safety, transport permit grievance logging)
 *  2. Tourism (Geo-tagged heritage asset monitoring, tourist grievance redressal, hospitality sync)
 *  3. Rural Development (Panchayat fund utilization, MGNREGA employment, rural infrastructure)
 */

// ─── 1. TRANSPORT DATA & TELEMETRY ───────────────────────────────────────────
const TRANSPORT_TELEMETRY = {
  zone: 'BHOPAL_METRO_ZONE_01',
  fleetOverview: {
    bcllCityBusesActive: 220,
    electricBusesActive: 85,
    dailyPassengerFootfall: '1,45,000',
    gpsTrackingCompliance: '100%',
    avgOnTimePerformance: '94.2%',
  },
  keyCorridors: [
    { routeNo: 'TR-01', name: 'Bairagarh to AIIMS Bhopal via MP Nagar', busesAssigned: 32, frequencyMin: 6, status: 'NORMAL' },
    { routeNo: 'TR-04', name: 'Karond Mandi to Mandideep Industrial Area', busesAssigned: 28, frequencyMin: 8, status: 'NORMAL' },
    { routeNo: 'TR-08', name: 'Bhopal Junction to Raja Bhoj Airport', busesAssigned: 14, frequencyMin: 15, status: 'NORMAL' },
    { routeNo: 'TR-11', name: 'ISBT Habibganj to Kolar Satellite Township', busesAssigned: 24, frequencyMin: 10, status: 'NORMAL' },
  ],
  permitsAndLicensing: {
    commercialPermitsActive: 12400,
    eChallansProcessedToday: 412,
    avgPermitRenewalDays: 2.1,
  },
  meta: {
    authority: 'Bhopal City Link Limited (BCLL) & Regional Transport Office (RTO Bhopal)',
    roleToken: '[ROLE: DISTRICT_TRANSPORT_OFFICER]',
    timestamp: new Date().toISOString(),
  }
};

const TRANSPORT_GRIEVANCES = [
  {
    refId: 'TRN-BPL-2026-9041',
    category: 'ROUTE_DEVIATION',
    routeNo: 'TR-04 (Karond - Mandideep)',
    description: 'Bus skipped MP Nagar Zone-1 scheduled stop during peak evening hour.',
    status: 'RESOLVED',
    resolution: 'Depot Manager issued warning to conductor; GPS playback confirmed skip and fine deducted.',
    filedAt: '20 Sep 2026',
    slaHours: 24,
  },
  {
    refId: 'TRN-BPL-2026-3312',
    category: 'OVERCHARGING_AUTO',
    routeNo: 'Habibganj Rani Kamlapati Station Stand',
    description: 'Pre-paid auto booth charging above prescribed RTO digital meter tariff.',
    status: 'INSPECTION_ORDERED',
    resolution: 'RTO Flying Squad assigned for on-site audit of station booth.',
    filedAt: '22 Sep 2026',
    slaHours: 24,
  }
];

const _filedTransportGrievances = [];

// ─── 2. TOURISM DATA & TELEMETRY ─────────────────────────────────────────────
const TOURISM_TELEMETRY = {
  zone: 'BHOPAL_CIRCUIT_HERITAGE',
  heritageSites: [
    {
      id: 'TOUR-SITE-01',
      name: 'Bhojtal (Upper Lake) & Van Vihar National Park',
      category: 'ECO_HERITAGE',
      dailyFootfall: 4200,
      cleanlinessIndex: '96/100 (Clean Lake Cell Audited)',
      certifiedGuidesActive: 18,
      evBoatsOperational: 12,
    },
    {
      id: 'TOUR-SITE-02',
      name: 'Madhya Pradesh Tribal Museum, Shyamla Hills',
      category: 'CULTURAL_HERITAGE',
      dailyFootfall: 2850,
      cleanlinessIndex: '99/100',
      certifiedGuidesActive: 24,
      audioGuideAvailability: '100% (Hindi, English, Malvi, Gondi)',
    },
    {
      id: 'TOUR-SITE-03',
      name: 'Bhimbetka Rock Shelters (UNESCO World Heritage)',
      category: 'UNESCO_HERITAGE',
      dailyFootfall: 3100,
      cleanlinessIndex: '98/100',
      certifiedGuidesActive: 30,
      monumentPreservationStatus: 'STABLE_ASI_MONITORED',
    },
    {
      id: 'TOUR-SITE-04',
      name: 'Taj-ul-Masajid & Old Bhopal Walled Heritage Core',
      category: 'HISTORICAL_ARCHITECTURE',
      dailyFootfall: 5200,
      cleanlinessIndex: '92/100',
      certifiedGuidesActive: 14,
      heritageSignageScore: '94/100',
    }
  ],
  hospitalityRegistry: {
    mptHotelsEmpaneled: 42,
    registeredHomestays: 118,
    touristHelpline1363Status: '24x7 OPERATIONAL',
  },
  meta: {
    authority: 'Madhya Pradesh Tourism Board (MPTB) & Archeological Survey of India',
    roleToken: '[ROLE: MP_TOURISM_DIRECTORATE]',
    timestamp: new Date().toISOString(),
  }
};

const TOURISM_GRIEVANCES = [
  {
    refId: 'TOUR-MP-2026-8812',
    siteName: 'Bhimbetka Rock Shelters (Cave 3)',
    category: 'HERITAGE_VANDALISM_REPORT',
    description: 'Unauthorized chalk graffiti spotted near cave 3 descriptive marker.',
    status: 'RESOLVED',
    resolution: 'ASI chemical preservation unit cleaned marker; security patrol intensified.',
    filedAt: '18 Sep 2026',
    slaHours: 24,
  },
  {
    refId: 'TOUR-MP-2026-4401',
    siteName: 'Upper Lake Boat Club',
    category: 'FACILITY_CLEANLINESS',
    description: 'Litter accumulation near jetty 2 promenade after weekend evening rush.',
    status: 'ACTION_TAKEN',
    resolution: 'Municipal Lake Sanitation Cell completed deep cleaning and deployed twin bin units.',
    filedAt: '21 Sep 2026',
    slaHours: 12,
  }
];

const _filedTourismGrievances = [];

// ─── 3. RURAL DEVELOPMENT DATA & TELEMETRY ───────────────────────────────────
const RURAL_TELEMETRY = {
  zone: 'BHOPAL_DISTRICT_RURAL',
  districtBlocks: ['Phanda Rural', 'Berasia Tehsil'],
  panchayatSummary: {
    totalGramPanchayats: 228,
    fundUtilizationRate: '94.8%',
    totalFundsDisbursedCr: '₹42.6 Cr (15th Finance Commission + State Grants)',
    jalJeevanTapWaterPct: '96.2% of Rural Households',
    pmgsyRoadConnectivityPct: '99.1%',
  },
  mgnregaStats: {
    activeJobCards: 68400,
    personDaysGeneratedThisFY: '18.4 Lakhs',
    avgWagePaymentDays: 4.8,
    wagePaymentSuccessRate: '99.6% (Direct Aadhaar Bank Transfer)',
  },
  keyPanchayats: [
    {
      code: 'PANCH-BPL-PHANDA-01',
      name: 'Gram Panchayat Tara Sewania (Phanda Block)',
      population: 4850,
      fundAllocation: '₹28,50,000',
      fundUtilized: '₹26,80,000 (94.0%)',
      jalJeevanStatus: '100% TAP CONNECTED',
      mgnregaWorksActive: 4,
      openGrievances: 0,
    },
    {
      code: 'PANCH-BPL-BERASIA-04',
      name: 'Gram Panchayat Runaha (Berasia Block)',
      population: 6200,
      fundAllocation: '₹34,20,000',
      fundUtilized: '₹31,40,000 (91.8%)',
      jalJeevanStatus: '94% TAP CONNECTED',
      mgnregaWorksActive: 6,
      openGrievances: 1,
    }
  ],
  meta: {
    authority: 'Panchayat & Rural Development Department, GoMP',
    roleToken: '[ROLE: RURAL_DEVELOPMENT_COMMISSIONER]',
    timestamp: new Date().toISOString(),
  }
};

const RURAL_GRIEVANCES = [
  {
    refId: 'RUR-BPL-2026-7714',
    panchayatCode: 'PANCH-BPL-BERASIA-04',
    category: 'JAL_JEEVAN_PIPELINE_LEAK',
    description: 'Overhead tank distribution line leakage in Ward 3 near Community Center.',
    status: 'REPAIR_COMPLETED',
    resolution: 'Panchayat plumber & PHED engineering squad replaced 15m PVC connector.',
    filedAt: '19 Sep 2026',
    slaHours: 48,
  },
  {
    refId: 'RUR-BPL-2026-2290',
    panchayatCode: 'PANCH-BPL-PHANDA-01',
    category: 'MGNREGA_WAGE_CREDIT_DELAY',
    description: 'Muster roll 482 payment pending for check dam de-siltation work.',
    status: 'CREDITED_TO_ACCOUNT',
    resolution: 'Aadhaar payment bridge re-triggered via PFMS. Wage credited to Bank of India account.',
    filedAt: '21 Sep 2026',
    slaHours: 72,
  }
];

const _filedRuralGrievances = [];

// ─── TRANSPORT CONTROLLER METHODS ────────────────────────────────────────────

exports.getTransportTelemetry = function getTransportTelemetry(_req, res) {
  return res.json({
    success: true,
    ...TRANSPORT_TELEMETRY,
  });
};

exports.reportTransportGrievance = function reportTransportGrievance(req, res) {
  try {
    const { category, routeNo, description, vehicleNumber } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, error: 'MISSING_FIELDS', message: 'description is required.' });
    }

    const refId = `TRN-BPL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance = {
      refId,
      category: category || 'PUBLIC_TRANSIT_SERVICE',
      routeNo: routeNo || 'BCLL Metro Transit',
      vehicleNumber: vehicleNumber || 'MP-04-E-XXXX',
      description,
      status: 'LOGGED_TO_RTO_DISPATCH',
      slaHours: 24,
      assignedAuthority: 'District Transport Officer & BCLL Operations Control',
      filedAt: new Date().toISOString(),
    };

    _filedTransportGrievances.push(newGrievance);

    return res.status(201).json({
      success: true,
      refId,
      message: 'Transport grievance registered and dispatched to RTO & BCLL Control.',
      grievance: newGrievance,
      meta: {
        zone: 'BHOPAL_METRO_ZONE_01',
        roleToken: '[ROLE: DISTRICT_TRANSPORT_OFFICER]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'TRANSPORT_REPORT_ERROR', message: error.message });
  }
};

exports.trackTransportGrievance = function trackTransportGrievance(req, res) {
  const { refId } = req.params;
  const target = refId.toUpperCase();
  const record = TRANSPORT_GRIEVANCES.find(g => g.refId === target) ||
                 _filedTransportGrievances.find(g => g.refId === target);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: `No transport grievance found with reference ID "${refId}". Try sample: TRN-BPL-2026-9041`,
    });
  }

  return res.json({ success: true, ...record, meta: { authority: 'RTO Bhopal & BCLL Operations' } });
};

// ─── TOURISM CONTROLLER METHODS ──────────────────────────────────────────────

exports.getTourismTelemetry = function getTourismTelemetry(_req, res) {
  return res.json({
    success: true,
    ...TOURISM_TELEMETRY,
  });
};

exports.reportTourismGrievance = function reportTourismGrievance(req, res) {
  try {
    const { siteName, category, description } = req.body;
    if (!siteName || !description) {
      return res.status(400).json({ success: false, error: 'MISSING_FIELDS', message: 'siteName and description are required.' });
    }

    const refId = `TOUR-MP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance = {
      refId,
      siteName,
      category: category || 'HERITAGE_MAINTENANCE',
      description,
      status: 'DISPATCHED_TO_TOURISM_CELL',
      slaHours: 24,
      assignedUnit: 'Madhya Pradesh Tourism Board (MPTB) Heritage Redressal Wing',
      filedAt: new Date().toISOString(),
    };

    _filedTourismGrievances.push(newGrievance);

    return res.status(201).json({
      success: true,
      refId,
      message: 'Tourism & heritage grievance logged. Dispatched to MP Tourism Response Cell.',
      grievance: newGrievance,
      meta: {
        zone: 'BHOPAL_CIRCUIT_HERITAGE',
        roleToken: '[ROLE: MP_TOURISM_DIRECTORATE]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'TOURISM_REPORT_ERROR', message: error.message });
  }
};

exports.trackTourismGrievance = function trackTourismGrievance(req, res) {
  const { refId } = req.params;
  const target = refId.toUpperCase();
  const record = TOURISM_GRIEVANCES.find(g => g.refId === target) ||
                 _filedTourismGrievances.find(g => g.refId === target);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'NOT_FOUND',
      message: `No tourism grievance found with reference ID "${refId}". Try sample: TOUR-MP-2026-8812`,
    });
  }

  return res.json({ success: true, ...record, meta: { authority: 'Madhya Pradesh Tourism Board' } });
};

// ─── RURAL DEVELOPMENT CONTROLLER METHODS ────────────────────────────────────

exports.getRuralTelemetry = function getRuralTelemetry(_req, res) {
  return res.json({
    success: true,
    ...RURAL_TELEMETRY,
  });
};

exports.getPanchayatDetails = function getPanchayatDetails(req, res) {
  const { code } = req.params;
  const target = code.toUpperCase();
  const record = RURAL_TELEMETRY.keyPanchayats.find(p => p.code === target);

  if (!record) {
    return res.status(404).json({
      success: false,
      error: 'PANCHAYAT_NOT_FOUND',
      message: `No Panchayat found with code "${code}". Try sample: PANCH-BPL-PHANDA-01 or PANCH-BPL-BERASIA-04`,
    });
  }

  return res.json({ success: true, ...record, meta: { source: 'MP E-Panchayat & PFMS Portal' } });
};

exports.reportRuralGrievance = function reportRuralGrievance(req, res) {
  try {
    const { panchayatCode, category, description, jobCardNo } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, error: 'MISSING_FIELDS', message: 'description is required.' });
    }

    const refId = `RUR-BPL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance = {
      refId,
      panchayatCode: panchayatCode || 'PANCH-BPL-PHANDA-01',
      category: category || 'RURAL_INFRASTRUCTURE',
      jobCardNo: jobCardNo || 'N/A',
      description,
      status: 'ASSIGNED_TO_JANPAD_CEO',
      slaHours: 48,
      assignedUnit: 'Janpad Panchayat CEO & District Rural Development Agency (DRDA Bhopal)',
      filedAt: new Date().toISOString(),
    };

    _filedRuralGrievances.push(newGrievance);

    return res.status(201).json({
      success: true,
      refId,
      message: 'Panchayat / Rural development grievance registered and assigned to Janpad CEO.',
      grievance: newGrievance,
      meta: {
        zone: 'BHOPAL_DISTRICT_RURAL',
        roleToken: '[ROLE: RURAL_DEVELOPMENT_COMMISSIONER]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'RURAL_REPORT_ERROR', message: error.message });
  }
};
