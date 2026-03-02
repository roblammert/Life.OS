import type {
  JournalEntry,
  LifeGraphEdge,
  LifeGraphNode,
  LifeMoment,
  NoteItem,
  NotificationItem,
  ReviewSummary,
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
      sentimentScore: this.estimateSentimentScore(input.contentMarkdown),
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

  createNote(input: { title: string; contentMarkdown: string; tags?: string[] }): void {
    const note: NoteItem = {
      id: createId("note"),
      title: input.title,
      contentMarkdown: input.contentMarkdown,
      tags: input.tags ?? [],
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
    this.updateTaskStatus(taskId, "done");
  }

  updateTaskStatus(taskId: string, status: TaskStatus): void {
    const task = this.tasks.find((item) => item.id === taskId);
    if (!task) return;
    task.status = status;
    task.updatedAt = nowIso();
    this.timeline.unshift({
      id: createId("event"),
      module: "tasks",
      referenceId: task.id,
      title: status === "done" ? `Completed: ${task.title}` : `Updated: ${task.title} (${status})`,
      eventType: status === "done" ? "completed" : "updated",
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

  addWorkbookMetric(workbookId: string, metricLabel: string, metricValue: number): void {
    const workbook = this.workbooks.find((item) => item.id === workbookId);
    if (!workbook) return;
    const metric = { id: createId("metric"), label: metricLabel, value: metricValue };
    workbook.metrics.unshift(metric);
    workbook.updatedAt = nowIso();
    this.graphNodes.unshift({ id: metric.id, type: "metric", label: `${metric.label}: ${metric.value}` });
    this.graphEdges.unshift({
      id: createId("edge"),
      source: workbook.id,
      target: metric.id,
      relationship: "derived_from",
    });
    this.timeline.unshift({
      id: createId("event"),
      module: "storage",
      referenceId: workbook.id,
      title: `Workbook metric added: ${workbook.name} (${metric.label})`,
      eventType: "updated",
      timestamp: nowIso(),
    });
    this.coach.createStorageInsight(workbook.id, {
      name: workbook.name,
      metricLabel: metric.label,
      metricValue: metric.value,
    });
    this.enqueueSyncOperation("storage", workbook.id, "update", workbook);
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

  generateNotifications(): NotificationItem[] {
    return this.coach.generateNotifications();
  }

  generateReview(period: "daily" | "weekly"): ReviewSummary {
    return this.coach.generateReview(period);
  }

  generateLifeMoments(): LifeMoment[] {
    return this.coach.generateLifeMoments();
  }

  exportJournalMarkdownBundle(): string {
    return this.journalEntries
      .map(
        (entry) =>
          `# ${entry.title}\n\nDate: ${entry.createdAt}\n\n${entry.contentMarkdown}\n`,
      )
      .join("\n---\n\n");
  }

  exportNotesMarkdownBundle(): string {
    return this.notes
      .map(
        (note) =>
          `# ${note.title}\n\nDate: ${note.createdAt}\n\n${note.contentMarkdown}\n`,
      )
      .join("\n---\n\n");
  }

  exportTasksCsv(): string {
    const header = "id,title,description,status,priority,dueDate,createdAt,updatedAt";
    const rows = this.tasks.map((task) =>
      [
        task.id,
        this.escapeCsv(task.title),
        this.escapeCsv(task.description),
        task.status,
        task.priority,
        task.dueDate ?? "",
        task.createdAt,
        task.updatedAt,
      ].join(","),
    );
    return [header, ...rows].join("\n");
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

  private escapeCsv(value: string): string {
    const escaped = value.replaceAll('"', '""');
    return `"${escaped}"`;
  }

  private estimateSentimentScore(content: string): number {
    const positiveWords = ["good", "great", "calm", "happy", "progress", "win", "grateful", "better"];
    const negativeWords = ["bad", "sad", "angry", "stress", "anxious", "tired", "stuck", "overwhelmed"];
    const tokens = content.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    let score = 0;
    for (const token of tokens) {
      if (positiveWords.includes(token)) score += 1;
      if (negativeWords.includes(token)) score -= 1;
    }
    if (tokens.length === 0) return 0;
    const normalized = score / Math.max(1, Math.min(tokens.length, 20));
    return Math.max(-1, Math.min(1, normalized));
  }
}

