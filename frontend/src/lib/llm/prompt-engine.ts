import { ANALYZE_JOURNAL_ENTRY_PROMPT } from "./prompts/journal-analysis";
import { NOTES_ACTION_EXTRACTION_PROMPT } from "./prompts/notes-analysis";
import {
  LIFE_MOMENTS_DETECTION_PROMPT,
  MEMORY_CONSOLIDATION_PROMPT,
  SMART_NOTIFICATION_SUGGESTIONS_PROMPT,
} from "./prompts/reviews";
import { STORAGE_DATA_INSIGHTS_PROMPT } from "./prompts/storage-analysis";
import { TASK_BEHAVIOR_ANALYSIS_PROMPT, TASK_BREAKDOWN_PROMPT } from "./prompts/task-analysis";
import { WebLlmEngine, type WebLlmStructuredInsight } from "./webllm";
import type { CoachInsight, LifeMoment, NotificationItem, ReviewSummary } from "../../core/types";

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

  generateNotifications(insights: CoachInsight[]): NotificationItem[] {
    renderPrompt(SMART_NOTIFICATION_SUGGESTIONS_PROMPT, {});
    return insights.slice(0, 3).map((insight, index) => ({
      id: `notif-${insight.id}`,
      triggerDescription: `Pattern in ${insight.sourceModule}`,
      message: `Check-in: ${insight.actions[index % insight.actions.length] ?? insight.content.slice(0, 80)}`,
    }));
  }

  generateReview(period: "daily" | "weekly", insights: CoachInsight[]): ReviewSummary {
    const now = new Date().toISOString().slice(0, 10);
    renderPrompt(MEMORY_CONSOLIDATION_PROMPT, {
      startDate: now,
      endDate: now,
    });
    const topInsights = insights.slice(0, period === "daily" ? 3 : 5);
    return {
      period,
      summary:
        topInsights.length > 0
          ? `${period === "daily" ? "Daily" : "Weekly"} review generated from ${topInsights.length} recent insights.`
          : `No recent insights for ${period} review yet. Capture new entries to generate richer reflection.`,
      lessons: topInsights.map((insight) => insight.content).slice(0, 3),
      nextFocus: topInsights.flatMap((insight) => insight.actions).slice(0, 3),
    };
  }

  generateLifeMoments(insights: CoachInsight[]): LifeMoment[] {
    renderPrompt(LIFE_MOMENTS_DETECTION_PROMPT, {});
    return insights.slice(0, 3).map((insight, index) => ({
      id: `moment-${insight.id}`,
      date: insight.createdAt.slice(0, 10),
      title: `Life Moment ${index + 1}: ${insight.sourceModule}`,
      description: insight.content,
      whyItMatters: insight.actions[0] ?? "Reflective continuity across modules.",
    }));
  }
}

