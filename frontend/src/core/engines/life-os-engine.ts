import type {
  JournalEntry,
  LifeGraphEdge,
  LifeGraphNode,
  NoteItem,
  TaskItem,
  TaskPriority,
  TaskStatus,
  TimelineEvent,
  Workbook,
} from "../types";
import { createId, nowIso } from "../utils";
import { type SyncOperation, SyncQueue } from "../../lib/db/sync-queue";
import { CoachEngine } from "./coach-engine";
import { SyncEngine } from "./sync-engine";

export interface LifeOsSnapshot {
  journalEntries: JournalEntry[];
  notes: NoteItem[];
  tasks: TaskItem[];
  workbooks: Workbook[];
  timeline: TimelineEvent[];
  graphNodes: LifeGraphNode[];
  graphEdges: LifeGraphEdge[];
  insights: ReturnType<CoachEngine["listInsights"]>;
  syncStatus: ReturnType<SyncEngine["getStatus"]>;
  syncQueue: SyncOperation[];
}

export interface PersistedLifeOsState {
  journalEntries: JournalEntry[];
  notes: NoteItem[];
  tasks: TaskItem[];
  workbooks: Workbook[];
  timeline: TimelineEvent[];
  graphNodes: LifeGraphNode[];
  graphEdges: LifeGraphEdge[];
  insights: ReturnType<CoachEngine["listInsights"]>;
  lastSyncedAt?: string;
  syncQueue?: SyncOperation[];
}

export class LifeOsEngine {
  private readonly coach = new CoachEngine();
  private readonly sync = new SyncEngine();
  private journalEntries: JournalEntry[] = [];
  private notes: NoteItem[] = [];
  private tasks: TaskItem[] = [];
  private workbooks: Workbook[] = [];
  private timeline: TimelineEvent[] = [];
  private graphNodes: LifeGraphNode[] = [];
  private graphEdges: LifeGraphEdge[] = [];
  private readonly syncQueue = new SyncQueue();

  hydrateFromPersistedState(state: PersistedLifeOsState): void {
    this.journalEntries = [...state.journalEntries];
    this.notes = [...state.notes];
    this.tasks = [...state.tasks];
    this.workbooks = [...state.workbooks];
    this.timeline = [...state.timeline];
    this.graphNodes = [...state.graphNodes];
    this.graphEdges = [...state.graphEdges];
    this.coach.hydrateInsights(state.insights);
    this.sync.hydrate(state.lastSyncedAt);
    this.syncQueue.hydrate(state.syncQueue ?? []);
  }

  createJournalEntry(input: { title: string; contentMarkdown: string }): void {
    const entry: JournalEntry = {
      id: createId("journal"),
      title: input.title,
      contentMarkdown: input.contentMarkdown,
      moodTags: [],
      sentimentScore: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.journalEntries.unshift(entry);
    this.timeline.unshift({
      id: createId("event"),
      module: "journal",
      referenceId: entry.id,
      title: `Journal: ${entry.title}`,
      eventType: "created",
      timestamp: nowIso(),
    });
    this.graphNodes.unshift({ id: entry.id, type: "entry", label: entry.title });
    this.coach.createJournalInsight(entry.id, {
      date: entry.createdAt,
      title: entry.title,
      content: entry.contentMarkdown,
    });
    this.enqueueSyncOperation("journal", entry.id, "create", entry);
  }

  createNote(input: { title: string; contentMarkdown: string }): void {
    const note: NoteItem = {
      id: createId("note"),
      title: input.title,
      contentMarkdown: input.contentMarkdown,
      tags: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.notes.unshift(note);
    this.timeline.unshift({
      id: createId("event"),
      module: "notes",
      referenceId: note.id,
      title: `Note: ${note.title}`,
      eventType: "created",
      timestamp: nowIso(),
    });
    this.graphNodes.unshift({ id: note.id, type: "note", label: note.title });
    this.coach.createNoteInsight(note.id, {
      title: note.title,
      content: note.contentMarkdown,
    });
    this.enqueueSyncOperation("notes", note.id, "create", note);
  }

  createTask(input: {
    title: string;
    description: string;
    priority: TaskPriority;
    status?: TaskStatus;
    dueDate?: string;
  }): void {
    const task: TaskItem = {
      id: createId("task"),
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: input.status ?? "todo",
      dueDate: input.dueDate,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.tasks.unshift(task);
    this.timeline.unshift({
      id: createId("event"),
      module: "tasks",
      referenceId: task.id,
      title: `Task: ${task.title}`,
      eventType: "created",
      timestamp: nowIso(),
    });
    this.graphNodes.unshift({ id: task.id, type: "task", label: task.title });
    this.coach.createTaskInsight(task.id, {
      title: task.title,
      description: task.description,
      status: task.status,
    });
    this.enqueueSyncOperation("tasks", task.id, "create", task);
  }

  completeTask(taskId: string): void {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) return;
    task.status = "done";
    task.updatedAt = nowIso();
    this.timeline.unshift({
      id: createId("event"),
      module: "tasks",
      referenceId: task.id,
      title: `Completed: ${task.title}`,
      eventType: "completed",
      timestamp: nowIso(),
    });
    this.coach.createTaskInsight(task.id, {
      title: task.title,
      description: task.description,
      status: task.status,
    });
    this.enqueueSyncOperation("tasks", task.id, "update", task);
  }

  createWorkbook(input: { name: string; metricLabel: string; metricValue: number }): void {
    const workbook: Workbook = {
      id: createId("workbook"),
      name: input.name,
      metrics: [{ id: createId("metric"), label: input.metricLabel, value: input.metricValue }],
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    this.workbooks.unshift(workbook);
    this.timeline.unshift({
      id: createId("event"),
      module: "storage",
      referenceId: workbook.id,
      title: `Workbook: ${workbook.name}`,
      eventType: "created",
      timestamp: nowIso(),
    });
    const metric = workbook.metrics[0];
    this.graphNodes.unshift({ id: metric.id, type: "metric", label: `${metric.label}: ${metric.value}` });
    this.graphEdges.unshift({
      id: createId("edge"),
      source: workbook.id,
      target: metric.id,
      relationship: "derived_from",
    });
    this.coach.createStorageInsight(workbook.id, {
      name: workbook.name,
      metricLabel: metric.label,
      metricValue: metric.value,
    });
    this.enqueueSyncOperation("storage", workbook.id, "create", workbook);
  }

  syncNow(): void {
    this.sync.markSyncing();
    this.syncQueue.clear();
    this.sync.markComplete();
  }

  getSnapshot(): LifeOsSnapshot {
    return {
      journalEntries: [...this.journalEntries],
      notes: [...this.notes],
      tasks: [...this.tasks],
      workbooks: [...this.workbooks],
      timeline: [...this.timeline],
      graphNodes: [...this.graphNodes],
      graphEdges: [...this.graphEdges],
      insights: this.coach.listInsights(),
      syncStatus: this.sync.getStatus(),
      syncQueue: this.syncQueue.list(),
    };
  }

  getPersistedState(): PersistedLifeOsState {
    return {
      journalEntries: [...this.journalEntries],
      notes: [...this.notes],
      tasks: [...this.tasks],
      workbooks: [...this.workbooks],
      timeline: [...this.timeline],
      graphNodes: [...this.graphNodes],
      graphEdges: [...this.graphEdges],
      insights: this.coach.listInsights(),
      lastSyncedAt: this.sync.getStatus().lastSyncedAt,
      syncQueue: this.syncQueue.list(),
    };
  }

  private enqueueSyncOperation(
    module: SyncOperation["module"],
    entityId: string,
    operation: SyncOperation["operation"],
    payload: unknown,
  ): void {
    this.syncQueue.enqueue({
      id: createId("sync"),
      module,
      entityId,
      operation,
      payload,
      createdAt: nowIso(),
    });
  }
}

