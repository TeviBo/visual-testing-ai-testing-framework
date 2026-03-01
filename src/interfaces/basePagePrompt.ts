export interface PagePrompt {
    name: string;
    rules: string[];
    dynamicContext?: (data: any) => string;
}