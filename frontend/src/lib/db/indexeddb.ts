import Dexie, { type Table } from "dexie";

interface AppStateRecord<TState> {
  id: "app";
  state: TState;
  updatedAt: string;
}

export class IndexedDbGateway extends Dexie {
  private appState!: Table<AppStateRecord<unknown>, "app">;

  constructor() {
    super("life_os_frontend");
    this.version(1).stores({
      appState: "id, updatedAt",
    });
    this.appState = this.table("appState");
  }

  async saveAppState<TState>(state: TState): Promise<void> {
    await this.appState.put({
      id: "app",
      state,
      updatedAt: new Date().toISOString(),
    });
  }

  async loadAppState<TState>(): Promise<TState | null> {
    const record = await this.appState.get("app");
    return (record?.state as TState | undefined) ?? null;
  }
}

