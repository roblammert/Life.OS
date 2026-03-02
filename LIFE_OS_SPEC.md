# LIFE_OS_SPEC.md  
**Master Specification — Life.OS**  
*The complete architectural, functional, and intelligence blueprint for the Life.OS platform.*

Life.OS is a modular, offline‑first personal operating system designed to unify journaling, notes, tasks, spreadsheets, and a local AI coach into a single cohesive PWA. This specification defines the full system architecture, module responsibilities, data flows, intelligence systems, and development standards for the entire platform.

This is the authoritative reference document for all development work.

---

# 1. Vision and Philosophy

Life.OS exists to help users understand their lives, make better decisions, and grow intentionally — all while keeping their data private and local.

### Core Principles
- **Offline‑first** — Everything works without internet.
- **Privacy‑first** — All AI runs locally via WebLLM.
- **Modular architecture** — Each module is independent but interoperable.
- **Cross‑module intelligence** — Insights span journal, notes, tasks, and data.
- **Device‑aware PWA** — One app, optimized for all screens.
- **User‑owned data** — Exportable, portable, never locked in.

---

# 2. System Architecture Overview

Life.OS is composed of:

### Frontend (PWA)
- React + TypeScript  
- Vite  
- IndexedDB (Dexie)  
- WebLLM (local LLM)  
- Service worker for offline support  
- Responsive UI for phone/tablet/desktop  

### Backend (Optional Sync Server)
- Node.js + TypeScript  
- NestJS or Express  
- MySQL  
- Prisma ORM  
- REST API for sync, auth, and metadata  

### Intelligence Layer
- WebLLM for inference  
- Local embeddings store  
- Life Graph  
- Life Timeline  
- Insight pipelines  

---

# 3. Modules

Life.OS consists of six major modules:

1. **Life.OS (Core Orchestrator)**  
2. **Life.Journal**  
3. **Life.Notes**  
4. **Life.Assistant (Tasks)**  
5. **Life.Storage (Spreadsheets)**  
6. **Life.Coach (Intelligence Layer)**  

Each module has its own specification file in `docs/modules/`.

---

# 4. Data Architecture

Life.OS uses a hybrid local‑first data model.

### 4.1 Local Storage (IndexedDB)
Stores:
- Journal entries  
- Notes  
- Tasks  
- Workbooks, sheets, cells  
- Embeddings  
- Coach insights  
- Life Graph nodes/edges  
- Sync queue  

### 4.2 Backend Storage (MySQL)
Stores:
- Structured data for sync  
- User profile  
- Metadata  
- Sync tokens  

### 4.3 Sync Model
- Local writes always succeed  
- Sync queue stores pending operations  
- Push → Pull cycle  
- Conflict resolution: last‑write‑wins  
- Future: merge UI for notes and spreadsheets  

---

# 5. Intelligence Systems (11 Feature Sets)

Life.OS includes eleven intelligence systems powered by Life.Coach.

### 5.1 Unified Life Graph
Nodes:
- People  
- Topics  
- Concepts  
- Tasks  
- Notes  
- Journal entries  
- Workbook metrics  

Edges:
- `mentions`, `related_to`, `part_of`, `derived_from`, `influences`

### 5.2 Automatic Cross‑Linking
Suggests:
- Notes ↔ Journal  
- Tasks ↔ Journal  
- Notes ↔ Notes  
- Tasks ↔ Notes  
- Data ↔ Journal  

### 5.3 Life Timeline
Chronological visualization of:
- Entries  
- Notes  
- Tasks  
- Data events  
- Life Moments  

### 5.4 PKM Engine
- Semantic search  
- Concept extraction  
- Topic clustering  
- Knowledge graph  

### 5.5 Productivity Intelligence
- Task difficulty  
- Energy modeling  
- Procrastination detection  
- Project detection  

### 5.6 Emotional Insight Engine
- Sentiment  
- Mood  
- Emotional granularity  
- Emotional weather  

### 5.7 Cognitive Insight Engine
- Cognitive distortions  
- Thinking patterns  
- Strengths  
- Reframes  

### 5.8 Habit Intelligence
- Habit extraction  
- Routine suggestions  
- Consistency scoring  

### 5.9 Context Awareness
- Time‑based patterns  
- Optional location‑based patterns  

### 5.10 Advanced Visualization
- Dashboards  
- Theme maps  
- Graph views  
- Trend charts  

### 5.11 Magic Features
- Life Moments  
- Smart notifications  
- Memory consolidation  

---

# 6. Frontend Specification

### 6.1 App Shell
- Global navigation  
- Top bar with search + sync  
- Notification center  
- Device‑aware layout  

### 6.2 Routing
- `/` — Dashboard  
- `/journal`  
- `/notes`  
- `/tasks`  
- `/storage`  
- `/coach`  
- `/timeline`  
- `/graph`  
- `/settings`  

### 6.3 UI Themes
- Light  
- Dark  
- High‑contrast  

---

# 7. Backend Specification

### 7.1 Authentication
- JWT‑based  
- Refresh tokens  
- Optional email verification  

### 7.2 Sync Endpoints
- `POST /sync/push`  
- `POST /sync/pull`  
- `GET /sync/status`  

### 7.3 Module Endpoints
Each module exposes CRUD endpoints for sync.

### 7.4 Database Schema
Defined in Prisma:
- Users  
- Journal entries  
- Notes  
- Tasks  
- Workbooks/sheets/cells  
- Sync metadata  

---

# 8. Insight Pipelines

### 8.1 Journal Pipeline
- Sentiment  
- Mood  
- Cognitive patterns  
- Topics  
- Strengths  
- Reflection prompts  

### 8.2 Notes Pipeline
- Concepts  
- Clusters  
- Summaries  
- Related notes  

### 8.3 Tasks Pipeline
- Difficulty  
- Energy  
- Subtasks  
- Goal alignment  

### 8.4 Storage Pipeline
- Trends  
- Outliers  
- Correlations  

---

# 9. Life Graph Specification

### 9.1 Node Types
- Person  
- Topic  
- Concept  
- Entry  
- Note  
- Task  
- Metric  

### 9.2 Edge Types
- `mentions`  
- `related_to`  
- `derived_from`  
- `influences`  
- `part_of`  

### 9.3 Graph Storage
Stored locally in IndexedDB:
- `life_graph_nodes`  
- `life_graph_edges`  

---

# 10. Life Timeline Specification

### 10.1 Event Types
- Journal entry  
- Note created  
- Task created  
- Task completed  
- Workbook event  
- Life Moment  

### 10.2 Timeline Views
- Daily  
- Weekly  
- Monthly  
- Yearly  

---

# 11. Notifications

### 11.1 Notification Types
- Task reminders  
- Suggested tasks  
- Reflection prompts  
- Mood check‑ins  
- Life Moments alerts  

### 11.2 Delivery
- Local only  
- Never cloud‑pushed  

---

# 12. Export & Import

### 12.1 Export Formats
- JSON  
- Markdown bundles  
- CSV  
- ZIP archives  

### 12.2 Import Formats
- Markdown  
- CSV  
- JSON  

---

# 13. Security & Privacy

### 13.1 Local‑Only AI
- All LLM inference is local  
- No data leaves device  

### 13.2 Optional Sync
- User‑controlled  
- Can be disabled entirely  

### 13.3 Encryption (Future)
- Local encryption at rest  
- Encrypted sync  

---

# 14. Roadmap

### 0.1.0  
Architectural specification (this document)

### 0.2.0  
Backend + frontend scaffolding

### 0.3.0  
Journal MVP + basic insights

### 0.4.0  
Notes MVP + semantic search

### 0.5.0  
Tasks MVP + productivity intelligence

### 0.6.0  
Storage MVP + data insights

### 0.7.0  
Life Graph + Timeline

### 0.8.0  
Full intelligence suite

### 1.0.0  
Production release

---

# 15. Summary

Life.OS is a unified, privacy‑first personal operating system built around journaling, knowledge management, productivity, and data tracking — all powered by a local AI coach. This specification defines the complete architecture required to build the platform from end to end.
