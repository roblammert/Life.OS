export type ModuleName = "journal" | "notes" | "tasks" | "storage";

export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface JournalEntry {
  id: string;
  title: string;
  contentMarkdown: string;
  moodTags: string[];
  sentimentScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface NoteItem {
  id: string;
  title: string;
  contentMarkdown: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkbookMetric {
  id: string;
  label: string;
  value: number;
}

export interface Workbook {
  id: string;
  name: string;
  metrics: WorkbookMetric[];
  createdAt: string;
  updatedAt: string;
}

export interface CoachInsight {
  id: string;
  sourceModule: ModuleName;
  sourceId: string;
  insightType: "summary" | "pattern" | "suggestion";
  content: string;
  actions: string[];
  promptUsed?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  module: ModuleName;
  referenceId: string;
  title: string;
  eventType: "created" | "updated" | "completed";
  timestamp: string;
}

export interface LifeGraphNode {
  id: string;
  type: "entry" | "note" | "task" | "metric";
  label: string;
}

export interface LifeGraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: "mentions" | "related_to" | "derived_from";
}

