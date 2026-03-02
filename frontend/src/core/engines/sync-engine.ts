export interface SyncStatus {
  state: "idle" | "syncing";
  lastSyncedAt?: string;
}

export class SyncEngine {
  private status: SyncStatus = { state: "idle" };

  markSyncing(): void {
    this.status = { ...this.status, state: "syncing" };
  }

  markComplete(): void {
    this.status = { state: "idle", lastSyncedAt: new Date().toISOString() };
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }
}

