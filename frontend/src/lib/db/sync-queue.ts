export interface SyncOperation {
  id: string;
  module: string;
  entityId: string;
  operation: "create" | "update" | "delete";
  payload: unknown;
  createdAt: string;
}

export class SyncQueue {
  private queue: SyncOperation[] = [];

  enqueue(operation: SyncOperation): void {
    this.queue.push(operation);
  }

  dequeueBatch(limit = 20): SyncOperation[] {
    return this.queue.splice(0, limit);
  }

  list(): SyncOperation[] {
    return [...this.queue];
  }

  clear(): void {
    this.queue = [];
  }

  hydrate(operations: SyncOperation[]): void {
    this.queue = [...operations];
  }
}
