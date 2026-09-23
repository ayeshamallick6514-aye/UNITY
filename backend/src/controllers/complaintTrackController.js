'use strict';

// ─── Domain Prefix Map ────────────────────────────────────────────────────────
const PREFIX_DOMAIN_MAP = {
  'HLTH':    'healthcare',
  'AGR':     'agriculture',
  'TRNS':    'transport',
  'TRP':     'transport',
  'TOUR':    'tourism',
  'RUR':     'rural',
  'RDEV':    'rural',
  'EDU':     'education',
  'REC':     'recruitment',
  'BPL-COM': 'civic',
  'BPL-GRV': 'civic',
  'BPL':     'civic',
};

/**
 * Detects the domain from an uppercased refId string.
 * Checks multi-part prefixes (e.g. BPL-COM) first, then single-segment prefixes.
 * @param {string} refId - uppercased reference ID
 * @returns {string|null} domain name or null if unrecognised
 */
function detectDomain(refId) {
  // Check composite prefixes first (longest match wins)
  for (const prefix of Object.keys(PREFIX_DOMAIN_MAP).sort((a, b) => b.length - a.length)) {
    if (refId.startsWith(prefix + '-') || refId === prefix) {
      return PREFIX_DOMAIN_MAP[prefix];
    }
  }
  return null;
}

// ─── Timeline Builder ─────────────────────────────────────────────────────────
const TIMELINE_STAGES = [
  { stage: 'FILED',        label: 'Complaint Filed' },
  { stage: 'ASSIGNED',     label: 'Assigned to Officer' },
  { stage: 'UNDER_REVIEW', label: 'Under Review' },
  { stage: 'RESOLVED',     label: 'Resolved' },
];

/**
 * Builds a timeline array based on current complaint status.
 * @param {string} status
 * @returns {Array<{stage: string, label: string, completed: boolean}>}
 */
function buildTimeline(status) {
  const s = (status || '').toUpperCase();
  let completedCount;

  if (s === 'RESOLVED') {
    completedCount = 4; // all stages
  } else if (s === 'UNDER_REVIEW') {
    completedCount = 3; // FILED, ASSIGNED, UNDER_REVIEW
  } else if (s === 'ASSIGNED' || s === 'ASSIGNED_TO_BIOMEDICAL_ENGINEER') {
    completedCount = 2; // FILED, ASSIGNED
  } else {
    // REGISTERED or any unknown → only FILED
    completedCount = 1;
  }

  return TIMELINE_STAGES.map((item, idx) => ({
    stage:     item.stage,
    label:     item.label,
    completed: idx < completedCount,
  }));
}

// ─── Seed Registry ────────────────────────────────────────────────────────────
const SEED_REGISTRY = [
  {
    refId:       'BPL-COM-88492',
    domain:      'civic',
    title:       'Road pothole near Bittan Market',
    description: 'Large pothole on main road adjacent to Bittan Market, Ward 42. Causing accidents and vehicle damage. Reported by multiple residents.',
    location:    'Bittan Market, Ward 42, Bhopal',
    status:      'UNDER_REVIEW',
    filedAt:     '2026-09-10T08:30:00.000Z',
    assignedTo:  'PWD Inspector – Zone 4',
    resolution:  null,
    slaHours:    72,
  },
  {
    refId:       'HLTH-BPL-2026-8812',
    domain:      'healthcare',
    title:       'Medicine stockout at JP Hospital',
    description: 'Critical medicines including antibiotics and antihypertensives are out of stock at Jawahar Lal Nehru Hospital OPD pharmacy. Patients being turned away.',
    location:    'J.P. Hospital, Shivaji Nagar, Bhopal',
    status:      'RESOLVED',
    filedAt:     '2026-09-05T10:15:00.000Z',
    assignedTo:  'CMO – Bhopal District',
    resolution:  'Emergency procurement from district medical store completed. 60-day stock replenished on 08-Sep-2026.',
    slaHours:    48,
  },
  {
    refId:       'HLTH-BPL-2026-3391',
    domain:      'healthcare',
    title:       'Ultrasound probe malfunction – CHC Kolar',
    description: 'Ultrasound machine probe at Community Health Centre Kolar is non-functional since 01-Sep-2026. Pregnant women are being referred to district hospital, causing undue hardship.',
    location:    'CHC Kolar, Kolar Road, Bhopal',
    status:      'ASSIGNED_TO_BIOMEDICAL_ENGINEER',
    filedAt:     '2026-09-12T09:00:00.000Z',
    assignedTo:  'Biomedical Engineer – CMHO Office Bhopal',
    resolution:  null,
    slaHours:    96,
  },
  {
    refId:       'AGR-BPL-2026-1147',
    domain:      'agriculture',
    title:       'PM-Kisan installment delay – Berasia Tehsil',
    description: '14th installment of PM-Kisan Samman Nidhi not credited to 340 farmers in Berasia tehsil despite e-KYC completion. Farmers report Aadhaar seeding errors.',
    location:    'Berasia Tehsil, Bhopal District',
    status:      'RESOLVED',
    filedAt:     '2026-08-28T11:45:00.000Z',
    assignedTo:  'Tehsildar – Berasia',
    resolution:  'Data correction and manual push to PFMS portal completed. Funds credited to all 340 farmers on 14-Sep-2026.',
    slaHours:    120,
  },
  {
    refId:       'TRNS-BPL-2026-5521',
    domain:      'transport',
    title:       'BCLL Bus breakdown – Route 7 (Govindpura–New Market)',
    description: 'Bus No. MP-04-PA-1107 on BCLL Route 7 suffered engine breakdown at Habibganj Naka. Service disrupted for 3 hours. Citizens stranded during peak hours.',
    location:    'Habibganj Naka, Bhopal – Route 7',
    status:      'UNDER_REVIEW',
    filedAt:     '2026-09-18T07:50:00.000Z',
    assignedTo:  'BCLL Fleet Manager – Govindpura Depot',
    resolution:  null,
    slaHours:    24,
  },
  {
    refId:       'TOUR-BPL-2026-2201',
    domain:      'tourism',
    title:       'Sanchi Stupa pathway cleanliness complaint',
    description: 'Main visitor pathway at Sanchi Stupa World Heritage Site littered with plastic waste and food wrappers. Toilet block near Gate 2 reported non-functional.',
    location:    'Sanchi Stupa, Raisen District (managed by MP Tourism)',
    status:      'ASSIGNED',
    filedAt:     '2026-09-14T13:00:00.000Z',
    assignedTo:  'MP Tourism Officer – Heritage Circuit',
    resolution:  null,
    slaHours:    48,
  },
  {
    refId:       'RDEV-BPL-2026-6634',
    domain:      'rural',
    title:       'MGNREGA wage delay – Gram Panchayat Phanda',
    description: 'Wages for 112 MGNREGA workers from GP Phanda unpaid for 6 weeks. Work completion certificates were submitted on time. FTO generated but funds not disbursed.',
    location:    'Gram Panchayat Phanda, Bhopal Block',
    status:      'RESOLVED',
    filedAt:     '2026-09-01T08:00:00.000Z',
    assignedTo:  'Block Development Officer – Bhopal',
    resolution:  'FTO discrepancy corrected. Wages disbursed to all 112 workers via DBT on 20-Sep-2026.',
    slaHours:    168,
  },
  {
    refId:       'EDU-BPL-2026-4412',
    domain:      'education',
    title:       'PM-POSHAN mid-day meal complaint – Govt HS Kolar',
    description: 'Mid-day meal not served for 5 consecutive days at Government Higher Secondary School, Kolar Road. Cook absenteeism and grain supply chain disruption cited.',
    location:    'Govt Higher Secondary School, Kolar Road, Bhopal',
    status:      'UNDER_REVIEW',
    filedAt:     '2026-09-16T12:30:00.000Z',
    assignedTo:  'Block Education Officer – Bhopal Urban',
    resolution:  null,
    slaHours:    48,
  },
];

// ─── Runtime Complaints (in-memory, session-scoped) ───────────────────────────
const _runtimeComplaints = [];

// ─── Domain Prefix Generator ──────────────────────────────────────────────────
const DOMAIN_PREFIX_GEN = {
  healthcare:  'HLTH',
  agriculture: 'AGR',
  transport:   'TRNS',
  tourism:     'TOUR',
  rural:       'RDEV',
  education:   'EDU',
  recruitment: 'REC',
  civic:       'BPL-COM',
};

function generateRefId(domain) {
  const prefix = DOMAIN_PREFIX_GEN[domain] || 'GEN';
  const num = Math.floor(1000 + Math.random() * 89999);
  if (domain === 'civic') {
    return `BPL-COM-${num}`;
  }
  return `${prefix}-BPL-2026-${num}`;
}

// ─── Controller: trackComplaint ───────────────────────────────────────────────
/**
 * GET /api/v1/complaints/track/:refId
 * Universal tracker — searches SEED_REGISTRY then _runtimeComplaints.
 */
exports.trackComplaint = (req, res) => {
  const refId  = (req.params.refId || '').trim().toUpperCase();

  if (!refId) {
    return res.status(400).json({
      success: false,
      error:   'REF_ID_REQUIRED',
      message: 'Please provide a complaint reference ID.',
    });
  }

  // Search seed registry + runtime
  const all    = [...SEED_REGISTRY, ..._runtimeComplaints];
  const record = all.find(c => c.refId.toUpperCase() === refId);

  if (!record) {
    return res.status(404).json({
      success:   false,
      error:     'COMPLAINT_NOT_FOUND',
      refId,
      message:   `No complaint found for reference ID: ${refId}`,
      sampleIds: [
        'BPL-COM-88492',
        'HLTH-BPL-2026-8812',
        'HLTH-BPL-2026-3391',
        'AGR-BPL-2026-1147',
        'TRNS-BPL-2026-5521',
        'TOUR-BPL-2026-2201',
        'RDEV-BPL-2026-6634',
        'EDU-BPL-2026-4412',
      ],
    });
  }

  const domain = record.domain || detectDomain(refId) || 'unknown';

  return res.json({
    success:     true,
    refId:       record.refId,
    domain,
    title:       record.title,
    description: record.description,
    location:    record.location,
    status:      record.status,
    filedAt:     record.filedAt,
    assignedTo:  record.assignedTo,
    resolution:  record.resolution,
    slaHours:    record.slaHours,
    timeline:    buildTimeline(record.status),
  });
};

// ─── Controller: fileComplaint ────────────────────────────────────────────────
/**
 * POST /api/v1/complaints/file
 * Files a new complaint into the runtime in-memory store.
 * Body: { domain, title, description, location, contact }
 */
exports.fileComplaint = (req, res) => {
  const { domain, title, description, location, contact } = req.body || {};

  if (!domain || !title || !description || !location) {
    return res.status(400).json({
      success: false,
      error:   'MISSING_FIELDS',
      message: 'Required fields: domain, title, description, location.',
      required: ['domain', 'title', 'description', 'location'],
    });
  }

  const normalizedDomain = domain.toString().toLowerCase();
  if (!DOMAIN_PREFIX_GEN[normalizedDomain]) {
    return res.status(400).json({
      success:        false,
      error:          'INVALID_DOMAIN',
      message:        `Domain "${domain}" is not recognised.`,
      validDomains:   Object.keys(DOMAIN_PREFIX_GEN),
    });
  }

  const refId     = generateRefId(normalizedDomain);
  const filedAt   = new Date().toISOString();
  const complaint = {
    refId,
    domain:      normalizedDomain,
    title:       title.toString().trim(),
    description: description.toString().trim(),
    location:    location.toString().trim(),
    contact:     contact ? contact.toString().trim() : null,
    status:      'REGISTERED',
    filedAt,
    assignedTo:  null,
    resolution:  null,
    slaHours:    72,
  };

  _runtimeComplaints.push(complaint);

  return res.status(201).json({
    success:     true,
    message:     'Complaint filed successfully.',
    refId,
    domain:      normalizedDomain,
    title:       complaint.title,
    description: complaint.description,
    location:    complaint.location,
    status:      complaint.status,
    filedAt,
    assignedTo:  complaint.assignedTo,
    resolution:  complaint.resolution,
    slaHours:    complaint.slaHours,
    timeline:    buildTimeline(complaint.status),
  });
};
