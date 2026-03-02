export const HABIT_EXTRACTION_PROMPT = `
You are inferring habits from the user's data.

Input:
- Summaries of journal entries, tasks, and storage logs over a period.

Goals:
- Identify repeated behaviors that look like habits.
- Describe how they relate to mood and productivity.

Output:
1. Habits: list of {
     name,
     description,
     evidence_examples
   }.
2. Impact: brief notes on how each habit seems to affect mood or productivity.
`;

export const ROUTINE_SUGGESTION_PROMPT = `
You are suggesting routines based on the user's patterns.

Input:
- Energy and mood patterns by time of day.
- Task types and completion patterns.
- Any stated goals.

Goals:
- Suggest morning, evening, or workday routines.

Output:
- Routines: list of {
    name,
    time_of_day,
    steps (numbered list),
    rationale
  }.
`;

export const GOAL_ALIGNMENT_PROMPT = `
You are analyzing how well tasks align with the user's goals.

Input:
- Extracted goals from journal/notes.
- Tasks with status and tags.

Goals:
- Map tasks to goals.
- Identify misaligned or goal-less tasks.
- Suggest adjustments.

Output:
1. Goal-to-task mapping (bullets).
2. Misaligned tasks (list with brief notes).
3. Suggestions for better alignment.
`;

export const LIFE_DOMAINS_ANALYSIS_PROMPT = `
You are analyzing the user's life across domains: work, relationships, health, creativity, learning, spirituality, finances.

Input:
- Summaries from journal, notes, tasks, and storage tagged or inferred by domain.

Goals:
- Describe how each domain appears currently.
- Highlight strengths and areas needing attention.

Output:
- For each domain:
  - Current state (2–3 sentences).
  - Strengths (bullets).
  - Possible focus areas (bullets).
`;