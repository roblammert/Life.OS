import { ANALYZE_JOURNAL_ENTRY_PROMPT } from "./prompts/journal-analysis";
import { NOTES_ACTION_EXTRACTION_PROMPT } from "./prompts/notes-analysis";
import { STORAGE_DATA_INSIGHTS_PROMPT } from "./prompts/storage-analysis";
import { TASK_BEHAVIOR_ANALYSIS_PROMPT, TASK_BREAKDOWN_PROMPT } from "./prompts/task-analysis";
import { WebLlmEngine, type WebLlmStructuredInsight } from "./webllm";

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
  private readonly webLlm = new WebLlmEngine();

  analyzeJournalEntry(input: { date: string; title: string; content: string }): PromptInsightPayload {
    const promptUsed = renderPrompt(ANALYZE_JOURNAL_ENTRY_PROMPT, input);
    const actionHints = input.content.includes("?")
      ? ["Answer one open question in the entry.", "Capture one cognitive pattern you notice."]
      : ["Add one reflection question.", "Tag the entry with a mood label."];
    return this.generatePayload("journal", promptUsed, input.title, input.content, actionHints);
  }

  analyzeTask(input: { title: string; description: string; status: string }): PromptInsightPayload {
    const breakdownPrompt = renderPrompt(TASK_BREAKDOWN_PROMPT, { title: input.title, description: input.description });
    const behaviorPrompt = renderPrompt(TASK_BEHAVIOR_ANALYSIS_PROMPT, {});
    const actionHints =
      input.description.trim().length > 80
        ? ["Break this task into two subtasks.", "Define a first 10-minute step."]
        : ["Schedule a focused block.", "Remove one distraction before starting."];
    return this.generatePayload(
      "tasks",
      `${breakdownPrompt}\n\n${behaviorPrompt}`,
      input.title,
      `${input.status}: ${input.description}`,
      actionHints,
    );
  }

  analyzeNote(input: { title: string; content: string }): PromptInsightPayload {
    const promptUsed = renderPrompt(NOTES_ACTION_EXTRACTION_PROMPT, {});
    const actionHints = input.content.toLowerCase().includes("todo")
      ? ["Convert TODO points into tasks.", "Link this note to a journal entry."]
      : ["Capture one concrete next action.", "Tag the note with one topic keyword."];
    return this.generatePayload("notes", promptUsed, input.title, input.content, actionHints);
  }

  analyzeStorage(input: { name: string; metricLabel: string; metricValue: number }): PromptInsightPayload {
    const promptUsed = renderPrompt(STORAGE_DATA_INSIGHTS_PROMPT, {
      description: `${input.name} includes ${input.metricLabel}=${input.metricValue}`,
    });
    return this.generatePayload(
      "storage",
      promptUsed,
      input.name,
      `${input.metricLabel}: ${input.metricValue}`,
      ["Capture next data point in 7 days.", "Create a trend chart for this metric."],
    );
  }

  private generatePayload(
    module: "journal" | "notes" | "tasks" | "storage",
    promptUsed: string,
    title: string,
    contentSample: string,
    actionHints: string[],
  ): PromptInsightPayload {
    const json = this.webLlm.generateStructuredInsightJson({
      module,
      promptUsed,
      title,
      contentSample,
      actionHints,
    });
    const parsed = JSON.parse(json) as WebLlmStructuredInsight;
    if (!parsed.content || !Array.isArray(parsed.actions) || !parsed.promptUsed) {
      throw new Error("WebLlmEngine returned invalid structured insight payload");
    }
    return parsed;
  }
}

