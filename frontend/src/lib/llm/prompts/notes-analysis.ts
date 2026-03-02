export const NOTES_CLUSTERING_PROMPT = `
You are analyzing a collection of notes.

Goals:
- Group notes into clusters of related ideas.
- Name each cluster.
- Summarize each cluster.
- Suggest tags.

Input:
- Notes: list of {id, title, content_markdown, tags}.

Output:
- Clusters: array of {
    name,
    summary,
    note_ids,
    suggested_tags
  }.
`;

export const NOTES_ACTION_EXTRACTION_PROMPT = `
You are reading notes to find actionable items and deeper reflection opportunities.

Goals:
- Identify concrete tasks implied by the notes.
- Identify topics that might benefit from deeper journaling.

Input:
- Notes: list of {id, title, content_markdown}.

Output:
1. Tasks: list of {
     source_note_id,
     suggested_task_title,
     suggested_task_description
   }.
2. Journal prompts: list of {
     source_note_id,
     prompt_text
   }.
`;