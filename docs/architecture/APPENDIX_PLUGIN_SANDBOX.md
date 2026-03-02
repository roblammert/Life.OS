# APPENDIX_PLUGIN_SANDBOX.md  
**Plugin Sandbox Architecture — Life.OS**  
*Part of the Life.OS Architecture Documentation Suite*

The plugin sandbox isolates plugin code from core systems, ensuring privacy, safety, and stability. Plugins run in a restricted environment with no direct access to the DOM, IndexedDB, LLMs, or system internals.

---

# 1. Sandbox Goals

- Prevent plugins from accessing sensitive data  
- Prevent plugins from breaking core modules  
- Provide a safe execution environment  
- Enforce capability‑based permissions  
- Maintain deterministic behavior  
- Support long‑term stability and versioning  

---

# 2. Sandbox Execution Model

Plugins run inside a **dedicated JavaScript sandbox** with:

- No `window` access  
- No `document` access  
- No `fetch` or network access  
- No direct storage access  
- No direct LLM access  
- No access to other plugins  

The sandbox exposes only the **Plugin API**, filtered by permissions.

---

# 3. Isolation Boundaries

### Memory Isolation
- Plugins cannot access global variables  
- Plugins cannot modify shared state  
- Plugins cannot access core module memory  

### Storage Isolation
- No direct IndexedDB access  
- All storage operations go through permission‑checked API calls  

### Execution Isolation
- Each plugin runs in its own context  
- Crashes do not affect other plugins  
- Infinite loops are terminated  

### UI Isolation
- Plugins cannot modify the DOM  
- Plugins cannot inject scripts  
- Plugins cannot modify core UI  

---

# 4. Allowed Capabilities

Plugins may access:

- Storage API  
- Graph API  
- Timeline API  
- Insights API  
- Embeddings API  
- UI API  
- Settings API  
- Retention API  
- Event API  

Only if permissions are granted.

---

# 5. Forbidden Capabilities

Plugins may not:

- Access the network  
- Load remote code  
- Access raw embeddings  
- Access LLMs directly  
- Access system internals  
- Access other plugins  
- Access the DOM  
- Access browser APIs directly  

---

# 6. Sandbox API Injection

The sandbox injects a restricted API object:
```
const lifeOS = { storage, graph, timeline, insights, embeddings, ui, settings, retention, events }
```

Plugins cannot access anything outside this object.

---

# 7. Error Containment

- Plugin errors are caught and logged  
- Plugin crashes do not affect core modules  
- Plugin exceptions do not propagate  
- Plugin timeouts are enforced  

---

# 8. Resource Limits

- CPU time limits  
- Memory limits  
- Execution timeouts  
- Event rate limits  

---

# 9. Sandbox Versioning

Each Life.OS release includes:

- A stable API version  
- A compatibility layer for older plugins  
- A deprecation schedule  

---

# 10. Summary

The plugin sandbox ensures plugins remain safe, isolated, and predictable. It enforces strict boundaries while enabling powerful extensions through a controlled API surface.
