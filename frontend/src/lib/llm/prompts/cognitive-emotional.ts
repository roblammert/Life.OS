export const EMOTIONAL_WEATHER_PROMPT = `
You are generating an "emotional weather" summary.

Input:
- Recent mood and sentiment data.
- Recent journal summaries.

Goals:
- Describe the current emotional climate.
- Note short-term trends.
- Suggest gentle ways to navigate the coming days.

Output:
1. Emotional climate (2–4 sentences).
2. Trends (bullets).
3. Suggestions (3–5 gentle ideas).
`;

export const COGNITIVE_BIAS_DETECTION_PROMPT = `
You are looking for cognitive patterns in the user's text.

Input:
- Selected journal and note excerpts.

Goals:
- Detect possible cognitive patterns (e.g., catastrophizing, all-or-nothing thinking).
- Describe them gently and non-judgmentally.
- Offer alternative perspectives or reframes.

Output:
1. Observed patterns (bullets with examples).
2. Gentle explanations.
3. Possible reframes or questions to consider.
`;

export const RELATIONSHIP_INSIGHT_PROMPT = `
You are analyzing how the user writes about people in their life.

Input:
- Extracts mentioning specific people, with context.

Goals:
- Identify emotional tone around each person.
- Note recurring topics or dynamics.
- Suggest reflection questions.

Output:
- For each person:
  - Emotional tone summary.
  - Key themes.
  - Reflection questions (2–3).
`;