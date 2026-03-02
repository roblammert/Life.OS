export class IndexedDbGateway {
  private readonly stores = new Map<string, Map<string, unknown>>();

  put<T>(storeName: string, id: string, value: T): void {
    const store = this.ensureStore(storeName);
    store.set(id, value);
  }

  list<T>(storeName: string): T[] {
    const store = this.ensureStore(storeName);
    return Array.from(store.values()) as T[];
  }

  delete(storeName: string, id: string): void {
    const store = this.ensureStore(storeName);
    store.delete(id);
  }

  private ensureStore(storeName: string): Map<string, unknown> {
    const existing = this.stores.get(storeName);
    if (existing) return existing;
    const created = new Map<string, unknown>();
    this.stores.set(storeName, created);
    return created;
  }
}
