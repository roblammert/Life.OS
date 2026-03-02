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
    this.coach.createInsight("journal", entry.id, `Reflect on "${entry.title}" and capture one next action.`);
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
    this.coach.createInsight("notes", note.id, `Link "${note.title}" to a related task or journal entry.`);
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
    this.coach.createInsight("tasks", task.id, `Break "${task.title}" into two smaller steps to reduce friction.`);
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
    this.coach.createInsight("tasks", task.id, `Great completion momentum on "${task.title}". Keep the streak going.`);
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
    this.coach.createInsight("storage", workbook.id, `Track "${metric.label}" weekly to identify trend changes.`);
  }

  syncNow(): void {
    this.sync.markSyncing();
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
    };
  }
}

