import { test } from '@playwright/test';
import 'dotenv/config';

test('List Gemini Models', async () => {
    const apiKey = process.env.MI_IA_API_KEY;
    if (!apiKey) throw new Error("Missing API Key");

    // We call the underlying REST API directly
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // We filter and print only the names to keep the console clean
    const modelNames = data.models.map((model: any) => model.name);
    console.log("Available models:", modelNames);
});