# APPENDIX_ALL_MODULE_SPECS.md  
**Complete Module Specification Catalog — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix defines every Life.OS module using the standardized module‑spec template. Each module includes data models, events, intelligence hooks, UI structure, retention rules, sync behavior, and testing requirements.

---

# 1. Journal Module

## Purpose
Capture daily writing, emotional expression, reflection, and narrative context.

## Goals
- Provide a flexible writing environment  
- Extract emotional and cognitive insights  
- Feed Life Moments, reviews, and the Life Graph  
- Serve as the primary source of emotional/cognitive data  

## Data Model
```
table: entries
fields:
 id: string 
 text: string 
 created_at: number 
 updated_at: number 
 sentiment: number 
 mood: string 
 intensity: number 
 tags: string[]
```

### Indexes
- created_at  
- tags  

## Events
- entry_created  
- entry_updated  
- entry_deleted  
- entry_analyzed  
- journal_streak_continued  
- journal_streak_broken  

## Intelligence Integration
- Emotional insights  
- Cognitive insights  
- Identity themes  
- Life Moments  
- Embeddings → graph nodes  

## UI
- Entry list  
- Entry editor  
- Mood selector  
- Insight panel  

## Retention
- Optional auto‑delete  
- Strict mode: auto‑delete after 30 days  

## Sync
- Sync text + metadata  
- Do not sync embeddings  

## Testing
- Sentiment extraction  
- Streak logic  
- Insight generation  

---

# 2. Notes Module

## Purpose
Capture ideas, concepts, and knowledge fragments.

## Goals
- Extract concepts and topics  
- Feed the Knowledge Engine  
- Build the semantic graph  

## Data Model
```
table: notes
fields:
 id: string 
 text: string 
 created_at: number 
 updated_at: number 
 concepts: string[] 
 topics: string[]
```

### Indexes
- created_at  
- concepts  

## Events
- note_created  
- note_updated  
- note_deleted  
- note_analyzed  
- note_cluster_detected  

## Intelligence Integration
- Concept detection  
- Topic clustering  
- Knowledge evolution  

## UI
- Note list  
- Note editor  
- Concept chips  

## Retention
- Optional auto‑delete  
- Strict mode: auto‑delete after 30 days  

## Sync
- Sync text  
- Concepts/topics optional  

## Testing
- Concept extraction  
- Topic clustering  

---

# 3. Tasks Module

## Purpose
Track tasks, projects, and productivity patterns.

## Goals
- Support GTD‑style workflows  
- Detect productivity cycles  
- Feed productivity insights  

## Data Model
```
table: tasks
fields:
 id: string 
 title: string 
 description: string 
 status: string 
 priority: number 
 due_date: number | null 
 created_at: number 
 updated_at: number
```

### Indexes
- due_date  
- status  

## Events
- task_created  
- task_updated  
- task_completed  
- task_rescheduled  
- project_milestone  

## Intelligence Integration
- Productivity cycles  
- Procrastination patterns  
- Energy correlations  

## UI
- Task list  
- Task detail  
- Project view  

## Retention
- Auto‑delete completed tasks after X days  

## Sync
- Sync tasks + projects  

## Testing
- Task completion logic  
- Productivity cycle detection  

---

# 4. Habits Module

## Purpose
Track routines and behavioral patterns.

## Goals
- Track habit performance  
- Detect streaks  
- Identify habit loops  
- Correlate habits with emotions and productivity  

## Data Model
```
table: habits
fields:
 id: string 
 name: string 
 icon: string 
 created_at: number 
 updated_at: number 
 streak: number 
 last_performed: number
```

### Indexes
- last_performed  
- name  

## Events
- habit_created  
- habit_updated  
- habit_event_logged  
- habit_streak_continued  
- habit_streak_broken  

## Intelligence Integration
- Habit patterns  
- Habit correlations  
- Habit breakthroughs  

## UI
- Habit list  
- Habit detail  
- Habit log view  

## Retention
- Optional auto‑delete logs  
- Strict mode: logs auto‑delete after 30 days  

## Sync
- Sync habit definitions  
- Habit logs optional  

## Testing
- Streak logic  
- Habit loop detection  
- Habit ↔ emotion correlation  

---

# 5. Storage (Spreadsheet) Module

## Purpose
Provide a lightweight spreadsheet engine for metrics, tracking, and custom data.

## Goals
- Support numeric tracking  
- Enable trend detection  
- Feed correlations into insights  

## Data Model
```
table: workbooks 
fields:
 id: string 
 name: string 
 created_at: number 
 updated_at: number
```
```
table: sheets 
fields:
 id: string 
 workbook_id: string 
 name: string
```
```
table: cells 
fields:
 id: string 
 sheet_id: string 
 row: number 
 col: number 
 value: string | number
```

## Events
- workbook_created  
- sheet_created  
- cell_updated  
- chart_generated  
- metric_trend_detected  
- metric_correlation_detected  

## Intelligence Integration
- Trend detection  
- Correlation detection  
- Numeric insights  

## UI
- Workbook list  
- Sheet grid  
- Chart viewer  

## Retention
- Optional auto‑delete  

## Sync
- Sync workbooks, sheets, and cells  

## Testing
- Trend detection  
- Correlation accuracy  

---

# 6. Insights Module

## Purpose
Store structured insights generated by intelligence engines.

## Goals
- Provide a unified insight store  
- Feed Life Moments, reviews, and notifications  

## Data Model
```
table: coach_insights
fields:
 id: string 
 insight_type: string 
 source_module: string 
 source_id: string 
 content: string 
 metadata: object 
 created_at: number
```

## Events
- insight_generated  

## Intelligence Integration
- All engines write here  
- Life.Coach reads here  

## UI
- Insight feed  
- Insight detail  

## Retention
- Optional auto‑delete  
- Strict mode: auto‑delete after 30 days  

## Sync
- Optional  

## Testing
- Insight structure validation  

---

# 7. Life Moments Module

## Purpose
Capture major emotional, cognitive, behavioral, productivity, and knowledge breakthroughs.

## Goals
- Provide long‑term narrative anchors  
- Feed reviews and Life Story  

## Data Model
```
table: life_moments
fields:
 id: string 
 moment_type: string 
 description: string 
 intensity: number 
 related_ids: string[] 
 created_at: number
```

## Events
- life_moment_detected  

## Intelligence Integration
- Triggered by engines  
- Stored as graph nodes  

## UI
- Life Moment viewer  
- Timeline highlight  

## Retention
- Keep indefinitely (default)  

## Sync
- Optional  

## Testing
- Trigger logic  
- Evidence linking  

---

# 8. Graph Module

## Purpose
Represent the semantic structure of the user’s life.

## Goals
- Enable semantic search  
- Support cross‑module insights  
- Visualize relationships  

## Data Model
```
table: life_graph_nodes 
table: life_graph_edges
```

## Events
- graph_node_created  
- graph_edge_created  
- graph_cluster_detected  

## Intelligence Integration
- Embeddings  
- Clustering  
- Similarity search  

## UI
- Graph viewer  
- Neighborhood explorer  

## Retention
- Auto‑cleanup of stale nodes/edges  

## Sync
- Optional (no embeddings)  

## Testing
- Node/edge correctness  
- Cluster stability  

---

# 9. Timeline Module

## Purpose
Provide a chronological view of all activity.

## Goals
- Show life history  
- Support navigation  
- Surface Life Moments  

## Data Model
```
table: timeline_events
```

## Events
- All module events  
- Insight events  
- Life Moment events  
- Review events  
- Graph events  

## Intelligence Integration
- Timeline arcs  
- Event clustering  

## UI
- Infinite scroll  
- Event cards  
- Life Moment highlights  

## Retention
- Optional auto‑delete  
- Strict mode: 90 days  

## Sync
- Optional  

## Testing
- Ordering  
- Grouping  
- Rendering  

---

# 10. Reviews Module

## Purpose
Generate daily/weekly/monthly/yearly summaries.

## Goals
- Provide narrative reflection  
- Surface long‑term patterns  
- Feed Life Story  

## Data Model
Stored in `coach_insights` as review insights.

## Events
- daily_review_generated  
- weekly_review_generated  
- monthly_review_generated  
- yearly_review_generated  

## Intelligence Integration
- Review model  
- Life.Coach  

## UI
- Review viewer  
- Review timeline  

## Retention
- Optional auto‑delete  

## Sync
- Optional  

## Testing
- Review structure  
- Metadata correctness  

---

# 11. Settings Module

## Purpose
Store user preferences, privacy settings, retention rules, and model settings.

## Data Model
```
table: settings
```

## Events
- settings_updated  

## Intelligence Integration
- Model selection  
- Retention engine  
- Privacy modes  

## UI
- Settings panels  

## Testing
- Migration  
- Defaults  

---

# 12. System Module

## Purpose
Handle updates, service worker, migrations, and system events.

## Data Model
```
table: system_logs
```

## Events
- app_installed  
- app_updated  
- llm_model_loaded  
- sync_started  

## UI
- Update prompt  
- System log viewer  

## Testing
- Update flow  
- Migration safety  

---

# Summary

This appendix provides a complete, standardized specification for every Life.OS module. All modules follow the same architectural pattern, ensuring consistency, maintainability, and seamless integration with the intelligence ecosystem.
