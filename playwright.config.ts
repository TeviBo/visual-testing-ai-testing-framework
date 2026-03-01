import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import './tests/setup/matchers';
import './src/fixtures/baseTest';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['allure-playwright', {
            detail: true,
            outputFolder: 'reports/allure-results',
            environmentInfo: {
                Framework: 'Playwright AI Visual Testing',
                Node_Version: process.version,
                OS: process.platform,
                Environment: process.env.TEST_ENV?.toUpperCase() || 'local'
            }
        }]
    ],
    timeout: 60000,
    use: {
        trace: 'on-first-retry',
        headless: true,
        baseURL: process.env.BASE_URL || "http://127.0.0.1:5500"
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npx serve -p 5500 .',
        url: 'http://127.0.0.1:5500',
        reuseExistingServer: !process.env.CI,
    },
});