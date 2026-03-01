import { expect } from "@playwright/test";
import { homePrompts } from "../src/prompts/pages/home.prompts";
// Importamos el nuevo prompt del footer
import { footerPrompts } from "../src/prompts/pages/home.prompts";
import { test } from "../src/fixtures/baseTest";
import PlaywrightTestConfig from "../playwright.config"

test.describe("AI visual regression", () => {

    test('Complete Home Validation', async ({ page, createBuilder }) => {
        await page.goto('index.html');
        const builder = createBuilder(homePrompts);
        await expect(page).toBeVisualValid(builder);
    });

    test('Footer component isolated validation with dynamic context', async ({ page, createBuilder }) => {
        await page.goto('index.html');
        const todayDate = new Date().toLocaleDateString('en-US');
        const builder = createBuilder(footerPrompts).withDynamicContext(todayDate);
        const footerLocator = page.locator('.footer');
        await expect(footerLocator).toBeVisualValid(builder);
    });
});