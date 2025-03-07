import { test as base } from '@playwright/test';

import { performance } from 'perf_hooks';

// Define a custom fixture that extends the base test
export const test = base.extend<{ testTimer: void }>({ 
    testTimer: [async ({}, use, testInfo) => {
        const start = performance.now(); // Start timing the test
        await use();
        const end = performance.now(); // End timing the test
        const duration = end - start;
        console.log(`Test "${testInfo.title}" took ${duration}ms`);
      }, { auto: true }],
  });
  
  export { expect } from '@playwright/test';