export class WebLlmEngine {
  private initialized = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async summarize(text: string): Promise<string> {
    if (!this.initialized) {
      throw new Error("WebLlmEngine is not initialized");
    }
    return `Local summary: ${text.slice(0, 120)}`;
  }
}
