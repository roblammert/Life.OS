# APPENDIX_PLUGIN_API_REFERENCE.md  
**Plugin API Reference — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

This appendix defines the complete API surface available to Life.OS plugins. It includes storage APIs, graph APIs, timeline APIs, UI APIs, intelligence APIs, lifecycle hooks, error classes, and permission‑gated capabilities. All APIs are capability‑restricted and sandboxed.

---

# 1. API Design Principles

The Plugin API follows these principles:

- **Capability‑based** — plugins can only call APIs they have explicit permission for.  
- **Sandboxed** — plugins cannot access DOM, IndexedDB, or LLMs directly.  
- **Deterministic** — API behavior is stable across versions.  
- **Asynchronous** — all APIs return Promises.  
- **Structured** — all inputs/outputs follow strict schemas.  
- **Safe** — no plugin can corrupt core data or break the UI.

---

# 2. Storage API

The Storage API provides controlled access to module data.

## Methods

### `storage.get(table, id)`
Retrieve a single record.
```
await storage.get("entries", "entry_123")
```

### `storage.query(table, filters)`
Query records using simple filters.
```
await storage.query("tasks", { status: "open" })
```

### `storage.insert(table, record)`
Insert a new record.
```
await storage.insert("notes", { id: "...", text: "..." })
```

### `storage.update(table, id, updates)`
Update an existing record.
```
await storage.update("entries", "entry_123", { mood: "calm" })
```

### `storage.delete(table, id)`
Delete a record.
```
await storage.delete("tasks", "task_9")
```

## Permissions Required
- `storage.read`  
- `storage.write`  
- `storage.module.<name>` (optional fine‑grained control)

---

# 3. Graph API

The Graph API allows plugins to create nodes, edges, and semantic relationships.

## Methods

### `graph.createNode(node)`
```
await graph.createNode({ id: "fitness_1", type: "fitness_session", metadata: { duration: 45 } })
```

### `graph.createEdge(edge)`
```
await graph.createEdge({ id: "edge_1", type: "improves", source: "habit_1", target: "fitness_1" })
```

### `graph.findNeighbors(id)`
```
await graph.findNeighbors("concept_focus")
```

### `graph.search(query)`
```
await graph.search({ text: "motivation" })
```

## Permissions Required
- `graph.read`  
- `graph.write`  
- `graph.cluster` (optional)

---

# 4. Timeline API

The Timeline API allows plugins to add events and query historical activity.

## Methods

### `timeline.addEvent(event)`
```
await timeline.addEvent({ type: "fitness_session_logged", timestamp: Date.now(), metadata: { duration: 45 } })
```

### `timeline.query(range)`
```
await timeline.query({ start: 1712000000000, end: 1712600000000 })
```

## Permissions Required
- `timeline.read`  
- `timeline.write`

---

# 5. Insights API

Plugins can generate structured insights.

## Methods

### `insights.create(type, content, metadata)`
```
await insights.create( "fitness_insight", "You exercised 3 times this week.", { frequency: 3 } )
```

## Permissions Required
- `insights.generate`

---

# 6. Embeddings API

Plugins may request embeddings for text, but never raw model access.

## Methods

### `embeddings.generate(text)`
```
const vector = await embeddings.generate("This is a sample text.")
```

## Output
- 384–768 dimensional vector  
- Deterministic  

## Permissions Required
- `embeddings.generate`

---

# 7. UI API

Plugins can add panels, commands, and UI elements.

## Methods

### `ui.registerPanel(id, component)`
Registers a sidebar or dashboard panel.
```
ui.registerPanel("fitnessDashboard", FitnessDashboardComponent)
```

### `ui.registerCommand(id, callback)`
Registers a command accessible via command palette.
```
ui.registerCommand("logFitness", () => openLogDialog())
```

### `ui.showPanel(id)`
```
ui.showPanel("fitnessDashboard")
```

## Permissions Required
- `ui.panels`  
- `ui.commands`  
- `ui.shortcuts` (optional)

---

# 8. Settings API

Plugins may read or write their own settings.

## Methods

### `settings.get(key)`
```
await settings.get("fitness.intensityScale")
```

### `settings.set(key, value)`
```
await settings.set("fitness.intensityScale", "1–10")
```

## Permissions Required
- `settings.read`  
- `settings.write`

---

# 9. Retention API

Plugins may define custom retention rules.

## Methods

### `retention.registerRule(rule)`
```
retention.registerRule({ table: "fitness_logs", delete_after_days: 90 })
```

## Permissions Required
- `retention.read`  
- `retention.write` (rare)

---

# 10. Event API

Plugins can subscribe to system and module events.

## Methods

### `events.subscribe(eventType, callback)`
```
events.subscribe("entry_created", (payload) => { console.log("New entry:", payload.id) })
```

### `events.unsubscribe(eventType, callback)`
```
events.unsubscribe("entry_created", handler)
```

## Permissions Required
- None (read‑only event stream)

---

# 11. Plugin Lifecycle Hooks

Plugins may implement lifecycle functions in their entrypoint.

### `onInstall()`
Called once when plugin is installed.

### `onActivate()`
Called when plugin is enabled.

### `onDeactivate()`
Called when plugin is disabled.

### `onUninstall()`
Called before plugin is removed.

### `onEvent(event)`
Called for every event the plugin subscribes to.

---

# 12. Error Classes

Plugins may encounter structured errors.

### Storage Errors
- `StorageNotFoundError`  
- `StoragePermissionError`  
- `StorageValidationError`  

### Graph Errors
- `GraphPermissionError`  
- `GraphInvalidNodeError`  

### Timeline Errors
- `TimelinePermissionError`  

### UI Errors
- `UIRegistrationError`  

### Intelligence Errors
- `EmbeddingPermissionError`  
- `InsightPermissionError`  

---

# 13. Data Contracts

All API inputs/outputs follow strict schemas.

### Node Schema
```
{ id: string, type: string, metadata: object }
```

### Edge Schema
```
{ id: string, type: string, source: string, target: string, metadata: object }
```

### Timeline Event Schema
```
{ type: string, timestamp: number, metadata: object }
```

### Insight Schema
```
{ type: string, content: string, metadata: object }
```

---

# 14. Security Restrictions

Plugins cannot:

- Access the DOM  
- Access IndexedDB directly  
- Access LLMs directly  
- Access raw embeddings  
- Make network requests  
- Load remote code  
- Access other plugins’ data  
- Access system internals  

Plugins must operate entirely within the sandbox.

---

# 15. Summary

This appendix defines the complete Plugin API for Life.OS. Plugins interact with storage, graph, timeline, insights, embeddings, UI, settings, retention, and events through a stable, capability‑restricted API surface. The plugin system is designed for extensibility, safety, and long‑term architectural integrity.