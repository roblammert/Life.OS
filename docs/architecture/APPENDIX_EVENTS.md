# APPENDIX_EVENTS.md  
**Event Types Appendix — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix catalogs every event type emitted across Life.OS. Events are the backbone of the Life Timeline, Life Graph, Notification Engine, and intelligence pipelines. By standardizing event types and metadata structures, Life.OS ensures consistent cross‑module behavior, predictable intelligence processing, and reliable visualization.

---

# 1. Purpose of the Event System

Events allow Life.OS to:

- Track everything that happens across modules  
- Feed the Timeline with structured, chronological data  
- Update the Life Graph with new nodes and edges  
- Trigger intelligence pipelines (insights, reviews, Life Moments)  
- Power notifications and context‑aware suggestions  
- Enable replay, debugging, and historical analysis  

Every module emits events. Every intelligence engine consumes them.

---

# 2. Event Data Model

### Table: `timeline_events`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| type | string | Event type |
| timestamp | number | Unix timestamp |
| source_module | string | journal, notes, tasks, etc. |
| source_id | string | Entity ID |
| metadata | object | Additional structured data |

### Event Type Categories
- Journal events  
- Notes events  
- Task events  
- Storage events  
- Habit events  
- Insight events  
- Life Moment events  
- Review events  
- Graph events  
- System events  

---

# 3. Journal Events

### entry_created
Triggered when a new journal entry is created.

### entry_updated
Triggered when an entry is edited.

### entry_deleted
Triggered when an entry is removed.

### entry_analyzed
Triggered when emotional/cognitive analysis completes.

### journal_streak_continued
Triggered when the user maintains a journaling streak.

### journal_streak_broken
Triggered when a streak ends.

---

# 4. Notes Events

### note_created
Triggered when a new note is created.

### note_updated
Triggered when a note is edited.

### note_deleted
Triggered when a note is removed.

### note_analyzed
Triggered when concepts/topics are extracted.

### note_cluster_detected
Triggered when a new topic cluster emerges.

---

# 5. Task Events

### task_created
Triggered when a task is created.

### task_updated
Triggered when a task is edited.

### task_completed
Triggered when a task is marked done.

### task_deleted
Triggered when a task is removed.

### task_rescheduled
Triggered when due date changes.

### project_created
Triggered when a project is created.

### project_updated
Triggered when a project is edited.

### project_milestone
Triggered when a major project milestone is reached.

### productivity_pattern_detected
Triggered when a productivity cycle or blocker is identified.

---

# 6. Storage (Spreadsheet) Events

### workbook_created
Triggered when a workbook is created.

### sheet_created
Triggered when a sheet is added.

### cell_updated
Triggered when a cell value or formula changes.

### chart_generated
Triggered when a chart is created or updated.

### metric_trend_detected
Triggered when a trend is identified in numeric data.

### metric_correlation_detected
Triggered when correlations are found between metrics.

---

# 7. Habit Events

### habit_event_logged
Triggered when a habit is performed.

### habit_streak_continued
Triggered when a streak continues.

### habit_streak_broken
Triggered when a streak ends.

### habit_pattern_detected
Triggered when a habit loop or routine is identified.

### habit_correlation_detected
Triggered when habits correlate with mood/productivity.

---

# 8. Insight Events

### insight_generated
Triggered when Life.Coach produces an insight.

### emotional_insight
Triggered when emotional analysis yields a meaningful result.

### cognitive_insight
Triggered when cognitive patterns are detected.

### behavioral_insight
Triggered when behavioral patterns emerge.

### productivity_insight
Triggered when productivity patterns are identified.

### knowledge_insight
Triggered when concepts/topics/clusters are detected.

---

# 9. Life Moment Events

### life_moment_detected
Triggered when a major emotional, cognitive, behavioral, productivity, or knowledge breakthrough occurs.

### emotional_breakthrough
Triggered when a significant emotional shift is detected.

### cognitive_shift
Triggered when a cognitive distortion resolves or identity theme emerges.

### habit_breakthrough
Triggered when a habit becomes consistent or a new routine forms.

### productivity_breakthrough
Triggered when a major productivity milestone occurs.

### knowledge_shift
Triggered when a concept becomes central or a topic evolves.

---

# 10. Review Events

### daily_review_generated
Triggered when a daily summary is created.

### weekly_review_generated
Triggered when a weekly review is created.

### monthly_review_generated
Triggered when a monthly reflection is created.

### yearly_review_generated
Triggered when a yearly retrospective is created.

---

# 11. Graph Events

### graph_node_created
Triggered when a new node is added to the Life Graph.

### graph_node_updated
Triggered when node metadata changes.

### graph_edge_created
Triggered when a new relationship is formed.

### graph_edge_updated
Triggered when edge weight or metadata changes.

### graph_cluster_detected
Triggered when a cluster is identified.

---

# 12. System Events

### app_installed
Triggered when the PWA is installed.

### app_updated
Triggered when a new version is activated.

### llm_model_loaded
Triggered when a model finishes loading.

### llm_model_unloaded
Triggered when a model is unloaded to save memory.

### sync_started
Triggered when sync begins.

### sync_completed
Triggered when sync finishes.

### sync_error
Triggered when sync fails.

---

# 13. Event Metadata Examples

### Journal Entry Example
```
{ mood: "anxious", sentiment: -0.3, word_count: 412 }
```

### Task Completion Example
```
{ project_id: "proj_123", energy: 0.7, procrastination_index: 0.4 }
```

### Life Moment Example
```
{ moment_type: "emotional_breakthrough", intensity: 0.9, related_ids: ["entry_123", "note_456"] }
```

---

# 14. Summary

This appendix defines all event types across Life.OS, ensuring consistent behavior across modules, intelligence engines, the Life Graph, and the Timeline. By standardizing event structures and metadata, Life.OS maintains a coherent, extensible, and intelligence‑ready event ecosystem.
