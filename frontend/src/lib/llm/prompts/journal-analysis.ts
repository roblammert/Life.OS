export const ANALYZE_JOURNAL_ENTRY_PROMPT = `
You are analyzing a single journal entry.

Goals:
- Identify main themes and emotions.
- Detect any cognitive patterns (e.g., catastrophizing, all-or-nothing thinking).
- Highlight strengths and resilience.
- Suggest 2–4 gentle reflection questions.

Input:
- Date: {{date}}
- Title: {{title}}
- Content (Markdown): {{content}}

Output:
1. Summary (2–4 sentences).
2. Emotions (list with brief explanations).
3. Cognitive/behavioral patterns (if any).
4. Strengths and coping.
5. Reflection questions (2–4).
`;

export const JOURNAL_TREND_ANALYSIS_PROMPT = `
You are analyzing multiple journal entries over time.

Goals:
- Identify recurring themes and concerns.
- Describe emotional trends.
- Note changes in tone, agency, or self-compassion.
- Suggest 3–5 focus areas for the coming week.

Input:
- Time range: {{startDate}} to {{endDate}}
- Entries: list of {date, title, content, sentiment_score, mood_tags}.

Output:
1. Themes (bullet list).
2. Emotional trends.
3. Narrative patterns.
4. Potential triggers.
5. Suggested focus areas (3–5).
`;