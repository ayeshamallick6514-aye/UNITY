const { chromium } = require('../frontend/node_modules/@playwright/test');
const path = require('path');

(async () => {
  console.log('Launching Chromium to render workflow diagram...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2 // 2x Retina rendering for crystal-sharp text
  });

  const page = await context.newPage();
  const filePath = 'file://' + path.resolve(__dirname, 'workflow_canvas.html').replace(/\\/g, '/');
  
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // Allow fonts to render cleanly

  const outputPath = path.resolve(__dirname, 'workflow_diagram.png');
  await page.screenshot({ path: outputPath, fullPage: false });

  console.log(`SUCCESS: Workflow diagram saved cleanly to: ${outputPath}`);
  await browser.close();
})();
