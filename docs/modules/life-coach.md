# life-coach.md  
**Module Specification — Life.Coach (Local LLM Intelligence Layer)**  
*Part of the Life.OS Documentation Suite*

Life.Coach is the intelligence engine of Life.OS. It provides all AI‑powered analysis, insights, correlations, predictions, and coaching — entirely offline — using a local LLM running through WebLLM. It processes data from Journal, Notes, Tasks, and Storage to generate meaningful, personalized insights that help users understand themselves and grow intentionally.

This document defines the purpose, data model, analysis pipelines, insight types, backend endpoints, and cross‑module integrations for Life.Coach.

---

## 1. Purpose and Responsibilities

Life.Coach is the **cognitive and emotional intelligence layer** of Life.OS. It transforms raw data into structured insights, patterns, and recommendations.

### Core Responsibilities
- Run all LLM inference locally using WebLLM.
- Generate embeddings for semantic search and clustering.
- Analyze journal entries, notes, tasks, and workbook data.
- Detect emotional, cognitive, behavioral, and productivity patterns.
- Generate insights, summaries, suggestions, and correlations.
- Maintain the Life Graph and Life Timeline intelligence layers.
- Provide daily, weekly, and monthly reviews.
- Generate Life Moments and memory consolidation summaries.
- Power smart notifications and context‑aware prompts.

### Role in the System
Life.Coach is the **unifying intelligence system** that connects all modules:
- Journal → emotional + cognitive insights  
- Notes → PKM + concept extraction  
- Tasks → productivity + behavior modeling  
- Storage → numeric trends + correlations  
- Life.OS → timeline, graph, dashboards  

---

## 2. Data Model (Conceptual)

Life.Coach stores insights, embeddings, and graph data locally in IndexedDB.

### 2.1 CoachInsight

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `source_module` | string | journal, notes, tasks, storage |
| `source_id` | string | ID of the entry/note/task/cell |
| `insight_type` | string | sentiment, summary, pattern, suggestion, etc. |
| `content` | string | Insight text |
| `metadata` | object | Scores, tags, references |
| `created_at` | timestamp | When generated |

### 2.2 Embedding

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `source_module` | string | Module name |
| `source_id` | string | Entity ID |
| `vector` | float[] | Embedding vector |
| `created_at` | timestamp | Creation time |

### 2.3 Life Graph Nodes

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `type` | string | person, topic, task, note, entry, concept |
| `label` | string | Display name |
| `metadata` | object | Additional info |

### 2.4 Life Graph Edges

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `source` | string | Node ID |
| `target` | string | Node ID |
| `relationship` | string | mentions, related_to, part_of, derived_from |
| `weight` | number | Strength of relationship |

---

## 3. Intelligence Pipelines

Life.Coach uses multiple analysis pipelines, each triggered by module events.

### 3.1 Journal Analysis Pipeline
Triggered on journal entry creation/update.

- Sentiment analysis  
- Mood detection  
- Emotional granularity scoring  
- Cognitive bias detection  
- Topic extraction  
- Strengths identification  
- Reflection question generation  
- Suggested tasks  
- Suggested notes  
- Life Moments detection  

### 3.2 Notes Analysis Pipeline
Triggered on note creation/update.

- Concept extraction  
- Topic clustering  
- Semantic embeddings  
- Relationship detection  
- Suggested tasks  
- Suggested journal prompts  
- Note summarization  

### 3.3 Task Analysis Pipeline
Triggered on task creation/update/completion.

- Difficulty estimation  
- Energy requirement prediction  
- Procrastination detection  
- Project detection  
- Goal alignment analysis  
- Suggested subtasks  
- Productivity trend analysis  

### 3.4 Storage Analysis Pipeline
Triggered on cell updates or chart creation.

- Trend detection  
- Outlier detection  
- Correlation analysis  
- Habit consistency scoring  
- Forecasting (basic)  
- Formula explanation  

---

## 4. Insight Types

Life.Coach generates multiple categories of insights.

### 4.1 Emotional Insights
- Sentiment trends  
- Mood patterns  
- Emotional weather forecasts  
- Emotional granularity scores  

### 4.2 Cognitive Insights
- Cognitive distortions  
- Thinking patterns  
- Strengths and values  
- Reframing suggestions  

### 4.3 Behavioral Insights
- Habit detection  
- Routine suggestions  
- Productivity patterns  
- Energy cycle predictions  

### 4.4 Knowledge Insights
- Concept extraction  
- Topic clustering  
- Semantic relationships  
- Knowledge graph expansion  

### 4.5 Productivity Insights
- Suggested tasks  
- Suggested subtasks  
- Project detection  
- Goal alignment  

### 4.6 Life Moments
Automatically detected meaningful events:
- Breakthroughs  
- Emotional shifts  
- Major themes  
- Behavioral changes  

### 4.7 Memory Consolidation
Periodic summaries:
- Daily digest  
- Weekly review  
- Monthly review  
- Yearly reflection  

---

## 5. Frontend Architecture

Life.Coach does not have a standalone UI but integrates into all modules.

### 5.1 Shared UI Components

- **InsightDrawer** (Journal)  
- **InsightPanel** (Notes)  
- **TaskInsightsPanel** (Tasks)  
- **ChartInsightsPanel** (Storage)  
- **Daily Digest View**  
- **Weekly Review View**  
- **Monthly Review View**  
- **Life Moments Feed**  
- **Life Graph Visualization**  
- **Timeline Summaries**  

### 5.2 Background Processes

- Embedding generation  
- Insight generation  
- Graph updates  
- Timeline updates  
- Notification scheduling  

---

## 6. Workflows

### 6.1 Daily Insight Digest
Generated each morning:
- Mood summary  
- Key themes  
- Suggested tasks  
- Suggested journal prompts  
- Notable correlations  

### 6.2 Weekly Review
Generated every 7 days:
- Emotional trends  
- Productivity patterns  
- Habit consistency  
- Major themes  
- Life Moments summary  

### 6.3 Monthly Review
Generated monthly:
- Long‑term trends  
- Identity themes  
- Relationship insights  
- Goal progress  
- Life Graph evolution  

### 6.4 Life Moments Detection
Triggered by:
- Emotional spikes  
- Behavioral changes  
- Major journal entries  
- Task/project milestones  
- Numeric trends  

---

## 7. Backend Endpoints

Although most intelligence is local, some endpoints support sync and metadata.

### Insights
- `GET /coach/insights`  
- `GET /coach/insights/:id`  

### Graph
- `GET /graph`  
- `POST /graph/nodes`  
- `POST /graph/edges`  

### Timeline
- `GET /timeline`  

### Sync
- `POST /sync/push`  
- `POST /sync/pull`  

---

## 8. IndexedDB Schema (Local)

Tables:
- `coach_insights`  
- `embeddings`  
- `life_graph_nodes`  
- `life_graph_edges`  
- `timeline_events`  
- `sync_queue`  

Indexes:
- `source_module`  
- `insight_type`  
- `created_at`  

---

## 9. Error Handling

### LLM Errors
- Fallback: minimal insights  
- Insights marked as “pending”  

### Embedding Errors
- Retry with smaller chunk size  

### Graph Errors
- Skip edge creation  
- Log locally  

---

## 10. Future Enhancements

- Advanced forecasting models  
- Personality modeling  
- Relationship mapping  
- Multi‑modal insights (images, audio)  
- Long‑term identity modeling  
- AI‑generated routines and habit plans  

---

## 11. Summary

Life.Coach is the intelligence core of Life.OS. It transforms journal entries, notes, tasks, and numeric data into a unified understanding of the user’s emotional, cognitive, behavioral, and productivity patterns. Through local LLM analysis, Life.Coach provides private, powerful, and deeply personal insights that help users grow intentionally.
