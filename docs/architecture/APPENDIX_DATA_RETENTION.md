# APPENDIX_DATA_RETENTION.md  
**Data Retention & Deletion Appendix — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix defines all data retention rules, auto‑delete policies, user‑controlled deletion settings, and privacy guarantees across Life.OS. Because Life.OS is a personal operating system that stores deeply sensitive information, data retention must be transparent, user‑controlled, and privacy‑first.

---

# 1. Purpose of Data Retention Controls

Data retention exists to:

- Give users full control over how long their data persists  
- Support privacy‑first workflows  
- Reduce long‑term storage footprint  
- Allow automatic cleanup of old or unnecessary data  
- Ensure insights and embeddings remain relevant  
- Support strict privacy mode  
- Provide clear guarantees about what is stored and for how long  

All retention rules are **local‑only** unless sync is explicitly enabled.

---

# 2. Retention Settings Overview

Retention settings are stored in the `settings` table under `data_retention`.

### Structure
```
{ auto_delete_entries_after: number | null, auto_delete_notes_after: number | null, auto_delete_tasks_after: number | null, auto_delete_insights_after: number | null, auto_delete_embeddings_after: number | null, auto_delete_timeline_after: number | null, auto_delete_graph_after: number | null, strict_mode: boolean }
```

### Default Behavior
- No auto‑delete enabled  
- All data persists indefinitely  
- Strict mode off  

---

# 3. Retention Rules by Module

## Journal
- Entries may be auto‑deleted after X days  
- Emotional/cognitive metadata deleted with entry  
- Related graph nodes/edges removed  
- Timeline events removed  

## Notes
- Notes may be auto‑deleted after X days  
- Concepts/topics removed  
- Graph nodes/edges removed  
- Timeline events removed  

## Tasks
- Completed tasks may be auto‑deleted after X days  
- Projects may be auto‑deleted after inactivity  
- Productivity metadata removed  

## Storage (Spreadsheets)
- Workbooks/sheets/cells may be auto‑deleted after X days  
- Trends/correlations removed  

---

# 4. Intelligence Retention Rules

## Insights
Insights may be auto‑deleted after X days.

Deleting an insight removes:
- Insight text  
- Metadata  
- Related graph nodes  
- Related timeline events  

## Embeddings
Embeddings may be auto‑deleted after X days.

Deleting an embedding:
- Removes vector  
- Removes similarity edges  
- May trigger graph cleanup  

## Life Moments
Life Moments are treated as high‑value data.

Retention options:
- Keep indefinitely (default)  
- Auto‑delete after X months  
- Delete manually  

## Reviews
Daily/weekly/monthly/yearly reviews may be auto‑deleted after X days.

---

# 5. Graph Retention Rules

Graph nodes and edges follow retention rules of their source entities.

### Node Deletion
When a node is deleted:
- All edges referencing it are removed  
- Clusters are recalculated  
- Neighborhoods updated  

### Edge Deletion
Edges may be auto‑deleted if:
- Weight falls below threshold  
- Embeddings expire  
- Source/target deleted  

### Graph Auto‑Cleanup
Periodic cleanup removes:
- Orphan nodes  
- Weak edges  
- Expired embeddings  
- Stale clusters  

---

# 6. Timeline Retention Rules

Timeline events may be auto‑deleted after X days.

Deleting a timeline event:
- Does not delete the underlying entity  
- Removes visual clutter  
- Reduces storage footprint  

Life Moments and review events are exempt unless explicitly configured.

---

# 7. Strict Mode Retention

Strict mode enforces aggressive privacy rules.

### Strict Mode Behavior
- No sync  
- No external requests  
- No remote assets  
- Auto‑delete embeddings after 7 days  
- Auto‑delete insights after 30 days  
- Auto‑delete timeline events after 90 days  
- Auto‑delete graph edges after 90 days  
- Auto‑delete reviews after 180 days  
- No long‑term storage of LLM prompts/responses  

Strict mode is designed for users who want maximum privacy with minimal long‑term data retention.

---

# 8. Manual Deletion Options

Users can manually delete:

- Individual entries  
- Individual notes  
- Individual tasks  
- Individual insights  
- Individual embeddings  
- Individual timeline events  
- Individual graph nodes  
- Entire modules  
- Entire graph  
- Entire timeline  
- Entire Life.OS dataset (factory reset)  

Manual deletion is immediate and irreversible.

---

# 9. Deletion Guarantees

When data is deleted:

- It is removed from IndexedDB  
- It is removed from the Life Graph  
- It is removed from the Timeline  
- It is removed from insights  
- It is removed from embeddings  
- It is removed from caches  
- It is removed from sync queue (if enabled)  

### Sync Deletion Guarantee
If sync is enabled:
- Delete operation is queued  
- Backend deletes entity  
- Confirmation returned  
- No ghost data remains  

---

# 10. Retention Engine

The Retention Engine runs periodically:

### Responsibilities
- Check retention rules  
- Identify expired data  
- Delete expired entities  
- Clean up graph edges  
- Clean up timeline events  
- Clean up embeddings  
- Clean up insights  
- Recalculate clusters if needed  

### Schedule
- Runs daily  
- Runs on startup  
- Runs after settings change  

---

# 11. Retention Metadata

### Example Metadata
```
{ deleted_count: 42, last_run: 1712345678901, next_run: 1712432078901, modules_cleaned: ["journal", "notes"], graph_nodes_removed: 12, timeline_events_removed: 30 }
```

---

# 12. Future Enhancements

- Per‑entry privacy levels  
- Encrypted local storage  
- Secure enclave key storage  
- Retention presets (minimal, balanced, archival)  
- Retention analytics dashboard  
- Retention simulation mode (“what will be deleted?”)  

---

# 13. Summary

This appendix defines all data retention rules, auto‑delete policies, strict mode behaviors, and deletion guarantees across Life.OS. By giving users full control over how long their data persists—and ensuring that deletion is complete, transparent, and privacy‑first—Life.OS remains a trustworthy personal operating system for long‑term use.
