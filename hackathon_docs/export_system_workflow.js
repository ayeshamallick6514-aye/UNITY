const { chromium } = require('../frontend/node_modules/@playwright/test');
const path = require('path');

(async () => {
  console.log('Rendering reference-matching system workflow diagram to PNG...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 750 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const filePath = 'file://' + path.resolve(__dirname, 'unity_system_workflow.html').replace(/\\/g, '/');
  
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const outputPath = path.resolve(__dirname, 'unity_system_workflow.png');
  await page.screenshot({ path: outputPath, fullPage: false });

  console.log(`SUCCESS: Saved clean diagram to ${outputPath}`);
  await browser.close();
})();
