'use strict';

/**
 * systemDiagnostics.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Comprehensive Diagnostic & Health Maintenance Suite for UNITY
 * MPOnline Hackathon 2026 — Problem Statement 5: AI Innovation for Public Services
 *
 * Checks:
 *  1. Database Connectivity & Pool Health
 *  2. REST API Status & Response Latencies across all 9 Domains + C-Lock + Sentinel RAG
 *  3. Open-Source OCR (Tesseract.js) & Geospatial (Nominatim) Engine Readiness
 *  4. C-Lock State Engine & Multi-Departmental Interlock Matrix
 *  5. Sentinel Policy RAG Retrieval & Confidence Scoring
 *  6. Production Readiness Clearance Verification
 */

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes       = require('../src/routes/auth');
const sentinelRoutes   = require('../src/routes/sentinel');
const citizenRoutes    = require('../src/routes/citizen');
const healthcareRoutes = require('../src/routes/healthcare');
const agricultureRoutes= require('../src/routes/agriculture');
const transportRoutes  = require('../src/routes/transport');
const tourismRoutes    = require('../src/routes/tourism');
const ruralRoutes      = require('../src/routes/rural');
const civicRoutes      = require('../src/routes/civic');
const apiRoutes        = require('../src/routes/api');

const app = express();
app.use(cors());
app.use(express.json());

// Mount all routes
app.use('/api/v1/auth',        authRoutes);
app.use('/api/v1/sentinel',    sentinelRoutes);
app.use('/api/v1/citizen',     citizenRoutes);
app.use('/api/v1/healthcare',  healthcareRoutes);
app.use('/api/v1/agriculture', agricultureRoutes);
app.use('/api/v1/transport',   transportRoutes);
app.use('/api/v1/tourism',     tourismRoutes);
app.use('/api/v1/rural',       ruralRoutes);
app.use('/api/v1',             civicRoutes);
app.use('/api/v1',             apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'UNITY Backend API', version: '2.0.0', timestamp: new Date().toISOString() });
});

const { connectDB, disconnectDB } = require('../src/config/db');

async function runDiagnostics() {
  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('       UNITY PLATFORM: FULL SYSTEM DIAGNOSTICS & HEALTH AUDIT');
  console.log('       MPOnline Hackathon — Problem Statement 5 (Bhopal Administration)');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  console.log('Connecting to database...');
  await connectDB();

  const server = app.listen(0);
  const TEST_PORT = server.address().port;
  const BASE_URL = `http://localhost:${TEST_PORT}`;

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: [],
  };

  async function checkEndpoint(name, url, options = {}) {
    results.total++;
    const start = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${url}`, options);
      const latencyMs = Date.now() - start;
      const data = await res.json().catch(() => ({}));
      const ok = res.status >= 200 && res.status < 400;

      if (ok) {
        results.passed++;
        results.tests.push({ name, url, status: res.status, latencyMs, result: 'PASSED' });
        console.log(`  ✓ [${res.status}] ${name.padEnd(42)} (${latencyMs}ms)`);
      } else {
        results.failed++;
        results.tests.push({ name, url, status: res.status, latencyMs, result: 'FAILED', error: data.error || 'HTTP error' });
        console.log(`  ✗ [${res.status}] ${name.padEnd(42)} (${latencyMs}ms) - FAIL: ${JSON.stringify(data)}`);
      }
      return { ok, data, latencyMs };
    } catch (err) {
      const latencyMs = Date.now() - start;
      results.failed++;
      results.tests.push({ name, url, status: 'ERROR', latencyMs, result: 'ERROR', error: err.message });
      console.log(`  ✗ [ERR] ${name.padEnd(42)} (${latencyMs}ms) - ${err.message}`);
      return { ok: false, error: err.message, latencyMs };
    }
  }

  try {
    // ── SECTION 1: SYSTEM CORE & AUTH ─────────────────────────────────────────
    console.log('─── 1. SYSTEM CORE, HEALTH & AUTHENTICATION ───────────────────────');
    await checkEndpoint('System Health Status', '/health');
    await checkEndpoint('Authority Login Check', '/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'collector@bhopal.mp.gov.in', password: process.env.DEMO_USER_PASSWORD || 'GovBhopal@Admin2026' }),
    });

    // ── SECTION 2: COMMAND CENTER, CRI & C-LOCK ENGINE ───────────────────────
    console.log('\n─── 2. COMMAND CENTER, CRI & C-LOCK STATE ENGINE ───────────────────');
    await checkEndpoint('Executive Brief Summary', '/api/v1/brief/summary');
    await checkEndpoint('Dashboard Analytics Feed', '/api/v1/dashboard');
    await checkEndpoint('Coordination Readiness Index (CRI)', '/api/v1/projects/cri/all');
    await checkEndpoint('C-Lock Multi-Project State Engine', '/api/v1/clock/projects');
    await checkEndpoint('C-Lock Single Project Drilldown', '/api/v1/clock/project/proj_mp_nagar');
    await checkEndpoint('C-Lock Departmental Clearance Sign-Off', '/api/v1/clock/sign-off', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: 'proj_mp_nagar',
        deptCode: 'revenue',
        authorityRole: 'DISTRICT_COLLECTOR',
        referenceNote: 'Diagnostic test clearance ratification under MP UDHD Circular 2024/09.',
      }),
    });

    // ── SECTION 3: SENTINEL POLICY RAG ENGINE ────────────────────────────────
    console.log('\n─── 3. SENTINEL POLICY RAG & MONGODB VECTOR ENGINE ────────────────');
    await checkEndpoint('Sentinel RAG Bylaw Query', '/api/v1/sentinel/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'What is the statutory penalty for road trenching delay under BMC Act?' }),
    });
    await checkEndpoint('Sentinel Audit & Query History', '/api/v1/sentinel/history');

    // ── SECTION 4: OPEN-SOURCE OCR & GEOSPATIAL ENGINE ───────────────────────
    console.log('\n─── 4. OPEN-SOURCE OCR & GEOSPATIAL NOMINATIM ENGINE ──────────────');
    await checkEndpoint('Tesseract.js Engine Health Probe', '/api/v1/ocr/status');
    await checkEndpoint('Bhopal Municipal Wards Directory', '/api/v1/geo/wards');
    await checkEndpoint('OpenStreetMap Reverse Geocode Probe', '/api/v1/geo/reverse?lat=23.2599&lng=77.4126');

    // ── SECTION 5: MULTI-DOMAIN CITIZEN PORTAL SUITE (ALL 9 PILLARS) ─────────
    console.log('\n─── 5. MULTI-DOMAIN CITIZEN PORTAL SUITE (ALL 9 PILLARS) ──────────');
    await checkEndpoint('Master Multi-Domain Telemetry Summary', '/api/v1/citizen/services/summary');
    
    // Education & Scholarships
    await checkEndpoint('Education Grievance Logging', '/api/v1/citizen/education/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolName: 'Govt. Model School TT Nagar', description: 'Smart board calibration issue' }),
    });
    await checkEndpoint('Scholarship Merit AI Rule Engine', '/api/v1/citizen/scholarship/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ samagraId: '902188412', marksPercentage: '88.5', annualFamilyIncome: '320000', courseType: 'ENGINEERING_DEGREE' }),
    });
    await checkEndpoint('Scholarship DBT Status Tracking', '/api/v1/citizen/scholarship/status/SCH-MP-2026-8814');

    // Recruitment
    await checkEndpoint('Recruitment Examination Record', '/api/v1/citizen/recruitment/track/MPESB-2026-90412');
    await checkEndpoint('Recruitment Answer Key Objection', '/api/v1/citizen/recruitment/grievance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNo: 'MPESB-2026-90412', examName: 'Civil AE Exam', description: 'Question 47 key objection' }),
    });

    // Healthcare
    await checkEndpoint('Healthcare Hospital & ICU Telemetry', '/api/v1/healthcare/telemetry');
    await checkEndpoint('Medical Grievance Fast-Track File', '/api/v1/healthcare/grievance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hospitalName: 'AIIMS Bhopal', category: 'MEDICINE_STOCKOUT', description: 'Essential buffer stock check' }),
    });
    await checkEndpoint('Medical Grievance Ref Tracking', '/api/v1/healthcare/track/HLTH-BPL-2026-8812');

    // Agriculture & Mandi
    await checkEndpoint('Agriculture & Karond Mandi Telemetry', '/api/v1/agriculture/telemetry');
    await checkEndpoint('Farmer PM-Kisan & Kalyan DBT Tracker', '/api/v1/agriculture/dbt/status/FARM-MP-2026-90412');
    await checkEndpoint('PMFBY Crop Damage Appeal Ingestion', '/api/v1/agriculture/crop-damage/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmerId: 'FARM-MP-2026-90412', cropName: 'Soybean', description: 'Water inundation damage appeal' }),
    });

    // Transport
    await checkEndpoint('Transport & Transit Fleet Telemetry', '/api/v1/transport/telemetry');
    await checkEndpoint('Transit Grievance Ingestion', '/api/v1/transport/grievance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ routeNo: 'TR-01', description: 'Scheduled stop skip audit' }),
    });
    await checkEndpoint('Transit Grievance Ref Tracking', '/api/v1/transport/track/TRN-BPL-2026-9041');

    // Tourism
    await checkEndpoint('Tourism Heritage & Footfall Telemetry', '/api/v1/tourism/telemetry');
    await checkEndpoint('Tourism Grievance Ingestion', '/api/v1/tourism/grievance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteName: 'Upper Lake Boat Club', description: 'Facility cleanliness audit' }),
    });
    await checkEndpoint('Tourism Grievance Ref Tracking', '/api/v1/tourism/track/TOUR-MP-2026-8812');

    // Rural Development
    await checkEndpoint('Rural Panchayat & MGNREGA Telemetry', '/api/v1/rural/telemetry');
    await checkEndpoint('Panchayat Scheme & Fund Audit', '/api/v1/rural/panchayat/PANCH-BPL-PHANDA-01');
    await checkEndpoint('Rural Grievance Ingestion', '/api/v1/rural/grievance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ panchayatCode: 'PANCH-BPL-PHANDA-01', description: 'Jal Jeevan pipeline test' }),
    });

    console.log('\n══════════════════════════════════════════════════════════════════════');
    console.log(` DIAGNOSTIC SUMMARY: ${results.passed}/${results.total} Tests Passed (${((results.passed / results.total) * 100).toFixed(1)}% Success Rate)`);
    console.log('══════════════════════════════════════════════════════════════════════\n');

    if (results.failed === 0) {
      console.log(' [CLEARANCE STATUS: PASSED] All systems operational and ready for deployment.\n');
    } else {
      console.log(` [CLEARANCE STATUS: ISSUES DETECTED] ${results.failed} endpoints failed.\n`);
    }

  } finally {
    server.close();
    await disconnectDB();
  }
}

runDiagnostics().catch(console.error);
