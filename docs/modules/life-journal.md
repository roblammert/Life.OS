# life-journal.md  
**Module Specification — Life.Journal**  
*Part of the Life.OS Documentation Suite*

Life.Journal is the journaling module of Life.OS. It provides a powerful, private, offline‑first environment for expressive writing, emotional reflection, and deep personal insight. It integrates tightly with Life.Coach to analyze entries, detect patterns, and surface meaningful insights across time.

This document defines the purpose, data model, UI, workflows, backend endpoints, and intelligence integrations for Life.Journal.

---

## 1. Purpose and Responsibilities

Life.Journal is designed to be a central reflective space within Life.OS. It captures daily experiences, thoughts, emotions, and insights, and transforms them into structured data that powers cross‑module intelligence.

### Core Responsibilities
- Provide a distraction‑free Markdown journaling environment.
- Store entries locally in IndexedDB for offline access.
- Sync entries to the backend when online.
- Perform local analysis (via Life.Coach) on each entry:
  - Sentiment
  - Mood
  - Emotional granularity
  - Cognitive patterns
  - Themes and topics
- Surface insights and correlations across time.
- Support import/export of journal data.
- Integrate with Notes, Tasks, and Storage modules.

### Role in the System
Life.Journal is the primary source of emotional and cognitive data for Life.Coach.  
It also contributes heavily to:
- Life Timeline  
- Life Graph  
- Daily/weekly reviews  
- Habit extraction  
- Goal detection  
- Relationship insights  

---

## 2. Data Model (Conceptual)

Journal entries are stored both locally (IndexedDB) and remotely (MySQL via Prisma).  
The local version is the source of truth; sync is additive.

### 2.1 JournalEntry

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `user_id` | string | Owner |
| `date` | ISO date | Logical grouping (one or many entries per day) |
| `title` | string | Optional title |
| `content_markdown` | string | Full entry text |
| `word_count` | number | Computed locally |
| `sentiment_score` | number | -1 to +1 |
| `mood_tags` | string[] | e.g., “anxious”, “hopeful”, “tired” |
| `topics` | string[] | Extracted themes |
| `cognitive_patterns` | string[] | e.g., “catastrophizing” |
| `emotional_granularity` | number | 0–100 scale |
| `related_people` | string[] | Extracted from text |
| `related_tasks` | string[] | Suggested links |
| `related_notes` | string[] | Suggested links |
| `coach_insight_ids` | string[] | References to Life.Coach insights |
| `created_at` | timestamp | Local creation time |
| `updated_at` | timestamp | Last modification |

### 2.2 Import Metadata

| Field | Type | Description |
|-------|------|-------------|
| `source_filename` | string | Original file |
| `imported_at` | timestamp | When imported |
| `original_date` | ISO date | Parsed from filename or metadata |

---

## 3. Frontend Architecture

Life.Journal provides a rich, responsive journaling experience.

### 3.1 UI Components

- **JournalList**  
  Displays entries grouped by date, with search and filters.

- **JournalEditor**  
  Markdown editor with:
  - Live preview  
  - Word count  
  - Stats drawer  
  - Autosave  
  - Offline indicator  

- **StatsDrawer**  
  Shows:
  - Word count  
  - Reading time  
  - Sentiment score  
  - Mood tags  
  - Emotional granularity  

- **InsightDrawer**  
  Powered by Life.Coach:
  - Summary  
  - Emotions  
  - Cognitive patterns  
  - Strengths  
  - Reflection questions  
  - Suggested tasks  
  - Suggested notes  

- **TimelineIntegration**  
  Journal entries appear on the Life Timeline.

- **GraphIntegration**  
  People, topics, and themes extracted from entries populate the Life Graph.

### 3.2 Layout Behavior

#### Phone (Portrait)
- Editor in full screen  
- Stats and insights in slide‑up drawers  

#### Tablet (Landscape)
- Editor left, insights right  

#### Desktop
- Editor center  
- Stats left  
- Insights right  

---

## 4. Workflows

### 4.1 Creating an Entry
1. User opens JournalEditor.  
2. Types in Markdown.  
3. Autosave writes to IndexedDB.  
4. Life.Coach analyzes entry on save.  
5. Insights appear in InsightDrawer.  
6. Entry added to Life Timeline and Life Graph.  
7. Sync queued if online.

### 4.2 Editing an Entry
- Updates `updated_at`  
- Re‑analysis triggered  
- Insights updated  

### 4.3 Importing Entries
- User selects Markdown files  
- Files parsed into entries  
- Metadata extracted  
- Life.Coach analyzes imported entries  
- Entries added to timeline and graph  

### 4.4 Exporting Entries
Supported formats:
- Markdown  
- Plain text  
- DOCX (Word)  
- JSON bundle  

### 4.5 Linking to Other Modules
Life.Coach suggests:
- Tasks implied by journal content  
- Notes that should be created  
- People/topics to add to Life Graph  

---

## 5. Backend Endpoints

### Journal CRUD
- `GET /journal` — list entries  
- `GET /journal/:id` — get entry  
- `POST /journal` — create entry  
- `PUT /journal/:id` — update entry  
- `DELETE /journal/:id` — delete entry  

### Sync
- `POST /sync/push`  
- `POST /sync/pull`  

### Import/Export
- `POST /journal/import`  
- `POST /journal/export`  

---

## 6. Integration with Life.Coach

Life.Journal is one of the most deeply integrated modules.

### 6.1 Analysis Performed
- Sentiment scoring  
- Mood detection  
- Emotional granularity scoring  
- Topic extraction  
- Cognitive bias detection  
- Relationship/person detection  
- Strengths identification  
- Reflection question generation  

### 6.2 Insights Generated
- Entry summary  
- Emotional profile  
- Cognitive patterns  
- Suggested tasks  
- Suggested notes  
- Suggested journal prompts  
- Life Moments detection  

### 6.3 Contribution to Intelligence Systems
- Unified Life Graph — people, topics, themes  
- Life Timeline — chronological emotional narrative  
- PKM Engine — concepts extracted from entries  
- Productivity Intelligence — mood ↔ task correlations  
- Emotional Insight Engine — emotional weather  
- Cognitive Insight Engine — bias detection  
- Habit Intelligence — repeated behaviors  
- Magic Features — Life Moments, memory consolidation  

---

## 7. IndexedDB Schema (Local)

Tables:
- `journal_entries`  
- `journal_import_metadata`  
- `sync_queue`  
- `embeddings`  
- `coach_insights`  
- `life_graph_nodes`  
- `life_graph_edges`  

Indexes:
- `date`  
- `sentiment_score`  
- `topics`  
- `mood_tags`  

---

## 8. Error Handling

### Offline Mode
- All actions allowed  
- Sync queued  

### Sync Conflicts
- Last‑write‑wins  
- Future: merge UI  

### LLM Errors
- Fallback: basic stats only  
- Insights marked as “pending”  

---

## 9. Future Enhancements

- Voice dictation  
- Rich media attachments  
- Multi‑entry comparison view  
- Guided journaling templates  
- Mood journaling shortcuts  
- AI‑generated entry summaries for timeline  

---

## 10. Summary

Life.Journal is the emotional and reflective core of Life.OS. It captures the user’s inner world and transforms it into structured, analyzable data that powers the entire intelligence layer. Through deep integration with Life.Coach, it becomes not just a journaling tool, but a personal insight engine.