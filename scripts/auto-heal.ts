// scripts/auto-heal.ts
import { chromium } from 'playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as readline from 'node:readline';
import { getAIResponse, healRulesWithAI } from '../src/utils/aiClient';
import { PromptBuilder } from '../src/utils/promptBuilder';
import { footerPrompts } from '../src/prompts/pages/home.prompts';
import { PROMPT_RESPONSE_SCHEMA } from '../src/schemas/aiSchema';
import 'dotenv/config';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const askQuestion = (query: string): Promise<string> => new Promise(resolve => rl.question(query, resolve));

async function runAutoHealer() {
    console.log("🔍 Iniciando Auto-Healing para el Footer...");

    // 1. Levantamos Playwright manualmente (sin el test runner)
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Asumimos que la app está corriendo localmente
    await page.goto("http://127.0.0.1:5500/index.html");

    // 2. Preparamos el terreno
    const todayDate = new Date().toLocaleDateString('en-US');
    const builder = new PromptBuilder(footerPrompts).withDynamicContext(todayDate);
    const prompt = builder.build(JSON.stringify(PROMPT_RESPONSE_SCHEMA));

    // Capturamos la foto del locator
    const footerLocator = page.locator('.footer');
    const screenshot = await footerLocator.screenshot();

    console.log("🤖 Consultando a la IA sobre el estado actual...");
    const analysis = await getAIResponse(prompt, screenshot);

    if (analysis.status === "Success") {
        console.log("✅ La UI coincide perfectamente con las reglas. No hay nada que curar.");
        await browser.close();
        process.exit(0);
    }

    // 3. ¡Detectamos un conflicto!
    console.log(`\n❌ CONFLICTO DETECTADO: ${analysis.warning}`);

    const answer = await askQuestion("\n✨ ¿Deseas que la IA auto-cure (reescriba) las reglas basándose en la UI actual? (y/N): ");

    if (answer.toLowerCase() === 'y') {
        console.log("⏳ Generando nuevas reglas...");
        const newRules = await healRulesWithAI(footerPrompts.rules, screenshot);

        console.log("📝 Nuevas reglas propuestas:");
        newRules.forEach((r: string) => console.log(`  - ${r}`));

        const confirm = await askQuestion("\n💾 ¿Sobrescribir el archivo home.prompts.ts con estas reglas? (y/N): ");

        if (confirm.toLowerCase() === 'y') {
            // 4. Magia de Node.js: Reescribimos el archivo fuente
            const filePath = path.resolve(__dirname, '../src/prompts/pages/home.prompts.ts');
            let fileContent = fs.readFileSync(filePath, 'utf-8');

            // Usamos un simple Regex para reemplazar el bloque de reglas del footer
            // Convertimos el array a string con formato indentado
            const rulesString = JSON.stringify(newRules, null, 8).replace(/\]$/, '    ]');

            // Buscamos el bloque rules: [...] de la constante footerPrompts y lo reemplazamos
            // Nota: Este regex es básico para el tutorial. En producción se usaría un parser AST.
            fileContent = fileContent.replace(
                /(export const footerPrompts: PagePrompt = \{\s*name: "Footer Component",\s*rules:\s*)\[[\s\S]*?\](,)/m,
                `$1${rulesString}$2`
            );

            fs.writeFileSync(filePath, fileContent, 'utf-8');
            console.log("🎉 ¡Archivo actualizado exitosamente! Tus tests ahora deberían pasar.");
        } else {
            console.log("🛑 Operación cancelada por el usuario.");
        }
    } else {
        console.log("🛑 Operación cancelada. El archivo original no fue modificado.");
    }

    rl.close();
    await browser.close();
}

runAutoHealer().catch(console.error);