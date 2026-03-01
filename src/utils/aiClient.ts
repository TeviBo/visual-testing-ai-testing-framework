// src/utils/aiClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import {AIJSONResponse} from "../interfaces/aiJsonResponse";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

export async function getAIResponse(prompt: string, screenshotBuffer: Buffer): Promise<AIJSONResponse> {
    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: screenshotBuffer.toString("base64"),
                mimeType: "image/png",
            },
        },
    ]);

    const text = result.response.text();
    const cleanJson = text.replaceAll(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
}