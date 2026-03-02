# PRODUCTIVITY_ENGINE.md  
**Productivity Intelligence Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Productivity Engine analyzes tasks, projects, routines, and behavioral patterns to understand how the user works, what influences their productivity, and how their energy, habits, and emotional state interact with their ability to execute. It powers task suggestions, project insights, procrastination detection, and productivity‑related Life Moments.

This document defines the productivity analysis model, detection rules, scoring algorithms, insight types, data sources, and integration with Life.Coach, the Life Graph, and the Habit Engine.

---

# 1. Purpose and Responsibilities

The Productivity Engine helps users understand **how they get things done**, what blocks them, and how to work more effectively.

### Core Responsibilities
- Analyze tasks, projects, and completion patterns.
- Detect productivity cycles and energy rhythms.
- Identify procrastination patterns and blockers.
- Estimate task difficulty and required energy.
- Suggest tasks based on context, energy, and goals.
- Generate productivity insights for reviews.
- Detect productivity‑related Life Moments.
- Integrate with habits, emotions, and cognitive patterns.

### Why Productivity Intelligence?
Understanding productivity patterns helps users:
- Work with their natural energy cycles  
- Reduce procrastination  
- Improve task planning  
- Build sustainable routines  
- Align work with goals and values  

---

# 2. Productivity Data Model

Productivity insights are stored in IndexedDB as part of the `coach_insights` table.

### `coach_insights` (productivity subset)
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| source_module | string | tasks, notes, journal |
| source_id | string | Entity ID |
| insight_type | string | productivity_pattern, suggestion, blocker |
| content | string | Insight text |
| metadata | object | Scores, tags, examples |
| created_at | number | Timestamp |

---

# 3. Productivity Categories

The Productivity Engine detects several categories of productivity signals.

## 3.1 Task‑Level Signals
- Difficulty estimation  
- Energy requirement  
- Estimated effort  
- Task clarity  
- Task fragmentation (too big vs. too small)  

## 3.2 Behavioral Signals
- Procrastination  
- Task switching  
- Deep work sessions  
- Avoidance patterns  
- Completion bursts  

## 3.3 Project‑Level Signals
- Project momentum  
- Project stagnation  
- Milestone detection  
- Project clustering  

## 3.4 Energy Patterns
- Morning vs. evening productivity  
- Day‑of‑week cycles  
- Emotional–productivity correlations  
- Habit–productivity correlations  

---

# 4. Productivity Detection Pipeline

The Productivity Engine uses a multi‑stage pipeline.

## Stage 1 — Data Extraction
Sources:
- Tasks  
- Subtasks  
- Projects  
- Journal entries  
- Notes  
- Habit events  
- Workbook metrics (e.g., sleep, steps)  

## Stage 2 — Preprocessing
- Normalize task text  
- Extract verbs and action types  
- Identify task categories  
- Aggregate completion timestamps  

## Stage 3 — Pattern Detection
Life.Coach identifies:
- Procrastination patterns  
- Energy cycles  
- Task difficulty mismatches  
- Project bottlenecks  
- Task clusters  
- Avoidance triggers  

## Stage 4 — Scoring
Each task receives:
- Difficulty score  
- Energy requirement score  
- Effort estimate  
- Clarity score  
- Priority score (future)  

Each user receives:
- Productivity consistency score  
- Energy cycle profile  
- Procrastination index  

## Stage 5 — Insight Generation
Life.Coach generates:
- Suggested tasks  
- Suggested subtasks  
- Suggested project steps  
- Productivity summaries  
- Blocker identification  
- Energy‑based recommendations  

---

# 5. Productivity Scoring

Productivity is scored on multiple dimensions.

### 5.1 Difficulty Score
Based on:
- Task complexity  
- Required steps  
- Required knowledge  
- Past similar tasks  

### 5.2 Energy Requirement
Based on:
- Cognitive load  
- Emotional load  
- Physical load  

### 5.3 Effort Estimate
Based on:
- Task length  
- Subtask count  
- Historical completion times  

### 5.4 Procrastination Index
Based on:
- Delay between creation and completion  
- Repeated rescheduling  
- Avoidance patterns  

### 5.5 Productivity Consistency
Based on:
- Daily completion patterns  
- Weekly cycles  
- Variance in output  

---

# 6. Productivity Life Moments

Life.Coach detects productivity breakthroughs.

### Examples
- A major project milestone  
- A sudden productivity surge  
- A resolved blocker  
- A new productive routine  
- A shift in energy cycle  

These appear in:
- Life Timeline  
- Life Graph  
- Weekly/monthly reviews  

---

# 7. Integration with Life Timeline

Productivity events appear as:
- task_created  
- task_completed  
- project_milestone  
- productivity_pattern_detected  
- productivity_breakthrough  

Users can:
- View productivity arcs  
- Explore blockers  
- Jump to related tasks  

---

# 8. Integration with Life Graph

Productivity patterns become nodes in the Life Graph.

### Node Types
- **productivity_pattern**  
- **blocker**  
- **energy_cycle**  

### Edges
- pattern → task (derived_from)  
- pattern → habit (related_to)  
- pattern → emotion (influences)  
- pattern → cognitive_pattern (related_to)  

### Graph Insights
- Productivity clusters  
- Blocker relationships  
- Energy–emotion–productivity loops  

---

# 9. Integration with Habit Engine

Habits influence productivity.

### Examples
- Morning journaling → improved planning  
- Exercise → higher energy  
- Poor sleep → lower productivity  

The Habit Engine uses productivity insights to:
- Explain habit impacts  
- Suggest habit adjustments  
- Detect habit–productivity loops  

---

# 10. Integration with Emotional & Cognitive Engines

Productivity is influenced by:
- Emotional states  
- Cognitive distortions  
- Thinking patterns  

Examples:
- Anxiety → avoidance  
- Catastrophizing → procrastination  
- Confidence → deep work  

These relationships appear in:
- Reviews  
- Life Graph  
- Suggested tasks  

---

# 11. Integration with Life.Coach

The Productivity Engine powers:
- Suggested tasks  
- Suggested subtasks  
- Project insights  
- Daily productivity summaries  
- Weekly productivity patterns  
- Monthly productivity arcs  

---

# 12. IndexedDB Schema

Tables:
- `coach_insights` (productivity subset)  

Indexes:
- `insight_type`  
- `source_module`  
- `created_at`  

---

# 13. Future Enhancements

- Task difficulty forecasting  
- Personalized productivity models  
- Energy‑aware scheduling  
- Project planning AI  
- Task batching suggestions  
- Productivity heatmaps  

---

# 14. Summary

The Productivity Engine is the execution intelligence layer of Life.OS. It analyzes tasks, projects, energy cycles, and behavioral patterns to help users work more effectively and intentionally. Through deep integration with Life.Coach, the Life Graph, and the Habit Engine, it provides powerful insights that support sustainable productivity and long‑term growth.
