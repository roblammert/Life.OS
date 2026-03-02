# APPENDIX_SYNC_OPERATIONS.md  
**Sync Operations Appendix — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix catalogs all sync operation types, conflict‑resolution rules, backend expectations, and data‑flow guarantees for the optional Life.OS sync engine. Sync is strictly opt‑in and designed to preserve privacy, minimize data transfer, and maintain consistency across devices without compromising the local‑first architecture.

---

# 1. Purpose of the Sync Engine

The sync engine exists to:

- Synchronize user data across devices  
- Preserve local‑first privacy guarantees  
- Support offline‑first workflows  
- Maintain consistency using operation‑based sync  
- Avoid overwriting or losing data  
- Provide transparency into sync state  

Sync is **never required** for Life.OS to function.

---

# 2. Sync Architecture Overview

Life.OS uses **operation‑based sync**, not document‑based sync.

### Why operation‑based?
- Smaller payloads  
- Better conflict resolution  
- No full‑document overwrites  
- Works well offline  
- Supports granular merges  

### Sync Components
- Sync Queue (local)  
- Sync Engine (local)  
- Sync API (backend)  
- Operation Log (backend)  

---

# 3. Sync Queue Data Model

### Table: `sync_queue`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| operation | string | create, update, delete |
| table | string | Target table |
| payload | object | Data |
| timestamp | number | Unix timestamp |
| retry_count | number | Retry attempts |

### Example Operation
```
{ id: "op_123", operation: "update", table: "entries", payload: { id: "entry_1", text: "Updated text" }, timestamp: 1712345678901, retry_count: 0 }
```

---

# 4. Supported Sync Operations

### create
Adds a new entity to the backend.

### update
Modifies an existing entity.

### delete
Removes an entity.

### merge (backend only)
Combines conflicting updates.

### noop
Returned when no changes are needed.

---

# 5. Module‑Specific Sync Behavior

## Journal
- Syncs entries  
- Syncs emotional/cognitive metadata (optional)  
- Does **not** sync embeddings  

## Notes
- Syncs notes  
- Syncs concepts/topics (optional)  
- Does **not** sync embeddings  

## Tasks
- Syncs tasks and projects  
- Syncs productivity metadata (optional)  

## Storage (Spreadsheets)
- Syncs workbooks, sheets, and cells  

## Intelligence
- Syncs insights (optional)  
- Does **not** sync embeddings  
- Does **not** sync LLM prompts/responses  

## Graph
- Syncs nodes/edges (optional)  
- Does **not** sync embeddings  

## Timeline
- Syncs events (optional)  

---

# 6. Backend API Expectations

### Required Endpoints
- `POST /sync/push`  
- `POST /sync/pull`  
- `POST /sync/resolve`  

### Backend Responsibilities
- Validate operations  
- Apply operations atomically  
- Maintain operation log  
- Return merged state  
- Handle conflicts  
- Enforce authentication  
- Never store embeddings or LLM data  

### Authentication
- JWT tokens  
- Short‑lived access tokens  
- Refresh tokens stored securely  

---

# 7. Sync Flow

### Step 1 — Local Changes
User creates/updates/deletes data.

### Step 2 — Operation Enqueued
Operation added to `sync_queue`.

### Step 3 — Sync Triggered
Triggered by:
- Interval  
- Manual sync  
- App startup  
- Network reconnect  

### Step 4 — Push Operations
Queue sent to backend.

### Step 5 — Backend Applies Operations
Backend updates DB and returns:
- Success  
- Conflicts  
- Merged state  

### Step 6 — Pull Updates
Client fetches remote changes.

### Step 7 — Local Merge
Local DB updated.

### Step 8 — Queue Cleanup
Successful operations removed.

---

# 8. Conflict Resolution Rules

Conflicts occur when:
- Two devices update the same entity  
- Updates occur offline  
- Updates occur out of order  

### Conflict Types
- Field‑level conflict  
- Entity‑level conflict  
- Delete/update conflict  

### Resolution Strategies

#### Last‑Write‑Wins (default)
Latest timestamp wins.

#### Field‑Level Merge
Each field resolved independently.

#### Merge with Precedence
User‑initiated changes override remote.

#### Manual Resolution (future)
User chooses between versions.

---

# 9. Sync Safety Guarantees

### No Data Loss
Conflicts never delete data silently.

### No Overwrites
Local changes are never overwritten without merge.

### No Embedding Sync
Embeddings remain local.

### No LLM Sync
Prompts/responses never leave device.

### No Hidden Sync
User must explicitly enable sync.

---

# 10. Sync Error Handling

### Retry Logic
- Exponential backoff  
- Max retry count  
- Queue persists across sessions  

### Error Types
- Network error  
- Auth error  
- Backend error  
- Conflict error  

### Recovery
- Queue remains intact  
- User notified  
- Manual retry available  

---

# 11. Sync Transparency

Users can view:
- Pending operations  
- Last sync time  
- Sync errors  
- Synced entities  
- Sync scope (what is synced)  

### Sync Log Example
```
[ { op: "create", table: "entries", id: "entry_1" }, { op: "update", table: "tasks", id: "task_3" } ]
```

---

# 12. Strict Mode Sync Behavior

Strict mode disables:
- Sync  
- Remote requests  
- Remote assets  

Strict mode ensures:
- No data leaves device  
- No sync queue is processed  
- Sync UI is hidden  

---

# 13. Future Sync Enhancements

- Encrypted sync  
- Multi‑device mesh sync  
- LAN‑only sync  
- Sync diff viewer  
- Sync conflict visualizer  
- Sync simulation mode  

---

# 14. Summary

This appendix defines all sync operations, conflict rules, backend expectations, and safety guarantees for the optional Life.OS sync engine. By using operation‑based sync, strict privacy boundaries, and transparent controls, Life.OS ensures that multi‑device use remains safe, predictable, and fully user‑controlled.
