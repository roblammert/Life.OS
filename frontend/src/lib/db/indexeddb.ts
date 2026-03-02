import Dexie, { type Table } from "dexie";
import type { PersistedLifeOsState } from "../../core/engines/life-os-engine";
import type {
  CoachInsight,
  JournalEntry,
  LifeGraphEdge,
  LifeGraphNode,
  ModuleName,
  NoteItem,
  TaskItem,
  TimelineEvent,
  Workbook,
} from "../../core/types";
import type { SyncOperation } from "./sync-queue";

interface MetadataRecord {
  id: "app";
  lastSyncedAt?: string;
  updatedAt: string;
}

export interface GlobalSearchResult {
  id: string;
  module: ModuleName;
  label: string;
  preview: string;
}

export class IndexedDbGateway extends Dexie {
  private journalEntries!: Table<JournalEntry, string>;
  private notes!: Table<NoteItem, string>;
  private tasks!: Table<TaskItem, string>;
  private workbooks!: Table<Workbook, string>;
  private timeline!: Table<TimelineEvent, string>;
  private graphNodes!: Table<LifeGraphNode, string>;
  private graphEdges!: Table<LifeGraphEdge, string>;
  private insights!: Table<CoachInsight, string>;
  private syncQueue!: Table<SyncOperation, string>;
  private metadata!: Table<MetadataRecord, "app">;

  constructor() {
    super("life_os_frontend");
    this.version(2).stores({
      journalEntries: "id, createdAt, updatedAt, title",
      notes: "id, createdAt, updatedAt, title",
      tasks: "id, status, priority, createdAt, updatedAt",
      workbooks: "id, createdAt, updatedAt, name",
      timeline: "id, timestamp, module, referenceId",
      graphNodes: "id, type, label",
      graphEdges: "id, source, target, relationship",
      insights: "id, sourceModule, sourceId, createdAt",
      syncQueue: "id, module, entityId, operation, createdAt",
      metadata: "id, updatedAt",
    });
    this.journalEntries = this.table("journalEntries");
    this.notes = this.table("notes");
    this.tasks = this.table("tasks");
    this.workbooks = this.table("workbooks");
    this.timeline = this.table("timeline");
    this.graphNodes = this.table("graphNodes");
    this.graphEdges = this.table("graphEdges");
    this.insights = this.table("insights");
    this.syncQueue = this.table("syncQueue");
    this.metadata = this.table("metadata");
  }

  async saveNormalizedState(state: PersistedLifeOsState): Promise<void> {
    await this.transaction(
      "rw",
      this.journalEntries,
      this.notes,
      this.tasks,
      this.workbooks,
      this.timeline,
      this.graphNodes,
      this.graphEdges,
      this.insights,
      this.syncQueue,
      this.metadata,
      async () => {
        await Promise.all([
          this.journalEntries.clear(),
          this.notes.clear(),
          this.tasks.clear(),
          this.workbooks.clear(),
          this.timeline.clear(),
          this.graphNodes.clear(),
          this.graphEdges.clear(),
          this.insights.clear(),
          this.syncQueue.clear(),
        ]);

        await Promise.all([
          this.journalEntries.bulkPut(state.journalEntries),
          this.notes.bulkPut(state.notes),
          this.tasks.bulkPut(state.tasks),
          this.workbooks.bulkPut(state.workbooks),
          this.timeline.bulkPut(state.timeline),
          this.graphNodes.bulkPut(state.graphNodes),
          this.graphEdges.bulkPut(state.graphEdges),
          this.insights.bulkPut(state.insights),
          this.syncQueue.bulkPut(state.syncQueue ?? []),
        ]);

        await this.metadata.put({
          id: "app",
          lastSyncedAt: state.lastSyncedAt,
          updatedAt: new Date().toISOString(),
        });
      },
    );
  }

  async loadNormalizedState(): Promise<PersistedLifeOsState | null> {
    const [
      journalEntries,
      notes,
      tasks,
      workbooks,
      timeline,
      graphNodes,
      graphEdges,
      insights,
      syncQueue,
      metadata,
    ] = await Promise.all([
      this.journalEntries.toArray(),
      this.notes.toArray(),
      this.tasks.toArray(),
      this.workbooks.toArray(),
      this.timeline.toArray(),
      this.graphNodes.toArray(),
      this.graphEdges.toArray(),
      this.insights.toArray(),
      this.syncQueue.toArray(),
      this.metadata.get("app"),
    ]);

    const hasData =
      journalEntries.length > 0 ||
      notes.length > 0 ||
      tasks.length > 0 ||
      workbooks.length > 0 ||
      timeline.length > 0 ||
      graphNodes.length > 0 ||
      graphEdges.length > 0 ||
      insights.length > 0 ||
      syncQueue.length > 0 ||
      Boolean(metadata);

    if (!hasData) return null;

    return {
      journalEntries,
      notes,
      tasks,
      workbooks,
      timeline,
      graphNodes,
      graphEdges,
      insights,
      syncQueue,
      lastSyncedAt: metadata?.lastSyncedAt,
    };
  }

  async listTasksByStatus(status: TaskItem["status"]): Promise<TaskItem[]> {
    return this.tasks.where("status").equals(status).toArray();
  }

  async listRecentJournalEntries(limit = 5): Promise<JournalEntry[]> {
    return this.journalEntries.orderBy("updatedAt").reverse().limit(limit).toArray();
  }

  async searchNotes(query: string): Promise<NoteItem[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return this.notes
      .filter(
        (note) =>
          note.title.toLowerCase().includes(normalized) ||
          note.contentMarkdown.toLowerCase().includes(normalized),
      )
      .toArray();
  }

  async searchAllModules(query: string): Promise<GlobalSearchResult[]> {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    const [journal, notes, tasks, workbooks] = await Promise.all([
      this.journalEntries.toArray(),
      this.notes.toArray(),
      this.tasks.toArray(),
      this.workbooks.toArray(),
    ]);

    const results: GlobalSearchResult[] = [];
    for (const item of journal) {
      if (item.title.toLowerCase().includes(normalized) || item.contentMarkdown.toLowerCase().includes(normalized)) {
        results.push({ id: item.id, module: "journal", label: item.title, preview: item.contentMarkdown.slice(0, 120) });
      }
    }
    for (const item of notes) {
      if (item.title.toLowerCase().includes(normalized) || item.contentMarkdown.toLowerCase().includes(normalized)) {
        results.push({ id: item.id, module: "notes", label: item.title, preview: item.contentMarkdown.slice(0, 120) });
      }
    }
    for (const item of tasks) {
      if (item.title.toLowerCase().includes(normalized) || item.description.toLowerCase().includes(normalized)) {
        results.push({ id: item.id, module: "tasks", label: item.title, preview: item.description.slice(0, 120) });
      }
    }
    for (const item of workbooks) {
      if (item.name.toLowerCase().includes(normalized)) {
        results.push({ id: item.id, module: "storage", label: item.name, preview: item.metrics.map((m) => `${m.label}:${m.value}`).join(", ").slice(0, 120) });
      }
    }
    return results.slice(0, 20);
  }
}

