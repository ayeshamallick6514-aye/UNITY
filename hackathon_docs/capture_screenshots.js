const { chromium } = require('../frontend/node_modules/@playwright/test');
const path = require('path');

(async () => {
  console.log('Launching headless Chromium to capture high-res UI screenshots...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // Ensure screenshots directory exists
  const outDir = path.resolve(__dirname, 'screenshots');
  const fs = require('fs');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  try {
    console.log('1. Loading Authority Portal (Mission Control / C-Lock Clearance)...');
    await page.goto('https://unity-frontend-c9z7.onrender.com/#/authority/projects', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    // Set localStorage or sessionStorage if needed for demo auth
    await page.evaluate(() => {
      sessionStorage.setItem('unity_booted', '1');
      sessionStorage.setItem('unity-auth', JSON.stringify({
        state: {
          user: {
            id: 'usr_001',
            name: 'District Collector, Bhopal',
            email: 'collector.bhopal@mp.gov.in',
            role: 'collector',
            department: 'District Collectorate',
            designation: 'District Collector',
            isDemo: true,
          },
          token: 'demo-token-collector',
          isAuthenticated: true,
        },
        version: 0,
      }));
    });
    await page.goto('https://unity-frontend-c9z7.onrender.com/#/authority/projects', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    const clockPath = path.join(outDir, 'c_lock_coordination_matrix.png');
    await page.screenshot({ path: clockPath, fullPage: false });
    console.log('Saved:', clockPath);

    console.log('2. Loading Citizen Portal Grievance Filing (GIS Ward Picker & OCR)...');
    await page.goto('https://unity-frontend-c9z7.onrender.com/#/citizen/report', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await page.waitForTimeout(2000);

    const gisPath = path.join(outDir, 'citizen_gis_ward_picker.png');
    await page.screenshot({ path: gisPath, fullPage: false });
    console.log('Saved:', gisPath);

  } catch (err) {
    console.error('Error capturing screenshot:', err);
  } finally {
    await browser.close();
  }
})();
