'use strict';

/**
 * agricultureController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Agricultural Governance & Farmer Welfare Controller for MPOnline PS-5:
 *  - E-Uparjan Mandi Logistics & Daily Commodity Prices (Krishi Upaj Mandi Karond)
 *  - PM-Kisan & Mukhyamantri Kisan Kalyan DBT Direct Benefit Tracking
 *  - Pradhan Mantri Fasal Bima Yojana (PMFBY) Crop Damage Claim Filing & Appeal
 *  - Fertilizer / Certified Seed Stock Verification at District Agro Centers
 */

// ─── Seeded Agricultural Registry & Mandi Telemetry ───────────────────────────
const AGRICULTURE_TELEMETRY = {
  zone: 'BHOPAL_METRO_ZONE_01',
  mandiKarond: {
    mandiName: 'Krishi Upaj Mandi Samiti, Karond (Bhopal)',
    operationalStatus: 'OPEN_NORMAL',
    dailyArrivalTonnes: 1420,
    activeTrucksInQueue: 18,
    avgUnloadingWaitHours: 1.2,
    gatePassProtocol: 'E_UPARJAN_DIGITAL_TOKEN',
    currentCommodityPrices: [
      { crop: 'Wheat (Sharbati - Grade A)', msp: '₹2,275 / Qtl', modalPrice: '₹2,850 / Qtl', trend: 'UP' },
      { crop: 'Soybean (Yellow)',           msp: '₹4,892 / Qtl', modalPrice: '₹4,940 / Qtl', trend: 'STABLE' },
      { crop: 'Gram (Chana - Desi)',        msp: '₹5,440 / Qtl', modalPrice: '₹5,750 / Qtl', trend: 'UP' },
      { crop: 'Paddy (Basmati)',            msp: '₹2,300 / Qtl', modalPrice: '₹3,200 / Qtl', trend: 'UP' },
    ],
  },
  dbtSummary: {
    totalFarmersCovered: 94200,
    disbursedThisInstallment: '₹18.84 Cr',
    dbtSuccessRate: '99.8%',
    activeSchemes: [
      'PM-Kisan Samman Nidhi (₹6,000/yr)',
      'Mukhyamantri Kisan Kalyan Yojana (₹6,000/yr)',
    ],
  },
  fertilizerStockBuffer: {
    ureaStockMT: 4800,
    dapStockMT: 2600,
    npkStockMT: 1900,
    status: 'SUFFICIENT_FOR_RABI_SEASON',
  },
  meta: {
    roleToken:  '[ROLE: AGRICULTURE_DIRECTORATE]',
    authority:  'Department of Farmer Welfare and Agriculture Development, GoMP',
    timestamp:  new Date().toISOString(),
  }
};

const FARMER_DBT_REGISTRY = [
  {
    farmerId:          'FARM-MP-2026-90412',
    khasraNumber:      'Plot 14/2, Phanda Block, Bhopal',
    landAreaAcres:     4.5,
    pmKisanStatus:     'CREDITED_INSTALLMENT_17',
    kisanKalyanStatus: 'CREDITED_INSTALLMENT_12',
    disbursedTotal:    '₹12,000 (Current Financial Year)',
    dbtBank:           'Bank of India, Berasia Branch (A/C ending in 4410)',
    aadhaarSeeded:     true,
    pmfbyInsurancePolicy: 'PMFBY-MP-2026-BPL-88102',
    insuredCrop:       'Soybean (Kharif 2026)',
    claimStatus:       'NO_CLAIM_PENDING',
  },
  {
    farmerId:          'FARM-MP-2026-33104',
    khasraNumber:      'Plot 88/1, Berasia Tehsil, Bhopal',
    landAreaAcres:     6.2,
    pmKisanStatus:     'CREDITED_INSTALLMENT_17',
    kisanKalyanStatus: 'SANCTIONED_TREASURY_PENDING',
    disbursedTotal:    '₹6,000 (Next ₹6,000 processing)',
    dbtBank:           'Madhya Pradesh Gramin Bank (A/C ending in 9012)',
    aadhaarSeeded:     true,
    pmfbyInsurancePolicy: 'PMFBY-MP-2026-BPL-44019',
    insuredCrop:       'Paddy & Pulses',
    claimStatus:       'SURVEYOR_INSPECTION_COMPLETED',
  }
];

const CROP_GRIEVANCES_REGISTRY = [
  {
    refId:       'AGRI-MP-2026-8814',
    farmerId:    'FARM-MP-2026-33104',
    category:    'CROP_DAMAGE_INSPECTION_APPEAL',
    cropName:    'Soybean (Kharif)',
    lossPct:     '65% (Inundation damage due to heavy rainfall)',
    status:      'JOINT_SURVEY_SCHEDULED',
    surveyDate:  '25 Sep 2026 (Revenue Patwari + Insurance Surveyor)',
    filedAt:     '21 Sep 2026',
  }
];

const _filedCropGrievances = [];

// ─── GET /api/v1/agriculture/telemetry ────────────────────────────────────────
exports.getAgricultureTelemetry = function getAgricultureTelemetry(_req, res) {
  return res.json({
    success: true,
    ...AGRICULTURE_TELEMETRY,
  });
};

// ─── GET /api/v1/agriculture/dbt/status/:farmerId ─────────────────────────────
exports.getFarmerDbtStatus = function getFarmerDbtStatus(req, res) {
  const { farmerId } = req.params;
  const target = farmerId.toUpperCase();

  const record = FARMER_DBT_REGISTRY.find(f => f.farmerId === target);

  if (!record) {
    return res.status(404).json({
      success: false,
      error:   'FARMER_NOT_FOUND',
      message: `No farmer record found with ID "${farmerId}". Try sample: FARM-MP-2026-90412 or FARM-MP-2026-33104`,
    });
  }

  return res.json({
    success: true,
    ...record,
    meta: {
      zone:      'BHOPAL_METRO_ZONE_01',
      source:    'MP Kisan Welfare Portal // E-Uparjan DBT Integration',
      roleToken: '[ROLE: AGRICULTURE_DIRECTORATE]',
    }
  });
};

// ─── POST /api/v1/agriculture/crop-damage/report ──────────────────────────────
exports.reportCropDamageGrievance = function reportCropDamageGrievance(req, res) {
  try {
    const { farmerId, khasraNumber, cropName, estimatedLossPct, damageCause, description } = req.body;

    if (!farmerId || !cropName || !description) {
      return res.status(400).json({
        success: false,
        error:   'MISSING_FIELDS',
        message: 'farmerId, cropName, and description are required.',
      });
    }

    const refId = `AGRI-MP-${Math.floor(10000 + Math.random() * 90000)}`;
    const newGrievance = {
      refId,
      farmerId,
      khasraNumber:     khasraNumber || 'Khasra No. Verified via Bhu-Naksha MP',
      category:         'CROP_DAMAGE_INSPECTION_APPEAL',
      cropName,
      estimatedLossPct: estimatedLossPct || '50%+',
      damageCause:      damageCause || 'EXCESS_RAINFALL',
      description,
      status:           'ASSIGNED_FOR_PATWARI_SURVEY',
      slaHours:         72,
      assignedUnit:     'Tehsildar & District Agriculture Officer (DAO Bhopal)',
      filedAt:          new Date().toISOString(),
    };

    _filedCropGrievances.push(newGrievance);

    return res.status(201).json({
      success: true,
      refId,
      message: 'Crop damage re-survey appeal logged. Joint survey scheduled under PMFBY norms.',
      grievance: newGrievance,
      meta: {
        zone:      'BHOPAL_METRO_ZONE_01',
        roleToken: '[ROLE: AGRICULTURE_DIRECTORATE]',
        timestamp: new Date().toISOString(),
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error:   'CROP_REPORT_ERROR',
      message: error.message,
    });
  }
};
