export type AIStatus = 'Success' | 'Failed' | 'Conflict';

export interface AIJSONResponse {
    status: AIStatus;
    expectedRules: string;
    result: string;
    warning?: string;
    suggestions?: string;
}