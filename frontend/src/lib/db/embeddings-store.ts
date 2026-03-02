export interface EmbeddingRecord {
  id: string;
  sourceModule: string;
  sourceId: string;
  vector: number[];
}

export class EmbeddingsStore {
  private records: EmbeddingRecord[] = [];

  save(record: EmbeddingRecord): void {
    this.records.push(record);
  }

  listByModule(sourceModule: string): EmbeddingRecord[] {
    return this.records.filter((item) => item.sourceModule === sourceModule);
  }
}
