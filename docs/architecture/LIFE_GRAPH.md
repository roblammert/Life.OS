# LIFE_GRAPH.md  
**Life Graph Specification — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Life Graph is the unified knowledge graph that connects all entities across Life.OS — journal entries, notes, tasks, workbook metrics, people, topics, concepts, habits, and more. It is the backbone of cross‑module intelligence, enabling semantic relationships, clustering, insights, and long‑term pattern detection.

This document defines the Life Graph data model, node/edge types, update rules, intelligence pipelines, visualization requirements, and integration with Life.Coach.

---

# 1. Purpose and Responsibilities

The Life Graph provides a **single, interconnected representation** of the user’s life across all modules.

### Core Responsibilities
- Represent all meaningful entities as graph nodes.
- Represent relationships between entities as edges.
- Update automatically when data changes.
- Support semantic search, clustering, and recommendations.
- Power Life.Coach insights, Life Timeline, and dashboards.
- Enable graph‑based navigation and exploration.

### Why a Graph?
Traditional lists and folders cannot express:
- Relationships  
- Influence  
- Causality  
- Recurrence  
- Cross‑module patterns  

The Life Graph enables:
- “Show me all tasks related to this topic.”  
- “How has my mood changed around this person?”  
- “What concepts appear across my notes and journal entries?”  
- “What habits correlate with productivity?”  

---

# 2. Graph Data Model

The Life Graph consists of **nodes** and **edges**, stored locally in IndexedDB.

## 2.1 Node Structure

### `life_graph_nodes`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| type | string | Node type |
| label | string | Display name |
| metadata | object | Module‑specific metadata |
| created_at | number | Timestamp |
| updated_at | number | Timestamp |

### Node Types
- **entry** — journal entry  
- **note** — note  
- **task** — task  
- **project** — project  
- **concept** — extracted concept  
- **topic** — extracted topic  
- **person** — detected person  
- **habit** — detected habit  
- **metric** — numeric trend or workbook value  
- **moment** — Life Moment  
- **event** — timeline event  

## 2.2 Edge Structure

### `life_graph_edges`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| source | string | Node ID |
| target | string | Node ID |
| relationship | string | Relationship type |
| weight | number | Strength (0–1 or 0–100) |
| created_at | number | Timestamp |

### Relationship Types
- **mentions** — A mentions B  
- **related_to** — semantic similarity  
- **derived_from** — B was created from A  
- **influences** — A influences B  
- **part_of** — A is part of B  
- **caused_by** — A caused B  
- **co_occurs_with** — A and B appear together  
- **correlates_with** — numeric correlation  

---

# 3. Graph Construction Rules

The Life Graph is updated automatically by Life.Coach.

## 3.1 Journal → Graph
Journal entries generate:
- Nodes: entry, topics, people, concepts  
- Edges:
  - entry → topic (mentions)  
  - entry → person (mentions)  
  - entry → concept (mentions)  
  - topic ↔ topic (related_to)  
  - concept ↔ concept (related_to)  

## 3.2 Notes → Graph
Notes generate:
- Nodes: note, concepts, topics  
- Edges:
  - note → concept (mentions)  
  - note → topic (mentions)  
  - note ↔ note (related_to via embeddings)  

## 3.3 Tasks → Graph
Tasks generate:
- Nodes: task, project  
- Edges:
  - task → project (part_of)  
  - task → concept (derived_from)  
  - task → entry (derived_from)  
  - task ↔ task (related_to)  

## 3.4 Storage → Graph
Workbook data generates:
- Nodes: metric  
- Edges:
  - metric ↔ metric (correlates_with)  
  - metric → entry (correlates_with)  
  - metric → task (influences)  

## 3.5 Life Moments → Graph
Life Moments generate:
- Nodes: moment  
- Edges:
  - moment → entry (derived_from)  
  - moment → task (influences)  
  - moment → concept (related_to)  

---

# 4. Graph Update Pipeline

Life.Coach updates the graph through a multi‑stage pipeline:

### Stage 1 — Extraction
- Extract topics, concepts, people, habits, metrics.

### Stage 2 — Embedding
- Generate embeddings for semantic similarity.

### Stage 3 — Node Creation
- Create nodes for new entities.

### Stage 4 — Edge Creation
- Create edges based on:
  - Mentions  
  - Semantic similarity  
  - Causality  
  - Correlation  
  - Co‑occurrence  

### Stage 5 — Weighting
- Weight edges based on:
  - Frequency  
  - Recency  
  - Strength of correlation  
  - Semantic similarity score  

### Stage 6 — Pruning
- Remove stale or low‑value edges.
- Merge duplicate nodes.

---

# 5. Graph Queries

The Life Graph supports several query types.

### 5.1 Neighborhood Query
“Show everything related to this node.”

### 5.2 Path Query
“Show how A is connected to B.”

### 5.3 Cluster Query
“Show clusters of related concepts.”

### 5.4 Influence Query
“What influences my mood the most?”

### 5.5 Correlation Query
“What habits correlate with productivity?”

---

# 6. Graph Visualization

The Life Graph is visualized in the UI using:

### Layout Types
- Force‑directed graph  
- Radial layout  
- Timeline‑aligned layout  
- Cluster view  

### Node Styling
- Color by type  
- Size by importance  
- Highlight active node  

### Edge Styling
- Thickness by weight  
- Color by relationship type  

### Interactions
- Click to open entity  
- Hover to preview  
- Filter by type  
- Search nodes  

---

# 7. Integration with Life.Coach

The Life Graph is central to Life.Coach’s intelligence.

### Life.Coach Uses the Graph For:
- Cross‑module insights  
- Daily/weekly/monthly reviews  
- Life Moments detection  
- Habit extraction  
- Emotional/cognitive pattern detection  
- Productivity analysis  
- Semantic search  
- Topic clustering  

### Life.Coach Updates the Graph When:
- Journal entries are created/edited  
- Notes are created/edited  
- Tasks are created/completed  
- Workbook data changes  
- Insights are generated  
- Life Moments occur  

---

# 8. IndexedDB Schema

Tables:
- `life_graph_nodes`  
- `life_graph_edges`  

Indexes:
- `type`  
- `label`  
- `source`  
- `target`  

---

# 9. Future Enhancements

- Temporal graph (time‑weighted edges)  
- Multi‑layer graph (emotional, cognitive, behavioral layers)  
- Graph‑based journaling prompts  
- Graph‑based task suggestions  
- Graph‑based habit formation engine  
- Graph compression for performance  

---

# 10. Summary

The Life Graph is the structural heart of Life.OS intelligence. It unifies all modules into a single interconnected system, enabling deep insights, semantic relationships, and powerful visualizations. Through Life.Coach, the graph evolves continuously as the user writes, thinks, acts, and grows.
