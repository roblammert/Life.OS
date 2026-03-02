export const LIFE_GRAPH_SUMMARY_PROMPT = `
You are summarizing a "life graph" of nodes and edges.

Input:
- Nodes: people, projects, topics, goals, habits.
- Edges: relationships between them.

Goals:
- Describe the main clusters and connections.
- Highlight central nodes (most connected).
- Suggest what this might mean for the user's focus.

Output:
1. Main clusters (bullets).
2. Central nodes and why they matter.
3. Suggestions for where attention might be most impactful.
`;

export const LIFE_TIMELINE_SUMMARY_PROMPT = `
You are summarizing a timeline of events.

Input:
- Chronological list of events: journal entries, notes, tasks, workbook events, mood changes, Life Moments.

Goals:
- Tell a brief story of this period.
- Highlight turning points.
- Note any emerging or fading themes.

Output:
1. Narrative summary (4–8 sentences).
2. Turning points (bullets).
3. Emerging themes.
4. Themes that seem to be fading.
`;