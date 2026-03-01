// src/schemas/aiSchema.ts

export const PROMPT_RESPONSE_SCHEMA = {
    status: "Must be exactly one of: 'Success', 'Failed', or 'Conflict'",
    expectedRules: "The rules that were expected to be validated",
    result: "The detailed analysis of what was found in the UI",
    warning: "Only if status is 'Conflict' or 'Failed': A clear explanation of the issue",
    suggestions: [
        "Only if status is 'Conflict' or 'Failed': Suggestion 1",
        "Suggestion 2"
    ]
};