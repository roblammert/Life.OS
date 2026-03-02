import { ANALYZE_JOURNAL_ENTRY_PROMPT } from "./prompts/journal-analysis";
import { NOTES_ACTION_EXTRACTION_PROMPT } from "./prompts/notes-analysis";
import { STORAGE_DATA_INSIGHTS_PROMPT } from "./prompts/storage-analysis";
import { TASK_BEHAVIOR_ANALYSIS_PROMPT, TASK_BREAKDOWN_PROMPT } from "./prompts/task-analysis";

export interface PromptInsightPayload {
  content: string;
  actions: string[];
  promptUsed: string;
}

function renderPrompt(template: string, variables: Record<string, string>): string {
  return Object.entries(variables).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template,
  );
}

export class PromptEngine {
  analyzeJournalEntry(input: { date: string; title: string; content: string }): PromptInsightPayload {
    const promptUsed = renderPrompt(ANALYZE_JOURNAL_ENTRY_PROMPT, input);
    const hasQuestion = input.content.includes("?");
    return {
      content: hasQuestion
        ? `Journal insight: "${input.title}" shows active reflection; choose one question and answer it concretely today.`
        : `Journal insight: "${input.title}" captures a clear snapshot; add one reflection question to deepen the entry.`,
      actions: hasQuestion
        ? ["Answer one open question in the entry.", "Capture one cognitive pattern you notice."]
        : ["Add one reflection question.", "Tag the entry with a mood label."],
      promptUsed,
    };
  }

  analyzeTask(input: { title: string; description: string; status: string }): PromptInsightPayload {
    const breakdownPrompt = renderPrompt(TASK_BREAKDOWN_PROMPT, { title: input.title, description: input.description });
    const behaviorPrompt = renderPrompt(TASK_BEHAVIOR_ANALYSIS_PROMPT, {});
    const complexityHint = input.description.trim().length > 80 ? "break it into two subtasks" : "schedule a focused block";
    return {
      content: `Task insight: "${input.title}" is ${input.status}; ${complexityHint} to reduce procrastination risk.`,
      actions: [
        "Define a first 10-minute step.",
        "Set a due time block and remove one distraction.",
      ],
      promptUsed: `${breakdownPrompt}\n\n${behaviorPrompt}`,
    };
  }

  analyzeNote(input: { title: string; content: string }): PromptInsightPayload {
    const promptUsed = renderPrompt(NOTES_ACTION_EXTRACTION_PROMPT, {});
    const actionHint = input.content.toLowerCase().includes("todo") ? "convert TODO points into tasks" : "capture one concrete next action";
    return {
      content: `Notes insight: "${input.title}" is saved; ${actionHint} and link it to a related journal entry.`,
      actions: ["Create one linked task.", "Link this note to one recent journal entry."],
      promptUsed,
    };
  }

  analyzeStorage(input: { name: string; metricLabel: string; metricValue: number }): PromptInsightPayload {
    const promptUsed = renderPrompt(STORAGE_DATA_INSIGHTS_PROMPT, {
      description: `${input.name} includes ${input.metricLabel}=${input.metricValue}`,
    });
    return {
      content: `Storage insight: "${input.metricLabel}" is at ${input.metricValue}; track it weekly to detect trend direction.`,
      actions: ["Capture next data point in 7 days.", "Create a trend chart for this metric."],
      promptUsed,
    };
  }
}

