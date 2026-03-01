import {expect} from "@playwright/test";
import {homePrompts} from "../src/prompts/pages/home.prompts";
import {test} from "../src/fixtures/baseTest";
import PlaywrightTestConfig from "../playwright.config"

test.describe("Visual Regression", () => {
    test('Validación de la Home', async ({page, createBuilder}) => {
        await page.goto(PlaywrightTestConfig.use?.baseURL as string);
        const builder = createBuilder(homePrompts);
        await expect(page).toBeVisualValid(builder);
        await expect(page).toHaveScreenshot('home-baseline.png', { mask: [page.locator('#current-date')] });
    });
});