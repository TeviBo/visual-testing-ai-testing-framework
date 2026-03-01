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
    outputDir: 'reports/test-results',
    snapshotDir: 'reports/snapshots',
    reporter: [
        ['allure-playwright', {
            detail: true,
            suiteTitle: false,
            resultsDir: 'reports/allure-results',
            environmentInfo: {
                Framework: 'Playwright AI Visual Testing',
                Node_Version: process.version,
                OS: process.platform,
                Environment: process.env.TEST_ENV?.toUpperCase() || 'local'
            },
            categories: [
                {
                    "name": "🧠 Logic & Environment Conflicts (AI)",
                    "messageRegex": ".*AI VISUAL CHECK: CONFLICT.*",
                    "matchedStatuses": ["failed"]
                },
                {
                    "name": "🎨 Design Deviations (AI)",
                    "messageRegex": ".*AI VISUAL CHECK: FAILED.*",
                    "matchedStatuses": ["failed"]
                },
                {
                    "name": "🍂 Potential Flaky Tests (Timeouts)",
                    "messageRegex": ".*Timeout.*|.*locator\\.waitFor.*",
                    "matchedStatuses": ["broken", "failed"]
                },
                {
                    "name": "⚙️ Infrastructure Errors",
                    "messageRegex": ".*net::ERR_CONNECTION_REFUSED.*",
                    "matchedStatuses": ["broken"]
                }
            ],
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