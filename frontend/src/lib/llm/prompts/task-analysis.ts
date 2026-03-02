export const TASK_BEHAVIOR_ANALYSIS_PROMPT = `
You are analyzing the user's tasks and completion history.

Goals:
- Estimate which tasks feel difficult or are likely to be procrastinated.
- Identify patterns in when tasks are completed.
- Suggest strategies for working with these patterns.

Input:
- Tasks: list of {id, title, description_markdown, status, created_at, completed_at?, tags}.
- Optional: recent mood or journal summaries.

Output:
1. Difficulty patterns.
2. Timing patterns.
3. Procrastination cues.
4. Suggestions (3–6 practical strategies).
`;

export const TASK_BREAKDOWN_PROMPT = `
You are helping break down a single task into smaller steps.

Input:
- Task title: {{title}}
- Task description: {{description}}

Output:
- Numbered list of subtasks, each with:
  - short_title
  - description
`;
