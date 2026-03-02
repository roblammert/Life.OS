# APPENDIX_PLUGIN_PERMISSIONS.md  
**Plugin Permissions Model — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The permissions model defines what plugins are allowed to do. Plugins must explicitly request permissions, and users must approve them before activation.

---

# 1. Permission Philosophy

- Explicit, not implicit  
- Granular, not broad  
- User‑approved, not automatic  
- Capability‑based, not trust‑based  
- Deny‑by‑default  

---

# 2. Permission Categories

## Storage Permissions
- `storage.read`  
- `storage.write`  
- `storage.module.<name>`  

## Graph Permissions
- `graph.read`  
- `graph.write`  
- `graph.cluster`  

## Timeline Permissions
- `timeline.read`  
- `timeline.write`  

## Intelligence Permissions
- `insights.generate`  
- `embeddings.generate`  
- `context.read`  

## UI Permissions
- `ui.panels`  
- `ui.commands`  
- `ui.shortcuts`  

## Settings Permissions
- `settings.read`  
- `settings.write`  

## Retention Permissions
- `retention.read`  
- `retention.write`  

---

# 3. Forbidden Permissions

Plugins may not request:

- Network access  
- Remote code execution  
- Raw LLM access  
- Raw embedding access  
- Access to other plugins  
- Access to system internals  

---

# 4. Permission Request Format
```
{ "permissions": [ "storage.read", "graph.write", "ui.panels" ] }
```

---

# 5. User Approval Flow

1. Plugin requests permissions  
2. Life.OS displays permission dialog  
3. User approves or denies  
4. Plugin activates only if approved  

---

# 6. Permission Enforcement

- Checked at API call time  
- Violations throw structured errors  
- Logged in system logs  

---

# 7. Summary

The permission system ensures plugins operate safely and transparently, with explicit user control and strict capability boundaries.
