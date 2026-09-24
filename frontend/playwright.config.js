import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration for UNITY
 * Smart City Infrastructure Coordination Platform (Bhopal District)
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 90000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  workers: 1, // sequential execution for deterministic state transitions
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'node ../backend/server.js',
      url: 'http://localhost:5001/health',
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
});
