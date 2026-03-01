import {expect, Locator, Page, test} from '@playwright/test';
import {PROMPT_RESPONSE_SCHEMA} from "../../src/schemas/aiSchema";
import {PromptBuilder} from "../../src/utils/promptBuilder";
import {getAIResponse} from "../../src/utils/aiClient";
import * as allure from 'allure-js-commons'

expect.extend({
    async toBeVisualValid(received: Page | Locator, builder: PromptBuilder) {
        const prompt = builder.build(JSON.stringify(PROMPT_RESPONSE_SCHEMA));
        const screenshot = await received.screenshot();
        const analysis = await getAIResponse(prompt, screenshot);
        await allure.attachment("🧠 AI Decision Log", JSON.stringify(analysis, null, 2), "application/json");
        await allure.attachment("🖼️ AI Vision Screenshot", screenshot, "image/png");
        const isSuccess = analysis.status === "Success";
        if (isSuccess) {
            return {
                message: () => 'Visual validation passed',
                pass: true,
            };
        } else {
            const suggestionsArray = Array.isArray(analysis.suggestions)
                ? analysis.suggestions
                : (analysis.suggestions ? [analysis.suggestions] : []);
            const errorMessage = [
                `--- AI VISUAL CHECK: ${analysis.status.toUpperCase()} ---`,
                `ISSUE: ${analysis.warning}`,
                `EXPLORATORY SUGGESTIONS:`,
                ...suggestionsArray.map((s: string) => `- ${s}`),
                `--------------------------------------------`
            ].join('\n');

            return {
                message: () => errorMessage,
                pass: false,
            };
        }
    },
});

declare global {
    namespace PlaywrightTest {
        interface Matchers<R> {
            toBeVisualValid(builder: PromptBuilder): Promise<R>;
        }
    }
}