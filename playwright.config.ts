import {defineConfig, devices} from '@playwright/test';
import 'dotenv/config';
import './tests/setup/matchers';
import './src/fixtures/baseTest';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    timeout: 60000,
    use: {
        trace: 'on-first-retry',
        headless: true,
        baseURL: process.env.BASE_URL || "http://127.0.0.1:5500/index.html"
    },


    projects: [
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },
    ],
});
