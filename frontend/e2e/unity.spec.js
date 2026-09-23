import { test, expect } from '@playwright/test';

/**
 * UNITY End-to-End Verification Suite
 * MPOnline Hackathon - Problem Statement 5: AI Innovation for Public Services & Citizen-Centric Governance
 *
 * Test Coverage:
 *  1. Top Navigation Routing & Elimination of Vertical Sidebar
 *  2. C-Lock Multi-Departmental Synchronization & Release Workflow
 *  3. Citizen Grievance Filing, Automated Tesseract OCR & OSM Geospatial Lookup
 *  4. Sentinel Policy RAG Assistant Interaction & Regulatory Citations
 */

// Helper to log in as District Collector
async function loginAsCollector(page) {
  await page.goto('/auth/login');
  await page.waitForLoadState('networkidle');

  // Fill credentials
  await page.fill('input[type="text"], input[type="email"]', 'collector@bhopal.mp.gov.in');
  await page.fill('input[type="password"]', 'Unity@2025');
  await page.click('button[type="submit"]');

  // Verify successful redirection to authority dashboard
  await expect(page).toHaveURL(/\/authority\/dashboard/, { timeout: 15000 });
}

test.describe('UNITY Institutional E2E Verification Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Set high resolution viewport matching executive command monitors
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  // ── TEST 1: Top Bar Navigation & Sidebar Removal ────────────────────────────
  test('01. Verify Executive Top Bar Navigation & Zero Sidebar Conflicts', async ({ page }) => {
    console.log('[E2E Test 1] Logging in as District Collector...');
    await loginAsCollector(page);

    // 1. Verify Top Bar institutional elements
    const topBar = page.locator('header');
    await expect(topBar).toBeVisible();
    await expect(topBar).toContainText('GOVERNMENT OF MADHYA PRADESH');
    await expect(topBar).toContainText('BHOPAL DISTRICT ADMINISTRATION');
    await expect(topBar).toContainText('[ROLE: DISTRICT_COLLECTOR]');
    await expect(topBar).toContainText('BHOPAL_METRO_ZONE_01');

    // 2. Strict Assertion: Ensure NO vertical left sidebar exists
    const leftSidebar = page.locator('aside, .sidebar-transition, [aria-label="Main navigation"]');
    await expect(leftSidebar).toHaveCount(0);
    console.log('[E2E Test 1] Confirmed: Zero conflicting vertical sidebars present.');

    // 3. Test Navigation Routing through all top tabs
    const navTabs = [
      { label: 'Mission Control',    expectedUrl: /\/authority\/projects/ },
      { label: 'GIS Utility Map',   expectedUrl: /\/authority\/map/ },
      { label: 'Dept. Directory',   expectedUrl: /\/authority\/departments/ },
      { label: 'Escalations Log',   expectedUrl: /\/authority\/coordination/ },
      { label: 'Dashboard',          expectedUrl: /\/authority\/dashboard/ },
    ];

    for (const tab of navTabs) {
      console.log(`[E2E Test 1] Navigating to tab: ${tab.label}`);
      await page.click(`header nav button:has-text("${tab.label}")`);
      await expect(page).toHaveURL(tab.expectedUrl, { timeout: 10000 });
      await page.waitForTimeout(400);
    }

    console.log('[E2E Test 1] All top navigation routes verified successfully.');
  });

  // ── TEST 2: C-Lock State Engine & Multi-Department Sign-Off ─────────────────
  test('02. Verify C-Lock State Engine & Departmental Clearance Workflow', async ({ page }) => {
    console.log('[E2E Test 2] Navigating to Clearance Console & C-Lock Hub...');
    await loginAsCollector(page);

    // Reset baseline first via API to ensure clean initial state
    await page.request.post('http://localhost:5001/api/v1/clock/reset');

    // Go to Approvals page
    await page.goto('/authority/approvals');
    await page.waitForLoadState('networkidle');

    // Verify C-Lock Hub Header
    const hubHeader = page.locator('h2:has-text("Coordination Lock (C-Lock)")');
    await expect(hubHeader).toBeVisible();

    // Verify MP Nagar project shows initial locked state
    const mpNagarCard = page.locator('div:has-text("MP Nagar Road Widening")').first();
    await expect(mpNagarCard).toBeVisible();
    await expect(page.locator('text=CRITICAL INTERLOCK').first()).toBeVisible();

    // Locate Revenue Department row and click "Grant Sign-Off"
    const revenueRow = page.locator('tr:has-text("Revenue Department")').first();
    await expect(revenueRow).toBeVisible();
    await expect(revenueRow).toContainText('BLOCKED');

    const grantBtn = revenueRow.locator('button:has-text("Grant Sign-Off")');
    await grantBtn.click();

    // Modal opens
    const modal = page.locator('div:has-text("Issue C-Lock Clearance Directive")').first();
    await expect(modal).toBeVisible();

    // Fill justification note and submit
    await page.fill('textarea', 'Provisional possession ratified under MP UDHD Circular 2024/09.');
    await page.click('button:has-text("Authorize & Release Lock")');

    // Verify success banner and updated status
    await expect(page.locator('text=Clearance recorded for Revenue Department').first()).toBeVisible({ timeout: 8000 });

    // Verify MP Nagar transitions to C-LOCK RELEASED (100% Cleared)
    await expect(page.locator('text=C-LOCK RELEASED').first()).toBeVisible();
    await expect(page.locator('text=All stakeholder departments cleared').first()).toBeVisible();

    console.log('[E2E Test 2] C-Lock release workflow verified successfully.');
  });

  // ── TEST 3: Citizen Grievance & Automated OCR / Geospatial Verification ─────
  test('03. Verify Citizen Grievance Submission, Tesseract OCR & OSM Geocoding', async ({ page }) => {
    console.log('[E2E Test 3] Navigating to Citizen Grievance Portal...');
    await page.goto('/citizen/report');
    await page.waitForLoadState('networkidle');

    // 1. Verify institutional citizen header
    await expect(page.locator('text=ZONE: BHOPAL_METRO_01')).toBeVisible();
    await expect(page.locator('text=[ROLE: CITIZEN_APPLICANT]')).toBeVisible();

    // 2. Fill basic grievance details
    await page.selectOption('select', 'roads');
    await page.fill('input[placeholder*="Carmel Convent"]', 'Road Trenching Hazard on Main Corridor');
    await page.fill('textarea[placeholder*="Describe specific structural hazards"]', 'Unauthorized utility excavation has left an open trench blocking the main road.');

    // 3. Test OpenStreetMap Nominatim reverse geocoding
    const geoBtn = page.locator('button:has-text("Resolve Ward via OpenStreetMap")');
    await expect(geoBtn).toBeVisible();
    await geoBtn.click();

    // Verify ward resolution card renders
    await expect(page.locator('text=Jurisdiction:').first()).toBeVisible({ timeout: 10000 });
    console.log('[E2E Test 3] OpenStreetMap ward resolution verified.');

    // 4. Attach photo evidence to trigger automated OCR
    // Create a 1x1 base64 png buffer dynamically
    const dummyPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.click('text=Select Image');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'civic_pothole_evidence.png',
      mimeType: 'image/png',
      buffer: dummyPngBuffer,
    });

    // Wait for OCR verification report or thumbnail
    await expect(page.locator('text=civic_pothole_evidence.png')).toBeVisible({ timeout: 12000 });

    // 5. Submit Official Grievance
    await page.click('button:has-text("Submit Official Grievance")');

    // Verify registration token appears
    await expect(page.locator('text=Grievance Registered & Dispatched')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('code:has-text("BPL-GRV-")')).toBeVisible();

    console.log('[E2E Test 3] Citizen grievance filing & validation pipeline verified.');
  });

  // ── TEST 4: Sentinel Policy RAG Assistant Interaction ───────────────────────
  test('04. Verify Sentinel Policy RAG Assistant Interaction & Regulatory Citations', async ({ page }) => {
    console.log('[E2E Test 4] Testing Sentinel Policy RAG Assistant...');
    await loginAsCollector(page);

    // 1. Click "Sentinel AI" button on Top Bar
    const sentinelBtn = page.locator('header button:has-text("Sentinel AI")');
    await expect(sentinelBtn).toBeVisible();
    await sentinelBtn.click();

    // 2. Verify modal header and role badges
    const modal = page.locator('div:has-text("UNITY SENTINEL // POLICY RAG ASSISTANT")').first();
    await expect(modal).toBeVisible();
    await expect(page.locator('text=[SYSTEM: SENTINEL_RAG_V2.1]').first()).toBeVisible();

    // 3. Click one of the suggested query buttons
    const sampleBtn = page.locator('button:has-text("statutory timeline for MPEB utility shifting")').first();
    if (await sampleBtn.isVisible()) {
      await sampleBtn.click();
    } else {
      await page.fill('input[placeholder*="Query municipal codes"]', 'What is the statutory timeline for MPEB utility shifting under BMC Act Section 142?');
      await page.click('button:has-text("Query Sentinel")');
    }

    // 4. Verify AI synthesizes and returns regulatory citations
    await expect(page.locator('text=Statutory Regulatory Citations').first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('text=CONFIDENCE:').first()).toBeVisible();

    // 5. Close modal
    await page.click('button[aria-label="Close dialog"]');
    await expect(modal).not.toBeVisible();

    console.log('[E2E Test 4] Sentinel Policy RAG interaction verified.');
  });

  // ── TEST 5: Multi-Domain Citizen Portal & Universal Tracker ─────────────────
  test('05. Verify Multi-Domain Citizen Portal Hub & Cross-Domain Tracking', async ({ page }) => {
    console.log('[E2E Test 5] Testing Multi-Domain Citizen Portal...');
    await page.goto('/citizen/portal');
    await page.waitForLoadState('networkidle');

    // 1. Verify Portal Header
    await expect(page.locator('text=PS-5 COMPLETE SUITE')).toBeVisible();
    await expect(page.locator('text=[ROLE: CITIZEN_APPLICANT]')).toBeVisible();

    // 2. Verify all domain tabs exist and switch smoothly
    const domainTabs = [
      { label: 'Education',        expectedContent: 'File School Infrastructure & Digital Learning Grievance' },
      { label: 'Scholarships',     expectedContent: 'AI-Assisted Merit & Fee Waiver Eligibility Engine' },
      { label: 'Recruitment',      expectedContent: 'Candidate Admit Card & Objection Status' },
      { label: 'Healthcare',       expectedContent: 'Bhopal Hospitals & ICU Availability' },
      { label: 'Agriculture',      expectedContent: 'Krishi Upaj Mandi Samiti, Karond' },
      { label: 'Transport',        expectedContent: 'Bhopal Key Transit Corridors & Live Frequencies' },
      { label: 'Tourism',          expectedContent: 'Bhopal Heritage Assets & Cleanliness Telemetry' },
      { label: 'Rural Development',expectedContent: 'Audit Gram Panchayat Schemes & Fund Utilization' },
      { label: 'Universal Tracker',expectedContent: 'Universal Multi-Domain Grievance & Application Tracker' },
    ];

    for (const tab of domainTabs) {
      console.log(`[E2E Test 5] Clicking tab: ${tab.label}`);
      await page.click(`button:has-text("${tab.label}")`);
      await expect(page.locator(`text=${tab.expectedContent}`).first()).toBeVisible({ timeout: 6000 });
      await page.waitForTimeout(300);
    }

    // 3. Test Universal Grievance Tracker query
    await page.click('button:has-text("Universal Tracker")');
    await page.fill('input[placeholder*="Enter Token"]', 'HLTH-BPL-2026-8812');
    await page.click('button:has-text("Track Live Status")');

    // Verify result card
    await expect(page.locator('text=Healthcare & Public Health')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=DISPATCHED_TO_CMHO_CELL')).toBeVisible();

    console.log('[E2E Test 5] Multi-Domain Citizen Portal & Universal Tracker verified.');
  });

});

