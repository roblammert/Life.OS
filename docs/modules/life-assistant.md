# life-assistant.md  
**Module Specification — Life.Assistant (Tasks & Productivity Engine)**  
*Part of the Life.OS Documentation Suite*

Life.Assistant is the task and productivity module of Life.OS. It provides a structured yet flexible system for capturing tasks, organizing work, managing priorities, and receiving intelligent suggestions powered by Life.Coach. It integrates deeply with Journal, Notes, Storage, and the Life Graph to create a unified productivity ecosystem.

This document defines the purpose, data model, UI, workflows, backend endpoints, and intelligence integrations for Life.Assistant.

---

## 1. Purpose and Responsibilities

Life.Assistant is designed to be the user’s **execution system** — the place where ideas become actions and goals become plans.

### Core Responsibilities
- Provide a fast, intuitive task management interface.
- Support priorities, due dates, statuses, tags, and projects.
- Store tasks locally in IndexedDB for offline access.
- Sync tasks to the backend when online.
- Integrate with Life.Coach for:
  - Task suggestions
  - Task breakdown
  - Energy‑based recommendations
  - Procrastination detection
  - Goal alignment analysis
- Link tasks to journal entries, notes, and workbook data.
- Contribute to Life Timeline and Life Graph.

### Role in the System
Life.Assistant is the **action layer** of Life.OS.  
It connects:
- Journal → actionable tasks  
- Notes → project planning  
- Storage → data‑driven tasks  
- Life.Coach → productivity intelligence  

---

## 2. Data Model (Conceptual)

Tasks are stored locally in IndexedDB and synced to the backend.  
Each task includes metadata, relationships, and intelligence‑derived fields.

### 2.1 Task

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `user_id` | string | Owner |
| `title` | string | Short description |
| `description` | string | Optional long description |
| `status` | string | todo, in_progress, done, blocked |
| `priority` | string | low, medium, high |
| `due_date` | ISO date | Optional |
| `tags` | string[] | Manual + smart tags |
| `project_id` | string | Optional project grouping |
| `energy_level_required` | string | low, medium, high |
| `estimated_effort` | number | Minutes or points |
| `related_journal_entries` | string[] | Suggested links |
| `related_notes` | string[] | Suggested links |
| `subtask_ids` | string[] | Generated or manual |
| `coach_insight_ids` | string[] | Insights from Life.Coach |
| `created_at` | timestamp | Local creation time |
| `updated_at` | timestamp | Last modification |

### 2.2 Subtask

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `task_id` | string | Parent task |
| `text` | string | Subtask text |
| `completed` | boolean | Completion state |

### 2.3 Project

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `name` | string | Project name |
| `description` | string | Optional |
| `task_ids` | string[] | Tasks in project |
| `created_at` | timestamp | Creation time |

---

## 3. Frontend Architecture

Life.Assistant provides a clean, responsive interface for managing tasks.

### 3.1 UI Components

- **TaskList**  
  Displays tasks with filters, sorting, and grouping.

- **TaskEditor**  
  For creating and editing tasks:
  - Title  
  - Description  
  - Priority  
  - Due date  
  - Tags  
  - Subtasks  

- **ProjectSidebar**  
  Lists projects and allows switching between them.

- **TaskInsightsPanel**  
  Powered by Life.Coach:
  - Suggested subtasks  
  - Effort estimation  
  - Energy‑based recommendations  
  - Goal alignment  
  - Related notes/journal entries  

- **KanbanBoard**  
  Optional board view with columns:
  - Todo  
  - In Progress  
  - Blocked  
  - Done  

- **TimelineIntegration**  
  Tasks appear on the Life Timeline when created or completed.

- **GraphIntegration**  
  Tasks become nodes in the Life Graph.

### 3.2 Layout Behavior

#### Phone
- Single‑column list  
- Editor in full screen  
- Insights in slide‑up drawer  

#### Tablet
- Two‑pane layout  
- List + editor or editor + insights  

#### Desktop
- Three‑pane layout  
- Projects → Tasks → Insights  

---

## 4. Workflows

### 4.1 Creating a Task
1. User opens TaskEditor.  
2. Enters title and optional details.  
3. Autosave writes to IndexedDB.  
4. Life.Coach analyzes task content.  
5. Suggestions appear in TaskInsightsPanel.  
6. Task added to Life Timeline and Life Graph.  
7. Sync queued if online.

### 4.2 Editing a Task
- Updates `updated_at`  
- Re‑analysis triggered  
- Insights updated  

### 4.3 Completing a Task
- Marked as `done`  
- Completion timestamp added to timeline  
- Life.Coach updates productivity metrics  

### 4.4 Project Management
- Tasks grouped into projects  
- Projects detected automatically by Life.Coach  
- Project insights generated (progress, blockers, themes)  

### 4.5 Linking to Other Modules
Life.Coach suggests:
- Journal entries related to task themes  
- Notes that should be linked  
- Workbook data relevant to task  

### 4.6 Task Breakdown
Life.Coach can generate:
- Subtasks  
- Step‑by‑step plans  
- Required resources  
- Estimated effort  

---

## 5. Backend Endpoints

### Task CRUD
- `GET /tasks` — list tasks  
- `GET /tasks/:id` — get task  
- `POST /tasks` — create task  
- `PUT /tasks/:id` — update task  
- `DELETE /tasks/:id` — delete task  

### Subtasks
- `POST /tasks/:id/subtasks`  
- `PUT /subtasks/:id`  
- `DELETE /subtasks/:id`  

### Projects
- `GET /projects`  
- `POST /projects`  
- `PUT /projects/:id`  
- `DELETE /projects/:id`  

### Sync
- `POST /sync/push`  
- `POST /sync/pull`  

---

## 6. Integration with Life.Coach

Life.Assistant is one of the most intelligence‑driven modules.

### 6.1 Analysis Performed
- Task difficulty estimation  
- Energy requirement prediction  
- Procrastination detection  
- Project detection  
- Goal alignment analysis  
- Suggested subtasks  
- Suggested related content  
- Productivity trend analysis  

### 6.2 Insights Generated
- Suggested tasks  
- Suggested subtasks  
- Suggested journal prompts  
- Suggested notes  
- Productivity patterns  
- Energy cycle predictions  

### 6.3 Contribution to Intelligence Systems
- Unified Life Graph — tasks, projects, relationships  
- Productivity Intelligence — core data source  
- Emotional Insight Engine — mood ↔ productivity correlations  
- Habit Intelligence — repeated task patterns  
- Magic Features — Life Moments, memory consolidation  

---

## 7. IndexedDB Schema (Local)

Tables:
- `tasks`  
- `subtasks`  
- `projects`  
- `sync_queue`  
- `embeddings`  
- `coach_insights`  
- `life_graph_nodes`  
- `life_graph_edges`  

Indexes:
- `status`  
- `priority`  
- `due_date`  
- `updated_at`  

---

## 8. Error Handling

### Offline Mode
- All actions allowed  
- Sync queued  

### Sync Conflicts
- Last‑write‑wins  
- Future: merge UI  

### LLM Errors
- Fallback: basic task creation only  
- Insights marked as “pending”  

---

## 9. Future Enhancements

- Time blocking  
- Calendar integration  
- Pomodoro mode  
- AI‑generated project plans  
- Recurring tasks  
- Task templates  
- Multi‑device sync conflict UI  

---

## 10. Summary

Life.Assistant is the execution engine of Life.OS. It transforms ideas into actions and provides the structure needed to stay organized, productive, and aligned with personal goals. Through deep integration with Life.Coach, it becomes a powerful, adaptive productivity system that learns from the user’s behavior and supports them intelligently.
