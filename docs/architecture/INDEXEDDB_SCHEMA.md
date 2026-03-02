# INDEXEDDB_SCHEMA.md  
**IndexedDB Schema Specification — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

Life.OS uses IndexedDB as its primary local data store. All modules write to IndexedDB first, ensuring offline‑first behavior. Sync to the backend is optional and asynchronous. This document defines the complete IndexedDB schema, table structures, indexes, and cross‑module relationships.

---

# 1. Overview

IndexedDB is the **source of truth** for all user data.  
The backend is a **sync target**, not a primary database.

### Key Characteristics
- Fully offline‑capable  
- Transactional  
- Versioned schema  
- Dexie.js wrapper  
- Module‑scoped tables  
- Global tables for insights, embeddings, graph, and sync  

---

# 2. Database Structure

The database is named:
'''
life_os_db
'''

Versioning follows semantic versioning aligned with app releases.

---

# 3. Tables by Module

## 3.1 Journal Tables

### `journal_entries`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| date | string | ISO date |
| title | string | Optional |
| content_markdown | string | Entry text |
| word_count | number | Computed |
| sentiment_score | number | -1 to +1 |
| mood_tags | string[] | Extracted |
| topics | string[] | Extracted |
| cognitive_patterns | string[] | Extracted |
| emotional_granularity | number | 0–100 |
| related_people | string[] | Extracted |
| related_tasks | string[] | Suggested |
| related_notes | string[] | Suggested |
| coach_insight_ids | string[] | Insight references |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |

### `journal_import_metadata`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| entry_id | string | Journal entry ID |
| source_filename | string | Original file |
| imported_at | number | Timestamp |
| original_date | string | Parsed date |

---

## 3.2 Notes Tables

### `notes`
| Field | Type |
|-------|------|
| id | string |
| title | string |
| content_markdown | string |
| tags | string[] |
| checklist_items | object[] |
| topics | string[] |
| related_people | string[] |
| related_tasks | string[] |
| related_journal_entries | string[] |
| coach_insight_ids | string[] |
| created_at | number |
| updated_at | number |

### `checklist_items`
| Field | Type |
|-------|------|
| id | string |
| note_id | string |
| text | string |
| completed | boolean |

---

## 3.3 Tasks Tables

### `tasks`
| Field | Type |
|-------|------|
| id | string |
| title | string |
| description | string |
| status | string |
| priority | string |
| due_date | string |
| tags | string[] |
| project_id | string |
| energy_level_required | string |
| estimated_effort | number |
| related_journal_entries | string[] |
| related_notes | string[] |
| subtask_ids | string[] |
| coach_insight_ids | string[] |
| created_at | number |
| updated_at | number |

### `subtasks`
| Field | Type |
|-------|------|
| id | string |
| task_id | string |
| text | string |
| completed | boolean |

### `projects`
| Field | Type |
|-------|------|
| id | string |
| name | string |
| description | string |
| task_ids | string[] |
| created_at | number |

---

## 3.4 Storage (Spreadsheet) Tables

### `workbooks`
| Field | Type |
|-------|------|
| id | string |
| name | string |
| sheet_ids | string[] |
| created_at | number |
| updated_at | number |

### `sheets`
| Field | Type |
|-------|------|
| id | string |
| workbook_id | string |
| name | string |
| cell_ids | string[] |
| created_at | number |

### `cells`
| Field | Type |
|-------|------|
| id | string |
| sheet_id | string |
| row | number |
| column | number |
| raw_value | string |
| computed_value | string |
| formula | string |
| format | object |
| updated_at | number |

### `charts`
| Field | Type |
|-------|------|
| id | string |
| sheet_id | string |
| type | string |
| range | string |
| config | object |

---

# 4. Intelligence Tables

## 4.1 Coach Insights

### `coach_insights`
| Field | Type |
|-------|------|
| id | string |
| source_module | string |
| source_id | string |
| insight_type | string |
| content | string |
| metadata | object |
| created_at | number |

---

## 4.2 Embeddings

### `embeddings`
| Field | Type |
|-------|------|
| id | string |
| source_module | string |
| source_id | string |
| vector | float[] |
| created_at | number |

---

## 4.3 Life Graph

### `life_graph_nodes`
| Field | Type |
|-------|------|
| id | string |
| type | string |
| label | string |
| metadata | object |

### `life_graph_edges`
| Field | Type |
|-------|------|
| id | string |
| source | string |
| target | string |
| relationship | string |
| weight | number |

---

## 4.4 Timeline

### `timeline_events`
| Field | Type |
|-------|------|
| id | string |
| event_type | string |
| source_module | string |
| source_id | string |
| timestamp | number |
| metadata | object |

---

# 5. Sync Tables

### `sync_queue`
| Field | Type |
|-------|------|
| id | string |
| module | string |
| entity_type | string |
| entity_id | string |
| operation_type | string |
| payload | object |
| created_at | number |

---

# 6. Indexes

## 6.1 Journal Indexes
- date  
- sentiment_score  
- topics  
- mood_tags  

## 6.2 Notes Indexes
- tags  
- topics  
- updated_at  

## 6.3 Tasks Indexes
- status  
- priority  
- due_date  
- updated_at  

## 6.4 Storage Indexes
- workbook_id  
- sheet_id  
- updated_at  

## 6.5 Intelligence Indexes
- insight_type  
- source_module  
- created_at  

---

# 7. Versioning Strategy

Each schema change increments the IndexedDB version number.  
Migration steps include:
- Creating new tables  
- Adding indexes  
- Transforming existing data  
- Removing deprecated fields  

---

# 8. Summary

IndexedDB is the backbone of Life.OS’s offline‑first architecture.  
It stores all module data, intelligence artifacts, graph structures, and sync operations.  
This schema ensures consistency, extensibility, and high performance across devices.
