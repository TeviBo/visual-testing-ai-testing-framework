import {Page} from "@playwright/test";

export async function getBrowserMetadata(page: Page) {
    return await page.evaluate(() => {
        return {
            language: document.documentElement.lang || 'en',
            isDarkMode: globalThis.matchMedia('(prefers-color-scheme: dark)').matches,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            deviceScaleFactor: window.devicePixelRatio,
            userAgent: navigator.userAgent, // Esto nos dice el motor y versión
        };
    });
}