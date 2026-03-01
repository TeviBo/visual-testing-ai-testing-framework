import {expect, Locator, Page} from '@playwright/test';
import {PROMPT_SCHEMA} from "../../src/schemas/aiSchema";
import {PromptBuilder} from "../../src/utils/promptBuilder";
import {getAIResponse} from "../../src/utils/aiClient";

expect.extend({
    async toBeVisualValid(received: Page | Locator, builder: PromptBuilder) {
        const prompt = builder.build(JSON.stringify(PROMPT_SCHEMA));
        const screenshot = await received.screenshot();
        const analysis = await getAIResponse(prompt, screenshot);
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