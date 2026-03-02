import type { CoachInsight, ModuleName } from "../types";
import { createId, nowIso } from "../utils";
import { PromptEngine } from "../../lib/llm/prompt-engine";

export class CoachEngine {
  private insights: CoachInsight[] = [];
  private readonly promptEngine = new PromptEngine();

  createInsight(sourceModule: ModuleName, sourceId: string, content: string): CoachInsight {
    const insight: CoachInsight = {
      id: createId("insight"),
      sourceModule,
      sourceId,
      insightType: "summary",
      content,
      createdAt: nowIso(),
    };
    this.insights.unshift(insight);
    return insight;
  }

  listInsights(): CoachInsight[] {
    return [...this.insights];
  }

  hydrateInsights(insights: CoachInsight[]): void {
    this.insights = [...insights];
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
}

