# FEATURE_MATRIX.md  
*A comprehensive feature matrix for Life.OS, including active, planned, and abandoned features.*

Status Legend:  
- **🟢 Active** — Implemented or in active development  
- **🟡 Planned** — Approved for future development  
- **🔴 Abandoned** — Removed or deprecated  

---

## 1. Core Platform (Life.OS)

| Feature                | Description                               | Status     | Notes                          |
|------------------------|-------------------------------------------|------------|---------------------------------|
| Offline-first architecture | Full functionality without internet       | 🟡 Planned | IndexedDB + service worker     |
| Sync engine            | Queue-based sync to backend              | 🟡 Planned | User-triggered + automatic     |
| Authentication         | Login, registration, refresh tokens      | 🟡 Planned | Required for sync              |
| Global search          | Cross-module semantic + keyword search   | 🟡 Planned | Powered by embeddings          |
| Dashboards             | Multi-module overview                    | 🟡 Planned | Mood, tasks, notes, insights   |
| Data export/import     | JSON, Markdown bundles                   | 🟡 Planned | Per-module + global            |
| Notification center    | Local, context-aware notifications       | 🟡 Planned | Powered by Life.Coach          |
| Device-aware layout    | Phone/tablet/desktop UI modes            | 🟡 Planned | Responsive PWA                 |
| Life Timeline          | Chronological view of all activity       | 🟡 Planned | Powered by Life.Coach          |
| Life Graph             | Unified graph of people, topics, tasks   | 🟡 Planned | Stored locally                 |

---

## 2. Life.Journal

| Feature                     | Description                                      | Status     | Notes                    |
|-----------------------------|--------------------------------------------------|------------|---------------------------|
| Markdown editor             | Rich journaling interface                        | 🟡 Planned | Mobile-friendly          |
| Stats drawer                | Word count, reading time                         | 🟡 Planned | Collapsible              |
| Sentiment analysis          | Local LLM sentiment scoring                      | 🟡 Planned | Life.Coach               |
| Mood tagging                | Automatic + manual mood tags                     | 🟡 Planned |                           |
| Cognitive pattern detection | Detect distortions (e.g., catastrophizing)       | 🟡 Planned | Life.Coach               |
| Emotional granularity       | Measures emotional vocabulary                    | 🟡 Planned |                           |
| Topic extraction            | Themes, topics, keywords                         | 🟡 Planned |                           |
| Import from Markdown        | Ingest existing journal files                    | 🟡 Planned | From Rob_Journaler       |
| Export to Markdown          | One-entry or batch export                        | 🟡 Planned |                           |
| Export to text/Word         | DOCX export                                      | 🟡 Planned |                           |
| Insight drawer              | LLM-generated insights per entry                 | 🟡 Planned |                           |
| Journal-to-task suggestions | Detect actionable items                          | 🟡 Planned |                           |
| Journal-to-note suggestions | Extract reusable ideas                           | 🟡 Planned |                           |

---

## 3. Life.Notes

| Feature                  | Description                         | Status     | Notes        |
|--------------------------|-------------------------------------|------------|-------------|
| Markdown notes           | Core note-taking                    | 🟡 Planned |             |
| Tags                     | Manual + smart tags                | 🟡 Planned |             |
| Checklists               | To-do style notes                  | 🟡 Planned |             |
| Scratch pads             | Freeform notes                     | 🟡 Planned |             |
| Full-text search         | Keyword search                     | 🟡 Planned |             |
| Semantic search          | Embedding-based search             | 🟡 Planned | Life.Coach  |
| Idea clustering          | Group related notes                | 🟡 Planned |             |
| Concept extraction       | Identify ideas, definitions        | 🟡 Planned |             |
| Knowledge graph          | Visual relationships               | 🟡 Planned |             |
| Note summarization       | LLM summaries                      | 🟡 Planned |             |
| Note-to-task suggestions | Extract actionable items           | 🟡 Planned |             |
| Note-to-journal prompts  | Suggest deeper reflection          | 🟡 Planned |             |

---

## 4. Life.Assistant (Tasks)

| Feature                    | Description                               | Status     | Notes        |
|----------------------------|-------------------------------------------|------------|-------------|
| Task creation              | Title, description, tags                  | 🟡 Planned |             |
| Task statuses              | Todo, in progress, done, blocked          | 🟡 Planned |             |
| Priorities                 | Low, medium, high                         | 🟡 Planned |             |
| Due dates                  | Optional scheduling                       | 🟡 Planned |             |
| Reminders                  | Local notifications                       | 🟡 Planned |             |
| Task views                 | Today, upcoming, overdue, completed       | 🟡 Planned |             |
| Kanban board               | Optional board view                       | 🟡 Planned |             |
| Project detection          | Group tasks into projects                 | 🟡 Planned | Life.Coach  |
| Task difficulty estimation | Predict effort                            | 🟡 Planned |             |
| Procrastination detection  | Identify avoidance patterns               | 🟡 Planned |             |
| Energy-based suggestions   | Suggest tasks based on energy cycles      | 🟡 Planned |             |
| Task breakdown             | LLM-generated subtasks                    | 🟡 Planned |             |
| Goal alignment             | Map tasks to goals                        | 🟡 Planned |             |

---

## 5. Life.Storage (Spreadsheets)

| Feature               | Description                               | Status     | Notes        |
|-----------------------|-------------------------------------------|------------|-------------|
| Workbooks             | Multiple spreadsheets                     | 🟡 Planned |             |
| Sheets                | Tabs within workbooks                    | 🟡 Planned |             |
| Cells                 | Raw values, formulas, formatting         | 🟡 Planned |             |
| Functions             | SUM, AVG, MIN, MAX, etc.                 | 🟡 Planned |             |
| Formatting            | Bold, italic, alignment, number formats  | 🟡 Planned |             |
| Charts                | Basic charting                           | 🟡 Planned |             |
| Formula explanation   | LLM-generated explanations               | 🟡 Planned |             |
| Data insights         | Trends, anomalies                        | 🟡 Planned |             |
| Natural language queries | “Show expenses by category”           | 🟡 Planned |             |
| Cross-module correlations | Mood vs. numeric data                | 🟡 Planned |             |

---

## 6. Life.Coach (Local LLM Intelligence Layer)

| Feature                 | Description                                   | Status     | Notes        |
|-------------------------|-----------------------------------------------|------------|-------------|
| Local LLM               | WebLLM model                                  | 🟡 Planned |             |
| Embeddings              | Local vector store                            | 🟡 Planned |             |
| Insight generation      | Per-entry, per-note, per-task                 | 🟡 Planned |             |
| Daily insight digest    | Daily summary of patterns                     | 🟡 Planned |             |
| Weekly review           | Multi-module weekly summary                   | 🟡 Planned |             |
| Monthly review          | Long-term trends                              | 🟡 Planned |             |
| Emotional weather       | Short-term emotional forecast                 | 🟡 Planned |             |
| Cognitive bias detection| Detect distortions                            | 🟡 Planned |             |
| Habit extraction        | Identify repeated behaviors                   | 🟡 Planned |             |
| Routine builder         | Morning/evening/workday routines              | 🟡 Planned |             |
| Relationship insights   | Emotional tone around people                  | 🟡 Planned |             |
| Life Moments detection  | Breakthroughs, milestones                     | 🟡 Planned |             |
| Smart notifications     | Gentle, context-aware prompts                 | 🟡 Planned |             |
| Memory consolidation    | Monthly/quarterly/yearly summaries            | 🟡 Planned |             |
| Conversational coaching | Chat interface                                | 🟡 Planned |             |
| Goal extraction         | Identify goals from text                      | 🟡 Planned |             |
| Life domains analysis   | Work, health, relationships, etc.             | 🟡 Planned |             |
| Theme maps              | Visual clusters of topics/emotions            | 🟡 Planned |             |
| Life graph analysis     | Central nodes, clusters                       | 🟡 Planned |             |
| Timeline analysis       | Narrative summaries                           | 🟡 Planned |             |

---

## 7. Intelligence Systems (11 Feature Sets)

| System                    | Description                                  | Status     |
|---------------------------|----------------------------------------------|------------|
| Unified Life Graph        | Graph of people, topics, tasks, habits      | 🟡 Planned |
| Automatic Cross-Linking   | Suggested links across modules              | 🟡 Planned |
| Life Timeline             | Chronological visualization                 | 🟡 Planned |
| PKM Engine                | Knowledge vault, semantic search            | 🟡 Planned |
| Productivity Intelligence  | Energy modeling, project detection          | 🟡 Planned |
| Emotional Insight Engine  | Emotional weather, tone analysis            | 🟡 Planned |
| Cognitive Insight Engine  | Bias detection, reframes                    | 🟡 Planned |
| Habit Intelligence        | Habit extraction, correlation               | 🟡 Planned |
| Context Awareness         | Time/location-aware patterns                | 🟡 Planned |
| Advanced Visualization    | Dashboards, theme maps                      | 🟡 Planned |
| Magic Features            | Life Moments, notifications, memory consolidation | 🟡 Planned |

---

## 8. Abandoned Features

| Feature | Reason | Notes |
|--------|--------|-------|
| None   | —      | All features remain in scope |

---

## 9. Roadmap Summary

| Version | Milestone                                                |
|---------|----------------------------------------------------------|
| 0.1.0   | Full architectural specification                         |
| 0.2.0   | Backend + frontend scaffolding, IndexedDB schema, sync prototype |
| 0.3.0   | Life.Journal MVP + Life.Coach basic analysis             |
| 0.4.0   | Life.Notes MVP + semantic search                         |
| 0.5.0   | Life.Assistant MVP + task intelligence                   |
| 0.6.0   | Life.Storage MVP + formula insights                      |
| 0.7.0   | Unified Life Graph + Timeline                            |
| 0.8.0   | Full intelligence suite integration                      |
| 1.0.0   | Production-ready release                                 |