import type { CoachInsight, ModuleName, NotificationItem, ReviewSummary } from "../types";
import { createId, nowIso } from "../utils";
import { PromptEngine, type PromptInsightPayload } from "../../lib/llm/prompt-engine";

export class CoachEngine {
  private insights: CoachInsight[] = [];
  private readonly promptEngine = new PromptEngine();

  createInsight(sourceModule: ModuleName, sourceId: string, payload: PromptInsightPayload): CoachInsight {
    const insight: CoachInsight = {
      id: createId("insight"),
      sourceModule,
      sourceId,
      insightType: "summary",
      content: payload.content,
      actions: payload.actions,
      promptUsed: payload.promptUsed,
      createdAt: nowIso(),
    };
    this.insights.unshift(insight);
    return insight;
  }

  listInsights(): CoachInsight[] {
    return [...this.insights];
  }

  hydrateInsights(insights: CoachInsight[]): void {
    this.insights = insights.map((insight) => ({
      ...insight,
      actions: insight.actions ?? [],
    }));
  }

  createJournalInsight(sourceId: string, input: { date: string; title: string; content: string }): CoachInsight {
    return this.createInsight("journal", sourceId, this.promptEngine.analyzeJournalEntry(input));
  }

  createTaskInsight(sourceId: string, input: { title: string; description: string; status: string }): CoachInsight {
    return this.createInsight("tasks", sourceId, this.promptEngine.analyzeTask(input));
  }

  createNoteInsight(sourceId: string, input: { title: string; content: string }): CoachInsight {
    return this.createInsight("notes", sourceId, this.promptEngine.analyzeNote(input));
  }

  createStorageInsight(
    sourceId: string,
    input: { name: string; metricLabel: string; metricValue: number },
  ): CoachInsight {
    return this.createInsight("storage", sourceId, this.promptEngine.analyzeStorage(input));
  }

  generateNotifications(): NotificationItem[] {
    return this.promptEngine.generateNotifications(this.insights);
  }

  generateReview(period: "daily" | "weekly"): ReviewSummary {
    return this.promptEngine.generateReview(period, this.insights);
  }
}

