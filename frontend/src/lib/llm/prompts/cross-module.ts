export const DAILY_INSIGHT_DIGEST_PROMPT = `
You are generating a daily insight digest across all modules.

Input:
- Date: {{date}}
- Journal summary for the day.
- Notes summary for the day.
- Task summary (created, completed, overdue).
- Storage summary (if any).
- Mood and sentiment metrics.

Goals:
- Provide a concise overview of the day.
- Highlight notable patterns or changes.
- Suggest 2–4 gentle next steps or reflections.

Output:
1. Daily summary (3–6 sentences).
2. Highlights (bullets).
3. Concerns or watchpoints (if any).
4. Suggested next steps (2–4).
`;

export const WEEKLY_REVIEW_PROMPT = `
You are generating a weekly review across all modules.

Input:
- Week range: {{startDate}} to {{endDate}}
- Aggregated summaries:
  - Journal themes and mood trends.
  - Notes clusters and key ideas.
  - Task stats.
  - Storage insights.
  - Key Life.Coach insights.

Output:
1. Week in review (4–8 sentences).
2. Wins (bullets).
3. Challenges (bullets).
4. Patterns.
5. Focus for next week (3–5 items).
`;

export const CORRELATION_ANALYSIS_PROMPT = `
You are analyzing correlations between different aspects of the user's life.

Input:
- Mood data over time.
- Task completion data.
- Topic frequencies from journal/notes.
- Optional numeric data from Storage.

Goals:
- Identify plausible relationships (correlations, not causation).
- Suggest experiments the user could try.

Output:
1. Observed correlations (bullets).
2. Caveats.
3. Experiments (2–4 simple ideas).
`;