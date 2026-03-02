import type { CoachInsight, ModuleName } from "../types";
import { createId, nowIso } from "../utils";

export class CoachEngine {
  private insights: CoachInsight[] = [];

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
}

