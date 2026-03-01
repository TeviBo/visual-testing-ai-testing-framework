import {GoogleGenerativeAI} from "@google/generative-ai";
import {AIJSONResponse} from "../interfaces/aiJsonResponse";

export async function getAIResponse(prompt: string, screenshotBuffer: Buffer): Promise<AIJSONResponse> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({model: "gemini-3.1-pro-preview"});
    const result = await model.generateContent({
        contents: [{
            role: "user",
            parts: [
                {text: prompt},
                {
                    inlineData: {
                        data: screenshotBuffer.toString("base64"),
                        mimeType: "image/png",
                    }
                }
            ]
        }],
        generationConfig: {responseMimeType: "application/json"}
    });
    const text = result.response.text();
    return JSON.parse(text);
}

export async function healRulesWithAI(oldRules: string[], screenshotBuffer: Buffer): Promise<string[]> {
    const healPrompt = `
            You are an AI maintaining visual testing rules.
            I will provide you with the OLD RULES for a UI component and a SCREENSHOT of how the component looks NOW.
            
            OLD RULES:
            ${oldRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}
            
            TASK:
            Rewrite the rules so they perfectly describe the visual state in the provided screenshot.
            Keep the same level of detail, but correct any contradictions (like wrong colors, missing elements, or changed text).
            
            RESPONSE FORMAT:
            Return ONLY a valid JSON array of strings. No markdown formatting, no explanations.
            Example: ["Rule 1", "Rule 2"]
        `;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
    const model = genAI.getGenerativeModel({model: process.env.GEMINI_AGENT_VERSION as string});

    const result = await model.generateContent({
        contents: [{
            role: "user",
            parts: [
                {text: healPrompt},
                {inlineData: {data: screenshotBuffer.toString("base64"), mimeType: "image/png"}}
            ]
        }],
        generationConfig: {responseMimeType: "application/json"}
    });

    const text = result.response.text();
    return JSON.parse(text);
}