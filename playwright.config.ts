import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs/',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    // Setting locale to 'en-GB' to ensure consistent date formats and language
    locale: 'en-GB',
    // setting geolocation to London, UK
    geolocation: { latitude: 51.5074, longitude: -0.1278 },
    screenshot: 'only-on-failure',
  },
  // Setting timeout to 3 minutes
  timeout: 180000,
  retries: 2,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'] },
    }
  ],
});
