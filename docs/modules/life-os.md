# life-os.md
Module Specification — Life.OS (Core Orchestrator)
Part of the Life.OS Documentation Suite
Life.OS is the central orchestrator of the entire platform. It coordinates authentication, sync, global search, cross‑module analytics, device‑aware layout, and the intelligence features provided by Life.Coach. Every other module (Journal, Notes, Assistant, Storage, Coach) plugs into Life.OS through well‑defined interfaces and shared data structures.
This document defines the responsibilities, data flows, UI components, backend endpoints, and integration points for the Life.OS module.

1. Purpose and Responsibilities
Life.OS serves as the foundation and conductor of the entire application. Its responsibilities include:
Core Responsibilities
- Manage user authentication and session lifecycle.
- Orchestrate offline‑first sync between IndexedDB and the backend.
- Provide global search across all modules.
- Render the device‑aware PWA layout.
- Host the global dashboards and analytics views.
- Manage user preferences, themes, and settings.
- Provide data export/import capabilities.
- Integrate and surface Life.Coach insights across modules.
- Maintain the Life Timeline and Life Graph views.
- Provide a notification center for local, context‑aware prompts.
Architectural Role
Life.OS is the “root module” that:
- Initializes the application.
- Loads the local database schema.
- Loads the WebLLM model.
- Coordinates module initialization.
- Provides shared utilities (API client, sync engine, analytics engine).
- Ensures consistent UX across devices.

2. Data Model (Conceptual)
Life.OS does not own most domain data (that belongs to the modules), but it does own several global data structures.
2.1 User Profile
Stored in backend + cached locally.
Fields:
- id
- email
- name
- timezone
- created_at
- updated_at
- preferences (theme, layout mode, sync interval, etc.)
2.2 Sync Metadata
Stored locally and synced to backend.
Fields:
- last_sync_token
- last_sync_time
- sync_interval
- pending_operations_count
2.3 Life Graph (Global Knowledge Graph)
Stored locally in IndexedDB.
Nodes:
- People
- Topics
- Projects
- Goals
- Habits
- Journal entries
- Notes
- Tasks
- Workbook/sheet metadata
Edges:
- mentions
- related_to
- part_of
- caused_by
- influences
- derived_from
2.4 Life Timeline
A chronological index of:
- Journal entries
- Notes
- Tasks created/completed
- Workbook events
- Mood/sentiment changes
- Life Moments (from Life.Coach)

3. Frontend Architecture
Life.OS defines the application shell and global UI components.
3.1 App Shell Components
- AppShell — root layout container
- GlobalNav — module navigation
- TopBar — search, sync, user menu
- SyncStatusBar — sync state indicator
- NotificationCenter — local notifications
- AppFooter — optional footer for desktop
3.2 Routes
- / — Dashboard (multi‑module overview)
- /auth/* — Login, register, password reset
- /timeline — Life Timeline
- /graph — Life Graph visualization
- /settings — Preferences, theme, sync settings
- /export — Data export tools
- /import — Data import tools
3.3 Device‑Aware Layout
Life.OS manages responsive behavior:
Phone (Portrait)
- Single‑column layout
- Drawers for side panels
- Bottom navigation bar
Tablet (Landscape)
- Two‑pane layout
- Persistent navigation sidebar
Desktop
- Multi‑column layout
- Persistent sidebars
- Expanded dashboards

4. Sync Engine Specification
Life.OS owns the sync engine, which synchronizes local IndexedDB data with the backend MySQL database.
4.1 Local Sync Queue
Each operation is stored as:
- id
- module
- entity_type
- entity_id
- operation_type (create/update/delete)
- payload
- created_at
4.2 Sync Triggers
- On app startup (if online)
- On interval (configurable)
- On user action (“Sync Now”)
- After authentication refresh
4.3 Sync Flow
- Push local changes (/sync/push)
- Pull remote changes (/sync/pull)
- Apply changes to IndexedDB
- Update last_sync_token
- Notify modules of updates
4.4 Conflict Resolution
Default: last‑write‑wins using updated_at.
Future:
- Merge strategies for notes
- Cell‑level conflict resolution for spreadsheets

5. Global Search
Life.OS provides a unified search interface across all modules.
5.1 Search Types
- Keyword search (fast, local)
- Semantic search (via embeddings)
- Filtered search (module, date range, tags)
5.2 Search Index
IndexedDB stores:
- Journal entry metadata
- Note metadata
- Task metadata
- Workbook/sheet metadata
- Embeddings for semantic search
5.3 Search UI
- Search bar in top navigation
- Search results panel with module filters
- Quick actions (open, edit, link, tag)

6. Dashboards & Analytics
Life.OS hosts global dashboards that aggregate data from all modules.
6.1 Dashboard Widgets
- Mood over time
- Task completion trends
- Notes created per week
- Journal sentiment timeline
- Life Moments (from Life.Coach)
- Habit consistency
- Energy cycle predictions
- Cross‑module correlations
6.2 Customization
Users can:
- Reorder widgets
- Hide/show widgets
- Configure time ranges

7. Notification Center
Life.OS manages local, context‑aware notifications generated by Life.Coach.
Notification Types
- Task reminders
- Suggested tasks
- Reflection prompts
- Mood check‑ins
- Life Moments alerts
- Habit consistency nudges
Notifications are:
- Local only
- Never pushy
- Always optional

8. Data Export & Import
Life.OS provides global tools for exporting and importing data.
8.1 Export Formats
- JSON (full dataset)
- Markdown bundles (journal + notes)
- CSV (tasks, workbook data)
- ZIP archives (multi‑module export)
8.2 Import Sources
- Existing Markdown journals
- Notes from other apps
- CSV spreadsheets
- JSON backups

9. Backend Endpoints (Life.OS)
Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
Sync
- POST /sync/push
- POST /sync/pull
- GET /sync/status
Search
- POST /search/query
- GET /search/suggestions
Stats
- GET /stats/overview
- GET /stats/mood
- GET /stats/tasks
- GET /stats/notes
Export/Import
- POST /export
- POST /import

10. Integration with Life.Coach
Life.OS is the primary consumer of Life.Coach insights.
Life.Coach provides:
- Daily insight digest
- Weekly/monthly reviews
- Emotional weather
- Cognitive bias detection
- Habit extraction
- Routine suggestions
- Life Moments detection
- Life Graph analysis
- Timeline summaries
- Cross‑module correlations
Life.OS displays:
- Insight feed
- Review pages
- Graph and timeline visualizations
- Notification center prompts
- Dashboard widgets

11. Future Enhancements
Planned improvements include:
- Multi‑device sync conflict UI
- Custom dashboard widget builder
- Advanced Life Graph editing tools
- Offline‑only mode (no backend required)
- Encrypted local backups

12. Summary
Life.OS is the backbone of the entire platform. It provides the infrastructure, orchestration, and global intelligence that make the other modules cohesive and powerful. By managing sync, search, layout, analytics, and Life.Coach integration, Life.OS transforms the application from a collection of tools into a unified personal operating system.
