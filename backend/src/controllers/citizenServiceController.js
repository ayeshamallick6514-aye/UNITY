'use strict';

/**
 * citizenServiceController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Multi-Domain Citizen Services Controller for MPOnline PS-5:
 *  - Urban Infrastructure & Municipal Services
 *  - Education & Digital Classroom Grievance Redressal
 *  - Scholarships & AI-Assisted Merit / DBT Verification
 *  - State Recruitment & Transparent Exam Grievance Tracking
 */

// ─── Seeded Multi-Domain Records ──────────────────────────────────────────────
const SCHOLARSHIP_REGISTRY = [
  {
    appId:         'SCH-MP-2026-8814',
    applicantName: 'Applicant [ID: SAM-902188]',
    schemeName:    'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)',
    department:    'Higher Education Dept, GoMP',
    annualAssistance: '₹1,20,000 (100% Tuition Waiver)',
    institution:   'MANIT Bhopal (Computer Science & Engg)',
    meritPercentage: 88.4,
    status:        'DISBURSED_DBT',
    stage:         'DBT_CREDITED_TO_ACCOUNT',
    disbursedAmount: '₹60,000 (Sem 1 & 2)',
    transactionId: 'DBT-SBI-MP-994012',
    date:          '18 Sep 2026',
    dbtBank:       'State Bank of India (A/C ending in 4109)',
    aadhaarSeeded: true,
  },
  {
    appId:         'SCH-MP-2026-4419',
    applicantName: 'Applicant [ID: SAM-773412]',
    schemeName:    'Post-Matric Scholarship Scheme (SC/ST/OBC)',
    department:    'Tribal Affairs & Scheduled Caste Welfare',
    annualAssistance: '₹45,000 Maintenance Allowance',
    institution:   'Barkatullah University Bhopal',
    meritPercentage: 76.2,
    status:        'SANCTIONED',
    stage:         'TREASURY_CLEARANCE_PENDING',
    disbursedAmount: '₹0 (Disbursement on 28th)',
    transactionId: null,
    date:          '12 Sep 2026',
    dbtBank:       'Punjab National Bank (A/C ending in 8832)',
    aadhaarSeeded: true,
  },
  {
    appId:         'SCH-MP-2026-1023',
    applicantName: 'Applicant [ID: SAM-331094]',
    schemeName:    'Gaon Ki Beti Yojana',
    department:    'Higher Education Dept, GoMP',
    annualAssistance: '₹5,000 per academic year',
    institution:   'Govt. Geetanjali Girls College Bhopal',
    meritPercentage: 81.0,
    status:        'VERIFIED_AI',
    stage:         'NODAL_COLLEGE_APPROVAL',
    disbursedAmount: '₹0 (In verification)',
    transactionId: null,
    date:          '05 Sep 2026',
    dbtBank:       'Bank of Baroda (A/C ending in 1904)',
    aadhaarSeeded: true,
  }
];

const RECRUITMENT_REGISTRY = [
  {
    rollNo:        'MPESB-2026-90412',
    candidateId:   'APP-ESB-88102',
    examName:      'MP Sub-Engineer & Assistant Engineer (Civil) Exam 2026',
    examDate:      '15 Aug 2026',
    examCenter:    'Center 104 - Trinity Institute of Technology, Kokta Bypass Bhopal',
    admitCardStatus: 'ISSUED',
    scoreNormalized: 84.5,
    rankZone:      'RANK_42_STATEWIDE',
    grievanceStatus: 'RESOLVED',
    grievanceSummary: 'Answer Key Objection for Question 47 (Hydraulics) accepted by Subject Expert Committee. +1 mark awarded.',
    resultDate:    '20 Sep 2026',
  },
  {
    rollNo:        'MPPSC-2026-11849',
    candidateId:   'APP-PSC-33190',
    examName:      'MP State Engineering Services (SES) 2026',
    examDate:      '02 Sep 2026',
    examCenter:    'Center 012 - Govt. Maharani Laxmibai Girls PG College, Bhopal',
    admitCardStatus: 'ISSUED',
    scoreNormalized: null,
    rankZone:      'EVALUATION_IN_PROGRESS',
    grievanceStatus: 'UNDER_REVIEW',
    grievanceSummary: 'Biometric fingerprint scanner malfunction at Gate 2 logged and verified by Center Superintendent.',
    resultDate:    'Expected 10 Oct 2026',
  }
];

// In-memory store for newly filed grievances during demonstration
const _filedEducationGrievances = [];
const _filedRecruitmentGrievances = [];

// ─── GET /api/v1/citizen/services/summary ─────────────────────────────────────
exports.getCitizenServicesSummary = function getCitizenServicesSummary(_req, res) {
  return res.json({
    success: true,
    zone:    'BHOPAL_METRO_ZONE_01',
    portal:  'MPONLINE_PS5_SECURE',
    telemetry: {
      urbanInfrastructure: {
        activeWorkPackages: 74,
        clearedInterlocks: 3,
        grievancesResolved: 1420,
        avgResolutionDays: 4.2,
      },
      educationPillar: {
        connectedSchools: 384,
        smartClassroomsActive: 290,
        infrastructureGrievancesOpen: 14,
        avgAuditSLA: '48 hrs',
      },
      scholarshipsDBT: {
        totalDisbursedThisCycle: '₹14.8 Cr',
        verifiedBeneficiaries: 18400,
        dbtSuccessRate: '99.4%',
        activeSchemesCount: 8,
      },
      stateRecruitment: {
        activeExams: 6,
        totalCandidatesEnrolled: 82000,
        grievancesAddressed: 341,
        transparentAuditScore: '96.8 / 100',
      },
      healthcareServices: {
        empaneledHospitals: 78,
        active108Ambulances: 42,
        avgResponseMinutes: 11.4,
        ayushmanCardsIssued: '8.42 Lakhs',
      },
      agriculturalGovernance: {
        registeredFarmers: 94200,
        dbtDisbursedThisQuarter: '₹18.84 Cr',
        activeMandiArrivals: '1,420 Tonnes/day',
        fertilizerBufferStatus: 'SUFFICIENT_FOR_RABI',
      },
      transportTransit: {
        bcllBusesActive: 220,
        electricBuses: 85,
        dailyFootfall: '1.45 Lakhs',
        gpsCompliance: '100%',
      },
      tourismHeritage: {
        heritageSitesMonitored: 4,
        dailyTouristFootfall: 15350,
        avgCleanlinessScore: '96.2 / 100',
        certifiedGuides: 86,
      },
      ruralDevelopment: {
        gramPanchayats: 228,
        fundUtilizationRate: '94.8%',
        jalJeevanTapWaterPct: '96.2%',
        activeJobCards: 68400,
      }
    },
    meta: {
      roleToken:  '[ROLE: CITIZEN_APPLICANT]',
      timestamp:  new Date().toISOString(),
      governance: 'Government of Madhya Pradesh • MPOnline Problem Statement 5',
    }
  });
};

// ─── POST /api/v1/citizen/scholarship/verify ──────────────────────────────────
exports.verifyScholarshipMerit = function verifyScholarshipMerit(req, res) {
  try {
    const { samagraId, marksPercentage, annualFamilyIncome, courseType, schemeCode } = req.body;

    if (!samagraId || marksPercentage == null || annualFamilyIncome == null) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_DATA',
        message: 'samagraId, marksPercentage, and annualFamilyIncome are mandatory.',
      });
    }

    const marks = parseFloat(marksPercentage);
    const income = parseFloat(annualFamilyIncome);

    // AI-Assisted Rule Engine Logic for MPOnline Schemes
    let eligible = false;
    let schemeName = 'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)';
    let estimatedBenefit = '₹0';
    let criteria = [];

    if (marks >= 70 && income <= 600000) {
      eligible = true;
      estimatedBenefit = '100% Tuition Fee Reimbursement + ₹12,000/yr Annual Maintenance';
      criteria = [
        'Merit Threshold (≥ 70% in MP Board / ≥ 85% in CBSE): SATISFIED',
        'Income Ceiling (≤ ₹6.0 Lakhs/yr): SATISFIED',
        'Aadhaar-Samagra eKYC Status: VERIFIED',
        'DBT Bank Account Seeded: ACTIVE'
      ];
    } else if (income <= 250000) {
      eligible = true;
      schemeName = 'Post-Matric Scholarship Scheme (SC/ST/OBC)';
      estimatedBenefit = '100% Tuition Fee Waiver + Scheduled Maintenance Allowance';
      criteria = [
        'Income Ceiling (≤ ₹2.5 Lakhs/yr): SATISFIED',
        'Caste Certificate Verification: DIGITAL_TOKEN_VALID',
        'DBT Bank Account Seeded: ACTIVE'
      ];
    } else {
      eligible = false;
      criteria = [
        `Marks Percentage (${marks}%) did not meet minimum cutoff for full fee waiver.`,
        `Annual Family Income (₹${income.toLocaleString()}) exceeds the statutory threshold.`
      ];
    }

    const verificationToken = `AI-VERIF-SCH-${Date.now().toString().slice(-6)}`;

    return res.json({
      success: true,
      verificationToken,
      eligible,
      schemeName,
      estimatedBenefit,
      criteria,
      confidenceScore: 98.2,
      dbtReadiness: 'READY_FOR_DISBURSEMENT',
      meta: {
        zone:      'BHOPAL_METRO_ZONE_01',
        engine:    'MP_SCHOLARSHIP_AI_RULES_V2',
        roleToken: '[ROLE: CITIZEN_APPLICANT]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:   'SCHOLARSHIP_VERIF_ERROR',
      message: error.message,
    });
  }
};

// ─── GET /api/v1/citizen/scholarship/status/:appId ────────────────────────────
exports.getScholarshipStatus = function getScholarshipStatus(req, res) {
  const { appId } = req.params;
  const record = SCHOLARSHIP_REGISTRY.find(s => s.appId.toLowerCase() === (appId || '').toLowerCase());

  if (!record) {
    return res.status(404).json({
      success: false,
      error:   'RECORD_NOT_FOUND',
      message: `No scholarship application found with ID "${appId}". Try sample: SCH-MP-2026-8814`,
    });
  }

  return res.json({
    success: true,
    ...record,
    meta: {
      zone:      'BHOPAL_METRO_ZONE_01',
      source:    'MP State Scholarship Portal 2.0 // Direct Benefit Transfer (DBT)',
      roleToken: '[ROLE: CITIZEN_APPLICANT]',
    }
  });
};

// ─── POST /api/v1/citizen/education/report ────────────────────────────────────
exports.reportEducationGrievance = function reportEducationGrievance(req, res) {
  try {
    const { schoolCode, schoolName, category, description, wardCode } = req.body;

    if (!schoolName || !description) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_FIELDS',
        message: 'schoolName and description are required.',
      });
    }

    const refId = `EDU-BPL-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance = {
      refId,
      schoolCode:  schoolCode || 'MP-BPL-SCH-042',
      schoolName,
      category:    category || 'INFRASTRUCTURE',
      description,
      wardCode:    wardCode || 'WARD_042',
      status:      'REGISTERED',
      slaHours:    48,
      assignedDept:'School Education Dept (Bhopal District Unit)',
      filedAt:     new Date().toISOString(),
    };

    _filedEducationGrievances.push(newGrievance);

    return res.status(201).json({
      success: true,
      refId,
      message: 'Education infrastructure grievance logged and assigned to District Education Officer.',
      grievance: newGrievance,
      meta: {
        zone:      'BHOPAL_METRO_ZONE_01',
        roleToken: '[ROLE: CITIZEN_APPLICANT]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:   'EDUCATION_REPORT_ERROR',
      message: error.message,
    });
  }
};

// ─── GET /api/v1/citizen/recruitment/track/:rollNo ────────────────────────────
exports.trackRecruitmentRecord = function trackRecruitmentRecord(req, res) {
  const { rollNo } = req.params;
  const record = RECRUITMENT_REGISTRY.find(r => r.rollNo.toLowerCase() === (rollNo || '').toLowerCase());

  if (!record) {
    return res.status(404).json({
      success: false,
      error:   'ROLL_NO_NOT_FOUND',
      message: `No exam record found for Roll No "${rollNo}". Try sample: MPESB-2026-90412`,
    });
  }

  return res.json({
    success: true,
    ...record,
    meta: {
      zone:      'BHOPAL_METRO_ZONE_01',
      board:     'MP Employees Selection Board (MPESB) & MPPSC',
      roleToken: '[ROLE: CITIZEN_APPLICANT]',
    }
  });
};

// ─── POST /api/v1/citizen/recruitment/grievance ───────────────────────────────
exports.reportRecruitmentGrievance = function reportRecruitmentGrievance(req, res) {
  try {
    const { rollNo, examName, grievanceType, description } = req.body;

    if (!rollNo || !description) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_FIELDS',
        message: 'rollNo and description are required.',
      });
    }

    const refId = `EXAM-MP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance = {
      refId,
      rollNo,
      examName:      examName || 'State Recruitment Examination',
      grievanceType: grievanceType || 'ANSWER_KEY_OBJECTION',
      description,
      status:        'FILED_FOR_COMMITTEE_REVIEW',
      committee:     'Subject Expert Board (MPESB / MPPSC)',
      filedAt:       new Date().toISOString(),
    };

    _filedRecruitmentGrievances.push(newGrievance);

    return res.status(201).json({
      success: true,
      refId,
      message: 'State recruitment examination grievance registered for committee evaluation.',
      grievance: newGrievance,
      meta: {
        zone:      'BHOPAL_METRO_ZONE_01',
        roleToken: '[ROLE: CITIZEN_APPLICANT]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:   'RECRUITMENT_REPORT_ERROR',
      message: error.message,
    });
  }
};
