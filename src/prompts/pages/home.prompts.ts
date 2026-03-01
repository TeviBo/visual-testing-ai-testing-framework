import {PagePrompt} from "../../interfaces/basePagePrompt";

export const homePrompts: PagePrompt = {
    name: "Home Page",
    rules: [
        "The 'Get Pizza' button must be visible and red.",
        "The navigation bar must contain: Home, Products, and Contact.",
        "The footer must display a valid date."
    ],
    dynamicContext: (todayDate: string) =>
        `The expected date for today's execution is: ${todayDate}`
};

export const homePromptsConflict: PagePrompt = {
    name: "Home Page",
    rules: [
        "The navigation bar must display exactly three links: 'Home', 'Products', and 'Contact'.",
        "A red 'Get Pizza' button must be visible in the center of the hero section."
    ],
    dynamicContext: (mode: string) =>
        `The application is currently running in: ${mode}.`
};

export const footerPrompts: PagePrompt = {
    name: "Footer Component",
    rules: [
        "It must display the text 'Today is:' followed by a valid date.",
        "The text color should be light blue.",
        "The background must match the page background (no distinct box)."
    ],
    dynamicContext: (expectedDate: string) =>
        `The exact date displayed must be: ${expectedDate}`
};