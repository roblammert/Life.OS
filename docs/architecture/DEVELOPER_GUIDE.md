# DEVELOPER_GUIDE.md  
**Developer Guide — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This guide provides developers with a complete overview of how to build, extend, debug, and maintain Life.OS. It covers the architecture philosophy, module boundaries, coding standards, data flow, intelligence pipelines, testing strategy, and best practices for contributing to the system.

Life.OS is intentionally modular, offline‑first, and intelligence‑driven. This guide ensures that all contributors maintain architectural consistency and long‑term maintainability.

---

# 1. Architecture Philosophy

Life.OS is built on four core principles:

### 1.1 Local‑First
- All data stored locally (IndexedDB)
- All intelligence runs locally (WebLLM)
- Sync is optional and user‑controlled

### 1.2 Modular
- Each module owns its own data, UI, and logic
- Modules communicate through shared contracts
- Modules never directly mutate each other’s data

### 1.3 Intelligence‑Native
- Embeddings, insights, and graph updates are first‑class citizens
- Life.Coach orchestrates all intelligence pipelines
- Modules expose metadata for analysis

### 1.4 Extensible
- New modules can be added without breaking existing ones
- Graph and Timeline automatically integrate new module events
- Intelligence pipelines automatically ingest new module metadata

---

# 2. Technology Stack

### Frontend
- **React** (or Svelte/Vanilla alternative—architecture is framework‑agnostic)
- **TypeScript**
- **Zustand** for global state
- **IndexedDB** for storage
- **Service Worker** for offline caching
- **WebGPU** for LLM inference (via WebLLM)

### Intelligence
- **WebLLM** for local LLM inference
- **Embeddings** for semantic search and graph edges
- **Life.Coach** for insights and reviews

### Visualization
- **D3.js** or **Recharts** for charts
- **Custom WebGL renderer** for Life Graph (future)

### Sync (Optional)
- REST or WebSocket backend
- Operation‑based sync queue

---

# 3. Project Structure


```markdown
## Directory Overview

### /app_shell
Global layout, navigation, state, and PWA shell.

### /modules
Feature‑level modules, each owning its own UI, data, and intelligence hooks.
- **journal** — entries, emotional/cognitive analysis
- **notes** — concepts, topics, semantic linking
- **tasks** — projects, productivity insights
- **storage** — spreadsheets, metrics, correlations
- **timeline** — chronological event aggregation
- **graph** — semantic graph nodes/edges
- **coach** — Life.Coach UI and insight surfaces

### /engines
Intelligence subsystems powering insights and cross‑module features.
- **llm** — WebLLM runtime, embeddings, inference pipelines
- **context** — temporal/emotional/cognitive context detection
- **visualization** — charts, dashboards, graph rendering
- **notification** — scheduling, delivery, smart prompts
- **habit** — habit/routine detection
- **emotional** — mood, sentiment, emotional weather
- **cognitive** — distortions, strengths, reframes
- **productivity** — cycles, blockers, task suggestions
- **knowledge** — concepts, topics, clusters

### /db
IndexedDB schema definitions, migrations, and access layer.

### /sync
Optional sync engine, queue, conflict resolution.

### /utils
Shared helpers, formatting, parsing, math, etc.

### /hooks
Shared React hooks for state, DB, LLM, graph, timeline.

### /components
Reusable UI components across modules.

### /theme
Design system, colors, typography, spacing, theming logic.

### Module Boundaries
Each module contains:
- UI components
- IndexedDB schema
- Metadata extractors
- Graph providers
- Timeline providers
- Insight providers (optional)

---

# 4. Data Flow

Life.OS uses a predictable, layered data flow:

### 4.1 User Input → Module Data
- User creates/edits entries, notes, tasks, etc.
- Module writes to IndexedDB
- Module emits timeline events

### 4.2 Module Data → Intelligence Pipelines
- Life.Coach ingests new/updated entities
- Emotional/Cognitive/Productivity/Habit/Knowledge engines run
- Insights generated and stored

### 4.3 Intelligence → Graph & Timeline
- Graph nodes/edges updated
- Timeline events added
- Notifications scheduled

### 4.4 UI → Visualization Engine
- Dashboards and charts rendered
- Graph visualizations updated
- Timeline views updated

---

# 5. IndexedDB Conventions

### Naming
- One table per entity type
- Table names are lowercase plural (e.g., `entries`, `notes`, `tasks`)

### Schema Versioning
- Increment version on breaking changes
- Provide migration scripts

### Access Layer
Use a shared DB wrapper:
- `db.get(table, id)`
- `db.put(table, entity)`
- `db.delete(table, id)`
- `db.query(table, index, value)`

### Never Access IndexedDB Directly in Components
Use:
- Hooks  
- Services  
- Module controllers  

---

# 6. Module Development Guide

### 6.1 Creating a New Module
A module must implement:

#### Data Layer
- IndexedDB schema
- CRUD operations
- Metadata extractors

#### Intelligence Layer
- Graph node/edge providers
- Timeline event providers
- Insight providers (optional)

#### UI Layer
- Module viewport
- Module actions
- Module search provider

### 6.2 Module Contracts
Each module exports:
- `registerGraphNodes()`
- `registerGraphEdges()`
- `registerTimelineEvents()`
- `registerInsightProviders()`
- `registerSearchProvider()`

---

# 7. Intelligence Integration

### 7.1 Metadata Extractors
Each module must expose metadata for:
- Embeddings
- Concept extraction
- Emotional/cognitive analysis
- Habit detection
- Productivity analysis

### 7.2 Insight Providers
Modules can define:
- Emotional insights
- Cognitive insights
- Behavioral insights
- Productivity insights
- Knowledge insights

### 7.3 Graph Integration
Modules must define:
- Node types
- Edge types
- Node metadata
- Edge metadata

---

# 8. Life Graph Integration

### Node Requirements
Nodes must include:
- `id`
- `type`
- `embedding` (optional)
- `metadata`

### Edge Requirements
Edges must include:
- `source`
- `target`
- `type`
- `weight` (optional)

### Graph Updates
- Triggered by module changes
- Triggered by insights
- Triggered by Life Moments

---

# 9. Timeline Integration

### Event Requirements
Events must include:
- `id`
- `type`
- `timestamp`
- `source_module`
- `source_id`
- `metadata`

### Event Types
- Creation  
- Update  
- Insight  
- Life Moment  
- Review  

---

# 10. Local LLM Integration

### LLM Pipelines
- Embeddings  
- Insights  
- Reviews  
- Semantic search  

### Developer Responsibilities
- Provide clean text for analysis
- Avoid sending unnecessary metadata
- Chunk long text
- Cache embeddings

---

# 11. Testing Strategy

### Unit Tests
- Module logic  
- DB operations  
- Metadata extractors  

### Integration Tests
- Intelligence pipelines  
- Graph updates  
- Timeline events  

### UI Tests
- Module views  
- Navigation  
- Search  
- Notifications  

### Performance Tests
- LLM inference  
- Graph rendering  
- Timeline rendering  

---

# 12. Debugging Tools

### Built‑In Tools
- Graph inspector  
- Timeline inspector  
- Insight inspector  
- LLM console  
- IndexedDB viewer  

### Developer Shortcuts
- `Ctrl+Shift+L` — LLM logs  
- `Ctrl+Shift+G` — Graph debug  
- `Ctrl+Shift+T` — Timeline debug  

---

# 13. Coding Standards

### TypeScript
- Strict mode  
- No `any`  
- Use discriminated unions  
- Use module‑scoped types  

### React
- Functional components  
- Hooks only  
- No class components  

### State
- Zustand for global state  
- Local state for UI only  
- No global mutable objects  

### Naming
- `camelCase` for variables  
- `PascalCase` for components  
- `snake_case` for DB fields  

---

# 14. Contribution Workflow

### Steps
1. Create feature branch  
2. Implement module/feature  
3. Add tests  
4. Update docs  
5. Submit PR  
6. Code review  
7. Merge  

### Code Review Checklist
- Follows architecture  
- No cross‑module mutations  
- IndexedDB schema correct  
- Graph/timeline integration correct  
- LLM pipelines respected  
- No external network calls  

---

# 15. Future Developer Tools

- Module scaffolding CLI  
- Graph diff viewer  
- Insight replay debugger  
- LLM prompt profiler  
- Sync conflict visualizer  

---

# 16. Summary

The Developer Guide ensures that Life.OS remains modular, maintainable, and intelligence‑native. By following these conventions—module boundaries, IndexedDB patterns, intelligence contracts, graph/timeline integration, and local‑first principles—developers can extend Life.OS confidently and sustainably.
