'use strict';

/**
 * healthcareController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Healthcare Services & Medical Infrastructure Controller for MPOnline PS-5:
 *  - District Hospital Resource & Critical Buffer Tracking
 *  - 108 Emergency Ambulance Dispatch Response Latency
 *  - Medical Grievance Routing (Medicine stockout, PHC infrastructure, Referrals)
 *  - Ayushman Bharat / PM-JAY Digital Health Card Verification
 */

// ─── Seeded Healthcare Registry & Telemetry ───────────────────────────────────
const HEALTHCARE_TELEMETRY = {
  zone: 'BHOPAL_METRO_ZONE_01',
  hospitalUnits: [
    {
      id: 'HOSP-01',
      name: 'AIIMS Bhopal (Apex Medical Center)',
      type: 'TERTIARY_CENTRAL',
      ward: 'WARD_028',
      icuBedsAvailable: 14,
      icuTotal: 80,
      oxygenBufferDays: 12.5,
      emergencyStatus: 'NORMAL',
      bloodBankStock: 'OPTIMAL (A+, B+, O+, AB+ available)',
    },
    {
      id: 'HOSP-02',
      name: 'Hamidia Hospital & Gandhi Medical College',
      type: 'DISTRICT_TEACHING',
      ward: 'WARD_011',
      icuBedsAvailable: 8,
      icuTotal: 65,
      oxygenBufferDays: 9.0,
      emergencyStatus: 'NORMAL',
      bloodBankStock: 'ADEQUATE',
    },
    {
      id: 'HOSP-03',
      name: 'Jay Prakash (JP) District Hospital, 1250 Hospital Rd',
      type: 'DISTRICT_CIVIL',
      ward: 'WARD_031',
      icuBedsAvailable: 6,
      icuTotal: 30,
      oxygenBufferDays: 7.2,
      emergencyStatus: 'NORMAL',
      bloodBankStock: 'OPTIMAL',
    },
    {
      id: 'HOSP-04',
      name: 'Community Health Center (CHC) Kolar',
      type: 'COMMUNITY_HEALTH_CENTER',
      ward: 'WARD_055',
      icuBedsAvailable: 3,
      icuTotal: 10,
      oxygenBufferDays: 5.5,
      emergencyStatus: 'NORMAL',
      bloodBankStock: 'CRITICAL_O_NEG_REQUIRED',
    },
  ],
  ambulance108: {
    activeFleetCount: 42,
    avgResponseTimeMinutes: 11.4,
    emergencyTriagesToday: 188,
    gpsTrackedPct: '100%',
  },
  ayushmanBharat: {
    cardsIssuedBhopal: '8,42,000',
    claimsSettledThisQuarter: '₹28.4 Cr',
    hospitalEmpaneledCount: 78,
  },
  meta: {
    roleToken:  '[ROLE: DISTRICT_HEALTH_OFFICER]',
    authority:  'Department of Public Health & Family Welfare, GoMP',
    timestamp:  new Date().toISOString(),
  }
};

const HEALTH_GRIEVANCE_REGISTRY = [
  {
    refId:        'HLTH-BPL-2026-8812',
    hospitalName: 'Jay Prakash (JP) Hospital Bhopal',
    category:     'MEDICINE_STOCKOUT',
    description:  'Essential anti-hypertensive formulation (Amlodipine 5mg) stockout at OPD dispensary Counter 3.',
    status:       'RESOLVED',
    resolution:   'Emergency buffer stock dispatched from District Drug Warehouse. 10,000 units replenished.',
    slaHours:     24,
    filedAt:      '20 Sep 2026',
  },
  {
    refId:        'HLTH-BPL-2026-3391',
    hospitalName: 'CHC Kolar (Ward 55)',
    category:     'DIAGNOSTIC_EQUIPMENT',
    description:  'Digital Ultrasound probe calibration glitch in maternity observation ward.',
    status:       'ASSIGNED_TO_BIOMEDICAL_ENGINEER',
    resolution:   'MPSEDC Biomedical AMC team dispatched with on-site replacement transducer.',
    slaHours:     48,
    filedAt:      '22 Sep 2026',
  }
];

// In-memory array for newly filed grievances
const _filedHealthGrievances = [];

// ─── GET /api/v1/healthcare/telemetry ─────────────────────────────────────────
exports.getHealthcareTelemetry = function getHealthcareTelemetry(_req, res) {
  return res.json({
    success: true,
    ...HEALTHCARE_TELEMETRY,
  });
};

// ─── POST /api/v1/healthcare/grievance ────────────────────────────────────────
exports.reportHealthGrievance = function reportHealthGrievance(req, res) {
  try {
    const { hospitalName, category, description, patientContact, wardCode } = req.body;

    if (!hospitalName || !description) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_FIELDS',
        message: 'hospitalName and description are mandatory fields.',
      });
    }

    const refId = `HLTH-BPL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance = {
      refId,
      hospitalName,
      category:     category || 'HOSPITAL_INFRASTRUCTURE',
      description,
      wardCode:     wardCode || 'WARD_042',
      status:       'REGISTERED',
      slaHours:     category === 'MEDICINE_STOCKOUT' ? 24 : 48,
      assignedUnit: 'District Chief Medical & Health Officer (CMHO Bhopal)',
      filedAt:      new Date().toISOString(),
    };

    _filedHealthGrievances.push(newGrievance);

    return res.status(201).json({
      success: true,
      refId,
      message: 'Medical/Public Health grievance registered and dispatched to CMHO Control Room.',
      grievance: newGrievance,
      meta: {
        zone:      'BHOPAL_METRO_ZONE_01',
        roleToken: '[ROLE: DISTRICT_HEALTH_OFFICER]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:   'HEALTH_REPORT_ERROR',
      message: error.message,
    });
  }
};

// ─── GET /api/v1/healthcare/track/:refId ──────────────────────────────────────
exports.trackHealthGrievance = function trackHealthGrievance(req, res) {
  const { refId } = req.params;
  const target = refId.toUpperCase();

  const record = HEALTH_GRIEVANCE_REGISTRY.find(g => g.refId === target) ||
                 _filedHealthGrievances.find(g => g.refId === target);

  if (!record) {
    return res.status(404).json({
      success: false,
      error:   'GRIEVANCE_NOT_FOUND',
      message: `No medical grievance found for Reference ID "${refId}". Try sample: HLTH-BPL-2026-8812`,
    });
  }

  return res.json({
    success: true,
    ...record,
    meta: {
      zone:      'BHOPAL_METRO_ZONE_01',
      authority: 'District Health Command Cell (CMHO Bhopal)',
      roleToken: '[ROLE: DISTRICT_HEALTH_OFFICER]',
    }
  });
};
