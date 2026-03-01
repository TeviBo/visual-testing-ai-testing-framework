import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analizarImagenConIA(imagenBuffer: Buffer, prompt: string) {
    const apiKey = process.env.MI_IA_API_KEY;
    if (!apiKey) throw new Error("Falta la API Key en el archivo .env");

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-3.1-pro-preview" });

    const imagenBase64 = imagenBuffer.toString('base64');
    const imagenParaGemini = {
        inlineData: { data: imagenBase64, mimeType: "image/png" },
    };

    const respuestaGemini = await model.generateContent([prompt, imagenParaGemini]);

    return respuestaGemini.response.text();
}