# SYNC_ENGINE.md  
**Sync Engine Specification — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Sync Engine is the subsystem responsible for synchronizing local IndexedDB data with the optional backend MySQL database. Life.OS is offline‑first, so all writes occur locally first, and sync is asynchronous, conflict‑tolerant, and resilient to network interruptions.

This document defines the sync model, queue structure, backend contract, conflict resolution rules, and module integration patterns.

---

# 1. Purpose and Responsibilities

The Sync Engine ensures that:

- Local data is always available, even offline.
- Backend data stays consistent with local changes.
- Sync operations are queued, retried, and conflict‑aware.
- Modules do not need to implement their own sync logic.
- The user can manually trigger sync or rely on automatic sync.
- Sync is safe, incremental, and idempotent.

### Core Responsibilities
- Maintain a persistent sync queue in IndexedDB.
- Push local changes to the backend.
- Pull remote changes from the backend.
- Resolve conflicts deterministically.
- Update local data stores after sync.
- Track sync metadata (tokens, timestamps, pending operations).
- Provide sync status to the UI.

---

# 2. Sync Model Overview

Life.OS uses a **push → pull** sync cycle:

1. **Push** local changes (operations) to the backend.
2. **Pull** remote changes (entities) from the backend.
3. **Apply** remote changes to IndexedDB.
4. **Update** sync metadata.
5. **Notify** modules of updates.

### Design Principles
- **Local-first**: Local writes never wait for network.
- **Operation-based sync**: Sync queue stores CRUD operations.
- **Incremental**: Only changed data is synced.
- **Conflict-tolerant**: Last-write-wins by default.
- **Modular**: Each module registers its own sync handlers.

---

# 3. Sync Queue Specification

The sync queue is stored in IndexedDB as:

### `sync_queue`
| Field | Type | Description |
|-------|------|-------------|
| id | string | UUID |
| module | string | journal, notes, tasks, storage |
| entity_type | string | entry, note, task, workbook, etc. |
| entity_id | string | ID of the entity |
| operation_type | string | create, update, delete |
| payload | object | Serialized entity data |
| created_at | number | Timestamp |

### Operation Types
- **create** — new entity created locally  
- **update** — entity modified locally  
- **delete** — entity removed locally  

### Queue Behavior
- FIFO order  
- Batched by module  
- Automatically retried  
- Cleared only after confirmed backend success  

---

# 4. Sync Triggers

Sync can be triggered by:

### Automatic Triggers
- App startup (if online)
- Periodic interval (configurable)
- After authentication refresh
- After a batch of local writes

### Manual Triggers
- User taps “Sync Now”
- Developer tools

### Background Triggers
- Service worker wake events (future)

---

# 5. Push Phase (Local → Backend)

The push phase sends queued operations to the backend.

### Push Request Format
'''
POST /sync/push { "operations": [ { "id": "...", "module": "journal", "entity_type": "entry", "entity_id": "...", "operation_type": "update", "payload": { ... }, "created_at": 123456789 } ], "last_sync_token": "abc123" }
'''

### Backend Responsibilities
- Apply operations in order.
- Return success/failure per operation.
- Update remote timestamps.
- Return a new sync token.

### Local Behavior
- Remove successful operations from queue.
- Retry failed operations later.
- If token mismatch → trigger full pull.

---

# 6. Pull Phase (Backend → Local)

The pull phase fetches remote changes since the last sync.

### Pull Request Format
```
POST /sync/pull { "last_sync_token": "abc123" }
```
### Pull Response Format
```
{ "changes": { "journal": [...], "notes": [...], "tasks": [...], "storage": [...] }, "new_sync_token": "def456" }
```

### Local Behavior
- Apply remote changes to IndexedDB.
- Update `last_sync_token`.
- Notify modules of updated entities.

---

# 7. Conflict Resolution

Life.OS uses **last-write-wins** based on `updated_at`.

### Rules
- If local `updated_at` > remote → keep local.
- If remote `updated_at` > local → overwrite local.
- If equal → no change.

### Special Cases
- Deleted entities override updates.
- Future: merge UI for notes and spreadsheets.

---

# 8. Module Integration

Each module registers:

### 8.1 Serializer
Converts local entity → sync payload.

### 8.2 Deserializer
Converts remote payload → local entity.

### 8.3 Change Detector
Determines if an entity has changed.

### 8.4 Apply Handler
Applies remote changes to IndexedDB.

### 8.5 Notification Handler
Notifies UI components of updates.

---

# 9. Sync Metadata

Stored in IndexedDB:

### `sync_metadata`
| Field | Type | Description |
|-------|------|-------------|
| last_sync_token | string | Token from backend |
| last_sync_time | number | Timestamp |
| pending_operations | number | Queue length |
| sync_interval | number | ms between auto-sync |

---

# 10. Error Handling

### Network Errors
- Retry with exponential backoff.
- Queue remains intact.

### Backend Errors
- Mark operation as failed.
- Retry later.

### Token Mismatch
- Trigger full pull.
- Rebuild local state.

### Data Corruption
- Skip invalid operations.
- Log locally.

---

# 11. Security

### Transport Security
- HTTPS required for backend sync.

### Authentication
- JWT required for all sync endpoints.

### Data Privacy
- No journal/note/task content is ever sent to external AI.
- Sync is optional and user‑controlled.

---

# 12. Future Enhancements

- Delta-based sync  
- CRDT-based merge for notes  
- Cell-level merge for spreadsheets  
- Background sync via service worker  
- Encrypted local storage  
- Encrypted sync  

---

# 13. Summary

The Sync Engine is the backbone of Life.OS’s offline‑first architecture. It ensures that local data is always available, backend data stays consistent, and modules remain decoupled from sync logic. With a robust queue, conflict resolution, and modular handlers, the Sync Engine enables seamless, resilient synchronization across all modules.
