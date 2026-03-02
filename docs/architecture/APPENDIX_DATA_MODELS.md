# APPENDIX_DATA_MODELS.md  
**Data Models Appendix — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix consolidates all major data models used across Life.OS. While each module defines its own schema, this document provides a unified reference for developers, ensuring consistency, clarity, and interoperability across modules, engines, and intelligence pipelines.

---

# 1. Overview

Life.OS uses **IndexedDB** as its primary storage engine. Each module owns its own tables, and intelligence engines write to shared tables such as `coach_insights`, `life_graph_nodes`, and `life_graph_edges`.

This appendix documents:

- Core module schemas  
- Intelligence engine schemas  
- Graph and timeline schemas  
- Settings and sync schemas  
- Shared metadata structures  

---

# 2. Journal Data Model

### Table: `entries`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| text | string | Markdown content |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |
| sentiment | number | -1 to 1 |
| mood | string | Mood label |
| emotional_intensity | number | 0–1 |
| emotional_granularity | number | 0–1 |
| topics | string[] | Extracted topics |
| cognitive_patterns | string[] | Detected patterns |
| related_ids | object | Linked tasks/notes |
| word_count | number | Computed |
| reading_time | number | Estimated minutes |

---

# 3. Notes Data Model

### Table: `notes`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| text | string | Markdown content |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |
| concepts | string[] | Extracted concepts |
| topics | string[] | Topic clusters |
| checklist | object[] | Checklist items |
| related_ids | object | Linked entries/tasks |
| word_count | number | Computed |

---

# 4. Tasks Data Model

### Table: `tasks`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| title | string | Task title |
| description | string | Markdown |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |
| due_date | number | Timestamp or null |
| status | string | todo, doing, done |
| priority | string | low, medium, high |
| project_id | string | Optional |
| subtasks | object[] | Subtask list |
| effort | number | Estimated effort |
| energy | number | Energy requirement |
| procrastination_index | number | Computed |
| related_ids | object | Linked entries/notes |

---

# 5. Storage (Spreadsheets) Data Model

### Table: `workbooks`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| name | string | Workbook name |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |

### Table: `sheets`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| workbook_id | string | Parent workbook |
| name | string | Sheet name |
| order | number | Display order |

### Table: `cells`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| sheet_id | string | Parent sheet |
| row | number | Row index |
| col | number | Column index |
| value | string | Raw value |
| formula | string | Optional formula |
| computed | number | Computed numeric value |

---

# 6. Life Timeline Data Model

### Table: `timeline_events`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| type | string | event type |
| timestamp | number | Timestamp |
| source_module | string | journal, notes, tasks, etc. |
| source_id | string | Entity ID |
| metadata | object | Additional data |

### Event Types
- entry_created  
- entry_updated  
- note_created  
- task_completed  
- project_milestone  
- insight_generated  
- life_moment_detected  
- review_generated  

---

# 7. Life Graph Data Model

### Table: `life_graph_nodes`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| type | string | node type |
| embedding | number[] | Vector |
| metadata | object | Node metadata |
| created_at | number | Timestamp |

### Table: `life_graph_edges`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| source | string | Node ID |
| target | string | Node ID |
| type | string | Edge type |
| weight | number | Similarity or strength |
| created_at | number | Timestamp |

### Node Types
- entry  
- note  
- task  
- concept  
- topic  
- habit  
- insight  
- life_moment  

### Edge Types
- mentions  
- related_to  
- derived_from  
- influences  
- similar_to  

---

# 8. Intelligence Engine Data Models

### Table: `coach_insights`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| source_module | string | journal, notes, tasks |
| source_id | string | Entity ID |
| insight_type | string | emotional, cognitive, productivity, etc. |
| content | string | Insight text |
| metadata | object | Scores, tags, examples |
| created_at | number | Timestamp |

### Table: `embeddings`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| source_module | string | journal, notes, tasks |
| source_id | string | Entity ID |
| vector | number[] | Embedding |
| created_at | number | Timestamp |

---

# 9. Settings & Privacy Data Model

### Table: `settings`
| Field | Type | Description |
|-------|------|-------------|
| id | string | Always "global" |
| theme | string | light, dark, system |
| quiet_hours | object | start/end |
| notifications_enabled | boolean | Global toggle |
| module_notifications | object | Per‑module toggles |
| sync_enabled | boolean | Sync on/off |
| sync_interval | number | ms |
| llm_model | string | Selected model |
| llm_auto_unload | boolean | Unload when idle |
| intelligence_features | object | Feature toggles |
| privacy_mode | string | normal, strict |
| data_retention | object | Retention rules |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |

---

# 10. Sync Engine Data Model (Optional)

### Table: `sync_queue`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| operation | string | create, update, delete |
| table | string | Target table |
| payload | object | Data |
| timestamp | number | Timestamp |
| retry_count | number | Retries |

---

# 11. Shared Metadata Structures

### Related IDs
```
{ entries: string[], notes: string[], tasks: string[] }
```

### Insight Metadata
```
{ scores: object, tags: string[], examples: string[], related_ids: object }
```

### Graph Metadata
```
{ importance: number, cluster: string, neighbors: string[] }
```

---

# 12. Summary

This appendix consolidates all major data models across Life.OS, providing a unified reference for developers. By standardizing schemas, metadata structures, and relationships, Life.OS maintains consistency, modularity, and intelligence‑readiness across all modules and engines.
