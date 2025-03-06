import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs/',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  timeout: 60000,
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
