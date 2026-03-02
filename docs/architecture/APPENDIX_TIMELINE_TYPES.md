# APPENDIX_TIMELINE_TYPES.md  
**Timeline Event Types Appendix — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix catalogs all timeline event types, metadata structures, and rendering rules used in the Life Timeline. The Timeline is the chronological backbone of Life.OS, aggregating events from every module and intelligence engine to create a unified, navigable history of the user’s life.

---

# 1. Purpose of the Timeline

The Life Timeline enables Life.OS to:

- Display a chronological record of all activity  
- Surface Life Moments and breakthroughs  
- Provide context for insights and reviews  
- Support daily/weekly/monthly/yearly navigation  
- Enable pattern detection across time  
- Power visualizations such as arcs, streaks, and clusters  

Every module emits events. The Timeline consumes them and renders them in a unified view.

---

# 2. Timeline Event Data Model

### Table: `timeline_events`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| type | string | Event type |
| timestamp | number | Unix timestamp |
| source_module | string | journal, notes, tasks, etc. |
| source_id | string | Entity ID |
| metadata | object | Additional structured data |

### Metadata Structure
```
{ summary: string, tags: string[], scores: object, related_ids: object }
```

---

# 3. Event Categories

Timeline events fall into these categories:

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

Each category has its own rendering rules and metadata.

---

# 4. Journal Timeline Events

### entry_created
A new journal entry was created.

### entry_updated
An entry was edited.

### entry_deleted
An entry was removed.

### entry_analyzed
Emotional/cognitive analysis completed.

### journal_streak_continued
User maintained a journaling streak.

### journal_streak_broken
A streak ended.

**Rendering:**  
- Entry preview  
- Mood color indicator  
- Emotional intensity arc  

---

# 5. Notes Timeline Events

### note_created
A new note was created.

### note_updated
A note was edited.

### note_deleted
A note was removed.

### note_analyzed
Concepts/topics extracted.

### note_cluster_detected
A new topic cluster emerged.

**Rendering:**  
- Note preview  
- Concept chips  
- Topic cluster badge  

---

# 6. Task Timeline Events

### task_created
A task was created.

### task_updated
A task was edited.

### task_completed
A task was completed.

### task_deleted
A task was removed.

### task_rescheduled
Due date changed.

### project_created
A project was created.

### project_updated
A project was edited.

### project_milestone
A major milestone reached.

### productivity_pattern_detected
A productivity cycle or blocker identified.

**Rendering:**  
- Task title  
- Status icon  
- Productivity arc  

---

# 7. Storage (Spreadsheet) Timeline Events

### workbook_created
A workbook was created.

### sheet_created
A sheet was added.

### cell_updated
A cell value or formula changed.

### chart_generated
A chart was created or updated.

### metric_trend_detected
A trend identified in numeric data.

### metric_correlation_detected
A correlation found between metrics.

**Rendering:**  
- Chart thumbnail  
- Trend/correlation badges  

---

# 8. Habit Timeline Events

### habit_event_logged
A habit was performed.

### habit_streak_continued
A streak continued.

### habit_streak_broken
A streak ended.

### habit_pattern_detected
A habit loop or routine identified.

### habit_correlation_detected
Habit ↔ emotion/productivity correlation.

**Rendering:**  
- Habit icon  
- Streak indicator  
- Correlation badge  

---

# 9. Insight Timeline Events

### insight_generated
A new insight was created.

### emotional_insight
Emotional pattern detected.

### cognitive_insight
Cognitive pattern detected.

### behavioral_insight
Behavioral pattern detected.

### productivity_insight
Productivity pattern detected.

### knowledge_insight
Concept/topic pattern detected.

**Rendering:**  
- Insight card  
- Tags  
- Related entities  

---

# 10. Life Moment Timeline Events

### life_moment_detected
A major breakthrough occurred.

### emotional_breakthrough
Significant emotional shift.

### cognitive_shift
Major cognitive realization.

### habit_breakthrough
Habit became consistent.

### productivity_breakthrough
Productivity milestone.

### knowledge_shift
Concept/topic evolution.

**Rendering:**  
- Large highlight card  
- Moment type icon  
- Evidence preview  
- Graph node link  

---

# 11. Review Timeline Events

### daily_review_generated
Daily summary created.

### weekly_review_generated
Weekly review created.

### monthly_review_generated
Monthly reflection created.

### yearly_review_generated
Yearly retrospective created.

**Rendering:**  
- Review summary  
- Trend arcs  
- Life Moments included  

---

# 12. Graph Timeline Events

### graph_node_created
A new graph node added.

### graph_node_updated
Node metadata updated.

### graph_edge_created
New relationship formed.

### graph_edge_updated
Edge weight updated.

### graph_cluster_detected
Cluster identified.

**Rendering:**  
- Node/edge preview  
- Cluster badge  

---

# 13. System Timeline Events

### app_installed
PWA installed.

### app_updated
New version activated.

### llm_model_loaded
Model loaded.

### llm_model_unloaded
Model unloaded.

### sync_started
Sync began.

### sync_completed
Sync finished.

### sync_error
Sync failed.

**Rendering:**  
- System icon  
- Status indicator  

---

# 14. Timeline Rendering Rules

### Grouping
- Daily groups  
- Weekly clusters  
- Monthly arcs  
- Yearly summaries  

### Ordering
- Strict chronological  
- Secondary sort by event importance  

### Visual Indicators
- Mood colors  
- Habit streak bars  
- Productivity arcs  
- Concept/topic chips  
- Life Moment highlights  

### Virtualization
- Infinite scroll  
- Lazy loading  
- Event clustering  

---

# 15. Summary

This appendix defines all timeline event types, metadata structures, and rendering rules used across Life.OS. By standardizing event semantics, the Timeline becomes a powerful, coherent, and extensible chronological engine that reflects the user’s emotional, cognitive, behavioral, productivity, and knowledge evolution.
