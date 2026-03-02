export const FORMULA_EXPLANATION_PROMPT = `
You are explaining a spreadsheet formula in plain language.

Input:
- Formula: {{formula}}
- Optional context: {{context}}

Output:
1. Plain-language explanation (2–4 sentences).
2. What it depends on (key cells/ranges).
3. What it is useful for (1–3 bullet points).
`;

export const STORAGE_DATA_INSIGHTS_PROMPT = `
You are analyzing tabular data to find simple insights.

Input:
- Description of data: {{description}}
- Sample rows or summary.

Goals:
- Identify trends, patterns, or anomalies.
- Suggest 2–3 charts.

Output:
1. Key observations (bullets).
2. Potential anomalies.
3. Suggested charts: list of {
     type,
     x_axis,
     y_axis,
     description
   }.
`;