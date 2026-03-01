import { BASE_AI_INSTRUCTIONS } from '../prompts/base-instructions';
import {PagePrompt} from "../interfaces/basePagePrompt";
import {EnvironmentInfo} from "../interfaces/environment";


export class PromptBuilder {
    private readonly page: PagePrompt;
    private dynamicContext: string = "";
    private readonly suggestionStyle: string = `
        # SUGGESTION TONE & STYLE
        When providing 'suggestions', use an exploratory and collaborative tone. 
        Instead of giving direct orders, use phrases such as:
        - "It seems like there might be a mismatch between..."
        - "Could it be that the test is expecting X while the context shows Y?"
        - "You might want to check if..."
        This helps the developer investigate the root cause of the conflict.
    `;
    private environmentContext: string = "";
    constructor(page: PagePrompt) {
        this.page = page;
    }

    withEnvironment(env: EnvironmentInfo): this {
        this.environmentContext = `
            # BROWSER ENVIRONMENT INFO:
            - Language: ${env.language}
            - Browser Engine: ${env.userAgent}
            - Resolution: ${env.viewport}
            - High DPI (Retina): ${env.deviceScaleFactor > 1 ? 'Yes' : 'No'}
            - Color Scheme: ${env.isDarkMode ? 'Dark Mode' : 'Light Mode'}
        `.trim();
        return this;
    }

    withDynamicContext(data: any): this {
        if (this.page.dynamicContext) {
            this.dynamicContext = this.page.dynamicContext(data);
        }
        return this;
    }

    build(responseSchema: string): string {
        const pageRulesList = this.page.rules
            .map((rule, index) => `${index + 1}. ${rule}`)
            .join('\n');

        return `
                ${BASE_AI_INSTRUCTIONS}
                ${this.environmentContext}
                ${this.suggestionStyle}
                
                # PAGE SPECIFIC RULES: ${this.page.name}
                ${pageRulesList}
                
                # ADDITIONAL CONTEXT (PRIORITY)
                ${this.dynamicContext}
                *Important: If any instruction in this 'Additional Context' conflicts with the 'Page Specific Rules', the 'Additional Context' takes precedence.*
                
                # REQUIRED RESPONSE FORMAT
                Return ONLY a valid JSON object following this structure:
                ${responseSchema}
                
                # CRITICAL OUTPUT RULES:
                1. If status is 'Conflict', the fields 'warning' and 'suggestions' are MANDATORY.
                2. 'warning' must clearly state the nature of the logical contradiction.
                3. 'suggestions' must follow the 'SUGGESTION TONE & STYLE' guidelines.
            `.trim();
    }
}