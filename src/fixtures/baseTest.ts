import {Page, test as base} from '@playwright/test';
import {getBrowserMetadata} from "../utils/browser-metadata";
import {PagePrompt} from "../interfaces/basePagePrompt";
import {PromptBuilder} from "../utils/promptBuilder";
import {EnvironmentInfo} from "../interfaces/environment";

type MyFixtures = {
    metadata: EnvironmentInfo;
    createBuilder: (prompt: PagePrompt) => PromptBuilder;
};

export const test = base.extend<MyFixtures>({
    metadata: async ({page}, use) => {
        const data = await getBrowserMetadata(page);
        await use(data);
    },
    createBuilder: async ({metadata}, use) => {
        const factory = (prompt: PagePrompt) =>
            new PromptBuilder(prompt).withEnvironment(metadata);
        await use(factory);
    },
});