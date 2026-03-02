import type { ModuleName } from "../../core/types";

export interface WebLlmStructuredInsight {
  content: string;
  actions: string[];
  promptUsed: string;
}

export class WebLlmEngine {
  private initialized = true;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  generateStructuredInsightJson(input: {
    module: ModuleName;
    promptUsed: string;
    title: string;
    contentSample: string;
    actionHints: string[];
  }): string {
    if (!this.initialized) {
      throw new Error("WebLlmEngine is not initialized");
    }
    const payload: WebLlmStructuredInsight = {
      content: `${this.moduleLabel(input.module)} insight: "${input.title}" analyzed from local context.`,
      actions: input.actionHints,
      promptUsed: input.promptUsed,
    };
    if (input.contentSample.trim().length > 0) {
      payload.content = `${payload.content} ${this.trim(input.contentSample, 84)}`;
    }
    return JSON.stringify(payload);
  }

  private moduleLabel(moduleName: ModuleName): string {
    if (moduleName === "journal") return "Journal";
    if (moduleName === "notes") return "Notes";
    if (moduleName === "tasks") return "Task";
    return "Storage";
  }

  private trim(value: string, length: number): string {
    if (value.length <= length) return value;
    return `${value.slice(0, length)}...`;
  }
}
