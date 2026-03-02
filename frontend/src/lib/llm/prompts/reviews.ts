export const LIFE_MOMENTS_DETECTION_PROMPT = `
You are detecting "Life Moments" from recent data.

Input:
- Recent journal entries, notes, tasks, and mood data.

Goals:
- Identify breakthroughs, milestones, emotional shifts, or new themes.
- Describe why they might be significant.

Output:
- Moments: list of {
    date,
    title,
    description,
    why_it_matters
  }.
`;

export const SMART_NOTIFICATION_SUGGESTIONS_PROMPT = `
You are suggesting possible local notifications.

Input:
- Recent patterns: stress, procrastination, important themes, upcoming deadlines.

Goals:
- Propose a few gentle, non-intrusive notifications that could help.
- Avoid anything pushy or guilt-inducing.

Output:
- Notifications: list of {
    trigger_description,
    suggested_message
  }.
`;

export const MEMORY_CONSOLIDATION_PROMPT = `
You are creating a "memory consolidation" summary for a longer period.

Input:
- Time range: {{startDate}} to {{endDate}}
- Aggregated summaries from all modules.
- Life Moments detected in this period.

Goals:
- Capture key events, lessons, and changes.
- Build a sense of continuity and growth.

Output:
1. Period summary (6–12 sentences).
2. Key lessons (bullets).
3. Changes in patterns (bullets).
4. Possible themes for the next chapter.
`;