Here is **APPENDIX_SYNC_ENGINE.md** in clean, copy‑and‑paste‑ready Markdown, following the exact formatting you’ve been using and ending with your separator.

---

# APPENDIX_SYNC_ENGINE.md  
**Sync Engine — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The Sync Engine manages optional cloud synchronization for Life.OS. It ensures that user data can move safely between devices while preserving privacy, offline‑first operation, and full local ownership. Sync is modular and entirely optional—Life.OS functions fully without it.

## Purpose

The Sync Engine provides a secure, conflict‑aware, privacy‑respecting mechanism for synchronizing Life.OS data across devices. It preserves the integrity of entries, tasks, habits, insights, embeddings, graph data, and long‑term memory while maintaining local-first performance.

## Sync Architecture

The engine uses a layered architecture:

- **Local-first storage** — the local database is always the source of truth  
- **Delta-based sync** — only changes are transmitted  
- **Conflict resolution layer** — merges changes safely  
- **Transport layer** — pluggable (local network, encrypted cloud, custom server)  
- **Encryption layer** — end-to-end encryption for all synced data  

This architecture ensures privacy, reliability, and extensibility.

## Sync Data Model

The engine tracks:

- **sync_id** — unique identifier for each synced record  
- **last_modified** — timestamp of last local change  
- **sync_version** — version counter for conflict detection  
- **device_id** — origin device  
- **change_type** — insert, update, delete  
- **payload_hash** — integrity check  

These fields allow efficient and safe synchronization.

## Syncable Data Types

The engine supports syncing for:

- Entries  
- Tasks  
- Habits  
- Insights  
- Life Moments  
- Reviews  
- Embeddings (optional, due to size)  
- Graph nodes and edges (optional)  
- Memory records  
- Settings and preferences  

Users can choose which categories to sync.

## Sync Processing Pipeline

### Change Detection
- Monitor local database for inserts, updates, deletes  
- Record changes in the sync log  
- Assign sync IDs and version counters  

### Delta Packaging
- Bundle changes into sync batches  
- Compress and encrypt payloads  
- Validate integrity with hashes  

### Transmission
- Send encrypted deltas to the sync target  
- Receive deltas from other devices  
- Queue incoming changes  

### Conflict Resolution
- Compare version counters  
- Merge non-conflicting changes  
- Resolve conflicts using deterministic rules  
- Log conflict resolutions for transparency  

### Application
- Apply merged changes to the local database  
- Update sync metadata  
- Trigger re-indexing for embeddings and graph data if needed  

## Conflict Resolution Strategy

The engine uses a deterministic, transparent strategy:

- **Last-write-wins** for simple fields  
- **Merge** for lists, tags, and multi-value fields  
- **Union** for concept and embedding clusters  
- **Manual review** for rare ambiguous conflicts  

All conflicts are logged for user visibility.

## Encryption and Security

The Sync Engine uses:

- **End-to-end encryption** — data is encrypted before leaving the device  
- **Key-based authentication** — device-specific keys  
- **Zero-knowledge architecture** — servers cannot read user data  
- **Rotating keys** — periodic key refresh  
- **Encrypted metadata** — even sync logs are encrypted  

Privacy is a core design principle.

## Offline-First Behavior

The engine is designed for:

- Full functionality without network access  
- Local writes that queue for later sync  
- Automatic background sync when online  
- No blocking or waiting for network responses  

The user always interacts with local data.

## Sync Targets

The engine supports multiple sync targets:

- Local network peer-to-peer  
- Encrypted cloud storage  
- Self-hosted server  
- Custom sync providers  

Each target implements the same protocol.

## Performance

The engine is optimized for:

- Minimal bandwidth usage  
- Fast delta computation  
- Efficient conflict resolution  
- Background syncing  
- Scalable data growth  

Embeddings and graph data can be excluded to reduce sync load.

## Summary

The Sync Engine provides secure, private, optional synchronization for Life.OS. It preserves local-first operation while enabling multi-device continuity, conflict resolution, and encrypted data transfer.
