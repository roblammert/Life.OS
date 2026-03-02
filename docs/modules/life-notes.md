# life-notes.md  
**Module Specification — Life.Notes**  
*Part of the Life.OS Documentation Suite*

Life.Notes is the knowledge‑capture and idea‑development module of Life.OS. It provides a flexible, Markdown‑based note‑taking environment with semantic search, concept extraction, clustering, and deep integration with Life.Coach. Notes become part of the user’s personal knowledge graph and fuel cross‑module intelligence.

This document defines the purpose, data model, UI, workflows, backend endpoints, and intelligence integrations for Life.Notes.

---

## 1. Purpose and Responsibilities

Life.Notes is designed to be the user’s **thinking space** — a place to capture ideas, organize information, and build a personal knowledge base.

### Core Responsibilities
- Provide a fast, lightweight Markdown note editor.
- Support tags, checklists, scratch pads, and structured notes.
- Store notes locally in IndexedDB for offline access.
- Sync notes to the backend when online.
- Enable semantic search and concept extraction via Life.Coach.
- Build and maintain the user’s knowledge graph.
- Suggest tasks, journal entries, and related notes.
- Support import/export of notes.

### Role in the System
Life.Notes is the **knowledge backbone** of Life.OS.  
It contributes to:
- Life Graph (concepts, topics, relationships)
- PKM Engine (semantic search, clustering)
- Productivity Intelligence (note‑to‑task suggestions)
- Emotional/Cognitive Insight (notes tied to journal entries)
- Life Timeline (idea evolution over time)

---

## 2. Data Model (Conceptual)

Notes are stored locally in IndexedDB and synced to the backend.  
Each note is a Markdown document with metadata and extracted intelligence.

### 2.1 Note

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `user_id` | string | Owner |
| `title` | string | Optional title |
| `content_markdown` | string | Full note text |
| `tags` | string[] | Manual + smart tags |
| `checklist_items` | object[] | Optional checklist structure |
| `topics` | string[] | Extracted concepts |
| `related_people` | string[] | Extracted from text |
| `related_tasks` | string[] | Suggested tasks |
| `related_journal_entries` | string[] | Suggested links |
| `coach_insight_ids` | string[] | Insights from Life.Coach |
| `created_at` | timestamp | Local creation time |
| `updated_at` | timestamp | Last modification |

### 2.2 ChecklistItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `text` | string | Checklist text |
| `completed` | boolean | Completion state |

### 2.3 Note Relationships (Graph)

Life.Notes contributes nodes and edges to the Life Graph:

Nodes:
- Notes  
- Concepts  
- People  
- Projects  
- Topics  

Edges:
- `references`
- `related_to`
- `derived_from`
- `part_of`
- `mentions`

---

## 3. Frontend Architecture

Life.Notes provides a flexible, fast, and intuitive note‑taking interface.

### 3.1 UI Components

- **NotesList**  
  Displays notes with search, filters, and sorting.

- **NoteEditor**  
  Markdown editor with:
  - Live preview  
  - Tag editor  
  - Checklist support  
  - Autosave  
  - Offline indicator  

- **ConceptPanel**  
  Shows extracted concepts, topics, and relationships.

- **InsightPanel**  
  Powered by Life.Coach:
  - Summary  
  - Key concepts  
  - Suggested tasks  
  - Suggested journal prompts  
  - Related notes  

- **GraphIntegration**  
  Notes appear as nodes in the Life Graph.

### 3.2 Layout Behavior

#### Phone
- Full‑screen editor  
- Panels in slide‑up drawers  

#### Tablet
- Two‑pane layout  
- Editor + insights  

#### Desktop
- Three‑pane layout  
- Notes list, editor, insights  

---

## 4. Workflows

### 4.1 Creating a Note
1. User opens NoteEditor.  
2. Types in Markdown.  
3. Autosave writes to IndexedDB.  
4. Life.Coach analyzes note content.  
5. Concepts and relationships extracted.  
6. Note added to Life Graph.  
7. Sync queued if online.

### 4.2 Editing a Note
- Updates `updated_at`  
- Re‑analysis triggered  
- Insights updated  

### 4.3 Tagging Notes
- Manual tags added by user  
- Smart tags suggested by Life.Coach  

### 4.4 Checklist Notes
- Checklist items stored as structured data  
- Completion state synced  

### 4.5 Linking to Other Modules
Life.Coach suggests:
- Tasks implied by note content  
- Journal entries related to note themes  
- Other notes with semantic similarity  

### 4.6 Importing Notes
Supported formats:
- Markdown  
- Plain text  

### 4.7 Exporting Notes
Supported formats:
- Markdown  
- JSON bundle  

---

## 5. Backend Endpoints

### Notes CRUD
- `GET /notes` — list notes  
- `GET /notes/:id` — get note  
- `POST /notes` — create note  
- `PUT /notes/:id` — update note  
- `DELETE /notes/:id` — delete note  

### Sync
- `POST /sync/push`  
- `POST /sync/pull`  

### Import/Export
- `POST /notes/import`  
- `POST /notes/export`  

---

## 6. Integration with Life.Coach

Life.Notes is deeply integrated with Life.Coach’s PKM and semantic intelligence systems.

### 6.1 Analysis Performed
- Concept extraction  
- Topic clustering  
- Semantic embeddings  
- Relationship detection  
- Suggested tasks  
- Suggested journal prompts  
- Note summarization  

### 6.2 Insights Generated
- Key concepts  
- Related notes  
- Suggested tasks  
- Suggested journal entries  
- Reflection prompts  

### 6.3 Contribution to Intelligence Systems
- Unified Life Graph — concepts, topics, relationships  
- PKM Engine — semantic search, clustering  
- Productivity Intelligence — note‑to‑task suggestions  
- Emotional/Cognitive Insight — notes linked to journal entries  
- Magic Features — Life Moments, memory consolidation  

---

## 7. IndexedDB Schema (Local)

Tables:
- `notes`  
- `checklist_items`  
- `sync_queue`  
- `embeddings`  
- `coach_insights`  
- `life_graph_nodes`  
- `life_graph_edges`  

Indexes:
- `tags`  
- `topics`  
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
- Fallback: basic concept extraction  
- Insights marked as “pending”  

---

## 9. Future Enhancements

- Bidirectional linking (`[[wikilinks]]`)  
- Graph‑first note browsing  
- AI‑generated note summaries  
- Note templates  
- Multi‑note merge tools  
- Notebook collections  

---

## 10. Summary

Life.Notes is the knowledge engine of Life.OS. It transforms raw ideas into structured, searchable, and interconnected knowledge. Through deep integration with Life.Coach, it becomes a powerful PKM system that helps users think better, remember more, and connect ideas across their entire life.
