import { ANALYZE_JOURNAL_ENTRY_PROMPT } from "./prompts/journal-analysis";
import { NOTES_ACTION_EXTRACTION_PROMPT } from "./prompts/notes-analysis";
import { STORAGE_DATA_INSIGHTS_PROMPT } from "./prompts/storage-analysis";
import { TASK_BEHAVIOR_ANALYSIS_PROMPT, TASK_BREAKDOWN_PROMPT } from "./prompts/task-analysis";

function renderPrompt(template: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template,
  );
}

export class PromptEngine {
  analyzeJournalEntry(input: { date: string; title: string; content: string }): string {
    renderPrompt(ANALYZE_JOURNAL_ENTRY_PROMPT, input);
    const hasQuestion = input.content.includes("?");
    return hasQuestion
      ? `Journal insight: "${input.title}" shows active reflection; choose one question and answer it concretely today.`
      : `Journal insight: "${input.title}" captures a clear snapshot; add one reflection question to deepen the entry.`;
  }

  analyzeTask(input: { title: string; description: string; status: string }): string {
    renderPrompt(TASK_BREAKDOWN_PROMPT, { title: input.title, description: input.description });
    renderPrompt(TASK_BEHAVIOR_ANALYSIS_PROMPT, {});
    const complexityHint = input.description.trim().length > 80 ? "break it into two subtasks" : "schedule a focused block";
    return `Task insight: "${input.title}" is ${input.status}; ${complexityHint} to reduce procrastination risk.`;
  }

  analyzeNote(input: { title: string; content: string }): string {
    renderPrompt(NOTES_ACTION_EXTRACTION_PROMPT, {});
    const actionHint = input.content.toLowerCase().includes("todo") ? "convert TODO points into tasks" : "capture one concrete next action";
    return `Notes insight: "${input.title}" is saved; ${actionHint} and link it to a related journal entry.`;
  }

  analyzeStorage(input: { name: string; metricLabel: string; metricValue: number }): string {
    renderPrompt(STORAGE_DATA_INSIGHTS_PROMPT, {
      description: `${input.name} includes ${input.metricLabel}=${input.metricValue}`,
    });
    return `Storage insight: "${input.metricLabel}" is at ${input.metricValue}; track it weekly to detect trend direction.`;
  }
}

