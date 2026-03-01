import { expect } from "@playwright/test";
import * as allure from 'allure-js-commons';
import { homePrompts } from "../src/prompts/pages/home.prompts";
import { footerPrompts } from "../src/prompts/pages/home.prompts";
import { test } from "../src/fixtures/baseTest";


test.describe("AI visual regression", () => {

    test('Complete Home Validation', {tag: ['@regression']}, async ({ page, createBuilder }) => {
        await allure.epic("Visual Regression Testing");
        await allure.feature("Home Page");
        await allure.story("Complete Structural Validation");
        await page.goto("index.html");
        const builder = createBuilder(homePrompts);
        await allure.step("Validar la UI con IA", async () => {
            await expect(page).toBeVisualValid(builder);
        });
    });

    test('Footer component isolated validation with dynamic context', {tag: ['@regression', '@component'],}, async ({ page, createBuilder }) => {
        await allure.epic("Visual Regression Testing");
        await allure.feature("Isolated Components");
        await allure.story("Footer Dynamic Validation");
        await allure.testCaseId("https://testcase.com")
        await page.goto('index.html');
        const todayDate = new Date().toLocaleDateString('en-US');
        const builder = createBuilder(footerPrompts).withDynamicContext(todayDate);
        const footerLocator = page.locator('.footer');
        await allure.step("Validar el componente Footer con contexto dinámico", async () => {
            await expect(footerLocator).toBeVisualValid(builder);
        });
    });
});